<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\MediaController;
use App\Http\Controllers\OwnerTruckController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TruckController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::middleware('throttle:public')->group(function () {
        Route::get('foodtrucks', [TruckController::class, 'index']);
        Route::get('foodtrucks/{id}', [TruckController::class, 'show'])->whereUuid('id');
        Route::get('media/{id}', [MediaController::class, 'show'])->whereUuid('id');
    });
    Route::middleware('throttle:auth')->group(function () {
        Route::post('auth/google/challenge', [GoogleController::class, 'challenge']);
        Route::post('auth/google', [GoogleController::class, 'login'])->name('auth.google');
        Route::post('auth/register', [AuthController::class, 'register'])->name('auth.register');
        Route::post('auth/login', [AuthController::class, 'login'])->name('auth.login');
        Route::post('auth/refresh', [AuthController::class, 'refresh'])->name('auth.refresh');
        Route::post('auth/email/verify', [AuthController::class, 'verify'])->name('auth.verify');
        Route::post('auth/email/resend', [AuthController::class, 'resend'])->name('auth.resend');
        Route::post('auth/password/forgot', [AuthController::class, 'forgot'])->name('auth.forgot');
        Route::post('auth/password/reset', [AuthController::class, 'reset'])->name('auth.reset');
    });
    Route::middleware(['auth:sanctum', 'throttle:account'])->group(function () {
        Route::post('me/google', [GoogleController::class, 'login'])->name('auth.google.link')->middleware('throttle:auth');
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::post('me/password', [AuthController::class, 'password'])->name('auth.password');
        Route::get('me', [ProfileController::class, 'show']);
        Route::post('me/media', [MediaController::class, 'store'])->middleware('throttle:uploads');
        Route::put('me/devices', [DeviceController::class, 'store']);
        Route::delete('me/devices', [DeviceController::class, 'delete']);
        Route::post('me/devices/test', [DeviceController::class, 'test'])->middleware('throttle:push-test');
        Route::put('me', [ProfileController::class, 'update']);
        Route::get('me/favorites', [ProfileController::class, 'favorites']);
        Route::match(['put', 'delete'], 'me/favorites/{id}', [ProfileController::class, 'favorite'])->whereUuid('id');
        Route::get('merchant/foodtrucks', [OwnerTruckController::class, 'index']);
        Route::post('merchant/foodtrucks', [OwnerTruckController::class, 'create'])->name('trucks.create');
        Route::get('merchant/foodtrucks/{truck}', [OwnerTruckController::class, 'show'])->whereUuid('truck');
        Route::put('merchant/foodtrucks/{truck}', [OwnerTruckController::class, 'update'])->whereUuid('truck');
        Route::post('merchant/foodtrucks/{truck}/submit', [OwnerTruckController::class, 'transition'])->whereUuid('truck')->name('trucks.submit');
        Route::post('merchant/foodtrucks/{truck}/archive', [OwnerTruckController::class, 'transition'])->whereUuid('truck')->name('trucks.archive');
    });
});
