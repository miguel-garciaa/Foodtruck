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

Preparación no sobrescribe secretos existentes. El runtime usa UID/GID 1000, comprobado para miguel en la VM; conserva los archivos privados 600. No borrar postgres ni uploads. La imagen no contiene secretos. La API solo se publica en loopback, con SSH local 8085. Cloudflare Tunnel y nueva clave Resend han quedado pendientes por decisión del usuario.

`.private/providers.env` contiene nombres de configuración; mantenerlo privado y fuera de Git. El registro por correo devuelve 503 hasta activar Resend y su allowlist. FCM necesita `.private/providers/fcm-service-account.json` mínimo; Google, `GOOGLE_WEB_CLIENT_ID`. No utilizar credenciales de otros proyectos. `google-services.json` se queda en Android y nunca sustituye la cuenta de servicio del servidor.

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

Pruebas de integración: PostgreSQL/PostGIS desechable con nombre exacto `foodtrucks_testing`, credenciales por entorno y `php vendor/bin/phpunit --fail-on-warning --fail-on-risky`. El guard impide migrar otra base. CI construye el target `checks` con dependencias de desarrollo, ejecuta las pruebas y construye la imagen `runtime`. No apuntar tests a la DB DEV. Pint, Larastan y Composer audit no sustituyen pruebas con DB ni recepción real de email/push.

Migraciones de negocio no hacen rollback destructivo automático; recuperar copia verificada o corregir hacia delante. Conservar APP_KEY: cifra el contenido privado de la outbox y los tokens FCM. Su pérdida impide descifrar los avisos pendientes; nunca regenerarla sobre una instalación existente.
