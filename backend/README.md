# API Foodtrucks DEV

Backend Laravel 13/PHP 8.5. API REST para Android; Go queda reservado. Alcance actual en implementación: cuentas, perfil, favoritos, anuncios revisados, fotos y outbox. Pagos, tiendas y producción fuera de este hito.

Desde la raíz, en Ubuntu con Docker/Compose:

```sh
sh infrastructure/prepare-dev.sh
sudo docker compose config --quiet
sudo docker compose up -d --build
sudo docker compose ps
curl --fail http://127.0.0.1:8080/up
```

Compose construye la imagen compartida una sola vez desde `migrate`; API, colas, planificador y revisión reutilizan esa imagen local. Preparación no sobrescribe secretos existentes. El runtime usa UID/GID 1000, comprobado para miguel en la VM; conserva los archivos privados 600. No borrar postgres ni uploads. La imagen no contiene secretos. El puerto del origen permanece en loopback, con SSH local 8085. La publicación DEV mediante Tunnel, la clave Resend y la credencial FCM están autorizadas por D50; autorización no acredita conexión ni entrega de mensajes.

`.private/providers.env` contiene nombres de configuración; mantenerlo privado y fuera de Git. El registro por correo devuelve 503 hasta activar Resend y su allowlist. FCM necesita `.private/providers/fcm-service-account.json` mínimo; Google, `GOOGLE_WEB_CLIENT_ID`. No utilizar credenciales de otros proyectos. `google-services.json` se queda en Android y nunca sustituye la cuenta de servicio del servidor.

Para publicar DEV, provisionar `.private/cloudflared-token` con permisos 600 y usar ambos archivos Compose:

```sh
sudo docker compose -f compose.yaml -f compose.tunnel.yaml up -d --build
```

En Cloudflare, el único hostname autorizado es `api-dev.foodtruck.bid`, con servicio `http://caddy:8080` y respuesta final 404 para rutas sin coincidencia. El conector usa una conexión saliente; no abre puertos del router ni expone PostgreSQL/Redis. Caddy normaliza la IP del cliente desde `CF-Connecting-IP` del conector privado y Laravel acepta HTTPS únicamente desde proxies internos. Los hosts permitidos son el dominio DEV y loopback. La clave del túnel se lee desde archivo y no aparece en argumentos ni imágenes.

Correo: `RESEND_API_KEY`, `MAIL_FROM_ADDRESS=no-reply@foodtruck.bid`, `FOODTRUCKS_EMAIL_ENABLED=true` y `DEV_EMAIL_ALLOWLIST` con el destinatario autorizado en `.private/providers.env`. Recrear API, worker y scheduler al cambiar ese archivo. El token privado de FCM se añade a la carpeta montada de proveedores, sin incorporarlo a la app.

Prueba de correo, solo con autorización de envío al único destinatario de la allowlist:

```sh
sudo docker compose -f compose.yaml -f compose.tunnel.yaml exec -T api foodtrucks-entrypoint php < infrastructure/check-dev-mail.php
```

El resultado del comando acredita aceptación por Resend; comprobar `Delivered` en el panel para acreditar entrega. La recepción de una notificación FCM también exige una prueba en el dispositivo registrado.

Comprobación privada de la credencial FCM, sin imprimir el token ni enviar mensajes:

```sh
sudo docker compose -f compose.yaml -f compose.tunnel.yaml exec -T api foodtrucks-entrypoint php < infrastructure/check-dev-fcm.php
```

Verificado el 22/10/2026 sobre la VM: HTTPS público `/up` y listado `200`, cuenta sin sesión `401`, `.env` y Horizon `404`; ruta exclusiva `api-dev.foodtruck.bid` hacia `http://caddy:8080`. Resend aceptó el correo técnico y su panel confirmó `Delivered`. La clave guardada inicialmente no correspondía a la activa: se sustituyó, se comprobó el envío y se revocó la anterior. Google aceptó la credencial FCM y el rol de la cuenta se verificó en IAM como Firebase Cloud Messaging API Admin. El 23/10 se comprobó en Pixel_10 el acceso Google contra esta VM, la recuperación de sesión, el avatar privado y FCM real en primer/segundo plano con apertura desde el aviso. Los recorridos completos de anuncios y búsqueda, la rotación de token y el cambio de cuenta siguen en QA; [evidencia Android](../apps/mobile/design-qa.md).

Para reconciliar una base DEV existente cuyo usuario de aplicación no coincide con el secreto privado actual:

```sh
sudo docker compose exec -T db sh /docker-entrypoint-initdb.d/10-app.sh
```

Este ajuste idempotente conserva tablas y volúmenes, aplica el secreto existente al usuario `foodtrucks` sin privilegios de administración y repara los permisos de tablas actuales y futuras. No imprime la contraseña ni la pasa como argumento de proceso. `docker compose exec` omite el entrypoint del contenedor; para comandos Artisan que necesiten los secretos usa `sudo docker compose exec -T api foodtrucks-entrypoint php artisan ...` o `docker compose run`.

Revisión por operador SSH (actor declarado, con auditoría y versión obligatorias):

```sh
sudo docker compose run --rm review php artisan foodtrucks:review list
sudo docker compose run --rm review php artisan foodtrucks:review approve UUID --expected-version=2 --actor=miguel
sudo docker compose run --rm review php artisan foodtrucks:review return UUID --expected-version=2 --actor=miguel --reason='Completa los horarios'
```

Comprobaciones locales sin proveedor:

```sh
composer install
cp .env.example .env
php vendor/bin/pint --test
php vendor/bin/phpstan analyse --memory-limit=512M
php vendor/bin/phpunit --filter=BoundaryTest
```

Windows no dispone de pcntl/posix/GD en el PHP instalado: Horizon y fotos requieren el contenedor Linux. En Windows solo se omiten los dos requisitos de plataforma pcntl/posix durante instalación; Linux/CI comprueban todos.

Pruebas de integración: PostgreSQL/PostGIS desechable con nombre exacto `foodtrucks_testing`, credenciales por entorno y `php vendor/bin/phpunit --fail-on-warning --fail-on-risky`. El guard impide migrar otra base. CI construye el target `checks` con dependencias de desarrollo, ejecuta las pruebas y arranca el Compose real con secretos efímeros para verificar migraciones, salud HTTP y límites de acceso. No apuntar tests a la DB DEV. Pint, Larastan y Composer audit no sustituyen pruebas con DB ni recepción real de email/push.

Migraciones de negocio no hacen rollback destructivo automático; recuperar copia verificada o corregir hacia delante. Conservar APP_KEY: cifra el contenido privado de la outbox y los tokens FCM. Su pérdida impide descifrar los avisos pendientes; nunca regenerarla sobre una instalación existente.
