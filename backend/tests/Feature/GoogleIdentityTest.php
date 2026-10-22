<?php

namespace Tests\Feature;

use App\Services\GoogleIdentity;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Http;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Tests\TestCase;

class GoogleIdentityTest extends TestCase
{
    private \OpenSSLAsymmetricKey $key;

    private array $claims;

    private ?int $previousTimestamp;

    private int $previousLeeway;

    protected function setUp(): void
    {
        parent::setUp();
        $this->previousTimestamp = JWT::$timestamp;
        $this->previousLeeway = JWT::$leeway;
        JWT::$timestamp = 1792692000;
        JWT::$leeway = 0;
        config(['foodtrucks.google_client_id' => 'synthetic-client.apps.googleusercontent.com']);
        $this->key = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        $public = openssl_pkey_get_details($this->key)['rsa'];
        Http::preventStrayRequests();
        Http::fake(['https://www.googleapis.com/oauth2/v3/certs' => Http::response(['keys' => [[
            'kty' => 'RSA', 'alg' => 'RS256', 'kid' => 'synthetic-key',
            'n' => JWT::urlsafeB64Encode($public['n']), 'e' => JWT::urlsafeB64Encode($public['e']),
        ]]])]);
        $this->claims = [
            'iss' => 'https://accounts.google.com', 'aud' => 'synthetic-client.apps.googleusercontent.com',
            'sub' => 'synthetic-subject', 'email' => 'person@example.test', 'email_verified' => true,
            'nonce' => str_repeat('a', 64), 'iat' => JWT::$timestamp, 'exp' => JWT::$timestamp + 3600,
        ];
    }

    protected function tearDown(): void
    {
        JWT::$timestamp = $this->previousTimestamp;
        JWT::$leeway = $this->previousLeeway;
        parent::tearDown();
    }

    private function verify(array $claims): object
    {
        return app(GoogleIdentity::class)->verify(JWT::encode($claims, $this->key, 'RS256', 'synthetic-key'));
    }

    public function test_a_genuinely_signed_google_identity_is_verified(): void
    {
        $this->assertSame('synthetic-subject', $this->verify($this->claims)->sub);
        $this->assertSame(0, JWT::$leeway);
    }

    public function test_a_small_clock_difference_is_tolerated_only_during_google_verification(): void
    {
        $this->assertSame('synthetic-subject', $this->verify([...$this->claims, 'iat' => JWT::$timestamp + 2])->sub);
        $this->assertSame(0, JWT::$leeway);
    }

    public function test_invalid_claims_and_times_outside_the_tolerance_are_rejected(): void
    {
        foreach ([
            ['aud' => 'another-client.apps.googleusercontent.com'],
            ['iss' => 'https://untrusted.example.test'],
            ['nonce' => null], ['email_verified' => false],
            ['iat' => JWT::$timestamp + 61], ['exp' => JWT::$timestamp - 61],
        ] as $changes) {
            try {
                $this->verify([...$this->claims, ...$changes]);
                $this->fail('Invalid Google identity accepted.');
            } catch (HttpException $error) {
                $this->assertSame(401, $error->getStatusCode());
            }
            $this->assertSame(0, JWT::$leeway);
        }
    }

    public function test_a_token_signed_by_another_key_is_rejected(): void
    {
        $otherKey = openssl_pkey_new(['private_key_bits' => 2048, 'private_key_type' => OPENSSL_KEYTYPE_RSA]);
        $this->expectException(HttpException::class);
        app(GoogleIdentity::class)->verify(JWT::encode($this->claims, $otherKey, 'RS256', 'synthetic-key'));
    }
}
