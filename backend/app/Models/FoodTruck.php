<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

/** @property bool $is_open Calculado por la consulta pública. */
class FoodTruck extends Model
{
    use HasUuids;

    protected $guarded = ['id', 'owner_id', 'published', 'location', 'status', 'version'];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return ['draft' => 'array', 'published' => 'array', 'version' => 'integer', 'starting_price_cents' => 'integer', 'rating' => 'float', 'rating_count' => 'integer'];
    }
}
