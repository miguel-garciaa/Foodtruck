<?php

return [
    'name' => 'Foodtrucks DEV',
    'path' => '_ops/horizon',
    'use' => 'default',
    'prefix' => 'foodtrucks-dev:horizon:',
    'middleware' => ['web'],
    'waits' => ['redis:default' => 60],
    'trim' => ['recent' => 60, 'pending' => 60, 'completed' => 60, 'recent_failed' => 60, 'failed' => 1440, 'monitored' => 60],
    'silenced' => [],
    'metrics' => ['trim_snapshots' => ['job' => 24, 'queue' => 24]],
    'fast_termination' => false,
    'memory_limit' => 128,
    'defaults' => ['outbox' => ['connection' => 'redis', 'queue' => ['default'], 'balance' => false, 'maxProcesses' => 1, 'maxTime' => 3600, 'maxJobs' => 500, 'memory' => 192, 'tries' => 1, 'timeout' => 45, 'nice' => 0]],
    'environments' => ['*' => ['outbox' => ['maxProcesses' => 1]]],
];
