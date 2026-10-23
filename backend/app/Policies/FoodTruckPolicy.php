<?php

namespace App\Policies;

use App\Models\FoodTruck;
use App\Models\User;

class FoodTruckPolicy
{
    public function view(User $user, FoodTruck $truck): bool
    {
        return $truck->owner_id === $user->id;
    }

    public function update(User $user, FoodTruck $truck): bool
    {
        return $this->view($user, $truck);
    }
}
