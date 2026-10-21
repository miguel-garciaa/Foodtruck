# Política de commits, pruebas y CI/CD

**Actualización 21/10/2026 (D47–D49):** Laravel/PHP sustituye Go como backend principal. Las recetas Go/sqlc siguientes conservan contexto histórico y no son comandos del backend activo. Mandan Composer, migraciones Laravel, OpenAPI y la [guía real del backend](../backend/README.md). Google se incluye en este hito; foodtruck.bid está verificado en Resend. Nueva clave de envío y Cloudflare Tunnel aplazados expresamente; no hay publicación de API.

**Consolidación:** 20 de octubre de 2026. Fuente canónica del ciclo de cambios, controles CI y promoción. Política documentada; aplicación, Git/remoto, workflows y ejecución **NO VERIFICADOS**. [21](21-entornos-ci-cd.md) define entornos, [40](40-testing-qa-github.md) desarrolla pruebas y [DevOps](devops/README.md) ofrece procedimientos. Los detalles de implementación siguen siendo propuestas hasta verificarlos en el repositorio real.

## 1. Objetivo, decisiones y autoridad

Cada cambio debe ser trazable desde su requisito y pruebas hasta el commit, CI y artefacto promovido. Las decisiones D33–D36 confirman commit/push por cambio coherente, GitHub Actions, GHCR, staging automático y aprobación manual de producción del mismo artefacto. El stack y alojamiento se rigen por [decisiones](23-decisiones-pendientes.md), sin añadir plataformas para completar este ciclo.

La autorización de commit/push cubre cambios solicitados en rama propia; no concede merge, push directo a rama protegida, force-push, autoaprobación, cobros, mensajes a terceros, producción o tiendas. Producción exige aprobación de la release concreta. Integrar requisitos en sus políticas, sin copias de prompts ni resultados ficticios.

## 2. Auditoría antes de implementar CI

Inspeccionar AGENTS/README y la documentación pertinente; Git/status/diff, rama/remotos, cambios ajenos; manifests/lockfiles/toolchains, Go/workspaces/router/nativo prebuild o bare, SQL/migraciones, Docker/Compose/Caddy, tests/scripts, workflows, configuración/secretos, despliegue y recuperación. Registrar inventario saneado y baseline ejecutable, distinguiendo fallos previos, regresiones, componentes ausentes y trabajo bloqueado.

No imprimir `.env` ni crear módulos, infraestructura, versiones o comandos para aparentar cobertura. No probar foodtrucks.com ni otro sitio ajeno sin control y alcance demostrados. Componente inexistente puede ser no aplicable con motivo; componente existente sin comando/test/herramienta requerido es fallo de setup o pendiente, nunca éxito por omisión. Conservar configuración válida y fijar umbrales solo después de medir baseline y riesgo.

## 3. Ciclo obligatorio de cada cambio coherente

1. Definir una unidad revisable de funcionalidad, corrección, configuración o documentación; no un commit por guardado ni agrupaciones de cambios independientes.
2. Implementar junto con contratos/documentación y evaluar pruebas según §4; respetar cambios ajenos y datos privados.
3. Ejecutar formato/lint/análisis/tests/build aplicables. Revisar status, diff y `diff --check`, permisos, secretos y archivos generados. Corregir fallos propios y hooks; no `--no-verify`, `[skip ci]` ni rebajar assertions/checks.
4. Añadir solo archivos propios previstos, crear commit atómico e inspeccionar el commit final. Conventional Commits: feat/fix/test/ci/build/refactor/perf/docs/chore; `security` solo si el tooling lo admite, o `fix(security)`. Asunto específico; cuerpo con motivo/impacto/validación real cuando aporte.
5. Con remoto/acceso autorizado, verificar origin/base/branch y actualizar refs sin sobrescribir trabajo; hacer push de la rama tras el bloque, sin volver a pedir permiso ya concedido. Abrir/actualizar la misma PR y adjuntarla al chat cuando exista.
6. Registrar SHA, origen y check esperado; observar CI de esa revisión. Si falla, investigar/corregir y cerrar otro bloque con pruebas, commit/push y CI nueva.
7. Informar resultado y límites con evidencia. Sin Git/remoto/acceso, marcar commit/push/CI NO VERIFICADO y explicar la causa; no inicializar Git ni inventar hashes para aparentar trazabilidad.

### Revisión y PR

Revisar corrección, contratos, permisos, errores, recursos/concurrencia, SQL/migraciones/dependencias, accesibilidad/rendimiento y complejidad. Hallazgos bloqueante/alto/medio/bajo/mejora requieren evidencia, impacto y prueba; corregir los relevantes y verificar sin scans repetidos arbitrarios. IA/subagentes no equivalen a aprobación humana o independiente de CODEOWNERS; no autoaprobar para cumplir esa regla. Si solo existe un desarrollador, declarar la limitación y obtener revisión externa cuando corresponda.

Reutilizar la plantilla real: problema/comportamiento final, alcance, seguridad, comandos/resultados, CI, riesgos, configuración/migración/despliegue y rollback. Checklist distingue comprobado, pendiente y no aplicable con motivo. No PII, secretos o resultados inventados. CONTRIBUTING/SECURITY/CODEOWNERS/templates solo con necesidad y responsables reales.

## 4. Evaluación de pruebas por cambio

Registrar comportamiento/riesgo, rutas, tipo de prueba, comandos por carpeta, resultado y categoría. Las pruebas nuevas/adaptadas también se ejecutan; cero tests relevantes o un comando sin assertions útiles no demuestran el caso.

| Categoría | Cuándo corresponde | Evidencia mínima |
| --- | --- | --- |
| Nueva | Comportamiento nuevo, regresión o riesgo sin cobertura | Test que distingue resultado válido e inválido; falla ante el defecto cuando sea practicable |
| Adaptada | Cambia un contrato, regla, interfaz o escenario existente | Assertions actualizadas por la nueva especificación y ejecución |
| Existente ejecutada | La suite ya demuestra el comportamiento afectado | Tests identificados y resultados actuales; no basta afirmar que existen |
| No necesaria, justificada | Texto estático o cambio sin comportamiento/riesgo nuevo | Motivo concreto y comprobación apropiada: enlaces, build, visual, formato o configuración |

Las correcciones importantes requieren regresión cuando sea practicable. Una nueva sección con acciones, permisos, datos, formularios o estados exige evaluar comportamiento y riesgo; no tests artificiales de literalidad o snapshots gigantes. La [matriz QA01–29](40-testing-qa-github.md) gobierna escenarios de negocio, UI, privacidad, concurrencia y proveedores. Este documento decide cuándo son obligatorios los controles, no reproduce esos casos.

## 5. Arquitectura y eventos de GitHub Actions

Reutilizar workflows reales. Base propuesta: coordinador `ci.yml`, detección de cambios, jobs por componente y gate final; `security.yml` separado solo por cadencia/permisos. Release/CD se separan por confianza. Reusables/composite actions solo si reducen duplicación real; reusables directamente en `.github/workflows`, sin subdirectorio `reusable/`. [Reutilización](https://docs.github.com/en/actions/how-tos/reuse-automations/reuse-workflows).

| Responsabilidad futura | Eventos y condiciones | Resultado |
| --- | --- | --- |
| CI coordinada: Go, web, móvil, documentación y seguridad aplicable | Push a ramas de trabajo/integración; PR a rama protegida; manual | Evidencia por SHA, selección de componentes y `ci-gate` estable |
| Reusable por componente, si aporta valor | `workflow_call` desde coordinador; entradas y secretos explícitos | Contrato de checks sin duplicar activaciones |
| Seguridad periódica/Dependabot | Programación acotada y manual; cambios de dependencias en CI | Informe y gestión de hallazgos, sin acceso a producción |
| Construcción y publicación GHCR | Commit integrado de rama protegida después de CI; release/manual confiable | Imágenes escaneadas y digests asociados al commit |
| Staging | Artefacto aprobado del commit integrado | Migración compatible, smoke y estado del despliegue |
| Producción | Promoción manual de una release probada en staging | Mismo digest, aprobación, registro y verificaciones |
| Release móvil | Manual/tag autorizado; fuentes y CI aprobadas | Build/distribución según credenciales y política de tiendas |
| Rendimiento extendido | Manual o calendario en staging aislado | Comparación contra referencia y reporte de recursos |

La siguiente selección por rutas es propuesta y debe adaptarse al monorepo real, incluyendo consumidores de contratos, SQL, migraciones, dependencias, lockfiles, toolchain, root config y workflows. PR documental conserva integridad de enlaces y secret scan, sin acreditar pruebas de una aplicación ausente.

| Job lógico | Rutas que lo activan — ajustar al repo real | Trabajo |
| --- | --- | --- |
| cambios/contratos/secretos | Toda PR; cambios de workflow, root manifests/locks/config afectan alcance | Registrar plan de jobs, links/contratos y secret scan |
| go | backend/, database/, contratos compartidos, tooling/imagen Go | Formato/vet/unit/race, integración necesaria, sqlc, build y SCA |
| web | apps/web/, api-client, design-tokens, manifests/locks/root config | Frozen install, formato/lint/TS/unit, build y E2E crítico según cambio |
| mobile-js | apps/mobile/, contratos/tokens/locks/config | Compatibilidad Expo, formato/lint/TS/componentes y validación bundle según scripts |
| infraestructura/build | Compose/Caddy/Dockerfiles/scripts/workflows y cambios de runtime | Validación config, build/scan de imágenes aplicables, sin secretos/producción |
| gate | Toda PR, aunque fallen o se salten jobs anteriores | Comprueba resultados obligatorios esperados y motivo de no aplicable |

El detector publica un plan verificable de jobs/checks; ninguna omisión pedida por código de PR puede reducir controles o conceder privilegios. No filtrar solo por carpeta de pantalla. El workflow requerido se activa para todos los eventos/ramas exigidos; la selección ocurre dentro del workflow, sin filtros que impidan crear el check.

Rama principal protegida, ramas descriptivas y PR son la base propuesta. No crear `develop` por suposición; conservarlo si ya tiene función aprobada. Revisión proporcional, resolución de conversaciones, checks y owners se configuran con permisos y plan reales, sin bypass, borrado o force-push indiscriminados. Si se adopta merge queue, incluir `merge_group` y comprobar su candidato. [Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets).

## 6. Gate obligatorio y revisión exacta

Gate estable con `needs` y condición apropiada como `if: ${{ always() }}` para inspeccionar resultados tras fallos/saltos. Solo agrega evidencia, con timeout y sin checkout, despliegue o tareas privilegiadas. Su ausencia, cancelación o falta de finalización impide aceptar. [Expresiones](https://docs.github.com/en/actions/reference/workflows-and-actions/expressions#always).

| Situación | Decisión del gate |
| --- | --- |
| Detector correcto y todos los checks obligatorios seleccionados con éxito | Aprobar esa revisión |
| Fallo de test/build/seguridad/setup o falta de comando obligatorio | Bloquear |
| Job esperado ausente, cancelado o saltado inesperadamente | Bloquear |
| Job no afectado, salto justificado por selección comprobada | Admitir como no aplicable |
| Componente realmente inexistente | Documentar ausencia; no acreditar funcionalidad |
| Checks verdes de SHA anterior o PR basada en integración obsoleta | Exigir nueva comprobación según protección de rama |
| PR externa necesita credencial privada para una prueba | Registrar limitación; separar prueba confiable requerida antes de release, sin dar el secreto al fork |

Output inválido/vacío del detector no significa «ningún componente afectado». `continue-on-error`, `|| true`, `--if-present`, catch silencioso o job vacío no convierten un control obligatorio fallido en verde. Solo success real o salto previsto y justificado por el plan comprobado. La ausencia de una protección indispensable bloquea hasta disponer de mecanismo equivalente verificable, sin saltarse la política.

Cada push de cierre debe tener ejecución cuyo `head_sha` sea el SHA enviado, con origen/workflow/check y checkout/artefacto identificados. Registrar head, base e integración sintética de PR cuando corresponda: push, PR y commit realmente integrado son evidencias distintas. El integrado se valida de nuevo antes de release; CI antigua, de otra rama/workflow o integración obsoleta no sirve. [Checks requeridos](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks), [eventos](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows).

Probar el gate con fallo de test/lint, script ausente, detector inválido/fallido, job esperado cancelado/saltado y cambio compartido que afecte varios consumidores. Deben bloquear; el documental válido puede omitir builds no afectados conservando controles propios. Son pruebas futuras del pipeline, no ejecutadas aquí.

## 7. Controles por componente y seguridad

Clasificación propuesta para la implementación; fallo obligatorio bloquea. Informativo/periódico/manual no permite ignorar un crítico confirmado: triage y excepción específica justificada, con alcance, responsable, vencimiento, riesgo residual y seguimiento. No fijar porcentajes globales de cobertura para conseguir verde.

| Control | Clase propuesta | Implementación/evidencia futura |
| --- | --- | --- |
| gofmt, go vet, lint, TypeScript y formato JS/TS | Obligatorio por componente | Comandos existentes + reportes/exit code; gofmt sin archivos pendientes; sin warning relevante oculto |
| Unitarios y contratos críticos | Obligatorio | Auth/permisos/precios/transiciones; módulo afectado y dependencias |
| Integración PostgreSQL/PostGIS/Redis | Obligatorio cuando cambien datos/auth/compra/cache/outbox | Migraciones/constraints/concurrencia reales |
| Build Go/web y validación JS móvil | Obligatorio por componente afectado | Versiones/lockfiles/diffs identificados; JS móvil no es build nativa |
| E2E crítico existente | Obligatorio según cambio/contrato | Recorrido crítico estable; no salto por conveniencia |
| Secret scanning del cambio | Obligatorio en todas las PR | Gitleaks/revisión de allowlist; historial baseline inicial y periódico |
| SCA Go/Node e imágenes producidas | Obligatorio en CI del componente; imagen antes de release y baseline periódico | govulncheck, auditoría del gestor y scan de imagen real; críticos/altos aplicables triageados |
| SAST | Obligatorio en módulos críticos tras configurar herramienta compatible | CodeQL si elegible o alternativa revisada; baseline y excepciones específicas |
| Dependency Review | Obligatorio para deps cuando disponible | Availability/plan verificados; fallback SCA/revisión si no hay feature |
| SBOM/licencias y procedencia | Obligatorio para release; informativo en PR inicial según alcance | Artefacto/digest/commit, licencias y componentes copiados |
| DAST limitado | Periódico y antes de piloto relevante | Solo staging propio autorizado; sin privilegios/live/ataque agresivo |
| Fuzz prolongado/carga/CWV | Periódico y ante riesgo/regresión | Duración y presupuesto medidos; baseline reproducible |
| Nativo firmado/tienda/FPS | Manual o job de release aprobado | Dispositivo/build real, cuentas/firma/costes y autorización |
| a11y manual, revisión independiente, restore/rollback | Manual en hitos/cambios relevantes | Evidencia real y responsable; no checkbox automático |

Go incluye verificación de módulos, HTTP/contratos, race, SQL/PostGIS/Redis cuando afectado, sqlc sin diferencias inesperadas, fuzzing acotado y cobertura total/paquete. Next.js incluye instalación congelada, TypeScript/lint/formato, componentes/integración, build, E2E/a11y y temas/navegación. Expo distingue JS/componentes, build Android debug/tooling nativo e iOS en macOS de firma/release protegida. Los [comandos de QA](40-testing-qa-github.md) se adaptan a scripts/versiones reales: `gofmt -l` necesita comprobar su salida para fallar por diferencias.

Docker: multietapa/no root, `.dockerignore`, bases/dependencias fijadas y sin secretos. Supply chain: Gitleaks, Dependabot/SCA, SAST gosec/CodeQL según cobertura y elegibilidad, Trivy para imagen/config, OSV-Scanner solo si añade cobertura. govulncheck no prueba ausencia general de vulnerabilidades. ZAP baseline realiza crawling/peticiones y requiere staging propio y límites aunque el análisis sea pasivo. [Go](https://go.dev/doc/security/), [OSV](https://google.github.io/osv-scanner/), [Trivy](https://trivy.dev/), [ZAP](https://www.zaproxy.org/docs/docker/baseline-scan/).

CodeQL/Dependency Review/secret scanning/rulesets/environments dependen de visibilidad, propietario y plan; no comprar ni prometer extras gratuitos. Comprobar fuentes/licencias/compatibilidad/coste antes de elegir scanners. Rendimiento: benchmarks/allocs reproducibles, k6 acotado y pprof privado cuando útiles; p95/p99, errores y recursos según QA, sin carga intensiva productiva. [GitHub security](https://docs.github.com/en/code-security/getting-started/github-security-features), [Dependency Review](https://docs.github.com/en/code-security/concepts/supply-chain-security/dependency-review).

## 8. GHCR, artefactos y promoción

Construir desde el commit integrado validado, con fuentes/toolchains/lockfiles identificados. Publicar en GHCR después del escaneo obligatorio del artefacto exacto. Tags versión/SHA ayudan a localizar; la referencia de despliegue es el digest, nunca `latest` solo.

El registro de release contiene commit, runs de CI/build, conjunto de imágenes/digests por servicio, migraciones, configuración no secreta versionada, fecha, resultado de staging y anterior estable. SBOM/licencias/procedencia/reportes deben corresponder al artefacto. Entradas controladas y trazabilidad no demuestran identidad binaria entre builds independientes.

Staging automático prueba esos digests; producción, con configuración propia y aprobación manual, promueve el mismo conjunto sin reconstruir. Una diferencia que altere el bundle no puede ocultarse detrás de un rebuild sin validar. PR no publica imágenes de release ni recibe credenciales de publicación/despliegue. `packages: write` solo para publicación confiable; host con lectura mínima compatible con GHCR, sin copiar un token efímero del job como credencial permanente. Verificar propiedad, vinculación y visibilidad del paquete. [GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## 9. Despliegue, migraciones y rollback

```mermaid
flowchart LR
  A[Cambio y pruebas] --> B[Commit y push]
  B --> C[CI push y PR]
  C --> D[Revision e integracion autorizada]
  D --> E[CI integrado, build y scan]
  E --> F[GHCR y digests]
  F --> G[Staging automatico y smoke]
  G --> H[Aprobacion manual de release]
  H --> I[Produccion con los mismos digests]
  I --> J[Health y observabilidad]
  J --> K[Rollback compatible si falla]
```

Acceso doméstico pendiente de WAN/CGNAT/administración y capacidad: SSH/transferencia restringida con clave de host verificada o agente pull dedicado que verifica artefacto; canal privado/VPN por definir. No abrir SSH público por elegir Actions ni usar `StrictHostKeyChecking=no`. OIDC solo si proveedor admite federación y claims acotados; no sustituye por sí mismo SSH. [Servidor](38-servidor-domestico.md), [OIDC](https://docs.github.com/en/actions/reference/security/oidc).

Staging: verificar CI/revisión/origen, configuración y aislamiento según [21](21-entornos-ci-cd.md), conectividad, capacidad/disco y backup recuperable; migraciones compatibles una sola vez, actualización Compose, readiness/DB/Redis, smoke y flujo de prueba sobre rutas reales. Registrar evidencia y ensayar rollback compatible. Compose no garantiza cero downtime; sustitución controlada con ventana acordada es una base posible. Blue/green/canary exige recursos, puertos, sesiones y pool DB suficientes; no duplicar la pila sobre la VM DEV por receta.

Producción: aprobar release, destino/host, conjunto de digests y migración exactos; no aprobación genérica por calendario. Verificar compatibilidad API con apps publicadas/esquema, acceso/copia previa sensible; aplicar migración y servicios, observar health/smoke, errores/latencia/reinicios y reconciliación. Registrar responsable/fecha/resultados. Separar avisos ordinarios de CI de alertas de disponibilidad/seguridad.

Environments/protecciones se configuran con permiso y elegibilidad comprobados. Si no hay revisores obligatorios disponibles, usar promoción manual restringida con evidencia equivalente de aprobación/release, nunca un secreto accesible por cualquier workflow. [Entornos GitHub](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments).

Migraciones versionadas, probadas desde DB vacía y esquema previo sobre DB desechables; revisar locks, expand-contract y backups externos/restaurados antes de cambios sensibles. No cambios destructivos automáticos. Rollback: detener promociones, identificar estable, comprobar compatibilidad y recuperar digests; health/smoke, incidente y notificación autorizada. Imagen anterior no revierte esquema, cobros, emails o puntos. Ante incompatibilidad, corrección hacia delante o recuperación explícita; no down/restore destructivo a ciegas. Conservar DB/fotos/volúmenes. Sin rollback productivo automático salvo política explícitamente aprobada.

Serializar despliegues/migraciones/rollback del mismo entorno, incluidos jobs manuales y operaciones locales; concurrency de Actions más bloqueo en host cuando haga falta. No cancelar a mitad por un push nuevo. Sin carga intensiva ni efectos live durante smoke/restore; salvaguardas en 21.

Móvil: validación, firma, beta/TestFlight y tiendas son fases distintas de Compose. Exigen cuentas/certificados, versión/build, entitlements, SDK/canal de membresía y autorización de publicación. OTA no entrega módulos nativos nuevos ni elimina compatibilidad con clientes publicados. EAS sigue siendo opción pendiente, sin compra/distribución por instalar una skill.

## 10. Secretos, responsabilidades y mantenimiento

| Rol operativo por asignar | Responsabilidad |
| --- | --- |
| Autor/agente | Cambio coherente, pruebas, documentación, commit/push autorizados y evidencia |
| Responsable de QA | Selección de casos por riesgo, fixtures, regresiones/flakes y calidad de assertions/evidencia |
| Revisor | Contratos, test adecuado, permisos, riesgo de migración y aprobación de integración |
| Administrador GitHub | Reglas/protecciones, responsables, Actions, Environments, permisos y rotación |
| Operador de despliegue | Aprobar producción, verificar release/backup/capacidad, ejecutar y registrar recuperación |
| Responsable de seguridad/incidentes | Triage de hallazgos/excepciones y respuesta con fecha/seguimiento |

Son funciones propuestas sin personas/revisiones ficticias; asignar permisos, suplencias y canales. Pueden coincidir a esta escala, declarando límites de independencia. La [guía DevOps](devops/README.md) es la referencia de ubicación y validación de credenciales; inventariar nombres/metadatos, nunca valores. Runtime permanece en el host; `.env.example` solo nombres/valores ficticios acordes al código.

`GITHUB_TOKEN` de solo lectura por defecto, elevación mínima por job; checkout sin persistir credenciales. CI no hace autocommits, push de correcciones, auto-merge ni cambios de protecciones; el agente local gestiona Git según §3. PR/fork no recibe secretos live, de firma/proveedor/publicación/despliegue, Docker socket ni acceso al host/LAN familiar/producción. No ejecutar head no confiable mediante `pull_request_target` o `workflow_run` privilegiado. Inputs/títulos/branches no se interpolan en shell; artifacts/cachés son manipulables. [Secure use](https://docs.github.com/en/actions/reference/security/secure-use), [pull_request_target](https://docs.github.com/en/actions/reference/security/securely-using-pull_request_target).

Actions externas por SHA completo verificado, versión legible y actualización mediante PR/checks; revisar código/permisos upstream. Dependency lockfiles de workflows solo si se adopta y verifica su compatibilidad. Scanners/toolchains fijados por versión y locks; no hashes inventados ni `latest` en releases.

Cancelar solo CI redundante por PR/rama; separar grupos push/PR si prueban revisiones distintas. Timeouts/retención basados en duración/coste medidos; cachés por OS/toolchain/lockfile y frontera de confianza, nunca DB real, sesiones, storageState, HAR privados o dumps. Sharding/matrices adicionales solo por tiempos medidos. Revisar dependencias, excepciones, credenciales, flakes y consumo: Actions/macOS/EAS/Sentry/GHCR no se presumen gratuitos. [Presupuesto](37-costes-presupuesto.md).

## 11. Implantación por fases y evidencia de aceptación

| Fase | Entrega en el repositorio real | Evidencia antes de cerrarla |
| --- | --- | --- |
| 1 Auditoría | Inventario, baseline y decisiones de adaptación | Archivos/versiones y checks reales; ausencias identificadas |
| 2 CI básica | Formato/lint/tipos/tests/build y gate | Workflow válido; éxito y fallo intencional controlado del gate |
| 3 Seguridad | SCA/SAST/secret scanning y permisos | Hallazgos triageados, PR externa sin secretos, excepción controlada |
| 4 Testing avanzado | SQL/Redis/concurrencia/fuzz y rendimiento pertinente | Aislamiento probado y referencia reproducible |
| 5 Docker/GHCR | Imágenes mínimas, scanner, digests y registro | Build/publicación autorizada y lectura de artefacto verificado |
| 6 Staging | Migración compatible, Compose y smoke automáticos | Despliegue y fallo controlado sobre entorno propio |
| 7 Producción | Promoción manual y rollback compatible | Aprobación/restricción demostrada; producción real solo autorizada |
| 8 Observabilidad | Release/errores/métricas/alertas correlacionados | Alertas de prueba recibidas por destinatario autorizado y saneamiento |
| 9 Validación | Manual, permisos, recuperación y resultados finales | Recorrido completo trazable, pendientes y límites explícitos |

Cerrar una fase requiere checks ejecutados y correctos, diff revisado y documentación; commit/push por bloque cuando exista acceso. No un archivo vacío por fase. El roadmap transversal A–G se conserva en QA y enlaza esta política para CI/CD.

### Cobertura de requisitos de CI/CD

La matriz conserva los 20 apartados; cobertura documental no equivale a ejecución.

| Área del requisito | Política / evidencia exigida |
| --- | --- |
| 1 Contexto | §1–2; stack/recursos/aislamiento reales |
| 2 Auditoría | §2; inventario y baseline |
| 3 Workflows | §5–6; eventos, selección, gate y SHA |
| 4 Ramas/PR | §3/5; historial, revisión y protección |
| 5 Go | §4/7 y QA; tests/build/race/cobertura |
| 6 Negocio Foodtrucks | §7 y QA; pagos, permisos, stock y QR |
| 7 DevSecOps | §6–7/10 y seguridad; scans/excepciones/secretos |
| 8 Rendimiento | §7 y QA/rendimiento; referencia y carga controlada |
| 9 Web | §7 y QA; Next.js/E2E/temas/header |
| 10 Móvil | §7/9 y QA; SDK real, builds, firmas y dispositivos |
| 11 Docker/GHCR | §8; scan y digest del artefacto |
| 12 Despliegues | §9; staging automático y producción aprobada |
| 13 Migraciones | §9 y datos/backups; compatibilidad/restore |
| 14 Rollback | §9; anterior estable, esquema y verificación |
| 15 Observabilidad | §9 y observabilidad; release/alerta y métricas |
| 16 Secretos | §7/10 y guía DevOps; ubicación, permisos y rotación |
| 17 Documentación | Guía DevOps y documentos enlazados; operación/local/fallos/glosario |
| 18 Aceptación | §6/11; resultado verificable y no éxito por omisión |
| 19 Fases | Tabla de implantación; bloques y evidencias |
| 20 Entrega final | Registro siguiente A–J; mediciones/IDs reales |

Entrega A–J: **A** diagrama/flujo; **B** workflows/eventos; **C** pruebas/resultados/cobertura/pendientes; **D** seguridad/hallazgos; **E** benchmarks/carga/límites; **F** imágenes/digests/despliegue; **G** rollback probado o limitación; **H** commits/SHAs; **I** secretos/permisos/configuración pendiente; **J** mantenimiento/diagnóstico. Usar evidencia real y saneada.

## 12. Estado actual y cómo completar la validación

| Elemento | Estado de esta entrega |
| --- | --- |
| Política, decisiones y guía | Documentado en Markdown |
| Integridad/enlaces/ZIP | Comprobación documental; ver resultado de la entrega |
| Workflows/scripts/app/tests/cobertura | NO VERIFICADO: no existen en la carpeta accesible |
| Commits/push/PR/protecciones/Environments | NO VERIFICADO: sin Git/remoto/acceso al proyecto |
| Imágenes/GHCR/build nativa | NO VERIFICADO: sin fuentes/configuración/credenciales |
| Staging/producción/migración/rollback/alertas | NO VERIFICADO: sin aplicación ni entornos disponibles |

La comprobación documental local no ejecuta fases de aplicación. ZIP/informe v1.10 son la instantánea histórica anterior, no un paquete regenerado por esta consolidación.

Al existir repo/acceso, realizar §2, fijar comandos/versiones, configurar permisos/secretos por entorno y ejecutar las fases, incluidos gates positivos/negativos, staging, recuperación y alerta en entorno aislado. Producción solo tras aprobación concreta. Guardar run IDs/SHAs/digests, comandos por carpeta, resultados y mediciones sin inventarlos.

Distinguir implementado y comprobado, implementado sin comprobar, pendiente, bloqueado por condición concreta, requiere aprobación y no aplicable con motivo. Un bloqueo externo impide declarar terminado lo afectado; al recuperar acceso, continuar el trabajo autorizado. Reportar analizado/hallazgos, cambios, decisión de tests, build/CI/Git/PR y releases reales, revisión automática/humana, aprobación pendiente/concedida y riesgos/siguientes pasos. Merge y producción permanecen separados del cierre técnico.

## 13. Trazabilidad de privacidad y calidad

Ante datos personales, consultar [48](48-proteccion-datos-gobernanza.md): finalidad, acceso, conservación, destinatarios y borrado/restore. Vincular requisito/riesgo/control/prueba/evidencia/SHA-release/responsable/estado sin formularios duplicados por marco. IA pasa la misma revisión/gate; no secretos ni datos personales reales en prompts, fixtures o reportes por la mera autorización de escribir código. Datos sintéticos y criterios de [QA](40-testing-qa-github.md); políticas no acreditan certificación, cobertura o controles efectivos.
