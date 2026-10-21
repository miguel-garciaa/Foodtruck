# Mapbox nativo y web

**Cerrado:** Mapbox para personalizar el mapa. Negocios y ubicaciones de Foodtrucks proceden de PostgreSQL/PostGIS.

## Integraciones

Móvil: @rnmapbox/maps sobre SDKs nativos. Requiere development build, no Expo Go. La integración React Native es comunitaria y su soporte/compatibilidad debe comprobarse al fijar versiones. [Mapbox sobre frameworks híbridos](https://docs.mapbox.com/help/dive-deeper/mobile-apps/), [instalación del wrapper](https://rnmapbox.github.io/docs/install).

Web: Mapbox GL JS en Next.js, cargado en cliente y con lifecycle limpio. [Guía de inicio](https://docs.mapbox.com/mapbox-gl-js/guides/get-started/).

## Identidad cartográfica

Mapbox Studio para dos estilos propuestos:
- Foodtrucks Light Map: crema, calles claras, parques suaves y puestos contrastados.
- Foodtrucks Dark Map: azul noche, detalle secundario discreto y puestos visibles.

Compartir identidad y URLs de estilo cuando sean compatibles, no prometer equivalencia perfecta entre versiones de SDK. Estilos, iconos y URLs definitivos pendientes de creación; no existen recursos Mapbox publicados para este proyecto.

Conservar atribución y opciones de privacidad/telemetría exigidas. El dock/panel inferior nunca debe taparlas.

## Datos y render

Consultar bbox/zoom o radio acotados, filtros y límite. Cancelar solicitudes de áreas anteriores; aplicar debounce al movimiento. No refrescar React por cada cambio de cámara.

Representar puestos con fuentes GeoJSON, SymbolLayer/CircleLayer y clustering. Reservar componentes visuales React para selección activa. No dibujar cientos de tarjetas como marcadores independientes.

Backend entrega campos mínimos: ID, posición pública, nombre, categoría, estado y referencia de foto. Ficha/carta detalladas se piden al abrir. No enviar coordenadas de usuarios ni información interna del negocio.

## Ubicaciones operativas

Publicación manual o GPS del comerciante con consentimiento. Mantener vigencia y fecha de actualización, sin rastreo continuo como requisito.

Filtrar ubicación activa, horarios, aceptación de pedidos, acceso comercial y Connect cuando corresponda. Revalidar al comprar, porque la caché puede ir retrasada. Fijar el lugar de recogida en el pedido.

Próximas ubicaciones y reservas anticipadas se propusieron como evolución. Política de cambios de ubicación con pedidos activos sigue pendiente.

## Tokens y costes

Separar token público cliente de credenciales secretas de descarga/gestión si la versión las requiere. Aplicar scopes/restricciones soportados, rotación y controles de abuso. Un token público incluido en app/web es visible; no convertirlo en autorización de la API Foodtrucks.

El ejemplo histórico de 25.000 usuarios activos gratuitos no es presupuesto vigente. Medir móvil, cargas web, geocoding y otros servicios por separado; validar tarifas al contratar. No añadir Directions/Search de pago sin necesidad aprobada.

## Prueba temprana

Mapa, clusters, tarjetas, panel animado, cambios claro/oscuro, reentrada y memoria en iOS/Android/web. Incluir baja cobertura, permisos denegados y densidad alta de puestos. Objetivo de fluidez adaptativa; no garantía universal de 120 FPS.

## Google Maps y Business Profile en marketing

El prompt U08 solicita estudiar descubrimiento local, Maps Platform y Google Business Profile. Mapbox sigue decidido para web/app; no se incorpora otro SDK ni una base Places paralela sin resolver necesidad, licencias y coste. GBP pertenece al vendedor elegible y requiere datos, propiedad/autorización y ubicación válidos; aparecer en Foodtrucks no publica automáticamente un perfil Google.

La navegación externa hacia el punto de recogida puede evaluarse sin cambiar el mapa interno. No mezclar datos licenciados de Google con Mapbox o caché propia por suposición. [Estrategia y límites](32-seo-local-nextjs.md).
