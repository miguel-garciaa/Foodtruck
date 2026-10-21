<?php

namespace App\Http\Controllers;

use App\Models\FoodTruck;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class TruckController extends Controller
{
    private const OPEN_SQL = "EXISTS (SELECT 1 FROM jsonb_array_elements(published->'hours') AS slot WHERE (slot->>'day')::int = EXTRACT(ISODOW FROM CURRENT_TIMESTAMP AT TIME ZONE (published->>'timezone')) AND (slot->>'startMinute')::int <= EXTRACT(HOUR FROM CURRENT_TIMESTAMP AT TIME ZONE (published->>'timezone')) * 60 + EXTRACT(MINUTE FROM CURRENT_TIMESTAMP AT TIME ZONE (published->>'timezone')) AND (slot->>'endMinute')::int > EXTRACT(HOUR FROM CURRENT_TIMESTAMP AT TIME ZONE (published->>'timezone')) * 60 + EXTRACT(MINUTE FROM CURRENT_TIMESTAMP AT TIME ZONE (published->>'timezone')))";

    public static function document(FoodTruck $truck): array
    {
        return ['id' => $truck->id, 'document' => $truck->published, 'open' => (bool) $truck->is_open, 'startingPriceCents' => $truck->starting_price_cents, 'rating' => $truck->rating, 'ratingCount' => $truck->rating_count, 'photoUrls' => array_map(fn ($id) => url('/api/v1/media/'.$id), $truck->published['photos'])];
    }

    private function published()
    {
        return FoodTruck::whereNotNull('published')->where('status', '<>', 'archived')->select('*')->selectRaw(self::OPEN_SQL.' AS is_open');
    }

    public function index(Request $request)
    {
        $data = $request->validate(['q' => ['sometimes', 'string', 'max:100'], 'category' => ['sometimes', Rule::in(['Hamburguesas', 'Tacos', 'Vegetariano', 'Otros'])], 'locality' => ['sometimes', 'string', 'max:100'], 'province' => ['sometimes', 'string', 'max:100'], 'openOnly' => ['sometimes', Rule::in(['true', 'false', '1', '0'])], 'minPriceCents' => ['sometimes', 'integer', 'between:0,1000000'], 'maxPriceCents' => ['sometimes', 'integer', 'between:0,1000000'], 'minRating' => ['sometimes', Rule::in(['0', '4', '4.5'])], 'bbox' => ['sometimes', 'string', 'max:120'], 'cursor' => ['sometimes', 'uuid'], 'limit' => ['sometimes', 'integer', 'between:1,100']]);
        if (isset($data['minPriceCents'], $data['maxPriceCents']) && $data['minPriceCents'] > $data['maxPriceCents']) {
            throw ValidationException::withMessages(['maxPriceCents' => ['El máximo debe ser igual o superior al mínimo.']]);
        }
        $query = $this->published();
        if (isset($data['q']) && $data['q'] !== '') {
            $query->whereRaw("strpos(lower(unaccent(concat_ws(' ', published->>'name', published->>'description', published->>'locality', published->>'province'))), lower(unaccent(?))) > 0", [$data['q']]);
        }
        foreach (['locality', 'province'] as $field) {
            if (! empty($data[$field])) {
                $query->whereRaw("lower(unaccent(published->>'$field')) = lower(unaccent(?))", [$data[$field]]);
            }
        }
        if (isset($data['category'])) {
            $query->where('published->category', $data['category']);
        }
        foreach (['minPriceCents' => '>=', 'maxPriceCents' => '<='] as $field => $operator) {
            if (isset($data[$field])) {
                $query->where('starting_price_cents', $operator, $data[$field]);
            }
        }
        if ((float) ($data['minRating'] ?? 0) > 0) {
            $query->where('rating', '>=', $data['minRating']);
        }
        if ($request->boolean('openOnly')) {
            $query->whereRaw(self::OPEN_SQL);
        }
        if (isset($data['bbox'])) {
            $parts = explode(',', $data['bbox']);
            $valid = count($parts) === 4 && count(array_filter($parts, 'is_numeric')) === 4;
            if ($valid) {
                [$west, $south, $east, $north] = array_map('floatval', $parts);
                $valid = is_finite($west + $south + $east + $north) && $west >= -180 && $east <= 180 && $south >= -90 && $north <= 90 && $west < $east && $south < $north;
            }
            if (! $valid) {
                throw ValidationException::withMessages(['bbox' => ['Área inválida: oeste,sur,este,norte.']]);
            }
            $query->whereRaw('location && ST_MakeEnvelope(?, ?, ?, ?, 4326)', [$west, $south, $east, $north]);
        }
        $limit = (int) ($data['limit'] ?? 50);
        $trucks = $query->when($data['cursor'] ?? null, fn ($query, $id) => $query->where('id', '>', $id))->orderBy('id')->limit($limit + 1)->get();

        return response()->json(['items' => $trucks->take($limit)->map(self::document(...))->values(), 'nextCursor' => $trucks->count() > $limit ? $trucks[$limit - 1]->id : null]);
    }

    public function show(string $id)
    {
        return response()->json(self::document($this->published()->whereKey($id)->firstOrFail()));
    }
}
