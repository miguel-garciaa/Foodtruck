# Guía práctica de DevOps de Foodtrucks

## CI/CD propio autorizado el 22/10/2026

El coordinador es [dev.yml](../../.github/workflows/dev.yml): PR, `push` de `main` y ejecución manual. Las ramas de trabajo necesitan PR borrador desde la primera subida. Solo las PR cancelan comprobaciones anteriores; una entrega de `main` nunca se cancela por una subida posterior. La app GitHub ECC se ha desinstalado y verificado en la lista de instalaciones; se conservan comentarios históricos y las cinco skills ECC locales.

La rama de esta implantación parte del código confirmado, preservando el trabajo móvil paralelo. El APK contiene JavaScript y firma de pruebas, sin Firebase ni proveedores reales. Maestro comprueba el catálogo sintético, búsquedas, categorías, filtros, favoritos y perfil del código comprometido. **Las pantallas de cuentas reales aún no están en esta base; ese recorrido queda pendiente de su integración y bloquea la aceptación completa del hito.** Pagos, Next.js, iOS y tiendas no quedan acreditados.

| Control | Evidencia y condición |
| --- | --- |
| Backend | Pint, Larastan, Composer audit, PHPUnit sobre PostgreSQL/PostGIS desechable; Redis desechable. `PostgresTestCase` rechaza otra base o entorno antes de migrar |
| App/contrato | npm ci, OpenAPI generado sin diff, TypeScript, ESLint, Prettier y suite de catálogo |
| Seguridad propia | Gitleaks sobre historial, npm audit, Semgrep CE con reglas locales PHP/TS, actionlint, Trivy configuración e imagen. No son una auditoría exhaustiva |
| Android | Prebuild sin credenciales, APK release firmado solo para pruebas, emulador y Maestro; informe JUnit y APK retenidos siete días |
| Release | Solo `push` de `main` con seis trabajos y gate correctos. Imagen única escaneada, paquete GHCR privado, SHA/digest, SBOM y manifiesto v1 retenido 30 días |
| DEV | Deployment de GitHub con manifiesto; agente saliente fijo en VM, sin runner propio ni acceso entrante desde CI |
| Producción | Environment `production`, aprobación por release y mismo digest de DEV. Cuatro condiciones verificadas obligatorias; desactivada hasta staging, host, configuración y backups externos |

El manifiesto interno v1 contiene `version`, `sha`, `runId`, `image` con digest, `configHash`, `migrationHash` y enlace de evidencia. El agente vuelve a consultar GitHub: creador Actions, workflow/evento/rama, SHA actual de `main`, ocho comprobaciones correctas y configuración instalada idéntica. No descarga scripts o Compose para ejecutarlos como root. Un cambio de configuración o migraciones requiere revisión administrativa del hash permitido. El host conserva la imagen anterior; rollback automático DEV únicamente con hash de esquema idéntico, sin revertir datos.

### Instalación administrativa revisable en la VM DEV

**Estado:** código preparado; temporizadores, GHCR privado, credenciales mínimas, sonda y restauración real todavía no activados/verificados. El usuario SSH `miguel` no tiene sudo no interactivo. No compartir contraseñas ni tokens en el chat. La VM tiene disco raíz de unos 19 GB, con unos 7,5 GB libres en la consulta inicial; se exige al menos 3 GiB libres y tres veces el tamaño estimado de DB/fotos antes de copiar. Un rechazo por espacio conserva datos y última copia válida.

1. Revisar la PR y su SHA en GitHub. Integración de PR requiere acción humana; la automatización no fusiona ni escribe commits. Descargar ese checkout en la VM y revisar `infrastructure/ops/install.sh`, `ops.py`, `restore.py`, Compose y los units. Usar archivos LF.
2. En sesión administrativa de la VM, instalar `restic` desde Ubuntu y ejecutar `sudo sh infrastructure/ops/install.sh /ruta/checkout-revisado`. Solo instala archivos root-owned y units; **no inicia servicios**. El código queda en `/opt/foodtrucks/ops`, Compose fijo en `/opt/foodtrucks/runtime`, estado privado en `/var/lib/foodtrucks-ops` y repositorio cifrado en `/var/backups/foodtrucks-restic`.
3. Copiar de forma privada y revisada `.private` de la instalación DEV actual a `/opt/foodtrucks/runtime/.private`, incluyendo APP_KEY, contraseñas, proveedores y token Tunnel. Conservar permisos de lectura UID 1000 de los archivos montados, directorios atravesables solo por lo necesario y ownership root del resto de configuración. La pila usa el mismo proyecto `foodtrucks-dev` y sus volúmenes existentes. No `down -v`, no `prune --volumes`, no restaurar sobre DEV.
4. Completar `/etc/foodtrucks/ops.json` (0600 root) desde el ejemplo. Fijar destinatario técnico ya autorizado, remitente del dominio verificado y hashes de migraciones revisadas. Calcular los hashes con `python3 -c 'import sys; sys.path.insert(0,"infrastructure/ops"); from ops import config_hash,migration_hash; print(config_hash(".")); print(migration_hash("."))'` desde el checkout. `compatibleMigrationHashes` solo admite esquemas revisados; un hash nuevo no se autoriza automáticamente.
5. Crear credenciales **separadas**, fuera de Git: token GitHub de este repositorio con Contents/Actions read y Deployments read/write en `github-deployments-token`; lectura GHCR con `read:packages` en el Docker config dedicado `registry` (login por stdin); clave Resend de envío del dominio para `resend-alert-token`. No copiar el OAuth administrativo del editor a la VM. Archivos 0600 root. La publicación usa el token efímero del job, jamás como credencial persistente.
6. Generar una contraseña Restic de alta entropía en `/etc/foodtrucks/restic-password` (0600), guardarla también fuera de la VM y ejecutar `sudo restic -r /var/backups/foodtrucks-restic --password-file /etc/foodtrucks/restic-password init`. La copia local protege fallos lógicos DEV; **no cubre pérdida del domicilio y no habilita producción**.
7. Registrar el manifiesto de la release inicial instalada como `/var/lib/foodtrucks-ops/current.json` tras verificar su digest, o preparar el primer despliegue desde `main`. Antes de activar el agente, comprobar lectura del paquete privado, Compose resuelto, backup y restore aislado. El primer backup sin manifiesto está admitido; la monitorización exige una release identificada para operar Compose.
8. Ejecutar `sudo python3 /opt/foodtrucks/ops/ops.py backup`, `restore-check` y `alarm-test` por separado. `alarm-test` envía `[PRUEBA]` de las seis familias locales, prueba deduplicación y recuperación, sin interrumpir servicios. Confirmar recepción y guardar únicamente IDs/estados saneados. Una simulación unitaria no acredita correo recibido.
9. Solo tras esos resultados, activar `foodtrucks-ops-agent.timer`, `foodtrucks-ops-monitor.timer`, `foodtrucks-ops-backup.timer` y `foodtrucks-ops-restore-check.timer` con systemctl. Revisar `systemctl list-timers`, `journalctl -u foodtrucks-ops-agent` y `systemd-analyze verify` de los units. Ante intento interrumpido en migración, revisar esquema/datos y `attempt.json`; no borrar ese marcador para reintentar a ciegas.

Backup antes de desplegar y diario a **03:30 Europe/Madrid**: pg_dump custom, fotos y secretos/configuración necesarios, cifrados por Restic. Siete snapshots diarios y los dos últimos predeploy. La última copia debe pasar `restic check` antes de aplicar retención. El prune del repositorio es mantenimiento revisado después de restore correcto; no se ejecuta limpieza global de Docker. Restore semanal domingo 04:30: copia a directorio privado único, hashes de DB/fotos, rechazo de rutas/enlaces peligrosos, `pg_restore --exit-on-error` en contenedor PostGIS **sin red, sin API/worker, sin volúmenes DEV** y comprobación de migraciones. Solo se elimina ese contenedor desechable y su volumen anónimo.

### Sonda externa y catálogo de avisos

[Worker/KV](../../infrastructure/monitor/worker.mjs) consulta `/api/v1/foodtrucks` cada cinco minutos, valida JSON y rechaza redirecciones. Tres fallos abren incidencia, dos éxitos recuperan; un recordatorio diario mientras continúe. KV guarda estado y recibos; Resend recibe clave idempotente estable. Un envío incierto fuera de la ventana de 23 horas se detiene para revisión, evitando reenvío automático tras caducar la idempotencia del proveedor.

Antes de desplegar el Worker: comprobar Workers Free y consumo real de cuenta, crear KV, sustituir el ID requerido en `wrangler.jsonc` y configurar `RESEND_API_KEY`, `ALERT_TO`, `MAIL_FROM` de forma privada. No activar Workers Paid ni otros planes. 288 sondeos diarios y una escritura habitual por sondeo caben en las cuotas públicas consultadas; verificar uso de otros Workers y KV de la cuenta antes de activarlo. No se usan ejecuciones Actions programadas cada cinco minutos que generarían correos de CI.

| Evento | Canal y contenido |
| --- | --- |
| CI correcta/fallida/cancelada | Correo nativo de la ejecución coordinadora; enlace a informe español con SHA, trabajo y paso fallido. Cancelada/omitida nunca cuenta como superada |
| DEV aplicado/fallido/agente desconectado | Resultado dentro de la misma ejecución, digest y Deployment de GitHub. Sin respuesta 15 minutos: error, sin éxito supuesto |
| Solicitud productiva | Revisión de Environment, condiciones y release concreta; no despliegue productivo automático |
| API pública/DNS/TLS/Internet/Tunnel | Sonda externa → Resend: incidencia, recordatorio diario y recuperación |
| API/DB/Redis/Horizon/scheduler | Monitor local cada minuto, alarma tras tres fallos; silencio de servicios durante ventana de despliegue de máximo 15 minutos |
| Outbox >15 min o intentos ≥5; failed_jobs | Monitor local → Resend: revisar Horizon/proveedor y evitar reenvíos económicos a ciegas |
| Disco bajo / backup >30 h / restore >8 días | Monitor local → Resend; backup/restore fallidos notifican de inmediato |
| Error de despliegue | Resend local y estado GitHub; conservación de datos y rollback compatible |

Los correos operativos incluyen entorno, señal, impacto, hora de Madrid, release y acción. No incluyen cuerpos de respuesta, errores de proveedores, tokens ni datos de usuarios. Datos de prueba sintéticos. El correo nativo depende de preferencias de GitHub y su plantilla: un coordinador reduce avisos de Actions, pero no garantiza eliminar avisos independientes de PR, commits o servicios externos.

Validaciones automáticas: `node --test .github/tests/*.test.mjs infrastructure/monitor/*.test.mjs` y `python3 -m unittest discover -s infrastructure/ops/tests -v` (Linux obligatorio para bloqueo de host). Ensayos reales pendientes: publicación/pull privados, instalación, despliegue/reintento/agente offline, backup/restore, correo `[PRUEBA]` recibido y sonda Cloudflare. No cerrar activación sin esas evidencias.

**Consolidación:** 20 de octubre de 2026. Entrada a procedimientos y diagnóstico. Consultar [44](../44-politica-commits-ci-cd-tests.md) para obligaciones de Git/CI/CD y las [decisiones pertinentes](../23-decisiones-pendientes.md) para bloqueos. Los scripts y servicios futuros aún no existen/verifican en este paquete.

## Qué consultar según la tarea

| Necesidad | Documento y procedimiento |
| --- | --- |
| Arquitectura | [Monorepo](../07-arquitectura-monorepo.md), [servidor doméstico](../38-servidor-domestico.md) y política CI/CD: flujo commit → release |
| CI/CD y GitHub Actions | [Política operativa](../44-politica-commits-ci-cd-tests.md): cambios, eventos, gate, GHCR y fases |
| Pruebas locales/CI | [Testing y QA](../40-testing-qa-github.md): matriz de casos, aislamiento, comandos y evidencia |
| Seguridad | [DevSecOps](../39-seguridad-devsecops.md), [seguridad base](../19-seguridad.md): amenazas, scans y excepciones |
| Entornos | [Entornos](../21-entornos-ci-cd.md), [infraestructura](../17-infraestructura.md): separación y configuración |
| Despliegue | Política operativa §8–9 y servidor doméstico: digest, conexión, migración y health |
| Rollback y recuperación | Política §9, [fotos/backups](../18-media-backups-operacion.md): compatibilidad, restore y efectos externos |
| Secretos | Apartado siguiente, seguridad y [correo Resend](../30-correo-resend.md): mínimo privilegio y rotación |
| Monitorización | [Observabilidad](../41-observabilidad-grafana-prometheus-sentry.md): métricas, Sentry, alertas y runbooks |
| Marketing y datos | [Política de marketing](../31-marketing-digital-maestro.md), [medición/consentimiento](../34-analitica-consentimiento.md) |
| Gastos y recursos | [Presupuesto](../37-costes-presupuesto.md): cuotas conocidas, servicios/consumo pendientes |

## Glosario práctico

| Término | Significado en este proyecto |
| --- | --- |
| Workflow | Automatización GitHub Actions activada por un evento, con uno o más jobs |
| Job | Grupo de pasos que corre en un runner; puede depender de otros jobs |
| Step | Acción o comando dentro de un job; su fallo debe propagarse según la política |
| Runner | Máquina que ejecuta jobs; alojada por GitHub o propia con aislamiento requerido |
| Artifact | Archivo de resultado de una ejecución, como reporte/build; no confundir con caché |
| Cache | Datos reutilizados para acelerar una ejecución; nunca fuente de autorización o secretos |
| Secret | Credencial protegida, accesible solo al propósito/job/entorno autorizado |
| Environment | Entorno de despliegue y sus controles/variables/secretos en GitHub cuando estén disponibles |
| Release | Versión identificada con código, artefactos, compatibilidad y notas/evidencia |
| Deployment | Aplicación de una release a un entorno; necesita verificación posterior |
| Rollback | Retorno a una release estable compatible; no implica revertir automáticamente datos |
| SAST | Análisis estático del código para detectar riesgos de seguridad |
| SCA | Análisis de dependencias y vulnerabilidades conocidas |
| Coverage | Porción de código ejecutada por tests; no demuestra assertions buenas ni seguridad |
| Benchmark | Medición repetible de tiempo/allocs/recursos de una operación |
| Smoke test | Recorrido breve para verificar que una versión arranca y opera en sus funciones críticas |
| Digest | Identificador del contenido de una imagen; referencia estable para promoción/rollback |
| Gate | Comprobación obligatoria que bloquea integración/promoción si falta evidencia o hay fallos |
| SBOM | Inventario de componentes de una imagen/build que ayuda a rastrear dependencias |
| Expand-contract | Cambiar un esquema por fases para mantener compatibilidad antes de retirar lo antiguo |

## Preparación local y primera CI

1. Abrir el repositorio real y realizar el inventario/baseline de 44 §2; registrar gestor, versiones, scripts y comandos por carpeta.
2. Preparar datos sintéticos y entornos aislados según 21; ejecutar los casos seleccionados de QA y conservar resultados saneados.
3. Implementar/probar la selección y el gate conforme a 44 §5–7/11, incluidos fallos controlados y revisión de privilegios.
4. Cerrar el bloque con la secuencia Git y evidencia de 44 §3. Sin repo/acceso, registrar la limitación sin simular ejecución.

## Ubicación y validación de credenciales

Nombres y mecanismos se ajustan al código real. La tabla define ubicación/privilegio propuestos, no credenciales disponibles. La política de confianza, rotación y mantenimiento está en 44 §10.

| Credencial/configuración | Ubicación mínima apropiada | Validación antes de activar |
| --- | --- | --- |
| Git para agente/editor | Autenticación local autorizada, fuera del repo | Remoto/rama/identidad y push de cambios propios |
| Token de publicación GHCR | Job confiable con `GITHUB_TOKEN` y permiso de paquete necesario | Propiedad del paquete, scope y registro del digest |
| Lectura de imagen privada desde casa | Credencial compatible GHCR de solo lectura, privada en host | Pull del digest permitido y rotación/revocación |
| Acceso de despliegue | Environment protegido o mecanismo privado restringido | Host/identidad verificados, comandos permitidos y aislamiento |
| PostgreSQL/Redis runtime | Configuración privada del entorno servidor | Usuarios/ACL mínimos, red privada y aislamiento DEV/staging/PROD |
| Stripe API/webhook | Backend/worker privado por entorno; CI rápida usa fakes | Firma/entorno/cuenta; prueba sin cargo live |
| Resend aplicación / alertas | Claves distintas en worker y servicio notificante | Dominio/propósito/destino autorizado, TLS e idempotencia |
| Mapbox | Token público mínimo por app/web; privado solo para build que lo requiera | Restricciones y scopes; no tratar token público como secreto backend |
| Google/Apple OAuth | Configuración pública e identidad de app; secretos servidor donde corresponda | Redirects/audiencias y canal real, sin acceso a otra cuenta |
| APNs/FCM y firma móvil | Entorno/servicio de envío y release móvil protegidos | App/entorno y dispositivos de prueba propios |
| Sentry | DSN según cliente; token privado solo en job de upload/release necesario | Saneamiento, release/artefactos y permisos mínimos |

Usar el gestor de secretos o configuración privada del entorno autorizado; inventariar nombres y responsables sin valores. Los nombres definitivos se documentan al implementar, sin volcar `.env`.

## Operar un despliegue o una recuperación

1. Identificar release, digests, destino, estado de CI/staging y aprobación exigida por 44 §8–9.
2. Revisar configuración, capacidad, backup recuperable, esquema/migración y acceso de recuperación antes del cambio.
3. Seguir la secuencia y exclusión del entorno de 44 §9; comprobar readiness/smoke y observabilidad con las rutas reales del servicio.
4. Registrar resultado/incidente. Si falla, comprobar compatibilidad antes de recuperar la release estable según 44 §9 y [backups](../18-media-backups-operacion.md).

Antes de abrir una restauración, revisar outbox/efectos externos y reaplicar supresiones/restricciones según [21](../21-entornos-ci-cd.md) y [48](../48-proteccion-datos-gobernanza.md). Conservar el registro de pruebas y límites; rollback de imagen y restauración de datos son operaciones diferentes.

## Diagnóstico y mantenimiento

| Fallo | Primeras comprobaciones | Acción/evidencia |
| --- | --- | --- |
| CI falla | SHA/evento/job, primer error, versión y cambio afectado | Reproducir mismo comando/dataset; corregir causa y push nuevo |
| Check requerido no aparece | Evento, filtro, rama/base, selección y configuración de protección | Corregir activación/gate; no eliminar protección para fusionar |
| Job se salta inesperadamente | Resultado de detector/needs/condiciones | Bloquear y probar selección/fallo; no éxito por output vacío |
| GHCR no permite publicar/pull | Propiedad/visibilidad, vinculación, permisos y digest | Corregir privilegio mínimo; no imprimir credencial |
| Despliegue no conecta a casa | Ruta directa/Tunnel/administración elegida, host y red | Validar enlace seguro; no desactivar TLS/host checking ni exponer DB |
| Migración tarda/falla | Locks, versión de esquema, compatibilidad y estado de ejecución | Detener promoción; resolver con procedimiento revisado, no borrar datos |
| API falla después del cambio | Release/digests, readiness, configuración, DB/Redis, logs y Sentry | Rollback compatible o corrección; registrar incidente |
| Alerta no llega | Regla, canal/TLS, supresión, destinatario y límite proveedor | Prueba autorizada end-to-end y sonda externa si cae el domicilio |
| Disco/recursos crecen | Datos, imágenes, backups, logs, artifacts y retención | Limpiar solo objetos identificados según retención; no prune indiscriminado |

Seguir la cadencia de revisión de 44 §10 y los runbooks de [observabilidad](../41-observabilidad-grafana-prometheus-sentry.md). Registrar evidencia mínima y saneada, con responsable y alcance; no convertir un diagnóstico en una modificación destructiva automática.

## Evidencia y pendientes

La entrega operativa se comprueba con los criterios de 44 §11–12 y QA, no con una lista marcada por plantilla. Scripts reales, acceso, capacidad, cuentas, permisos y recuperación siguen pendientes hasta demostrar ejecución. Esta consolidación solo verifica documentos; ZIP/informe v1.10 conservan su instantánea histórica.
