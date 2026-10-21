# Backend Go

**Cerrado:** Go + Chi + pgx/sqlc, PostgreSQL/PostGIS y Redis. **Base propuesta de C03/C06:** monolito modular y workers Go.

## Módulos y herramientas

Auth, usuarios/permisos, negocios/ubicaciones, catálogo, pedidos/recogida, Billing/Connect y notificaciones. Agrupar por responsabilidades significativas sin generar una capa por cada operación.

Chi para rutas y middleware; pgx para conexiones/transacciones; sqlc para código tipado desde SQL. La conversación propuso go-redis, stripe-go, goose, slog, OpenTelemetry y testing/Testcontainers. Verificar compatibilidad y fijar versiones al iniciar; instrumentación adicional y Testcontainers solo donde aporten evidencia útil.

## Procesamiento HTTP

Identificador de petición, logs estructurados, recuperación de errores inesperados, límites de cuerpo, timeout y propagación de contexto. Autenticar y autorizar por recurso, validar JSON/query/path y rechazar campos o tamaños no admitidos.

Configurar pool PostgreSQL y conexiones con presupuesto del servidor; límites concretos pendientes de carga medida. No lanzar goroutines sin límite ni sin estrategia de cancelación.

## Límite transaccional

Crear pedido, líneas con instantáneas, reserva si aplica y eventos duraderos dentro de PostgreSQL. El importe siempre se calcula con datos autorizados del servidor.

No mantener una transacción o un bloqueo SQL abierto mientras se espera a Stripe, email o push. Persistir la intención, realizar llamada externa con idempotencia y reconciliar el resultado. Tratar el caso de caída entre llamada y guardado local.

## Workers y outbox

En la misma transacción que el cambio del pedido, añadir un evento de outbox. Worker reclama lotes con bloqueo coordinado, entrega notificaciones y marca resultados. Aplicar reintentos con backoff, límite, registro de fallo y posibilidad de reproceso.

La entrega es al menos una vez; consumidores deben ser idempotentes. Redis Pub/Sub puede acelerar avisos de la app abierta, pero perder un mensaje no debe perder el evento persistido. C06 propuso este patrón; su esquema concreto sigue siendo propuesta.

## Pedidos y concurrencia

Transiciones de estado explícitas; cliente no marca “pagado” o “entregado”. Comerciante opera únicamente su negocio. Actualización condicional/versionada evita que solicitudes antiguas sobrescriban estados nuevos.

QR: canje único y cambio a entregado en una transacción. Stock/franjas, si se aprueban: reserva atómica, expiración y liberación por estados. No utilizar una caché como arbitraje del último producto.

## Pruebas importantes

SQL con PostgreSQL/PostGIS real, autorización entre negocios, doble canje, doble compra, importes alterados, webhooks duplicados/fuera de orden y recuperación de fallos externos. Probar contratos HTTP y workers sin depender de la UI.

No existe todavía go.mod, código generado sqlc, migraciones ejecutadas ni API implementada. [Contrato propuesto](20-api.md).

## Membresías, campañas y puntos

Añadir responsabilidades de membresía cliente, elegibilidad de ofertas, cálculo de puntos y canje/ajustes en el monolito. Persistir reglas versionadas y origen único de cada movimiento para que eventos repetidos no generen puntos adicionales.

Reservar puntos/cupo en PostgreSQL, con recuperación ante pago tardío o fallido. No mantener locks abiertos al llamar Stripe. Autorizar ajustes administrativos y verificar concordancia entre ledger, saldo y descuentos. [Diseño propuesto](25-suscripcion-clientes-fidelizacion.md).

## Correo con Resend

Proveedor cerrado por U07. Integración propuesta vía API HTTPS desde el worker Go, aprovechando outbox PostgreSQL. Un cliente net/http con timeout/contexto puede bastar; cliente oficial solo si aporta valor. Claves servidor, destinatarios y plantillas controlados, idempotencia por entrega lógica y reconciliación de resultados inciertos.

El webhook de Resend confirma eventos del correo, no pagos ni identidad por sí solo. Persistir y deduplicar la recepción firmada antes del procesamiento; ninguna transacción SQL permanece abierta durante una llamada externa. [Configuración, límites y pruebas](30-correo-resend.md).

## Seguridad, tests e instrumentación

U10 concreta tests de autorización/concurrencia/webhooks con Go y PostgreSQL/PostGIS real, según [QA](40-testing-qa-github.md). U11 propone métricas HTTP/outbox/DB y Sentry/OTel donde aporte valor. Instrumentar transacciones confirmadas y deduplicar eventos, sin mantener locks durante exportación.

Prometheus no sustituye un ledger duradero de pedidos; counters en memoria o reintentos no determinan ventas. Normalizar rutas y controlar etiquetas; eliminar secretos/PII antes de logs y telemetría. [Guía operativa](41-observabilidad-grafana-prometheus-sentry.md). No se han añadido módulos, generado sqlc o ejecutado tests de Go.
