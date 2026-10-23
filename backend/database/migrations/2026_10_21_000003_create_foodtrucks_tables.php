<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement('CREATE EXTENSION IF NOT EXISTS postgis');
        DB::statement('CREATE EXTENSION IF NOT EXISTS unaccent');
        Schema::table('users', function (Blueprint $table) {
            $table->string('mode', 10)->default('client');
            $table->uuid('avatar_id')->nullable();
            $table->boolean('push_enabled')->default(false);
        });
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_mode CHECK (mode IN ('client', 'owner'))");
        Schema::create('auth_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->uuid('family')->index();
            $table->string('refresh_hash', 64)->unique();
            $table->unsignedBigInteger('access_token_id')->nullable()->index();
            $table->timestampTz('expires_at');
            $table->timestampTz('revoked_at')->nullable();
            $table->timestampsTz();
        });
        Schema::create('personal_access_tokens', function (Blueprint $table) {
            $table->id();
            $table->uuidMorphs('tokenable');
            $table->text('name');
            $table->string('token', 64)->unique();
            $table->text('abilities')->nullable();
            $table->timestamp('last_used_at')->nullable();
            $table->timestamp('expires_at')->nullable()->index();
            $table->timestamps();
        });
        Schema::create('verification_tokens', function (Blueprint $table) {
            $table->string('hash', 64)->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->timestampTz('expires_at');
            $table->timestampTz('consumed_at')->nullable();
        });
        Schema::create('auth_identities', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('user_id')->constrained();
            $table->string('provider', 20);
            $table->string('subject', 255);
            $table->unique(['provider', 'subject']);
        });
        Schema::create('media_assets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->string('filename', 80)->unique();
            $table->timestampsTz();
        });
        Schema::table('users', fn (Blueprint $table) => $table->foreign('avatar_id')->references('id')->on('media_assets'));
        Schema::create('food_trucks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('owner_id')->constrained('users');
            $table->unsignedInteger('version')->default(1);
            $table->string('status', 20)->default('draft');
            $table->jsonb('draft');
            $table->jsonb('published')->nullable();
            $table->integer('starting_price_cents')->nullable();
            $table->decimal('rating', 2, 1)->nullable();
            $table->integer('rating_count')->default(0);
            $table->text('moderation_reason')->default('');
            $table->timestampsTz();
            $table->index(['owner_id', 'id']);
        });
        DB::statement('ALTER TABLE food_trucks ADD COLUMN location geometry(Point,4326)');
        DB::statement("CREATE INDEX food_trucks_location ON food_trucks USING gist(location) WHERE published IS NOT NULL AND status <> 'archived'");
        DB::statement("ALTER TABLE food_trucks ADD CONSTRAINT truck_status CHECK (status IN ('draft','submitted','published','changes_requested','archived')), ADD CONSTRAINT truck_price CHECK (starting_price_cents >= 0), ADD CONSTRAINT truck_rating CHECK ((rating_count = 0 AND rating IS NULL) OR (rating_count > 0 AND rating BETWEEN 0 AND 5)), ADD CONSTRAINT truck_version CHECK (version > 0)");
        Schema::create('favorites', function (Blueprint $table) {
            $table->foreignUuid('user_id')->constrained();
            $table->foreignUuid('truck_id')->constrained('food_trucks');
            $table->primary(['user_id', 'truck_id']);
        });
        Schema::create('devices', function (Blueprint $table) {
            $table->string('installation_id', 100)->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->foreignUuid('session_id')->constrained('auth_sessions');
            $table->text('token_cipher');
            $table->string('token_hash', 64)->unique();
            $table->string('environment', 10)->default('dev');
            $table->timestampsTz();
        });
        Schema::create('outbox_events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained();
            $table->string('kind', 20);
            $table->text('payload')->nullable();
            $table->unsignedSmallInteger('attempts')->default(0);
            $table->timestampTz('available_at');
            $table->timestampTz('expires_at');
            $table->timestampTz('locked_until')->nullable();
            $table->uuid('lease')->nullable();
            $table->string('status', 10)->default('pending');
            $table->timestampsTz();
        });
        DB::statement("CREATE INDEX outbox_pending ON outbox_events(available_at) WHERE status = 'pending'");
        Schema::create('moderation_audit', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('truck_id')->constrained('food_trucks');
            $table->unsignedInteger('version');
            $table->string('actor', 100);
            $table->string('decision', 30);
            $table->text('reason');
            $table->timestampTz('created_at')->useCurrent();
        });
    }

    public function down(): void
    {
        throw new RuntimeException('Esta migración contiene cuentas y anuncios. Restaurar una copia verificada; no borrar datos automáticamente.');
    }
};
