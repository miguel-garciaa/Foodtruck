# Analítica unificada, conversiones y consentimiento

**Estado: especificación propuesta, sin instrumentación instalada ni cuentas conectadas.** El prompt de marketing amplía la planificación a GA4, Firebase Analytics, Search Console y medición de anuncios. Este documento concreta contratos, configuración futura y pruebas; no atribuye eventos o resultados a una aplicación inexistente. Fuentes oficiales contrastadas el **13 de octubre de 2026**. Skills leídas: `analytics`, sus referencias de GA4/eventos/GTM y `expo-overview`.

La prioridad es adquirir clientes que compran y recogen, y negocios que realmente pueden recibir pedidos. Foodtrucks no ofrece reparto. La [auth propia](14-autenticacion.md), PostgreSQL y Laravel/Stripe siguen siendo la autoridad; Firebase Analytics no introduce Firebase Authentication, Firestore ni otro backend comercial.

## 1. Arquitectura y aislamiento por entorno

**Base propuesta:** una propiedad GA4 de producción con streams web, Android e iOS, asociados al proyecto Firebase correspondiente para medición nativa. Staging utiliza propiedad/proyecto/IDs separados. Local y CI emplean un receptor falso, sin emisiones live. No acumular pruebas y compras reales en una propiedad por añadir únicamente `environment` como filtro.

| Fuente | Qué aporta | Autoridad y límites |
| --- | --- | --- |
| Next.js + etiqueta GA4 | Navegación e interacción web consentidas | No confirma pagos; un solo mecanismo de etiquetado |
| Expo + SDK nativo Analytics | Pantallas, uso y embudo móvil consentidos | Requiere integración nativa verificada |
| Laravel/PostgreSQL + outbox | Registro, pago, activación, recogida y refund confirmados | Datos de negocio; exportación externa condicionada |
| Search Console | Impresiones, clics, CTR, consultas y páginas orgánicas | Agregado de Google Search, no historial del comprador |
| Google Ads | Gasto y atribución de adquisición | Ventanas y objetivos propios; no contabilidad |
| AdSense/AdMob, si se habilitan | Rendimiento e ingresos publicitarios | Estimados/finalizados separados de comida y Billing |
| Consolas de tiendas | Descargas, ficha, adquisiciones y disponibilidad | Descarga no equivale a `first_open` ni compra |

**Dependencia candidata, no instalada en la aplicación:** React Native Firebase para acceder a Analytics nativo. Expo documenta que requiere código nativo y no funciona en Expo Go. Verificar SDK Expo, versiones, plugins y configuración Android/iOS antes de añadirlo; usar development build y después release en dispositivos reales. No rescatar `expo-firebase-analytics` ni asumir que Firebase JS en React Native proporciona esta medición nativa. [Guía oficial Expo](https://docs.expo.dev/guides/using-firebase/).

La unificación permite comparar plataformas; no identifica mágicamente a la misma persona. Si se adopta User-ID, utilizar un identificador pseudónimo de analítica específico, nunca email, teléfono, ID de sesión o credencial. Activarlo solo con finalidad/base aprobadas, limpiar al salir de cuenta y evitar compartirlo entre usuarios de un mismo dispositivo. No activar Google Signals, audiencias, remarketing, Customer Match, conversiones mejoradas o exportación BigQuery por defecto; requieren evaluación propia de necesidad, coste y privacidad.

## 2. Next.js: una vista por navegación y URLs controladas

Inspeccionar primero Next.js/router reales. **Propuesta inicial:** envío manual de `page_view` desde un único adaptador cliente después de consentimiento, con `send_page_view: false` y captura automática por historial desactivada. Contar la vista inicial y cada navegación efectiva una vez; no contar prefetch, render SSR, hidratación o rerender como nuevas visitas. Normalizar redirecciones antes de emitir.

Alternativa válida: captura automática por historial si cubre rutas/privacidad correctamente. Elegir **automática o manual**, y no añadir simultáneamente un listener de ruta, etiqueta de GTM y disparo automático. La guía GA4 describe ambos mecanismos y pide comprobar en DebugView parámetros y navegación. [Medición de SPA](https://developers.google.com/analytics/devguides/collection/ga4/single-page-applications).

Usar inicialmente la etiqueta Google directa o un único contenedor GTM si lo justifica el equipo; no ambos para la misma función. Ni SSR ni un Server Component cargan etiquetas o envían visitas a Google antes de la elección. Si posteriormente se adopta GTM, versionar contenedor/disparadores y repetir pruebas de consentimiento y duplicados.

Permitir rutas públicas normalizadas y nombres de pantallas genéricos. Excluir analítica de páginas de reset/verificación, callbacks OAuth, QR, pago de retorno con tokens y administración. Para embudos privados autorizados, enviar una acción semántica sanitizada —por ejemplo, `begin_checkout`— sin URL completa, título personalizado, nombre del cliente ni número visible de pedido.

No activar sin revisión búsqueda del sitio, clics externos, descargas o captura de títulos. Entradas libres, referrer y query strings pueden contener datos personales o tokens. Sanitizar **antes** de enviar; una regla posterior en informes no evita la fuga. Google advierte que URLs, títulos, búsquedas y campañas pueden transmitir información personal. [Prevención de PII](https://support.google.com/analytics/answer/6366371?hl=en).

## 3. Diccionario de eventos

El nombre interno describe negocio; el adaptador puede mapearlo al nombre recomendado por Google. No emitir un alias y su equivalente como dos acciones de la misma etapa. `select_product` se conserva como concepto del prompt y se exporta normalmente como `select_item`. `view_vendor` y `view_menu` son personalizados, no automáticos.

| Evento interno o del prompt | Exportación propuesta | Disparo único / autoridad |
| --- | --- | --- |
| `page_view` | `page_view` web | Vista normalizada después de consentimiento; un adaptador |
| Vista de pantalla móvil | `screen_view` | Política manual/automática única, con nombre genérico |
| `view_vendor` | `view_vendor` | Ficha pública real visible, no resultado precargado |
| `view_menu` | `view_menu` | Menú visible; no enviarlo por cada scroll |
| Lista de productos visible | `view_item_list` | Lista o lote visible, IDs públicos y categoría |
| `select_product` | `select_item` | Selección de producto en lista, no mera impresión |
| Detalle de producto | `view_item` | Detalle realmente mostrado, si existe esa pantalla |
| `add_to_cart` | `add_to_cart` | Cambio efectivo de cantidad; no clic fallido o reintento |
| `begin_checkout` | `begin_checkout` | Inicio de intención de compra válido, no cada render |
| Compra de comida confirmada | `purchase` | Laravel verifica pago y registra transición duradera |
| Reembolso confirmado | `refund` | Laravel confirma refund; importe/ítems parciales correctos |
| `sign_up` | `sign_up` | Alta efectiva confirmada, no clic en enviar formulario |
| `app_open` | `app_open` | Apertura/foreground según contrato, evitar doble registro del SDK |
| `first_open` | Automático nativo | Primera ejecución medida tras instalación/reinstalación; no fabricarlo |
| `vendor_registration` | `vendor_registration` | Solicitud comercial creada una vez; no negocio activado |
| `merchant_activated` | `merchant_activated` | Laravel valida requisitos de activación adoptados |
| `pickup_completed` | `pickup_completed` | Canje QR autorizado y commit único de recogida |
| `first_purchase_confirmed` | Personalizado opcional | Primera compra pagada según definición y unicidad del backend |
| Cobro/renovación de membresía cliente | `customer_membership_paid` | Confirmación de Billing o proveedor elegido; flujo separado |
| Licencia/mensualidad comerciante | `merchant_billing_paid` | Confirmación del circuito Billing comercial, separado de Connect |

Los nombres recomendados y los arrays `items` ayudan al informe de comercio; comprobar parámetros admitidos en los SDK elegidos. [Eventos ecommerce GA4](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce). No añadir `add_shipping_info` ni importes de reparto para un producto de recogida.

`first_open` ocurre al usar la app por primera vez, no al descargarla. Medición bloqueada, reinstalación y configuración del SDK afectan su interpretación. `session_start` y otros eventos automáticos tampoco deben recrearse manualmente. Revisar la lista y lo observado con los SDK/versiones reales. [Eventos automáticos](https://support.google.com/analytics/answer/9234069?hl=en).

**Parámetros mínimos propuestos:** `schema_version`, plataforma/stream de origen, tipo de superficie, `city_id` de oferta comercial cuando aporte valor, categoría y método de registro de un catálogo cerrado. Para productos, ID/nombre **públicos** verificados, cantidad, precio y moneda de instantánea. En eventos de negocio, ID técnico opaco y fecha confirmada. No enviar comentarios, notas al cocinero, alérgenos del comprador, búsquedas libres ni textos de errores externos.

Registrar solo dimensiones de baja cardinalidad necesarias para decisiones. `transaction_id`, `event_id`, identificador de usuario o request ID no son dimensiones personalizadas para agrupar todos los informes. IDs se reservan a deduplicación/conciliación y se protegen como datos pseudónimos; no son anonimización garantizada.

## 4. Pago, QR, primera compra y deduplicación

1. Laravel verifica origen firmado, entorno, cuenta Stripe, importe/moneda y relación con el pedido. Persistir pago/transición y evento outbox dentro de la transacción apropiada. La pantalla de éxito y el cliente no declaran `purchase`.
2. El worker construye un payload externo permitido desde el registro autoritativo. Seleccionar **un stream de origen**, web o app; abrir el mismo pedido en otro dispositivo no crea otra compra. No reenviar `purchase` desde cliente y servidor para compensar navegación perdida.
3. Unicidad duradera por entorno, tipo/versión de evento, recurso y destino. `transaction_id` opaco, estable y exclusivo del pedido/circuito, sin email, QR, Stripe secret o ID de sesión. Separar espacios de comida, cliente Billing y comerciante Billing.
4. Recogida QR produce `pickup_completed`; nunca otro `purchase`. Pago recibido, pedido aceptado, recogido y reembolsado son estados diferentes.
5. Derivar primera compra de historial backend con unicidad por cuenta pseudónima, no contador de GA4 ni marca del dispositivo. Definir el tratamiento de una primera compra totalmente reembolsada, invitado, cuenta fusionada y compras antiguas antes de convertirlo en objetivo.

GA4 documenta deduplicación por `transaction_id` para **streams web**, y avisa de que no funciona para streams app. Por ello, el control durable y un único emisor son obligatorios también en móvil; no prometer entrega exactamente una vez a un proveedor externo. Ante timeout con resultado desconocido, distinguir pendiente/entrega incierta y conciliar, en lugar de reintentar ciegamente `purchase` nativo. Documentar la política de reintentos/pérdida tolerable antes de implementar. [Límites de deduplicación GA4](https://support.google.com/analytics/answer/12313109?hl=en).

**Transporte propuesto:** Measurement Protocol servidor para hechos autoritativos, complementando tags/SDK, con `client_id` o `app_instance_id` válido del stream solo si existe consentimiento y vínculo permitido. Nunca sustituirlo por sesión de auth, fabricar identificadores o exportar un evento sin señal consentida para “recuperar” cobertura. Sin autorización o contexto válido, conservar el hecho operativo interno y omitir la exportación. Measurement Protocol complementa la recogida cliente y por sí solo puede producir informes parciales. [Guía del protocolo](https://developers.google.com/analytics/devguides/collection/protocol/ga4).

La outbox conserva estado mínimo de exportación —origen, destino, intentos, fechas, bloqueado por consentimiento, incierto o enviado— y no una copia ilimitada del usuario/pedido. Revisar permiso actual **antes de cada envío**, además de la evidencia de finalidad/version aplicable al hecho; la elección en el checkout no autoriza exportar después de una retirada.

## 5. Valores económicos y refunds

Laravel mantiene dinero entero en unidades mínimas. El adaptador convierte al formato monetario exigido por Analytics con la escala de la moneda; no calcula leyendo texto del DOM ni sumando flotantes. Contrato propuesto para `purchase.value`: valor de ítems después de descuentos, excluyendo impuestos; `tax` separado si se conoce y resulta pertinente. Conciliar también total realmente cobrado, comisiones y descuentos financiados en el ledger interno. Falta de valor no se reemplaza por un cero inventado.

Separar en dashboards:

- **Venta de comida/GMV:** elegir y etiquetar definición bruta y neta de refunds; especificar impuestos incluidos/excluidos.
- **Ingreso de plataforma:** comisión adoptada, licencia, mensualidad comercial, membresía cliente e ingresos publicitarios, cada uno por circuito. GMV no es facturación de Foodtrucks.
- **Margen:** costes de pago, promoción, operación y adquisición, cuando existan datos; cuota no equivale a margen.

La cuota cliente confirmada es **5,99 €/mes en EUR**; impuestos y descuentos siguen pendientes. Tarifas de licencia/cuota comerciante, sus condiciones y comisión siguen pendientes; el modelo de licencia inicial y mensualidad comercial sí está confirmado. Refund completo/parcial lleva ID de compra y ajuste duradero único; no restar todos los pedidos de la cohorte ni borrar el evento original. Los ajustes de Google Ads tienen un procedimiento propio: emitir un `refund` en GA4 no garantiza corregir automáticamente toda conversión o puja Ads. [Membresía](25-suscripcion-clientes-fidelizacion.md), [pagos](13-stripe.md).

## 6. Objetivos de Google Ads y atribución

**Propuesta del piloto:** objetivo cliente `first_purchase_confirmed` y objetivo comerciante `merchant_activated`, por campaña. `purchase`, registro, menú, carrito, lead y recogida sirven para análisis; no sumar etapas como clientes adquiridos. Si se prefiere optimizar todas las compras, sustituir expresamente el objetivo de primera compra, sin contar ambos como dos ventas. Si no hay señal suficiente, documentar experimento y objetivo provisional; no inventar un volumen mínimo ni ROAS objetivo.

Elegir una ruta para la misma conversión: importación desde GA4 **o** conversión directa Ads validada. No dejar ambas como acciones primarias para el mismo pago. Validar equivalencias web/app, contexto de cuenta, IDs y ventanas; la misma persona que paga desde la app y visita la confirmación web no se adquiere dos veces. Las acciones secundarias son de observación, salvo que se incluyan en un objetivo personalizado, donde pueden entrar en puja. [Objetivos y acciones Google Ads](https://support.google.com/google-ads/answer/10995103?hl=en).

La pertenencia a cuenta, vínculos e importaciones se configurarán después de revisar accesos y autorizaciones. **400 al mes continúa siendo referencia expresamente pendiente**, sin moneda/reparto/activación aprobados. La arquitectura de analítica no autoriza inversión. [Plan Ads](27-marketing-google-ads.md).

UTM propuestas: catálogo breve en minúsculas para `utm_source`, `utm_medium`, `utm_campaign` y `utm_content`; ejemplos ficticios `google`, `cpc`, `piloto_clientes`, `recogida_01`. No poner nombres de personas, email, ID de pedido, coordenadas o beneficio no aprobado. Conservar identificadores de clic únicamente con finalidad/base y retención decididas; no publicarlos en logs o documentos.

Definir por canal fuente/medio, ventana de clic/visualización, modelo, zona horaria, fecha de adquisición frente a conversión y tratamiento de refunds. Contrastar periodos cerrados equivalentes. El tráfico atribuido/modelado de Google y los totales backend pueden divergir por consentimiento, bloqueadores y ventanas; mostrar cobertura y diferencia, sin forzar una suma idéntica ni unir dispositivos mediante fingerprinting.

Enlaces web-app usan App Links/Universal Links y fallback web según su documentación dedicada. Firebase Dynamic Links fue retirado con fecha 25 de agosto de 2025; no usarlo para este proyecto ni prometer que los enlaces nativos resuelven automáticamente atribución diferida después de instalar. [FAQ oficial](https://firebase.google.com/support/dynamic-links-faq).

## 7. Consentimiento: bloqueo inicial y separación de finalidades

Países, públicos, tratamiento de menores, proveedor CMP, información legal y plazos están pendientes. Esta especificación prepara controles; no certifica cumplimiento RGPD ni legalidad definitiva.

**Base conservadora propuesta:** analítica y publicidad desactivadas hasta elección válida. En web, estrategia basic de Consent Mode y bloqueo de tags; advanced puede emitir pings con consentimiento denegado y necesita evaluación aparte. Consent Mode transmite elecciones, no obtiene permiso ni convierte por sí mismo un tratamiento en lícito. [Modalidades Google](https://developers.google.com/tag-platform/security/concepts/consent-mode).

| Señal/finalidad | Qué decidir y aplicar |
| --- | --- |
| `analytics_storage` | Almacenamiento/recogida analítica según elección y política aprobada |
| `ad_storage` | Almacenamiento relacionado con publicidad |
| `ad_user_data` | Envío de datos a Google para fines publicitarios |
| `ad_personalization` | Uso para personalización publicitaria |
| Email marketing Resend | Preferencia/finalidad propia, baja y supresión; no deriva de las cuatro señales |
| Push | Permiso SO y preferencias de comunicaciones, independientes |
| Ubicación | Permiso/finalidad operativa; GPS preciso no se exporta a Analytics |

Valores iniciales `denied`, restauración controlada, aceptación granular, rechazo accesible y retirada desde web/app. Si no se carga la CMP o se desconoce el estado válido, no cargar tags/ads por defecto. No condicionar mapa manual, compra o QR a aceptar analítica/publicidad. La membresía de pago tampoco concede esos permisos. [Consentimiento web](https://developers.google.com/tag-platform/security/guides/consent), [consentimiento app](https://developers.google.com/tag-platform/security/guides/app-consent), [correo](30-correo-resend.md).

**Nativo antes de arrancar:** desactivar colección en AndroidManifest/Info.plist y fijar defaults de consentimiento/personalización nativos, usando plugins/configuración compatibles con la versión real. Deshabilitarla desde JS después de inicializar no asegura impedir `first_open` u otros envíos anteriores. Android permite `firebase_analytics_collection_enabled=false`; iOS `FIREBASE_ANALYTICS_COLLECTION_ENABLED=false`. Probar además comportamiento persistido tras reinicio y retirada; habilitar solo después de actualizar las señales permitidas. [Android](https://firebase.google.com/docs/analytics/android/configure-data-collection), [iOS](https://firebase.google.com/docs/analytics/ios/configure-data-collection).

## 8. CMP/TCF, UMP y ATT

Para servir anuncios personalizados de productos publisher de Google a usuarios del EEE, Reino Unido y Suiza, Google exige CMP certificada e integración con TCF. Seleccionar cobertura web/app y requisitos vigentes del territorio; la certificación no acredita por sí sola cumplimiento de toda la legislación. No confundir Consent Mode de medición con la cadena TCF de publicidad publisher. [Requisitos oficiales](https://support.google.com/admob/answer/13554116?hl=en).

En AdMob, evaluar UMP para mensaje/estado actual y opciones de privacidad, evitando dos solicitudes de anuncios desde callbacks simultáneos. `canRequestAds` es una comprobación del SDK, no permiso genérico para Firebase Analytics, Resend ni tracking entre empresas. Según política, podría admitir anuncios limitados; Foodtrucks debe decidir explícitamente si los habilita tras rechazo. **Propuesta inicial: sin solicitudes publicitarias cuando el permiso aplicable es desconocido o rechazado**, mientras esa política siga pendiente. [UMP Android](https://developers.google.com/admob/android/privacy), [UMP iOS](https://developers.google.com/admob/ios/privacy).

En iOS, ATT debe revisarse cuando se rastrea a la persona entre apps/sitios de otras empresas o se accede al identificador publicitario. Consentimiento CMP y autorización ATT tienen alcances diferentes; obtener una no concede la otra. Evitar IDFA, AD_ID y seguimiento entre servicios si no hay necesidad/permiso. No bloquear compra, puntos o acceso por rechazar tracking. Privacy labels, Data safety y manifiestos describen lo que el SDK realmente recoge. [Apple: privacidad y uso de datos](https://developer.apple.com/app-store/user-privacy-and-data-use/).

## 9. Privacidad, retención y accesos

Prohibidos en payload, URL, título, user property, dimensión, UTM y log de analítica: nombre/email/teléfono personal, dirección del cliente, GPS preciso, contraseña, tokens de sesión/reset/OAuth, QR, tarjeta y datos KYC. Los datos públicos del vendedor no justifican enviar la dirección privada de un autónomo como identificación del comprador. Normalizar ciudad de oferta; no derivar ubicación individual fina como dimensión.

Guardar evidencia mínima de consentimiento/finalidad/version/retirada y vínculo técnico autorizado por separado de permisos comerciales. Definir borrado, exportación y anonimización compatibles con documentos económicos; retirar consentimiento detiene futuras emisiones, no sustituye un proceso de solicitud de supresión. Purgar colas externas pendientes al retirar y preservar el registro operativo necesario bajo su finalidad aprobada.

GA4 permite plazos configurables para datos de usuario/evento, con efecto distinto sobre informes agregados. No adoptar automáticamente 14 meses: decidir plazo, reinicio por nueva actividad, acceso y finalidad; verificar también retención del backend, Ads, CMP, proveedor y backups. [Retención Analytics](https://support.google.com/analytics/answer/7667196?hl=en). No añadir session replay ni grabación de formularios como parte implícita de esta planificación.

Acceso administrativo de mínimo privilegio, MFA y cambios de tags/configuración revisados. Credenciales de API reporting y Measurement Protocol quedan en servidor/secret manager. No incrustar una cuenta de servicio, clave API secreta, panel con acceso público o credencial GA4 en Next.js/Expo para “mostrar estadísticas”. [Seguridad](19-seguridad.md).

## 10. Embudos y dashboards con decisiones concretas

**Cliente:** Search/Ads → landing pública → `view_vendor` → `view_menu`/producto → carrito → checkout → compra confirmada → recogida. Revisar abandono por superficie, disponibilidad real, categoría y ciudad. Si la compra web queda fuera del MVP, medir salida hacia app y su embudo; no inventar checkout web funcional.

**Comerciante:** Search/Ads → landing vendedores → solicitud → verificación/Billing/Connect según requisitos → menú y ubicación válidos → `merchant_activated` → primeros pedidos. Registro no equivale a vendedor operativo; mostrar causas de inactividad desde datos internos, no desde ausencia de tags.

| Panel futuro | Datos y límites |
| --- | --- |
| Cliente | Sus pedidos/recogidas, membresía y movimientos de puntos desde API autorizada; no historial publicitario de terceros |
| Comerciante | Sus ventas, refunds, conversión disponible, disponibilidad y recogidas; filtro de negocio aplicado por Laravel, sin compradores identificables en GA4 |
| Admin/producto | Agregados por ciudad/plataforma, cohortes, funnel, vendedores operativos y salud de datos; acceso auditado |
| Marketing autorizado | SEO, campañas, coste y conversión consentida, frecuencia/retención y cobertura; informes sin exposición de pedidos individuales |

Search Console mide clics/impresiones/CTR/posición por dimensiones de búsqueda; GA4 mide comportamiento posterior observado. No unir una consulta agregada a un cliente concreto ni tratar cada clic orgánico como visita/comprador confirmado. [Informe Search Console](https://support.google.com/webmasters/answer/7576553?hl=en).

**Métricas propuestas:** ratio de compra confirmada por visita/público elegible, recogidas sobre pedidos pagados del mismo periodo/cohorte, ticket medio definido, compradores repetidores y cohortes maduras, tiempo a activación comercial, negocios disponibles que reciben pedidos, CAC de nuevo comprador/comerciante activado, frecuencia, refunds y margen. Registrar también rechazo/retirada y eventos exportables frente a hechos backend para explicar cobertura.

Cada tasa necesita numerador/denominador de la misma ventana cerrada, moneda y zona horaria. Una cohorte aún dentro de su plazo está pendiente, no fallida. Si se comparan anuncios con un grupo sin anuncios, evaluar **pedidos recogidos, repetición, margen, errores y rendimiento**, además de ingresos publicitarios; no justificar ads solo por impresiones o CTR. No hay datos Foodtrucks para presentar resultados, CPC, CPA, CAC o ROAS.

## 11. Cambios implementables cuando exista repositorio

Rutas siguientes **propuestas**, compatibles con el [monorepo](07-arquitectura-monorepo.md); no existen ahora ni se han editado fuentes de aplicación. Ajustarlas a estructura/router/version verificados. Compartir contrato reducido sin crear una plataforma de eventos genérica o muchas capas.

| Ruta propuesta | Problema/solución y dependencia | Prueba/resultados esperados |
| --- | --- | --- |
| `packages/api-client/src/analytics-contract.ts` | Diccionario tipado y allowlist común; sin datos privados | Rechazar parámetros arbitrarios/PII |
| `apps/web/src/lib/analytics.ts` | Adaptador único, URLs sanitizadas, bloqueo de colección | Una vista por navegación y ninguna antes de permiso |
| `apps/web/src/components/consent-provider.tsx` | Estado y retirada integrados con CMP elegida | Aceptación parcial, rechazo y fallo no cargan tags indebidos |
| `apps/mobile/src/lib/analytics.ts` | Adaptador SDK nativo, pantallas/foreground y defaults | Desarrollo/release en iOS/Android; reinicio/retirada |
| `apps/mobile/app.config.ts` o configuración nativa real | Colección inicial bloqueada y IDs por entorno | Inspección manifest/Info.plist generados antes de arranque |
| `backend/internal/analytics/` | Exportación desde hechos/outbox y gate de consentimiento | Duplicados, reintentos, timeout incierto, separación stream |
| `database/migrations/` + `database/queries/` | Unicidad/retención de consentimiento y entregas | Concurrencia, refund parcial, retirada antes de worker |
| Workflows/scripts reales del repo | Fake en CI, checks tipado/contratos, sin credenciales live | Build sin emisión externa y configuración inválida rechazada |

Campos de configuración **ejemplificativos**, todos vacíos/desactivados por defecto:

~~~dotenv
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
EXPO_PUBLIC_ANALYTICS_ENABLED=false
ANALYTICS_EXPORT_ENABLED=false
GOOGLE_ADS_CONVERSION_EXPORT_ENABLED=false
GA4_MEASUREMENT_PROTOCOL_API_SECRET=
GA4_REPORTING_CREDENTIALS_PATH=
~~~

Los IDs públicos identifican destinos; no son secretos, pero tampoco consentimiento ni autorización de activación. Configuración Firebase cliente por plataforma/entorno va donde indique el SDK/plugin elegido; nunca confundirla con credenciales Admin. El backend verifica flags y entorno independientemente del cliente. Inicializar sin destino válido se queda desactivado y informa de error interno sin revelar secretos.

## 12. Validación futura y condiciones de salida

| Caso | Evidencia exigida antes de declarar integrado |
| --- | --- |
| Primera visita/arranque, CMP lenta/fallida | Sin envío Analytics/Ads prematuro; producto operativo |
| Acepta solo analítica; rechaza publicidad | Eventos permitidos sin almacenamiento/señales publicitarias indebidas |
| Rechaza todo, retira, reinstala o reinicia | SDK/etiquetas/worker cumplen estado; no reenvío de historial rechazado |
| SPA: SSR, hidratación, back/forward, redirect, prefetch | `page_view` único y URL/referrer sanitizados |
| SDK: foreground y navegación | `app_open`/pantallas sin duplicados; `first_open` no se fabrica |
| Stripe falso/repetido/fuera de orden o checkout fallido | Ninguna compra sin confirmación; un hecho por pedido |
| Compra web y app abiertas a la vez | Un solo origen para esa compra, ledger externo consistente |
| Doble QR, refund parcial/completo | Una recogida y ajustes correctos, sin nueva compra |
| Retirada entre enqueue y envío; timeout proveedor | Bloqueo actualizado; incierto distinguido, sin reintento ciego |
| URLs privadas, búsqueda libre, notas y PII señuelo | Payloads/red/logs sin los datos prohibidos |
| Dashboards y API | Cliente/negocio ajeno denegado; exportación/admin restringidos |
| CI, staging, restore de backup | Sin tráfico/Ads/pagos/mensajes live |

Instrumentar tests de contrato/unitarios y comportamiento donde aporte valor. En web, comprobar red, almacenamiento y tags mediante Tag Assistant/DebugView con datos ficticios; en móvil, inspección de configuración nativa y dispositivos en development/release. Verificar también evento recibido e informes procesados: que una etiqueta dispare o un endpoint devuelva éxito no demuestra exactitud financiera.

Measurement Protocol dispone de servidor de validación; utilizarlo para errores de formato y límites antes de colección. Su endpoint de validación no incorpora esos eventos a los informes, y una respuesta aceptada en colección no sustituye validación previa. [Validación oficial](https://developers.google.com/analytics/devguides/collection/protocol/ga4/validating-events).

Conciliar por periodo y stream: pagos backend únicos, elegibles por consentimiento, exportados/inciertos/bloqueados, compras y refunds medidos, objetivos Ads y recogidas. Explicar las diferencias; no rellenarlas con eventos ficticios. Registrar config/version, pruebas reales y fallos. **En este paquete solo se verifica documentación, no eventos, consentimientos reales, SDKs, entregas ni cuentas Google.**

## 13. Decisiones pendientes de esta ampliación

Mercado/edad del público, CMP y cobertura publisher; política tras rechazo y modo basic/advanced; identificadores/property/streams y responsables; SDK/plugin/version compatibles; mecanismo page views; consentimiento/retención/User-ID; targets por campaña y ventanas; definición de primera compra y refund; transportes/exportación incierta; dashboards/umbral de privacidad y frecuencia de refresco. Presupuesto **400 al mes pendiente**, tarifas comerciales/impuestos pendientes y nombre/posesión/verificación del dominio no se deducen de un enlace en un prompt.

Cerrar estos puntos conforme a [decisiones pendientes](23-decisiones-pendientes.md), [entornos/CI](21-entornos-ci-cd.md) y el roadmap de marketing ampliado. Mantener separadas las capacidades solicitadas, propuestas y efectivamente verificadas; ninguna de estas especificaciones autoriza publicar, gastar o activar identificadores reales.

## 14. Derechos, consentimiento y ciclo de vida de datos — v1.9

La [política de protección de datos y gobernanza](48-proteccion-datos-gobernanza.md) reúne inventario, responsables y evaluación aplicable. Una retirada de consentimiento bloquea futuras recogidas/exportaciones de esa finalidad; una solicitud de acceso, exportación o supresión tiene su propio procedimiento autenticado y autorizado. No tratar baja de marketing, cierre de cuenta, retirada de analítica y supresión como una única acción, ni prometer borrado inmediato de todo registro económico.

Antes de activar cada destino de medición, aprobar finalidad, base aplicable, datos mínimos, proveedor/región, accesos, plazo y eliminación; las bases y retenciones definitivas siguen pendientes. No deducirlas de una cuota de pago, de un permiso del SO o de una configuración Google. Los identificadores pseudónimos pueden seguir vinculándose a personas y requieren protección. Coordinar solicitudes entre backend, colas, SDK y destinos externos mediante mecanismos compatibles verificados; registrar su resultado y limitaciones, sin inventar APIs de borrado de proveedores.

Probar retirada entre encolado y envío, reinicio/reinstalación y recuperación de backup: no reenviar historial rechazado o suprimido ni reactivar tracking por un estado antiguo. La evidencia de consentimiento y solicitudes se conserva solo bajo finalidad/plazo aprobados y con acceso limitado. Los casos de [QA](40-testing-qa-github.md) son requisitos futuros; no constan solicitudes, consentimientos ni borrados reales ejecutados.
