<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\AndroidCiSeeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;
use Tests\PostgresTestCase;

class AndroidCiFixtureTest extends PostgresTestCase
{
    public function test_fixture_requires_explicit_ci_mode_before_creating_any_data(): void
    {
        putenv('FOODTRUCKS_CI=0');
        try {
            $this->seed(AndroidCiSeeder::class);
            $this->fail('No debe sembrar sin modo CI.');
        } catch (RuntimeException) {
            $this->assertDatabaseCount('users', 0);
        } finally {
            putenv('FOODTRUCKS_CI');
        }
    }

    public function test_fixture_exposes_real_search_and_a_verified_synthetic_account(): void
    {
        putenv('FOODTRUCKS_CI=1');
        try {
            $this->seed(AndroidCiSeeder::class);
            $this->getJson('/api/v1/foodtrucks')->assertOk()->assertJsonCount(2, 'items');
            $this->getJson('/api/v1/foodtrucks?q=taco')->assertOk()->assertJsonCount(1, 'items');
            $user = User::where('email', 'android@example.test')->firstOrFail();
            $this->assertNotNull($user->email_verified_at);
            $this->assertTrue(Hash::check('Synthetic-Android-2026!', $user->password));
            $this->postJson('/api/v1/auth/login', ['email' => $user->email, 'password' => 'Synthetic-Android-2026!'])->assertOk()->assertJsonStructure(['accessToken', 'refreshToken']);
        } finally {
            putenv('FOODTRUCKS_CI');
        }
    }
}
