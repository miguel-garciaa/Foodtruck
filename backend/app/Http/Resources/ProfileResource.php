<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class ProfileResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return ['id' => $this->id, 'email' => $this->email, 'displayName' => $this->name, 'emailVerified' => $this->hasVerifiedEmail(), 'avatarId' => $this->avatar_id, 'mode' => $this->mode, 'pushEnabled' => (bool) $this->push_enabled];
    }
}
