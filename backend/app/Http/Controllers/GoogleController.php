<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Models\User;
use App\Services\GoogleIdentity;
use App\Services\Sessions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class GoogleController extends Controller
{
    public function challenge()
    {
        abort_unless(config('foodtrucks.google_client_id'), 503);
        $id = (string) Str::uuid();
        $nonce = Str::random(64);
        DB::table('google_challenges')->insert(['id' => $id, 'nonce_hash' => hash('sha256', $nonce), 'expires_at' => now()->addMinutes(5)]);

        return response()->json(['challengeId' => $id, 'nonce' => $nonce]);
    }

    public function login(AuthRequest $request, GoogleIdentity $google, Sessions $sessions)
    {
        $claims = $google->verify($request->validated('idToken'));

        return DB::transaction(function () use ($request, $claims, $sessions) {
            $challenge = DB::table('google_challenges')->where('id', $request->validated('challengeId'))->lockForUpdate()->first();
            abort_unless($challenge && ! $challenge->consumed_at && now()->lessThan($challenge->expires_at) && hash_equals($challenge->nonce_hash, hash('sha256', $claims->nonce)), 401, 'Identificación caducada o reutilizada.');
            DB::table('google_challenges')->where('id', $challenge->id)->update(['consumed_at' => now()]);
            // Serialize first-time sign-ins for this provider subject without locking other accounts.
            DB::select('SELECT pg_advisory_xact_lock(hashtextextended(?, 0))', ['google:'.$claims->sub]);
            $identity = DB::table('auth_identities')->where('provider', 'google')->where('subject', $claims->sub)->first();
            $linking = $request->routeIs('auth.google.link');
            if ($linking) {
                $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
                abort_unless($user->hasVerifiedEmail(), 403, 'Verifica primero tu correo.');
                abort_if($identity && $identity->user_id !== $user->id, 409, 'Esta identidad ya está vinculada a otra cuenta.');
            } elseif ($identity) {
                $user = User::whereKey($identity->user_id)->lockForUpdate()->firstOrFail();
            } else {
                $email = mb_strtolower($claims->email);
                // Never merge accounts solely because a provider returns a matching email.
                abort_if(User::where('email', $email)->exists(), 409, 'Inicia sesión con tu cuenta y vincula Google desde Seguridad.');
                $user = User::create(['name' => mb_substr($claims->name ?? 'Foodtrucks', 0, 100), 'email' => $email, 'password' => null]);
                $user->markEmailAsVerified();
            }
            if (! $identity) {
                DB::table('auth_identities')->insert(['user_id' => $user->id, 'provider' => 'google', 'subject' => $claims->sub]);
            }

            return $linking ? response()->json(['message' => 'Google vinculado.']) : response()->json($sessions->issue($user));
        });
    }
}
