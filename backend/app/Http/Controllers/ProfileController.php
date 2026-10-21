<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProfileResource;
use App\Models\FoodTruck;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request): ProfileResource
    {
        return new ProfileResource($request->user());
    }

    public function update(Request $request): ProfileResource
    {
        $data = $request->validate(['displayName' => ['required', 'string', 'max:100'], 'avatarId' => ['present', 'nullable', 'uuid', Rule::exists('media_assets', 'id')->where('user_id', $request->user()->id)], 'mode' => ['required', Rule::in(['client', 'owner'])], 'pushEnabled' => ['required', 'boolean:strict']]);

        return DB::transaction(function () use ($request, $data) {
            $user = User::whereKey($request->user()->id)->lockForUpdate()->firstOrFail();
            $user->forceFill(['name' => $data['displayName'], 'avatar_id' => $data['avatarId'], 'mode' => $data['mode'], 'push_enabled' => $data['pushEnabled']])->save();
            if (! $data['pushEnabled']) {
                DB::table('devices')->where('user_id', $user->id)->delete();
            }

            return new ProfileResource($user);
        });
    }

    public function favorites(Request $request)
    {
        return response()->json(['items' => DB::table('favorites')->where('user_id', $request->user()->id)->orderBy('truck_id')->pluck('truck_id')]);
    }

    public function favorite(Request $request, string $id)
    {
        if ($request->isMethod('put')) {
            abort_unless(FoodTruck::whereKey($id)->whereNotNull('published')->where('status', '<>', 'archived')->exists(), 404);
            DB::table('favorites')->insertOrIgnore(['user_id' => $request->user()->id, 'truck_id' => $id]);
        } else {
            DB::table('favorites')->where('user_id', $request->user()->id)->where('truck_id', $id)->delete();
        }

        return response()->noContent();
    }
}
