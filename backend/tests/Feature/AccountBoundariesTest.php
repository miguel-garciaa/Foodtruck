<?php

namespace Tests\Feature;

use App\Models\FoodTruck;
use App\Models\OutboxEvent;
use App\Models\User;
use App\Services\Sessions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Tests\PostgresTestCase;

class AccountBoundariesTest extends PostgresTestCase
{
    private function login(User $user): void
    {
        app('auth')->forgetGuards();
        $session = DB::transaction(fn () => app(Sessions::class)->issue($user));
        $this->withToken($session['accessToken']);
    }

    public function test_invalid_credentials_and_payloads_do_not_create_accounts(): void
    {
        $this->postJson('/api/v1/auth/register', ['email' => 'bad', 'password' => 'short'])->assertUnprocessable();
        $this->postJson('/api/v1/auth/login', ['email' => 'absent@example.test', 'password' => 'synthetic long password'])->assertUnauthorized();
        $this->postJson('/api/v1/auth/refresh', ['token' => str_repeat('x', 64)])->assertUnauthorized();
        $this->assertDatabaseCount('users', 0);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_reset_is_private_single_use_and_revokes_every_session(): void
    {
        $user = User::factory()->create(['email' => 'reset@example.test']);
        config(['foodtrucks.email_enabled' => true, 'foodtrucks.email_allowlist' => ['reset@example.test', 'absent@example.test']]);
        $this->login($user);
        $expected = $this->postJson('/api/v1/auth/password/forgot', ['email' => $user->email])->assertAccepted()->json();
        $this->postJson('/api/v1/auth/password/forgot', ['email' => 'absent@example.test'])->assertAccepted()->assertExactJson($expected);
        $event = OutboxEvent::where('kind', 'reset_password')->firstOrFail();
        $body = ['email' => $user->email, 'token' => $event->payload['token'], 'password' => 'new synthetic password'];
        $this->postJson('/api/v1/auth/password/reset', $body)->assertOk();
        $this->assertTrue(Hash::check($body['password'], $user->refresh()->password));
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->postJson('/api/v1/auth/password/reset', $body)->assertBadRequest();
    }

    public function test_wrong_current_password_preserves_session_and_logout_revokes_it(): void
    {
        $user = User::factory()->create();
        $this->login($user);
        $this->postJson('/api/v1/me/password', ['currentPassword' => 'wrong synthetic password', 'password' => 'new synthetic password'])->assertForbidden();
        $this->getJson('/api/v1/me')->assertOk();
        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        app('auth')->forgetGuards();
        $this->getJson('/api/v1/me')->assertUnauthorized();
    }

    public function test_favorites_are_idempotent_private_and_require_published_resources(): void
    {
        $owner = User::factory()->create();
        $truck = new FoodTruck;
        $truck->forceFill(['owner_id' => $owner->id, 'draft' => [], 'published' => ['name' => 'Synthetic'], 'version' => 1, 'status' => 'published'])->save();
        $this->login($owner);
        $this->putJson('/api/v1/me/favorites/'.$truck->id)->assertNoContent();
        $this->putJson('/api/v1/me/favorites/'.$truck->id)->assertNoContent();
        $this->assertDatabaseCount('favorites', 1);
        $this->putJson('/api/v1/me/favorites/'.Str::uuid())->assertNotFound();
        $this->login(User::factory()->create());
        $this->getJson('/api/v1/me/favorites')->assertExactJson(['items' => []]);
        $this->deleteJson('/api/v1/me/favorites/'.$truck->id)->assertNoContent();
        $this->assertDatabaseCount('favorites', 1);
        $this->login($owner);
        $this->deleteJson('/api/v1/me/favorites/'.$truck->id)->assertNoContent();
        $this->assertDatabaseCount('favorites', 0);
        $truck->forceFill(['status' => 'archived'])->save();
        $this->putJson('/api/v1/me/favorites/'.$truck->id)->assertNotFound();
    }

    public function test_device_consent_limits_ownership_and_missing_provider(): void
    {
        $user = User::factory()->create(['push_enabled' => false]);
        $this->login($user);
        $device = ['installationId' => (string) Str::uuid(), 'token' => str_repeat('synthetic-token-', 5), 'platform' => 'android', 'environment' => 'dev'];
        $this->putJson('/api/v1/me/devices', $device)->assertConflict();
        $user->forceFill(['push_enabled' => true])->save();
        $this->login($user);
        $this->putJson('/api/v1/me/devices', $device)->assertNoContent();
        $this->putJson('/api/v1/me/devices', $device)->assertNoContent();
        $this->assertDatabaseCount('devices', 1);
        $row = DB::table('devices')->first();
        $this->assertStringNotContainsString($device['token'], $row->token_cipher);
        foreach ([2, 3] as $index) {
            $this->putJson('/api/v1/me/devices', ['installationId' => (string) Str::uuid(), 'token' => $device['token'].$index] + $device)->assertNoContent();
        }
        $this->putJson('/api/v1/me/devices', ['installationId' => (string) Str::uuid(), 'token' => $device['token'].'4'] + $device)->assertConflict();
        $this->putJson('/api/v1/me/devices', ['environment' => 'prod'] + $device)->assertUnprocessable();
        config(['foodtrucks.fcm_credentials' => '/nonexistent/synthetic-credentials.json']);
        $this->postJson('/api/v1/me/devices/test', ['installationId' => $device['installationId']])->assertServiceUnavailable();
        $this->assertDatabaseCount('outbox_events', 0);
        $this->login(User::factory()->create());
        $this->deleteJson('/api/v1/me/devices', ['installationId' => $device['installationId']])->assertNoContent();
        $this->assertDatabaseCount('devices', 3);
        $this->login($user);
        $this->putJson('/api/v1/me', ['displayName' => 'Synthetic', 'avatarId' => null, 'mode' => 'client', 'pushEnabled' => false])->assertOk();
        $this->assertDatabaseCount('devices', 0);
    }

    public function test_upload_reencodes_images_and_hides_unpublished_files_from_other_users(): void
    {
        Storage::fake('local');
        $owner = User::factory()->create();
        $this->login($owner);
        $this->call('POST', '/api/v1/me/media', [], [], [], ['CONTENT_TYPE' => 'image/jpeg', 'HTTP_ACCEPT' => 'application/json'], '<script>synthetic</script>')->assertUnprocessable();
        $image = imagecreatetruecolor(2, 2);
        ob_start();
        imagepng($image);
        $bytes = ob_get_clean();
        $response = $this->call('POST', '/api/v1/me/media', [], [], [], ['CONTENT_TYPE' => 'image/png', 'HTTP_ACCEPT' => 'application/json'], $bytes)->assertCreated();
        $id = $response->json('id');
        Storage::disk('local')->assertExists('media/'.$id.'.jpg');
        $this->getJson('/api/v1/media/'.$id)->assertOk()->assertHeader('X-Content-Type-Options', 'nosniff');
        $this->login(User::factory()->create());
        $this->getJson('/api/v1/media/'.$id)->assertNotFound();
        $this->putJson('/api/v1/me', ['displayName' => 'Synthetic', 'avatarId' => $id, 'mode' => 'client', 'pushEnabled' => false])->assertUnprocessable();
        $this->login(User::factory()->unverified()->create());
        $this->call('POST', '/api/v1/me/media', [], [], [], ['HTTP_ACCEPT' => 'application/json'], $bytes)->assertForbidden();
    }

    public function test_google_provider_failure_does_not_create_identity_or_leak_response(): void
    {
        config(['foodtrucks.google_client_id' => 'synthetic-client']);
        Http::preventStrayRequests();
        Http::fake(['*' => Http::response(['error' => 'synthetic provider failure'], 503)]);
        $challenge = $this->postJson('/api/v1/auth/google/challenge')->assertOk()->json();
        $response = $this->postJson('/api/v1/auth/google', ['challengeId' => $challenge['challengeId'], 'idToken' => str_repeat('x', 64)]);
        $this->assertContains($response->status(), [401, 503]);
        $this->assertStringNotContainsString('synthetic provider failure', $response->getContent());
        $this->assertDatabaseCount('auth_identities', 0);
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }
}
