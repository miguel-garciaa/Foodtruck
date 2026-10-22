<?php

// Run through stdin in the DEV API container; credentials remain in its private environment.
require '/app/vendor/autoload.php';
$app = require '/app/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$recipients = array_values(config('foodtrucks.email_allowlist', []));
if (! $app->environment('dev') || ! config('foodtrucks.email_enabled') || count($recipients) !== 1) {
    fwrite(STDERR, "La prueba requiere DEV, correo activado y un único destinatario autorizado.\n");
    exit(1);
}

try {
    Illuminate\Support\Facades\Mail::raw(
        'Prueba técnica de Foodtrucks DEV. Laravel y Resend están conectados. Este correo no contiene enlaces de acceso ni contraseñas.',
        fn ($message) => $message->to($recipients[0])->subject('Prueba de correo · Foodtrucks DEV'),
    );
    echo "Resend ha aceptado el correo de prueba. Verifica la entrega en su panel.\n";
} catch (Throwable) {
    fwrite(STDERR, "Resend no ha aceptado el correo de prueba. Revisa la configuración privada y el panel del proveedor.\n");
    exit(1);
}
