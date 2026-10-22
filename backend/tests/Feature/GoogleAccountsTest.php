<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\GoogleIdentity;
use Tests\PostgresTestCase;

class GoogleAccountsTest extends PostgresTestCase
{
    private function identity(string $email): array
    {
        config(['foodtrucks.google_client_id' => 'synthetic-client.apps.googleusercontent.com']);
        $challenge = $this->postJson('/api/v1/auth/google/challenge')->assertOk()->json();
        $verifier = $this->createMock(GoogleIdentity::class);
        $verifier->method('verify')->willReturn((object) ['sub' => 'synthetic-google-subject', 'email' => $email, 'email_verified' => true, 'nonce' => $challenge['nonce'], 'name' => 'Persona']);
        $this->app->instance(GoogleIdentity::class, $verifier);

        return ['challengeId' => $challenge['challengeId'], 'idToken' => 'synthetic-signed-token'];
    }

    public function test_google_does_not_verify_an_external_email_without_a_hosted_domain(): void
    {
        $body = $this->identity('person@example.test');
        $session = $this->postJson('/api/v1/auth/google', $body)->assertOk()->json();
        $this->withToken($session['accessToken'])->getJson('/api/v1/me')->assertOk()->assertJsonPath('emailVerified', false);
        $this->postJson('/api/v1/auth/google', $body)->assertUnauthorized();
        $this->assertDatabaseCount('auth_identities', 1);
    }

    public function test_google_gmail_identity_is_verified(): void
    {
        $body = $this->identity('synthetic-person@gmail.com');
        $this->postJson('/api/v1/auth/google', $body)->assertOk();
        $this->assertTrue(User::firstOrFail()->hasVerifiedEmail());
    }

    public function test_a_conflict_never_merges_by_email_or_consumes_the_challenge(): void
    {
        User::factory()->create(['email' => 'person@example.test']);
        $body = $this->identity('person@example.test');
        $this->postJson('/api/v1/auth/google', $body)->assertConflict();
        $this->assertDatabaseCount('users', 1);
        $this->assertDatabaseCount('auth_identities', 0);
        $this->assertDatabaseHas('google_challenges', ['id' => $body['challengeId'], 'consumed_at' => null]);
    }
}
