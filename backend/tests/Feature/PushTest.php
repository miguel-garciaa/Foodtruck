<?php

namespace Tests\Feature;

use App\Models\OutboxEvent;
use App\Models\User;
use App\Services\OutboxDelivery;
use App\Services\Sessions;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Tests\PostgresTestCase;

class PushTest extends PostgresTestCase
{
    public function test_push_contains_an_account_binding_and_unregisters_invalid_tokens(): void
    {
        $user = User::factory()->create(['push_enabled' => true]);
        $session = DB::transaction(fn () => app(Sessions::class)->issue($user));
        $installation = (string) Str::uuid();
        $token = str_repeat('synthetic-fcm-', 10);
        $this->withToken($session['accessToken'])->putJson('/api/v1/me/devices', ['installationId' => $installation, 'token' => $token, 'platform' => 'android', 'environment' => 'dev'])->assertNoContent();
        Cache::put('fcm:dev:access', 'synthetic-google-access', 60);
        Http::preventStrayRequests();
        Http::fake(['fcm.googleapis.com/*' => Http::response(['error' => ['details' => [['errorCode' => 'UNREGISTERED']]]], 404)]);
        $event = OutboxEvent::record($user->id, 'push', ['installationId' => $installation]);
        app(OutboxDelivery::class)->send($event);
        Http::assertSent(fn ($request) => $request['message']['token'] === $token && $request['message']['data']['userId'] === $user->id && $request['message']['data']['eventId'] === $event->id && ! str_contains($request['message']['notification']['body'], $user->email));
        $this->assertDatabaseCount('devices', 0);
    }

    public function test_logout_prevents_an_already_queued_event_from_using_the_device(): void
    {
        $user = User::factory()->create(['push_enabled' => true]);
        $session = DB::transaction(fn () => app(Sessions::class)->issue($user));
        $installation = (string) Str::uuid();
        $this->withToken($session['accessToken'])->putJson('/api/v1/me/devices', ['installationId' => $installation, 'token' => str_repeat('synthetic-fcm-', 10), 'platform' => 'android', 'environment' => 'dev'])->assertNoContent();
        $event = OutboxEvent::record($user->id, 'push', ['installationId' => $installation]);
        $this->postJson('/api/v1/auth/logout')->assertNoContent();
        Http::preventStrayRequests();
        Http::fake();
        app(OutboxDelivery::class)->send($event);
        Http::assertNothingSent();
        $this->assertDatabaseCount('devices', 0);
    }
}
