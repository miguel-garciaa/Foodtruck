<?php

namespace Tests\Feature;

use Tests\TestCase;

class BoundaryTest extends TestCase
{
    public function test_private_endpoints_require_a_session(): void
    {
        $this->getJson('/api/v1/me')->assertUnauthorized()->assertJsonPath('code', 'unauthorized');
        $this->getJson('/api/v1/merchant/foodtrucks')->assertUnauthorized();
        $this->get('/api/v1/me')->assertUnauthorized()->assertJsonPath('code', 'unauthorized');
    }

    public function test_health_supports_both_http_and_json_clients(): void
    {
        $this->get('/up')->assertOk();
        $this->getJson('/up')->assertOk()->assertJsonPath('status', 'up');
    }

    public function test_trusted_internal_proxy_preserves_public_https_urls(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '172.18.0.10'])
            ->withHeaders(['X-Forwarded-Proto' => 'https', 'X-Forwarded-For' => '203.0.113.20'])
            ->getJson('http://api-dev.foodtruck.bid/up')->assertOk();
        $this->assertSame('https://api-dev.foodtruck.bid/api/v1/foodtrucks', url('/api/v1/foodtrucks'));
        $this->assertSame('203.0.113.20', request()->ip());
    }

    public function test_external_clients_cannot_spoof_proxy_headers(): void
    {
        $this->withServerVariables(['REMOTE_ADDR' => '203.0.113.21'])
            ->withHeaders(['X-Forwarded-Proto' => 'https', 'X-Forwarded-For' => '203.0.113.22'])
            ->getJson('http://api-dev.foodtruck.bid/up')->assertOk();
        $this->assertSame('http://api-dev.foodtruck.bid/api/v1/foodtrucks', url('/api/v1/foodtrucks'));
        $this->assertSame('203.0.113.21', request()->ip());
    }

    public function test_runtime_rejects_unknown_hosts(): void
    {
        $this->app['env'] = 'dev';
        $this->getJson('http://untrusted.example/api/v1/me')->assertStatus(400);
    }

    public function test_input_errors_have_a_stable_api_shape(): void
    {
        $this->postJson('/api/v1/auth/register', ['email' => 'wrong', 'password' => 'short'])->assertUnprocessable()->assertJsonValidationErrors(['displayName', 'email', 'password'])->assertJsonPath('code', 'validation');
        $this->getJson('/api/v1/foodtrucks?minPriceCents=300&maxPriceCents=200')->assertUnprocessable();
        $this->getJson('/api/v1/foodtrucks?bbox=wrong')->assertUnprocessable();
    }

    public function test_unconfigured_providers_fail_explicitly(): void
    {
        $this->postJson('/api/v1/auth/register', ['displayName' => 'Prueba', 'email' => 'test@example.test', 'password' => 'only a synthetic test password'])->assertServiceUnavailable();
        $this->postJson('/api/v1/auth/google/challenge')->assertServiceUnavailable();
    }
}
