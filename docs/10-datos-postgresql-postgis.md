# PostgreSQL, PostGIS y entidades

**Cerrado:** PostgreSQL como fuente duradera y PostGIS para geografía. **Base propuesta:** este modelo, nombres de tablas/campos y restricciones; todavía no existen migraciones.

## Modelo lógico

| Entidad | Datos esenciales y relación |
| --- | --- |
| users | ID, email, verificación, hash contraseña opcional, estado |
| auth_identities | Usuario, proveedor, subject verificado; unicidad proveedor/subject |
| sessions | Usuario, hash refresh, expiración, familia/rotación, revocación |
| verification_tokens | Propósito, hash, usuario, expiración y consumo |
| food_trucks | Identidad comercial, descripción, estado y aceptación de pedidos |
| truck_memberships | Usuario/negocio/permiso; soporte multiusuario pendiente |
| truck_locations | Negocio, punto, dirección, periodo operativo y fecha publicada |
| opening_hours | Horarios, zona horaria y excepciones |
| products | Negocio, nombre, descripción, precio en unidad mínima, moneda, disponibilidad |
| product_options | Complementos/configuración; alcance pendiente |
| product_allergens | Información declarada del producto |
| media_assets | Propietario, ruta relativa segura, tipo, tamaño, dimensiones, visibilidad |
| pickup_slots | Lugar, intervalo, capacidad si se adopta |
| orders | Cliente, negocio, estados, importes, moneda, recogida y versión |
| order_items | Producto referenciado e instantáneas de nombre/precio/opciones/cantidad |
| payments | Pedido, cuenta Stripe, PaymentIntent, importe, estado y reembolsos |
| merchant_billing | Negocio, customer de plataforma, suscripción y acceso |
| pickup_tokens | Pedido, hash de token, expiración/revocación y canje |
| stripe_events | Evento recibido, entorno, contexto de cuenta, resultado/reintentos |
| idempotency_records | Actor, operación, clave, hash de petición y resultado recuperable |
| outbox_events | Tipo, agregado/version, payload mínimo y entrega |
| device_tokens | Usuario, plataforma, token push, entorno y revocación |
| audit_events | Actor, acción, recurso, fecha y contexto mínimo |
| customer_memberships | Usuario/plan, proveedor/contexto, estado y periodo de derechos |
| loyalty_accounts | Cuenta y proyección transaccional de puntos |
| loyalty_entries | Movimientos inmutables con regla y origen único |
| loyalty_reservations | Puntos retenidos por intención de compra y vencimiento |
| promotions | Campaña, elegibilidad, vigencia, financiador y límites |
| promotion_redemptions | Uso/reserva por usuario, pedido y campaña |
| email_deliveries | Entrega lógica, outbox, entorno, plantilla/version, clave idempotente e ID Resend cuando exista |
| email_webhook_events | Entorno, ID del evento firmado, entrega referenciada y procesamiento deduplicado |
| communication_preferences | Usuario/canal/finalidad, preferencia y evidencia mínima de consentimiento/baja |
| email_suppressions | Destinatario protegido, alcance, motivo técnico/preferencia y revisión controlada |

Cuenta Connect para ventas y customer Billing para pagar software son referencias distintas. No asociar eventos solo por el ID de objeto sin entorno y cuenta Stripe.

## Integridad

Usar PK, FK, NOT NULL y CHECK apropiados. Cantidades positivas, importes no negativos y moneda coherente por pedido. Dinero en unidades mínimas enteras; nunca float para sumar precios. No asumir que todas las monedas tienen dos decimales.

Unicidad de eventos/idempotencia, identities y canje. Índices propuestos según consultas: pedidos por negocio/estado/fecha, historial por cliente/fecha, productos por negocio y GiST geográfico. Confirmar planes antes de añadir índices indiscriminados.

Definir normalización de email y unicidad de forma consistente. Guardar instantes en timestamptz y zona IANA para horarios locales; probar cambios de hora.

## Geografía

Base propuesta: geography(Point,4326) para búsquedas por radio en metros e índice GiST. En GeoJSON el orden es longitud, latitud. Validar rangos, bbox, radio y tamaño de resultados. Para bbox, elegir consulta/indexación compatible con el tipo y revisar plan.

ST_DWithin ofrece búsqueda por distancia que puede aprovechar índice espacial. No reemplazar PostGIS por un conjunto Redis GEO como única fuente. [Referencia PostGIS](https://postgis.net/docs/ST_DWithin.html).

## Instantáneas y cambios

Precio y descripción del pedido no se reescriben al editar productos. Fijar lugar de recogida y fecha de referencia. Una ubicación nueva del puesto no debe cambiar silenciosamente un pedido pagado.

Stock/franjas pendientes: si se implementan, usar bloqueos/actualizaciones condicionales en PostgreSQL. Pago recibido tras expirar una reserva necesita conciliación y compensación, no sobreventa automática.

## Migraciones y retención

Migraciones versionadas y revisadas; herramienta goose propuesta. No eliminar columnas/datos sin plan explícito. En tablas grandes evaluar locks, creación de índices y cambios por fases. Backfill separado y medido.

Política de retención, anonimización, documentos económicos y eliminación de cuenta pendiente de producto/legal. No aplicar borrado en cascada que destruya pedidos o evidencia financiera.

## Integridad de puntos y descuentos

Puntos enteros, registro de crédito/débito/compensación y unicidad por evento de origen. La proyección de saldo debe actualizarse con el registro en la misma transacción y poder reconciliarse; evitar canje concurrente superior al saldo disponible.

Orders conserva subtotal elegible, descuentos, total final, regla/campaña y financiación como instantánea. Un reembolso parcial genera ajuste identificado, no edición histórica. Definir retención y tratamiento de reservas/puntos tras baja. [Reglas pendientes](25-suscripcion-clientes-fidelizacion.md).

## Persistencia de comunicaciones, base propuesta

No convertir una fila de email_deliveries en un duplicado del evento de negocio: referenciar el origen y restringir duplicados por entrega lógica/entorno. Guardar estados y fechas de entrega mínimos; los eventos pueden repetirse y llegar desordenados. Separar procesamiento del webhook y el estado agregado de la entrega.

El permiso de marketing no procede de la membresía de pago. Registrar finalidad, versión de información y baja sin acumular datos innecesarios. Una baja promocional y una supresión técnica por rebote no son el mismo estado; ambas se revisan antes de enviar. Definir normalización de destinatarios, protección y retención antes de la migración.

Guardar hash del token de verificación/reset en verification_tokens. Si la entrega diferida requiere temporalmente el secreto original, usar payload cifrado con clave fuera de PostgreSQL/backups y purgarlo tras aceptación o expiración; no guardar el token legible en outbox ni logs. Esta protección y sus rotaciones deben diseñarse al implementar. [Resend](30-correo-resend.md).

## Publicación SEO y medición: extensiones por evaluar

Añadir únicamente lo que exijan consultas y publicación reales: estado editorial/publicación del negocio, slug estable y redirecciones, versión/fecha de cambios, origen y vigencia de ubicación/horarios, categorías/ciudades justificadas y contenido publicado. Las ubicaciones temporales no se convierten en direcciones permanentes inventadas. Identidad financiera y pedidos siguen utilizando IDs estables.

Consentimientos por finalidad/version deben distinguirse de communication_preferences de email/push. Si se conserva evidencia, definir sujeto/dispositivo, alcance, fecha, retirada y retención mínimos. No crear perfiles de marketing por defecto ni asumir que consentir en un dispositivo autoriza todos los demás.

Usar eventos de negocio/outbox y un control duradero de despacho para deduplicación de conversiones cuando corresponda; no una segunda fuente de verdad de compras. No persistir PII/QR/tokens en payloads analíticos ni confiar en transaction_id de GA4 como deduplicación del stream de app. Nombres/esquemas finales pendientes según [publicación](32-seo-local-nextjs.md) y [medición](34-analitica-consentimiento.md).
