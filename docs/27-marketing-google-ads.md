# Marketing digital y plan inicial de Google Ads

**Confirmado:** el usuario quiere planificar **Google Ads para captar clientes y negocios**. U08 añade SEO/ASO, medición y evaluación independiente de AdSense/AdMob; este documento conserva el circuito de adquisición. **Estado:** propuesta previa al lanzamiento; en este trabajo no se han conectado cuentas publicitarias ni creado/activado campañas o anuncios; no hay presupuesto aprobado. Fuentes oficiales consultadas el 13 de octubre de 2026.

La estrategia debe acompañar al [MVP](01-producto-mvp.md): descubrir comida cercana, encargar, pagar y recoger mediante QR. La [membresía](25-suscripcion-clientes-fidelizacion.md) cuesta **5,99 €/mes**, pero impuestos, participación de negocios y reglas de puntos/descuentos siguen pendientes. No anunciar ahorro garantizado, puntos con equivalencia inventada, descuentos universales ni disponibilidad inexistente.

## Objetivos y secuencia

**Hipótesis:** concentrar oferta y demanda en una zona operativa facilitará primeras compras y repetición. Ciudad, país, idioma, calendario y número de puestos siguen pendientes. No asumir lanzamiento nacional ni España como decisión cerrada.

| Fase propuesta | Trabajo y condición de avance |
| --- | --- |
| Preparación | Definir mercado, presupuesto, beneficios reales, páginas, consentimiento y eventos; validar compra y alta comercial |
| Oferta | Captar comerciantes donde pueda operar el piloto; comprobar carta, ubicación, apertura y capacidad de recibir pedidos |
| Demanda local | Activar búsqueda para clientes cuando existan negocios disponibles y compra funcional en el destino |
| Aplicaciones | Campañas de app después de publicación y verificación de medición iOS/Android |
| Optimización | Ampliar zonas/canales solo si conversión, repetición, margen y capacidad justifican el gasto |

Antes del producto funcional, una página puede captar interés con expectativas claras. Una inscripción anticipada no se contabiliza como comprador ni comercio activado.

## Campañas y páginas separadas

**Base propuesta:** dos campañas Search iniciales, presupuestos y objetivos independientes, con grupos por intención. Separar marca si el volumen lo justifica; evitar fragmentar por cada plato o puesto.

| Público | Intención y ejemplos de búsqueda, por validar | Destino y acción |
| --- | --- | --- |
| Cliente | «food trucks cerca», «comida para recoger [ciudad]» | Página local con negocios/horarios reales; explorar y comprar |
| Comerciante | «recibir pedidos food truck», «software pedidos food truck» | Página comercial: operación, requisitos y tarifas confirmadas; solicitar alta |

Comenzar con términos específicos y revisar las búsquedas reales antes de proponer palabras negativas. No existe todavía un informe de términos que justifique una lista de exclusiones. Concordancias y puja se decidirán según volumen y medición; no fijar CPA/ROAS sin datos.

Para demanda de recogida local, proponer segmentación de **presencia** en zonas cubiertas y revisar tráfico real: Google ofrece presencia o interés, y reconoce que la ubicación no es totalmente precisa. [Opciones geográficas de Google Ads](https://support.google.com/google-ads/answer/1722038?hl=en).

La página del cliente debe explicar recogida, mostrar carta y permitir continuar al flujo disponible. La comercial debe explicar licencia/mensualidad y onboarding Connect sin publicar los antiguos precios ilustrativos. Mantener header en Next.js web; dock solo en app nativa. No anunciar compra web completa hasta cerrar su alcance.

## Creatividades y pruebas

Preparar textos e imágenes propias/autorizadas de comida y puestos reales. Ejemplos de mensajes para revisar: «Encuentra food trucks cerca»; «Encarga y recoge tu comida»; «Gestiona pedidos de tu food truck». No son anuncios publicados.

Google combina titulares/descripciones de anuncios adaptables. Revisar que cualquier combinación resulte cierta. [Anuncios adaptables de búsqueda](https://support.google.com/google-ads/answer/7684791?hl=en).

Probar una hipótesis por vez: descubrimiento frente a comodidad de recogida; página centrada en mapa frente a carta; mensaje comercial centrado en pedidos frente a gestión. Documentar variante, periodo, muestra, conversión y criterio de evaluación. CTR ayuda a diagnosticar; la decisión depende de clientes/comercios adquiridos y su calidad. No declarar ganador con pocos eventos ni confundir rotación automática con un experimento controlado.

## Conversiones y autoridad de datos

| Evento propuesto | Definición y uso |
| --- | --- |
| `first_purchase_confirmed` | Primera compra de comida pagada, confirmada en Laravel mediante evidencia autenticada de Stripe; objetivo principal cliente |
| `merchant_activated` | Negocio que cumple aprobación adoptada, Billing, Connect, carta y ubicación operativa; objetivo principal comercial |
| Registro, inicio de checkout, lead | Diagnóstico secundario; no equivalen a venta ni activación |
| Alta de membresía | Evento separado tras confirmación del proveedor; no mezclar comida y cuota |

Un retorno desde Stripe o una pantalla de éxito no acreditan cobro. PostgreSQL conserva eventos deduplicados; el QR acredita recogida, no una nueva compra. Conciliar pagos, cancelaciones y reembolsos y ajustar el análisis. Elegir objetivos por campaña para que B2B no optimice por compras de clientes. Google distingue acciones primarias y secundarias; revisar especialmente los objetivos personalizados, que pueden usar ambas para pujar. [Objetivos de conversión](https://support.google.com/google-ads/answer/10995103?hl=en).

Diseñar atribución web/app/backend con identificadores técnicos, consentimiento, ventana documentada y una sola conversión por origen. U08 solicita planificar **GA4 web y Firebase Analytics móvil**; SDK, propiedades/streams, IDs, consentimiento y modo de integración quedan por verificar, sin dependencias instaladas. Firebase de medición no sustituye auth propia. La medición móvil contempla Android/iOS y puede incluir conversiones modeladas. [Conversiones de aplicaciones](https://support.google.com/google-ads/answer/6100665?hl=en), [diccionario e integración](34-analitica-consentimiento.md).

## Privacidad y aplicaciones

Separar consentimiento de analítica/publicidad, comunicaciones promocionales y permisos de push. La cuota no concede estos permisos. Definir gestión y retirada de consentimiento antes de instrumentar. Consent Mode transmite preferencias; no obtiene por sí mismo autorización. Revisar `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` en web/app según mercado. [Consentimiento web](https://developers.google.com/tag-platform/security/guides/consent), [consentimiento móvil](https://developers.google.com/tag-platform/security/guides/app-consent).

No enviar emails, teléfonos, tokens QR, tokens de sesión, datos de tarjeta ni ubicación GPS precisa en eventos, URLs, títulos, UTMs o dimensiones. Revisar también captura automática y enlaces de retorno. No introducir Customer Match/conversiones mejoradas en el piloto sin evaluación específica. [Prevención de datos personales en Analytics](https://support.google.com/analytics/answer/6366371?hl=en).

Planificar campañas App separadas por Android/iOS después de publicar en sus tiendas, con ficha, assets, enlaces y eventos verificados. Primero evaluar adquisición; optimizar por compras cuando la señal sea suficiente. No presentar instalaciones como compradores ni prometer 120 FPS en publicidad. [Campañas de aplicaciones](https://support.google.com/google-ads/answer/6247380?hl=en), [configuración por plataforma](https://support.google.com/google-ads/answer/12575501?hl=en).

## Presupuesto, métricas y pendientes

**Referencia del usuario: 400 al mes, expresamente pendiente.** No es inversión autorizada; moneda, importe final, duración, reparto B2C/B2B, costes adicionales de creatividades/medición y responsable quedan pendientes. No dividir ni programar automáticamente ese importe en la cuenta. El presupuesto diario medio no es un tope estricto diario: Google documenta para la mayoría de campañas hasta dos veces el promedio diario y límite mensual habitual de 30,4 veces, sujeto a configuración/cambios. [Límites de gasto](https://support.google.com/google-ads/answer/10486637?hl=en).

Medir CAC de comprador/comercio activado, conversión, coste por lead cualificado, repetición por cohortes, retención y margen tras pagos, promociones y reembolsos. Separar gasto publicitario de CAC completo. El volumen de comida vendido no es ingreso de plataforma; 5,99 € tampoco es margen neto.

Pendientes: territorio, fecha, presupuesto, objetivos económicos, compra web, beneficios finales, consentimiento/retención, configuración/SDK de medición y responsable operativo. Antes de gastar, comprobar eventos repetidos, rechazos de consentimiento, pagos fallidos, reembolsos y enlaces iOS/Android. La activación futura requiere autorización explícita del usuario; este documento solo prepara la campaña.

## Skills y uso de hipótesis

Para esta planificación se seleccionan ads y analytics, con contenido comunitario revisado, y se contrastan decisiones con las referencias oficiales enlazadas. El detalle de instalación está en [skills](26-skills-proyecto.md).

No importar benchmarks de software B2B como si fueran resultados Foodtrucks ni aplicar repartos/umbrales de puja genéricos. Con presupuesto pendiente y señal desconocida, comprobar volumen e intención antes de ampliar. Separar marca/no marca al analizar, comparar periodos completos equivalentes y evitar sumar conversiones con ventanas incompatibles. No hay datos actuales de cuenta para recomendar pausas o gasto.

## Relación con el plan maestro

[SEO/ciudades](32-seo-local-nextjs.md) prepara destinos útiles; [ASO/editorial](35-aso-contenidos-roadmap-90-dias.md) aporta fichas y calendario; [medición](34-analitica-consentimiento.md) define eventos/consentimiento. [AdSense/AdMob](33-monetizacion-adsense-admob.md) genera una fuente de ingresos potencial distinta del gasto de adquisición: no usar sus impresiones como ventas ni compensar automáticamente el presupuesto pendiente con ingresos publicitarios hipotéticos.

Se mantiene recogida sin reparto y Mapbox. Foodtrucks.com es referencia de dominio del prompt, pendiente de control/producción antes de crear destinos live. No ampliar agresivamente canales hasta validar oferta, pago, recogida, activación comercial y margen.
