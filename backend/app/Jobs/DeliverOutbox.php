<?php

namespace App\Jobs;

use App\Models\OutboxEvent;
use App\Services\OutboxDelivery;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeliverOutbox implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 40;

    // Horizon receives IDs only; sensitive payloads stay encrypted in PostgreSQL.
    public function __construct(public string $eventId, public string $lease) {}

    public function handle(OutboxDelivery $delivery): void
    {
        $event = OutboxEvent::whereKey($this->eventId)->where('lease', $this->lease)->where('status', 'pending')->where('locked_until', '>', now())->first();
        if (! $event) {
            return;
        }
        $query = OutboxEvent::whereKey($event->id)->where('lease', $this->lease);
        if ($event->expires_at->isPast()) {
            $query->update(['status' => 'expired', 'payload' => null, 'lease' => null, 'locked_until' => null]);

            return;
        }
        try {
            $delivery->send($event);
            $query->update(['status' => 'sent', 'payload' => null, 'lease' => null, 'locked_until' => null]);
        } catch (\Throwable) {
            $exhausted = $event->attempts >= 5;
            $query->update(['status' => $exhausted ? 'failed' : 'pending', 'payload' => $exhausted ? null : $event->getRawOriginal('payload'), 'available_at' => now()->addSeconds(min(900, 15 * 2 ** $event->attempts)), 'lease' => null, 'locked_until' => null]);
        }
    }
}
