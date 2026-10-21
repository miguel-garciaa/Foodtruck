# Arquitectura y monorepo

**Cerrado:** código y documentación en GitHub, frontend móvil React Native/Expo, web Next.js y backend Laravel/PHP. **Base propuesta:** monolito modular, organización de carpetas y paquetes compartidos.

## Vista del sistema

~~~mermaid
flowchart LR
  M[App iOS y Android] --> E[Cloudflare si se activa proxy]
  U[Navegador] --> E
  E --> C[Caddy HTTPS]
  C --> A[API Laravel y Sanctum]
  C --> W[Next.js cliente y paneles]
  W --> A
  A --> P[PostgreSQL y PostGIS]
  A --> R[Redis]
  A --> S[Stripe Billing y Connect]
  A --> F[Fotos locales persistentes]
  P --> K[Horizon y outbox]
  K --> N[APNs y FCM]
  K --> H[Resend correo]
  M --> B[Mapbox nativo]
  W --> J[Mapbox GL JS]
~~~

En servidor, Caddy recibe HTTPS y enruta a Next.js, Laravel y medios autorizados. PostgreSQL y Redis solo se alcanzan desde la red interna. App y navegador nunca reciben credenciales de base de datos ni claves privadas de Stripe.

**Actualización DEV 21/10/2026:** contrato canónico en contracts/openapi.json y tipos generados en apps/mobile/src/generated/api.ts. Backend Laravel en implementación; despliegue y recorridos reales todavía no verificados. Go queda reservado, sin servicio activo.

## Estructura objetivo (solo backend y móvil iniciados)

~~~text
Foodtrucks/
  README.md
  AGENTS.md
  apps/
    mobile/             React Native + Expo + TypeScript
    web/                Next.js: cliente, comerciante y administración
  backend/
    app/                Controladores, Form Requests, Policies y Jobs
    database/migrations/ Migraciones Laravel/PostGIS
  packages/
    api-client/         Contratos y cliente TypeScript
    design-tokens/      Valores semánticos compartidos
  database/
    migrations/
    queries/
  infrastructure/
    compose/
    caddy/
  design/               Especificaciones y registro de componentes
  docs/
  .github/workflows/
~~~

API PHP-FPM, Horizon y scheduler comparten una imagen Laravel. Separar worker como proceso no implica microservicios. No son necesarias veinte capas ni una interfaz por cada función.

## Compartir lo útil

Compartir tipos de transporte, cliente HTTP, formatos, validaciones simples y tokens. El backend conserva validación y reglas de negocio autoritativas. TypeScript no se ejecuta directamente en PHP; generar contratos o mantenerlos con comprobaciones explícitas.

No forzar compartir mapa, navegación, almacenamiento de credenciales, pagos o superficies del sistema operativo. No enviar módulos privados del servidor a paquetes frontend.

## Responsabilidades

- Laravel: auth, autorización, establecimientos, catálogo, pedidos, pagos, QR y decisiones comerciales.
- PostgreSQL: datos duraderos, transacciones, integridad y eventos pendientes.
- Redis: aceleración y distribución de actualizaciones; no autoridad de pedidos/pagos.
- Next.js: render y experiencia web; evitar duplicar un segundo backend comercial.
- React Native: UI, gestos, sensores autorizados e integraciones nativas.
- Stripe: procesamiento económico y verificación de sus cuentas.
- Mapbox: render cartográfico; los food trucks proceden de nuestra base de datos.
- Caddy: entrada HTTPS y archivos públicos.
- Cloudflare: registrador y DNS del dominio; proxy/CDN y protección como base propuesta.
- Resend: envío de correo de la aplicación desde Laravel y eventos de entrega; no concede derechos de producto.

## Complejidad y escala

Un host doméstico y su alimentación/conexión son un punto común de fallo. Esta base prioriza sencillez para iniciar y medir. Separar base de datos/archivos o ampliar capacidad solo ante evidencia. Sin Kafka, Kubernetes, microservicios ni multi-región como requisito MVP.

Gestor npm/pnpm, tareas del monorepo, versiones y generador de contratos pendientes. No introducir un orquestador adicional si workspaces y scripts sencillos bastan.

## Módulo de membresía y fidelización

Mantener membresías cliente, campañas y movimientos de puntos dentro del monolito Laravel. PostgreSQL conserva el registro y transacciones; Redis solo cachea vistas públicas o derivadas.

Reutilizar infraestructura de facturación y eventos sin mezclar derechos del comerciante con los del cliente. Si el canal móvil requiere otro proveedor de cobro, normalizar sus derechos y verificar eventos en el backend; esa integración aún no está elegida.

## Dominio y correo

U07 cierra Cloudflare para adquirir el dominio y Resend para email. [DNS/entrada HTTPS](29-cloudflare-dominio-dns.md) y [entrega de correo](30-correo-resend.md) concretan una configuración propuesta. Con proxy desactivado el cliente llega directamente a Caddy; el diagrama muestra la alternativa con proxy. El registrador no hospeda por sí solo las aplicaciones.

Usar la outbox y worker existentes; no añadir broker, microservicio de correo o MTA sin necesidad. Mantener la autoridad en PostgreSQL y las claves del proveedor en servidor. Las fotos siguen en disco persistente del servidor doméstico, con backup fuera del domicilio.

## Superficies públicas y medición U08

Next.js publicará fichas/menús y páginas útiles con metadatos/sitemap según el router real. Laravel selecciona datos publicables y conserva autoridad de disponibilidad, pedidos, pagos y recogida; PostgreSQL guarda cambios/eventos. Documentar invalidación de contenido público sin exponer privados ni duplicar reglas de compra en Next.js.

Propuesta de GA4 web/Firebase Analytics móvil con consentimiento y eventos mínimos; Search Console, tiendas y Google Ads se concilian con datos del backend. AdSense/AdMob son evaluaciones independientes con flags desactivados, sin añadir un microservicio o un segundo mapa. [SEO](32-seo-local-nextjs.md), [medición](34-analitica-consentimiento.md), [editores](33-monetizacion-adsense-admob.md).

## Alojamiento doméstico y observabilidad vigente

U09 traslada DEV/PROD al servidor de casa, sin alterar el monolito, stack o almacenamiento local. La ruta Cloudflare directa o Tunnel se decide por red real; Caddy sigue en la entrada local. Separar entornos y reservar recursos de producción; dos VMs del mismo host no son alta disponibilidad.

La observabilidad añade fuentes privadas de métricas, dashboards Grafana y Sentry web/Laravel/móvil según compatibilidad, por fases. Logs/traces son ampliaciones justificadas, no otro backend de negocio. Sonda/avisos externos cubren caída del domicilio. [Costes](37-costes-presupuesto.md), [servidor](38-servidor-domestico.md), [pila propuesta](41-observabilidad-grafana-prometheus-sentry.md).
