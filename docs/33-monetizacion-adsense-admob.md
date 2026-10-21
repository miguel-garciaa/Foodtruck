# Monetización editorial: evaluación AdSense web y AdMob nativo

**Estado:** especificación y evaluación previa, no integración ejecutada. **Fecha de revisión de fuentes:** 13 de octubre de 2026. El prompt de marketing añade la evaluación de AdSense y AdMob. No acredita elegibilidad, cuentas, verificaciones, IDs publicitarios, consentimiento implementado, anuncios activos ni ingresos.

La prioridad son los pedidos para **recoger personalmente**, la confianza y la recurrencia. No hay reparto a domicilio. La publicidad se propone como experimento posterior al producto y permanece **desactivada por defecto**. El dominio `foodtrucks.com` ha sido proporcionado como referencia; su compra, disponibilidad y control no se han comprobado. Los ejemplos técnicos usan `dominio.example`.

## Tres productos distintos

| Producto | Finalidad | Tratamiento en Foodtrucks |
| --- | --- | --- |
| Google Ads | Pagar campañas para captar clientes y comerciantes | Continúa el [plan de adquisición](27-marketing-google-ads.md); referencia de 400 al mes expresamente pendiente |
| Google AdSense | Monetizar inventario de páginas web elegibles | Evaluación documental; slots manuales editoriales como propuesta, sin activación |
| Google AdMob | Monetizar inventario de aplicaciones nativas elegibles | Prueba futura con SDK nativo e IDs oficiales de prueba; sin anuncios reales |

Una cuenta o aprobación de un producto no demuestra la de los otros. Una impresión publicitaria no es un pedido, ni un ingreso de comida equivale a ingreso de la plataforma. No usar Google Ads para comprar tráfico destinado principalmente a generar impresiones de AdSense.

## Modelo de negocio que se conserva

| Fuente | Decisión/estado | Comparación que deberá hacerse con datos reales |
| --- | --- | --- |
| Licencia inicial y mensualidad de comerciantes | Modelo confirmado; tarifas y condiciones pendientes | Ingreso recurrente, coste operativo, alta y retención de negocios |
| Membresía cliente | **5,99 €/mes en EUR confirmado**; impuestos, beneficios, puntos y financiación pendientes | Recurrencia y margen después de beneficios; no prometer un plan sin anuncios |
| Comisión por venta de comida | Decisión/tarifa pendiente | Ingreso por pedido menos pagos, devoluciones y soporte; no convertir 0 % o 2 % ilustrativos en contrato |
| Promociones propias/posiciones patrocinadas | Propuesta pendiente | Incremento de pedidos y efecto sobre confianza; identificar claramente el patrocinio, sin falsear relevancia ni disponibilidad |
| AdSense/AdMob | Evaluación solicitada; activación y rentabilidad pendientes | Ingreso publicitario neto frente a coste técnico, privacidad y posible pérdida de conversión |
| Herramientas premium/acuerdos comerciales | Opciones para estudiar | Beneficio comprobado y disposición a pagar; no cambiar el modelo confirmado por sugerencias del prompt |

La cuota cliente no concede consentimiento publicitario o para correos comerciales. Los puntos por compra siguen las reglas de [fidelización](25-suscripcion-clientes-fidelizacion.md). No sustituirlos por puntos por ver anuncios, ni concederlos por hacer clic. No se ofrecen estimaciones de eCPM, fill rate, CPC, CAC, CPA o ROAS.

## Inventario y zonas propuestas

La tabla expresa una política de producto propuesta, más conservadora que una autorización genérica de proveedor. **Todas las zonas empiezan sin publicidad.** Que una página sea pública o indexable no la hace elegible automáticamente.

| Superficie | AdSense web | AdMob nativo | Condición para reconsiderar |
| --- | --- | --- | --- |
| Guía/artículo original revisado y útil | Candidato posterior; slot manual separado del contenido | Solo si existe un lector editorial nativo real | Contenido suficiente, revisión, consentimiento, aprobación, rendimiento y experimento |
| Página de ciudad con oferta y contenido comprobados | Candidata editorial; nunca ciudades vacías | No se asume que exista una pantalla editorial equivalente | Separar guía editorial de búsqueda transaccional y medir el efecto |
| Portada y landing de captación cliente/comerciante | Excluidas del piloto inicial | No aplica como justificación de slot | Conservar propósito de adquisición y confianza |
| Mapa accionable, explorar, buscador, filtros y navegación al puesto | Excluidos | Excluidos | No colocar anuncios sobre mapa, marcadores, resultados accionables o gestos |
| Ficha comercial, menú, producto, precios y alérgenos | Excluidos del piloto | Excluidos | No competir con información de compra o seguridad alimentaria |
| Carrito, checkout, Stripe, confirmación, seguimiento, pedido y QR | Excluidos | Excluidos | Protección permanente del flujo crítico en esta propuesta |
| Auth, perfil, membresía/puntos, soporte privado, panel comerciante y administración | Excluidos | Excluidos | Datos privados y tareas operativas |
| Error, vacío, loading, página en construcción, aviso, éxito aislado | Excluidos | Excluidos | No usar estados sin contenido útil como inventario |
| Dock móvil, header web, controles, enlaces de descarga y consentimiento | Excluidos | Excluidos | No confundir anuncio con navegación o compra |
| Push, correos Resend, Live Activities/Live Updates y lock screen | Excluidos | Excluidos | No trasladar publicidad a canales de estado de pedidos |

Google prohíbe anuncios en pantallas sin contenido editorial, de poco valor, en construcción o dedicadas a alertas/navegación; los estados de error o agradecimiento aislados también requieren especial cuidado. No fabricar artículos o ciudades para llenar inventario. [Política de contenido de editores](https://support.google.com/publisherpolicies/answer/11112688?hl=en).

Separar físicamente el anuncio de añadir al carrito, pagar, cerrar, navegar y escanear. Evitar anchors, overlays, pop-ups, inserciones que muevan el objetivo de un toque, anuncios flotantes y activación automática de formatos. No ocultar atribución, ni imitar una tarjeta de vendedor. No recompensar clics, pedir que se pulse para apoyar el proyecto ni probar clics en anuncios reales. [Políticas de AdSense](https://support.google.com/adsense/answer/48182?hl=en), [clics accidentales](https://support.google.com/adsense/answer/10025624?hl=en).

## AdSense: elegibilidad antes de integrar

La revisión real se hará cuando exista una web pública: contenido original de calidad, derechos de uso de imágenes/textos, navegación útil, páginas legales accesibles, ausencia de contenido engañoso y acceso del titular al HTML. Confirmar los requisitos de edad del titular y políticas vigentes al solicitar. No existe evidencia suficiente en este paquete para declarar Foodtrucks elegible. [Requisitos oficiales](https://support.google.com/adsense/answer/9724/eligibility-requirements-for-adsense?hl=en-uk).

Alta, verificación y revisión son pasos distintos. Google ofrece métodos de conexión/verificación mediante código, `ads.txt` o meta tag, según el flujo disponible en la cuenta. Se propone estudiar meta tag o `ads.txt` para acreditar el sitio sin insertar automáticamente un script que sirva anuncios en la portada. Copiar el valor real del panel solo cuando la tarea de configuración esté autorizada; aprobar el sitio no implica activar cada zona. [Conectar sitio](https://support.google.com/adsense/answer/7584263?hl=en), [gestionar un sitio nuevo](https://support.google.com/adsense/answer/12169212?hl=en).

No publicar todavía etiquetas con IDs falsos, marcadores o valores de otro editor. No afirmar que DNS en Cloudflare o Search Console verifican por sí solos AdSense. Mantener revisión y moderación del contenido de comerciantes que pudiera incorporarse a páginas monetizadas.

## Consentimiento de editores, analítica y ATT

Antes de servir publicidad, definir países, edades objetivo, proveedores y finalidades. Para tráfico del EEE, Reino Unido y Suiza, adoptar una **CMP certificada por Google e integrada con IAB TCF** conforme a los requisitos actuales de editores y a la plataforma certificada —web/app—. Comprobar la lista al implementar; no construir un banner casero y declararlo certificado. La certificación de Google no acredita cumplimiento legal definitivo. [Requisitos/lista de CMP](https://support.google.com/adsense/answer/13554116?hl=en-GB).

AdMob dispone de UMP para presentar los mensajes configurados en Privacy & messaging y recoger elecciones. La propuesta es evaluar la CMP de Google mediante UMP para móvil y una CMP certificada adecuada para web; elección final, configuración y coste pendientes. Una herramienta web no cubre automáticamente el binario nativo. [UMP de Google](https://support.google.com/admob/answer/10113209?hl=en), [CMP y finalidades](https://support.google.com/admob/answer/7666519?hl=en).

**Consent Mode** transmite estados a productos de medición/publicidad; no sustituye la CMP ni significa que la persona haya aceptado. Separar publicidad de editores, analítica y captación Google Ads. Si se conecta UMP con Consent Mode, configurar explícitamente los productos y finalidades y verificar el resultado; no deducir permiso de analítica por poder solicitar anuncios. [Configuración Consent Mode en AdMob](https://support.google.com/admob/answer/16053245?hl=en).

Los anuncios no personalizados aún pueden usar cookies/identificadores para frecuencia y medición, y requerir consentimiento. No usar `requestNonPersonalizedAds` como bypass. Los modos limitados/técnicos necesitan evaluación propia; no son la alternativa automática cuando el usuario rechaza. La base conservadora propuesta es mantener desactivada la publicidad cuando no se pueda demostrar que la modalidad está permitida. [Anuncios no personalizados](https://support.google.com/adsense/answer/9007336?hl=en-GB).

En iOS, **ATT es distinto del consentimiento RGPD/TCF**: evaluar si la implementación rastrea según Apple y solicitar autorización cuando corresponda. Negar ATT no debe impedir buscar, comprar o recoger; no hacer fingerprinting como sustitución del identificador. UMP puede participar en la presentación del mensaje ATT si se configura, pero no convierte un estado UMP en autorización Apple. [Privacidad y uso de datos Apple](https://developer.apple.com/app-store/user-privacy-and-data-use/).

Propuesta operativa de Foodtrucks: decisión granular, rechazo accesible, enlace permanente para cambiar preferencias, elecciones actualizadas, datos mínimos y registro de versión/finalidades sin guardar indiscriminadamente identificadores. La capa necesaria de CMP puede realizar sus propias comunicaciones para presentar/gestionar opciones: inventariarlas y declararlas. No afirmar que un aviso equivale a consentimiento ni que se garantiza cumplimiento RGPD. Coordinar con [seguridad](19-seguridad.md) y la arquitectura de medición.

Al retirar permiso, detener nuevas solicitudes, desmontar anuncios visibles, cancelar preloads/reintentos y descartar callbacks iniciados bajo un estado anterior. Una petición ya transmitida no puede deshacerse; retirar el nodo de un script no elimina código previamente ejecutado. Verificar las APIs de revocación del proveedor y, en web, valorar recarga para restablecer un contexto limpio. No cambiar una simple variable React y anunciar que se han borrado todos los datos de terceros.

## Integración Next.js propuesta

Inspeccionar `package.json`, router y versiones cuando exista código. No hay versión de Next.js instalada verificada ni App Router/Pages Router detectado en este paquete. La guía siguiente es un diseño de integración, no una modificación de la aplicación.

1. Definir un mapa explícito de rutas editoriales admitidas y de zonas. Fallo de clasificación o configuración: sin anuncios. No decidir elegibilidad por un `startsWith` que incluya accidentalmente una ruta privada.
2. Un único responsable de cargar el script oficial, en un ámbito público/editorial. Montarlo después de resolver la CMP y solo con el flag de entorno, la modalidad permitida y el slot aprobado. No usar el layout global para introducir publicidad en todos los recorridos.
3. `next/script` puede evitar cargas repetidas del script; escoger `afterInteractive` o `lazyOnload` según medición. Sus estrategias no sustituyen la condición de consentimiento ni la política de rutas. No cargarlo antes de la hidratación como optimización automática, ni usar `worker` experimental para eludir compatibilidad. [Scripts de Next.js](https://nextjs.org/docs/app/guides/scripts).
4. Usar código de unidad oficial del panel sin manipular clics/creativo. Cada instancia DOM válida se inicializa una vez, cuando existe y tiene tamaño útil; no volver a ejecutar `adsbygoogle.push` sobre un nodo ya rellenado. Probar Strict Mode, hidratación y navegación SPA. La deduplicación del script no deduplica cada slot.
5. Al cambiar de ruta, desmontar el slot anterior, impedir que callbacks tardíos creen anuncios en la nueva pantalla y montar solo unidades admitidas. No pedir un anuncio cada vez que cambie el estado del carrito o un filtro. No inventar una frecuencia de refresco manual.
6. Reservar espacio estable, separar del contenido, controlar CLS y conservar lectura sin JavaScript publicitario. Fallo de red, ad blocker, no-fill, CMP no disponible o error del proveedor: contenido accesible y compras intactas, sin reintentos infinitos ni mensajes culpabilizadores.

La estrategia AdSense inicial propuesta usa slots manuales; **Auto ads permanece desactivado**, incluidas inserciones automáticas intrusivas. La revisión futura debe probar rutas visitadas directamente y navegación cliente: una librería cargada en una guía puede seguir ejecutándose al pasar a checkout. Al no poder garantizar su aislamiento, mantener esa modalidad desactivada o establecer una frontera de navegación limpia antes de publicar.

Posibles archivos, a adaptar al monorepo real: componente cliente `AdConsentProvider`, componente `EditorialAdSlot`, política de rutas y configuración de despliegue. Son nombres de responsabilidades propuestas; no existen componentes, tests, IDs ni dependencias añadidos por este documento.

## AdMob: SDK y configuración por plataforma

**Candidato comunitario:** `react-native-google-mobile-ads`, mantenido por Invertase, que envuelve Google Mobile Ads y UMP. No es un SDK oficial React Native de Google. Se propone por su documentación de Expo, consentimiento y formatos; hay que comprobar mantenimiento, licencia, versiones y compatibilidad con Expo/React Native/New Architecture del repositorio final antes de adoptarlo. No añadir Firebase Authentication o Firestore para mostrar anuncios. [Documentación del mantenedor](https://docs.page/invertase/react-native-google-mobile-ads).

El módulo contiene código nativo y **no funciona en Expo Go**. Requiere development build/binario propio y config plugin; Expo permite incorporar bibliotecas nativas en ese flujo. Probar iOS y Android y medir impacto en arranque, memoria, batería y fluidez. Un OTA JavaScript no incorpora un SDK nativo ausente. No regenerar carpetas nativas con limpieza si hay cambios Swift/Kotlin de Mapbox, pagos o Live Activities sin comprobar cómo se preservan. [Instalación Expo del módulo](https://docs.page/invertase/react-native-google-mobile-ads/installation/expo), [development builds Expo](https://docs.expo.dev/develop/development-builds/introduction/).

Ejemplo **solo de forma**, no instalable con marcadores y no añadido a un `app.json` real:

~~~json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "<ADMOB_APP_ID_ANDROID_DE_PRUEBA>",
          "iosAppId": "<ADMOB_APP_ID_IOS_DE_PRUEBA>",
          "delayAppMeasurementInit": true
        }
      ]
    ]
  }
}
~~~

Los nombres camelCase anteriores corresponden a la documentación actual del config plugin; verificar la versión instalada. La opción de retraso evita que la medición de Mobile Ads arranque antes de inicialización/carga; no bloquea por sí sola otros SDK. App ID —habitualmente con `~`— y ad unit ID —con `/`— son valores diferentes y deben ser válidos para cada plataforma. La ausencia de App ID válido puede causar un fallo nativo incluso si la UI no muestra un banner. Un build sin publicidad debería omitir el módulo; un build de prueba que lo incluya requiere la configuración nativa de prueba correcta. [Referencia del plugin](https://docs.page/invertase/react-native-google-mobile-ads/config-plugin).

Para ATT/SKAdNetwork revisar los campos exigidos por la versión de SDK y los socios realmente usados. No copiar listas antiguas de redes ni introducir una descripción de tracking si el comportamiento real no la justifica. EAS es una opción de compilación; no se contratan builds ni se envía una versión a tiendas con esta evaluación.

### Inicialización y vida del anuncio

Propuesta de secuencia, sin implementación ni llamadas ejecutadas:

1. Comprobar flag desactivable, superficie admitida y entorno. Si no hay experimento autorizado, no iniciar Mobile Ads ni cargar/preload anuncios.
2. Configurar límites y dispositivos de prueba antes de inicialización. Resolver las elecciones mediante UMP actualizado al iniciar la app y el formulario requerido.
3. Consultar `canRequestAds`; no deducirlo de `OBTAINED`, que indica que se recogió una respuesta y puede incluir rechazo. No sustituir UMP por un booleano guardado indefinidamente.
4. Inicializar Mobile Ads una sola vez después de que el SDK y la política local permitan solicitar. Si distintas rutas del flujo terminan a la vez, proteger la inicialización y la carga contra duplicados.
5. Cargar una unidad de prueba admitida y renderizarla solo en la pantalla válida y activa. Comprobar elegibilidad otra vez al solicitar, al volver a foreground y al cambiar preferencias.
6. Liberar listeners/objetos al desmontar; invalidar callbacks tardíos; no mostrar un anuncio reservado después de que el usuario haya entrado en menú/checkout.

Google pide actualizar información de consentimiento en cada inicio, comprobar `canRequestAds` antes de solicitar y evitar solicitudes duplicadas. Si UMP falla puede conservar información previa: usar su resultado vigente, no asumir permiso por el error ni reconstruirlo a partir de una cadena cacheada propia. La propuesta de Foodtrucks mantiene silencio publicitario cuando la autorización local es desconocida. [UMP Android](https://developers.google.com/admob/android/privacy), [UMP iOS](https://developers.google.com/admob/ios/privacy).

Proporcionar acceso visible a opciones de privacidad según UMP y reevaluar tras modificación. `canRequestAds` no significa permiso para personalizar, rastrear con ATT o recopilar analítica. `AdsConsent.reset()` es una herramienta de pruebas; no usar reset silencioso en producción para repetir solicitudes hasta obtener aceptación. [Adaptador de consentimiento Invertase](https://docs.page/invertase/react-native-google-mobile-ads/european-user-consent).

### Formatos y frecuencia

| Formato | Propuesta Foodtrucks | Protección |
| --- | --- | --- |
| Banner adaptativo | Solo candidato para lector editorial real | Espacio fijo, separado de dock, safe areas, controles y teclado; sin obstaculizar lectura |
| Nativo | Candidato posterior con diseño revisado | Atribución publicitaria y AdChoices intactos; diferenciarlo de vendedor y contenido editorial |
| Intersticial | Desactivado | No al abrir, pagar, confirmar, consultar QR o recoger; exigir un punto de pausa natural y caso medido antes de reconsiderar |
| Recompensado/recompensado intersticial | Desactivado, sin caso aprobado | Voluntario y con revisión de política, economía, fraude y financiación antes de cualquier propuesta |
| App open | Desactivado | No interrumpir acceso inmediato a mapa o pedido |

Los anuncios nativos necesitan respetar la atribución y los componentes del SDK; no construir una tarjeta HTML equivalente y declararla compatible. [Renderizado nativo Google](https://developers.google.com/admob/android/native/advanced).

No convertir recompensados en una fuente automática de puntos/descuentos: Google prohíbe recompensas monetarias directas y condiciona las indirectas a plataforma propia/no transferibilidad; los descuentos de bienes físicos tienen restricciones específicas. No se propone un porcentaje ni una implementación para Foodtrucks; los puntos por compra no cambian. Un futuro caso exigiría revisar también las condiciones del marketplace y validar el beneficio. [Políticas de recompensas](https://support.google.com/admob/answer/7313578?hl=en).

La frecuencia máxima y el refresco deben definirse antes de una prueba autorizada, según formato y comportamiento permitido. Medir exposición por sesión sin asociarla a contenido sensible. No introducir una regla arbitraria de cada N pedidos/minutos como requisito aprobado.

### IDs de prueba y separación de entornos

Usar las unidades de demostración oficiales de Google y sus constantes correspondientes en la versión comprobada del adaptador, por ejemplo `TestIds.BANNER`, `TestIds.ADAPTIVE_BANNER` o `TestIds.NATIVE`. No son IDs de producción de Foodtrucks. Las unidades de prueba no sustituyen App IDs válidos ni configuración UMP. Registrar dispositivos físicos de QA como test y verificar la etiqueta de prueba antes de interactuar. [Pruebas Google Android](https://developers.google.com/admob/android/test-ads), [guía del mantenedor](https://docs.page/invertase/react-native-google-mobile-ads/testing).

| Entorno | Política propuesta |
| --- | --- |
| Desarrollo y CI | Sin SDK inicializado por defecto; mocks para tests de lógica, demo units para QA nativo explícito |
| Staging/preview | Flags apagados; prueba aislada autorizada con demo units y dispositivos de QA, nunca inventario live |
| Producción antes del experimento | Desactivado, aunque el sitio/app se haya verificado |
| Producción experimental | Habilitación acotada tras requisitos, aprobación y revisión; kill switch operativo por canal/slot |

No seleccionar inventario live solo porque `__DEV__` sea false: staging puede compilar en release. Los nombres de flags son propuestas (`ADS_WEB_ENABLED`, `ADS_NATIVE_ENABLED`, `ADS_TEST_MODE`); aplicar configuración efectiva validada al compilar/desplegar y mecanismo de apagado adecuado al producto. IDs publicitarios suelen ser públicos, pero su exposición no autoriza uso. Tokens/API administrativas, firmas de tienda y credenciales permanecen en servidor/secretos del CI.

## ads.txt y app-ads.txt: configuración coordinada

Archivos distintos, sin autenticación ni secretos:

| Archivo/URL de ejemplo | Cuenta inventariada | Lugar propuesto al implementar |
| --- | --- | --- |
| `https://dominio.example/ads.txt` | Editor AdSense autorizado para ese inventario web | `apps/web/public/ads.txt`, si el monorepo real confirma ese layout |
| `https://dominio.example/app-ads.txt` | Editor AdMob autorizado para las apps | `apps/web/public/app-ads.txt`, con el sitio de desarrollador declarado en tiendas |

Formato documental de una línea para relación directa con Google:

~~~text
google.com, pub-<PUBLISHER_ID_DEL_PRODUCTO>, DIRECT, f08c47fec0942fa0
~~~

`pub-<...>` es un **marcador no válido**; `f08c47fec0942fa0` es el identificador de certificación pública de Google, no una clave ni un ID de Foodtrucks. Copiar la línea exacta de cada panel al configurar. No asumir que AdSense y AdMob comparten editor, ni usar el App ID `ca-app-pub-...~...` o una unidad `/...` como publisher ID. `DIRECT` exige controlar directamente la cuenta; usar `RESELLER` solo con la relación comprobada. [Campos ads.txt](https://support.google.com/adsense/answer/9785052?hl=en).

AdMob localiza `app-ads.txt` a partir del **sitio de desarrollador de la ficha de tienda** y de su hostname; una ruta `/descargar-app` no cambia que el archivo esté en la raíz. Coordinar host canónico y reglas para `www`/subdominios, sin depender de un asset host no declarado. Publicar, dejar rastrear y solicitar verificación en el panel cuando proceda. Los nuevos registros de apps necesitan esta verificación antes de la revisión de readiness y del servicio completo; no promete aprobación. [Configurar app-ads.txt](https://support.google.com/admob/answer/9363762?hl=en-GB), [verificar app](https://support.google.com/admob/answer/14538460?hl=en-topic).

Configuración de [Cloudflare/Caddy](29-cloudflare-dominio-dns.md), a comprobar al implementar:

- Resolver el host bajo control del titular y preservar HTTPS. Mantener ambos paths públicos exactos: respuesta `200`, texto plano correcto, sin login, CMP overlay, HTML de SPA, pantalla Access ni challenge de navegador.
- Elegir un responsable de servir los archivos: Next.js `public/` o montaje estático específico en Caddy. No crear dos copias divergentes. Caddy debe mantener el path; un `handle_path` que quite el prefijo de un archivo exacto puede enviarlo a un destino distinto.
- Evitar caché prolongada de 404 o una versión antigua; respetar política acotada de origen y purgar estas dos URLs tras cambios. No introducir Cache Everything global ni exceptuar seguridad de toda la aplicación.
- Crawler público no equivale a cuenta autorizada: no abrir API, pedidos, uploads privados o secretos para facilitar verificación. Mantener `/api/v1` y los webhooks con su política propia.
- Los archivos se versionan una vez aprobados sus valores públicos; las cuentas/credenciales no. No subir ahora un archivo con marcadores a un dominio ajeno/no controlado.

Pruebas futuras, no ejecutadas contra infraestructura Foodtrucks:

~~~sh
curl --head https://dominio.example/ads.txt
curl --head https://dominio.example/app-ads.txt
curl --fail https://dominio.example/ads.txt
curl --fail https://dominio.example/app-ads.txt
~~~

Revisar contenido y redirecciones completas además del HEAD; los marcadores no deben aparecer en respuestas de producción. Una descarga correcta no equivale a la verificación positiva del panel del proveedor.

## Medición, seguridad y rendimiento

Registrar, si está permitido, carga/no-fill/error, exposición y métricas de ingreso suministradas por el proveedor. No contabilizar ingreso estimado como cobro conciliado ni duplicar eventos automáticos de SDK con eventos manuales. El contrato común de analítica debe separar `ad_impression`, proveedor/formato y moneda de `purchase` de comida y de Billing.

Nunca adjuntar nombres, emails, teléfonos, dirección del cliente, ubicación precisa, QR, token, Stripe customer/account ID ni contenido de notas/alérgenos a eventos publicitarios. No usar las preferencias alimentarias o los pedidos como segmentos publicitarios por defecto. No enviar datos con el supuesto de que hashearlos elimina la condición personal.

En web revisar CSP y dominios exigidos por el flujo elegido con la integración real; no resolver bloqueos con comodines universales, TLS desactivado o `unsafe-eval` global. Probar primero una política de observación adecuada y mantener protecciones de pago/auth. Mantener el código oficial del anuncio aislado de validación económica y autorización Go.

En móvil declarar recopilación/compartición del SDK real y proveedores de mediación, permisos, tracking y finalidades en tiendas y política de privacidad. Google Play exige incluir tratamiento de SDK de terceros; Apple requiere que los detalles reflejen el comportamiento efectivo. No afirmar que usar UMP completa por sí solo todos esos campos. [Data safety Google Play](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en), [App Privacy Apple](https://developer.apple.com/app-store/app-privacy-details/).

Mantener fuera del piloto redes de mediación adicionales y segmentación infantil hasta justificar y verificar sus requisitos. Elegir audiencia/países y medidas para usuarios menores antes de activar. Una publicidad contextual también implica un proveedor externo y debe entrar en el inventario de tratamiento.

Comparar contra una base sin anuncios: pedidos completados, abandono de checkout, retención, fallos y [rendimiento](16-rendimiento.md), además del ingreso por usuario/sesión editorial. LCP/INP/CLS de campo y laboratorio en web; arranque, frames, memoria y batería en release móvil. El objetivo adaptativo de 120 FPS sigue vigente; no se ha medido. Un aumento de impresiones que perjudique pedidos no es éxito del marketplace.

## Entregables y aceptación de una futura implementación

**No se han ejecutado tests de aplicación, red, CMP, SDK, dispositivos ni aprobación de anuncios.** Este documento deja preparados los criterios y el runbook; al existir código se usarán scripts reales del repositorio y sus versiones fijadas.

| Verificación | Evidencia requerida |
| --- | --- |
| Inventario elegible | Lista de rutas/pantallas, responsable editorial y exclusiones comprobadas en navegación directa/SPA |
| Estado inicial/entornos | Sin anuncios ni inicialización de Mobile Ads al apagar flags; staging release no sirve inventario live |
| Consentimiento | Aceptar, rechazar, granular, retirar, expiración, región y error; sin solicitudes indebidas/preloads; ATT independiente |
| Ciclo de vida | Doble montaje, rotación, background/foreground, vuelta atrás, navegación a checkout y callback tardío no duplican/muestran anuncios excluidos |
| Error/ad blocker/no-fill | Contenido y pedidos funcionan; sin bloqueo, loops ni huecos que provoquen toque accidental |
| Tráfico de prueba | Demo units oficiales, etiquetas verificadas, QA físico, ningún click automatizado sobre anuncios live |
| Archivos/verificaciones | HTTPS/200/texto correcto, publisher autorizado, sin marcadores/challenges y estado de verificación del panel |
| Privacidad/seguridad | Política y tiendas concordantes, datos mínimos, CSP probada y ausencia de IDs personales/secretos en telemetry |
| Experimento | Base y periodo comparables, ingresos separados, efecto en pedidos/retención y mecanismo de apagado probado |

La revisión documental no constituye auditoría exhaustiva de políticas ni validación legal. Antes de lanzar, repetir revisión de fuentes, versión de SDK, CMP certificada/plataforma y condiciones del panel. Un fallo de privacidad, colocación o estabilidad obliga a apagar el canal/slot afectado y corregir antes de continuar; no compensarlo comprando más tráfico.

Rollback propuesto: apagar flags, detener nuevas solicitudes, retirar unidades activas y ejecutar el procedimiento de limpieza/revocación soportado. Si cambia la dependencia nativa o los datos declarados, preparar binario y fichas actualizadas; no asumir que un switch JavaScript desinstala código nativo ni borra datos enviados. Mantener los archivos de autorización coherentes con relaciones que siguen vigentes, sin eliminar otros vendedores autorizados por error.

## Decisiones pendientes para el piloto publicitario

- Si conviene monetizar con anuncios y qué contenido editorial alcanza calidad suficiente; prioridad respecto a MVP y Google Ads.
- Control efectivo del dominio de referencia, cuenta/titular de editores y apps, países, edad objetivo y revisión de elegibilidad.
- CMP web/app, configuración TCF/Consent Mode/ATT, proveedores y revisión especializada del tratamiento.
- Versiones Expo/React Native/SDK, módulo comunitario, workflow nativo y posibles campos de tiendas.
- Formatos, tamaños/slots admitidos, frecuencia, objetivos y umbrales medidos de detener el experimento.
- Relación de membresía con anuncios, si se desea plantearla; **no hay beneficio sin anuncios confirmado**.
- Publisher/App/Unit IDs reales y archivos públicos, que se obtendrán del panel solo al configurar; presupuesto/coste operativo y responsables.

La incorporación del prompt autoriza esta evaluación y planificación documental. No activa Google AdSense/AdMob, no compra el dominio, no publica contenido ni cambia suscripciones, pagos o puntos.
