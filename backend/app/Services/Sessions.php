<?php

namespace App\Services;

use App\Models\AuthSession;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class Sessions
{
    /** Call inside a transaction and while holding the user's row lock. */
    public function issue(User $user, ?string $family = null): array
    {
        $refresh = Str::random(64);
        $session = AuthSession::create(['user_id' => $user->id, 'family' => $family ?? (string) Str::uuid(), 'refresh_hash' => hash('sha256', $refresh), 'expires_at' => now()->addDays(30)]);
        $access = $user->createToken('android-dev', ['account'], now()->addMinutes(15));
        $session->update(['access_token_id' => $access->accessToken->id]);

        return ['accessToken' => $access->plainTextToken, 'refreshToken' => $refresh, 'expiresIn' => 900];
    }

    public function revoke(string $userId, ?string $family = null): void
    {
        $query = AuthSession::where('user_id', $userId);
        if ($family !== null) {
            $query->where('family', $family);
        }
        $sessions = $query->get(['id', 'access_token_id']);
        PersonalAccessToken::whereIn('id', $sessions->pluck('access_token_id'))->delete();
        DB::table('devices')->where('user_id', $userId)->whereIn('session_id', $sessions->pluck('id'))->delete();
        $query->update(['revoked_at' => now()]);
    }
}
