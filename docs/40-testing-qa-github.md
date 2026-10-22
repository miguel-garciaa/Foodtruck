# Testing y QA de Foodtrucks

**CI propia 22/10/2026:** [workflow](../.github/workflows/dev.yml), [matriz ejecutable y límites](devops/README.md#cicd-propio-autorizado-el-22102026). Ampliados tests de cuentas, recuperación/revocación, favoritos, dispositivos, imágenes y fallo simulado de Google; sin proveedores reales desde CI. `PostgresTestCase` solo permite migrar `foodtrucks_testing` en entorno `testing`; Redis DB 15 en loopback del runner. Informe y operación comprueban fallo/cancelación/omisión, reintento, lock y rollback compatible. Android comprueba catálogo sintético existente; cuentas móviles reales pendientes de integración. Pagos, web, iOS y tiendas siguen pendientes.

**Actualización 21/10/2026 (D47–D49):** Laravel/PHP sustituye Go como backend principal. Las recetas Go/sqlc siguientes conservan contexto histórico y no son comandos del backend activo. Mandan Composer, migraciones Laravel, OpenAPI y la [guía real del backend](../backend/README.md). Google se incluye en este hito; foodtruck.bid está verificado en Resend. Nueva clave de envío y Cloudflare Tunnel aplazados expresamente; no hay publicación de API.

**Consolidación:** 20 de octubre de 2026. Esta guía define qué probar y qué evidencia demuestra el comportamiento. La obligatoriedad de controles, revisión/Git/CI y promoción se rige por [44](44-politica-commits-ci-cd-tests.md); [21](21-entornos-ci-cd.md) define aislamiento y [39](39-seguridad-devsecops.md) los controles de seguridad. Los 29 apartados recibidos y QA01–29 se conservan como especificación; no hay tests de aplicación ni CI implementados/ejecutados en este paquete.

## 1. Preparar la verificación

Seguir la auditoría de 44 §2 y obtener baseline real de tests/build/cobertura, distinguiendo fallos previos de regresiones. El responsable de QA selecciona por riesgo, mantiene fixtures y trata flakes; autor y revisor comprueban assertions y evidencia según sus responsabilidades en 44 §10. Registrar contratos comerciales pendientes antes de escribir sus expectativas; no inventar reglas para completar un test.

## 2. Pirámide y selección de herramientas

| Nivel | Qué valida | Base propuesta y límites |
| --- | --- | --- |
| Unitario/domain | Precio entero, descuento aprobado, estado, elegibilidad, serialización y validaciones | Go testing/subtests/fuzzing; frontend Jest/Vitest según proyecto real |
| Componente | Interacción visible, errores, accesibilidad, tema y estados de carga | Testing Library web/nativa compatible; sin verificar solo que renderiza |
| Integración | API Chi, auth, SQL real, transacciones, caché/outbox y workers | PostgreSQL/PostGIS y Redis de prueba aislados; pgx/sqlc, no SQLite sustituta |
| Contrato/proveedor | DTO/API, firmas, idempotencia, errores y cuenta/entorno | Fakes en frontera + sandboxes reales controlados para casos que los necesiten |
| E2E web | Recorridos Next.js → Go → DB y roles | Playwright TypeScript compatible; pocos recorridos críticos |
| E2E nativo | SDK nativo, enlaces, permisos, mapa, pago, QR, notificaciones | Maestro o Detox a evaluar; dispositivos/development/release builds |
| Operación | Artefacto, TLS/proxy, migración, smoke, backup/restore y rollback | Staging propio; efectos externos desactivados |

Go primero testing/httptest y herramientas estándar. Usar tablas de casos/subtests y resultados observables; t.Parallel solo con fixtures independientes. Race detector comprueba carreras de memoria ejecutadas, no sustituye los tests de concurrencia económica en DB. Fuzzing con corpus saneado valida parsers/geometría/IDs/aritmética donde aporte; no usar float para dinero. [Go testing](https://pkg.go.dev/testing), [race detector](https://go.dev/doc/articles/race_detector), [fuzzing](https://go.dev/doc/security/).

Para Expo revisar SDK antes de Jest/jest-expo y React Native Testing Library; Jest/Vitest web según scripts existentes. Tests JS no ejecutan módulos Swift/Kotlin reales ni acreditan firma/push/Mapbox. No añadir Maestro y Detox simultáneamente sin necesidad. [Expo unit testing](https://docs.expo.dev/develop/unit-testing/), [React Native testing](https://reactnative.dev/docs/testing-overview).

Mocks/fakes pequeños de servicios externos; integration/E2E crítico atraviesa API propia y datos reales de prueba. Mock de todo el checkout no demuestra autorización, persistencia o pago reconciliado. OAuth/mapa/SDK externos necesitan pruebas específicas de compatibilidad fuera de CI rápido. Fakes de firma/cobro no sustituyen la prueba sandbox de Stripe. No instalar gotests/testify/goleak, Testcontainers u orquestación adicional sin beneficio concreto.

## 3. Matriz de comportamiento y riesgos

Todos los casos usan datos sintéticos y assertions sobre resultado, DB/eventos y ausencia de efectos indebidos. La numeración QA es interna; no indica tests implementados.

| ID/área | Happy path y negativos esenciales | Evidencia/prueba |
| --- | --- | --- |
| QA01 Identidad | Registro/login/logout; contraseña inválida, email duplicado no enumerativo, token exp/repetido, refresh concurrente, sesión revocada/Redis caído | API/direct handler + integración de sesiones + flujo web/nativo |
| QA02 Google/Apple | iss/aud/firma/nonce/state/PKCE/redirect según flujo; email coincide pero no prueba control; nombre/relay Apple ausentes | Fakes contractuales + callback y sandbox/control de cuenta autorizado |
| QA03 Permisos | Cliente A no ve pedido/ticket/saldo B; comerciante X no ve/edita Y; rol enviado no eleva; miembro retirado pierde conexión | Tabla API 39, listados/anidados/exportaciones y tiempo real |
| QA04 Descubrimiento | Publicado con carta/ubicación vigente; oculto no aparece; bbox/radio/NaN/cursor/rangos enormes inválidos | PostGIS real, JSON/DTO público, paginación y tiempos medidos |
| QA05 Carta/fotos | Precio/opciones/alérgenos válidos; producto ajeno, cantidad límite, MIME falso/traversal/bomba de dimensiones/cuota | API/SQL/media controlado; render no ejecuta contenido |
| QA06 Cotización | Total entero/moneda/reglas; precio/discount/saldo cliente ignorados o rechazados, overflow y cambio de precio | Unitario + integración autoritativa; no inventar impuestos/ratios |
| QA07 Pedido/stock | Un pedido por clave; clave con payload distinto conflicto; dos compradores de última unidad o franja | Barrera de concurrencia DB real; política P07/P08 previa |
| QA08 Pago | Crear/recuperar mismo contexto; fallo/timeout incierto, 3DS/cancelación cuando aplique, frontend declara paid | Fake externo controlado + Stripe sandbox; verificar un cobro/estado autorizado |
| QA09 Webhooks | Firma raw body/entorno/cuenta/importe correctos; false/replay/duplicado/desordenado/body grande/DB caída | Persistencia y dedup; ACK no precede commit; retry/conciliación |
| QA10 Estados | Aceptar/preparar/listo/recoger según máquina aprobada; salto ilegal o versión vieja | Unitario de transición + integración atómica + cola comerciante |
| QA11 QR | Pedido propio listo/pagado; comercio ajeno/QR impagado/cancelado; dos scans simultáneos | Una redención DB, resultado coherente; token ausente en logs/URL pública |
| QA12 Billing | Cliente 5,99 €/mes separado de licencia/comerciante; derechos falsos, doble alta, eventos atrasados | Sandbox/fakes y proyecciones; impuestos/baja/canal aún pendientes |
| QA13 Fidelización | Un crédito por origen; doble gasto/cupo desde dos dispositivos; reserva vence+pago tardío; refund parcial repetido | Ledger/compensación+proyección transaccional; reglas P30–34 previas |
| QA14 Redis/outbox | Commit → invalidación; relleno obsoleto, Redis caído, worker muere/reintenta y evento repetido | No fuga entre actores, autorización duradera y efecto único lógico |
| QA15 Resend | Destinatario/finalidad, firma/reintento/dedupe, baja/rebote/queja, link exp/GET escáner | Sink/fake CI; allowlist staging; no envío real por restaurar backup |
| QA16 Avisos | Token propio/app/entorno; denegado/expirado, desconexión/orden duplicado y fallback | Fake CI + dispositivos reales APNs/FCM/Activities/Updates |
| QA17 Navegación nativa | Deep/universal/app link válido/cold/warm; ruta/host inválido, permiso geolocalización/cámara rechazado | iOS/Android compatible; cambios de cuenta no conservan privados |
| QA18 UI/a11y | Claro/oscuro/sistema, teclado/foco/error/lector/tamaño de fuente/reduced motion | Web: axe y revisión manual; móvil VoiceOver/TalkBack y dispositivos |
| QA19 Marketing/datos | SEO publicado/metadata/JSON-LD/sitemap; rechazo/retirada de consentimiento desde arranque | No PII/tokens/QR en URL/evento, conversiones dedup, privado no indexado |
| QA20 Infra/release | TLS/renovación, Cloudflare API sin challenge, puerto privado; migración y restore sin side effects | Entorno propio, exposición externa controlada; sólo ejecución autorizada |

Cuando una política comercial está pendiente, verificar invariantes independientes y documentar las pruebas afectadas como pendientes. No completar un test de refund inventando el derecho a reembolsar. Escenario de recogida presencial: no hay delivery, repartidor o tracking de un conductor.

### Concurrencia y consistencia reproducibles

Usar dos clientes/goroutines y conexiones SQL separadas, una barrera para iniciar juntas, deadline y repetición justificada. Assert sobre unicidad/stock/ledger/estado/outbox y resultado de cada operación, no solo status 200. Un test envuelto siempre en una única transacción que luego se revierte no reproduce correctamente dos commits competidores.

Fixtures independientes por test/worker y reloj controlable para expiración; health/readiness en vez de sleeps fijos. No TRUNCATE, borrado de volúmenes o migraciones destructivas sobre un DSN ambiguo. Guardrail de entorno/nombre/origen de DB de pruebas, credenciales limitadas y teardown exclusivo de recursos creados por la suite. Probar locks/deadlocks/retry de la estrategia elegida con límites, sin ocultar errores transitorios.

### Pagos, correo, push y publicidad en pruebas

CI rápido: Stripe fake/fixtures saneadas, Resend sink/fake, push fake, Mapbox fixtures cuando baste, Google/Apple exchange simulado y salidas de analítica/publicidad bloqueadas. Integración con proveedor: sandbox/test accounts propias y entorno separado, trigger confiable y credenciales mínimas; nunca tarjeta, destinatario, dispositivo o cuenta live de usuario. Stripe CLI puede servir para forwarding/eventos de prueba si ya está instalada/configurada, sin exponer tokens. [Pagos](13-stripe.md), [correo](30-correo-resend.md).

Resend no se presupone sandbox que impide mandar a personas reales: allowlist de cuentas de prueba si se activa staging. AdMob TestIds cuando se evalúe, AdSense flags/slots live desactivados; ni clicks reales de prueba, ni compras, ni conversions live, ni emails a terceros desde CI. Restaurar DB exige desactivar workers/efectos antes del primer arranque. [Publicidad](33-monetizacion-adsense-admob.md), [medición](34-analitica-consentimiento.md).

## 4. E2E web, nativo, regresión y accesibilidad

Web: visitante explora negocio publicado/carta; cliente autenticado compra de prueba y recupera pedido; comerciante autorizado prepara y canjea; otros actores reciben denegación. Habilitar checkout web solo si P09 lo incluye; paneles/descubrimiento se prueban según alcance realmente implementado. Usar locators por rol/etiqueta, assertions con espera automática, contexto por usuario y fixtures aisladas. No sleeps para esconder carreras ni shared storageState privado entre usuarios. [Playwright best practices](https://playwright.dev/docs/best-practices).

No instrumentar un E2E completo por cada combinación ya probada abajo. Capturar trace/screenshot/video al fallo con retención y saneamiento; un HAR/storageState puede contener credenciales y no se añade a Git sin revisión. Retries limitados son diagnóstico, no aprobación de tests intermitentes. Registrar flake y corregir causa; repetir cinco veces solo por una preocupación concreta, sin coste obligatorio por toda PR. POM se usa si reduce repetición real; no una clase por fragmento.

Nativo: tests de componentes y pocos recorridos Maestro/Detox si compensan, development build para Mapbox/módulos, release para rendimiento. Matriz pendiente: dispositivo/SO/mínimos, iOS/Android, 60/90/120 Hz cuando compatibles, permiso denegado, red lenta/offline, app fría/caliente, cambio de sesión y ambos temas. Verificar firma, links, Apple/Google, QR/cámara, push y superficie de SO antes de release. Emulación web móvil de Playwright comprueba navegador responsive, **no** React Native ni 120 FPS.

Regresión: reproducir el defecto confirmado con prueba que falla en la versión previa y pasa con corrección, cuando sea practicable; conservar evidencia sin reintroducir fallo en rama de entrega. No tests que reflejen nombres internos o snapshot gigante como sustituto de comportamiento. Revisión de assertions y ramas límite, error externo, recursos inexistentes/permisos y concurrencia.

Accesibilidad: controles etiquetados, focus management, teclado y lector, contrastes en ambos temas, estado comunicado y tamaño de texto. Probar header/menú responsive web y dock únicamente nativo; mapa debe ofrecer alternativa usable/lista, no depender solo de color/posición/gesto. axe automatiza parte; teclado/VoiceOver/TalkBack requieren revisión real. Ningún porcentaje automático equivale a cumplimiento universal. [Diseño](05-design-system.md).

## 5. Cobertura, rendimiento y calidad de datos

Baseline al existir tests. Publicar cobertura de módulos/rutas críticas y ramas no probadas junto con calidad de assertions. Umbral progresivo por riesgo y cambio, pendiente hasta observar baseline; no imponer 100 % ni un 80 % inventado global. No excluir código crítico para inflar porcentaje. Perfil Go/Lcov y reportes compatibles con herramientas elegidas, retenidos sin datos privados.

Carga controlada de descubrimiento/PostGIS, carta, auth, cotización/pedido/transición: plan con entorno propio, volumen/duración, usuarios concurrentes, dataset, ramp-up, stop conditions y presupuesto. k6 es candidato, no instalado ni ejecutado. No cargar producción o la red doméstica compartida sin autorización; tampoco activar pagos/emails/promociones durante el test. Registrar p50/p95/p99, errores, throughput, CPU/RAM/disco/I/O/conexiones y terceros separados. [k6](https://grafana.com/docs/k6/latest/testing-guides/).

120 FPS según [16](16-rendimiento.md): release/dispositivo real, tiempos de frame y dropped frames, gestos/mapa/fotos/tema, memoria/batería/temperatura. Targets p95/p99 y pérdidas aceptables pendientes; la bandera ProMotion no demuestra FPS. Comparar antes/después con misma escena/dataset. Core Web Vitals campo y laboratorio diferenciados; no usar Lighthouse como prueba del objetivo nativo.

Datos: fixture válido geográfico, timestamps/moneda, constraints/relaciones, pipeline de migración/sqlc y contratos TS; no ciudades/reseñas/ofertas ficticias publicadas. La venta/refund/QR viene de Go/Stripe/DB. GA4/Firebase comprueba consentimiento, deduplicación por origen, eventos fuera de orden y no fuga; dashboard no sustituye reconciliación del backend. [Observabilidad](41-observabilidad-grafana-prometheus-sentry.md).

## 6. Ejecución y comandos de referencia

La clasificación obligatoria/informativa/periódica/manual y herramientas de scans están en 44 §7; selección, resultados y fallos del pipeline en §5–6. Esta sección muestra comandos propuestos, **no ejecutados**, que deben ajustarse al repositorio real.

Desde backend/ **solo cuando existan go.mod, herramientas y rutas propuestas**:

~~~bash
gofmt -l .
go vet ./...
go test ./...
go test -race ./...
govulncheck ./...
go build ./cmd/api
go build ./cmd/worker
go test -coverprofile=coverage.out ./...
go tool cover -func=coverage.out
~~~

Si se adopta separación de integración por build tag, añadir go test -race -tags=integration ./... con PostgreSQL/PostGIS y Redis de prueba preparados. Race no sustituye dos conexiones/commits SQL concurrentes ni la prueba de idempotencia de Stripe/QR. Regeneración sqlc y gofmt se convierten en scripts reproducibles con tools/versiones fijadas; el check gofmt debe fallar cuando `gofmt -l` produzca rutas, ya que listar rutas no falla por sí mismo. govulncheck requiere herramienta y configuración verificadas; si falta, el control obligatorio queda fallido/pendiente, no verde. No usar APIs nuevas de testing citadas en una skill hasta confirmar versión Go real.

Frontend: elegir npm/pnpm del lockfile; npm ci o pnpm install --frozen-lockfile; después scripts **realmente definidos** lint/typecheck/test/build en cada workspace. Playwright test requiere configuración y browsers de versión correspondiente; no suponer que npm run build prueba iOS/Android. Registrar el comando final por carpeta una vez exista el código, sin usar --if-present para aprobar una comprobación obligatoria ausente.

## 7. Fases A–G y evidencia

Las fases describen la aceptación transversal de seguridad y QA. El detalle del pipeline pertenece a 44; las filas no acreditan fases implementadas.

| Fase | Resultado verificable futuro | Estado actual |
| --- | --- | --- |
| A Auditoría | Inventario real Git/código/versions/tests/workflows/infra, baseline y riesgos con evidencia | Material documental inspeccionado; auditoría app pendiente por ausencia de repositorio |
| B Seguridad crítica | Auth/permisos/precios/pagos/QR/puntos/secretos corregidos y probados por bloque | Requisitos 39; no correcciones de app |
| C Testing | Matriz crítica ejecutable, integración/concurrencia y E2E/regresión con reports | Plan 40; no tests app |
| D CI | GitHub Actions ejecutado para el SHA exacto enviado; gate always fail-closed probado y scans reales | Política; ninguna ejecución Actions |
| E CD | Imágenes GHCR por digest; staging automático; producción con aprobación manual del mismo digest y rollback probado | Política condicionada al host/cuentas; no build, scan, paquete o despliegue |
| F GitHub | Política/owners/protecciones/Dependabot/PR reales y checks del commit vigente | Acceso/repo/plan por aportar; no cambios remotos |
| G Calidad | Baselines/SLO/observabilidad/restore/performance y documentación operables | [41](41-observabilidad-grafana-prometheus-sentry.md) y plan; no métricas de app |

Aplicar el cierre técnico y los estados de 44 §12, con decisión de pruebas de §4 y evidencia A–J de §11. Documentación comprobada no equivale a fases B–G ejecutadas; merge y producción son etapas separadas. La ausencia de un comando obligatorio no se aprueba por omisión.

## 8. Cobertura de los 29 apartados

Se conserva la trazabilidad hacia sus fuentes responsables; estas filas son un índice de obligaciones y aceptación, sin copiar los prompts originales.

| Apartado | Política incorporada y ubicación | Evidencia de aceptación futura |
| --- | --- | --- |
| 1 Rol y responsabilidades | 39 y 44 §10: ingeniería, seguridad, DevSecOps, revisión y operación; §1 de esta guía: QA | Propietarios asignados y responsabilidades verificables |
| 2 Contexto | Go/Chi/pgx/sqlc, PostgreSQL/PostGIS, Redis justificado, Next.js, Expo/React Native y recogida sin delivery | Inventario real respeta decisiones; recursos VM solo dev |
| 3 Reglas de ejecución | 39: seguridad; 44 §2–3: auditoría y límites de cambios/Git/despliegue | Status/diff propio, herramientas/arquitectura inspeccionadas y autorización aplicable |
| 4 Auditoría general | 39 marcos, SEC01–08, fronteras, hallazgos y excepciones | Hallazgos con evidencia real; controles de auth/permisos/datos probados |
| 5 Next.js | 39 SEC05; QA18/19, TypeScript/build web | Servidor/cliente, cookies/CSRF/CSP, rutas, caché y datos emitidos comprobados |
| 6 React Native | 39 SEC06; E2E nativo y release | SDK Expo real, Keychain/Keystore, links, permisos y builds iOS/Android verificados |
| 7 API/backend | Inventario 39 y 20; QA01–05/09 | Método/ruta/roles/entradas/salidas/límites reales; denegaciones directas probadas |
| 8 Pedidos/precios/pagos | 39 SEC04; QA06–13, transacciones/sandbox | Autoridad Go, idempotencia, Stripe auténtico, concurrencia, estados y QR probados |
| 9 Dependencias | 39 SEC08; 44 §7: SCA, supply chain y licencias | Inventario/locks/licencias, compatibilidad, govulncheck/auditoría/build reales |
| 10 Secretos | 39 SEC08; 44 §7/10: secret scanning y confianza Actions | Prevención/evidencia saneada; rotación autorizada y alcance si existe exposición |
| 11 Testing | Pirámide, matriz QA01–20, regresión/E2E/a11y; 44 decisión por cambio | Test nuevo/adaptado/existente ejecutado o sin test justificado; resultados reales |
| 12 Seguridad automatizada | 44 §7: clases y controles SAST/SCA/secretos/imagen/DAST | Scans aplicables reales, findings triageados y entorno dinámico autorizado |
| 13 Cobertura | Baseline/ramas/assertions por riesgo | Reportes auténticos y no reducción injustificada de módulos críticos |
| 14 GitHub Actions CI | 44 §5–6: monorepo, selección, gate y SHA; comandos en §6 de esta guía | Ejecución del SHA exacto; faltantes/fallos/saltos inesperados bloquean |
| 15 GitHub Actions CD | 21: aislamiento; 44 §8–9: GHCR, staging y promoción | Staging automático validado; aprobación manual de producción y mismo digest |
| 16 Quality gates | 44 §7: clases obligatoria/informativa/periódica/manual | Fallos obligatorios bloquean; control ausente no produce falso verde |
| 17 Ramas y PR | 44 §3/5: ramas/protecciones/owners y disponibilidad pendientes | Reglas reales, revisiones y checks obligatorios; sin bypass/force-push |
| 18 Commits | 44 §3: Conventional Commits y cierre por bloque | Asunto/cuerpo específicos, alcance atómico y pruebas realmente ejecutadas |
| 19 Precommit | 44 §3: status/diff/diff --check, propios, hooks y stage selectivo | Diff revisado, hooks correctos e inspección del commit final |
| 20 Push | 44 §3/6: agente local, misma PR y SHA exacto | Remoto/branch/base autorizados, push real y Actions del SHA exacto |
| 21 Code review | 44 §3: revisión de corrección/seguridad/recursos/a11y/performance | Hallazgos relevantes corregidos; IA diferenciada de revisión humana |
| 22 Pull Requests | 44 §3: contenido de PR, checklist y revisiones | Checklist auténtico, evidencia saneada y aprobación independiente según reglas |
| 23 Observabilidad | 41; 39 privacidad/incidentes; QA datos | Errores/latencia/auth/pedidos/pagos/servicios/DB/deploy con alertas y sin secretos |
| 24 Rendimiento/carga | Entorno autorizado, p50/p95/p99/recursos; 16 nativo | Mediciones reproducibles; 120 FPS solo release/dispositivo físico compatible |
| 25 Documentación | Política integrada en documentos del paquete | Enlaces/coherencia comprobados; guías útiles sin duplicados vacíos |
| 26 Roadmap | Fases A–G de esta guía; 44 §11 para implantación CI/CD | Cada fase entrega evidencia y bloques coherentes; fallo obligatorio impide cierre |
| 27 Informe por iteración | 44 §11–12: entrega A–J, estados y trazabilidad | Tests/build/CI/Git/reviews/releases reales, pendientes y riesgos declarados |
| 28 Definición de terminado | 44 §3/12: cierre técnico, merge y producción diferenciados | Implementación/revisión/tests/gates/SHA correctos; aprobaciones necesarias |
| 29 Ejecución de auditoría | 00: alcance histórico; 44 §2 y 39: auditoría sobre código/acceso real | Código/Git/accesos reales antes de auditar/implementar; ningún resultado simulado |

## 9. Pendientes y aceptación

Consultar las decisiones pertinentes de [23](23-decisiones-pendientes.md): scripts/gestor/toolchains/baseline, reglas comerciales, fixtures PostgreSQL/PostGIS/Redis y sandboxes, dispositivos, SDK y cuentas de firma. Los recursos staging/PROD se verifican en [38](38-servidor-domestico.md), sin inferirlos de la VM DEV.

El responsable técnico/QA revisa plan de casos, comandos y evidencia; el responsable de CI valida selección, permisos y fallos controlados según 44 §6/11. No copiar de skills credenciales, sleeps, floats monetarios, teardown destructivo, versiones o Actions sin verificar. Guías o búsquedas de palabras no sustituyen pruebas de comportamiento. Referencias técnicas se revalidan por versión/plan al implementar.

## 10. Recursos UI y permisos

Los escenarios de [45](45-catalogo-21st-frontend.md), [46](46-panel-admin-negocios-suscripciones.md) y [47](47-novedades-onboarding-permisos.md) complementan la matriz principal.

| ID | Escenario a comprobar al existir código | Resultado exigido |
| --- | --- | --- |
| QA21 Novedades | Primera presentación relevante, varias novedades de la misma actualización, repetición/actualización menor, cambio rol/plataforma, cierre/Ahora no y consulta Perfil | Una presentación automática agrupada por actualización con identificador estable; cambiar de rol no repite una presentación consumida; contenido elegible real; reapertura manual; no interrumpir compra/pago/pedido/QR |
| QA22 Permisos | Concedido, denegado, temporal, revocado, canAskAgain false, regreso ajustes y permisos provisionales/capacidades push | Estado real releído; sin prompts insistentes/cadenas; alternativa manual/seguimiento; iOS/Android preavisos apropiados; no permisos extras en binario |
| QA23 Admin y fechas | Actor no admin/recurso ajeno, guardado/suspensión fallido, factura ausente, búsqueda/filtros/paginación y cambio concurrente | Go autoriza y audita; estados independientes; motivo/confirmación y pendiente/error persistentes; precios/pedidos no se alteran por UI |
| QA24 Recursos/tema/a11y | Ambos temas, responsive, keyboard/VoiceOver/TalkBack, texto grande, imágenes ausentes, largo contenido, rango de fechas/zona horaria | Controles/acción accesibles, filtro observable, header web/dock solo nativo, indicador anunciado y movimiento reducido; licencia/runtime/source revisados |

Fechas: probar límites del rango y cambios de mes/año/hora en la zona operativa configurada, sin inferir reservas. Formularios preservan borrador/error al fallar; tarjetas de precio/movimientos no aceptan valores de demo como autoridad. Cámara solo escáner comerciante; mostrar QR cliente no pide permiso. Selector de imágenes no obliga a biblioteca completa/audio. Tests JS no acreditan solicitudes reales del SO o rendimiento de dispositivo.

## 11. Protección de datos y gobernanza

Relacionar la [política de protección de datos](48-proteccion-datos-gobernanza.md) con requisitos propios y casos observables. La decisión de añadir/adaptar/ejecutar pruebas sigue [44](44-politica-commits-ci-cd-tests.md); no generar tests por cada referencia normativa ni un segundo gate de aceptación.

| ID | Escenario futuro con datos sintéticos | Resultado exigido |
| --- | --- | --- |
| QA25 Exportación | Cuenta propia, usuario ajeno, soporte sin permiso y enlace expirado/reutilizado | Autenticación y autorización por alcance; salida mínima sin datos de otro cliente/negocio ni secretos; entrega con visibilidad/plazo controlados |
| QA26 Supresión/restricción | Solicitud aprobada, repetida y concurrente; DB, Redis, medios, colas y proveedores pertinentes | Estado consistente e idempotente; accesos/información pública invalidados; conservación aprobada separada y restringida; resultado externo incierto no se declara completado |
| QA27 Recuperación | Backup anterior a una supresión/retirada, restauración aislada y outbox antigua | Reaplicar decisiones posteriores antes de abrir acceso/reactivar workers; datos suprimidos no vuelven a servirse ni generan envíos/exportaciones; conciliar efectos económicos |
| QA28 Telemetría | PII/tokens/QR señuelo en errores, URLs, logs, trazas, breadcrumbs, reportes y artifacts CI | Filtrado antes de salida, acceso limitado y retención aplicable; evidencia saneada; no dashboards públicos ni datos privados en labels |
| QA29 Consentimiento | Rechazo/retirada antes del arranque, después de enqueue, tras reinicio/restauración y fallo del proveedor | Ninguna recogida/exportación no permitida; no replay histórico; compra/QR operativos; retirada y solicitud de supresión siguen procedimientos distintos |

Probar comportamiento real en la capa más útil: contratos/componentes para entradas y estados, integración PostgreSQL/PostGIS/Redis/medios para efectos y tests controlados de proveedores cuando proceda. No usar datos live ni asumir que un fake demuestra una eliminación externa. Registrar requisito, caso, comando, resultado, SHA/entorno, responsable y limitaciones; bases, plazos y conservación pendientes no se inventan para completar assertions. Los casos QA25–29 no están implementados ni ejecutados en este paquete documental.
