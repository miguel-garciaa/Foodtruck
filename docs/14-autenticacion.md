# Autenticación propia y autorización

**Actualización técnica, 22/10/2026 (D47):** Laravel/PHP es el backend principal. Composer y su lockfile, las migraciones Laravel y [OpenAPI](../contracts/openapi.json) son las fuentes ejecutables; comandos y operación DEV en la [guía del backend](../backend/README.md). Las reglas siguientes se aplican a Laravel; Go queda reservado para una necesidad futura aprobada.

**Cerrado:** email/contraseña, Google y Apple, sin Supabase ni Firebase Authentication. FCM puede utilizarse solo para avisos.

## Identidad local

Backend Laravel con usuarios en PostgreSQL y Hash/Argon2id en la implementación DEV; parámetros calibrados con presupuesto de CPU/memoria. No diseñar criptografía propia ni guardar contraseñas reversibles.

Registro, verificación de email, recuperación con token aleatorio, expiración y consumo único. Guardar hashes de tokens de verificación/renovación. Respuestas que eviten enumeración, límites de intentos y auditoría mínima sin secretos.

**Proveedor de envío cerrado: Resend (U07).** Dominio/remitentes, política de contraseñas, expiraciones y buzón de respuesta pendientes. [Configuración del correo](30-correo-resend.md).

## Google y Apple

OIDC/OAuth con comprobación backend de firma, issuer, audience/client ID, expiración y nonce cuando aplique. Flujo de autorización con state y PKCE en clientes públicos cuando corresponda; redirects en allowlist exacta.

Vincular identidad por proveedor y subject, no solo por email. No fusionar automáticamente cuentas por coincidencia de correo. Para vincular, exigir sesión válida y prueba de control de ambas identidades.

Apple puede facilitar email privado y nombre solo en ocasiones concretas; no depender de recibirlos en cada login. Verificar IDs, audiencias, nonces y configuración de cada build contra el código y secretos del entorno; Apple y las pruebas completas en dispositivo siguen pendientes.

La inclusión de Apple es requisito actual. Antes de distribuir revisar reglas de tienda vigentes; no tratar una recomendación histórica de cumplimiento como evaluación final.

## Sesiones, base propuesta

Access tokens cortos y refresh con rotación, revocación y detección de reutilización. Guardar refresh hasheado con familia/expiración. DEV implementa tokens opacos Sanctum de 15 minutos y refresh hasheado rotatorio de 30 días; son la base móvil vigente, no una sesión web ya implementada.

Móvil: Keychain/Keystore mediante solución Expo compatible. Web: cookies Secure/HttpOnly con SameSite apropiado al flujo y protección CSRF para mutaciones. No guardar refresh tokens en localStorage.

Coordinar refresh concurrente del cliente para no invalidar varias peticiones legítimas. La detección de reutilización debe revocar la familia y obligar a autenticarse de nuevo según política aprobada.

Logout y cambio/reset de contraseña revocan sesiones según política; no confiar en borrar un token solo en el teléfono. Caída de Redis no debe revalidar sesiones revocadas.

## Autorización

Cliente: solo sus pedidos, tickets, perfil y dispositivos. Comerciante: negocios a los que pertenezca y pedidos de esos negocios. Administrador: acciones explícitas y auditadas.

Una cuenta puede ser cliente y propietaria. Modelo multiempleado/varios negocios pendiente. Verificar permisos en cada endpoint, query y conexión de tiempo real; ID aleatorio no sustituye autorización.

## Pruebas

Enumeración, acceso entre usuarios/negocios, recuperación reutilizada/expirada, token con issuer/audience incorrectos, OAuth sin state/nonce válido, vinculación fraudulenta, refresh concurrente y acceso después de revocar.

Auth email/contraseña y Google están implementadas en DEV; el correo técnico Resend se ha entregado según la [guía del backend](../backend/README.md). Esto no acredita todos los recorridos móviles, Apple ni la sesión web.

## Derechos de membresía y saldo privado

La membresía es un derecho de producto asociado al usuario; no reemplaza autenticación ni permisos. Nunca habilitarla por un rol enviado por cliente o por una suscripción comercial no relacionada.

Saldo/historial son privados. Una cuenta propietaria puede contratar como cliente sin nuevas credenciales. Proteger contratación/canje de duplicados entre sesiones/dispositivos y no borrar movimientos al revocar una sesión.

## Dominio, enlaces y correo de identidad

Proponer HTTPS del dominio adquirido en Cloudflare como origen de enlaces de verificación/reset. Construir URLs a partir de configuración servidor en allowlist, nunca de Host, X-Forwarded-Host o un return_to arbitrario. Abrir un enlace muestra el flujo; consumir el token requiere una acción POST explícita, para que escáneres de correo no lo gasten.

Evitar que proxies, access logs, analítica, errores y recursos externos capturen tokens. No registrar query strings sensibles; página de identidad con no-store y política de referrer apropiada, sin tracking de enlaces/clics del proveedor. Resend no sustituye la autenticación propia.

Registrar orígenes/redirects OAuth exactos de producción y staging después de elegir hostname y transporte; no usar comodines. Para Apple Private Email Relay, registrar y autenticar las fuentes reales de correo según la guía Apple, incluyendo los dominios efectivamente usados por Resend. Probar un destinatario relay antes del piloto. [Detalle de relay y DNS](30-correo-resend.md).

Si se utilizan cookies en web, mantenerlas host-only cuando baste y no compartirlas indiscriminadamente con assets, mail o staging. La API móvil usa su propio mecanismo de sesión; no debe depender de resolver un challenge de navegador de Cloudflare. [Dominio y protección](29-cloudflare-dominio-dns.md).
