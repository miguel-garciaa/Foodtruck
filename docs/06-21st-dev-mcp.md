# Evaluación y uso de 21st.dev MCP

## Estado real

La conversación realizó una **selección preliminar** de referencias públicas. No afirmó haber inspeccionado exhaustivamente todo el catálogo ni haber auditado el código mediante MCP. Este paquete tampoco acredita esa auditoría, una conexión autenticada al MCP o pruebas de los componentes en Foodtrucks.

El tamaño del catálogo mencionado en la conversación era una referencia temporal; no se usa como cifra vigente ni como cobertura de revisión.

## Inventario procedente de C09

Todos los enlaces de esta tabla son referencias de la conversación; disponibilidad, licencia y código actual **pendientes de reverificación**.

| Referencia | Uso previsto y estado |
| --- | --- |
| [Process Timeline — shadcnui-blocks](https://21st.dev/@shadcnui-blocks/components/timeline-05) | Base preliminar seleccionada para estados; revisar código |
| [Notification Stack — ppramanik62](https://21st.dev/@ppramanik62/components/notification-stack/grouped-by-source) | Base preliminar para web; gestos nativos a adaptar |
| [MarkerTooltip — mapcn](https://21st.dev/@mapcn/components/mapcn-marker-tooltip) | Referencia visual; la conversación indica MapLibre, no integrar como Mapbox sin adaptación |
| [Minimal Dock — jatin-yadav05](https://21st.dev/@jatin-yadav05/components/minimal-dock) | Referencia móvil a adaptar; uso web descartado por C10 |
| [BeUI Dynamic Island — starc007](https://21st.dev/@starc007/components/be-ui-dynamic-island) | Simulación visual dentro de la app; no sustituye ActivityKit |
| [Sign In Form — Ruixen](https://21st.dev/@ruixen.ui/components/sign-in-form) | Candidato para login |
| [Expandable Search Bar — arunachalam](https://21st.dev/@arunachalam/components/expandable-search-bar) | Candidato para búsqueda |
| [Segmented Control — ddoemonn](https://21st.dev/@ddoemonn/components/segmented-control) | Candidato para filtros |
| [Product Card — PrebuiltUI](https://mcp.21st.dev/@prebuiltui/components/cards/product-card) | Referencia original de tarjeta; dominio/enlace a verificar |
| [Checkout Form — Ruixen](https://news.21st.dev/@ruixen.ui/components/checkout-form) | Resumen de compra; no sustituye campos seguros Stripe |
| [Onboarding Wizard — cnippet-dev](https://21st.dev/@cnippet-dev/components/v-form-8) | Candidato para alta |
| [Theme Switcher — Chánh Đại](https://21st.dev/@ncdai/components/theme-switcher-1) | Candidato web para apariencia |
| [Order Tracking Parallax Card — Ruixen](https://21st.dev/@ruixen.ui/components/order-tracking-parallax-card) | Referencia de seguimiento; eliminar parallax de cursor en móvil |

## Compatibilidad

21st anuncia soporte de publicación React Native/Expo en su [changelog](https://21st.dev/changelog), consultado el 14 de octubre de 2026. Ese soporte no convierte cada recurso web en nativo: clasificar cada candidato por su runtime/código y SDK reales. React web, HTML, CSS, Tailwind y animaciones dependientes del DOM no se importan directamente en React Native. Reutilizar código compatible en Next.js; recrear diseño/gestos nativos con Reanimated y Gesture Handler cuando proceda.

No introducir MapLibre para aprovechar un tooltip, ni una WebView como sustituto automático de la experiencia nativa. Evaluar cada dependencia por beneficio real.

## Conexión futura

La [guía oficial de 21st MCP](https://github.com/21st-dev/magic-mcp/blob/main/llms-install.md) documenta el endpoint HTTP https://21st.dev/api/mcp y autenticación mediante x-api-key. Documenta también que 21st MCP sustituye a Magic MCP. La configuración concreta depende del cliente y su versión; consultar la guía vigente al conectarlo.

Guardar la clave en configuración privada del cliente o un gestor de secretos. No incluir claves en AGENTS.md, ejemplos versionados, capturas o logs. No reutilizar indiscriminadamente JSON de Android Studio como configuración Codex.

La instalación, cuenta, permisos, herramientas y generación disponible siguen pendientes. Enumerar herramientas ofrecidas tras conectar; no asumir nombres antiguos ni que todas las capacidades estén incluidas en la cuenta.

## Proceso antes de construir pantallas

1. Buscar por necesidades del flujo: ficha, búsqueda, filtros, checkout, estados, onboarding y tema.
2. Recuperar código de candidatos y registrar autor/enlace/versión o hash/licencia.
3. Revisar accesibilidad, claro/oscuro, responsive, dependencia de ratón y coste de render.
4. Comparar candidatos por adecuación, simplicidad, mantenimiento y adaptación nativa.
5. Probar el seleccionado en el contexto de Foodtrucks.
6. Registrar decisión y límites; un componente “seleccionado” puede seguir pendiente de prueba.

Plantilla propuesta del registro: pantalla; candidato; procedencia; fecha; licencia comprobada; dependencias; plataformas; pruebas de ambos temas; accesibilidad; rendimiento; adaptaciones; decisión y motivo.

La evaluación será por funcionalidad y con cobertura declarada, sin afirmar auditoría total.

## Evaluación adicional para la membresía

Evaluar candidatos de tarjetas de plan/beneficios, ofertas, saldo y movimientos solo cuando aporten valor. La ampliación v1.8 incorpora candidatos concretos de tarjeta de plan, ofertas y movimientos en el [catálogo frontend](45-catalogo-21st-frontend.md); selección final/licencia/código y pruebas siguen pendientes por recurso.

Aplicar el mismo registro de licencia, código, accesibilidad, temas y adaptación nativa. Un componente de pricing no decide periodicidad, condiciones ni canal permitido de cobro móvil.

## Catálogo ampliado v1.8 y niveles de evidencia

[45. Frontend de app](45-catalogo-21st-frontend.md) registra ocho nuevos candidatos de filtros/carrito/membresía/ofertas/puntos/estados; [46. Administración](46-panel-admin-negocios-suscripciones.md) registra ocho piezas de tabla/navegación/ficha/confirmación/facturación/estados, además de referencias para dashboard/calendario. Las trece referencias C09 de arriba se conservan como historial preliminar; no se atribuye una reverificación completa nueva a ese grupo.

La investigación previa usó páginas públicas y una lectura WebMCP del sitio; esto no es una conexión autenticada al servidor MCP ni una instalación. Component.tsx de algunas fichas pidió login/desbloqueo. En esta ampliación cada documento identifica la evidencia realmente obtenida y las limitaciones; no se consumieron compras/desbloqueos de pago ni se solicitaron claves. Licencia declarada en ficha y archivo de licencia cotejado son estados distintos; snippet de uso tampoco es código completo auditado.

Las cinco capturas se incluyen en docs/assets/referencias-ui como **referencias aportadas por el usuario**, no como resultados de la app ni decisiones de funcionalidades. Novedades/onboarding/permisos se documentan en [47](47-novedades-onboarding-permisos.md). Autor/componente exacto de una imagen sin identificación permanecen pendientes. Mantener registro de URL/fecha/runtime/dependencias/licencia/version o hash si se recuperó fuente, adaptación y aceptación antes de copiar código.

No integrar un sistema UI completo por un indicador de pasos, un mapa distinto por un tooltip o un flujo Stripe simulado por una tarjeta de Billing. Usar guías de diseño/Expo y controles nativos compatibles por necesidad; todos los checks de tema, a11y, rendimiento y builds siguen por demostrar en Foodtrucks.
