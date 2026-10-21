# Skills de Foodtrucks: selección, instalación y carga

**Requisito del usuario:** descubrir, seleccionar y cargar las skills necesarias para el proyecto. **Estado:** 37 skills base verificadas el 13 de octubre de 2026 (25 iniciales y 12 complementos de v1.3), más cinco skills ECC instaladas en el proyecto el 20 de octubre de 2026. Se reutilizan además las capacidades disponibles de diseño, Stripe y seguridad.

Seleccionar por tarea y fase. Instalación significa que los archivos están disponibles; carga significa leer su SKILL.md y las referencias necesarias antes del trabajo correspondiente. No significa ejecutar automáticamente sus scripts, conectar cuentas, enviar feedback o desplegar servicios.

## Proceso obligatorio para Codex

1. Partir de AGENTS/README, consultar decisiones y el apartado de skills pertinentes e inspeccionar el módulo real. El historial se consulta solo por contexto o conflictos; no cargar todo el inventario por defecto.
2. Elegir una skill principal y los complementos necesarios por intención, tecnología y alcance. Leer su entrada completa y las referencias aplicables.
3. Respetar las decisiones del usuario: Go, Expo/Next.js, PostgreSQL/PostGIS, fotos locales y navegación específica. Una recomendación genérica no cambia el stack.
4. Verificar compatibilidad/versiones/documentación actual al implementar. Registrar qué skill se cargó y con qué objetivo, sin volver a leer entradas ya cargadas en el mismo contexto.
5. Si falta una capacidad, buscar primero fuentes oficiales y revisar autoría, contenido, mantenimiento, licencia y adopción. Instalar solo lo pertinente; no duplicar plugins disponibles.
6. Si no hay una skill fiable, utilizar documentación oficial y las especificaciones de Foodtrucks; no bloquear trabajo independiente ni instalar una alternativa ajena al stack.
7. Informar de lo realmente instalado, cargado, ejecutado y comprobado. Una skill no acredita tests, auditoría, rendimiento ni acceso a servicios.

Comprobar la disponibilidad en el catálogo de cada sesión; los archivos instalados se han verificado localmente. Este trabajo ha leído las entradas necesarias para selección/marketing; las skills de implementación se cargarán al abordar cada módulo.

## Selección base instalada (25 skills)

Los nombres Vercel de la primera columna corresponden al frontmatter; la carpeta local puede ser distinta. Todas se instalaron mediante el instalador de skills de Codex, sin ejecutar sus verificadores o herramientas externas.

| Skill | Procedencia | Cargar cuando |
| --- | --- | --- |
| vercel-react-best-practices | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices) | React/Next.js: render, red, bundle y rendimiento |
| vercel-react-native-skills | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/react-native-skills) | Listas, gestos y rendimiento React Native |
| expo-overview | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-overview) | Orientación y elección de referencias Expo |
| expo-project-structure | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-project-structure) | Estructura de proyectos nuevos; no reorganizar automáticamente una app existente |
| expo-router | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-router) | Rutas y navegación nativa |
| expo-native-ui | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-native-ui) | Pantallas e integración visual nativa |
| expo-animation | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-animation) | Animación y gestos; medir 120 FPS |
| expo-dev-client | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-dev-client) | Development builds, módulos nativos/Mapbox |
| expo-data-fetching | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-data-fetching) | API, caché cliente, estados y recuperación |
| expo-ui | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-ui) | Componentes/plataformas cuando el caso los requiere |
| expo-design-system | [Expo](https://github.com/expo/skills/tree/main/plugins/expo/skills/expo-design-system) | Tokens, claro/oscuro y componentes móviles |
| docker-project-foundations | [Docker](https://github.com/docker/skills/tree/main/skills/docker-project-foundations) | Base Docker de Go/Next.js y estructura operativa |
| docker-build-strategies | [Docker](https://github.com/docker/skills/tree/main/skills/docker-build-strategies) | Imágenes, builds y reproducibilidad |
| docker-compose-patterns | [Docker](https://github.com/docker/skills/tree/main/skills/docker-compose-patterns) | Servicios, redes, healthchecks y persistencia |
| redis-core | [Redis](https://github.com/redis/agent-skills/tree/main/skills/redis-core) | Claves, operaciones, TTL y caché |
| redis-connections | [Redis](https://github.com/redis/agent-skills/tree/main/skills/redis-connections) | Pool, reconexión, timeouts y fallo de Redis |
| redis-security | [Redis](https://github.com/redis/agent-skills/tree/main/skills/redis-security) | Permisos, aislamiento y protección del servicio |
| redis-observability | [Redis](https://github.com/redis/agent-skills/tree/main/skills/redis-observability) | Métricas, memoria y comportamiento real |
| mapbox-web-integration-patterns | [Mapbox](https://github.com/mapbox/mapbox-agent-skills/tree/main/skills/mapbox-web-integration-patterns) | Mapbox GL JS en Next.js |
| mapbox-web-performance-patterns | [Mapbox](https://github.com/mapbox/mapbox-agent-skills/tree/main/skills/mapbox-web-performance-patterns) | Capas, datos y rendimiento del mapa web |
| mapbox-token-security | [Mapbox](https://github.com/mapbox/mapbox-agent-skills/tree/main/skills/mapbox-token-security) | Scopes, separación de tokens y exposición cliente |
| security-best-practices | [OpenAI](https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices) | Código seguro/revisión solicitada Go y JS/TS |
| gh-fix-ci | [OpenAI](https://github.com/openai/skills/tree/main/skills/.curated/gh-fix-ci) | Diagnóstico de checks GitHub Actions fallidos |
| ads | [Comunidad: coreyhaines31](https://github.com/coreyhaines31/marketingskills/tree/main/skills/ads) | Estrategia Google Ads y preparación de campaña |
| analytics | [Comunidad: coreyhaines31](https://github.com/coreyhaines31/marketingskills/tree/main/skills/analytics) | Plan de medición, eventos y conversiones |

Las fuentes oficiales se verificaron con sus repositorios y documentación de [Docker](https://docs.docker.com/ai/skills/), [Redis](https://redis.io/docs/latest/develop/setup/build-with-an-agent/) y [Mapbox](https://docs.mapbox.com/location-ai/agent-skills/). Mapbox/Redis tienen adopción menor que Expo/Vercel: autoría oficial no equivale a madurez o garantía de exactitud. Las dos skills de marketing son comunitarias, no Google.

Se consultó el directorio skills.sh y la actividad de los repositorios, y se revisó contenido/alcance. Eso no constituye una auditoría exhaustiva de todos los archivos o dependencias.

## Capacidades disponibles que se reutilizan

- frontend-design e impeccable: dirección visual y mejora de UI; elegir por tarea, sin cambiar la identidad acordada.
- systematic-debugging: reproducir e investigar fallos antes de corregir.
- Stripe: stripe-best-practices, connect-recommend, connect-required-verification-information y stripe-docs; upgrade-stripe solo al actualizar. No se reinstala el plugin.
- Codex Security: security-scan/security-diff-scan y flujos específicos cuando se solicite o corresponda una revisión; no confundir selección de skills con escaneo ejecutado.
- Figma: cargar la skill concreta antes de una operación Figma. No hay archivo Figma aprobado ni es requisito ejecutar todas sus capacidades.
- Navegación/computer-use: comprobar interfaz cuando sea necesario; instalación no implica que se hayan probado pantallas.

Disponibilidad de plugin/skill no acredita cuenta conectada. Por ejemplo, el conector Stripe solicitó reautenticación en la preparación previa; no se debe declarar operativa su conexión.

## Cobertura que requiere documentación oficial

La revisión v1.3 añadió guías de pruebas/concurrencia Go y diseño PostgreSQL/PostGIS. Siguen necesitando documentación oficial de versión Chi/pgx/sqlc, migraciones de producción, Ubuntu/Caddy, @rnmapbox/maps, APNs/FCM, ActivityKit y Android Live Updates. Las guías no sustituyen los contratos ni acreditan cobertura completa de esos módulos.

Las skills Mapbox web no implementan React Native. Las de SDK nativo Swift/Kotlin no sustituyen al wrapper Expo. Redis incluye ejemplos de otros lenguajes: adaptar principios a Go, sin introducir runtimes adicionales.

No instalar skills de Supabase/Firebase Authentication, Laravel, S3, AWS o Kubernetes por aparecer en búsquedas: no son decisiones de Foodtrucks. U08 solicita planificar Firebase Analytics para medición; SDK/configuración se evalúan separadamente y no cambia auth.

## Límites relevantes del contenido instalado

- Expo incluye referencias a feedback y scripts de inventario. No enviar información a Expo ni otros destinatarios sin instrucción explícita del usuario; revisar scripts antes de ejecutarlos.
- Docker incluye verificadores shell. Revisar su alcance antes de usar y evitar imprimir configuración con secretos. Instalar no crea contenedores ni autoriza limpieza de volúmenes.
- ads presupone acceso directo a plataformas en su introducción: Foodtrucks no lo ha concedido ni verificado. Ninguna recomendación de la skill autoriza publicar anuncios, gastar, llamar a leads o enviar mensajes.
- Los benchmarks, porcentajes y reglas de puja comunitarios son hipótesis, no resultados ni defaults aprobados. Verificar decisiones operativas con datos reales y Google oficial.
- gh-fix-ci tiene un flujo específico de plan/autorización; revisar autorización vigente del usuario antes de modificar. La instalación no implica análisis de PR ni acceso GitHub.
- Seguridad Go/Next.js necesita las referencias aplicables, no únicamente la entrada genérica. No ejecutar un escaneo o modificar configuraciones reales por instalarla.

## Reproducción y mantenimiento

[Inventario técnico](skills-inventory.json) registra repo, paths, referencias fijadas cuando disponibles y hash de cada entrada. Los paquetes de Vercel/Expo/Docker/Redis/Mapbox/marketing se instalaron desde commits específicos; las dos skills OpenAI se instalaron desde main y su hash local queda registrado. No afirmar que una consulta futura de main será idéntica.

La instalación local no viaja automáticamente con el ZIP. En otro equipo, utilizar el instalador oficial de Codex y el inventario, conservando directorio completo/references. Verificar primero si ya existe la skill. No sobrescribir ni actualizar todas indiscriminadamente.

Al cambiar una skill: registrar motivo/ref, leer diferencias y comprobar que no contradiga requisitos; las versiones de frameworks se resuelven independientemente de la versión de la skill. La selección podrá ampliarse según tareas reales, con criterio de mínima complejidad.

## Inicio de cada fase

Fundamentos: Expo overview/estructura, Compose y seguridad. UI móvil: Router, native-ui/UI/design-system y animación según función. Web: Vercel React y Mapbox web. Datos/caché: Redis pertinente y docs PostgreSQL/Go. Pagos: Stripe pertinente. Marketing: ads + analytics con [plan de campaña](27-marketing-google-ads.md).

Cargar solo las entradas/referencias correspondientes al trabajo actual, sin convertir todo el catálogo en contexto permanente.

## Complementos instalados después de revisar skills.sh

| Skill | Cargar cuando |
| --- | --- |
| golang-concurrency | Límites, cancelación y estado compartido en Go |
| golang-testing | Tests de comportamiento, httptest, fuzzing e integración |
| postgresql-table-design | Modelo relacional, constraints y tipos |
| design-postgis-tables | Ubicación, queries por metros/viewport e integridad geográfica |
| playwright-best-practices | Tests web TypeScript; no prueba app nativa |
| web-design-guidelines | Revisión de accesibilidad y código UI web |
| expo-module | Módulos/puentes Swift y Kotlin que realmente hagan falta |
| expo-upgrade | Actualización de SDK solicitada o necesaria, no automática |
| eas-app-stores | Build/firma/distribución si se elige EAS |
| copywriting | Textos de landing y propuestas veraces B2C/B2B |
| cro | Hipótesis y fricción de conversión en destinos de campaña |
| seo-audit | Indexación/metadatos y contenidos locales Next.js |

[Informe de selección](28-revision-skills-sh.md) conserva adopción/fuentes, paths, descartes y condiciones. Los 37 archivos de entrada se verificaron; no se ejecutaron sus scripts. EAS, Playwright y librerías de tests Go no se instalan en la app por instalar una skill.

Preservar dinero entero, índices según consultas, header web y dependencias mínimas. No copiar fixtures antiguas de infraestructura ni tomar benchmarks comunitarios como resultados. Consultar el informe antes de aplicar estas guías.

## Cloudflare y Resend

La ampliación v1.4 utiliza documentación oficial de estos proveedores y Caddy, con las skills existentes de Compose, Go/testing, seguridad y frontend cuando corresponda implementar. No se añade una skill genérica de Workers/hosting ni un stack ajeno al alojamiento propio por elegir Cloudflare Registrar. La integración HTTPS de Resend tampoco obliga a introducir un SDK o SMTP.

Leer [guía DNS/HTTPS](29-cloudflare-dominio-dns.md) y [correo](30-correo-resend.md); validar nombres, versión y APIs vigentes. Las 37 instalaciones del inventario se conservan sin cambios. Cuenta conectada, DNS verificado y pruebas de envío requieren evidencia distinta de la instalación de una skill.

## Marketing ampliado U08

Utilizar seo-audit para revisión/rutas/SEO local, analytics para diccionario y medición, ads para adquisición, copywriting/cro para contenido y embudos; Vercel React/Expo pertinentes para implementación. No sumar porcentajes de guías comunitarias como resultados ni aplicar benchmarks al presupuesto pendiente.

Fuentes oficiales cubren ASO, Search Console/GBP, AdSense/AdMob, CMP/UMP y GA4/Firebase. Que una skill mencione Firebase no instala ni habilita el SDK o Authentication. [Plan y límites](31-marketing-digital-maestro.md). Se conservan 37 skills, sin instalaciones adicionales por esta ampliación.

## Seguridad/QA, observabilidad y costes

Aplicar security-best-practices a referencias Go y frontend JS/TS para la guía solicitada; golang-testing, Playwright, Expo y Compose según módulo. Codex Security se utiliza para un escaneo real de código solo cuando exista un objetivo/acceso válido, no para inventar findings del paquete documental. Sentry disponible como plugin no acredita una cuenta conectada o SDK instalado.

La documentación oficial de OpenAI se consultó para distinguir uso incluido y API; importes de Plus/OpenCode/Figma/21st.dev proceden del usuario. Grafana/Prometheus/Sentry/Cloudflare se dimensionan y verifican con sus fuentes oficiales. Se mantienen las 37 skills, sin instalaciones ni compra de servicios por estas ampliaciones.

<a id="seleccion-ecc-del-proyecto"></a>

## Selección ECC del proyecto

**20/10/2026:** el usuario solicita [ECC](https://github.com/affaan-m/ECC) y elige una selección compatible con Foodtrucks. Cinco skills instaladas mediante `skill-installer --dest .agents/skills`, desde el commit `6f1881aeafa3c48f7b603cc4be4b2e4e70daad59` (versión declarada 2.2.3, licencia MIT). El [inventario](skills-inventory.json) fija rutas y hashes; la [licencia](../.agents/ECC-LICENSE) acompaña las copias.

| Skill instalada | Cuándo cargarla | Fuente existente de Foodtrucks |
| --- | --- | --- |
| [api-design](../.agents/skills/api-design/SKILL.md) | Diseñar o revisar endpoints REST | [API](20-api.md) |
| [contract-first](../.agents/skills/contract-first/SKILL.md) | Coordinar contratos Go/web/móvil y sus consumidores | [API](20-api.md); OpenAPI cuando se implemente |
| [change-impact](../.agents/skills/change-impact/SKILL.md) | Evaluar cambios transversales, datos o permisos | Documentos del módulo y [pruebas](40-testing-qa-github.md) |
| [docs-governance](../.agents/skills/docs-governance/SKILL.md) | Elegir el alcance de una revisión documental | README y documentos actuales |
| [living-docs-governance](../.agents/skills/living-docs-governance/SKILL.md) | Reducir duplicidad y mantener fuentes claras | AGENTS, [arquitectura](07-arquitectura-monorepo.md), [roadmap](22-roadmap.md), [decisiones](23-decisiones-pendientes.md) y [procedencia](00-procedencia.md) |

Se leyeron las cinco entradas y el contrato de roles de `docs-governance`. Sus scripts se conservan sin ejecutarse. La instalación no añade hooks, MCP, memoria, agentes, configuración global ni dependencias de aplicación. Las skills se cargan por tarea; su detección se comprueba en el siguiente turno.

Aplicar los ejemplos al contrato existente: dinero entero en unidades mínimas y moneda explícita, errores acordados, consultas parametrizadas y límites medidos. No copiar el importe `double` de `contract-first`, tarifas de rate limit o plazos de retirada de API como decisiones. Las referencias a otros frameworks no cambian Go/Chi/pgx/sqlc.

Las skills relacionadas que ECC menciona no son dependencias instaladas automáticamente. Reutilizar los registros actuales antes de proponer ADR, CONTEXT, TESTS o nuevas políticas. Se omiten guías genéricas ya cubiertas de frontend, Go/testing, Docker, Redis y seguridad; flujos con umbrales universales o herramientas externas sin integración. ZIP e informe v1.10 conservan la instantánea anterior a esta instalación.
