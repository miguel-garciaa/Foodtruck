<?php

namespace App\Http\Controllers;

use App\Http\Requests\DraftRequest;
use App\Models\FoodTruck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;

class OwnerTruckController extends Controller
{
    public static function document(FoodTruck $truck): array
    {
        return ['id' => $truck->id, 'version' => $truck->version, 'status' => $truck->status, 'draft' => $truck->draft, 'published' => $truck->published, 'moderationReason' => $truck->moderation_reason];
    }

    public function index(Request $request)
    {
        // Bound the response; the API exposes a cursor for accounts with many listings.
        $data = $request->validate(['cursor' => ['sometimes', 'uuid']]);
        $trucks = FoodTruck::where('owner_id', $request->user()->id)->when($data['cursor'] ?? null, fn ($query, $id) => $query->where('id', '>', $id))->orderBy('id')->limit(51)->get();

        return response()->json(['items' => $trucks->take(50)->map(self::document(...))->values(), 'nextCursor' => $trucks->count() > 50 ? $trucks[49]->id : null]);
    }

    public function create(DraftRequest $request)
    {
        $truck = new FoodTruck;
        $truck->forceFill(['owner_id' => $request->user()->id, 'draft' => $request->validated(), 'version' => 1, 'status' => 'draft'])->save();

        return response()->json(self::document($truck->refresh()), 201);
    }

    public function show(FoodTruck $truck)
    {
        Gate::authorize('view', $truck);

        return response()->json(self::document($truck));
    }

    public function update(DraftRequest $request, FoodTruck $truck)
    {
        Gate::authorize('update', $truck);

        return DB::transaction(function () use ($request, $truck) {
            $current = FoodTruck::whereKey($truck->id)->lockForUpdate()->firstOrFail();
            abort_if($current->version !== $request->integer('version'), 409, 'El anuncio ha cambiado. Vuelve a cargarlo.');
            abort_if(in_array($current->status, ['submitted', 'archived'], true), 409, 'El anuncio no se puede editar en su estado actual.');
            $current->forceFill(['draft' => $request->validated('draft'), 'status' => 'draft', 'version' => $current->version + 1])->save();

            return response()->json(self::document($current));
        });
    }

    public function transition(Request $request, FoodTruck $truck)
    {
        Gate::authorize('update', $truck);
        abort_unless($request->user()->hasVerifiedEmail(), 403, 'Verifica tu correo.');
        $data = $request->validate(['version' => ['required', 'integer:strict', 'between:1,2147483647']]);

        return DB::transaction(function () use ($request, $truck, $data) {
            $current = FoodTruck::whereKey($truck->id)->lockForUpdate()->firstOrFail();
            abort_if($current->version !== $data['version'], 409, 'El anuncio ha cambiado.');
            $archive = $request->routeIs('trucks.archive');
            abort_if($current->status === 'archived' || (! $archive && $current->status === 'submitted'), 409, 'Estado incompatible.');
            if (! $archive) {
                $draft = $current->draft;
                foreach (['name', 'description', 'contact', 'locality', 'province', 'address'] as $field) {
                    if (trim($draft[$field]) === '') {
                        throw ValidationException::withMessages(['draft.'.$field => ['Completa este campo antes de enviar a revisión.']]);
                    }
                }
                if ($draft['menu'] === [] || $draft['photos'] === [] || $draft['hours'] === []) {
                    throw ValidationException::withMessages(['draft' => ['Añade carta, fotografías y horarios.']]);
                }
            }
            $current->forceFill(['status' => $archive ? 'archived' : 'submitted', 'version' => $current->version + 1])->save();

            return response()->json(self::document($current));
        });
    }
}
