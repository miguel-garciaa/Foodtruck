<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthRequest;
use App\Models\AuthSession;
use App\Models\OutboxEvent;
use App\Models\User;
use App\Services\AccountMail;
use App\Services\Sessions;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    public function register(AuthRequest $request, AccountMail $mail)
    {
        $data = $request->validated();
        $mail->assertEnabled($data['email']);
        // Hash before checking existence to keep both registration paths comparable.
        $hash = Hash::make($data['password']);
        try {
            DB::transaction(function () use ($data, $hash, $mail) {
                if (! User::where('email', $data['email'])->exists()) {
                    $user = User::create(['name' => $data['displayName'], 'email' => $data['email'], 'password' => $hash]);
                    $mail->verification($user);
                }
            });
        } catch (QueryException $exception) {
            if ($exception->getCode() !== '23505') {
                throw $exception;
            }
        }

        return response()->json(['message' => 'Si el registro es posible, recibirás un correo de verificación.'], 202);
    }

    public function login(AuthRequest $request, Sessions $sessions)
    {
        $data = $request->validated();

        return DB::transaction(function () use ($data, $sessions) {
            $user = User::where('email', $data['email'])->lockForUpdate()->first();
            // A fixed valid Argon2id hash also makes unknown accounts perform a password check.
            $valid = Hash::check($data['password'], $user->password ?? '$argon2id$v=19$m=65536,t=4,p=1$NXhqV0ZuTnJhbGxKakVWMQ$vuOvmjBzTj9cPjP3tIh0XlMlhxX9wRzFjB8xIeZrgT4');
            abort_unless($user && $user->password && $valid, 401, 'Correo o contraseña incorrectos.');

            return response()->json($sessions->issue($user));
        });
    }

    public function refresh(AuthRequest $request, Sessions $sessions)
    {
        $hash = hash('sha256', $request->validated('token'));
        $known = AuthSession::where('refresh_hash', $hash)->first();
        abort_unless($known !== null, 401, 'Sesión caducada.');
        // Commit revocation on replay before returning the error; throwing inside would roll it back.
        $result = DB::transaction(function () use ($known, $hash, $sessions) {
            $user = User::whereKey($known->user_id)->lockForUpdate()->firstOrFail();
            $old = AuthSession::where('refresh_hash', $hash)->lockForUpdate()->firstOrFail();
            if ($old->revoked_at || $old->expires_at->isPast()) {
                $sessions->revoke($user->id, $old->family);

                return null;
            }
            PersonalAccessToken::whereKey($old->access_token_id)->delete();
            $old->update(['revoked_at' => now()]);
            $response = $sessions->issue($user, $old->family);
            $current = AuthSession::where('refresh_hash', hash('sha256', $response['refreshToken']))->firstOrFail();
            DB::table('devices')->where('session_id', $old->id)->update(['session_id' => $current->id]);

            return $response;
        });
        abort_unless($result !== null, 401, 'Sesión caducada.');

        return response()->json($result);
    }

    public function logout(Request $request, Sessions $sessions)
    {
        DB::transaction(function () use ($request, $sessions) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $session = AuthSession::where('user_id', $user->id)->where('access_token_id', $request->user()->currentAccessToken()->id)->first();
            if ($session) {
                $sessions->revoke($user->id, $session->family);
            }
        });

        return response()->noContent();
    }

    public function verify(AuthRequest $request)
    {
        $hash = hash('sha256', $request->validated('token'));
        $known = DB::table('verification_tokens')->where('hash', $hash)->first();
        abort_unless($known !== null, 400, 'Enlace inválido o caducado.');
        DB::transaction(function () use ($known, $hash) {
            $user = User::whereKey($known->user_id)->lockForUpdate()->firstOrFail();
            $token = DB::table('verification_tokens')->where('hash', $hash)->lockForUpdate()->first();
            abort_if($token->consumed_at || now()->greaterThan($token->expires_at), 400, 'Enlace inválido o caducado.');
            $user->markEmailAsVerified();
            DB::table('verification_tokens')->where('hash', $hash)->update(['consumed_at' => now()]);
        });

        return response()->json(['message' => 'Correo verificado. Ya puedes iniciar sesión.']);
    }

    public function resend(AuthRequest $request, AccountMail $mail)
    {
        $email = $request->validated('email');
        $mail->assertEnabled($email);
        DB::transaction(function () use ($email, $mail) {
            $user = User::where('email', $email)->lockForUpdate()->first();
            if ($user && ! $user->hasVerifiedEmail()) {
                $mail->verification($user);
            }
        });

        return response()->json(['message' => 'Si procede, recibirás un nuevo enlace.'], 202);
    }

    public function forgot(AuthRequest $request, AccountMail $mail)
    {
        $email = $request->validated('email');
        $mail->assertEnabled($email);
        Password::sendResetLink(['email' => $email], function (User $user, string $token) {
            OutboxEvent::record($user->id, 'reset_password', ['token' => $token], 60);
        });

        return response()->json(['message' => 'Si procede, recibirás un enlace de recuperación.'], 202);
    }

    public function reset(AuthRequest $request, Sessions $sessions)
    {
        $data = $request->validated();
        $status = DB::transaction(function () use ($data, $sessions) {
            $user = User::where('email', $data['email'])->lockForUpdate()->first();
            if (! $user) {
                return Password::INVALID_TOKEN;
            }

            return Password::reset($data + ['password_confirmation' => $data['password']], function (User $user, string $password) use ($sessions) {
                $user->forceFill(['password' => Hash::make($password)])->save();
                $sessions->revoke($user->id);
            });
        });
        abort_unless($status === Password::PASSWORD_RESET, 400, 'Enlace inválido o caducado.');

        return response()->json(['message' => 'Contraseña actualizada. Inicia sesión de nuevo.']);
    }

    public function password(AuthRequest $request, Sessions $sessions)
    {
        DB::transaction(function () use ($request, $sessions) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            abort_unless($user->password && Hash::check($request->validated('currentPassword'), $user->password), 403, 'Contraseña actual incorrecta.');
            $user->forceFill(['password' => Hash::make($request->validated('password'))])->save();
            $sessions->revoke($user->id);
        });

        return response()->noContent();
    }
}
