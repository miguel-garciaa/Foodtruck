<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class OutboxEvent extends Model
{
    use HasUuids;

    protected $guarded = [];

    protected $hidden = ['payload'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['payload' => 'encrypted:array', 'expires_at' => 'immutable_datetime', 'available_at' => 'immutable_datetime'];
    }

    public static function record(string $userId, string $kind, array $payload, int $minutes = 60): self
    {
        return self::create(['user_id' => $userId, 'kind' => $kind, 'payload' => $payload, 'available_at' => now(), 'expires_at' => now()->addMinutes($minutes)]);
    }
}
