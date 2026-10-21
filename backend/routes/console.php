<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('foodtrucks:outbox')->everyTenSeconds()->withoutOverlapping();
Schedule::command('sanctum:prune-expired --hours=24')->daily();
