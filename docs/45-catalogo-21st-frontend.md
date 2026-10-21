# Catálogo 21st.dev para el frontend de Foodtrucks

**Versión documental:** 1.8 · **Fecha de comprobación:** 14 de octubre de 2026 · **Estado:** selección adicional de referencias; implementación y pruebas de UI pendientes.

Este catálogo añade **ocho candidatos para la app React Native + Expo + TypeScript**, complementarios a las referencias de [06. Evaluación de 21st.dev](06-21st-dev-mcp.md). Los ocho candidatos web de [46. Panel de administración](46-panel-admin-negocios-suscripciones.md) completan una ampliación de 16 referencias. No es una auditoría exhaustiva del catálogo ni una selección final de dependencias.

El resultado implementado aquí es documentación. No se han construido pantallas, instalado paquetes, ejecutado builds móviles o conectado una cuenta al MCP de 21st.dev. Una ficha disponible, un ejemplo indexado y una licencia declarada son evidencias diferentes de código completo recuperado, revisión de seguridad y pruebas en Foodtrucks.

## 1. Identidad y límites que se conservan

- Foodtrucks mantiene identidad propia, fotografía y mapa como contenido central. Las referencias orientan jerarquía e interacción; no se copian marcas, fotografías, textos comerciales o datos de sus demos.
- Claro y oscuro son requisitos. Marfil, coral y azul noche siguen como dirección propuesta de [05. Design System](05-design-system.md), sin hexadecimales o tipografías definitivos. Usar tokens semánticos compartidos y estilos adecuados a cada plataforma.
- Dock inferior únicamente en la app nativa; Next.js conserva header y menú responsive, también en navegador móvil. No añadir destinos al dock solo porque una referencia los muestre.
- Mapbox permanece como mapa nativo/web. No introducir MapLibre para reutilizar MarkerTooltip ni reemplazar la experiencia nativa por una WebView.
- Flujos cliente/comerciante: carta, alérgenos, disponibilidad, encargo, pago, preparación y recogida con QR. No incorporar reparto, nuevas operaciones de reembolso o reglas comerciales a partir de las demos.
- Membresía cliente de **5,99 €/mes en EUR**, confirmada. Impuestos, beneficios concretos, equivalencia/caducidad de puntos, financiación y canal permitido de contratación móvil pendientes en [25. Membresía](25-suscripcion-clientes-fidelizacion.md) y [23. Decisiones](23-decisiones-pendientes.md).
- Google Ads conserva la referencia de **400 al mes pendiente**. DEV/PROD continúan en el servidor doméstico; este catálogo no modifica alojamiento, cuentas o presupuesto.

Se conservan las referencias anteriores de búsqueda, Segmented Control, Product Card, Process Timeline, Minimal Dock, login, onboarding y seguimiento de [06](06-21st-dev-mcp.md). Su presencia previa no acredita reverificación de su código o licencia en esta ampliación. Fichas de puesto/producto, navegación y ticket QR siguen el flujo de [04. UX/UI](04-ux-ui.md) y [08. Frontend](08-frontend.md).

## 2. Qué se ha comprobado

El [changelog oficial de 21st.dev](https://21st.dev/changelog), entrada del 4 de junio de 2026, anuncia soporte para publicar componentes React Native/Expo. Por tanto, no se clasifica todo el catálogo como web. **Cada componente debe comprobarse individualmente.** Los ocho candidatos de este documento muestran usos web con DOM o tienen fuente web comprobada; ninguno queda acreditado como componente nativo listo para importar.

| Evidencia | Significado y límite |
| --- | --- |
| Ficha pública | Se comprobó disponibilidad, nombre, autor y descripción. No significa haber ejecutado su preview o inspeccionado todos sus estados. |
| Ejemplo de uso | Se consultó el fragmento público de Usage.tsx o su equivalente. No es la implementación completa de Component.tsx. |
| Licencia declarada | La ficha contiene un bloque License con MIT. Falta cotejar el artefacto exacto que se incorporaría y sus dependencias/recursos. |
| Fuente upstream consultada | Se leyó un archivo público completo y se fijó su revisión/hash. Solo aplica aquí a Transaction List; no acredita identidad con la versión de 21st ni una auditoría del repositorio. |
| Validación Foodtrucks | Integración, pruebas de comportamiento, accesibilidad, ambos temas y mediciones. **Pendiente para todos los candidatos.** |

Las ocho URL se comprobaron de nuevo el **14/10/2026**. El lector web pudo consultar seis fichas. Para Food Preference Checkbox Groups y Shopping Cart Sheet, la lectura falló y se verificó su HTML público mediante una petición HTTP sin autenticación: ambas devolvieron 200 y el título/h1 esperado; se consultaron los metadatos y el ejemplo de uso público. Esto no desbloquea ni acredita el código completo. No se empleó el MCP autenticado de 21st ni se eludieron controles de acceso.

## 3. Ocho candidatos adicionales de la app

**Prioridad de evaluación, propuesta:** P0 sirve a los primeros flujos operativos y estados básicos; P1 completa membresía/ofertas/puntos y necesita cerrar sus reglas antes de publicar mensajes o acciones comerciales. P1 no excluye la membresía solicitada ni decide su fecha de lanzamiento.

| ID / prioridad | Necesidad y referencia | Motivo para Foodtrucks | Adaptación nativa | Evidencia del 14/10/2026 |
| --- | --- | --- | --- | --- |
| A01 · P0 | Filtros: [Food Preference Checkbox Groups — Cnippet](https://21st.dev/@cnippet-dev/components/v-checkbox-group-15) | Separa cocina y preferencias dietéticas, complementando los filtros rápidos existentes. | Grupos táctiles con estado seleccionado legible y accesible. Evaluar si seleccionar todas las opciones aporta valor. Un filtro dietético no certifica ausencia de alérgenos. | Ficha/HTML público y ejemplo DOM consultados; MIT en el bloque License de la ficha. Componente completo y licencia del artefacto pendientes. |
| A02 · P0 | Carrito: [Shopping Cart Sheet — Cnippet](https://21st.dev/@cnippet-dev/components/v-sheet-5) | Cantidades, subtotal y continuación desde la carta sin perder contexto. | Pantalla, modal o sheet nativo según espacio y navegación; mantener visibles recogida, cambios de stock y total confirmado. | Ficha/HTML público y ejemplo DOM consultados; declara lucide-react. Sin licencia visible en la ficha consultada; código completo pendiente. |
| A03 · P1 | Membresía: [Pricing Plan Card — Cnippet](https://21st.dev/@cnippet-dev/components/v-card-18) | Un plan con beneficios y una acción clara evita una tabla SaaS innecesaria. | Tarjeta de 5,99 €/mes, estado y condiciones reales. Quitar “Most Popular” si no hay comparación y no anunciar beneficios pendientes. | Ficha y ejemplo DOM consultados; declara lucide-react. Licencia y componente completo pendientes. |
| A04 · P1 | Ofertas: [Offers Carousel — LaviKatiyar](https://21st.dev/@lavikatiyar/components/offers-carousel) | Oferta destacada y promociones relacionadas con descripción/precio. | Lista horizontal con acceso a todas las ofertas; preferir lista simple si el carrusel oculta condiciones. Vigencia y elegibilidad proceden del servidor. | Ficha, props del ejemplo web y dependencias lucide-react/framer-motion consultadas. Sin licencia visible; componente completo pendiente. |
| A05 · P1 | Puntos e historial: [Transaction List — Hari Lamichhane / Animata](https://21st.dev/@hari/components/transaction-list) | Fila resumida que abre el detalle del movimiento. | Historial nativo paginado/virtualizado cuando crezca, con signo +/−, origen, fecha y estado; saldo autoritativo del servidor. | Ficha y ejemplo DOM consultados. Fuente upstream completa y licencia MIT del repositorio leídas a la revisión registrada abajo. La versión exacta de 21st no se ha cotejado. |
| A06 · P0 | Vacío: [Empty / No results — Cnippet](https://21st.dev/@cnippet-dev/components/cnippet-empty/no-results) | Explica búsqueda sin resultados, favoritos vacíos o ausencia de movimientos. | Reutilizar estructura de título, explicación y acción. Distinguir primer uso de filtros sin coincidencias y ofrecer limpiar filtros cuando corresponda. | Ficha/ejemplo DOM consultados; declara class-variance-authority/lucide-react. MIT declarada en ficha; componente completo pendiente. |
| A07 · P0 | Carga: [Product Grid Skeleton — Cnippet](https://21st.dev/@cnippet-dev/components/v-skeleton-11) | Conserva la estructura del catálogo/carta hasta recibir datos. | Placeholders nativos que coincidan con el contenido real; shimmer opcional, acotado y desactivable con movimiento reducido. | Ficha y ejemplo DOM consultados. Licencia, implementación y dependencias completas pendientes. |
| A08 · P0 | Error recuperable: [Error Alert — Cnippet](https://21st.dev/@cnippet-dev/components/v-alert-7) | Aviso persistente cerca de un fallo de carta, ofertas, puntos o edición comercial. | Texto/icono y reintento apropiado, anunciado al lector de pantalla. Conservar contenido válido y no esconder errores económicos en un toast. | Ficha/ejemplo DOM consultados; declara lucide-react. MIT declarada en ficha; componente completo pendiente. |

Las dependencias de las fichas son **metadatos observados**, no una lista auditada del árbol de instalación. No se instalan lucide-react, Framer Motion, Motion o Radix en Expo para reproducir un aspecto. Consultar primero un equivalente nativo de `@expo/ui` para controles, menús y sheets, conforme a la skill expo-ui, verificando el SDK y soporte real de ambas plataformas. Para catálogos largos, una lista nativa de filas agrupadas no sustituye una lista virtualizada. No fijar versiones hasta inspeccionar el proyecto real.

### Fuente comprobada de Transaction List

21st atribuye la ficha a Hari Lamichhane / Animata. La [documentación upstream fijada](https://raw.githubusercontent.com/codse/animata/36674e4e9cfdc0f237693d8b736a2bf41065ca1d/content/docs/list/transaction-list.mdx) acredita a Prince Yadav como creador del componente. Se conserva esa distinción de autoría.

| Archivo público leído | Revisión fijada | SHA-256 de los bytes obtenidos |
| --- | --- | --- |
| [animata/list/transaction-list.tsx](https://raw.githubusercontent.com/codse/animata/36674e4e9cfdc0f237693d8b736a2bf41065ca1d/animata/list/transaction-list.tsx) | 36674e4e9cfdc0f237693d8b736a2bf41065ca1d | fbea3a0d04df437689ff608bf3732248286bac97ce899ca5b408d74b211e8c5c |
| [LICENSE.md](https://raw.githubusercontent.com/codse/animata/36674e4e9cfdc0f237693d8b736a2bf41065ca1d/LICENSE.md) | Misma revisión | ff78804659cbc28380d087cae79c494f243f8ef22b1e2ac5ec119b5de9314f05 |

Lectura estática acotada: DOM/Tailwind, Motion, ancho fijo y colores directos requieren adaptación. El importe pierde el signo al mostrarse: para puntos debe distinguir crédito y canje. El cierre necesita etiqueta accesible; revisar movimiento reducido y tamaños táctiles. La ficha 21st declara framer-motion y la fuente fijada usa motion/react; no se presupone equivalencia de versiones. La MIT leída exige conservar avisos aplicables; no acredita derechos sobre logos u otros recursos. No se ejecutó, auditó el repositorio ni midió rendimiento.

### Descartes razonados

- [Order tracking — Javi](https://21st.dev/@javierdev0/components/order-tracking): la demo consultada en la selección preliminar incluye envío/reparto. Process Timeline ya cubre el patrón necesario de preparación y recogida; no añadir estados de delivery. La licencia/código de este descarte no se reverificaron el 14/10.
- [Chip Group — kuratlielia](https://21st.dev/@kuratlielia/components/chip-group): en la lectura preliminar su registro web incluía medición DOM y ResizeObserver para animar chips. Mantener la idea de selección visible, con controles nativos sencillos; no portar esa mecánica completa. Fuente/licencia del descarte pendientes de nueva comprobación antes de cualquier uso.

## 4. Aplicación a cliente y comerciante

| Área | Uso de referencias y límites |
| --- | --- |
| Descubrimiento/mapa | Conservar búsqueda, chips rápidos, fichas y dock de 06. A01 aporta filtros detallados. Mapbox y alternativa de lista comparten selección sin duplicar consultas innecesarias. |
| Carta/producto | Conservar tarjetas y jerarquía actuales. Mostrar disponibilidad, precio y alérgenos del negocio; los filtros nunca sustituyen esa información. A07 y A08 cubren carga/fallo. |
| Compra/recogida | A02 organiza el resumen; importes/stock/recogida se confirman con Go. Checkout de 06 no sustituye PaymentSheet. Progreso de preparación y QR permanecen separados del estado de pago. |
| Membresía/ofertas/puntos | A03–A05 organizan presentación y movimientos. El cliente no concede beneficios tras una redirección, calcula saldo gastable ni decide un descuento. |
| Comerciante | Reutilizar campos, listas, estados vacíos/carga/error para carta y disponibilidad. Cambiar estado de pedido o canjear QR exige negocio autorizado y confirmación del servidor. No habilitar canje offline. |
| Administración/web | Header y navegación contextual conforme a 46; no reutilizar el dock nativo ni convertir la app en una WebView administrativa. |

No cargar demos externas ni imágenes de los autores dentro del producto. Revisar dependencias, URLs, llamadas de red, licencias y recursos antes de incorporar código. No exponer claves de 21st, Stripe secretas o credenciales en frontend; no registrar QR, sesiones o datos de tarjeta en analytics/logs. UI oculta y botón deshabilitado no sustituyen autorización/idempotencia del backend. Estas son obligaciones de integración, no hallazgos de una auditoría ejecutada.

Las cinco imágenes aportadas se conservan como referencias visuales en el paquete: [dashboard](assets/referencias-ui/01-dashboard.png), [calendario](assets/referencias-ui/02-calendar.png), [novedades](assets/referencias-ui/03-whats-new.png), [pasos](assets/referencias-ui/04-step-indicators.png) y [selector de idioma](assets/referencias-ui/05-language-selector.png). No son pantallas implementadas o diseños aprobados. El selector de idioma no aprueba idiomas/territorios; la sección nueva de novedades, onboarding y permisos se especifica en [47](47-novedades-onboarding-permisos.md), sin duplicarla aquí.

## 5. Matriz futura de 20 pantallas y estados

Esta matriz organiza **pruebas futuras propuestas** sobre los flujos existentes. No acredita 20 pantallas construidas, diseños finales o UI probada. Las agrupaciones se convertirán en rutas concretas al diseñar la app; no fuerzan pantallas adicionales. Integrar su ejecución en [40. Testing/QA](40-testing-qa-github.md) y [44. Política de cambios](44-politica-commits-ci-cd-tests.md).

| ID | Pantalla o flujo | Comportamiento significativo que deberá probarse |
| --- | --- | --- |
| N01 | Acceso email/Google/Apple | Campos inválidos, cancelación OAuth, fallo de red, envío pendiente y recuperación segura del contexto. |
| N02 | Registro/verificación | Errores del servidor, verificación pendiente/expirada y prevención de doble envío. |
| N03 | Recuperación de acceso | Feedback sin enumerar cuentas; enlace inválido/expirado y reintento acotado. |
| N04 | Explorar/listado | Carga, resultados, vacío, fallo con datos previos, paginación y fotografías ausentes. |
| N05 | Búsqueda/filtros | Selección múltiple, limpiar filtros, cero coincidencias y respuesta tardía sin reemplazar una búsqueda nueva. |
| N06 | Mapa/alternativa de lista | Ubicación denegada, mapa no disponible, selección, cambio de tema conservando cámara y acceso mediante lista. |
| N07 | Ficha de puesto | Negocio inexistente/no disponible, ubicación/horario vigentes y recuperación de errores. |
| N08 | Carta | Carga, carta vacía, categorías, productos agotados y actualización de disponibilidad. |
| N09 | Detalle de producto | Precio, alérgenos visibles, límites de complementos cuando se aprueben y cambio de stock antes de añadir. |
| N10 | Carrito | Vacío, cantidades límite, producto retirado y revisión del total devuelto por Go. |
| N11 | Checkout/pago | Cancelación/fallo Stripe, doble toque, pérdida de red y resultado confirmado desde Go. |
| N12 | Historial de pedidos | Vacío, paginación, fallo recuperable y protección frente a pedidos de otra cuenta. |
| N13 | Pedido activo/seguimiento | Preparación/listo/recogido, desconexión y reconexión; ninguna llegada de repartidor o ETA inventada. |
| N14 | Ticket QR | Legibilidad en ambos temas, token no válido/canjeado y estado actualizado desde servidor; no QR en logs/capturas de QA. |
| N15 | Perfil/apariencia | Sistema/Día/Noche, persistencia, cierre de sesión y texto ampliado sin controles solapados. |
| N16 | Membresía/gestión | Estado pendiente/activo/inactivo según contrato final; renovación/condiciones y resultado recuperado tras contratación. |
| N17 | Ofertas | Vacío, expirada/no elegible, condiciones completas y acceso sin depender de autoplay. |
| N18 | Puntos/movimientos/canje | Saldo y signos correctos, vacío, reservado/pendiente y conflicto de canje concurrente resuelto por Go. |
| N19 | Comerciante: carta/disponibilidad | Editar/guardar pendiente, rechazo de validación, actualización fallida y acceso a negocio ajeno denegado. |
| N20 | Comerciante: pedidos/recogida QR | Transición permitida/prohibida, doble escaneo, permiso de cámara denegado y confirmación atómica del canje. |

En cada pantalla aplicable: ambos temas, lector de pantalla, escalado de texto, foco/orden lógico, texto/icono además de color, áreas táctiles adecuadas, teclado y zonas seguras. Para listados/mapa/animación: dispositivo real en release, memoria, fluidez y redes lentas; probar 60/90/120 Hz según hardware. El objetivo de 120 FPS es adaptativo, **no un resultado medido**. Respetar movimiento reducido y evitar carga/vacío/error intercambiables.

## 6. Gate antes de incorporar un componente

1. Confirmar necesidad y equivalente nativo; reutilizar componentes propios antes de añadir una dependencia.
2. Recuperar legalmente el código completo del candidato elegido, fijar versión/commit/hash y cotejar licencia, autoría, dependencias y recursos. Las etiquetas MIT de este catálogo no cierran esta tarea.
3. Revisar contratos, acciones, accesibilidad, datos externos y comportamiento bajo error; mantener precios, permisos, pagos y QR bajo autoridad del servidor.
4. Implementar en el SDK/proyecto real con tokens Foodtrucks. No asumir que render web responsive equivale a compatibilidad React Native.
5. Ejecutar pruebas pertinentes de interacción, estados, ambos temas, accesibilidad y rendimiento; registrar dispositivo/build/revisión y limitaciones.
6. Actualizar la decisión con evidencia: adoptado, adaptado o descartado. No declarar selección final a partir de una ficha o preview.

**Skills consultadas para esta ampliación:** frontend-design para identidad y simplicidad; expo-overview para separar rutas de trabajo y SDK real; expo-ui para priorizar controles nativos cuando sean compatibles. Se leyeron sus entradas, sin instalar librerías ni ejecutar sus comandos.

**Comprobaciones de esta entrega documental:** disponibilidad/metadatos de las ocho fichas; anuncio oficial de soporte nativo; lectura estática de la fuente upstream de A05 y licencia MIT a revisión fijada; hashes de fuente/licencia; revisión de coherencia y enlaces locales. **Pendiente:** Component.tsx y licencia exacta de los otros siete candidatos, correspondencia A05 con 21st, accesibilidad/rendimiento/integración de todos y aplicación/MCP/CI reales. Un hash identifica bytes; no demuestra seguridad o calidad.
