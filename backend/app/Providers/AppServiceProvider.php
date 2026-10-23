<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Laravel\Horizon\Horizon;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Bindings only; deferred framework providers are available in boot().
    }

    public function boot(): void
    {
        Horizon::auth(fn () => false);
        JsonResource::withoutWrapping();
        RateLimiter::for('auth', fn (Request $request) => [Limit::perMinute(20)->by('ip:'.$request->ip()), Limit::perMinute(5)->by('identity:'.hash('sha256', mb_strtolower((string) $request->input('email', $request->ip()))))]);
        RateLimiter::for('account', fn (Request $request) => Limit::perMinute(120)->by($request->user()?->id ?: $request->ip()));
        RateLimiter::for('public', fn (Request $request) => Limit::perMinute(120)->by($request->ip()));
        RateLimiter::for('uploads', fn (Request $request) => Limit::perMinute(10)->by($request->user()->id));
        RateLimiter::for('push-test', fn (Request $request) => Limit::perMinute(2)->by($request->user()->id));
    }
}
