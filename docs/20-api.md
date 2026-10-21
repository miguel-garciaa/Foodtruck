# API REST propuesta

**Estado:** contrato preliminar para desarrollar; no hay endpoints implementados ni OpenAPI generado. Prefijo propuesto /api/v1. Go es la autoridad de validación y reglas de negocio.

## Convenciones

HTTPS, JSON, IDs opacos, fechas ISO 8601 en UTC y zona IANA cuando afecte a horarios. Coordenadas GeoJSON longitud/latitud. Dinero entero en unidad mínima y moneda explícita.

Paginación por cursor para historial/pedidos; límites máximos y filtros en allowlist. Autorización por objeto, no solo por rol. Cambios de estado con versión esperada para detectar concurrencia.

Idempotency-Key en creación de pedido/pago y devoluciones; alcance por actor/operación, comparar hash de payload. Repetir la clave con otro contenido devuelve conflicto. Retención de claves pendiente.

## Endpoints de referencia

| Método y ruta | Permiso/propósito |
| --- | --- |
| GET /health/live | Liveness sin información sensible |
| GET /health/ready | Readiness mínimo; limitar detalle operativo |
| POST /auth/register | Registro limitado |
| POST /auth/login | Login con rate limit |
| POST /auth/refresh | Rotación de sesión |
| POST /auth/logout | Revocar sesión actual |
| POST /auth/email/verify | Token de verificación |
| POST /auth/password/forgot | Respuesta no enumerativa |
| POST /auth/password/reset | Token único |
| POST /auth/google, /auth/apple | Verificación de identidad; transporte exacto pendiente |
| GET /me | Cuenta autenticada |
| GET /foodtrucks | Público: bbox/radio/filtros acotados |
| GET /foodtrucks/{id} | Perfil público visible |
| GET /foodtrucks/{id}/products | Carta pública |
| POST /orders | Cliente: intención de pedido e instantánea validada |
| POST /orders/{id}/payment | Cliente propietario: crear/recuperar pago |
| GET /orders | Historial propio paginado |
| GET /orders/{id} | Cliente propietario o miembro autorizado |
| GET /orders/{id}/pickup-ticket | Ticket protegido |
| POST /merchant/foodtrucks | Solicitud de alta |
| PATCH /merchant/foodtrucks/{id} | Miembro autorizado |
| PUT /merchant/foodtrucks/{id}/location | Posición/vigencia publicadas |
| PUT /merchant/foodtrucks/{id}/opening-hours | Horarios |
| POST/PATCH /merchant/foodtrucks/{id}/products | Carta del negocio |
| POST /merchant/foodtrucks/{id}/media | Upload limitado y autorizado |
| GET /merchant/foodtrucks/{id}/orders | Pedidos del negocio |
| POST /merchant/orders/{id}/transitions | Cambio permitido y versionado |
| POST /merchant/pickup/redemptions | Token QR; canje atómico |
| POST /merchant/foodtrucks/{id}/connect/onboarding | Enlace controlado Stripe |
| GET /merchant/foodtrucks/{id}/connect/status | Estado sincronizado/verificado |
| POST /merchant/foodtrucks/{id}/billing/checkout | Alta/suscripción web |
| POST /merchant/foodtrucks/{id}/billing/portal | Portal autorizado |
| POST /devices | Registrar token push propio |
| DELETE /devices/{id} | Retirar token propio |
| POST /webhooks/stripe/platform | Firma Stripe; Billing |
| POST /webhooks/stripe/connect | Firma Stripe; contexto Connect |
| POST /webhooks/resend | Firma Resend/Svix sobre body original; persistencia y deduplicación por entorno |
| GET /me/communication-preferences | Preferencias propias del usuario autenticado |
| PATCH /me/communication-preferences | Actualización autorizada por canal/finalidad, con evidencia mínima |
| POST /communications/email/unsubscribe | Baja promocional con token dedicado; contrato one-click por verificar |
| GET /orders/{id}/events | Candidato SSE; si se elige WebSocket, definir handshake |
| PATCH /admin/foodtrucks/{id}/status | Administrador autorizado y auditoría |

PUT de horarios/location es propuesta de reemplazo completo; diseñar PATCH distinto si se necesitan cambios parciales. Rutas de reembolso/cancelación quedan por definir al cerrar política. No implementar capacidades comerciales ambiguas a partir de esta tabla.

## Ejemplo ficticio: creación de pedido

~~~json
{
  "food_truck_id": "<ID_DEL_NEGOCIO>",
  "items": [
    { "product_id": "<ID_DEL_PRODUCTO>", "quantity": 2, "option_ids": [] }
  ],
  "pickup_slot_id": null,
  "notes": "Sin cebolla"
}
~~~

El cliente no fija total, comisión, precio, cuenta Stripe ni estado. Go puede aceptar IDs de opciones y los valida contra el producto. pickup_slot_id solo tendrá sentido si se aprueba ese modelo.

## Respuesta de error propuesta

~~~json
{
  "error": {
    "code": "PRODUCT_UNAVAILABLE",
    "message": "Uno de los productos ya no está disponible.",
    "fields": {},
    "request_id": "<ID_DE_PETICION>"
  }
}
~~~

400/422 para petición inválida según convención final; 401 sin sesión, 403 sin permiso, 404 para recurso inexistente/no visible según política, 409 para conflicto/estado concurrente, 429 con reintento y 5xx sin stack ni secretos.

## Compra recuperable

Separar creación local y pago externo; devolver identificador recuperable antes de depender del SDK. Si se desconoce resultado externo, recuperar/conciliar en el mismo contexto de cuenta. No crear nuevo cobro por timeout.

Webhooks requieren cuerpo original para firma, tamaño limitado y persistencia duradera. Endpoint no usa CSRF de sesión, pero conserva verificación propia.

## Contrato definitivo

Crear OpenAPI versionada al iniciar y tests de autorización/errores. Elegir generador de cliente TypeScript si simplifica mantener apps coherentes. El modelo final debe incluir límites, esquema de estados, versión de eventos y compatibilidad con clientes ya publicados.

## API preliminar de membresía, ofertas y puntos

| Método y ruta | Propósito/protección |
| --- | --- |
| GET /me/membership | Derechos/periodo del usuario autenticado |
| POST /me/membership/checkout | Contratación web por canal aprobado, idempotencia |
| POST /me/membership/portal | Gestión de suscripción propia, canal según proveedor |
| GET /me/loyalty | Puntos disponibles/pendientes/reservados propios |
| GET /me/loyalty/entries | Historial propio paginado |
| GET /offers | Campañas vigentes; elegibilidad personalizada autenticada |
| POST /orders/quote | Cotización autoritativa de productos/oferta/canje solicitado |

Extender POST /orders con ID de cotización/campaña y solicitud de puntos, según contrato por cerrar. Nunca aceptar importe de descuento o saldo como autoridad. Una cotización no reserva saldo por sí sola; reservas se crean explícitamente con expiración/versión e idempotencia. Revalidar derechos/campaña antes del pago y gestionar pago tardío.

Administración de campañas, canal nativo de compra y ajustes de puntos necesitan contrato/permisos definitivo. [Reglas y datos](25-suscripcion-clientes-fidelizacion.md).

## Dominio y webhooks de correo

La URL pública propuesta para eventos Resend es https://api.dominio.example/api/v1/webhooks/resend; dominio.example es un marcador. Preservar /api/v1 al enrutar desde Caddy. El endpoint no usa sesión/cookie/CSRF de usuario: usa firma del proveedor, cuerpo acotado y procesamiento idempotente. Cloudflare no lo cachea ni exige challenge interactivo; conserva controles de seguridad compatibles. [Guías DNS/proxy](29-cloudflare-dominio-dns.md) y [Resend](30-correo-resend.md).

No exponer una API pública de envío a direcciones arbitrarias. Preferencias son privadas y la baja usa un token con propósito exclusivo, sin dar acceso a pedidos/sesiones. Si se ofrece una página GET de baja, no consume tokens de verificación/reset ni ejecuta cambios de cuenta; diferenciar la acción POST one-click aprobada. Contrato final y retención pendientes.

## Datos públicos SEO y medición

Los GET públicos de negocios/catálogo solo devolverán establecimientos publicables y campos permitidos, con vigencia de ubicación/horarios/precios. Una baja pública no elimina internamente pedidos/evidencia económica. Fichas desconocidas/no visibles y cambios de slug tendrán estados/redirecciones coherentes entre Go y Next.js. [DTO/rutas propuestos](32-seo-local-nextjs.md).

No crear un endpoint público que permita al navegador declarar una purchase confirmada, recogida o ingreso de publicidad. Los hechos de negocio proceden de Go/Stripe/QR; el envío a GA4/Firebase depende de finalidad/consentimiento y deduplicación. Dashboards del cliente y vendedor filtran su ámbito; admin usa agregados/roles propios. Contrato de reportes y consentimiento se definirá al implementar. [Eventos](34-analitica-consentimiento.md).

## Inventario verificable y métricas operativas

[Doc39](39-seguridad-devsecops.md) amplía el inventario futuro de cada endpoint: autenticación, recurso/rol, entrada/salida, límites, riesgos y pruebas. La tabla de API continúa propuesta, sin endpoints probados. No publicar un endpoint /metrics como parte de la API cliente; habilitar recolección únicamente en una superficie interna/privada si se instrumenta.

Separar health mínimo público de readiness/detalle interno. Métricas normalizan rutas y no llevan IDs de usuarios/pedidos, tokens, querystrings o coordenadas. Pedidos/pagos/QR/puntos permanecen autoritativos en Go/PostgreSQL y no se modifican por una alerta o dashboard. [Observabilidad](41-observabilidad-grafana-prometheus-sentry.md).
