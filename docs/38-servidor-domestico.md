# Servidor doméstico para desarrollo y producción

**Decisión cerrada U09:** Foodtrucks se alojará en un servidor en casa para desarrollo y producción. Esta decisión sustituye el VPS como alojamiento base; un VPS futuro sería una alternativa que requiere una decisión nueva. **Base propuesta:** separar los entornos y validar capacidad, conectividad, recuperación y coste antes del piloto. En este trabajo no se ha comprado hardware, modificado un router, instalado servicios, publicado un dominio ni desplegado la aplicación. La propiedad previa del equipo no se ha confirmado.

Se conservan Ubuntu Server 26.04, Docker Compose, Caddy, Laravel, Next.js, PostgreSQL/PostGIS, Redis, Mapbox, Stripe y Resend. Las fotos siguen siendo locales y persistentes, sin S3. foodtruck.bid ya está comprado y DEV usa api-dev.foodtruck.bid por Tunnel. Las alternativas de red siguientes son propuestas para entornos futuros; [guía DEV](../backend/README.md).

Los **4 vCPU, 8 GB RAM y 40 GB NVMe** corresponden a la VM VMware de desarrollo ya indicada. No describen el servidor físico, no suman todos los entornos y no aprueban el dimensionamiento de producción. Número de equipos, CPU física, RAM total, discos, hipervisor de producción, consumo, conexión, SAI y presupuesto de hardware siguen pendientes.

## Separación de los entornos

La opción inicial propuesta es una VM de desarrollo y una VM de producción independientes. Si comparten equipo físico, conservan un punto único de fallo: un reinicio, problema del hipervisor, disco, alimentación o red puede afectar a ambas. Dos VMs no constituyen alta disponibilidad.

| Elemento | Desarrollo | Producción |
| --- | --- | --- |
| Sistema y ejecución | VMware/Ubuntu; referencia de VM cerrada | Ubuntu; VM/hipervisor y recursos por elegir |
| Datos | Ficticios y Stripe test | Datos reales y claves live propias |
| Compose | Proyecto y redes propios | Proyecto y redes propios |
| Persistencia | Volúmenes y rutas DEV | Volúmenes y rutas PROD separados |
| Acceso | Equipo del desarrollador/red de pruebas | Administración privada restringida |
| Correo, pagos y push | Fake/sink o destinatarios de prueba permitidos | Proveedores y credenciales del entorno real |
| Despliegue | Cambios frecuentes permitidos | Imágenes revisadas; mantenimiento y recuperación previstos |

Separar usuarios administrativos, credenciales, bases, volúmenes, redes, hostnames y backups por entorno. La separación de nombres Compose por sí sola no aísla dos VMs ni impide acceso desde la LAN: definir reglas de red efectivas. No compartir un montaje escribible con fotografías o PostgreSQL de producción entre DEV y PROD.

Evitar que el ordenador de trabajo suspenda o reinicie automáticamente el host que presta servicio público. Si el equipo de desarrollo tiene ese papel, documentar primero cómo se evita la interrupción y valorar dedicar el host de producción. La decisión depende del inventario real; no presupone otra compra.

## Capacidad física y reservas

Inventariar hardware existente antes de recomendar ampliaciones: modelo/arquitectura de CPU, núcleos, RAM, discos y salud, controladora, interfaces de red, capacidad utilizable, garantías y facilidad de sustitución. Registrar almacenamiento persistente de PostgreSQL/WAL, fotos, imágenes de contenedores, logs y staging de backups. Una etiqueta «NVMe» no demuestra capacidad, resistencia, redundancia ni rendimiento bajo carga sostenida.

Reservar recursos para hipervisor, sistema anfitrión, VM PROD y operación; DEV utiliza el resto dentro de límites. Medir CPU, RAM, I/O, espacio e inodos, latencia de API/DB, conexiones y subida a Internet. No sumar vCPU asignadas como si fueran núcleos físicos independientes ni usar swap como sustituto de RAM suficiente.

La ampliación de observabilidad incluye **Grafana, Prometheus y Sentry**. Su ubicación, modalidad y presupuesto se decidirán con el inventario. Añadir al cálculo el almacenamiento/retención de métricas, logs y eventos; no dar por hecho que caben junto al producto dentro de la VM DEV de 8 GB. Si Prometheus se aloja aquí, separar su volumen y acotar retención temporal/tamaño y cardinalidad; la TSDB local no sustituye una estrategia de recuperación. [Almacenamiento oficial de Prometheus](https://prometheus.io/docs/prometheus/latest/storage/), [observabilidad Foodtrucks](41-observabilidad-grafana-prometheus-sentry.md).

Docker no asigna por defecto un presupuesto de CPU/RAM a cada contenedor. Definir límites coherentes con las reservas y verificar su aplicación real en la versión de Compose/Engine elegida. Evitar una configuración que permita a una compilación o importación DEV agotar toda la memoria física. [Restricciones de recursos Docker](https://docs.docker.com/engine/containers/resource_constraints/).

Compilar/testear preferentemente en el equipo de trabajo o CI y desplegar imágenes identificadas. No ejecutar un runner persistente con código de PR arbitrarios ni builds intensivas en PROD. Cualquier runner propio requiere aislamiento de secretos, red y filesystem; no instalarlo por consecuencia de tener un servidor doméstico. [Entornos y CI/CD](21-entornos-ci-cd.md).

## Conectividad que hay que comprobar

Antes de publicar, recoger los siguientes datos con el operador y mediante pruebas desde una red externa:

- Condiciones del contrato para alojar servicios y restricciones de puertos/tráfico, según la conexión contratada.
- Velocidad real de subida y bajada, latencia, pérdida y comportamiento con otros usos domésticos concurrentes. No equiparar la velocidad comercial con capacidad sostenida del origen.
- IPv4 pública o CGNAT, cambio de dirección, IPv6 público operativo y filtros del operador/router.
- Router/ONT, posibilidad de segmentación, reserva DHCP/IP interna, firewall IPv4 e IPv6 y método de administración.
- Salidas DNS, HTTPS y, si se elige Tunnel, protocolo/puerto necesarios; reloj sincronizado para TLS y firmas de webhooks.

Una IPv6 global operativa es una superficie pública incluso si IPv4 usa CGNAT. No publicar AAAA antes de probar rutas, listener y firewall. Un cambio de IP debe tener un procedimiento; no crear un registro A con una dirección privada o la IP compartida de CGNAT esperando que haga accesible el servidor.

## Dos rutas de publicación; elección pendiente

| Ruta propuesta | Requisitos y efecto |
| --- | --- |
| Cloudflare Tunnel → Caddy local | Conector `cloudflared` que sale hacia Cloudflare; útil con CGNAT o sin IP pública. No precisa abrir puertos entrantes de la aplicación. Deben funcionar el conector, la salida de red y el servicio local. |
| Cloudflare proxy → IP pública → router → Caddy | IP/ruta pública accesible, forwarding/firewall correctos e IP estática o actualización DNS controlada. El origen doméstico recibe tráfico entrante. Mantener TLS válido y Full (strict) si se activa el proxy. |

La selección se toma tras conocer red, requisitos y plan. No se ha impuesto Tunnel ni se considera aprobada la publicación directa. Cloudflare Tunnel permite conectar un origen sin IP pública mediante conexiones iniciadas hacia fuera. [Modelo oficial de Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/).

### Ruta A: Tunnel

Usar un túnel nombrado y estable para producción, con versión y configuración revisadas; no una URL temporal de pruebas. Las rutas de host se asocian al servicio Caddy privado. El registro publicado apunta al destino `<UUID>.cfargotunnel.com` del túnel de la cuenta, no a la dirección WAN del domicilio. No inventar el UUID ni mezclar CNAME de Tunnel y A/AAAA directo para el mismo nombre. [DNS de Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/routing-to-tunnel/dns/).

Permitir salida y tráfico de retorno a los destinos actuales documentados por Cloudflare en **7844 UDP para QUIC o TCP para HTTP/2**; revisar los nombres necesarios si el firewall filtra por SNI. DNS/HTTPS adicionales siguen siendo necesarios para administración, actualizaciones y proveedores. No traducir esta salida en una apertura entrante del puerto 7844 en el router. [Firewall de Tunnel](https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/configure-tunnels/tunnel-with-firewall/).

Mantener el token/credencial del conector únicamente en el entorno correspondiente, con permisos y recuperación documentados. Una credencial DEV no administra PROD. El conector no requiere publicar PostgreSQL, Redis, paneles o SSH como aplicaciones públicas.

**Base TLS propuesta:** `cloudflared` conecta por HTTPS a Caddy con certificado verificable. Elegir nombres/SNI coherentes con su SAN; `originServerName` permite fijar el nombre esperado cuando el servicio se alcanza por una dirección interna. Si se usa una CA privada, instalar exclusivamente la confianza adecuada en el conector. Conservar `noTLSVerify=false`; corregir nombre, CA o certificado en lugar de desactivar la comprobación. [Parámetros del origen Tunnel](https://developers.cloudflare.com/tunnel/reference/origin-parameters/).

Para un certificado público Caddy sin entrada WAN, la propuesta es **DNS-01**: requiere el módulo Cloudflare en una imagen Caddy reproducible y un token DNS limitado a la zona, conforme a [la guía de certificados](29-cloudflare-dominio-dns.md). No asumir que HTTP-01 funcionará detrás de Tunnel por copiar el bootstrap directo. DNS-01 valida mediante TXT y no requiere accesibilidad entrante; su configuración debe ser explícita. [Challenges oficiales de Caddy](https://caddyserver.com/docs/automatic-https).

Como alternativa local por evaluar, HTTP entre conector y Caddy solo sería admisible dentro de la misma VM por loopback o una red Compose dedicada estrictamente aislada, sin exposición a WAN/LAN. En tal caso se configura Caddy explícitamente para HTTP interno, conservando HTTPS público del visitante y el transporte cifrado del túnel; no se utiliza Flexible. Esta alternativa cambia deliberadamente ese tramo local y debe quedar documentada. No extrapolarla a dos equipos, una red doméstica compartida o una ruta de origen directa.

`localhost` dentro de un contenedor identifica ese contenedor. Si `cloudflared` y Caddy son servicios distintos en Compose, la dirección corresponde al nombre de servicio y puerto de su red dedicada; si el conector corre en el host, usar el listener privado previsto. No resolver una confusión de red exponiendo Caddy o datos en todas las interfaces.

La validación `cloudflared` → Caddy es distinta de la configuración Full (strict) del origen con proxy/IP pública. El ejemplo de Caddy/IP confiable del documento 29 debe adaptarse a la topología elegida; no activar o desactivar controles globales esperando que solucionen un salto diferente.

### Ruta B: publicación directa

El router dirige únicamente los puertos web elegidos hacia la VM PROD, con firewall de host y router coherentes. Una dirección WAN dinámica requiere un proceso de actualización DNS limitado a los registros necesarios, verificado y monitorizado; dominio en Cloudflare no implica DDNS configurado automáticamente.

Aplicar [Cloudflare/DNS/TLS](29-cloudflare-dominio-dns.md) con la IP pública doméstica real. El flujo HTTP-01 necesita acceso final al challenge por 80; TLS-ALPN-01 no llega a Caddy cuando termina TLS en el proxy Cloudflare. DNS-01 es la alternativa para emisión restringida. No abrir puertos, activar proxy o cerrar origen hasta comprobar emisión y renovación con la ruta definitiva.

Con proxy Cloudflare conservar Full (strict), hostname válido y certificado de origen vigente. Restringir acceso de origen según la estrategia elegida y verificar también IPv6, exposición desde otra red y recuperación administrativa. Nunca Flexible ni verificación TLS deshabilitada. Si se mantiene DNS only, la conexión del visitante va directamente a Caddy y necesita certificado confiable por el cliente; un certificado Origin CA de Cloudflare por sí solo no cumple ese acceso directo.

## Frontera de confianza y exposición

La aplicación mantiene rutas web y API del documento 29; Tunnel no cambia contratos, autenticación ni autorización Laravel. API móvil, callbacks OAuth y webhooks Stripe/Resend conservan sus firmas/tokens y no reciben challenges de navegador ni una pantalla de Cloudflare Access incompatible con su protocolo. Reservar Access/VPN para administración o staging apropiado; no envolver indiscriminadamente todos los hostnames públicos.

La IP real debe verificarse para cada ruta:

- **Origen directo:** Caddy confía solo en los peers Cloudflare permitidos y verifica qué IP TCP ve realmente tras NAT/Docker.
- **Tunnel:** el peer de Caddy es `cloudflared` local, no una IP del borde Cloudflare. Confiar únicamente en ese peer/listener y red dedicada; proteger el listener de acceso LAN/directo que permita falsificar `CF-Connecting-IP`.
- **Caddy → Laravel:** normalizar las cabeceras y aceptar identidad reenviada solo desde Caddy. No confiar en todas las redes privadas ni autorizar pedidos por IP.

Separar listeners o controles si coexisten acceso LAN y Tunnel. Probar cabeceras inventadas, duplicadas y peticiones que evitan el proxy. Definir confianza acotada en Caddy en función del peer real, no copiar una allowlist de otra topología. [Proxies confiables de Caddy](https://caddyserver.com/docs/caddyfile/options).

PostgreSQL/PostGIS, Redis, Next.js, Laravel, Prometheus/exporters, Grafana administrativo, Caddy admin y gestión del hipervisor permanecen privados. SSH solo mediante acceso administrativo restringido con claves y verificación de host. Docker puede desviar tráfico publicado antes de las reglas UFW: comprobar reglas efectivas y no asumir aislamiento por una configuración del router. [Firewall y Docker](https://docs.docker.com/engine/network/packet-filtering-firewalls/).

SSE/WebSocket, si se implementan, requieren comprobar timeout, reconexión y estado recuperable durante reinicios/redes móviles. Tunnel puede bufferizar respuestas sin `Content-Type: text/event-stream`; una conexión abierta no sustituye PostgreSQL ni una consulta de estado tras reconectar. [Resolución de problemas Tunnel](https://developers.cloudflare.com/tunnel/troubleshooting/).

## Electricidad, SAI y entorno físico

Inventariar consumo de host, discos, ventilación, router/ONT, switch y SAI. Medir energía **en la toma** durante un periodo representativo, con DEV activa e inactiva y cargas habituales; potencia nominal de la fuente o TDP de CPU no es consumo facturable. Si la medición engloba el SAI y equipos conectados, no volver a sumar pérdidas o consumidores ya incluidos.

Registrar temperatura, ventilación, ruido, protección del equipo y acceso físico. Mantener espacio y cableado adecuados; la selección de hardware y seguridad eléctrica se hace con sus especificaciones y responsables correspondientes.

El SAI se propone como protección y ventana de apagado controlado: tamaño/autonomía, carga real, batería, interfaz de monitorización y secuencia de parada pendientes. Cubrir host y red necesarios para el objetivo elegido, comprobar autonomía y apagar de forma ordenada antes del agotamiento. No afirmar que evita todos los cortes ni que mantiene Internet: el operador también puede perder servicio.

Después de un corte, verificar filesystem, DB, servicios, reloj, conexión pública y acciones pendientes antes de habilitar venta normal. Evitar ciclos de encendido/apagado que agoten batería o corrompan datos. Un segundo acceso a Internet o equipo es una opción futura si la disponibilidad exigida lo justifica; no se introduce como compra obligatoria.

## Costes que se incorporan al presupuesto

El alojamiento en casa elimina el VPS como gasto base confirmado, pero mantiene costes de operación. Esta tabla define las entradas a recoger; **no les asigna precios ni afirma coste cero**.

| Partida | Dato requerido y tratamiento |
| --- | --- |
| Host y ampliaciones | Inventario existente/nuevo, compra, garantía, vida útil prevista y mantenimiento |
| Discos | Capacidad útil, repuestos, sustitución, medio separado para recuperación y fotos |
| Electricidad | kWh medidos y precio efectivo de la factura; separar consumo DEV/PROD cuando sea medible |
| Internet | Incremento real por hosting, IP pública/opción contratada, línea adicional si se aprueba; asignación del coste compartido separada |
| SAI y red | Compra, baterías, pérdidas ya incluidas/no incluidas en medición y mantenimiento |
| Backups externos | Destino fuera del domicilio, capacidad, tráfico, retención y pruebas de restore |
| Observabilidad | Recursos locales y costes externos de Grafana/Prometheus/Sentry según modalidad y retención elegidas |
| Dominio/proveedores | Renovación Cloudflare, Resend y otros consumos variables según uso; contratos/planes reales pendientes |
| Trabajo operativo | Tiempo de actualizaciones, incidentes, seguridad, backup y restauración; no tratarlo como inexistente |

Para una estimación previa: `kWh = potencia_media_W / 1000 × horas`; después usar el contador energético y periodo real. `coste_energía = kWh × precio_efectivo_€/kWh` solo estima el componente que ese precio cubre. Registrar términos fijos/impuestos asignables aparte si proceden, sin sumar toda la factura doméstica como coste incremental por defecto.

Separar pago inicial de hardware, gasto mensual de caja y amortización/reemplazo estimados. No sumar compra completa y amortización del mismo equipo en un único total mensual. La conexión doméstica compartida puede tener una asignación económica aunque su coste incremental sea cero; son vistas diferentes del presupuesto.

Las cuotas de ChatGPT Plus, OpenCode, Figma Dev Mode y 21st.dev se llevan en [costes y presupuesto](37-costes-presupuesto.md); no se convierten en recursos del servidor. La factura trimestral de 21st.dev tiene un mes de cobro distinto de su equivalente mensual. El presupuesto Google Ads de 400 al mes sigue pendiente y no es autorización de inversión.

## Backups fuera del equipo y del domicilio

El destino externo debe sobrevivir a pérdida del host, robo/incendio del domicilio, error de operador y compromiso de credenciales PROD. Una carpeta DEV, otra VM, NAS o disco siempre conectado **en la misma casa** puede ser copia adicional, pero no satisface por sí sola esta protección externa.

Seguir [medios y backups](18-media-backups-operacion.md): PostgreSQL consistente, fotos referenciadas coherentes, configuración y secretos recuperables de manera cifrada. Definir frecuencia, retención, RPO, RTO, destino y custodia de claves. No respaldar el directorio PostgreSQL en caliente como copia lógica ni confiar en un snapshot de VM como único backup.

Controlar espacio/horario del staging y subida de backup para no saturar I/O, disco o WAN durante venta. Restore periódico en un entorno aislado sin correos, cobros ni push live; revisar la outbox antes de activar workers y conciliar pagos. Registrar tiempo real y pérdidas esperadas. La existencia del fichero no acredita recuperación.

## Caídas y mantenimiento

| Incidente | Respuesta propuesta y prueba futura |
| --- | --- |
| Internet/Tunnel/IP dinámica | Alerta externa; comprobar ruta y servicio local, reconexión y actualización DNS elegida |
| Electricidad/SAI | Apagado previsto; recuperación de DB/volúmenes/servicios y comprobación antes de vender |
| Host/disco/hipervisor | Restaurar en destino compatible; medios y claves externos disponibles |
| Saturación DEV | Reducir/pausar DEV, preservar PROD y revisar reservas; no borrar volúmenes |
| Origen temporalmente caído | Deshabilitar nuevas acciones imposibles de confirmar; estado posterior consultable y comunicación operativa definida |
| Webhook durante caída | Recuperación/reintentos con idempotencia, conciliación Stripe/Resend y registro duradero; no prometer una ventana ilimitada |
| Seguimiento SSE/WebSocket | Reconectar y leer estado autorizado; no avanzar pedido ni puntos por un mensaje perdido |

La monitorización externa debe poder avisar si la casa entera está sin Internet/luz. Grafana o Prometheus ejecutados únicamente en ese host no pueden demostrar disponibilidad externa ni garantizar entrega de la alerta durante su propia caída.

Procedimiento de mantenimiento: release identificada, backup verificado, migración compatible, ventana si hay interrupción, health/readiness y smoke test, registro del resultado y rollback viable. No cambiar router, hipervisor o reglas TLS simultáneamente con una migración de datos sin razón y recuperación clara.

El QR conserva canje online atómico. No inventar una recogida offline para salvar una caída; el procedimiento comercial de contingencia y conciliación queda por cerrar. Un pago incierto se consulta/reconcilia antes de repetirlo. [Pedidos/API](20-api.md), [Stripe](13-stripe.md), [correo](30-correo-resend.md).

## Decisiones necesarias antes del piloto

1. Inventario físico, número de hosts, hipervisor de PROD, capacidad y reservas medibles por entorno.
2. ISP/contrato, WAN pública/CGNAT/IPv6, ancho de banda real y elección Tunnel o directo; dominios y configuración real todavía pendientes.
3. Consumo medido, tarifa efectiva, horario DEV, SAI y apagado/arranque verificado.
4. Destino externo fuera del domicilio, retención/RPO/RTO y restauración probada.
5. Modalidad y recursos de Grafana/Prometheus/Sentry, alertas externas y acceso privado.
6. Presupuesto doméstico, política de mantenimiento, disponibilidad exigida y contingencia para comerciantes/clientes.

## Criterio de aceptación futura

Cuando existan hardware, cuentas y código: demostrar aislamiento DEV/PROD; acceso administrativo de recuperación; ausencia de puertos de datos públicos en IPv4/IPv6; TLS/renovación y cabeceras confiables de la ruta elegida; API móvil/OAuth/webhooks sin challenges; reintento y reconexión sin doble pago/punto/canje; subida de fotos y backups sin saturar; alarma externa ante caída y restore tras pérdida simulada del host.

Anotar medidas de CPU/RAM/disco/subida, consumo, autonomía SAI, tiempo de recuperación y pruebas realmente ejecutadas. Coordinar las comprobaciones con [seguridad/DevSecOps](39-seguridad-devsecops.md) y [testing/QA](40-testing-qa-github.md). **Las propuestas de este documento no acreditan por sí solas instalación, capacidad para un número de usuarios, disponibilidad garantizada ni comprobaciones de aplicación realizadas.**
