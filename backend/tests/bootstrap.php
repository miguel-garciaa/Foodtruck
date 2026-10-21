<?php

require dirname(__DIR__).'/vendor/autoload.php';
// Ephemeral encryption key for synthetic tests; never reuse a DEV or provider secret.
putenv('APP_KEY=base64:'.base64_encode(random_bytes(32)));
