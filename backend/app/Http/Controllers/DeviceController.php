<?php

namespace App\Http\Controllers;

use App\Models\AuthSession;
use App\Models\OutboxEvent;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;

class DeviceController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate(['installationId' => ['required', 'uuid'], 'token' => ['required', 'string', 'between:20,4096'], 'platform' => ['required', 'in:android'], 'environment' => ['required', 'in:dev']]);
        DB::transaction(function () use ($request, $data) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            abort_unless($user->push_enabled, 409, 'Activa las notificaciones en tus preferencias.');
            abort_if(DB::table('devices')->where('user_id', $user->id)->where('installation_id', '<>', $data['installationId'])->count() >= 3, 409, 'El límite DEV es de tres dispositivos por cuenta.');
            $session = AuthSession::where('user_id', $user->id)->where('access_token_id', $request->user()->currentAccessToken()->id)->whereNull('revoked_at')->where('expires_at', '>', now())->firstOrFail();
            $hash = hash('sha256', $data['token']);
            DB::table('devices')->where('token_hash', $hash)->where('installation_id', '<>', $data['installationId'])->delete();
            DB::table('devices')->updateOrInsert(['installation_id' => $data['installationId']], ['user_id' => $user->id, 'session_id' => $session->id, 'token_cipher' => Crypt::encryptString($data['token']), 'token_hash' => $hash, 'environment' => 'dev', 'created_at' => now(), 'updated_at' => now()]);
        });

        return response()->noContent();
    }

    public function delete(Request $request)
    {
        $data = $request->validate(['installationId' => ['required', 'uuid']]);
        DB::table('devices')->where('installation_id', $data['installationId'])->where('user_id', $request->user()->id)->delete();

        return response()->noContent();
    }

    public function test(Request $request)
    {
        $data = $request->validate(['installationId' => ['required', 'uuid']]);
        abort_unless(is_file(config('foodtrucks.fcm_credentials') ?? ''), 503);
        abort_unless(DB::table('devices')->where('installation_id', $data['installationId'])->where('user_id', $request->user()->id)->exists(), 404);
        OutboxEvent::record($request->user()->id, 'push', ['installationId' => $data['installationId']], 10);

        return response()->json(['message' => 'Prueba encolada para tu dispositivo.'], 202);
    }
}
