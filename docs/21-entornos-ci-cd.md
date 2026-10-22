# Entornos de Foodtrucks

**Decisión 22/10/2026:** primera entrega automática sobre la VM DEV actual mediante agente saliente fijo; no es staging productivo. CI usa PostgreSQL/PostGIS y Redis desechables en GitHub, sin credenciales ni acceso a VM en PR externas. Se preservan proyecto Compose y volúmenes DEV. Producción bloqueada hasta staging, host, backup externo y configuración verificados. [Procedimiento y estado real](devops/README.md#cicd-propio-autorizado-el-22102026).

**Actualización 21/10/2026 (D47–D49):** Laravel/PHP sustituye Go como backend principal. Las recetas Go/sqlc siguientes conservan contexto histórico y no son comandos del backend activo. Mandan Composer, migraciones Laravel, OpenAPI y la [guía real del backend](../backend/README.md). Google se incluye en este hito; foodtruck.bid está verificado en Resend. Nueva clave de envío y Cloudflare Tunnel aplazados expresamente; no hay publicación de API.

**Consolidación:** 20 de octubre de 2026. Este documento define aislamiento y configuración por entorno. El ciclo Git/CI/CD, sus gates y la promoción se definen en [44](44-politica-commits-ci-cd-tests.md); las pruebas en [40](40-testing-qa-github.md) y la operación en [DevOps](devops/README.md). La aplicación y los entornos siguen pendientes de implementación/verificación.

## Entornos y separación

| Entorno | Uso y aislamiento |
| --- | --- |
| Local/VMware | Datos sintéticos, proveedores test/fake y frontend en ordenador; VM DEV de 4 vCPU/8 GB/40 GB |
| CI | PostgreSQL/PostGIS y Redis efímeros; sin datos de usuarios, secretos live ni acceso a producción/LAN doméstica |
| Staging/piloto | Entorno separado de PROD, con recursos y acceso por definir; recibe el artefacto autorizado según 44 |
| Producción doméstica | Datos reales, credenciales live y acceso restringido; promoción aprobada conforme a 44 |

Separar DB, Redis, usuarios/ACL, volúmenes, dominios/orígenes, configuración Mapbox, clientes OAuth, IDs de app, dispositivos push y credenciales Stripe/Resend/Cloudflare. Compartir hardware no elimina la frontera entre DEV, staging y PROD. Capacidad física, WAN/CGNAT/Tunnel y administración se resuelven en [38](38-servidor-domestico.md); el tamaño de la VM DEV no reserva recursos de producción.

Fijar versiones compatibles de Go/Node/Expo/React Native/Next.js/PostgreSQL/PostGIS/Redis y gestor desde manifests/lockfiles reales. `latest` no es una configuración reproducible. Herramientas móviles y emuladores, VM y servicios se distribuyen según [17](17-infraestructura.md).

## Proveedores y efectos externos

| Servicio | Local/CI | Staging y producción |
| --- | --- | --- |
| Stripe | Fixtures/fakes; sandboxes propios para integración autorizada | Contexto, cuenta y secretos separados; nunca reutilizar derechos o datos live en pruebas |
| Resend | Sink/fake y simulación HTTP | Si staging envía, remitente/clave separados y allowlist de destinatarios de prueba; webhooks ligados al secreto del entorno |
| Push/OAuth/Mapbox | Fakes cuando basten; identidad de build y tokens mínimos | Audiencias, redirects, app IDs, certificados y dispositivos propios, coherentes con el entorno |
| Analítica/publicidad | Salidas live bloqueadas; TestIds cuando corresponda | IDs/flags explícitos y consentimiento; no activar campañas o tiendas por un calendario |
| Observabilidad | Datos sintéticos y reportes saneados | Fuentes privadas, credenciales mínimas y correlación con la release según [41](41-observabilidad-grafana-prometheus-sentry.md) |

Resend no se presupone un sandbox que impida enviar a personas reales. Restaurar una DB exige desactivar workers y efectos externos **antes del primer arranque**; revisar outbox y reaplicar supresiones/restricciones antes de reabrir accesos. Procedimientos: [backups](18-media-backups-operacion.md), [correo](30-correo-resend.md) y [privacidad](48-proteccion-datos-gobernanza.md).

## Dominios y configuración

Cloudflare Registrar es común al dominio; hostnames, reglas y destinos de staging se separan de producción. Ninguna preview arbitraria apunta al dominio live. Gestionar cambios DNS/proxy mediante cuenta/token mínimo, export/diff revisable y estrategia TLS verificable con las reglas finales del origen; no distribuir un token global por los jobs. [Configuración DNS/TLS](29-cloudflare-dominio-dns.md).

Construir URLs y callbacks desde orígenes autorizados. No compartir cookies/secretos indiscriminadamente entre web, API, assets, correo o staging. Los enlaces móviles, permisos y builds siguen [08](08-frontend.md) y [47](47-novedades-onboarding-permisos.md). La distribución móvil y compatibilidad de clientes publicados se rigen por 44 §9, independientemente de Compose.

## Verificación por entorno

Seleccionar en QA01–29 los casos aplicables y las comprobaciones del proveedor: DNS/TLS/renovación, API nativa y webhooks sin challenges, firmas/replay/orden, rebotes/bajas/timeout/idempotencia, relay Apple, enlaces expirados/escáneres y restauración sin envíos. Las guías [29](29-cloudflare-dominio-dns.md) y [30](30-correo-resend.md) conservan el detalle.

Para marketing: rutas públicas/privadas, metadata/canonical/sitemap/JSON-LD/slugs/HTTP y frescura; consentimiento desde arranque/retirada, eventos duplicados/desordenados, ausencia de PII/QR/tokens, SDK, ad blockers y errores sin bloquear compra. Antes de publicación, comprobar ASO/links, cuentas/IDs, políticas y medición conciliada conforme a [31–35](31-marketing-digital-maestro.md). Un calendario no autoriza publicaciones.

Registrar entorno, configuración no secreta, comandos, resultados y límites reales. Pruebas, aceptación y evidencia siguen 40 y 44; una configuración propuesta no demuestra un servicio operativo.
