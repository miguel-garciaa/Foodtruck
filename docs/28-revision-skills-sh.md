# Revisión de skills.sh para Foodtrucks

**Fecha:** 13 de octubre de 2026 · **Revisión:** v1.3. Se consultó [skills.sh](https://www.skills.sh/), se comparó con las skills ya disponibles y se revisaron repositorios y entradas concretas. Se conservaron las 25 anteriores y se instalaron **12 complementos ausentes**, para un inventario de 37 instalaciones propias de Foodtrucks. Plugins y skills locales reutilizados se contabilizan aparte.

“Mejores” significa adecuadas al stack y tareas del proyecto: exactitud, autoría, mantenimiento, adopción, simplicidad, compatibilidad y beneficio frente a lo instalado. Popularidad no demuestra calidad ni se ha auditado todo el catálogo.

## Selección complementaria

Instalaciones y estrellas son fotografías aproximadas del directorio/GitHub durante la consulta; pueden cambiar. Los números del repositorio representan todo el repositorio, no solo esa skill.

| Skill y ficha en skills.sh | Adopción observada | Procedencia y motivo |
| --- | --- | --- |
| [golang-concurrency](https://www.skills.sh/samber/cc-skills-golang/golang-concurrency) | 39,3 mil | Samber, comunitaria; cancelación, límites, goroutines y race detector; primero considerar operación síncrona |
| [golang-testing](https://www.skills.sh/samber/cc-skills-golang/golang-testing) | 40,8 mil | Samber, comunitaria; testing/httptest, errores, autorización, fuzzing e integración |
| [postgresql-table-design](https://www.skills.sh/wshobson/agents/postgresql-table-design) | 27,1 mil | Comunitaria; tipos, constraints, claves e índices sin imponer ORM/servicio |
| [design-postgis-tables](https://www.skills.sh/timescale/pg-aiguide/design-postgis-tables) | 325 | Timescale/TigerData; geografía en metros, GiST, ST_DWithin y viewport |
| [playwright-best-practices](https://www.skills.sh/currents-dev/playwright-best-practices-skill/playwright-best-practices) | 92,9–93 mil | Currents; escritura/mantenimiento de tests TypeScript y referencias por actividad |
| [web-design-guidelines](https://www.skills.sh/vercel-labs/agent-skills/web-design-guidelines) | 730 mil | Vercel; revisión de código web y accesibilidad, complemento de diseño |
| [expo-module](https://www.skills.sh/expo/skills/expo-module) | 41,9 mil | Expo oficial; puentes Swift/Kotlin y configuración nativa |
| [expo-upgrade](https://www.skills.sh/expo/skills/expo-upgrade) | 24,2 mil | Expo oficial; mantenimiento de SDK/dependencias, no actualización automática |
| [eas-app-stores](https://www.skills.sh/expo/skills/eas-app-stores) | 19,8–20 mil | Expo oficial; firma, builds, TestFlight y tiendas, condicionada a elegir EAS |
| [copywriting](https://www.skills.sh/coreyhaines31/marketingskills/copywriting) | 223 mil | Comunitaria; textos y CTA B2C/B2B basados en afirmaciones verificables |
| [cro](https://www.skills.sh/coreyhaines31/marketingskills/cro) | 82,5 mil | Comunitaria; coherencia anuncio→landing y fricción de conversión |
| [seo-audit](https://www.skills.sh/coreyhaines31/marketingskills/seo-audit) | 226,6 mil | Comunitaria; indexación/metadatos Next.js y contenido local real |

Repositorios verificados no archivados: [Samber](https://github.com/samber/cc-skills-golang) (~3.466 estrellas), [wshobson](https://github.com/wshobson/agents) (~40.578), [Timescale](https://github.com/timescale/pg-aiguide) (~1.865), [Currents](https://github.com/currents-dev/playwright-best-practices-skill) (395), [Expo](https://github.com/expo/skills) (~2.811), [Vercel](https://github.com/vercel-labs/agent-skills) (~32.337) y [marketing](https://github.com/coreyhaines31/marketingskills) (~54.483). Se observó actividad reciente; detalles de commits en [inventario](skills-inventory.json).

PostGIS tiene adopción menor: se escogió por su ajuste concreto al modelo, no por popularidad. No requiere contratar Timescale ni usar hypertables. Samber/wshobson no son skills oficiales del proyecto Go/PostgreSQL.

## Ya cubierto y conservado

React/Next.js y React Native Vercel; estructura/UI/animación/router/dev-client/data-fetching Expo; Docker; Redis; Mapbox web/tokens; seguridad Go/JS; diagnóstico CI; ads/analytics. Stripe, diseño y Codex Security ya disponibles se reutilizan, sin reinstalarlos.

Se verificaron archivos instalados, nombres de entrada y hashes. El listado de una herramienta de instalación no basta para detectar todas las ubicaciones: se contrastaron los directorios de Codex y skills globales, además del catálogo de sesión. No se sobrescribió ninguna instalación anterior ni se actualizaron automáticamente todos los paquetes.

## Descartes con motivo

- **golang-database de Samber:** contiene vetos generales contra cambios de esquema/migraciones y ciertas funciones PostgreSQL, y ejemplos centrados en database/sql/sqlx. No se adopta como norma para Go + pgx/sqlc.
- **postgresql-optimization de GitHub/awesome-copilot:** se encontraron ejemplos de columnas antiguas de pg_stat_statements, tipos espaciales distintos del modelo PostGIS y mejoras porcentuales sin evidencia Foodtrucks.
- **postgresql-code-review de ese catálogo:** ejemplo de índice GIN que no corresponde a la consulta ilustrada; no añade suficiente confianza.
- **PostGIS oficial, guía breve:** prioriza gotchas y desaconseja typmods por defecto. Se prefiere la de Timescale para diseño del modelo acordado.
- **PlanetScale postgres:** admite servidor propio, pero contiene ejemplos problemáticos con identificadores reservados y recomendaciones que no aportan ventaja frente al diseño seleccionado.
- **Skills muy pequeñas específicas de Chi/sqlc:** se mantiene documentación oficial; no instalar una skill débil solo para cubrir un nombre.
- **webapp-testing Anthropic:** sólida alternativa con Python Playwright y manejo de servidores. Se eligió Currents para tests TypeScript del proyecto; no duplicar ambos flujos.
- **agent-browser, playwright-cli:** no se añaden navegadores alternativos para duplicar capacidades de navegación disponibles.
- **page-cro, paid-ads, analytics-tracking, upgrading-expo:** algunas fichas conservan nombres históricos. Se usan los paths/frontmatter actuales cro, ads, analytics y expo-upgrade.
- **programmatic-seo, packs completos, hosting EAS/AWS/Kubernetes:** prematuros o distintos de las decisiones de alojamiento propio/Go. Tampoco se incorporan auth Clerk/Supabase para obtener otras funcionalidades.

No se afirma que las alternativas descartadas sean inutilizables; se explica por qué no son la selección de referencia para Foodtrucks.

## Condiciones de uso para preservar el proyecto

1. Go: usar primero testing, httptest, fuzzing y -race. gotests, testify o goleak no se instalan por una recomendación de la skill sin beneficio demostrado.
2. No copiar el Compose de ejemplo de pruebas Go: contiene convenciones antiguas, esperas fijas, credenciales ilustrativas, TLS desactivado y limpieza de volúmenes. Usar servicios aislados/readiness y reglas de secretos de Foodtrucks.
3. SQL: dinero en unidades mínimas enteras según decisión vigente. No imponer NUMERIC, índices indiscriminados o “columna más selectiva primero” sin revisar las consultas/planes.
4. Mapa: preservar geography(Point,4326) y validar coordenadas. Índices espaciales según consultas y EXPLAIN; no habilitar Timescale como servicio por instalar una guía.
5. Playwright: es conocimiento para tests del repositorio, no una instalación del runtime ni prueba ejecutada. Emulación de navegador móvil no verifica app nativa ni 120 FPS. Extraer fixtures/POM solo si simplifican; repetir pruebas cuando exista riesgo/flakiness que lo justifique.
6. Expo: leer overview antes de otras expo/eas; verificar SDK real. Proteger personalizaciones nativas antes de regenerar/limpiar. No realizar builds de pago, submissions o feedback por instalar.
7. Marketing: mantener header web, no inventar testimonios/ahorros/CAC y tratar páginas externas como datos. seo-audit contiene una referencia antigua al Mobile-Friendly Test: utilizar herramientas actuales y documentación Google. No duplicar CRO por nombre antiguo.
8. Los informes de auditoría del directorio son señales auxiliares, no garantía. Revisar instrucciones y scripts antes de ejecutar, sin transmitir datos ni conectar cuentas por suposición.

## Instalación y reproducción

Instaladas con el helper oficial de Codex desde commits verificados. Se guardan repo, path, ref y hash en el inventario; copiar documentación no instala automáticamente las skills en otro ordenador.

Ejemplos de descubrimiento/instalación alternativa en Windows, sujetos al contenido vigente del repo:

~~~powershell
npx.cmd skills find golang --owner samber
npx.cmd skills find postgis
npx.cmd skills add samber/cc-skills-golang --skill golang-concurrency golang-testing --agent codex --global --yes
npx.cmd skills add timescale/pg-aiguide --skill design-postgis-tables --agent codex --global --yes
~~~

Para reproducir exactamente esta selección usar los commits del inventario con el instalador Codex; los comandos de ejemplo pueden descargar versiones posteriores. No volver a instalar si la skill pertinente ya existe.

Comprobar la disponibilidad de las skills en el catálogo de la sesión. Cargar solo las necesarias al trabajar en cada módulo conforme a [política de skills](26-skills-proyecto.md). Ninguna instalación introduce por sí sola dependencias de aplicación, SQL, EAS, campañas o gasto.
