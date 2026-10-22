# Foodtrucks — resumen del proyecto

**Base documental:** 1.10 · **Fecha:** 15 de octubre de 2026 · **Integración ECC:** 20 de octubre de 2026.

**Consolidación local:** 20 de octubre de 2026. AGENTS y CI/CD se consultan por tarea; ZIP/informe v1.10 conservan la instantánea histórica.

El proyecto reúne **49 documentos**, cinco capturas y el [inventario de 37 skills base y cinco complementos ECC](docs/26-skills-proyecto.md#seleccion-ecc-del-proyecto). Tu lectura principal son estos ocho bloques; el detalle queda en el índice desplegable final. Historia y contexto: [procedencia](docs/00-procedencia.md).

Accesos: [ocho bloques](#1-producto-y-pagos) · [pendientes](#pendientes-principales-y-siguiente-paso) · [índice completo](#indice-tecnico).

**Estado a 22/10/2026:** backend Laravel en la VM DEV, con PostgreSQL/PostGIS, Redis/Horizon y API accesible por Cloudflare Tunnel en `api-dev.foodtruck.bid`. Correo técnico de Resend entregado y credencial FCM aceptada por Google; recepción push en Android pendiente. La integración móvil sigue en curso, Mapbox online y web pendientes. Las pruebas del servidor pasan en CI; el resultado general continúa bloqueado por avisos de dependencias móviles. Guías: [backend](backend/README.md) y [Android](apps/mobile/README.md). ZIP/informe v1.10 conservan su estado histórico.

**Cómo leerlo:** confirmado es una decisión del usuario; propuesto es una base por validar; pendiente necesita resolución; ejemplo es ilustrativo. Consultar [AGENTS](AGENTS.md), las [decisiones pertinentes](docs/23-decisiones-pendientes.md) y las políticas de la tarea; recurrir al historial solo para contexto o conflictos. Las instrucciones explícitas posteriores prevalecen.

## 1. Producto y pagos

- Mapa, carta, compra, preparación y recogida presencial con QR, sin reparto. Laravel/PostgreSQL confirman importes, pagos, stock y canje único.
- Separar Stripe Connect para comida y Billing para licencia/mensualidad comercial. Membresía cliente de **5,99 €/mes en EUR confirmados**; canal de cobro, impuestos, puntos y tarifas comerciales pendientes. Los ejemplos no son tarifas.

Detalle: [producto](docs/01-producto-mvp.md), [pagos](docs/13-stripe.md) y [membresía](docs/25-suscripcion-clientes-fidelizacion.md).

## 2. Diseño y experiencia

- Claro/oscuro, accesibilidad y navegación sencilla: header en Next.js web y dock exclusivamente nativo. Panel del propietario centrado en negocios/suscripciones.
- Evaluar código, licencia y adaptación de 21st.dev; web no equivale a React Native y no hay auditoría exhaustiva. Novedades y permisos son independientes; 120 FPS es objetivo condicionado a dispositivo y medición.

Detalle: [UX/UI](docs/04-ux-ui.md), [componentes](docs/45-catalogo-21st-frontend.md) y [permisos](docs/47-novedades-onboarding-permisos.md).

## 3. Desarrollo, pruebas y entregas

- Cada cambio coherente requiere evaluación de pruebas, revisión, commit/push y CI de la revisión vigente en GitHub Actions. Fallos, comprobaciones ausentes o saltos inesperados bloquean; CI no crea autocommits.
- GHCR registra imágenes por digest; staging automático y producción con aprobación manual del mismo artefacto verificado. No implica autorizar merge, force-push o publicación en tiendas.

Detalle: [política de entrega](docs/44-politica-commits-ci-cd-tests.md) y [QA](docs/40-testing-qa-github.md).

## 4. Seguridad

- Validar entradas y autorizar cada acción/recurso en servidor, con mínimo privilegio. Cliente, comerciante y administrador tienen accesos delimitados; ocultar botones no protege datos.
- Proteger sesiones, uploads, pagos y QR; mantener secretos fuera de Git/frontend/logs. Usar datos sintéticos y aplicar a código asistido por IA la misma revisión y pruebas.

Detalle: [seguridad](docs/39-seguridad-devsecops.md) y [autenticación](docs/14-autenticacion.md).

## 5. Protección de datos

- Datos mínimos, finalidad, acceso y conservación justificados; atender derechos y evaluar proveedores/brechas. Bases, plazos y responsables efectivos siguen pendientes.
- Separar consentimiento, permisos del dispositivo, cierre y supresión. Suscribirse no acepta marketing; una restauración debe reaplicar supresiones/restricciones. ISO/OWASP/NIST/CMMI orientan controles, sin certificación o cumplimiento acreditados.

Detalle: [privacidad y gobernanza](docs/48-proteccion-datos-gobernanza.md) y [consentimiento](docs/34-analitica-consentimiento.md).

## 6. Servidor y backups

- Servidor doméstico, Ubuntu Server 26.04, Compose/Caddy y entornos separados. Los 4 vCPU/8 GB/40 GB son DEV; capacidad PROD pendiente.
- Fotos persistentes locales, sin S3; backups externos fuera de casa y restore comprobado. Cloudflare para dominio/DNS y Resend para correo; foodtruck.bid comprado y verificado en Resend. D50 autoriza configurar correo, Tunnel y FCM en DEV; conexión y entrega real se verifican por separado.

Detalle: [servidor](docs/38-servidor-domestico.md) y [backups](docs/18-media-backups-operacion.md).

## 7. Monitorización

- Prometheus/Grafana/Sentry deben detectar errores, caídas y regresiones con señales útiles, accesos privados y datos saneados.
- Alertas a destinos autorizados y procedimientos de recuperación; comprobar también pérdida de luz/Internet del domicilio. Métricas y umbrales se fijan con mediciones reales.

Detalle: [observabilidad](docs/41-observabilidad-grafana-prometheus-sentry.md).

## 8. Marketing y costes

- Google Ads capta clientes y negocios; **400 al mes sigue pendiente**, incluida moneda/reparto. SEO/ASO y mensajes describen oferta real; medición consentida. AdSense/AdMob se evalúan por separado.
- Controlar gastos sin convertir referencias en presupuesto aprobado: 54,63 €/mes es subtotal equivalente de herramientas, no coste total. Campañas, envíos y gastos reales requieren su alcance autorizado.

Detalle: [marketing](docs/31-marketing-digital-maestro.md) y [costes](docs/37-costes-presupuesto.md).

## Pendientes principales y siguiente paso

Resolver territorio/fiscalidad, tarifas y reglas comerciales, contratos/retención, versiones y capacidad de producción antes de implementar lo afectado. [Listado completo](docs/23-decisiones-pendientes.md).

Para desarrollar: abrir el repositorio real, leer [AGENTS](AGENTS.md) y consultar [arquitectura](docs/07-arquitectura-monorepo.md), decisiones, políticas y skills según la tarea. Backend principal Laravel/PHP por decisión del 21/10/2026; Go reservado para necesidades específicas futuras. Se mantienen PostgreSQL/PostGIS/Redis, React Native/Expo/TypeScript, Next.js, Mapbox y auth propia con email/contraseña y Google/Apple. Consultar [roadmap](docs/22-roadmap.md).

<a id="indice-tecnico"></a>

<details>
<summary>Índice técnico completo — 49 documentos</summary>

| Documento | Contenido |
| --- | --- |
| [README. Resumen en ocho bloques](README.md) | Entrada breve y ruta de lectura |
| [00. Procedencia](docs/00-procedencia.md) | Historial completo consultado, evolución y límites |
| [01. Producto y MVP](docs/01-producto-mvp.md) | Visión, actores, alcance y exclusiones |
| [02. Cliente](docs/02-flujo-cliente.md) | Mapa, carta, compra, pago, seguimiento y QR |
| [03. Comerciante](docs/03-flujo-comerciante.md) | Alta, Connect, Billing, operación y recogida |
| [04. UX/UI](docs/04-ux-ui.md) | Airbnb/Glovo, pantallas, navegación por plataforma |
| [05. Design System](docs/05-design-system.md) | Claro/oscuro, tokens, accesibilidad y movimiento |
| [06. 21st.dev](docs/06-21st-dev-mcp.md) | Selección preliminar, evaluación y uso del MCP |
| [07. Arquitectura](docs/07-arquitectura-monorepo.md) | Monorepo, límites y despliegue |
| [08. Frontend](docs/08-frontend.md) | React Native, Expo, TypeScript y Next.js |
| [09. Backend](docs/09-backend-go.md) | Laravel, Sanctum, Horizon y workers |
| [10. Datos](docs/10-datos-postgresql-postgis.md) | Entidades, integridad, concurrencia y geografía |
| [11. Redis](docs/11-redis-cache.md) | Caché, TTL, invalidación y degradación |
| [12. Mapbox](docs/12-mapbox.md) | Mapas nativo/web, estilos y ubicaciones |
| [13. Stripe](docs/13-stripe.md) | Billing, Connect, pagos y conciliación |
| [14. Auth](docs/14-autenticacion.md) | Email/contraseña, Google, Apple y permisos |
| [15. Avisos](docs/15-notificaciones-tiempo-real.md) | APNs/FCM, outbox, Live Activities/Updates |
| [16. Rendimiento](docs/16-rendimiento.md) | Objetivo 120 FPS y medición |
| [17. Infraestructura](docs/17-infraestructura.md) | Ubuntu 26.04, servidor doméstico, VMware, Compose y Caddy |
| [18. Fotos y backups](docs/18-media-backups-operacion.md) | Persistencia local, restauración y operación |
| [19. Seguridad](docs/19-seguridad.md) | Amenazas, controles y criterios de aceptación |
| [20. API](docs/20-api.md) | Contrato REST propuesto y errores |
| [21. Entornos](docs/21-entornos-ci-cd.md) | Aislamiento, configuración y efectos externos por entorno |
| [22. Roadmap](docs/22-roadmap.md) | Hitos, dependencias y salida a piloto |
| [23. Decisiones](docs/23-decisiones-pendientes.md) | Decisiones cerradas, propuestas y preguntas |
| [24. Referencias](docs/24-referencias.md) | Fuentes técnicas y alcance de la comprobación |
| [25. Suscripción de clientes](docs/25-suscripcion-clientes-fidelizacion.md) | Membresía, ofertas, puntos, descuentos y financiación |
| [26. Skills del proyecto](docs/26-skills-proyecto.md) | Selección, instalación verificada y carga por tarea |
| [27. Marketing Google Ads](docs/27-marketing-google-ads.md) | Captación B2C/B2B, fases, medición y presupuesto pendiente |
| [28. Revisión skills.sh](docs/28-revision-skills-sh.md) | Comparación, 12 complementos, descartes y límites |
| [29. Cloudflare y dominio](docs/29-cloudflare-dominio-dns.md) | Dominio comprado, Tunnel DEV y propuestas DNS/TLS/caché de producción |
| [30. Correo Resend](docs/30-correo-resend.md) | DNS de correo, envíos Laravel, webhooks, consentimiento y operación |
| [31. Política de marketing](docs/31-marketing-digital-maestro.md) | Objetivos, controles, responsabilidades, procedimientos y aceptación |
| [32. SEO local y Next.js](docs/32-seo-local-nextjs.md) | Rutas, metadatos, sitemap, JSON-LD, Search Console, GBP y CWV |
| [33. AdSense y AdMob](docs/33-monetizacion-adsense-admob.md) | Elegibilidad, formatos, integración de prueba y comparación de ingresos |
| [34. Analítica y consentimiento](docs/34-analitica-consentimiento.md) | GA4/Firebase, eventos, dashboards, privacidad y conversiones |
| [35. ASO, editorial y 90 días](docs/35-aso-contenidos-roadmap-90-dias.md) | Tiendas, enlaces web/app, calendario y fases condicionadas |
| [37. Costes](docs/37-costes-presupuesto.md) | Cuotas declaradas, caja/equivalente mensual, servidor y partidas pendientes |
| [38. Servidor doméstico](docs/38-servidor-domestico.md) | DEV/PROD, red, Tunnel/directo, energía, backups y recuperación |
| [39. Seguridad DevSecOps](docs/39-seguridad-devsecops.md) | Controles específicos, API, dependencias, secretos y evidencias |
| [40. Testing y QA](docs/40-testing-qa-github.md) | Estrategia, comandos, casos QA y evidencia de comportamiento |
| [41. Observabilidad](docs/41-observabilidad-grafana-prometheus-sentry.md) | Grafana, Prometheus, Sentry, alertas, SLO y runbooks |
| [44. Commits, pruebas y CI/CD](docs/44-politica-commits-ci-cd-tests.md) | Política obligatoria, gate, GHCR, staging y producción aprobada |
| [45. Catálogo frontend 21st.dev](docs/45-catalogo-21st-frontend.md) | Candidatos de app, evidencias, adaptación nativa y recursos visuales |
| [46. Panel administrativo](docs/46-panel-admin-negocios-suscripciones.md) | Negocios, suscripciones, estados, incidencias y auditoría |
| [47. Novedades y permisos](docs/47-novedades-onboarding-permisos.md) | Tarjetas de actualización, onboarding contextual y permisos del SO |
| [48. Protección de datos y gobernanza](docs/48-proteccion-datos-gobernanza.md) | Ciclo de vida de datos, derechos, proveedores, riesgos y controles de calidad |
| [Guía DevOps](docs/devops/README.md) | Navegación, glosario, credenciales, procedimientos y diagnóstico |
| [AGENTS.md](AGENTS.md) | Instrucciones del proyecto para Codex |

</details>
