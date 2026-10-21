<?php

namespace App\Console\Commands;

use App\Jobs\DeliverOutbox;
use App\Models\OutboxEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DispatchOutbox extends Command
{
    protected $signature = 'foodtrucks:outbox';

    protected $description = 'Despacha avisos con lease recuperable; PostgreSQL conserva la autoridad.';

    public function handle(): int
    {
        OutboxEvent::where('status', 'pending')->where('expires_at', '<=', now())->update(['status' => 'expired', 'payload' => null, 'lease' => null, 'locked_until' => null]);
        OutboxEvent::where('status', 'pending')->where('attempts', '>=', 5)->where(fn ($query) => $query->whereNull('locked_until')->orWhere('locked_until', '<=', now()))->update(['status' => 'failed', 'payload' => null, 'lease' => null, 'locked_until' => null]);
        $kinds = [];
        if (config('foodtrucks.email_enabled') && config('services.resend.key')) {
            $kinds = ['verify_email', 'reset_password'];
        }
        if (is_file(config('foodtrucks.fcm_credentials') ?? '')) {
            $kinds[] = 'push';
        }
        $events = DB::transaction(function () use ($kinds) {
            $events = OutboxEvent::where('status', 'pending')->whereIn('kind', $kinds)->where('attempts', '<', 5)->where('available_at', '<=', now())->where('expires_at', '>', now())->where(fn ($query) => $query->whereNull('locked_until')->orWhere('locked_until', '<=', now()))->orderBy('available_at')->limit(10)->lock('FOR UPDATE SKIP LOCKED')->get();
            foreach ($events as $event) {
                $event->forceFill(['lease' => (string) Str::uuid(), 'locked_until' => now()->addMinutes(3), 'attempts' => $event->attempts + 1])->save();
            }

            return $events;
        });
        foreach ($events as $event) {
            DeliverOutbox::dispatch($event->id, $event->lease);
        }

        return self::SUCCESS;
    }
}
