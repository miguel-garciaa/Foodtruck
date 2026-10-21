<?php

namespace App\Console\Commands;

use App\Models\FoodTruck;
use App\Models\OutboxEvent;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReviewTrucks extends Command
{
    protected $signature = 'foodtrucks:review {decision=list : list, approve o return} {id?} {--version=} {--actor=} {--reason=}';

    protected $description = 'Revisión DEV por SSH; cada decisión comprueba versión y queda auditada.';

    public function handle(): int
    {
        if ($this->argument('decision') === 'list') {
            $this->table(['ID', 'Versión', 'Nombre'], FoodTruck::where('status', 'submitted')->orderBy('updated_at')->limit(100)->get()->map(fn ($truck) => [$truck->id, $truck->version, $truck->draft['name']]));

            return self::SUCCESS;
        }
        $approve = $this->argument('decision') === 'approve';
        if (! in_array($this->argument('decision'), ['approve', 'return'], true) || ! Str::isUuid($this->argument('id') ?? '') || ! ctype_digit((string) $this->option('version')) || ! preg_match('/^[a-zA-Z0-9._@-]{1,100}$/D', $this->option('actor') ?? '') || strlen($this->option('reason') ?? '') > 2000 || (! $approve && trim($this->option('reason') ?? '') === '')) {
            $this->error('Indica decisión, UUID, --version, --actor y motivo (obligatorio al devolver).');

            return self::INVALID;
        }

        return DB::transaction(function () use ($approve) {
            $truck = FoodTruck::whereKey($this->argument('id'))->lockForUpdate()->first();
            if (! $truck || $truck->status !== 'submitted' || $truck->version !== (int) $this->option('version')) {
                $this->error('Anuncio inexistente, estado o versión incompatibles.');

                return self::FAILURE;
            }
            $draft = $truck->draft;
            $truck->forceFill(['status' => $approve ? 'published' : 'changes_requested', 'moderation_reason' => $this->option('reason') ?? '', 'version' => $truck->version + 1]);
            if ($approve) {
                $truck->forceFill(['published' => $draft, 'starting_price_cents' => min(array_column($draft['menu'], 'priceCents'))]);
            }
            $truck->save();
            if ($approve) {
                DB::update('UPDATE food_trucks SET location = ST_SetSRID(ST_MakePoint(?, ?),4326) WHERE id = ?', [$draft['longitude'], $draft['latitude'], $truck->id]);
            }
            DB::table('moderation_audit')->insert(['truck_id' => $truck->id, 'version' => $truck->version, 'actor' => $this->option('actor'), 'decision' => $approve ? 'approve' : 'return', 'reason' => $this->option('reason') ?? '', 'created_at' => now()]);
            OutboxEvent::record($truck->owner_id, 'push', ['truckId' => $truck->id], 1440);
            $this->info('Decisión guardada y auditada. Versión '.$truck->version);

            return self::SUCCESS;
        });
    }
}
