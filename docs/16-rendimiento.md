# Rendimiento: objetivo móvil 120 FPS

**Cerrado:** animaciones superfluidas con objetivo 120 FPS en dispositivos que lo permitan. Es un objetivo medible, no una garantía para todos los teléfonos y escenarios.

## Presupuesto

| Frecuencia | Tiempo aproximado por fotograma |
| --- | --- |
| 60 Hz | 16,67 ms |
| 90 Hz | 11,11 ms |
| 120 Hz | 8,33 ms |

Batería, temperatura, SO, SDK y carga pueden reducir frecuencia. Priorizar estabilidad y respuesta; adaptar 60/90/120 sin forzar 120 indiscriminadamente.

## Interacciones prioritarias

Dock y navegación, apertura de ficha, panel inferior con gestos, catálogo, añadir al carrito y tarjeta de pedido. Mapbox: máxima fluidez sostenible con densidad realista, sin prometer 120 constantes.

Reanimated 4/Worklets y Gesture Handler fueron propuestos para trabajo de animación en UI. Skia para efectos/gráficos justificados, Screens para navegación, FlashList para listas que lo requieran. Fijar matriz Expo/React Native/Reanimated/Mapbox compatible.

Preferir transform/opacity, evitar setState por fotograma y operaciones pesadas dentro de worklets. Medir imágenes, layout, gestos y capas del mapa. Limitar efectos de blur, parallax y transparencias costosas. [Reanimated performance](https://docs.swmansion.com/react-native-reanimated/docs/guides/performance/).

## Configuración y verificación

C08 propuso CADisableMinimumFrameDurationOnPhone para iOS ProMotion. Comprobar configuración generada de la versión elegida y documentación vigente; la bandera no demuestra por sí sola el FPS obtenido. No asumir que una versión histórica de plantilla determina la build actual.

Pruebas en release y teléfonos reales; modo desarrollo y emuladores no acreditan objetivo. [Rendimiento React Native](https://reactnative.dev/docs/performance).

## Protocolo de medida propuesto

Escena: Mapbox con cantidad definida de puestos, clusters, fotografías, tarjeta y panel animado. Recorridos repetibles de pan/zoom, cambio de tema, scroll y navegación.

Registrar dispositivo, SO, versión/build, frecuencia, batería/temperatura, distribución de tiempos de frame, frames perdidos, latencia táctil y memoria. Usar instrumentos de plataforma. Umbrales p95/p99 y porcentaje aceptable de frames perdidos **pendientes**; no inventar cumplimiento.

Comparar antes/después de cambios. Repetir solo cuando haya modificaciones o regresiones relevantes. El objetivo de mapa puede ser distinto del de paneles, pero ambos deben medirse.

## API, web e imágenes

Consultas geográficas acotadas, índices medidos, caché con invalidación, paginación, selección de campos y pool controlado. Medir p50/p95/p99, errores, PostgreSQL/Redis, CPU y memoria.

Next.js: limitar JS cliente, cargar mapa cuando proceda, fotos dimensionadas y evitar waterfall. Medir Core Web Vitals y tiempo de compra. SLO de API, cargas y tráfico esperado pendientes; 4 vCPU/8 GB no acreditan una cantidad de usuarios.

No existen benchmarks ni mediciones de Foodtrucks en este paquete.

## Marketing, Core Web Vitals y anuncios

U08 prioriza páginas públicas de búsqueda, vendedor y menú. [Doc32](32-seo-local-nextjs.md) define baseline, CWV y separación laboratorio/campo; Lighthouse no acredita rendimiento de todos los usuarios ni ranking. Cargar mapas y scripts cuando corresponda, evitar requests duplicadas y medir imágenes, fuentes, bundles y renderizados.

AdSense/AdMob se prueban con inventario/IDs de prueba y flags, antes de habilitar producción. Comprobar CLS/latencia, memoria/batería, gestos y flujo de pedido con/sin publicidad cuando se adopte. Un cambio que degrade compra o el objetivo nativo se revierte; no se compensan errores con impresiones. [Monetización](33-monetizacion-adsense-admob.md). Los targets/umbrales se evalúan con medidas; siguen sin existir benchmarks Foodtrucks.

## QA de carga y observabilidad

Probar carga acotada únicamente en un entorno autorizado y aislado, con datos ficticios y efectos externos test/sink. Medir p50/p95/p99, errores y recursos junto a la experiencia de compra; no lanzar carga intensiva sobre casa/producción para cumplir un checklist. [QA](40-testing-qa-github.md).

Reservar recursos/retención de Prometheus/Grafana/Sentry según modalidad y capacidad doméstica. Métricas web/backend no acreditan 120 FPS: sigue siendo necesario release/dispositivo real. SLO/umbral ejemplar, incluida disponibilidad 99,9 %, no es un compromiso cerrado. [Observabilidad](41-observabilidad-grafana-prometheus-sentry.md), [costes](37-costes-presupuesto.md).
