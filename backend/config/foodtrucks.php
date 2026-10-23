<?php

return [
    'environment' => 'dev',
    'email_enabled' => (bool) env('FOODTRUCKS_EMAIL_ENABLED', false),
    'email_allowlist' => array_filter(explode(',', env('DEV_EMAIL_ALLOWLIST', ''))),
    'google_client_id' => env('GOOGLE_WEB_CLIENT_ID'),
    'fcm_project' => env('FCM_PROJECT_ID', 'foodtrucks-dev'),
    'fcm_credentials' => env('FCM_CREDENTIALS_FILE'),
    'native_url' => 'foodtrucks-dev://auth',
];
