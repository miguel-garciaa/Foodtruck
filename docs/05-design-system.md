# Design System: día, noche y movimiento

**Cerrado:** modo claro y oscuro en móvil y web. **Base propuesta de C09:** automático por defecto, selección persistida y estilos cartográficos correspondientes.

## Temas

**Ajuste solicitado el 23/10/2026:** opciones de menú de 15 sp y subtítulos de 13 sp, con filas de al menos 68 dp y crecimiento por accesibilidad. El emulador se devuelve a tema claro y escala 1,0 al terminar QA. La app conserva la adaptación al tema y texto del dispositivo.

**Base móvil D51 implementada, 23/10/2026:** los valores ejecutables están en `apps/mobile/src/theme.ts`: blanco limpio/coral en claro y azul noche/coral luminoso en oscuro. Búsqueda mínima 50 dp (texto 14), dock 52 dp (texto 11), ampliables con texto del sistema; acciones de al menos 48 dp. Carruseles con márgenes 24, separación 14, fotos 1,05 y radio 22. Corazón 20 dp, contorno blanco, relleno oscuro translúcido/coral, sin círculo y objetivo independiente 48 × 48. Pulsaciones personalizadas con Reanimated y movimiento reducido; sheets y navegación nativas. La tabla conceptual siguiente conserva la dirección histórica, no sustituye esos tokens.

| Token semántico | Día, dirección propuesta | Noche, dirección propuesta |
| --- | --- | --- |
| background | Marfil suave | Azul noche casi negro |
| surface | Blanco | Azul oscuro elevado |
| text.primary | Oscuro | Claro |
| text.secondary | Gris azulado con contraste suficiente | Gris claro con contraste suficiente |
| action.primary | Coral intenso | Coral luminoso |
| border | Separador sutil visible | Separador oscuro visible |
| success/warning/danger | Colores semánticos y texto/icono | Equivalentes contrastados |
| map.style | Foodtrucks Light Map | Foodtrucks Dark Map |

Estos son conceptos de paleta, **sin códigos hex definitivos**. El verde lima de la primera propuesta puede quedar como acento secundario; no convertirlo en requisito de marca.

Definir tokens de colores, fuentes, escala tipográfica, espaciados, radios, elevación y movimiento. Compartir sus valores semánticos en TypeScript; generar/adaptar variables CSS y estilos React Native. No confundir CSS/Tailwind con estilos nativos.

## Preferencia de apariencia

Tres opciones: Sistema, Día y Noche. Guardar preferencia local; sincronización de cuenta pendiente. En Sistema reaccionar a cambios del dispositivo. Restaurar la preferencia antes de mostrar la interfaz cuando sea posible.

Next.js debe evitar destellos de tema y desajustes de hidratación. next-themes fue propuesto; revisar si aporta valor frente a una solución simple antes de añadirlo. No suprimir avisos globales de hidratación para ocultar un error.

Mapbox conserva cámara, filtros y selección al cambiar el estilo; restaurar fuentes/capas cuando el SDK lo requiera.

## Componentes de Foodtrucks propuestos

Botón, campo, error de formulario, chip de categoría, tarjeta de puesto/producto, badge de estado, panel inferior, progreso del pedido, ticket QR y selector de tema. Extraer componentes por reutilización o responsabilidad real, sin fragmentar cada bloque visual.

La implementación móvil y web puede ser distinta con los mismos tokens y contratos. No exigir un único componente universal para el mapa, checkout o navegación.

## Accesibilidad

Validar contraste de cada combinación real, foco de teclado en web, semántica de formularios, etiquetas de iconos y navegación con VoiceOver/TalkBack. Como criterio propuesto: texto normal 4,5:1, texto grande y controles relevantes 3:1, conforme al objetivo WCAG AA que se deberá comprobar.

No comunicar estados solo por color. Soportar escalado de texto y áreas táctiles adecuadas. Probar mapa con alternativa de lista; un mapa no debe ser el único camino para seleccionar un puesto.

El QR debe mantener contraste y margen libres; no aplicar sombras, transparencias o decoraciones que dificulten el escaneo.

## Movimiento

Animaciones al servicio de la orientación: apertura de ficha, desplazamiento de paneles, cambio de sección, añadido al carrito y transición de estado. Preferir transformaciones y opacidad; no animar layout continuamente sin medir.

Respetar movimiento reducido, minimizar desenfoques y parallax y evitar animaciones permanentes decorativas. Definir duraciones y curvas tras probar en dispositivos; ningún valor de duración queda aprobado en este paquete.

Validar todo en ambos temas, con teclado, lector de pantalla, red lenta y dispositivos de 60/90/120 Hz.

## Componentes de membresía y fidelización

Añadir de forma proporcionada tarjeta de beneficios, estado de suscripción, saldo y movimiento de puntos, tarjeta de oferta y resumen de descuento. Reutilizar componentes existentes antes de crear nuevos.

Ambos temas deben distinguir puntos disponibles, pendientes y reservados mediante texto/iconos, con errores de canje persistentes y sin depender del color. No diseñar valores ficticios de ahorro como si fueran beneficios contractuales.

## Variantes de recursos v1.8

Mantener tokens semánticos actuales para app y administración, adaptando componentes del [catálogo](45-catalogo-21st-frontend.md) y [panel](46-panel-admin-negocios-suscripciones.md). Las demos oscuras no eliminan tema claro ni aprueban sus colores exactos. Controles consistentes: badge con texto/icono, tabla/formulario, calendario de filtros, tarjeta de novedades, indicador de página y selector de idioma con selección marcada.

Novedades: título y lista breve con iconos, acción principal y Ahora no; radios/elevación/tipografía responden a Foodtrucks. La composición azul de la captura no fija un nuevo color ni una función de voz. Permisos usan explicación neutral y alerta real del SO según plataforma, no una réplica del modal informativo. [Reglas completas](47-novedades-onboarding-permisos.md).

Calendario: etiquetas comprensibles en locale disponible, foco/teclado, día seleccionado no comunicado solo por color, rango visible y zona horaria operativa. Indicadores: página actual anunciada, acciones accesibles, sin avance automático; reducido movimiento y escalado de texto. Selector: nombres de idioma, foco y selección, sin usar país como única representación de una lengua. Idiomas/fuentes/tokens finales y pruebas reales siguen pendientes.
