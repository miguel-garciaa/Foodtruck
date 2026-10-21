# Autenticación propia y autorización

**Actualización 21/10/2026 (D47–D49):** Laravel/PHP sustituye Go como backend principal. Las recetas Go/sqlc siguientes conservan contexto histórico y no son comandos del backend activo. Mandan Composer, migraciones Laravel, OpenAPI y la [guía real del backend](../backend/README.md). Google se incluye en este hito; foodtruck.bid está verificado en Resend. Nueva clave de envío y Cloudflare Tunnel aplazados expresamente; no hay publicación de API.

**Cerrado:** email/contraseña, Google y Apple, sin Supabase ni Firebase Authentication. FCM puede utilizarse solo para avisos.

## Identidad local

Backend Go con usuarios en PostgreSQL. Argon2id fue la base propuesta; usar biblioteca mantenida, sal única y parámetros calibrados con presupuesto de CPU/memoria. No diseñar criptografía propia ni guardar contraseñas reversibles.

Registro, verificación de email, recuperación con token aleatorio, expiración y consumo único. Guardar hashes de tokens de verificación/renovación. Respuestas que eviten enumeración, límites de intentos y auditoría mínima sin secretos.

**Proveedor de envío cerrado: Resend (U07).** Dominio/remitentes, política de contraseñas, expiraciones y buzón de respuesta pendientes. [Configuración del correo](30-correo-resend.md).

## Google y Apple

OIDC/OAuth con comprobación backend de firma, issuer, audience/client ID, expiración y nonce cuando aplique. Flujo de autorización con state y PKCE en clientes públicos cuando corresponda; redirects en allowlist exacta.

Vincular identidad por proveedor y subject, no solo por email. No fusionar automáticamente cuentas por coincidencia de correo. Para vincular, exigir sesión válida y prueba de control de ambas identidades.

Apple puede facilitar email privado y nombre solo en ocasiones concretas; no depender de recibirlos en cada login. URLs, client IDs, bundle IDs y credenciales de proveedores no existen aún.

La inclusión de Apple es requisito actual. Antes de distribuir revisar reglas de tienda vigentes; no tratar una recomendación histórica de cumplimiento como evaluación final.

## Sesiones, base propuesta

Access tokens cortos y refresh con rotación, revocación y detección de reutilización. Guardar refresh hasheado con familia/expiración. Diseño exacto JWT frente a token opaco y duración pendiente.

Móvil: Keychain/Keystore mediante solución Expo compatible. Web: cookies Secure/HttpOnly con SameSite apropiado al flujo y protección CSRF para mutaciones. No guardar refresh tokens en localStorage.

Coordinar refresh concurrente del cliente para no invalidar varias peticiones legítimas. La detección de reutilización debe revocar la familia y obligar a autenticarse de nuevo según política aprobada.

Logout y cambio/reset de contraseña revocan sesiones según política; no confiar en borrar un token solo en el teléfono. Caída de Redis no debe revalidar sesiones revocadas.

## Autorización

Cliente: solo sus pedidos, tickets, perfil y dispositivos. Comerciante: negocios a los que pertenezca y pedidos de esos negocios. Administrador: acciones explícitas y auditadas.

Una cuenta puede ser cliente y propietaria. Modelo multiempleado/varios negocios pendiente. Verificar permisos en cada endpoint, query y conexión de tiempo real; ID aleatorio no sustituye autorización.

## Pruebas

Enumeración, acceso entre usuarios/negocios, recuperación reutilizada/expirada, token con issuer/audience incorrectos, OAuth sin state/nonce válido, vinculación fraudulenta, refresh concurrente y acceso después de revocar.

No hay autenticación implementada, correo configurado ni cuentas OAuth creadas.

## Derechos de membresía y saldo privado

La membresía es un derecho de producto asociado al usuario; no reemplaza autenticación ni permisos. Nunca habilitarla por un rol enviado por cliente o por una suscripción comercial no relacionada.

Saldo/historial son privados. Una cuenta propietaria puede contratar como cliente sin nuevas credenciales. Proteger contratación/canje de duplicados entre sesiones/dispositivos y no borrar movimientos al revocar una sesión.

## Dominio, enlaces y correo de identidad

Proponer HTTPS del dominio adquirido en Cloudflare como origen de enlaces de verificación/reset. Construir URLs a partir de configuración servidor en allowlist, nunca de Host, X-Forwarded-Host o un return_to arbitrario. Abrir un enlace muestra el flujo; consumir el token requiere una acción POST explícita, para que escáneres de correo no lo gasten.

Evitar que proxies, access logs, analítica, errores y recursos externos capturen tokens. No registrar query strings sensibles; página de identidad con no-store y política de referrer apropiada, sin tracking de enlaces/clics del proveedor. Resend no sustituye la autenticación propia.

Registrar orígenes/redirects OAuth exactos de producción y staging después de elegir hostname y transporte; no usar comodines. Para Apple Private Email Relay, registrar y autenticar las fuentes reales de correo según la guía Apple, incluyendo los dominios efectivamente usados por Resend. Probar un destinatario relay antes del piloto. [Detalle de relay y DNS](30-correo-resend.md).

Si se utilizan cookies en web, mantenerlas host-only cuando baste y no compartirlas indiscriminadamente con assets, mail o staging. La API móvil usa su propio mecanismo de sesión; no debe depender de resolver un challenge de navegador de Cloudflare. [Dominio y protección](29-cloudflare-dominio-dns.md).
