# UX/UI y navegación

## Dirección de producto

Inspiración explícita: Airbnb para fotografías, jerarquía, búsqueda y fichas; Glovo para estados y avisos oportunos. Foodtrucks tendrá identidad propia y un mapa personalizado como elemento central. No copiar logotipos, recursos gráficos ni diseños protegidos.

La dirección propuesta es minimalista, fotográfica, cálida en modo día y sobria en modo noche. Evitar efectos que distraigan de comprar o recoger.

**Primera implementación, 21/10/2026:** la app cliente en `apps/mobile` adapta las capturas aportadas a búsqueda, categorías, tarjetas fotográficas, colección de favoritos, carta, Perfil, preferencias y ayuda. Después de cerrar la base inicial se consultaron las secciones principales de Airbnb en la pestaña indicada, sin modificar la cuenta. Se conservan el dock nativo y los tokens provisionales de Foodtrucks. La [guía móvil](../apps/mobile/README.md) y la [revisión visual](../apps/mobile/design-qa.md) distinguen lo comprobado en Pixel_10 de las integraciones pendientes. Las imágenes y negocios son ilustrativos; no son establecimientos publicados.

## Separación definitiva de navegación

| Superficie | Navegación |
| --- | --- |
| App nativa iOS/Android | Dock inferior flotante y animado |
| Next.js escritorio | Header horizontal y menús; sin dock |
| Next.js en navegador móvil | Header y menú responsive; sin dock |
| Panel comerciante/admin web | Header y navegación contextual; sidebar si se justifica |

**El dock pertenece exclusivamente a la app nativa.** No introducirlo en web al reducir el ancho de pantalla. La corrección C10 sustituye al candidato inicial “Minimal Dock para web”.

Se propusieron Explorar, Mapa, Pedidos y Perfil como destinos del dock; etiquetas y orden finales se validarán con el diseño. Respetar zonas seguras, teclado, lectores de pantalla y ausencia de solapamiento con la tarjeta del pedido activo.

## Pantallas priorizadas

| Pantalla | Información y acción principal |
| --- | --- |
| Explorar | Fotografías, categorías, búsqueda y acceso al mapa |
| Mapa | Puestos visibles, agrupación, ficha inferior y carta |
| Food truck | Identidad, ubicación, horarios, fotos y carta |
| Producto | Precio, disponibilidad, alérgenos y complementos aprobados |
| Carrito/checkout | Resumen, punto/hora de recogida, total y Stripe |
| Seguimiento | Estado fiable, ETA orientativa y acción de ver QR |
| Ticket | QR legible, negocio, lugar y estado de entrega |
| Perfil | Cuenta, sesiones, apariencia y permisos |
| Comerciante | Alta, ubicación, carta, pedidos y suscripción |
| Administración | Altas, incidencias y acciones auditadas |

## Seguimiento

Tarjeta compacta del pedido activo dentro de la app, expandible al seguimiento completo. Su posición debe convivir con el dock. Mostrar “preparando” o “listo para recoger”; no simular llegada de un repartidor.

Las estimaciones son orientativas, no promesas. Si no existe cálculo, decirlo sin inventar minutos. Push y Live Activities son superficies complementarias; siempre permitir recuperar el estado desde API.

## Estados de interfaz

Diseñar por pantalla: carga, éxito, vacío, error recuperable, sin conexión, permiso denegado y acción pendiente. Preservar carrito al volver del login cuando sea seguro. Bloquear acciones duplicadas y explicar los reintentos.

Antes de pagar mostrar ubicación y horario, cantidades, alérgenos y total calculado. No esconder errores en avisos fugaces ni mostrar un éxito antes de confirmarlo.

## Diseño previo a implementación

El usuario pidió evaluar 21st.dev antes de construir las pantallas. Completar el inventario por funcionalidad, revisar código/licencia y contrastar ambos temas. Prototipos técnicos para comprobar Mapbox y fluidez son compatibles con esta secuencia; no presentarlos como diseño final aprobado.

No existen todavía pantallas implementadas, diseños Figma aprobados ni tokens finales.

## Experiencia de suscripción y puntos

Diseñar beneficios y contratación transparente, estado de membresía, ofertas con condiciones, saldo/movimientos y canje en checkout. Mostrar renovación/cancelación y evitar ahorro garantizado o urgencia ficticia.

Mantener dock solo nativo/header web. Propuesta: acceso desde Perfil y sección de ofertas, sin añadir pestañas innecesarias. La compra estándar sin plan es propuesta pendiente de validar. Precio confirmado **5,99 €/mes**; impuestos y condiciones pendientes. [Flujo ampliado](25-suscripcion-clientes-fidelizacion.md).

## Páginas para campañas

Diseñar la página cliente alrededor de puestos/carta/recogida y la comercial alrededor de alta y operación del negocio. Cada anuncio debe coincidir con el contenido y la acción real del destino; no publicar tarifas comerciales ilustrativas, descuentos sin reglas ni falsas reseñas.

Mantener ambos temas, header web, accesibilidad y carga rápida. Evaluar 21st.dev como en el resto del frontend antes de construir estos destinos. [Plan](27-marketing-google-ads.md).

## Recursos visuales y flujos de la ampliación v1.8

[Catálogo frontend](45-catalogo-21st-frontend.md), [panel del propietario](46-panel-admin-negocios-suscripciones.md) y [novedades/permisos](47-novedades-onboarding-permisos.md) registran selección y comportamiento. Las cinco capturas son ejemplos; la identidad actual continúa como dirección y los tokens/diseños finales siguen pendientes. Dashboard orienta composición, calendario filtra periodos, tarjeta comunica cambios, puntos indican página y selector muestra idioma activo. Cada autor/licencia/código se verifica por recurso, sin atribuir la misma procedencia a todas las imágenes.

Panel: header, sidebar colapsable donde ayude, Inicio/Negocios/Suscripciones/Incidencias/Actividad, tablas y ficha contextual; sin dock en navegador móvil. Diferenciar propietario administrador de comerciante. Los controles de revisión/suspensión piden confirmación/motivo y mantienen estado pendiente/error hasta respuesta autorizada; no muestran éxito ficticio.

App: novedades relevantes una vez por actualización, accesibles después desde Perfil y presentadas en un momento seguro; no interrumpir compra, pago, pedido o QR. Indicadores de página solo cuando haya varias, sin autoplay y con alternativa a gestos. La tarjeta informativa no solicita ni concede permisos.

Ubicación, avisos, cámara y fotos se explican al usar la función y se tramitan con el SO; búsqueda manual, seguimiento en app y recursos disponibles sobreviven al rechazo. No encadenar peticiones en el arranque. Separar onboarding opcional, Novedades, preaviso contextual y diálogo de autorización del sistema. El selector de idioma ilustra el patrón, sin idiomas o países definitivos.
