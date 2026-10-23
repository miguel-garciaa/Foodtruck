<?php

namespace Tests\Feature;

use App\Models\AuthSession;
use App\Models\OutboxEvent;
use App\Models\User;
use App\Services\Sessions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\PostgresTestCase;

class AccountsTest extends PostgresTestCase
{
    public function test_registration_verification_and_duplicate_email_are_private(): void
    {
        config(['foodtrucks.email_enabled' => true, 'foodtrucks.email_allowlist' => ['person@example.test']]);
        $body = ['displayName' => 'Persona', 'email' => 'PERSON@example.test', 'password' => 'a long synthetic password'];
        $response = $this->postJson('/api/v1/auth/register', $body)->assertAccepted()->json();
        $this->postJson('/api/v1/auth/register', $body)->assertAccepted()->assertExactJson($response);
        $this->assertDatabaseCount('users', 1);
        $event = OutboxEvent::firstOrFail();
        $this->assertStringNotContainsString($event->payload['token'], $event->getRawOriginal('payload'));
        $this->postJson('/api/v1/auth/email/verify', ['token' => $event->payload['token']])->assertOk();
        $this->postJson('/api/v1/auth/email/verify', ['token' => $event->payload['token']])->assertBadRequest();
        $this->assertTrue(User::firstOrFail()->hasVerifiedEmail());
    }

    public function test_refresh_replay_revokes_the_entire_session_family(): void
    {
        $user = User::factory()->create(['password' => Hash::make('a long synthetic password')]);
        $session = $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'a long synthetic password'])->assertOk()->json();
        $next = $this->postJson('/api/v1/auth/refresh', ['token' => $session['refreshToken']])->assertOk()->json();
        $this->assertNotSame($session['accessToken'], $next['accessToken']);
        $this->postJson('/api/v1/auth/refresh', ['token' => $session['refreshToken']])->assertUnauthorized();
        $this->withToken($next['accessToken'])->getJson('/api/v1/me')->assertUnauthorized();
        $this->assertSame(0, AuthSession::whereNull('revoked_at')->count());
    }

    public function test_password_change_revokes_sessions_and_registered_devices(): void
    {
        $user = User::factory()->create(['password' => Hash::make('a long synthetic password'), 'push_enabled' => true]);
        $session = DB::transaction(fn () => app(Sessions::class)->issue($user));
        $this->withToken($session['accessToken'])->putJson('/api/v1/me/devices', ['installationId' => fake()->uuid(), 'token' => str_repeat('synthetic-fcm-', 10), 'platform' => 'android', 'environment' => 'dev'])->assertNoContent();
        $this->withToken($session['accessToken'])->postJson('/api/v1/me/password', ['currentPassword' => 'a long synthetic password', 'password' => 'a different synthetic password'])->assertNoContent();
        $this->assertDatabaseCount('devices', 0);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
