<?php

use Google\Auth\Credentials\ServiceAccountCredentials;
use Google\Auth\HttpHandler\HttpHandlerFactory;
use GuzzleHttp\Client;
use Illuminate\Contracts\Console\Kernel;

require '/app/vendor/autoload.php';
$app = require '/app/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

if (! $app->environment('dev') || ! is_file(config('foodtrucks.fcm_credentials') ?? '')) {
    fwrite(STDERR, "La comprobación requiere la credencial privada FCM de DEV.\n");
    exit(1);
}

try {
    $credentials = new ServiceAccountCredentials(
        'https://www.googleapis.com/auth/firebase.messaging',
        config('foodtrucks.fcm_credentials'),
    );
    $token = $credentials->fetchAuthToken(HttpHandlerFactory::build(new Client(['timeout' => 8, 'connect_timeout' => 3])));
    if (empty($token['access_token'])) {
        throw new RuntimeException('No access token.');
    }
    echo "Google ha aceptado la credencial FCM de DEV. Falta verificar la entrega en un dispositivo registrado.\n";
} catch (Throwable $exception) {
    fwrite(STDERR, json_encode(['status' => 'fcm_auth_failed', 'error' => $exception::class])."\n");
    exit(1);
}
