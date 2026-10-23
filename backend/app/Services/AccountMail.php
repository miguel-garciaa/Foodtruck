<?php

namespace App\Services;

use App\Models\OutboxEvent;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AccountMail
{
    public function assertEnabled(string $email): void
    {
        abort_unless(config('foodtrucks.email_enabled') && in_array($email, config('foodtrucks.email_allowlist'), true), 503, 'El correo DEV todavía no está disponible para esta dirección.');
    }

    public function verification(User $user): void
    {
        $token = Str::random(64);
        DB::table('verification_tokens')->where('user_id', $user->id)->whereNull('consumed_at')->update(['consumed_at' => now()]);
        DB::table('verification_tokens')->insert(['hash' => hash('sha256', $token), 'user_id' => $user->id, 'expires_at' => now()->addDay()]);
        OutboxEvent::record($user->id, 'verify_email', ['token' => $token], 1440);
    }
}
