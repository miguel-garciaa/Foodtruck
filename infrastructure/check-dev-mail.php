<?php

use Illuminate\Contracts\Console\Kernel;
use Illuminate\Support\Facades\Mail;

// Run through stdin in the DEV API container; credentials remain in its private environment.
require '/app/vendor/autoload.php';
$app = require '/app/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$recipients = array_values(config('foodtrucks.email_allowlist', []));
if (! $app->environment('dev') || ! config('foodtrucks.email_enabled') || count($recipients) !== 1) {
    fwrite(STDERR, "La prueba requiere DEV, correo activado y un único destinatario autorizado.\n");
    exit(1);
}

try {
    Mail::raw(
        'Prueba técnica de Foodtrucks DEV. Laravel y Resend están conectados. Este correo no contiene enlaces de acceso ni contraseñas.',
        fn ($message) => $message->to($recipients[0])->subject('Prueba de correo · Foodtrucks DEV'),
    );
    echo "Resend ha aceptado el correo de prueba. Verifica la entrega en su panel.\n";
} catch (Throwable $exception) {
    $detail = $exception->getMessage();
    $key = (string) config('services.resend.key');
    if ($key !== '') {
        $detail = str_replace($key, '[redacted]', $detail);
    }
    $detail = preg_replace('/re_[A-Za-z0-9_-]+|Bearer\s+[^\s]+/', '[redacted]', $detail);
    fwrite(STDERR, json_encode(['status' => 'mail_failed', 'error' => $exception::class, 'detail' => mb_substr($detail, 0, 600)], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE)."\n");
    exit(1);
}
