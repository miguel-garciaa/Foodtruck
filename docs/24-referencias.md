# Referencias técnicas y alcance

Consulta documental: 13 de octubre de 2026. Fuentes externas sirven para verificar capacidades y orientar implementación; las decisiones del producto proceden de la conversación y de la solicitud. No constituyen auditoría de dependencias o validación de Foodtrucks.

## Fuentes principales

| Fuente | Uso |
| --- | --- |
| [Conversación completa Foodtrucks](https://chatgpt.com/c/6acd5ac8-e940-83ed-8cd7-ce49c9e68859) | Once intercambios de la rama visible leídos |
| [21st MCP: guía del proveedor](https://github.com/21st-dev/magic-mcp/blob/main/llms-install.md) | Endpoint, autenticación y evolución desde Magic MCP |
| [Expo: development builds](https://docs.expo.dev/develop/development-builds/introduction/) | Builds con módulos nativos |
| [@rnmapbox/maps: instalación](https://rnmapbox.github.io/docs/install) | Config plugin y necesidad de recompilar; guía contiene versiones específicas |
| [Mapbox: aplicaciones móviles](https://docs.mapbox.com/help/dive-deeper/mobile-apps/) | Render/capas, soporte híbrido y privacidad |
| [Mapbox GL JS: inicio](https://docs.mapbox.com/mapbox-gl-js/guides/get-started/) | Integración web |
| [PostGIS: ST_DWithin](https://postgis.net/docs/ST_DWithin.html) | Distancia y uso de índice espacial |
| [Stripe: cargos directos](https://docs.stripe.com/connect/direct-charges) | Modelo propuesto Connect; página remite a variantes de plataforma |
| [Stripe: Billing y webhooks](https://docs.stripe.com/billing/subscriptions/webhooks) | Ciclo de suscripción |
| [Stripe: webhooks](https://docs.stripe.com/webhooks) | Validación y procesamiento fiable |
| [Apple: ActivityKit](https://developer.apple.com/documentation/ActivityKit) | Referencia nativa; el lector web no recuperó su cuerpo completo |
| [Android: Live Updates](https://developer.android.com/develop/ui/views/notifications/live-update) | Requisitos de promoción, elegibilidad y fallback |
| [React Native: rendimiento](https://reactnative.dev/docs/performance) | Medición y diferencias dev/release |
| [Reanimated: rendimiento](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/) | Coste de animaciones y configuración |
| [Ubuntu 26.04: release notes](https://documentation.ubuntu.com/release-notes/26.04/) | Referencia del sistema elegido |
| [Docker Engine en Ubuntu](https://docs.docker.com/engine/install/ubuntu/) | Instalación y compatibilidad a comprobar |
| [Caddy: HTTPS automático](https://caddyserver.com/docs/automatic-https) | Proxy/certificados |
| [GitHub: uso seguro de Actions](https://docs.github.com/en/actions/reference/security/secure-use) | Secretos, permisos y ejecución de código no confiable |

## Límites de comprobación

En la consolidación inicial no se instalaron herramientas, dependencias o MCP; las skills seleccionadas se instalaron posteriormente, como se registra más abajo. No se accedió a cuentas reales Stripe/Mapbox/Apple/Google/Cloudflare/Resend ni se comprobó su configuración. El conector Stripe solicitó reautenticación; se recurrió a documentación pública oficial.

Apple ActivityKit no entregó contenido completo al lector web. No se validaron todas sus APIs/versiones; revisar con herramientas oficiales antes de implementar. Los enlaces específicos de componentes 21st.dev se conservan del historial y están pendientes de revisión del código/licencia vigente.

No se verificaron tarifas actuales de proveedores; ejemplos de la conversación se han etiquetado como tales. El documento no garantiza disponibilidad, coste, cumplimiento normativo, FPS ni capacidad.

## Referencias de implementación por consultar al iniciar

[Chi](https://github.com/go-chi/chi), [pgx](https://github.com/jackc/pgx), [sqlc](https://docs.sqlc.dev/), [Redis](https://redis.io/docs/latest/), [OAuth Google](https://developers.google.com/identity), [Sign in with Apple](https://developer.apple.com/sign-in-with-apple/).

Estas últimas son rutas de consulta recomendadas, no páginas exhaustivamente revisadas en este trabajo. Fijar versiones y revisar documentación de la versión elegida antes de copiar ejemplos.

## Fuentes comprobadas para la ampliación U01

[Apple App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), [Google Play Payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en) y [FAQ de puntos y política de pagos](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en) se consultaron para distinguir comida física, membresía y puntos ganados. No determinan por sí solas la clasificación de Foodtrucks ni garantizan aprobación de tiendas; canal de la cuota móvil pendiente de beneficios/territorio finales.

## Fuentes de skills y campaña

[Skills del proyecto](26-skills-proyecto.md) detalla fuentes oficiales y comunitarias, revisión, instalación y límites; [inventario de instalación](skills-inventory.json) conserva referencias/hashes de entradas. [Google Ads](27-marketing-google-ads.md) enlaza documentación primaria de geografía, conversiones, consentimiento, campañas App y límites de gasto.

La adopción o autoría de una skill no acredita exactitud permanente. Los contenidos comunitarios de marketing no sustituyen políticas Google ni datos reales. No se ha conectado una cuenta publicitaria ni enviado información de clientes durante esta planificación.

## Revisión de skills.sh v1.3

[Informe comparado](28-revision-skills-sh.md) enlaza las fichas del directorio y repositorios primarios de cada selección. [Inventario](skills-inventory.json) registra refs y hashes de entradas instaladas. Adopción/estrellas son referencias temporales; no garantizan seguridad, corrección ni rendimiento. Se revisaron entradas y referencias pertinentes, no todos los archivos del catálogo.

## Fuentes Cloudflare, Resend y enlaces de app — v1.4

Las guías [Cloudflare/dominio](29-cloudflare-dominio-dns.md) y [Resend/correo](30-correo-resend.md) enlazan fuentes oficiales para DNS/registrador, SSL/TLS, Caddy, caché/proxy, autenticación de email, idempotencia, API/webhooks y relay Apple. Se consultaron el 13 de octubre de 2026; paneles, cuotas y capacidades del plan deben confirmarse al configurar las cuentas.

[Expo Android App Links](https://docs.expo.dev/linking/android-app-links/) y [Expo iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/) se consultaron para la asociación dominio/app; hostnames, IDs, certificados de firma y rutas concretos siguen pendientes.

Esta consulta no comprueba un dominio disponible, precio final, DNS propagado, certificados emitidos, integraciones funcionando o entregabilidad. Solo se prepararon especificaciones y ejemplos sin secretos. No se enviaron mensajes ni se desplegaron cambios de cuenta.

## Requisitos y fuentes de marketing digital — v1.5

Los requisitos de marketing aportados por el usuario se incorporan a la [política del área](31-marketing-digital-maestro.md), sin copiar el prompt en un archivo adicional. [SEO/GBP/CWV](32-seo-local-nextjs.md), [AdSense/AdMob](33-monetizacion-adsense-admob.md), [GA4/Firebase/consentimiento](34-analitica-consentimiento.md) y [ASO/calendario](35-aso-contenidos-roadmap-90-dias.md) enlazan documentación primaria actual de Google, Next.js, Apple, Expo, Schema.org y mantenedores de integraciones cuando procede.

Las consultas no acreditan una auditoría de foodtrucks.com, propiedad del dominio, cuentas conectadas, código implementado, datos de campo, ranking, ingresos, aprobación de editor o cumplimiento legal. Límites/políticas/SDK se vuelven a verificar al implementar y publicar. Las pruebas realizadas aquí corresponden a documentos/paquete, no a una aplicación.

## Costes, servidor doméstico, seguridad/QA y observabilidad — v1.6

Los importes de [herramientas](37-costes-presupuesto.md) proceden de U12; no se han sustituido por precios públicos ni validado facturas. [Servidor doméstico](38-servidor-domestico.md), [seguridad](39-seguridad-devsecops.md), [testing/CI/CD](40-testing-qa-github.md) y [observabilidad](41-observabilidad-grafana-prometheus-sentry.md) enlazan fuentes oficiales pertinentes, consultadas el 13 de octubre de 2026.

Los requisitos aportados de seguridad y observabilidad se incorporan en sus políticas, procedimientos y criterios de aceptación; no se archivan originales aparte. La ejecución se aplica al repositorio/infraestructura reales y autorización vigente. Las fuentes no demuestran servicios instalados, disponibilidad de funciones GitHub por plan, alertas recibidas, Git remoto, vulnerabilidades, CI o métricas de usuarios.

## Política de commits/CI/CD y manual DevOps — v1.7

[Política operativa](44-politica-commits-ci-cd-tests.md) y [guía DevOps](devops/README.md) integran los requisitos nuevos y los cierres del usuario. Se comprobaron fuentes primarias de [reutilización de workflows](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows), [Environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments) y [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) el 13 de octubre de 2026.

Los subdirectorios de workflows reutilizables no están soportados. Disponibilidad de protecciones/revisores/secretos por entorno y capacidades del registro se verifican según cuenta, plan y visibilidad reales; no se presupone acceso o coste cero. Referencias de eventos/jobs/checks se enlazan en la política y deben contrastarse al implementar.

La guía golang-testing se usa para criterios de comportamiento, aislamiento y race, sin copiar sus ejemplos de precios float, TLS desactivado, teardown destructivo, herramientas/versiones o credenciales. Las skills son apoyo y no sustituyen las decisiones Foodtrucks ni demuestran tests ejecutados. Las validaciones de esta entrega son documentales; no se configuró GitHub ni se publicó una imagen.

## Recursos visuales, componentes y permisos — v1.8

Consulta del **14 de octubre de 2026** para [catálogo app](45-catalogo-21st-frontend.md), [panel administrativo](46-panel-admin-negocios-suscripciones.md) y [novedades/permisos](47-novedades-onboarding-permisos.md). Las fichas 21st.dev y fuentes públicas se enlazan con evidencia individual; [changelog 21st](https://21st.dev/changelog) anuncia publicación RN/Expo, sin garantizar compatibilidad de cada recurso. La [guía MCP oficial](https://github.com/21st-dev/magic-mcp/blob/main/llms-install.md) orienta conexión futura; no se ha autenticado una conexión ni desbloqueado código de pago.

[Apple Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy), [Apple Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding), [Android runtime permissions](https://developer.android.com/training/permissions/requesting) y [Expo permissions](https://docs.expo.dev/guides/permissions/) fundamentan petición contextual y diferencia entre interfaz propia y autorización del SO. Los detalles SDK/cámara/ubicación/notificaciones/selector se enlazan en 47; revisar versión real antes de implementar, no fijar latest como runtime del proyecto.

Las cinco capturas proceden del usuario y se preservan sin edición como referencias; son diseños de ejemplo, sin licencia/autor exactos inventados cuando no se identifican. Incluirlas no acredita que sus datos, idiomas, productos o controles existan en Foodtrucks. Las pruebas de v1.8 son documentales e integridad de archivos/ZIP, no mediciones de aplicación ni una auditoría exhaustiva de catálogo.

## Protección de datos, calidad y gobernanza — v1.9

Fuentes primarias consultadas el **14 de octubre de 2026** para [política central](48-proteccion-datos-gobernanza.md): [RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=es), [LOPDGDD en BOE](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673), [AEPD privacidad desde el diseño](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/9-analisis-de-riesgos/FAQ-0224-que-es-la-proteccion-de-datos-desde-el-diseno-y-por-defecto) y [registro de tratamientos](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/actividades-tratamiento). Las disposiciones y guías orientan procedimientos; aplicabilidad, bases, roles, plazos y revisión jurídica dependen del tratamiento/territorio real. El texto BOE consolidado es informativo; no convierte este paquete en asesoramiento validado de la entidad.

[ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html), [serie ISO/IEC/IEEE 29119](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html) e [ISO/IEC 27001:2022](https://www.iso.org/standard/27001) se consultan mediante fichas/resúmenes públicos. No se compran/reproducen normas completas ni se declara auditoría o conformidad de todas sus cláusulas.

[NIST SSDF 1.1 Final, SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final), [estado de publicaciones SSDF](https://csrc.nist.gov/Projects/ssdf/publications), [OWASP Top 10](https://owasp.org/projects/top-ten), [ASVS](https://owasp.org/projects/asvs), [MASVS](https://mas.owasp.org/MASVS/) y [CMMI](https://cmmiinstitute.com/improve-performance) orientan controles técnicos y mejora. Se distingue edición publicada de borrador; no aplicar automáticamente una propuesta como norma final. CMMI no atribuye un nivel al proyecto, y DevSecOps describe un enfoque de trabajo, no un certificado adquirido.

Las fuentes de derechos/brechas/EIPD/DPD se enlazan junto a sus reglas en 48. Las consultas no verifican contratos/cuentas/regiones de Stripe, Mapbox, Cloudflare, Resend, Google o proveedores de observabilidad; esa evaluación se deja en su registro pendiente. No hay datos personales reales, nuevas cuentas o servicios configurados como evidencia de esta entrega.

Se leyó la entrada de security-best-practices y sus cuatro referencias completas para Go backend, JavaScript web general, React y Next.js servidor. Son snapshots de enero de 2026, usados para criterios de política, no versiones finales del proyecto ni una auditoría; no se revalidaron todas sus URLs. Las guías web no sustituyen las fuentes nativas o jurídicas. No se copian umbrales/versiones o afirmaciones simplificadas sobre TLS, CSP, CORS, UUID o ejecución de comandos; prevalecen el stack, los controles y la evidencia real de Foodtrucks.

La validación de tablas detectó cinco filas heredadas en 32 con barras verticales sin escapar dentro de ejemplos de títulos. Se comprobó la causa y se corrigió solo su formato, conservando el texto visible, según [tablas Markdown de GitHub](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/organizing-information-with-tables), consultado el 14/10/2026. Se aplicó systematic-debugging para reproducir el fallo y verificar la corrección; no es una prueba de aplicación.

## Actualización Laravel, 22/10/2026

D47 sustituye el backend Go por Laravel/PHP. Las referencias Go de las revisiones anteriores quedan como procedencia, no como comandos o controles del runtime actual. La actualización de políticas contrasta [Composer](../backend/composer.json), Dockerfile/Compose, phpunit.xml, OpenAPI y el workflow DEV reales con [testing Laravel 13](https://laravel.com/docs/13.x/testing) y [despliegue Laravel 13](https://laravel.com/docs/13.x/deployment), consultados en esta fecha. No acredita ejecución de tests, despliegue nuevo ni auditoría de seguridad. Las integraciones de observabilidad todavía se verifican al implementarlas.
