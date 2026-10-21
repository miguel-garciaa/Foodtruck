# Guía práctica de DevOps de Foodtrucks

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
