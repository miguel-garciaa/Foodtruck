<?php

return [
    // No request/body/query collection. Opt-in instrumentation requires a separate privacy review.
    'enabled' => false,
    'path' => '_ops/telescope',
    'watchers' => [],
    'ignore_paths' => ['api/*'],
];
