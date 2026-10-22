# Backend Laravel

**Decisión vigente, 21/10/2026:** Laravel/PHP es el backend principal por instrucción expresa del usuario. Sustituye Go/Chi/pgx/sqlc; Go queda reservado para necesidades específicas futuras y no se ejecuta otro backend ahora. Se conserva este nombre de archivo para mantener enlaces históricos.

## Implementación DEV

Laravel 13 sobre PHP 8.5, PostgreSQL/PostGIS, Sanctum para tokens móviles, Horizon sobre Redis y scheduler Laravel. Composer y su lock fijan dependencias reales. API, worker y scheduler comparten imagen; Caddy solo publica en loopback del servidor DEV; Cloudflare Tunnel da entrada HTTPS a api-dev.foodtruck.bid conforme a D50. No se incluye un frontend Laravel ni un segundo sistema de autenticación.

Form Requests/validación del servidor, Policies para propiedad, Resources para respuestas, Eloquent y SQL parametrizado donde PostGIS lo necesita. No Repository Pattern ni una clase por operación trivial. Contrato canónico: [OpenAPI](../contracts/openapi.json), con tipos móviles generados. Migraciones en backend/database/migrations; no otra fuente de esquema Go/sqlc.

El código está en implementación: arranque de Artisan, Pint, Larastan y pruebas HTTP sin DB se comprueban localmente. Las pruebas de negocio exigen PostgreSQL/PostGIS aislado; ver CI y guía del backend para resultados reales. No equivalen a despliegue ni QA Android completo.

## HTTP, identidad y seguridad

Auth propia con Argon2id, tokens de acceso Sanctum de 15 minutos y refresh rotatorio de 30 días, almacenado como hash. La reutilización revoca la familia; logout y cambios de contraseña desvinculan dispositivos. Correo verificado mediante token único hasheado. Recuperación con el broker Laravel. Google valida firma, emisor, audiencia, caducidad y nonce de un solo uso, sin fusionar cuentas por coincidencia de email. Credenciales de proveedores pendientes mantienen sus funciones deshabilitadas explícitamente.

Límites de cuerpo, intentos y uploads; errores JSON sin detalles internos. Autorizar cada recurso independientemente del modo de navegación. No registrar tokens, cuerpos privados, contraseñas ni payloads de correo. Telescope está instalado solo en desarrollo y deshabilitado, sin watchers; Horizon no ofrece dashboard público.

## Anuncios, datos y fotos

Separar borrador y versión publicada. Ediciones con versión optimista y bloqueo corto; publicación únicamente tras revisión CLI auditada en Ubuntu. Un cambio de modo no concede permisos de administrador ni acceso a otro negocio. Búsqueda sobre anuncios publicados con PostGIS, localidad/provincia sin acentos, filtros AND y céntimos enteros inclusivos. Valoraciones nulas no se inventan.

Fotos JPEG/PNG con límites de bytes y píxeles, decodificación y nueva codificación para retirar metadatos; nombres aleatorios y almacenamiento local privado persistente. Acceso por propiedad o referencia publicada. No servir directorios, configuración o backups.

## Transacciones, jobs y outbox

Guardar intención de aviso y cambio de negocio en la misma transacción PostgreSQL. Reclamar lotes con SKIP LOCKED, lease recuperable y reintentos limitados. Horizon transporta solamente IDs opacos; el payload permanece cifrado en PostgreSQL y se elimina al entregar, caducar o agotar intentos. Redis no decide permisos ni es autoridad duradera. Llamadas externas fuera de transacciones y con timeout; entrega al menos una vez, con IDs estables para deduplicar.

Resend usa el transporte nativo de Laravel y resend/resend-php; claves solo servidor. DEV limita destinatarios. FCM HTTP v1 usa una cuenta de servicio independiente configurada en DEV y comprueba sesión/dispositivo vigentes antes de enviar. Sin Firebase Authentication, Analytics ni servicios adicionales.

## Alcance posterior y pruebas

Auth, usuarios, negocios, catálogo y avisos componen este hito. Pedidos, Billing/Connect, membresías, campañas, stock, puntos y QR continúan como responsabilidades futuras del monolito, sujetas a sus decisiones comerciales. PostgreSQL conserva importes, reglas versionadas, ledger y transacciones; ningún cliente marca pagado o entregado. No mantener locks durante llamadas a Stripe. Reintentos económicos idempotentes, deduplicación de webhooks y conciliación de resultados inciertos.

QR de canje único atómico; reservas y expiración de stock solo si se aprueban. Redis no arbitra el último producto. Tests futuros de doble canje/compra, importes alterados, webhooks duplicados/fuera de orden y recuperación; no se presentan como funciones implementadas.

PHPUnit cubre comportamiento HTTP, aislamiento, renovación/replay, revisión y filtros con PostgreSQL/PostGIS real. Pint y Larastan completan la revisión estática. Sentry/OTel/Prometheus se incorporarán por necesidad medida y sin PII/secretos: métricas no sustituyen ledger ni ventas confirmadas. [QA](40-testing-qa-github.md), [operación](41-observabilidad-grafana-prometheus-sentry.md).
