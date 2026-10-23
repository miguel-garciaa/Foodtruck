<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('google_challenges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nonce_hash', 64);
            $table->timestampTz('expires_at');
            $table->timestampTz('consumed_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('google_challenges');
    }
};
