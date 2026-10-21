# Correo con Resend: configuración e integración propuesta

**Actualización 21/10/2026 (D47–D49):** Laravel/PHP sustituye Go como backend principal. Las recetas Go/sqlc siguientes conservan contexto histórico y no son comandos del backend activo. Mandan Composer, migraciones Laravel, OpenAPI y la [guía real del backend](../backend/README.md). Google se incluye en este hito; foodtruck.bid está verificado en Resend. Nueva clave de envío y Cloudflare Tunnel aplazados expresamente; no hay publicación de API.

**Cerrado por el usuario:** Resend para los correos de Foodtrucks; compra futura del dominio en Cloudflare. **Estado:** especificación para implementar y configurar después. No se ha comprado el dominio, creado una cuenta/clave, publicado DNS, enviado correo ni implementado código. Fuentes oficiales consultadas el 13 de octubre de 2026; revisar las condiciones vigentes durante la configuración.

Los nombres `dominio.example` y sus subdominios son ejemplos reservados, no el dominio elegido. La configuración general del registrador, DNS, TLS y proxy está en [Cloudflare](29-cloudflare-dominio-dns.md). El dominio definitivo, buzón de soporte, región y plan de Resend siguen pendientes.

## Alcance y tipos de correo

Resend enviará desde el servidor Go, nunca desde React Native/Next.js cliente. La API propia conserva la autenticación, reglas, consentimiento y estado del pedido. Resend no sustituye auth propia ni PostgreSQL, y no decide si una venta está pagada o una membresía está activa.

| Clase propuesta | Disparador autoritativo y contenido |
| --- | --- |
| Verificación de email | Registro/cambio de dirección; enlace de propósito limitado |
| Recuperación de contraseña | Solicitud limitada y no enumerativa; enlace único |
| Aviso de seguridad | Cambio de contraseña/email o evento relevante, según política |
| Pedido | Confirmación de pago, rechazo/cancelación o resumen útil; datos desde Go |
| Recogida | Enlace al pedido autenticado si se adopta email además de push; no token QR |
| Comerciante | Alta, estado operativo y comunicaciones necesarias de su negocio |
| Suscripción | Alta/cambio/fallo/baja confirmados por proveedor; distinguir cliente y negocio |
| Ofertas/promociones | Canal promocional consentido, elegibilidad real y baja disponible |

Coordinar mensajes económicos con Stripe: decidir qué recibos/facturas genera Stripe y qué notificaciones de producto envía Resend. Registrar origen/ID para evitar enviar dos recibos equivalentes. Un resumen del pedido no se presenta como factura fiscal si no cumple el modelo definido. La cuota de cliente confirmada es **5,99 €/mes**; impuestos y reglas de descuentos continúan pendientes. Importes finales, moneda, impuestos y descuentos se renderizan desde instantáneas validadas del backend. [Pagos](13-stripe.md), [membresía](25-suscripcion-clientes-fidelizacion.md).

## Dominio remitente y DNS en Cloudflare

**Base propuesta:** verificar `mail.dominio.example` como dominio de envío. Utilizar, por ejemplo, `Foodtrucks <avisos@mail.dominio.example>` para correos operativos. Una futura separación de promociones en otro subdominio se evaluará cuando volumen, reputación y configuración lo justifiquen; requiere verificación propia. Resend recomienda subdominios y permite configurar envío y recepción por separado. [Dominios verificados](https://resend.com/docs/dashboard/domains/introduction).

Procedimiento futuro:

1. Proteger la cuenta Resend con MFA, roles mínimos y responsables identificados. Añadir el dominio/subdominio real que se controla en Cloudflare.
2. Elegir región después de definir mercado y tratamiento de datos. Anotar región, ID del dominio, intención de uso y responsable; no asumir que seleccionar una región de envío garantiza por sí solo residencia de todos los datos.
3. Mantener **Receiving desactivado** para el alcance inicial de envío. Revisar la pestaña de registros generados por ese dominio.
4. Copiar exactamente **tipo, nombre, contenido y prioridad** indicados por Resend. En Cloudflare comprobar el nombre completo resultante para evitar duplicar el sufijo de la zona. Usar TTL Auto como propuesta inicial.
5. Guardar los cambios e iniciar/comprobar la verificación en Resend. Confirmar resolución pública y estado verificado antes de habilitar envíos reales.

Los registros de envío que muestre la cuenta pueden ser **DKIM TXT y Return-Path SPF TXT/MX**, o **CNAME**; no instalar todos los patrones a la vez. La tabla es un mapa conceptual; sus nombres, destinos y claves no son valores de producción. [Alta de dominio](https://resend.com/docs/add-a-domain), [guía Cloudflare de Resend](https://resend.com/docs/guides/dns/cloudflare).

| Finalidad | Nombre ilustrativo si corresponde a ese patrón | Tipo/valor que debe publicarse |
| --- | --- | --- |
| Firma DKIM | `resend._domainkey.mail.dominio.example` | Registro y clave públicos generados por Resend; no copiar una clave de una guía |
| Return-Path para feedback | `send.mail.dominio.example` | SPF TXT y MX **si** ese dominio los muestra; prioridad y destino exactos del panel |
| Return-Path delegado | Nombre mostrado por el panel y su hermano con prefijo `r`, cuando proceda | Ambos CNAME generados **si** se ofrece este patrón |
| DMARC del remitente | `_dmarc.mail.dominio.example` | Una política revisada y destino de informes realmente atendido |
| Recepción de usuarios | Subdominio decidido para inbound | Solo si se aprueba recepción; independiente del Return-Path de envío |

Los CNAME de autenticación/Return-Path son **DNS only**, sin proxy naranja. TXT/MX no son registros HTTP proxificados. No añadir un A del subdominio de correo al servidor doméstico como requisito del envío. Si aparece un CNAME, no crear además TXT/MX incompatibles en el mismo nombre. El Return-Path predeterminado usa `send`; la documentación actual contempla CNAME y un hermano con prefijo `r`. Definirlo al crear el dominio: cambiarlo después puede requerir recrear el dominio y una transición operativa, no borrar en producción sin plan. [Return-Path](https://resend.com/docs/dashboard/domains/custom-return-path).

**SPF:** un solo registro `v=spf1` por nombre DNS. Si varios servicios usan exactamente ese nombre, revisar/combinar la política existente sin sobrepasar sus límites de consultas; no añadir un segundo SPF. El SPF de `send.mail` no es automáticamente el SPF del apex o del From. [RFC 7208](https://www.rfc-editor.org/rfc/rfc7208).

**DMARC:** comenzar con monitorización `p=none` y revisar todos los remitentes legítimos, alineación SPF/DKIM e informes. Endurecer hacia `quarantine`/`reject` cuando existan pruebas; no heredar una política estricta del apex sin revisar los subdominios. La dirección `rua` necesita un destino que reciba y procese informes; no inventar ese buzón ni publicar un marcador. `p=none` observa, no bloquea suplantación. Antes de exigir alineación estricta comprobar Return-Path, DKIM y todos los proveedores. [Guía DMARC](https://resend.com/docs/dashboard/domains/dmarc).

## Respuestas, buzones y recepción opcional

El MX del Return-Path sirve al feedback de envío; **no crea el buzón `soporte@dominio.example`**. Para respuestas humanas debe elegirse un buzón o proceso atendido y entonces establecer `reply_to` a esa dirección. El remitente validado en Resend puede enviar sin que exista un buzón homónimo; esto no demuestra que pueda recibir respuestas.

Resend sí ofrece **recepción mediante API y webhooks** al habilitar Receiving y publicar sus MX. No se da por seleccionado ni implementado un servicio de correo corporativo interactivo. Si más adelante se quiere gestionar inbound con Resend, diseñar almacenamiento, permisos, adjuntos, revisión antispam y atención de soporte. [Recepción oficial](https://resend.com/docs/dashboard/receiving/introduction).

No modificar los MX del apex para enviar correo desde `mail`. No mezclar por prioridades proveedores que deberían recibir el mismo buzón: un MX secundario no reparte mensajes como un balanceador. Cloudflare Email Routing o un proveedor de buzones, si se adoptan, necesitan una decisión independiente y DNS compatible. Hasta escoger el destino, `reply_to` y las direcciones de soporte quedan pendientes.

## Claves y entornos

Crear una clave por entorno y función con **Sending access**, restringida al dominio remitente correspondiente. El worker de envío no necesita administrar dominios, contactos o claves. Una eventual conciliación mediante API de lectura requiere permiso disponible apropiado; mantenerlo en una credencial/proceso separado del envío y no ampliar automáticamente a Full access. [Creación de claves](https://resend.com/docs/create-an-api-key), [gestión de claves](https://resend.com/docs/dashboard/api-keys/introduction).

Separar dev/staging/producción con remitentes verificados, claves y secretos de webhook distintos; evaluar equipos separados si hace falta aislamiento real. Claves distintas dentro de un mismo equipo no aíslan cuotas ni la lista de supresión. Nunca usar claves `NEXT_PUBLIC_*`/`EXPO_PUBLIC_*`, guardarlas en Git, imágenes o logs. Secretos fuera del repositorio mediante el mecanismo de despliegue acordado; limitar lectura al servicio correspondiente. [Entornos](21-entornos-ci-cd.md).

Rotación: crear nueva credencial limitada, actualizar el servicio y comprobar con un destinatario autorizado, revocar la anterior y revisar actividad. Revocar inmediatamente una credencial expuesta; eliminarla del archivo actual no sanea historial ni artefactos. El webhook usa su propio secreto de firma, no la clave de envío.

## Integración Go por HTTPS

**Propuesta simple:** cliente reutilizable con `net/http`, `context` y `encoding/json`; `html/template` para escapar contenido HTML y `text/template` para texto. Mantener un módulo pequeño dentro del [backend](09-backend-go.md). El SDK Go oficial de Resend es alternativa si reduce errores o mantenimiento; no se ha instalado ni fijado su versión. [Guía Go](https://resend.com/docs/send-with-go).

Contrato externo documentado: `POST https://api.resend.com/emails`, JSON con `from`, destinatario, `subject`, `html` y `text`; `reply_to` solo cuando exista destino. Cabeceras `Authorization: Bearer <SECRETO_EN_SERVIDOR>`, `Content-Type: application/json`, `User-Agent` identificado e `Idempotency-Key`. Conservar ID devuelto por Resend. HTTPS y User-Agent forman parte de los requisitos actuales de la API. [API general](https://resend.com/docs/api-reference/introduction), [envío](https://resend.com/docs/api-reference/emails/send-email).

Usar timeouts de conexión/TLS/respuesta y deadline por intento; cerrar cuerpos, limitar el tamaño de respuestas y clasificar errores por código. No desactivar TLS, enviar a URLs externas proporcionadas por cliente ni seguir redirecciones que trasladen Authorization fuera del host autorizado. No mantener una transacción SQL abierta durante la llamada.

Destinatario, From, plantilla y enlaces se obtienen de datos/control del servidor. Rechazar cabeceras con saltos de línea; no aceptar HTML ni cabeceras arbitrarias del usuario. Enviar mensajes privados por destinatario, sin listas visibles de clientes en To/CC. Tags solo con IDs técnicos mínimos, sin emails, GPS, tokens de recuperación o QR. No descargar adjuntos desde URLs de usuario; el MVP puede evitar adjuntos y enlazar al área autenticada.

## Outbox, entrega y recuperación

**Base propuesta:** en la transacción del evento de negocio registrar outbox e intención de correo. Worker Go reclama trabajos con lease/bloqueo corto, confirma la reclamación, llama fuera de la transacción y persiste resultado. Concurrencia limitada y reintentos con backoff/jitter; Redis puede acelerar avisos, pero PostgreSQL conserva la cola. Separar prioridad operativa de promociones para que una campaña no bloquee recuperación de acceso.

| Modelo preliminar | Datos/constraint relevante |
| --- | --- |
| `email_deliveries` | ID, origen único, tipo, destinatario privado, plantilla/versión, payload mínimo protegido, estado de intento, lease, próxima ejecución, expiración, clave idempotente, hash del payload, ID Resend |
| `email_webhook_events` | Entorno/endpoint, `svix-id` único, tipo, ID Resend, fecha y resultado de aplicación; retención limitada |
| `communication_preferences` | Usuario, finalidad/canal, elección, fecha, procedencia y versión del texto; evidencias mínimas |
| `email_suppressions` | Dirección normalizada, motivo/alcance, origen, fecha y estado; distinguir baja promocional de fallo de entrega |

Los nombres/campos son propuesta; ampliar el [modelo de datos](10-datos-postgresql-postgis.md) mediante migraciones revisadas. Reclamación y finalización condicional al lease evitan que un worker lento sobrescriba el nuevo estado. Al reclamar nuevamente un trabajo usar la misma clave y **el mismo cuerpo serializado**; mantener la versión de plantilla e instantánea, no rerenderizar con datos que ya cambiaron.

Resend documenta idempotencia durante **24 horas**, con claves de hasta **256 caracteres**. Clave por intención de correo, sin PII; nunca generar otra por cada reintento. Un timeout deja resultado incierto: reintentar el mismo payload/clave dentro de la ventana; no afirmar que el envío falló. La unicidad local por evento/destinatario impide nuevas intenciones duplicadas, pero no convierte la entrega en exactamente una vez. Si persiste incertidumbre al vencer la ventana, poner en conciliación/manual y comprobar ID/eventos/actividad antes de reenviar; no repetir ciegamente después de 24 horas. [Idempotencia](https://resend.com/docs/dashboard/emails/idempotency-keys).

| Resultado | Comportamiento propuesto |
| --- | --- |
| Éxito con ID | Persistir aceptación; esperar eventos de entrega, sin confundir con bandeja de entrada |
| Timeout/red/5xx | Resultado incierto o transitorio; reintento acotado con misma clave/cuerpo |
| 429 de rate limit | Reducir concurrencia, respetar cabeceras/Retry-After cuando exista y reprogramar |
| 429 de cuota | Detener según ventana/cuota y alertar; no bucle rápido ni compra automática de plan |
| 409 por petición concurrente | Reintentar después; misma clave/cuerpo |
| 409 por cuerpo distinto | Error de coherencia; investigar, sin regenerar clave como atajo |
| Validación, permiso, dominio o credencial | Fallo corregible mediante configuración/datos; alertar, no tormenta de reintentos |
| Intención expirada o promoción dada de baja | Cancelar envío pendiente; no mandar mensajes obsoletos |

Los límites exactos de intentos/edad deben configurarse por tipo; no enviar un reset expirado tras una cola larga. Las credenciales/tokens no van en logs ni errores; el payload que necesite token se protege con cifrado y retención corta, mientras `verification_tokens` mantiene hash y consumo. [Errores Resend](https://resend.com/docs/api-reference/errors).

En la consulta actual, el límite inicial de la API es **10 peticiones/segundo por equipo**, compartido por todas sus claves y dominios. Leer límite real de la cuenta/cabeceras; coordinar todos los workers que comparten equipo. Cuotas, dominios, contactos, retención y coste dependen del plan; no son parámetros aprobados del proyecto. [Cuotas y límites](https://resend.com/docs/knowledge-base/account-quotas-and-limits).

## Webhooks firmados y supresiones

Ruta propuesta `POST /api/v1/webhooks/resend`, publicada en HTTPS bajo `api.dominio.example`. Caddy/Cloudflare deben permitir esta ruta sin challenge interactivo ni cachearla. Delimitar excepción de CSRF de sesión a este webhook; conserva firma, límites de body/tiempo y persistencia. No crear un endpoint que reciba destinatario/URL arbitrarios para enviar emails.

Verificar **bytes originales** del cuerpo con secreto de endpoint y cabeceras `svix-id`, `svix-timestamp`, `svix-signature`, antes de interpretar/aplicar el JSON. Usar soporte mantenido de verificación Resend/Svix para Go, con comparación segura y tolerancia temporal/replay de la biblioteca; fijar versión al implementar. No convertir JSON de nuevo a texto, diseñar criptografía propia ni omitir comprobación temporal. [Verificación Resend](https://resend.com/docs/webhooks/verify-webhooks-requests), [Svix](https://docs.svix.com/receiving/verifying-payloads/how).

Persistir evento autenticado y deduplicar por endpoint/entorno + `svix-id` antes de devolver 2xx. Si no se puede guardar duraderamente, devolver fallo recuperable. Aplicación asíncrona idempotente por ID Resend/origen; procesar eventos fuera de orden sin que `sent` tardío borre un bounce/complaint. Eventos desconocidos válidos se registran mínimamente para revisión y no activan acciones inesperadas. Resend reintenta y permite replay; puede desactivar un endpoint persistentemente fallido, por lo que requiere supervisión. [Reintentos/replays](https://resend.com/docs/webhooks/retries-and-replays).

| Evento actual relevante | Interpretación/control propuesto |
| --- | --- |
| `email.sent` | API aceptó; intentará entregar |
| `email.delivered` | Servidor del destinatario aceptó; no prueba lectura ni ubicación en inbox |
| `email.delivery_delayed` | Demora temporal; observar, sin crear otro email automáticamente |
| `email.failed` | Fallo de envío; investigar motivo |
| `email.bounced` | Rechazo permanente; bloquear nuevos envíos según política |
| `email.complained` | Queja por spam; detener envío y revisar consentimiento |
| `email.suppressed` | Proveedor omitió envío; conciliar supresión |
| `suppression.added` / `suppression.removed` | Sincronizar estado del equipo con registro local |
| `email.received` | Solo recepción inbound si se aprueba; no significa que un usuario leyó el correo |

Seleccionar únicamente eventos necesarios y probar sus payloads reales. [Tipos de evento](https://resend.com/docs/webhooks/event-types).

Resend mantiene supresiones **para todo el equipo**, incluyendo envíos transaccionales y promocionales en todos sus dominios. Una baja de promociones es distinta de una supresión por hard bounce/complaint: conservar controles propios por finalidad y no bloquear avisos operativos por una baja promocional. Respetar supresión del proveedor también en recuperación de acceso; ofrecer cambio de dirección/control de identidad o soporte definido, sin quitar la supresión automáticamente. No todos los proveedores devuelven quejas, por lo que ausencia de eventos no acredita consentimiento. [Supresiones](https://resend.com/docs/dashboard/emails/email-suppressions).

## Auth, enlaces y Apple Private Relay

Continuar con [auth propia](14-autenticacion.md). Token aleatorio de propósito único, hash persistido, expiración, usuario/dirección asociada y consumo atómico. Duraciones concretas pendientes; rate limit para solicitud/reenvío y respuesta coherente para evitar enumeración.

Un enlace de email abre pantalla de explicación/confirmación; **GET/HEAD no verifica cuenta, cambia contraseña ni consume token**. Los escáneres de correo pueden abrir enlaces. La mutación final ocurre en POST validado: confirmación explícita para verificación y nueva contraseña para reset, con controles CSRF/origen según el flujo. No generar URLs desde un Host no confiable ni aceptar redirects arbitrarios; origen HTTPS fijo y allowlist de retorno.

Excluir tokens de logs, analytics, referer y recursos de terceros en esas páginas; `Cache-Control: no-store`, `Referrer-Policy: no-referrer` y manejo explícito del token en memoria/intercambio seguro. No incluir sesión, contraseña o QR en URLs/email. Los enlaces que abren la app deben tener fallback web y vinculación nativa verificada; el escaneo por sí mismo no ejecuta acciones.

Para destinatarios `privaterelay.appleid.com`, registrar en Apple Developer **cada fuente remitente** real. Si se usa SPF, Apple exige registro y coincidencia exacta del dominio Return-Path; con DKIM comprobar que `d=` coincide exactamente con el From registrado y que la firma lo cubre. Registrar `mail.dominio.example` y los dominios de envelope reales que correspondan; no asumir que registrar solo apex cubre subdominios. Probar con un usuario de prueba que elija Ocultar mi email y revisar rebotes/notificaciones. No solicitar su email real como requisito para evitar configurar el relay. [Requisitos Apple](https://developer.apple.com/help/account/capabilities/configure-private-email-relay-service/).

## Promociones, bajas y privacidad

La membresía de 5,99 €/mes **no concede permiso de email promocional**. Registrar elección por finalidad/canal y permitir retirarla. Para la base propuesta, campañas solo con opt-in documentado; país/mercado, aplicación de RGPD y normativa de comunicaciones comerciales, bases jurídicas, textos y contratos con encargado/subencargados requieren validación antes del lanzamiento. Este diseño no acredita cumplimiento legal. [RGPD oficial](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng), [marketing](27-marketing-google-ads.md).

Revalidar consentimiento/elegibilidad al ejecutar, no solo al programar la campaña. Bajas cancelan tareas promocionales pendientes y sincronizan contactos/Topics si se adopta Broadcasts. Elegir **Broadcasts/Contacts de Resend** o envíos API con preferencias propias; no ejecutar dos motores para la misma campaña. La clave send-only no implica acceso a gestión de contactos/campañas; separar credencial operacional si se necesita esa API.

Cada promoción llevará enlace visible de baja y preferencias. Si se usa API con lista propia, implementar cabeceras `List-Unsubscribe` y `List-Unsubscribe-Post` para POST one-click conforme al canal. La URL usa capacidad opaca limitada a retirar ese consentimiento, no a iniciar sesión ni cambiar email; no requiere login, y GET muestra página sin dar de baja por escaneo. Persistir la baja antes de confirmar y parar emisiones cuanto antes. [Bajas Resend/RFC 8058](https://resend.com/docs/dashboard/emails/add-unsubscribe-to-transactional-emails).

Desactivar tracking de aperturas/clics en autenticación y demás mensajes operativos como base. Tracking promocional queda pendiente de finalidad, consentimiento, coste y tratamiento de datos; no medir aperturas como venta ni lectura fiable. No añadir UTMs o píxeles a enlaces de seguridad. Resend documenta tracking desactivado por defecto y reescritura de enlaces cuando se habilita. [Tracking](https://resend.com/docs/dashboard/domains/tracking).

Minimizar datos remitidos a Resend: dirección, plantilla y contenido necesario. Retención local de payload/eventos y política de borrado/anónimo pendientes. No usar el proveedor como archivo económico ni guardar indefinidamente el HTML de resets. Revisar DPA, subencargados, transferencias y configuración de almacenamiento con el mercado elegido; la región de envío no sustituye esta revisión.

## Plantillas y configuración reproducible

Plantillas versionadas en el repositorio como propuesta, HTML escapado y texto explícito en español; idioma adicional pendiente. Priorizar legibilidad sin imágenes, botones/enlaces claros, texto alternativo, contraste y diseño responsive. Probar modo claro/oscuro en clientes de correo, que pueden invertir colores; no prometer que respeten los tokens del Design System. No incluir testimonios, beneficios, descuentos o precios no aprobados.

Usar assets públicos estables del dominio propio solo donde aporten valor. Nada de QR de canje, tokens de pedido, enlaces admin o información sensible en imágenes/asunto/preheader. El CTA del pedido abre su vista autorizada; email no habilita canje. React Email/editor Resend son alternativas por evaluar, no dependencias instaladas ni condición para enviar desde Go.

Variables propuestas para un futuro `.env.example`, **sin secretos ni configuración ejecutable definitiva**:

~~~dotenv
EMAIL_PROVIDER=resend
EMAIL_MODE=sink
RESEND_API_KEY=
RESEND_WEBHOOK_SECRET=
EMAIL_FROM_TRANSACTIONAL="Foodtrucks <avisos@mail.dominio.example>"
EMAIL_FROM_MARKETING=
EMAIL_REPLY_TO=
WEB_ORIGIN=https://dominio.example
EMAIL_PAYLOAD_KEY_FILE=
EMAIL_ALLOWED_RECIPIENTS=
EMAIL_MAX_ATTEMPTS=
EMAIL_REQUEST_TIMEOUT=
EMAIL_RATE_LIMIT=
~~~

Nombres y valores son propuesta; definir validación al iniciar. WEB_ORIGIN comparte el origen canónico con el backend/frontend, sin introducir otra URL divergente. EMAIL_PAYLOAD_KEY_FILE, si se utiliza payload cifrado para secretos temporales, apunta a material montado fuera de PostgreSQL y de imágenes/Git; la gestión, rotación y recuperación de claves se resuelven antes de habilitar esa entrega diferida.

`sink` guarda en un destino local de pruebas con retención corta y nunca llama al proveedor. Para prueba de integración seleccionada usar Resend con remitente autorizado y allowlist explícita, no dominios ficticios como destinatarios reales. No cambiar automáticamente `sink` a envío real por encontrar una clave. No imprimir variables completas en diagnósticos.

## Desarrollo, observación y runbook

Local/CI: datos ficticios, sink y verificador webhook con fixtures firmadas; no API keys de producción. Integración controlada: dominio dev/staging verificado o remitente de prueba dentro de las restricciones de Resend, únicamente destinatarios autorizados. El dominio compartido de prueba no se presenta como remitente de producción.

Resend ofrece destinatarios especiales para simular entrega, bounce, complaint y suppression, por ejemplo `delivered@resend.dev`, `bounced@resend.dev`, `complained@resend.dev`, `suppressed@resend.dev`. Las pruebas consumen cuota; comprobar labels y restricciones vigentes. No enviar a emails inventados de personas ni restaurar datos live con efectos externos activos. [Destinatarios de prueba](https://resend.com/docs/dashboard/emails/send-test-emails).

Medir edad/tamaño de cola por tipo, aceptados, fallos, reintentos, 429/cuota, demora, bounce/complaint/suppression, verificación de dominio y estado webhook. IDs técnicos y destinatarios enmascarados; no bodies completos, tokens ni secretos en logs. Alertas sin depender exclusivamente del mismo proveedor de email que está fallando.

| Incidente | Respuesta operativa propuesta |
| --- | --- |
| Dominio deja de verificar | Pausar envíos afectados, comparar DNS público/panel y cambios; no borrar registros de otros proveedores |
| 401/403 | Revisar clave, permiso, From y User-Agent; no aumentar permisos como primera respuesta |
| Cuota o rate limit | Reprogramar/limitar, proteger transaccionales, avisar al responsable; plan/coste solo tras decisión |
| Timeout persistente | Mantener resultado incierto; reconciliar con ID/webhooks antes de reenvío fuera de ventana |
| Aumento de rebotes/quejas | Detener promoción, revisar lista/consentimiento y supresiones; no retirar bloqueos en lote |
| Webhook falla | Revisar TLS/ruta/challenge, firma/raw body y almacenamiento; recuperar endpoint y replay idempotente |
| Clave expuesta | Revocar/rotar y revisar uso; preservar evidencia sin publicar el secreto |
| Backup restaurado | Mantener sink, invalidar efectos externos pendientes y reconciliar antes de reactivar |

## Criterios de aceptación y pendientes

Antes de habilitar producción deben existir pruebas documentadas de DNS/verificación y SPF/DKIM/DMARC en mensajes de prueba; Reply-To atendido; recuperación/verificación con expiración, doble POST, GET de escáner y rate limit; Apple Private Relay; template HTML/texto y ambos temas; caída entre aceptación y guardado, doble worker e idempotencia dentro/fuera de 24 horas; firma falsa/cuerpo alterado/replay/duplicado/desorden; 429, cuotas, rebotes/supresiones; baja promocional que cancela cola sin cancelar avisos operativos; y separación de entornos/restore sin envío real.

Pendientes: dominio real y remitentes, región y plan/costes Resend, presupuesto correo separado de Google Ads, volumen esperado, buzón/responsable de soporte, recepción inbound, motor promocional, frecuencia, finalidades y textos de consentimiento, TTL de auth/retención, umbrales/reintentos, encargados/transferencias, canal de facturas y permisos de conciliación. Precios, cuotas y límites consultados son referencias temporales, no una contratación ni capacidad garantizada.

Esta entrega únicamente documenta configuración e integración. No se han ejecutado estas pruebas ni realizado compras, cambios de cuenta/DNS, envíos o instalaciones adicionales.

## Marketing ampliado y preferencias

U08 incorpora analítica/publicidad web/app y contenido/ASO; esos consentimientos se gestionan por finalidad y no sustituyen opt-in/baja de email Resend. No sincronizar GA4, audiencias, contactos o Topics con emails/clientes por defecto. Una compra o la membresía de 5,99 €/mes no activa campañas.

foodtrucks.com es referencia proporcionada en el prompt, con control/dominio de producción por verificar. Los remitentes mail.dominio.example conservan su carácter de ejemplo. [Plan maestro](31-marketing-digital-maestro.md), [medición/privacidad](34-analitica-consentimiento.md).

## Alertas operativas con Resend

U11 solicita alertas por correo: Grafana/Alertmanager puede usar SMTP de Resend con credencial y remitente adecuados, separado del envío HTTPS del worker. Verificar STARTTLS/puerto/usuario oficiales, enviar con una clave mínima y destino de prueba autorizado; no introducir un MTA en casa ni usar la clave API como URL de webhook público. [Diseño e integración](41-observabilidad-grafana-prometheus-sentry.md).

La cuota y supresiones de Resend también afectan alertas si comparten equipo. No depender del propio host/Resend como único aviso de su caída. Pruebas de recepción, configuración y buzón permanecen futuras, no se han enviado alertas. [SMTP oficial](https://resend.com/docs/send-with-smtp).
