# Redis: caché e invalidación

**Cerrado:** Redis para caché con invalidación. PostgreSQL mantiene la autoridad sobre pedidos, pagos, inventario y recogidas.

## Patrón y valores iniciales

Cache-aside: leer Redis; si falta, consultar PostgreSQL y llenar caché. Mantener payload público limitado y esquema versionado.

| Dato | TTL recomendado en C03, no definitivo |
| --- | --- |
| Mapa por área/filtros | 15–30 segundos |
| Abierto/cerrado | 15–30 segundos |
| Carta/productos | 2–5 minutos |
| Perfil público y referencias a fotos | 5–15 minutos |
| Rate limit | Ventana por operación, pendiente |
| Sesiones/revocación | Según política pendiente |

La caché de fotos aquí es de metadatos; los bytes se sirven desde disco/Caddy. TTL es un límite de obsolescencia, no sustituto de invalidación.

## Claves propuestas

~~~text
foodtrucks:<entorno>:v1:truck:<id>:public:<revision>
foodtrucks:<entorno>:v1:truck:<id>:menu:<revision>
foodtrucks:<entorno>:v1:map:<celda>:<filtros>:<revision>
~~~

No usar bbox de precisión arbitraria como clave ilimitada: normalizar/agrupación por celdas, radio y filtros permitidos, con límites de cardinalidad. Ninguna celda publicará datos fuera de la consulta autorizada.

## Matriz de invalidación

| Cambio persistido | Caché afectada |
| --- | --- |
| Producto/precio/disponibilidad | Carta y resumen público si incluye esos datos |
| Fotos/perfil | Ficha y metadatos; nuevo nombre de archivo versionado |
| Ubicación | Región anterior y nueva; ficha |
| Apertura/aceptación de pedidos | Ficha y mapa |
| Billing/Connect/aprobación/suspensión | Elegibilidad pública y mapa |
| Eliminación de negocio | Perfil, carta y regiones afectadas |

Aplicar después del commit. Registrar invalidación pendiente de forma duradera cuando el cambio sea importante; worker reintenta si Redis no está disponible.

## Evitar carreras

Borrar una clave tras escribir puede dejar que una lectura antigua la rellene después. Propuesta: revisión persistida en PostgreSQL y claves versionadas; lectores cachean la revisión leída y no publican como actual una revisión anterior. El mecanismo concreto debe probarse, sin convertir su lookup en un nuevo cuello de botella.

Para mapa, preferir revisiones por área afectada o invalidación dirigida antes que escanear todas las claves. Resolver cambio entre regiones y borde de celdas. TTL corto limita residuos, pero al comprar siempre se revalida la elegibilidad en PostgreSQL.

Coalescer solicitudes concurrentes a la misma clave, añadir jitter a expiraciones y evitar caché negativa prolongada. Medir hit ratio y coste antes de introducir lógica compleja.

## Caída y límites

Fallo de Redis: fallback limitado a PostgreSQL para lecturas públicas, con protección contra avalancha. No permitir que la caída elimine rate limits de login/pagos; aplicar límite local conservador o denegar si no puede garantizarse control.

Sesiones revocadas no deben convertirse en válidas por un cache miss. Almacenar estado autoritativo o consultar PostgreSQL; estrategia final de sesiones pendiente.

Pub/Sub no es una cola duradera. Outbox y estado del pedido permanecen en PostgreSQL. Límites de memoria, política de expulsión y uso de Redis para sesiones deben separarse conceptualmente: no expulsar seguridad crítica como si fuera una ficha pública.

## Caché de ofertas y membresía

Cachear ofertas públicas con vigencia/límites y, si compensa, vistas privadas aisladas por usuario. Invalidar por edición/expiración de campaña, cambio de membresía o movimientos. TTL específicos pendientes.

La confirmación del canje siempre consulta derechos, saldo y límites autoritativos PostgreSQL. Un resultado de caché no reserva presupuesto/puntos ni permite aplicar una promoción vencida. La caída Redis no debe hacer gratuito el plan ni incrementar saldo.
