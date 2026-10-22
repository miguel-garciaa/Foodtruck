# Política de observabilidad de Foodtrucks: Grafana, Prometheus, Sentry y operación

**Avisos autorizados 22/10/2026:** GitHub nativo para el coordinador; Resend para alarmas/recuperaciones. [Catálogo y activación](devops/README.md#sonda-externa-y-catalogo-de-avisos): Worker/KV externo cada cinco minutos (3 fallos/2 éxitos), monitor local cada minuto, deduplicación persistente y recordatorio diario. Scripts preparados; activación y recepción real pendientes de credenciales/bootstrap. No se dan por instalados Prometheus/Grafana/Sentry. Este hito utiliza Laravel D47 y dominio propio `foodtruck.bid`; Go y dominio histórico siguientes no describen el backend actual.

**Versión:** 1.9. **Fecha:** 14 de octubre de 2026. **Estado:** política documentada; implementación pendiente. Integra los 36 apartados de requisitos de observabilidad recibidos como obligaciones, procedimientos y criterios de aceptación. No conserva copias de prompts ni interpreta sus instrucciones de ejecución como evidencia de trabajo realizado. No existe en este paquete código de aplicación, un repositorio Git conectado ni acceso comprobado al servidor doméstico. No se han instalado servicios, conectado cuentas, creado dashboards funcionales, capturado eventos ni enviado alertas.
**Actualización técnica:** 22/10/2026, D47. Política de observabilidad para Laravel/PHP; integra los requisitos como obligaciones, procedimientos y criterios de aceptación. Existen backend/móvil, Git, CI y DEV con evidencias en la [guía del backend](../backend/README.md). Esta revisión documental no acredita instalación de Prometheus/Grafana/Sentry, dashboards, captura de eventos o envío de alertas.

**Decisiones cerradas:** Prometheus, Grafana y Sentry forman parte del requisito de observabilidad. Foodtrucks conserva Laravel/PHP con Eloquent y SQL parametrizado, PostgreSQL/PostGIS, Redis cuando aporte valor, Next.js y React Native + Expo + TypeScript, Mapbox y autenticación propia con email/contraseña, Google y Apple. La aplicación se alojará en un servidor en casa para desarrollo y producción; el VPS queda sustituido como alojamiento base. La ubicación/modalidad de las herramientas de observabilidad, retención, presupuesto, destinatarios, DSN, versiones y parámetros operativos siguen pendientes. Los **4 vCPU, 8 GB RAM y 40 GB NVMe** describen únicamente la VM de desarrollo prevista; no prueban la capacidad física del servidor ni dimensionan producción. foodtruck.bid es el dominio comprado y verificado para Resend; api-dev.foodtruck.bid es la entrada DEV por Tunnel. Staging/PROD y sus hostnames siguen por definir.

Aplicar esta política junto a [API](20-api.md), [backend Laravel](09-backend-go.md), [datos](10-datos-postgresql-postgis.md), [autenticación propia](14-autenticacion.md), [Redis](11-redis-cache.md), [correo Resend](30-correo-resend.md), [operación y backups](18-media-backups-operacion.md), [seguridad](19-seguridad.md) y [entornos/CI](21-entornos-ci-cd.md). También integra el [presupuesto](37-costes-presupuesto.md), el [servidor doméstico](38-servidor-domestico.md), [DevSecOps](39-seguridad-devsecops.md), [QA y GitHub](40-testing-qa-github.md) y la [política de commits, CI/CD y tests](44-politica-commits-ci-cd-tests.md). Foodtrucks sigue siendo un marketplace de compra y recogida presencial, sin reparto. Observabilidad operativa y analítica comercial tienen finalidades y accesos diferentes.

## 0. Objetivos, obligaciones y responsables

La política se aplica a desarrollo, CI, staging y producción, a web/API/worker/móvil y a su infraestructura y dependencias reales. Su objetivo es detectar fallos que impidan descubrir un negocio, comprar, confirmar el pago o recoger; investigar su causa con señales seguras; detectar regresiones de release; comprobar la salud de la propia monitorización y dejar trazabilidad de respuesta. Instalar herramientas sin comprobar señales y recepción de avisos no satisface el objetivo.

**Obligaciones:** auditar antes de instalar; instrumentar solo comportamientos existentes; mantener métricas y administración privadas; minimizar y redactar telemetría; versionar configuración reproducible; calibrar reglas con datos reales; validar en staging; promover a producción manualmente el mismo artefacto probado; registrar resultados auténticos y mantener runbooks. Los ejemplos de nombres, consultas, rutas y umbrales son propuestas técnicas subordinadas a esas obligaciones, no valores aprobados ni configuraciones ejecutables de producción.

Los siguientes roles son **propuestos y pendientes de asignación nominal**. Una persona puede asumir varios, con revisión proporcional al riesgo; esta tabla no presupone un equipo contratado ni cobertura permanente.

| Rol propuesto | Responsabilidad y entrega exigida |
| --- | --- |
| Propietario de producto/servicio | Definir horario, funciones críticas, SLO, presupuesto, destinatarios autorizados y aprobación manual de promoción productiva |
| Responsable de operación | Inventario, aislamiento, configuración/retención, sonda externa, alertas, runbooks, backups y registro de incidentes/despliegues |
| Responsable backend/datos | Contratos de métricas Laravel/PHP, Eloquent y migraciones, transiciones duraderas, deduplicación, exporters y carga de consultas |
| Responsable web/móvil | SDK compatible, privacidad, releases, source maps/símbolos, cobertura Next.js/Expo y prueba en builds reales |
| Responsable de QA/revisión | Revisar reglas/configuración y evidencias, ejecutar pruebas controladas, comprobar aceptación y limitaciones |
| Responsable de seguridad/privacidad | Revisar accesos, secretos, redacción, retención, destinos y tratamiento de telemetría |

Cada servicio, métrica, dashboard, alerta y runbook debe tener un rol responsable, aunque las asignaciones se agrupen. Todo incidente debe tener un responsable de seguimiento. Las decisiones abiertas se registran en §20 y se resuelven antes de habilitar el componente afectado; no se rellenan con valores arbitrarios para producir una configuración aparentemente completa.

Revisar la política antes del piloto, tras incidentes relevantes y cuando cambien runtime, proveedores, exposición, esquema de datos o capacidades del servidor. Una excepción debe indicar alcance, motivo, riesgo, mitigación, responsable y caducidad; no permite inventar evidencias, filtrar secretos/datos privados, desactivar TLS ni omitir la promoción manual de producción. Una carencia de observabilidad crítica impide declarar aceptada la fase correspondiente.

## 1. Auditoría inicial y alcance real

Antes de instrumentar, completar un inventario con evidencia: ruta del repositorio, rama/SHA, módulos desplegables, versiones de Next.js/React Native/Expo/PHP/Laravel/Composer/PostgreSQL/PostGIS/Redis, router web, librerías, configuración de compilación, Docker Compose, Caddy, imágenes/digests, puertos, volúmenes, límites, pipeline, permisos y ubicaciones de secretos. Registrar por separado servidor físico, hipervisor, VM de desarrollo y entorno productivo, red/ISP, alimentación, almacenamiento, backups y restauración. Examinar logging, health checks y SDKs de observabilidad existentes para reutilizarlos.

**Responsable propuesto:** operación, con web/móvil y backend/datos. **Aceptación:** inventario fechado con alcance, versiones verificadas, acceso autorizado y diferencias entre lo existente y lo pendiente. El inventario debe conservar Laravel/PHP, Eloquent y migraciones, Mapbox y autenticación propia; una librería de observabilidad no justifica sustituir esos componentes. Las referencias a Kubernetes, serverless u otros modelos se revisan únicamente si la auditoría detecta una realidad nueva o se aprueba un cambio de arquitectura.

No incluir valores de secretos en el inventario. Un archivo Compose previsto no prueba que sus servicios estén ejecutándose. No asumir Kubernetes, réplicas, despliegue serverless ni métricas del router/UPS disponibles. Si aparecen, adaptar la solución después del inventario. Registrar cada componente como **existente y verificado / configurado sin verificar / propuesto / no aplicable**; no confundir esas categorías.

| Componentes previstos | Señales y objetivo | Estado actual |
| --- | --- | --- |
| Next.js web, cliente y servidor | Errores, renderizado, rutas, latencia, versión | Instrumentación pendiente |
| Laravel/PHP-FPM, Eloquent, Horizon y scheduler | HTTP, negocio, dependencias, conexiones y trabajos | Instrumentación de observabilidad pendiente |
| Expo/React Native iOS y Android | Errores JS, crashes nativos y regresiones por release | Instrumentación pendiente; comprobar builds reales |
| PostgreSQL/PostGIS y Redis | Disponibilidad, saturación, consultas/caché | Exporters y consultas pendientes |
| Linux, VM, Docker Compose, Caddy | Recursos, servicios, disco, reinicios, red/TLS | Capacidad y acceso pendientes |
| Stripe Billing/Connect, Mapbox, Resend, APNs/FCM | Errores, tiempos, retries y retrasos desde Foodtrucks | Sin acceso supuesto al interior de proveedores |
| Live Activities/Android Live Updates | Fallos de inicio/actualización observables | Según implementación y soporte reales |

## 2. Arquitectura mínima y comparación de alternativas

**Recomendación de diseño, pendiente de dimensionar:** comenzar con Prometheus y Grafana OSS privados, Sentry gestionado para errores y una comprobación de disponibilidad externa al domicilio. Mantener los procesos de negocio en PostgreSQL y el logging JSON local con rotación. Añadir Loki/Alloy o trazas adicionales cuando un diagnóstico concreto justifique su coste. La elección comercial de Sentry y cualquier coste externo continúan pendientes.

La selección debe dejar un registro de decisión: modalidad OSS/gestionada/híbrida, ubicación, responsables, versiones compatibles, región, acceso, retención, cuotas/coste y resultados de capacidad. La recomendación anterior no cierra esa selección. No instalar Sentry autogestionado, Loki, Alloy, Tempo o cAdvisor hasta justificar necesidad y mantenimiento con el inventario; Prometheus, Grafana y Sentry siguen siendo los componentes requeridos. La sonda fuera del domicilio puede ser gestionada o alojada en infraestructura externa apropiada, sin alterar el alojamiento doméstico de la aplicación ni contratar un VPS por defecto.

| Alternativa | Ventajas para Foodtrucks | Límites y requisitos |
| --- | --- | --- |
| A. Grafana OSS + Prometheus propios | Control de configuración y retención; reutiliza Compose | Consume RAM/disco y mantenimiento; un fallo del domicilio afecta a la monitorización local |
| B. Grafana Cloud + telemetría compatible | Parte de la observabilidad permanece fuera de casa | Verificar plan, cuotas, región, acceso, egress y compatibilidad; no es alojamiento de la aplicación |
| C. Híbrida: Prometheus/Grafana locales + Sentry gestionado + sonda externa | Mantiene una pila pequeña y errores móviles fuera del servidor | La sonda y su notificación deben tener alimentación/red independientes; contratos y límites pendientes |

No presentar Grafana OSS como coste total cero: electricidad, almacenamiento, backups y trabajo de mantenimiento cuentan. Grafana Cloud y Sentry autogestionado no se declaran necesarios. Autogestionar Sentry supondría evaluar una pila y consumo adicionales; queda fuera de la base mínima. No se introducen Kubernetes, Terraform ni una plataforma distribuida para este MVP.

Arquitectura lógica prevista:

```text
Web / app móvil ───────────────> Sentry (errores filtrados, release, símbolos)
       │
       └──> Caddy / Next.js / API Laravel / worker ──> PostgreSQL, Redis, externos
                          │
           métricas privadas + logs JSON
                          │
             Prometheus ──> Grafana + Grafana Alerting ──SMTP Resend─> propietario

Sonda independiente del domicilio ──> dominio/TLS/API pública y heartbeat
                                 └─> alerta independiente de la pila local

Opcionales posteriores: Alloy → Loki; OpenTelemetry → backend de trazas
```

**Un solo responsable principal de notificaciones operativas:** Grafana Alerting. No activar además un Alertmanager independiente para las mismas reglas. Prometheus puede evaluar recording rules sin enviar notificaciones duplicadas. Si se elige evaluación y routing por Prometheus/Alertmanager, migrar la responsabilidad y sus políticas explícitamente. La sonda externa mantiene su propio aviso de caída total; Sentry se reserva para errores/crashes/regresiones de aplicación. [Modelo de notificaciones Grafana](https://grafana.com/docs/grafana/latest/alerting/configure-notifications/).

## 3. Contrato de métricas y cardinalidad

Prometheus recopila señales técnicas agregadas; no es el libro de pedidos ni el registro de pagos. Definir para cada métrica tipo, unidad, propietario, punto exacto de actualización, dimensiones permitidas, comportamiento al reiniciar y tratamiento de ausencia. Usar segundos/bytes/unidades base; Counter para acumulación, Gauge para estado y Histogram para distribuciones. Aplicar `rate` a Counter, no a Gauge. [Instrumentación](https://prometheus.io/docs/practices/instrumentation/).

El contrato debe incluir versión, fuente autoritativa, ventana/frescura, consultas consumidoras y presupuesto de series. QA debe comprobar que un cambio de etiqueta, bucket o semántica no rompe reglas/dashboards ni altera una cifra de negocio. La cardinalidad y coste se miden con carga representativa antes de activar nuevos collectors o dimensiones.

Etiquetas permitidas por lista cerrada: `service`, `environment`, `method`, `route`, `status_class`, `outcome` o `provider` cuando esa dimensión resulte útil. Mantener `job`/`instance` de scrape bajo control. Versión/SHA en una métrica `foodtrucks_build_info` y metadatos de release; no multiplicar todos los histogramas por cada commit. Separar entornos de verdad, además de etiquetarlos.

**Nunca etiquetas** con email, usuario, IP individual, vendedor individual, pedido, token, carrito, coordenadas/GPS, URL completa, query string, mensaje de error libre, payment intent o trace ID. Normalizar `/api/v1/orders/{order_id}` y agrupar rutas desconocidas en `unmatched`, en vez de exportar paths arbitrarios. `trace_id` puede ser un campo restringido de log o un exemplar compatible, no una etiqueta normal.

| Métrica propuesta | Tipo/unidad | Semántica y dimensiones acotadas |
| --- | --- | --- |
| `foodtrucks_http_requests_total` | Counter, solicitudes | Petición finalizada; método, route, clase HTTP; un incremento por petición |
| `foodtrucks_http_request_duration_seconds` | Histogram, segundos | Tiempo servidor completo; route/método; incluir fallos con criterio documentado |
| `foodtrucks_api_errors_total` | Counter, errores | Error semántico clasificado por código cerrado; no replicar ciegamente cada 4xx |
| `foodtrucks_external_service_failures_total` | Counter, fallos | Proveedor/operación/tipo acotados; diferenciar intento de resultado final |
| `foodtrucks_external_request_duration_seconds` | Histogram, segundos | Latencia de dependencia con timeout, sin nombres de recursos individuales |
| `foodtrucks_db_connections` | Gauge, conexiones | Fuente PostgreSQL/exporter verificada; no asumir un pool pgx en PHP-FPM ni sumar cifras de distinto alcance |
| `foodtrucks_background_jobs` | Gauge, trabajos | Pendientes/en proceso por clase finita; sin ID de trabajo |
| `foodtrucks_last_business_aggregation_timestamp_seconds` | Gauge, Unix time | Última agregación correcta; detectar frescura, no asumir cero como actualizado |
| `foodtrucks_build_info` | Gauge, constante 1 | Servicio, entorno y versión activa; limpiar versiones de instancias retiradas |

Buckets de latencia deben cubrir objetivos reales y permitir alertas útiles. Consultas abajo usan **histogramas clásicos** como ejemplo compatible; evaluar histogramas nativos si librería, servidor, almacenamiento y Grafana los soportan, con sus consultas específicas. No cambiar formato manteniendo consultas incompatibles. p95 no se obtiene promediando p95 de instancias. [Histogramas](https://prometheus.io/docs/practices/histograms/).

## 4. Instrumentación de Laravel y Next.js

**Laravel/PHP:** instrumentar middleware/eventos HTTP, ruta normalizada, estado, duración y excepciones con el ciclo real de Laravel. Separar salud y scrapes del tráfico de negocio. Observar consultas lentas sin parámetros privados, conexiones PostgreSQL, saturación/cola de PHP-FPM y memoria/reinicios/antigüedad de trabajos Horizon. No asumir memoria compartida entre procesos PHP-FPM: verificar agregación/persistencia del colector para métricas multiproceso. Para errores evaluar el SDK `sentry/sentry-laravel` compatible con Laravel 13/PHP y su integración de excepciones/jobs; un evento lógico por fallo, sin doble captura. No está instalado por escribir esta política. No exponer Horizon/Telescope/FPM status, profiler ni métricas públicamente. La configuración se contrasta con el [backend vigente](../backend/README.md) y la [documentación Sentry Laravel](https://docs.sentry.io/platforms/php/guides/laravel/) antes de implementarla.

**Next.js:** comprobar versión, App/Pages Router, Node/Edge y estrategia de despliegue. Usar SDK oficial `@sentry/nextjs` y los puntos de instrumentación correspondientes a esa versión; `instrumentation.ts` configura el servidor, con imports por runtime cuando sea necesario. Instrumentar errores de browser/SSR, API routes/Route Handlers/Server Actions existentes, renderizado y llamadas al backend. No crear API Routes de negocio duplicadas para obtener métricas: la API Laravel sigue siendo autoritativa. [Instrumentation API](https://nextjs.org/docs/app/guides/instrumentation), [guía Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/).

Medir RPS, 4xx/5xx, p50/p95/p99, timeouts, rutas lentas y CPU/memoria **solo donde la plataforma lo permita**. Si Next se ejecuta en un proceso persistente privado, evaluar exposición de métricas por instancia o telemetría OTel. Si cambia a serverless, usar la integración/exportación soportada por el proveedor o un colector compatible: un contador local por función no representa el total global ni conserva historia fiable. Prometheus no scrapea directamente el navegador o teléfonos.

Crear un mapa de ownership: Sentry para excepciones y, si se selecciona, tracing de esos runtimes; Prometheus para métricas; OTel para spans adicionales solo cuando aporta diagnóstico. Desactivar capturas duplicadas/auto-instrumentaciones solapadas y probar que un error de test produce un evento lógico. Conservar budgets de payload, CPU y arranque; telemetría no justifica degradar el objetivo móvil de 120 FPS. No convertir profiling de una herramienta en prueba de 120 FPS: se verifica en dispositivos compatibles con builds release.

## 5. Sentry: web, móvil y backend

Propuesta de proyectos lógicos: web, API Laravel y móvil, con dev/staging/prod diferenciados; decidir si se requieren proyectos totalmente separados por entorno para aislamiento. iOS/Android pueden compartir proyecto móvil con plataforma identificada si el acceso y el plan lo permiten. Nombres reales, región de tratamiento, plan, responsables y permisos pendientes. No se ha consultado ninguna cuenta Sentry.

Para Expo detectar SDK y estrategia prebuild/bare, y seguir integración oficial `@sentry/react-native` compatible. Capturar JS y crashes nativos sobre development/release builds apropiados; Expo Go no demuestra cobertura de los módulos nativos de Foodtrucks. Medir navegación, carga, carrito, confirmación de pedido y llamadas API observables, diferenciando errores técnicos de rechazos funcionales esperados. Comprobar Android e iOS y las versiones de app realmente soportadas. [Sentry en Expo](https://docs.expo.dev/guides/using-sentry/).

Cada build identifica `environment`, `release`, versión y build number. El manifiesto de release relaciona **commit SHA y digest de cada imagen**, configuración no secreta y migraciones; web/Laravel usan esa identidad verificable en Sentry y metadatos de despliegue. En móvil considerar `dist`, runtime/update ID y Debug IDs según SDK/build/OTA. Subir source maps **del bundle exacto**, dSYM iOS y símbolos Android si corresponden, y verificar una traza resuelta. Un sourcemap de otra compilación puede dar una ubicación incorrecta. OTA requiere subida y matching propios, no reutilizar el mapa del binario indiscriminadamente. Los DSN y proyectos reales están pendientes; solo se habilitan tras definir entorno, región, accesos y redacción.

El **DSN del cliente es un identificador de ingesta visible por diseño**; no otorga administración. `SENTRY_AUTH_TOKEN` es un secreto privado para CI/subida de artefactos, con scopes mínimos, sin `NEXT_PUBLIC_` ni `EXPO_PUBLIC_`, y nunca en bundles, imágenes, logs o `.env` versionado. No publicar sourcemaps completos al público por defecto tras la subida privada. Verificar controles de abuso y quotas; no confundir DSN público con ausencia de protección.

Configurar redacción antes de enviar y filtros del proyecto: cookies, Authorization, tokens de sesión/reset/QR, passwords, cuerpos sensibles, emails, teléfono, IP cuando no necesaria, ubicación exacta, datos de tarjeta y metadatos de pedidos/pagos. No habilitar `sendDefaultPii` indiscriminadamente. Breadcrumbs solo con acción/código/ruta normalizados. Session Replay y profiling quedan pendientes de finalidad, consentimiento cuando corresponda, enmascarado, soporte del SDK, rendimiento y presupuesto; no activarlos por defecto.

Muestreo de errores/transacciones y límites: priorizar fallos relevantes con volumen controlado, filtrar duplicados/ruido, observar eventos descartados y ajustar al tráfico. Mantener alertas de regresión/new issue y frecuencia por release con muestra mínima; no notificar cada timeout recuperado. La integración GitHub futura necesita repositorio y permisos acordados; el plan no conecta una cuenta ni crea incidencias automáticamente.

## 6. APIs y métricas de negocio duraderas

Clasificar APIs con [contrato existente](20-api.md): P0 creación/consulta de pedidos y confirmación autoritativa de pago; P1 auth y descubrimiento/menú necesarios para comprar; paneles de gestión según impacto. El nivel de **incidente** depende de alcance real, horarios y alternativa disponible, no solo de que una ruta sea crítica. Registro fallido por entrada inválida, login incorrecto o tarjeta rechazada no equivalen automáticamente a fallo interno.

El inventario de endpoints debe incluir registro/verificación/recuperación, login local, Google/Apple, búsqueda, menús, carrito, creación/consulta/transición de pedidos, pagos/webhooks y gestión de vendedores cuando existan. Para autenticación propia, medir resultados técnicos y rate limiting mediante códigos cerrados; no crear etiquetas por usuario, correo, token o subject OAuth, ni introducir un proveedor nuevo de autenticación. Diferenciar credenciales incorrectas, denegación legítima, dependencia OAuth/correo caída y error interno. El acceso denegado debe continuar denegado aunque genere una alerta.

Modelo propuesto de transiciones: iniciado/intento → pedido creado → pago confirmado → aceptado → preparado → recogido/completado, con cancelación/fallo/reembolso donde proceda. Confirmar contra los estados finales del dominio: una compra completada es recogida, y una sesión Checkout creada no prueba pago. Mantener eventos de servidor y transiciones confirmadas como verdad; frontend solo observa experiencia y abandono, sin incrementar contadores financieros.

| Señal de negocio | Propuesta de medición | Precaución |
| --- | --- | --- |
| Intentos y pedidos creados | Counter técnico de intentos; agregación duradera de creaciones únicas | Separar retry de pedido nuevo |
| Pago confirmado/fallido | Eventos validados y deduplicados del proveedor | Separar rechazo del comprador, error de integración y resultado final |
| Confirmados, cancelados, fallidos, completados | Totales agregados de transiciones únicas en PostgreSQL | Un mismo pedido puede recorrer varios estados; explicar cada contador |
| Tiempo de creación/confirmación/preparación | Histogram por transición real disponible | No contabilizar retries como nuevos tiempos de vendedor |
| Pendientes y antigüedad | Gauge agregado por estado; timestamp más antiguo | Reportar frescura de la agregación |
| Vendedores activos/disponibles | Gauge agregado de disponibilidad definida | Suscrito, conectado y aceptando pedidos son conceptos distintos |
| Webhooks y trabajos | Duplicados, error de firma/procesado, retry y retraso | No guardar payload ni IDs externos en etiquetas |
| QR recogida | Éxito/rechazo por causa finita y uso único real | Sin valor QR, token ni identidad del pedido |
| Suscripciones/loyalty | Fallos de cobro/conciliación y consistencia agregados, si implementados | Ni prometer reglas de puntos aún pendientes ni duplicar facturación |

Nombres candidatos: `foodtrucks_orders_created_total`, `foodtrucks_orders_confirmed_total`, `foodtrucks_orders_cancelled_total`, `foodtrucks_orders_failed_total`, `foodtrucks_orders_completed_total`, `foodtrucks_order_processing_duration_seconds`, `foodtrucks_orders_pending`, `foodtrucks_payment_failures_total`, `foodtrucks_active_vendors`, `foodtrucks_available_vendors`. Usarlos únicamente cuando exista el comportamiento correspondiente y definir el significado de `failed`/`completed` en su contrato.

**Deduplicación y autoridad:** constraints/transacciones PostgreSQL para evento del proveedor, transición y outbox; repetir webhook/trabajo no vuelve a aplicar dinero, puntos, stock o transición. Un `counter.Inc()` en memoria después de commit puede perderse antes de scrape o repetirse al reintentar; no ofrece exactamente una vez. Los counters de runtime sirven a diagnóstico aproximado. Las cifras de negocio auditables salen del ledger/estados duraderos, mediante agregación eficiente y una única fuente lógica exportadora por entorno. No sumar copias del mismo agregado exportadas por todas las réplicas.

Si se exporta un total acumulado duradero, mantener su semántica monótona y probar reinicios/restauraciones/correcciones; en otro caso usar Gauges de agregados temporales explícitos y documentar ventana/frescura. No lanzar `COUNT` completos en cada scrape: actualizar agregados por eventos confirmados o job periódico indexado, con carga medida. Cancelaciones/reembolsos son eventos separados, no decrementos de un Counter. Para ratios de pedidos por ventana distinguir métricas de transitions y cohortes: completados en esta hora / creados en esta hora no es una tasa de conversión fiable si se recogen más tarde.

## 7. PostgreSQL, Redis e infraestructura doméstica

PostgreSQL: conexiones activas y pool, errores, latencia por consulta lógica, locks/esperas, transacciones, tamaño/crecimiento, autovacuum y backups. Replicación solo si existe. Exporter con usuario mínimo de monitorización y permisos exactos revisados; sin superusuario, credenciales en query labels o DSN visible. `pg_stat_statements` se evalúa con versión/overhead, consultas normalizadas y acceso restringido; no capturar parámetros privados. Scrapes/consultas acotados, con timeout, no `EXPLAIN ANALYZE` de escrituras productivas para monitorizar.

Redis: memoria/evictions, conexiones, latencia, hit/miss, rejected connections, errores y disponibilidad. Distinguir Redis reiniciable como caché de cualquier trabajo durable: el estado autoritativo no depende de perder esa caché. Registrar invalidación fallida o datos obsoletos con clases de evento limitadas. Exporter con ACL específica y comandos mínimos; no exposición pública ni inspección continua de todos los keys.

Linux/VM: CPU, memoria disponible, swap/OOM, disco e inodos, crecimiento, I/O, red, uptime y servicios. Separar disco virtual de espacio físico del datastore: una VM con espacio libre puede fallar si el disco del host se llena. Vigilar aplicación y cuotas de observabilidad, fotos locales y backups sin competir por el último espacio libre. Aislar dev de prod en red, volúmenes, secretos y consumo; una compilación de desarrollo no debe agotar producción.

Node Exporter para Linux medible; exporters PostgreSQL/Redis después de comprobar necesidad. cAdvisor **opcional** tras revisar privilegios, mounts, visibilidad y coste. No montar el Docker socket por comodidad en un colector: permite control elevado del host; preferir señales disponibles de proceso/runtime o un mecanismo restringido. Los mounts del host y collectors también requieren mínimo privilegio. Ningún exporter tiene permisos de escritura sobre fotos/datos de negocio. [Node Exporter](https://github.com/prometheus/node_exporter).

Monitorizar respaldo externo y última restauración verificada, no solo que el cron empezó. UPS, temperatura, SMART y estado de ISP solo si el hardware los expone de manera soportada. Dos VMs sobre el mismo equipo comparten fallo físico, energía e ISP: no ofrecen alta disponibilidad independiente. La sonda externa y sus credenciales/avisos deben sobrevivir a ese fallo.

## 8. Health checks y disponibilidad externa

Rutas ilustrativas: `/health/live` prueba proceso; `/health/ready` prueba capacidad de atender tráfico y dependencias internas indispensables con timeout; `/metrics` es privada. La liveness no debe reiniciar todo el stack porque Stripe, Resend o Mapbox fallen temporalmente. Readiness define si PostgreSQL es indispensable y qué degradación de Redis es tolerable. Respuesta pública mínima; detalles de dependencia solo en interfaz interna autorizada.

Sonda externa: DNS del dominio controlado, TLS/expiración, HTTP público esperado y una función esencial que no se satisfaga con una página estática cacheada. Comprobar frontend y API con rutas seguras, sin compras, cargos, cuentas o envío de email. Si Cloudflare devuelve contenido cacheado, mostrar disponibilidad del edge y del backend separadamente. Una sonda detrás de la misma red no detecta el corte del domicilio. [Blackbox Exporter](https://github.com/prometheus/blackbox_exporter).

Blackbox externo autogestionado o monitor gestionado son alternativas pendientes de coste/ubicación. Limitar sus targets mediante allowlist: un prober arbitrario puede convertirse en herramienta de SSRF. Validar redirects, DNS/TLS, status y contenido mínimo; rutas sensibles requieren credencial de prueba limitada y no publicada. Definir fallo vs ausencia del propio prober. Añadir heartbeat externo de observabilidad para detectar silencios; su destino y segundo canal son pendientes.

## 9. Consultas PromQL ilustrativas y datos ausentes

Ejemplos **no ejecutados**, sujetos a nombres/etiquetas reales y a selección de servicio/entorno. Las series HTTP conocidas se inicializan cuando sea viable; si no existe una serie de errores, documentar ese caso en recording rules en vez de transformar todo dato ausente en cero. Aquí el total de requests incluye `status_class`, por lo que un servicio sin 5xx puede necesitar inicializar las clases conocidas. [Recording rules](https://prometheus.io/docs/practices/rules/).

```promql
# RPS agregado por servicio/entorno; rate antes de sum para detectar resets.
sum by (service, environment) (
  rate(foodtrucks_http_requests_total[5m])
)

# p95 por route; histograma clásico.
histogram_quantile(0.95,
  sum by (service, environment, route, le) (
    rate(foodtrucks_http_request_duration_seconds_bucket[5m])
  )
)

# Ratio 5xx; solo evaluar con al menos 100 solicitudes en 5 min.
# 2% y 100 son ejemplos para validar, no umbrales de producción aprobados.
(
  sum by (service, environment) (
    rate(foodtrucks_http_requests_total{status_class="5xx"}[5m])
  )
  /
  sum by (service, environment) (
    rate(foodtrucks_http_requests_total[5m])
  )
) > 0.02
and on (service, environment)
sum by (service, environment) (
  increase(foodtrucks_http_requests_total[5m])
) >= 100

# Latencia media observada; no es p95.
sum by (service, environment) (
  rate(foodtrucks_http_request_duration_seconds_sum[5m])
)
/
sum by (service, environment) (
  rate(foodtrucks_http_request_duration_seconds_count[5m])
)

# Edad de la última agregación de negocio correcta.
time() - foodtrucks_last_business_aggregation_timestamp_seconds

# Scrape fallido y desaparición del job son condiciones diferentes.
up{job="foodtrucks-api"} == 0
absent_over_time(up{job="foodtrucks-api"}[5m])
```

No dividir por cero para presentar una cifra tranquilizadora: cero tráfico significa ratio indefinido o insuficiente muestra. Conservar estados **0 real / sin datos / scrape fallido / ingesta retrasada / no aplicable**. En Grafana definir explícitamente No Data y Error de consulta, especialmente en señales críticas; no marcar todo No Data como Normal. Desaparición de una serie puede significar target eliminado, no caída del proceso: validar inventario/configuración antes de tratarla como incidente. [Reglas Grafana](https://grafana.com/docs/grafana/latest/alerting/alerting-rules/create-grafana-managed-rule/).

## 10. Dashboards reproducibles

Todos los paneles especifican título, descripción, unidad, fuente/consulta, rango, filtros, refresco, tratamiento de ausencia y enlaces relacionados; no rellenar con datos ficticios. Plantillas solo se convierten en dashboards funcionales al conectar datos y comprobar queries. Overview usa rango operativo corto ajustable y tendencia por ventana; negocio distingue agregados y cohortes; móvil enlaza/incorpora Sentry solo mediante integración compatible y autorizada, sin prometer consultar teléfonos desde Prometheus.

| Dashboard previsto | Paneles mínimos / fuente |
| --- | --- |
| **FOODTRUCKS — OVERVIEW** | Disponibilidad web y API desde sonda; p95; error rate; RPS; creados/fallidos/completados; incidencias activas; vendedores activos; dependencias; versión actual; tendencias; alertas. Prometheus + enlaces Sentry/Grafana |
| **FOODTRUCKS — API PERFORMANCE** | RPS, p50/p95/p99 por route, 4xx/5xx, timeouts, dependencias, pool/saturación, rutas lentas |
| **FOODTRUCKS — ORDERS & BUSINESS** | Pedidos por minuto/hora; creados/confirmados/cancelados/fallidos/recogidos, pendientes/edad, latencia y errores por transición, integridad de pago/QR; finalización por cohortes solo desde agregación definida |
| **FOODTRUCKS — INFRASTRUCTURE** | CPU/RAM/disco/inodos/I/O/red, reinicios/OOM, host y VM, DB/Redis, backups y exporters |
| **FOODTRUCKS — MOBILE** | Crashes JS/nativos por Android/iOS, versión/build/update, API/navigation errors, regressions. Sentry como fuente principal |
| **FOODTRUCKS — DEPLOYMENTS** | Release/SHA, anotaciones de despliegue, antes/después de errores/latencia, salud, issues asociados |
| **FOODTRUCKS — ALERTS & SLO** | SLIs/SLOs aprobados, error budget, burn rate si procede, alertas/recuperación, incidentes, tiempos de resolución y tendencias de fiabilidad registrados |

Provisionar folder, datasource, dashboard UID, rule UID y políticas con nombres estables del proyecto. JSON/YAML compatibles con la **versión seleccionada**, con variables acotadas de servicio/entorno/ruta. Fuentes privadas consultadas server-side; secretos en campo seguro/mecanismo admitido, no JSON publicado. No activar `prune`/borrados globales que eliminen dashboards o fuentes ajenas. OSS provisioning de archivos y APIs/capacidades Cloud son distintos. [Provisioning](https://grafana.com/docs/grafana/latest/administration/provisioning/).

## 11. Alertas, severidad y control de ruido

Cada alerta registra: ID/version, rol responsable, condición/consulta, ventana, muestra mínima, `for`, recuperación/histeresis si aplica, severidad, impacto, dashboard, runbook, No Data/Error, routing, temporización y fecha de última prueba. Los umbrales recibidos son puntos de partida **no definitivos**: API inaccesible 2 min; 5xx >2% 5 min con tráfico suficiente; p95 >2 s sostenido; disco >85% con tendencia; pedidos fallidos >5% con muestra. No copiarlos a producción sin baseline y presupuesto de error. Operación y propietario del servicio deben registrar la calibración y QA comprobar disparo, recuperación y ausencia de falsos positivos en casos controlados.

| Nivel | Impacto orientativo | Notificación propuesta |
| --- | --- | --- |
| P0 crítica | Caída total, creación/pago indisponibles de forma generalizada, DB inaccesible | Aviso prioritario al propietario; segundo canal independiente pendiente |
| P1 alta | 5xx/latencia/regresiones relevantes, fallos persistentes de pedidos, saturación | Correo agrupado y seguimiento según cobertura de operación |
| P2 media | Degradación parcial, capacidad con margen, servicio secundario | Correo agrupado no urgente/revisión operativa |
| P3 informativa | Release, recuperación y tendencias | Registro/resumen; sin urgencia por defecto |

Reglas por disponibilidad, latencia, 5xx, CPU/memoria/disco/inodos, OOM/reinicios, backlog/edad, DB/cache, fallos técnicos Stripe/Resend/push y frescura de agregados. La ausencia de pedidos solo alerta si hay horario operativo, vendedores disponibles, tráfico esperado e histórico suficiente; un MVP sin demanda no es incidente. Fallos de pagos separan rechazo esperado de fallo técnico; no alarmar por cada 4xx o cada notificación push con token caducado.

Agrupar por servicio/entorno/severidad y causa raíz; deduplicar, definir group wait/interval/repeat, silencios de mantenimiento con expiración, notificaciones Firing/Resolved e inhibición de síntomas subordinados a una caída conocida. Intervalos concretos se calibran: no hay una frecuencia universal ni se garantiza atención 24/7 por disponer de correo. Establecer dueño de cada incidente; Sentry informa crashes/regresiones, Grafana indicadores operativos y la sonda externa caída total. Evitar tres avisos equivalentes sin coordinación.

## 12. Correo de alertas con Resend

El correo transaccional de Foodtrucks mantiene la **API HTTP de Resend** conforme a [correo](30-correo-resend.md). Para alertas operativas de Grafana OSS, la base propuesta es SMTP Resend, sin cambiar el envío de la aplicación. Resend requiere dominio verificado y API key: host `smtp.resend.com`, usuario `resend`, puerto **587 con STARTTLS obligatorio y verificación TLS**. En Grafana, configurar explícitamente `startTLS_policy=MandatoryStartTLS` y `skip_verify=false`; STARTTLS oportunista no cumple la política. La alternativa 465 exige TLS implícito soportado y validado. Contrastar con versión de Grafana y firewall/ISP; no desactivar validación TLS para resolver conectividad. [SMTP Resend](https://resend.com/docs/send-with-smtp), [configuración SMTP Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/).

La clave SMTP es la clave API del proveedor, **no una contraseña personal**. Crear credencial separada por entorno/función, limitada a envío y dominio disponible, distinta del worker de emails de Foodtrucks. Configurar secreto solo en Grafana/servicio notificante; no alojar una clave de administración completa en todos los exporters. Reutilizar dominio autenticado y SPF/DKIM/DMARC de [Resend](30-correo-resend.md); `SMTP_FROM` debe pertenecer al dominio verificado. No hace falta crear un worker HTTP ni un puente webhook adicional para un SMTP soportado.

Las credenciales de Resend se mantienen únicamente en servidor/jobs confiables, nunca en Next.js cliente, bundle Expo, dashboards JSON o artefactos públicos. Desarrollo/CI utilizan fake/sink y pruebas simuladas; staging solo envía a una allowlist de buzones de prueba autorizados. Destinatarios, remitente real y permisos de prueba deben registrarse antes de activar un contact point; este paquete no envía correo ni define direcciones reales.

Variables conceptuales, sin valores reales: `ALERT_EMAIL_TO`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`; adaptar a `grafana.ini`, variables `GF_SMTP_*` o secretos soportados en el despliegue. No asumir que los nombres conceptuales se leen automáticamente por Grafana. En Cloud validar el email contact point y capacidades del servicio, sin copiar configuración SMTP de OSS sin soporte.

Destinatario del propietario, buzón real, permiso de pruebas y contacto alternativo pendientes. No inventar un buzón del dominio como destinatario operativo ni enviar a ejemplos. Contact point y notification policy tienen que estar conectados; probar el botón de envío solo no valida que una regla Firing llegue. Guardar prueba de **envío, aceptación, recepción en buzón, recuperación y agrupación**, con timestamps e IDs técnicos restringidos. SMTP aceptado no garantiza entrega al inbox; cuotas/supresión de Resend también afectan alertas.

Plantilla propuesta:

```text
Asunto: [FOODTRUCKS][P0][FIRING] API indisponible
Servicio / entorno: Foodtrucks API / <entorno real>
Inicio: <fecha/hora UTC y visualización Europe/Madrid>
Problema / impacto: <causa observada y funciones potencialmente afectadas>
Valor / umbral / duración: <medida y regla reales>
Dashboard / incidencia / runbook: <enlaces verificados de acceso autorizado>
Release: <versión identificada>
Estado: FIRING

Recuperación: [FOODTRUCKS][RESOLVED] API recuperada
Inicio / recuperación / duración: <fechas y cálculo reales>
Comprobación realizada: <servicios y flujo verificados>
```

No publicar detalles personales o enlaces con tokens; no declarar incidente resuelto únicamente porque el email fue enviado. Si el servidor de casa, Grafana o Resend fallan, este canal puede fallar: mantener aviso externo independiente y decidir un segundo canal para P0 antes de operar con compromisos exigentes.

## 13. Logs, Loki, Alloy y trazas

Base: logs estructurados JSON y rotación local, acceso restringido y presupuesto de retención. Campos previstos: `timestamp`, `level`, `service`, `environment`, `version`, `trace_id`, `request_id`, `event`, `error_code`, `duration_ms`. Request/trace IDs técnicos deben revisarse como metadatos de acceso restringido y retención limitada; no incorporan identidad de cliente. No loguear bodies completos, query strings/tokens, SQL parametrizado expandido, pagos o ubicación precisa. Probar scrubber con entradas que simulen secretos.

Loki solo si la búsqueda local deja de ser suficiente: labels bajos (`service`, `environment`, `level` si útil), campos JSON/structured metadata para IDs técnicos; no indexar cada usuario/pedido. Revisar acceso/retención/compactor y almacenamiento real; no aplicar automáticamente arquitectura S3 porque las fotos acordadas son locales. El backend de logs exige su propia decisión de almacenamiento y backups. [Cardinalidad Loki](https://grafana.com/docs/loki/latest/get-started/labels/cardinality/).

**No iniciar un proyecto nuevo con Promtail:** su soporte terminó el 2 de marzo de 2026. Si se necesita colector, evaluar Grafana Alloy u otro cliente soportado y sus permisos sobre los logs. Loki/Alloy no son obligatorios en la primera fase. [Fin de soporte Promtail](https://grafana.com/docs/loki/latest/send-data/promtail/).

Trazas: introducir OpenTelemetry cuando sean útiles para cliente → web/API → Laravel → DB/externos, con sampling, timeout/límites de exportación y propagación W3C compatible. Validar cabeceras de entrada; no confiar en sampling/metadata externos arbitrarios. `baggage` no lleva emails, auth, pedidos ni coordenadas. Exportar solo a destinos permitidos, proteger TLS/credenciales y redactar atributos antes de salir. Elegir Sentry tracing o Tempo/backend OTel por responsabilidad; no capturar el mismo span dos veces. [Seguridad OpenTelemetry](https://opentelemetry.io/docs/security/).

Tempo y Alloy/OTel Collector adicionales requieren medición de consumo y almacenamiento; no constituyen una fase obligatoria si Sentry y métricas resuelven el diagnóstico. Las trazas muestreadas no ofrecen recuentos de negocio completos.

## 14. SLIs, SLOs y error budget

Definir SLI a partir del resultado que importa: búsqueda útil, creación de pedido válida, confirmación de pago conciliada, entrega de pedido consultable y recogida segura. Documentar denominador elegible, exclusiones legítimas (validación/rechazo de tarjeta), origen, ventana, retraso y ausencia. Disponibilidad de proceso es auxiliar; no sustituye éxito de compra.

| SLI candidato | Método de evaluación | Decisión pendiente |
| --- | --- | --- |
| Disponibilidad web/API | Probes externos funcionales y/o requests elegibles correctos | Frecuencia, zonas y contrato de disponibilidad |
| Latencia de búsqueda | Histogram de búsqueda, proporción bajo límite definido | Límite y muestra real |
| Éxito al crear pedido | Intentos elegibles deduplicados con resultado confirmado | Definición de intento/cohorte y objetivo |
| Integridad pago/pedido | Pagos confirmados conciliados y estados coherentes | Plazo, tolerancia y tratamiento de proveedor |
| Confirmación del vendedor | Transición en plazo para comercios abiertos/disponibles | Expectativas del negocio y cancelaciones |

**99,9% mensual es un ejemplo recibido**, no SLA ni compromiso de Foodtrucks. Para un SLI de tiempo: presupuesto = duración de ventana × (1−objetivo); 30 días y 99,9% darían 43,2 min de ejemplo, no disponibilidad demostrada. Para SLI de requests: presupuesto = requests elegibles × fracción de error; no intercambiar minutos y requests. Incluir cortes del domicilio si forman parte de experiencia prometida. Datos desconocidos/faltantes se muestran como cobertura insuficiente, no como éxito. Propietario y operación deben aprobar objetivo, ventana, exclusiones y viabilidad antes de anunciar compromisos; todos los SLO siguen pendientes.

Burn rate = fracción de errores observada / fracción de error permitida. Evaluación multiwindow y alertas rápidas/lentas se añaden cuando hay volumen y medición fiables; definir muestras, ventanas y validación con casos sintéticos, no copiar multiplicadores universales. Un error budget agotado informa decisiones de release/reliability; la política de parar despliegues queda pendiente.

## 15. Seguridad y despliegue reproducible

Métricas/exporters/Prometheus en red privada o enlace autenticado permitido; Grafana operativo privado o acceso restringido mediante VPN/identidad, HTTPS y roles mínimos. Sin anonymous access, registro abierto ni credenciales por defecto. Caddy/reverse proxy no confía en headers de identidad de cualquier origen; configurar trust solo del proxy autenticado previsto. No abrir puertos 3000/9090/exporters al mundo ni proxificar `/metrics` como parte de la web pública. Cloudflare DNS/proxy no autentica automáticamente un dashboard.

Quedan prohibidos dashboards públicos, enlaces compartidos anónimos o acceso Grafana público a fuentes/datos de producción. Para demos utilizar datos ficticios aislados. Probar desde fuera de la red que `/metrics`, exporters, administración y consultas productivas no son accesibles sin autorización; ocultar el enlace en el frontend no es un control de acceso. La autenticación de administración debe resolverse con el acceso privado acordado, sin sustituir la autenticación propia del producto.

Separar secretos por entorno y servicio; rotación, backups cifrados y actualización controlada. Datos de observabilidad tienen controles de acceso, retención y tratamiento internacional propios. Dashboards compartidos no incluyen consultas/metadata privados. Exporters no son usuarios administradores de DB/Redis; testear que no puedan cambiar datos. Proteger el endpoint del prober contra targets arbitrarios. No exponer secretos en opciones de proceso, dumps del entorno o salida de CI.

Compose futuro con imágenes oficiales versionadas y digests controlados, networks privadas, volúmenes persistentes, health checks soportados, restart policy razonable, límites de CPU/memoria, disco/retención y secrets. Un contenedor `unhealthy` no se reinicia automáticamente solo por declarar healthcheck: verificar mecanismo real de recuperación. No asumir herramientas de healthcheck disponibles dentro de una imagen mínima. Grafana/Prometheus necesitan escritura solo en sus volúmenes; no en datos de negocio. Cada stack se valida primero en dev/staging y con capacidad física medida.

La ruta propuesta **no se crea ahora** ni contiene archivos vacíos en este paquete:

```text
observability/
  README.md
  compose.observability.yaml
  prometheus/prometheus.yml
  prometheus/recording-rules/http.yml
  grafana/dashboards/foodtrucks-overview.json
  grafana/provisioning/datasources/prometheus.yml
  grafana/provisioning/dashboards/foodtrucks.yml
  grafana/provisioning/alerting/foodtrucks.yml
  tests/rules.test.yml
  .env.example                     # nombres y marcadores, nunca secretos
  loki/ alloy/ tempo/              # solo si se aprueba y utiliza cada componente
.github/workflows/observability-ci.yml
```

Dashboards especializados se añaden cuando sus fuentes existen. Alerting administrado por Grafana no se valida solo con promtool: comprobar schema/provisioning/evaluación en la versión de Grafana elegida. Si se selecciona Alertmanager independiente, introducir sus archivos y retirar routing duplicado. Aplicar seguridad/testing del proyecto y revisión de cambios antes de compras, exposición de red o despliegue.

## 16. Coste, capacidad y monitorización de la monitorización

Presupuesto pendiente: series activas y churn, frecuencia de scrape, retención, WAL/compactación, logs/día, trazas/spans, eventos Sentry, sampling, egress, almacenamiento externo, energía y mantenimiento. No hay factura de Grafana/Sentry ni prueba de que un plan gratuito cubra Foodtrucks. Consultar condiciones oficiales al contratar y registrar fecha, moneda, impuestos, límites y excedentes.

Operación debe acordar con seguridad/privacidad una matriz de retención **antes de habilitar ingesta**: métricas, logs, eventos Sentry, trazas opcionales, evidencias de alertas/incidentes, configuración y backups. Para cada clase registrar finalidad, ubicación, acceso, plazo, límite de tamaño/cuota, procedimiento de eliminación y prueba de restauración cuando corresponda. Los valores siguen pendientes; no adoptar una retención indefinida por omisión. Revisar también las copias/exports y límites del servicio gestionado.

Estimación técnica: samples/día ≈ series activas × 86400 / intervalo de scrape; disco de muestras ≈ samples/s × retención en segundos × bytes/sample **medidos**, más índices/head/WAL/compactación y margen. No es una garantía de consumo ni cubre logs, trazas o backups. Limitar por tiempo **y** tamaño y reservar espacio adicional: el límite TSDB no es una cuota dura de todo el directorio ni previene picos de compactación. La frecuencia de scrape y retención inicial se decide con pruebas; no reservar los 40 GB de la VM de desarrollo para observabilidad. [Almacenamiento Prometheus](https://prometheus.io/docs/prometheus/latest/storage/).

Medir RAM/CPU/disk de la pila pequeña bajo carga y después decidir ampliaciones. Cardinalidad por ruta/histogram puede multiplicar series; limitar dimensiones y eliminar collectors no usados. Para Sentry filtrar ruido, cuotas/avisos, sample tracing/profiling y controlar regresiones que disparen volumen. Un límite puede descartar eventos: hacerlo visible y decidir impacto en diagnóstico. Costes operativos se añaden al presupuesto del proyecto, sin mezclar con la membresía del cliente de 5,99 €/mes ni aprobar los 400 al mes de marketing pendientes.

Monitorizar Prometheus (health/readiness, ingestión, rules/evaluación, targets, WAL/disco), Grafana (salud/evaluación/errores de datasource y notificación), exporters y colectores opcionales. Verificar retraso de ingesta, freshness de agregados y última prueba de alertas. La sonda externa comprueba también la pila/heartbeat con destino seguro; Grafana no es su único vigilante. La caída de correo/Resend, token caducado o cuotas debe quedar detectable por un mecanismo disponible fuera de ese mismo canal.

## 17. CI/CD y pruebas verificables

Aplicar la [política de commits, CI/CD y tests](44-politica-commits-ci-cd-tests.md) cuando exista Git: workflow con permisos mínimos, actions fijadas por SHA, secretos solo en jobs confiables y no en PR de forks; versiones de imágenes/SDK bloqueadas y revisión de dependencias. Validar sintaxis de Prometheus/recording rules, tests de consultas PromQL críticas, dashboard JSON y provisioning, Compose, no exposición indebida, presencia de env necesarios sin imprimir secretos, compilación web/móvil aplicable y pruebas de instrumentación. Los nombres de archivos son futuros. Un cambio de política documental no acredita que el workflow exista o pase.

Comandos orientativos para ejecutar **en el repositorio futuro y con versiones fijadas**, no pruebas realizadas en este paquete:

```text
promtool check config observability/prometheus/prometheus.yml
promtool check rules observability/prometheus/recording-rules/http.yml
promtool test rules observability/tests/rules.test.yml
docker compose -f observability/compose.observability.yaml config --quiet
```

`config --quiet` evita volcar secretos interpolados. Promtool prueba reglas Prometheus; también se necesita prueba de importación/evaluación Grafana y de SDK/builds reales. [Tests de reglas](https://prometheus.io/docs/prometheus/latest/configuration/unit_testing_rules/).

**Flujo requerido:** CI construye una vez desde el commit SHA revisado y produce imágenes identificadas por digest; despliega **automáticamente a staging** tras superar los gates aplicables. Staging valida salud, métricas, errores, reglas, flujos y rollback. La **promoción a producción es manual**, sobre el **mismo artefacto/digest probado**, con manifiesto de release, evidencia, migraciones compatibles y responsable registrados. No reconstruir una imagen diferente para producción ni equiparar una rama verde con promoción productiva. El destino staging/registro y mecanismo manual real siguen pendientes de configurar.

Tras cada despliegue: registrar SHA/release, digest de imágenes y configuración, publicar release Sentry y mapas/símbolos privados del artefacto exacto, verificar health/smoke tests, llegada/frescura de métricas, error rate/latencia contra baseline y asociación de eventos a release. El dashboard de despliegues debe relacionar versión anterior/nueva, entorno, momento, responsable, checks y resultado. Observar ventana suficiente y tráfico conocido; silencio inicial no demuestra salud.

Una degradación crítica debe detener la promoción y activar el runbook. Preparar rollback de artefacto/configuración solo cuando el esquema siga compatible; migraciones de datos, emails y pagos no se revierten al cambiar la imagen. Favorecer migraciones compatibles por fases y verificar backup/restore. **Rollback de producción manual** bajo la política vigente; un rollback automático requeriría una política nueva, alcance y condiciones previamente aprobados y probados, y no se habilita por defecto. No revertir estados financieros confirmados ni migraciones destructivas como respuesta automática a una alerta.

| Prueba en dev/staging | Evidencia exigida, sin resultados inventados |
| --- | --- |
| Error Next.js cliente/servidor y Laravel | Evento único filtrado, runtime/release correctos, stack resuelto |
| Error JS/crash nativo iOS y Android autorizados | Evento sobre build real, mapas/símbolos exactos, plataforma/release/update correctos |
| HTTP conocido y replay controlado | Counters/histogram coherentes, routes normalizadas, resets tratados |
| Webhook/trabajo duplicado y reinicio entre commit/scrape | No doble efecto de dominio; diferencia runtime/agregado duradero explicada |
| Regla con 0 tráfico, poco volumen, ausente, delayed y recuperación | No Data definido, muestra mínima y `for` comprobados |
| Dashboard/UID/provisioning | Importación sin sobrescribir ajenos y consultas con datos reales |
| Alerta Firing → email → Resolved | Destinatario autorizado, envío y recepción reales, timing/agrupación verificables |
| Ruido y caída de dependencia | Dedupe/inhibición y escalado conforme a policy |
| Scrubber, exporter y `/metrics` | Sin PII/secretos; acceso público rechazado; permisos de lectura mínimos |
| Corte simulado del stack de pruebas | Sonda y notificación externas siguen funcionando |
| CI, backup y restauración | Jobs reales pasan; configuración/datos operativos restaurados con acceso correcto |

No simular fallos sobre producción para comprobar reglas. No mandar eventos al proyecto Sentry productivo ni alertas a contactos reales de ejemplo. Documento de resultados registra entorno, SHA/versiones, fecha, pasos, resultado esperado/observado y enlace a evidencia redactada; un caso pendiente no se marca PASS. Esta actualización no ejecuta esos casos operativos; los tests de aplicación y CI se consultan por SHA en 40/44.

## 18. Runbooks e incidentes

Plantilla común: síntomas, impacto/alcance, severidad/propietario, dashboard y release, diagnóstico no destructivo, paso seguro de contención, escalado, recuperación/rollback bajo política, verificación funcional y aprendizaje. Registrar línea temporal en UTC y mostrar Europe/Madrid cuando ayude; proteger datos y enlaces de incidentes. No borrar volúmenes, purgar colas, forzar estados de pago o abrir firewalls para resolver un gráfico rojo.

| Runbook | Primer diagnóstico seguro | Recuperación y verificación previstas |
| --- | --- | --- |
| Web caída | Sonda externa, DNS/TLS, edge vs origen, Caddy/Next y release | Corregir causa/revertir artefacto compatible; comprobar web pública y función esencial |
| API caída | Liveness/readiness, logs normalizados, pool/recursos/red | Contener saturación, recuperar servicio/dependencia; pedido de prueba sin cargo real |
| DB inaccesible | Conectividad privada, espacio/conexiones/locks y credencial, sin revelar DSN | Recuperar causa; restauración solo con procedimiento y punto de datos aprobado; integridad validada |
| 5xx elevados | Route/error code, muestra, release y dependencia | Mitigar/revertir causa; tasa normal con tráfico suficiente |
| Latencia excesiva | Histograma, pool, CPU/I/O, consultas y externos | Reducir causa medida; p95 y flujo real recuperados |
| Pedidos fallidos | Transición, aggregate freshness, retries/stock y outbox | Reconciliar con dominio; no recrear pedido/cargo automáticamente; dedupe verificada |
| Pagos fallidos | Error técnico vs rechazo, eventos válidos/retries y conciliación | Reprocesado idempotente autorizado; no cobrar de nuevo por una alerta; confirmar estado durable |
| Auth fallando | Proveedor/email/rate-limit/timeouts vs entrada inválida | Recuperar dependencia/política segura; no retirar validaciones o MFA |
| Disco saturado | Host/VM, métricas/logs/fotos/backup y tendencia | Rotación/retención/capacidad acordadas; preservar DB/fotos; no borrar WAL/volúmenes a ciegas |
| Crash móvil recurrente | Plataforma/build/update, símbolos y issue/regresión | Parar promoción de release y preparar corrección/OTA compatible; probar en dispositivo |
| Despliegue defectuoso | SHA/artefacto, smoke tests, errores antes/después | Rollback compatible autorizado; no deshacer migración destructiva sin plan |
| Monitorización inoperativa | Sonda externa, scrape/evaluación/ingesta y SMTP | Recuperar observabilidad y comprobar señales/aviso/recepción, no solo UI |

Cada caso se convierte en runbook específico con enlaces y comandos validados cuando exista infraestructura. Operación diaria: revisar P0/P1, jobs/backups/frescura, caídas de targets, espacio y notificaciones; semanalmente tendencias/capacidad/ruido y cuotas; periódicamente restauración y prueba de alerta con autorización, actualizaciones y accesos. Frecuencia definitiva según operación real, no promesa de guardia 24/7.

Procedimiento obligatorio de incidente: registrar detección/impacto y responsable; contrastar sonda, métricas, logs y release; clasificar severidad; contener sin debilitar controles; escalar según cobertura acordada; recuperar mediante runbook o rollback manual compatible; verificar función y recepción Resolved; registrar duración, causa y acción preventiva. El correo no acredita atención inmediata. Cobertura, plazos de respuesta y sustituto deben quedar asignados antes de comprometer un nivel de servicio. Operación mantiene los runbooks y QA prueba sus pasos en un entorno controlado; el propietario acepta los riesgos residuales.

## 19. Fases, criterios de aceptación e informe de estado

| Fase de implementación | Entregable verificable antes de pasar a la siguiente |
| --- | --- |
| 1. Auditoría | Inventario real y acceso/alcance confirmado, con versiones y gaps |
| 2. Web/API | Contrato de métricas y pruebas HTTP/runtime sin PII |
| 3. Sentry | Proyectos/SDK compatibles y eventos dev/staging con release/símbolos correctos |
| 4. Prometheus/Grafana | Stack privado dimensionado, salud y scrape reales |
| 5. Dashboards | Overview/especializados con consultas y ausencia verificadas |
| 6. Negocio | Eventos/dedupe/agregados duraderos, semántica y coherencia probadas |
| 7. Alertas/email | Routing/plantillas y ciclo de recepción/recuperación probado con contactos autorizados |
| 8. Logs/trazas opcionales | Justificación, presupuesto, scrubber y correlación cuando se adopten |
| 9. GitHub Actions | Validación real reproducible con controles de secretos |
| 10. QA/seguridad/documentación | Matriz de pruebas, permisos, no PII, backups y runbooks |
| 11. Staging | Despliegue automático tras CI; flujo completo, digest probado, rollback e independencia de sonda demostrados |
| 12. Producción | Promoción manual del mismo artefacto; evidencias, riesgos/capacidad, plan de rollback compatible y responsable |

No considerar implementada la observabilidad hasta demostrar los criterios siguientes. QA registra comprobación y resultado; el rol responsable aporta evidencia; el propietario acepta la promoción manual. **Todos los criterios operativos están pendientes de ejecución en este paquete.** Las ejecuciones Actions existentes no acreditan pruebas operativas de Grafana/Prometheus/Sentry ni de alertas SMTP; estas requieren evidencia específica.

| Criterio de aceptación | Evidencia mínima exigida | Rol responsable propuesto |
| --- | --- | --- |
| Inventario y arquitectura | Versiones, aislamiento, modalidad/región, capacidad medida y presupuesto/retención acordados | Operación + propietario |
| Métricas reales y seguras | Scrapes con tráfico controlado, tipos/labels/semántica, frescura/resets y acceso público rechazado | Backend/datos + operación |
| Negocio consistente | Transiciones duraderas, replay/retry/reinicio sin doble efecto y agregados contrastados con PostgreSQL | Backend/datos |
| Dashboards funcionales | Fuentes conectadas, siete vistas según funciones existentes, consultas/unidades y No Data comprobados | Operación + QA |
| Sentry web/API/móvil | Eventos de prueba únicos y redactados, releases correctas y stacks resueltos sobre builds reales | Web/móvil + backend |
| Reglas y control de ruido | Validación real de consulta/provisioning, muestra/ventana, Firing/Resolved, dedupe e inhibición | Operación + QA |
| Correo operativo | Destinatario autorizado, TLS requerido, envío/aceptación/recepción en buzón y recuperación verificadas | Operación + propietario |
| Monitorización independiente | Caída simulada del stack de pruebas detectada fuera del domicilio y aviso externo recibido | Operación |
| Seguridad/privacidad | Roles/accesos, pruebas de redacción sin PII/secretos, credenciales servidor, retención y backups/restore | Seguridad/privacidad + operación |
| CI y release | Checks reales, commit SHA/digests, staging automático y promoción manual del mismo artefacto registrada | QA + operación |
| Documentación operativa | Runbooks críticos con responsables, revisión, resultados/limitaciones y trazabilidad de cambios | Operación + QA |

La revisión documental v1.7 termina cuando requisitos, responsabilidades, pendientes y enlaces son coherentes; la aceptación operativa exige las evidencias anteriores. Resolver arquitectura/capacidad/destinatarios antes de habilitar sus componentes y validar staging antes de modificar producción. La documentación no equivale a instalación ni a aprobación de un despliegue concreto.

| Campos del informe final obligatorio | Estado auténtico del paquete actual |
| --- | --- |
| 1–4. Arquitectura, servicios, versiones y componentes | Diseño de observabilidad; backend DEV y runtimes constan en el repositorio/guía, sin acreditar collectors instalados |
| 5–9. Métricas, dashboards, reglas, contactos y recepción | Contratos/consultas/specs propuestas; ninguna señal funcional ni envío/recepción probados |
| 10–14. Sentry, releases, datasources, Prometheus, logs/trazas | Integraciones planificadas; cuentas, artefactos y configuraciones operativas pendientes |
| 15–17. Pruebas, fallos y soluciones | Casos operativos definidos; tests de aplicación/CI existentes no sustituyen pruebas de instrumentación/alertas |
| 18. Archivos modificados | Este documento de política; integración documental del paquete registrada en README |
| 19–21. Commits, rama/PR, GitHub Actions | Git/remoto y workflow DEV existentes; registrar resultado por SHA, sin acreditar CD ni observabilidad |
| 22–23. Riesgos y costes/requisitos | Capacidad física/red/correo/retención/plan/costes y respuesta externa pendientes |
| 24–25. Despliegue y operación | Gates por fases, runbooks y guía operativa previstos; producción sin intervenir |

Commits futuros atómicos con Conventional Commits (`feat(observability)`, `feat(sentry)`, `feat(grafana)`, `ci(observability)`, `docs(runbooks)`), diff revisado, alcance explicado, pruebas relacionadas y secretos ausentes, conforme a [44](44-politica-commits-ci-cd-tests.md). Crear rama/PR solo al trabajar en un repositorio autorizado, comprobar Actions y resolver fallos; no force-push a ramas compartidas ni merge por defecto. Toda PR creada se adjunta al chat mediante la herramienta de artefactos cuando se utilice Codex. El informe debe enlazar únicamente commits/PR/checks y pruebas que realmente existan.

## 20. Cobertura de los 36 apartados y decisiones pendientes

Esta matriz registra la conversión de los 36 apartados recibidos en política. **Cobertura documental no significa implementación o prueba superada.** No se necesitan archivos con copias de las instrucciones originales para aplicar o verificar la política.

| Apartado recibido | Obligación o procedimiento integrado |
| --- | --- |
| 1. Rol y misión | §0 y §19: responsabilidades para analizar, diseñar, implementar, verificar y documentar con evidencias |
| 2. Contexto Foodtrucks | Introducción y §1: recogida presencial, stack cerrado y funciones reales antes de instrumentar |
| 3. Objetivos | §0 y §3–18: disponibilidad, errores, negocio, rendimiento, monitorización y respuesta |
| 4. Reglas previas | §1 y §15: inventario antes de instalar, secretos/PII protegidos y alcance autorizado |
| 5. Arquitectura | §2 y §16: comparación OSS/gestionada/híbrida, mínima pila y decisión dimensionada |
| 6. Next.js | §4–5: runtime/router compatible, HTTP/render/errores y ausencia de duplicación |
| 7. React Native | §5 y §17: Expo, Android/iOS, JS/crashes, navegación/compra, release y símbolos reales |
| 8. APIs | §3–4 y §6: criticidad, rutas normalizadas, métricas de contratos existentes |
| 9. Negocio | §6: intentos/transiciones, tiempos, vendedores, pagos y agregados duraderos deduplicados |
| 10. Bases de datos | §7: PostgreSQL/conexiones, PHP-FPM/Horizon, locks, latencia, crecimiento/backups y mínimo privilegio |
| 11. Infraestructura | §7: host/VM/Compose domésticos, recursos/red/disco/reinicios, sin inventar visibilidad |
| 12. Health checks | §8: liveness/readiness/dependencias diferenciadas y sonda externa al domicilio |
| 13. Overview | §10: vista general con fuentes/consultas/unidades/No Data y datos verificables |
| 14. Dashboards especializados | §10: API, negocio, infraestructura, móvil, despliegues y alertas/SLO |
| 15. Dashboards como código | §10 y §15: JSON/provisioning, fuentes/carpetas/policies y UIDs estables |
| 16. Alertas | §11: P0–P3, impacto, responsables y notificación acorde a cobertura real |
| 17. Reglas/umbrales | §9 y §11: PromQL, muestras, `for`, recuperación, datos ausentes y calibración |
| 18. Email automático | §12: SMTP Resend operativo, TLS obligatorio, contactos, plantillas y recepción real |
| 19. Ruido/escalado | §2 y §11–12: agrupación/dedupe/silencios, sistema responsable y segundo canal pendiente |
| 20. Sentry | §5: web/Laravel/móvil, agrupación/regresión, release, breadcrumbs seguros, límites y alertas |
| 21. Loki | §13: opcional justificado, JSON/labels bajos, retención/acceso y colector soportado |
| 22. Trazas | §13: OTel/Tempo opcionales, propagación segura, sampling y correlación sin duplicación |
| 23. SLI/SLO/error budget | §14: experiencia elegible, objetivos pendientes, ventanas y burn rate cuando sea viable |
| 24. Monitorización de la monitorización | §8 y §16: scrape/ingesta/reglas/capacidad/notificaciones y vigilancia independiente |
| 25. Seguridad de herramientas | §15: acceso privado, roles/TLS/secretos, sin dashboards públicos productivos |
| 26. Docker/Compose | §15: versiones/digests, redes/volúmenes/health/reinicios y capacidad verificados en staging |
| 27. GitHub Actions | §17 y política 44: validación, staging automático, promoción manual y SHA/digests |
| 28. Pruebas de monitorización | §17 y §19: errores/metrics/queries/dashboards/Firing/recepción/Resolved y privacidad |
| 29. Incidentes/runbooks | §18: doce casos, diagnóstico seguro, escalado, recuperación/verificación y aprendizaje |
| 30. Costes/escalabilidad | §16: series/scrape/retención/logs/trazas/Sentry/energía/mantenimiento y cuotas |
| 31. Estructura de archivos | §15: rutas futuras adaptadas al repositorio, sin vacíos ni servicios no usados |
| 32. Commits/PR | §19 y política 44: cambios atómicos, diff/tests, Conventional Commits, review y checks reales |
| 33. Plan de implementación | §19: doce fases con entregables verificables y funciones opcionales justificadas |
| 34. Aceptación | §19: criterios, roles y evidencias mínimas; pendientes separados de PASS |
| 35. Informe | §19: 25 campos de arquitectura/señales/entrega/Git/riesgos/operación con estado auténtico |
| 36. Orden de ejecución | §1 y §19: auditar primero, implementar por fases en entorno autorizado y demostrar el ciclo completo |

| Decisión pendiente | Rol propuesto que debe resolverla | Condición antes de habilitar |
| --- | --- | --- |
| Repositorio, versiones/builds y permisos GitHub/servidor | Operación + responsables de componentes | Inventario y alcance de ejecución verificables |
| Capacidad física, aislamiento DEV/PROD y destino staging | Operación | Prueba de recursos/red/disco, sin extrapolar la VM DEV a producción |
| Modalidad/ubicación Prometheus/Grafana/Sentry | Propietario + operación | Comparación dimensionada, coste/mantenimiento/región y acceso |
| Retención, cuotas, scrape y sampling por tipo de señal | Operación + seguridad/privacidad | Carga medida, finalidad/plazo/eliminación y margen de almacenamiento |
| Dominio/TLS, transporte público, ISP/UPS y salida SMTP | Operación | Control real del dominio y pruebas de conectividad/seguridad |
| Proyectos/DSN Sentry, símbolos, tokens y accesos | Web/móvil + backend + seguridad | Separación de entornos y prueba privada con artefacto correcto |
| Destinatario/allowlist, remitente y segundo canal P0 | Propietario + operación | Contactos autorizados y recepción probada; sin direcciones inventadas |
| Sonda/heartbeat externos y responsable de aviso | Operación + propietario | Aviso que sobreviva a caída de equipo/energía/ISP domésticos |
| SLI/SLO, umbrales, horarios y cobertura de incidentes | Propietario + operación | Denominador/baseline/viabilidad y responsables nominales |
| Fuente, transiciones y cohortes de negocio | Backend/datos + propietario | Semántica durable y reconciliación/dedupe comprobadas |
| Loki/Alloy/Tempo u otras ampliaciones | Operación + responsables de componentes | Necesidad de diagnóstico y coste medibles; si no, no se instalan |
| Registro, staging automático y mecanismo de promoción manual | Operación + QA | CI real, mismo digest, migraciones compatibles y evidencia de rollback |

No declarar que Foodtrucks cuenta ya con monitorización funcional o que los 36 apartados están implementados: quedan integrados como política y vinculados a evidencias futuras. Los resultados de esta revisión son documentales; instalación, métricas, dashboards, eventos, recepción de correo, commits/PR y despliegues siguen pendientes.

Referencias primarias enlazadas junto al requisito técnico correspondiente. El 13 de octubre de 2026 se comprobaron específicamente el [fin de soporte de Promtail](https://grafana.com/docs/loki/latest/send-data/promtail/), los [parámetros SMTP de Resend](https://resend.com/docs/send-with-smtp) y las [opciones TLS/SMTP de Grafana](https://grafana.com/docs/grafana/latest/setup-grafana/configure-grafana/). Antes de implementar, contrastar toda referencia `latest` con las versiones elegidas. Las consultas PromQL y procedimientos anteriores son propuestas verificables para Foodtrucks, no mediciones extraídas de servicios en ejecución.

## 21. Telemetría, protección de datos e incidentes — v1.9

Aplicar el inventario, registro de riesgos y trazabilidad de la [política de protección de datos y gobernanza](48-proteccion-datos-gobernanza.md) sin duplicar reglas, dashboards o canales. Minimizar la señal antes de almacenarla/exportarla: datos señuelo para validar redacción, dimensiones cerradas y ausencia de cuerpos privados, tokens y QR. Un ID pseudónimo o el filtrado del dashboard no anonimizan por sí solos el evento original.

Para cada señal y proveedor, aprobar finalidad, región/destino, acceso por rol, plazo/cuota, copias/exports, eliminación y responsable antes de activar ingesta. Reutilizar la matriz de retención de §16 y revisar redacción/permisos al cambiar SDK, proveedor o configuración. Registrar resultado y limitaciones de solicitudes que afecten a telemetría, sin prometer que la retención del backend borra automáticamente datos de Sentry u otro tercero.

Una alerta técnica puede iniciar investigación de una posible afectación de datos personales; no identifica por sí sola una brecha ni decide sus obligaciones de comunicación. El responsable evalúa alcance, datos afectados, contención, evidencia mínima protegida y recuperación; coordina la revisión de privacidad/jurídica aplicable y acciones preventivas. No mandar comunicaciones a usuarios, autoridades o terceros automáticamente desde un dashboard, un calendario o esta política. Mantener notificaciones operativas por destinos autorizados conforme a §11–12. Estos procedimientos y los casos QA28/29 de [testing](40-testing-qa-github.md) siguen pendientes de verificación real.
