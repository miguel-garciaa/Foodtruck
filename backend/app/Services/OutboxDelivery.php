<?php

namespace App\Services;

use App\Models\OutboxEvent;
use App\Models\User;
use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Auth\HttpHandler\HttpHandlerFactory;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class OutboxDelivery
{
    public function send(OutboxEvent $event): void
    {
        $user = User::findOrFail($event->user_id);
        $payload = $event->payload;
        if ($event->kind === 'push') {
            $this->push($event, $user, $payload);

            return;
        }
        app(AccountMail::class)->assertEnabled($user->email);
        if ($event->kind === 'verify_email' && $user->hasVerifiedEmail()) {
            return;
        }
        $verify = $event->kind === 'verify_email';
        $action = $verify ? 'Verifica tu correo' : 'Recupera tu contraseña';
        $link = config('foodtrucks.native_url').'?'.http_build_query(['action' => $verify ? 'verify' : 'reset', 'token' => $payload['token'], 'email' => $user->email], '', '&', PHP_QUERY_RFC3986);
        Mail::raw($action." en Foodtrucks DEV:\n\n".$link."\n\nSi no lo has solicitado, ignora este mensaje.", fn ($message) => $message->to($user->email)->subject($action.' · Foodtrucks DEV'));
    }

    private function push(OutboxEvent $event, User $user, array $payload): void
    {
        if (! $user->push_enabled) {
            return;
        }
        $devices = DB::table('devices')->join('auth_sessions', 'devices.session_id', '=', 'auth_sessions.id')->where('devices.user_id', $user->id)->where('devices.environment', 'dev')->whereNull('auth_sessions.revoked_at')->where('auth_sessions.expires_at', '>', now())->when($payload['installationId'] ?? null, fn ($query, $id) => $query->where('devices.installation_id', $id))->select('devices.*')->get();
        if ($devices->isEmpty()) {
            return;
        }
        $access = Cache::remember('fcm:dev:access', 3000, function () {
            $credentials = new ServiceAccountCredentials('https://www.googleapis.com/auth/firebase.messaging', config('foodtrucks.fcm_credentials'));
            $token = $credentials->fetchAuthToken(HttpHandlerFactory::build(new Client(['timeout' => 8, 'connect_timeout' => 3])));
            if (! isset($token['access_token'])) {
                throw new \RuntimeException('FCM no disponible.');
            }

            return $token['access_token'];
        });
        foreach ($devices as $device) {
            $active = DB::table('devices')->join('auth_sessions', 'devices.session_id', '=', 'auth_sessions.id')->join('users', 'devices.user_id', '=', 'users.id')->where('installation_id', $device->installation_id)->where('token_hash', $device->token_hash)->where('devices.user_id', $user->id)->where('users.push_enabled', true)->whereNull('auth_sessions.revoked_at')->where('auth_sessions.expires_at', '>', now())->exists();
            if (! $active) {
                continue;
            }
            $response = Http::withToken($access)->connectTimeout(3)->timeout(8)->post('https://fcm.googleapis.com/v1/projects/'.config('foodtrucks.fcm_project').'/messages:send', ['message' => ['token' => Crypt::decryptString($device->token_cipher), 'notification' => ['title' => 'Foodtrucks', 'body' => 'Tienes una actualización en tu cuenta.'], 'data' => ['eventId' => $event->id, 'userId' => $user->id, 'truckId' => $payload['truckId'] ?? ''], 'android' => ['ttl' => '600s', 'notification' => ['channel_id' => 'account', 'tag' => $event->id]]]]);
            $invalid = collect($response->json('error.details', []))->contains(fn ($detail) => ($detail['errorCode'] ?? '') === 'UNREGISTERED');
            if ($invalid) {
                DB::table('devices')->where('installation_id', $device->installation_id)->where('token_hash', $device->token_hash)->delete();
            } elseif (! $response->successful()) {
                if ($response->status() === 401) {
                    Cache::forget('fcm:dev:access');
                }
                throw new \RuntimeException('Envío FCM no completado.');
            }
        }
    }
}
