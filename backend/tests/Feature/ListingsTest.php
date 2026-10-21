<?php

namespace Tests\Feature;

use App\Models\FoodTruck;
use App\Models\User;
use App\Services\Sessions;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\PostgresTestCase;

class ListingsTest extends PostgresTestCase
{
    private function draft(array $changes = []): array
    {
        return $changes + ['name' => 'Puesto de prueba', 'description' => 'Descripción', 'category' => 'Tacos', 'contact' => 'Contacto comercial', 'locality' => 'Córdoba', 'province' => 'Córdoba', 'address' => 'Dirección de prueba', 'longitude' => -4.77, 'latitude' => 37.88, 'timezone' => 'Europe/Madrid', 'photos' => [], 'hours' => [['day' => 1, 'startMinute' => 600, 'endMinute' => 1200]], 'menu' => [['id' => 'one', 'name' => 'Menú', 'description' => '', 'priceCents' => 500, 'allergens' => 'Consultar']]];
    }

    public function test_owners_cannot_edit_other_accounts_or_bypass_review(): void
    {
        $owner = User::factory()->create();
        $other = User::factory()->create();
        $session = DB::transaction(fn () => app(Sessions::class)->issue($owner));
        $truck = $this->withToken($session['accessToken'])->postJson('/api/v1/merchant/foodtrucks', $this->draft())->assertCreated()->json();
        $this->getJson('/api/v1/foodtrucks')->assertJsonCount(0, 'items');
        $this->putJson('/api/v1/merchant/foodtrucks/'.$truck['id'], ['version' => 0, 'draft' => $this->draft()])->assertUnprocessable();
        $this->putJson('/api/v1/merchant/foodtrucks/'.$truck['id'], ['version' => 2, 'draft' => $this->draft()])->assertConflict();
        $otherSession = DB::transaction(fn () => app(Sessions::class)->issue($other));
        app('auth')->forgetGuards();
        $this->withToken($otherSession['accessToken'])->putJson('/api/v1/merchant/foodtrucks/'.$truck['id'], ['version' => 1, 'draft' => $this->draft()])->assertForbidden();
    }

    public function test_moderation_keeps_the_previous_public_snapshot_until_approval(): void
    {
        $owner = User::factory()->create();
        $photo = (string) Str::uuid();
        DB::table('media_assets')->insert(['id' => $photo, 'user_id' => $owner->id, 'filename' => $photo.'.jpg', 'created_at' => now(), 'updated_at' => now()]);
        $truck = new FoodTruck;
        $truck->forceFill(['owner_id' => $owner->id, 'draft' => $this->draft(['photos' => [$photo]]), 'version' => 1, 'status' => 'submitted'])->save();
        $this->artisan('foodtrucks:review', ['decision' => 'approve', 'id' => $truck->id, '--expected-version' => '1', '--actor' => 'ci'])->assertSuccessful()->run();
        $this->assertNotNull($truck->refresh()->published);
        $truck->refresh()->forceFill(['draft' => $this->draft(['name' => 'Cambio sin revisar']), 'status' => 'draft'])->save();
        $this->getJson('/api/v1/foodtrucks/'.$truck->id)->assertOk()->assertJsonPath('document.name', 'Puesto de prueba');
        $this->assertDatabaseCount('moderation_audit', 1);
        $this->assertDatabaseCount('outbox_events', 1);
    }

    public function test_filters_are_inclusive_accent_insensitive_and_exclude_unrated_only_with_minimum(): void
    {
        $owner = User::factory()->create();
        $truck = new FoodTruck;
        $truck->forceFill(['owner_id' => $owner->id, 'draft' => $this->draft(), 'published' => $this->draft(), 'version' => 1, 'status' => 'published', 'starting_price_cents' => 500])->save();
        DB::update('UPDATE food_trucks SET location=ST_SetSRID(ST_MakePoint(-4.77,37.88),4326) WHERE id=?', [$truck->id]);
        $this->getJson('/api/v1/foodtrucks?locality=Cordoba&province=Cordoba&minPriceCents=500&maxPriceCents=500&category=Tacos&bbox=-5,37,-4,38')->assertOk()->assertJsonCount(1, 'items')->assertJsonPath('items.0.rating', null);
        $this->getJson('/api/v1/foodtrucks?minRating=4')->assertOk()->assertJsonCount(0, 'items');
        $this->getJson('/api/v1/foodtrucks?minPriceCents=501')->assertJsonCount(0, 'items');
        $this->getJson('/api/v1/foodtrucks?locality=Toledo')->assertJsonCount(0, 'items');
    }
}
