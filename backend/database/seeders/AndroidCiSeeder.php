<?php

namespace Database\Seeders;

use App\Models\FoodTruck;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AndroidCiSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->environment('testing') || getenv('FOODTRUCKS_CI') !== '1' || config('database.connections.pgsql.database') !== 'foodtrucks_testing' || config('database.connections.pgsql.host') !== '127.0.0.1') {
            throw new RuntimeException('Datos Android exclusivos de PostgreSQL CI aislado.');
        }
        DB::transaction(function (): void {
            $user = User::factory()->create(['email' => 'android@example.test', 'name' => 'Cuenta Android CI', 'email_verified_at' => now(), 'password' => Hash::make('Synthetic-Android-2026!')]);
            foreach ([['La ruta del taco', 'Tacos', 500], ['Brasa sobre ruedas', 'Hamburguesas', 800]] as [$name, $category, $price]) {
                $document = ['name' => $name, 'description' => 'Catálogo sintético para CI', 'category' => $category, 'contact' => 'Contacto sintético', 'locality' => 'Córdoba', 'province' => 'Córdoba', 'address' => 'Dirección sintética', 'longitude' => -4.77, 'latitude' => 37.88, 'timezone' => 'Europe/Madrid', 'photos' => [], 'hours' => [], 'menu' => [['id' => 'one', 'name' => 'Menú sintético', 'description' => '', 'priceCents' => $price, 'allergens' => 'Consultar']]];
                $truck = new FoodTruck;
                $truck->forceFill(['owner_id' => $user->id, 'draft' => $document, 'published' => $document, 'version' => 1, 'status' => 'published', 'starting_price_cents' => $price])->save();
                DB::update('UPDATE food_trucks SET location=ST_SetSRID(ST_MakePoint(-4.77,37.88),4326) WHERE id=?', [$truck->id]);
            }
        });
    }
}
