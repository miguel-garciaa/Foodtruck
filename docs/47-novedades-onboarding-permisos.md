# Novedades, onboarding y permisos de dispositivo

**Versión documental:** 1.8 · **Fecha:** 14 de octubre de 2026 · **Estado:** especificación para desarrollo posterior. No hay tarjetas, onboarding, permisos nativos o tests de aplicación implementados por este documento.

Complementa [UX/UI](04-ux-ui.md), [Design System](05-design-system.md), [frontend](08-frontend.md), [Mapbox](12-mapbox.md), [avisos](15-notificaciones-tiempo-real.md), [decisiones](23-decisiones-pendientes.md) y [QA](40-testing-qa-github.md). Conserva React Native + Expo + TypeScript, Mapbox nativo, development build, claro/oscuro, dock únicamente nativo y header web. SDK Expo, versiones compatibles, mínimos de SO e idiomas siguen pendientes.

## 1. Decisiones y alcance de las referencias

**Confirmado por el usuario:** presentar Novedades únicamente cuando existan cambios relevantes, una vez por versión que los incorpore. El calendario aportado se utiliza solo como filtro de fechas en administración; no incorpora reservas ni integración con el calendario del dispositivo.

**Base propuesta:** introducción inicial breve y opcional; tarjetas informativas adaptadas a Foodtrucks; persistencia local sencilla; permisos en el momento de usar una función. Los textos de botones de este documento son ejemplos funcionales, no copy ni idiomas finales aprobados.

| Referencia aportada | Qué orienta | Qué no incorpora al producto |
| --- | --- | --- |
| [03. What's New](assets/referencias-ui/03-whats-new.png) | Título claro, filas con icono y descripción, CTA destacado y acción secundaria | Voz, conversaciones con IA, micrófono, marca, color o composición final de la app mostrada |
| [04. Indicadores de pasos](assets/referencias-ui/04-step-indicators.png) | Página activa, posición y navegación manual | Un número obligatorio de pasos, avance automático o requisito de completar un tutorial |
| [02. Calendario](assets/referencias-ui/02-calendar.png) | Selección de fechas para filtrar datos del administrador | Reservas, franjas comerciales nuevas, sincronización o permiso de calendario del SO |

Las imágenes son ejemplos de lenguaje visual. No acreditan selección de componente, licencia para copiar recursos, diseño Figma aprobado ni implementación. Reutilizar tokens y componentes adecuados a cada plataforma, sin copiar la pantalla de otro producto. La referencia oscura también debe funcionar en claro. No inferir idiomas del selector mostrado en otra imagen.

## 2. Novedades: relevancia y presentación única

Una actualización técnica, recompilación o cambio de número de build no justifica por sí solo abrir Novedades. El contenido describe beneficios concretos que ya pueden utilizarse. No anunciar capacidades pendientes, ocultas por flag, incompatibles con el dispositivo o inaccesibles para el rol actual.

La implementación propuesta mantiene un catálogo pequeño versionado junto al frontend. Cada entrada agrupa las novedades de una actualización en una única presentación con `newsId` estable, versión de disponibilidad, audiencias, plataformas compatibles, contenido y destinos internos permitidos. `newsId` identifica la presentación de esa actualización, no cada fila o página. Filtrar su contenido para el rol/plataforma antes de mostrarla; no crear una apertura independiente por cada novedad. No hace falta un CMS, servicio de campañas ni sincronización entre dispositivos para resolver esta necesidad inicial.

| Condición | Comportamiento propuesto |
| --- | --- |
| Versión compatible, rol autorizado y función realmente disponible | Puede optar a una presentación automática |
| Plataforma/SO/build incompatible o función desactivada | No mostrar ese anuncio ni su CTA |
| Ningún cambio relevante para el rol | No abrir ni marcar consumida una presentación que no llegó a mostrarse |
| `newsId` ya presentado en esa plataforma | No abrir automáticamente otra vez, incluso tras reinicio, cambio de rol o hotfix |
| Varias versiones omitidas | Resumen corto de las novedades aún útiles; evitar una sucesión de modales antiguos |
| No hay contenido relevante | Abrir la experiencia normal sin tarjeta vacía ni anuncio genérico |
| Cambia la sesión o el modo cliente/comerciante | Reevaluar contenido y destinos permitidos; si la presentación ya se consumió, mantener solo la consulta voluntaria desde Perfil; no conservar información privada del contexto anterior |

**Persistencia local propuesta:** guardar la presentación consumida por `newsId` y plataforma después de que el contenido se haya mostrado correctamente, sin una clave independiente por rol o por cada novedad. Así, varias filas/páginas de la misma actualización y un cambio de rol no generan otra apertura automática. Registrar opcionalmente la decisión de CTA o cierre; no utilizar este estado para conceder permisos, membresías o derechos. La presentación queda consumida al mostrarse, también si se cierra con atrás o gesto. Una tarjeta que no llegó a ser visible no se registra como presentada. La reinstalación/borrado de datos puede reiniciar este estado; no prometer unicidad entre dispositivos sin decidir sincronización.

El CTA, por ejemplo «Ver novedades» o «Probar función», cierra la tarjeta y abre un destino interno validado. «Ahora no» cierra y mantiene consumida la presentación automática: no programa recordatorios ni vuelve a abrirla en la próxima sesión. Ambos permiten consultar después el contenido desde **Perfil → Novedades**. Reabrir desde Perfil es una acción voluntaria y no reinicia el estado. Antes de navegar, revalidar que el destino siga disponible. El servidor autoriza cualquier operación protegida aunque el CTA se haya mostrado.

Si la persistencia falla, evitar aperturas repetidas durante esa sesión y conservar la consulta voluntaria desde Perfil; no bloquear la compra ni afirmar que el estado quedó guardado. Proteger doble toque y aperturas simultáneas con estado local mínimo, sin un gestor global nuevo por este flujo.

## 3. Momento seguro, composición y pasos

Mostrar Novedades cuando la app esté activa, haya terminado la recuperación inicial de sesión/datos relevantes y no exista otra presentación. Preferir Explorar o Perfil en un momento libre. No abrir al recibir cada push, al reanudar cualquier pantalla ni sobre un diálogo del SO.

**No interrumpir** carrito, checkout/pago y su retorno, seguimiento de un pedido activo, visualización/canje de QR, escáner, edición con datos sin guardar o tareas operativas del comerciante. Si se pospone por ese contexto, mantenerlo pendiente hasta un momento seguro; no marcarlo presentado antes de abrirlo. Reanudar la app no obliga a abandonar la tarea en curso. No usar promociones, urgencia ficticia o ventajas económicas sin condiciones aprobadas para forzar el CTA.

La tarjeta admite título, una explicación breve, pocas filas con icono/texto y las dos acciones. Si hay una sola página, omitir puntos y flechas. Para varias, ofrecer anterior/siguiente y posición textual accesible, por ejemplo «2 de 3»; los puntos no son el único control. No autoplay, cambios de página por temporizador ni gestos como única forma de avanzar. Respetar movimiento reducido, texto ampliado, foco, VoiceOver/TalkBack, teclado web y restauración del foco al cerrar. No truncar información necesaria para decidir.

El modal o sheet se adapta al sistema, a ambos temas y al espacio disponible. Evaluar primero los controles nativos de `@expo/ui` compatibles con el SDK elegido; no fijar una API o dependencia de una versión futura. No convertir la tarjeta en una pantalla permanente del dock ni introducir dock en Next.js.

## 4. Onboarding opcional

La base propuesta es una introducción que ayude a descubrir puestos, pedir y recoger con QR, usando únicamente funciones disponibles para ese rol. Puede reutilizar la jerarquía visual de la referencia 03 y los indicadores de la 04, con contenido propio; no convierte la app en un producto de voz.

Preferir aprendizaje en contexto y un recorrido breve con salida «Ahora no» o «Omitir». No repetirlo automáticamente después de completarlo u omitirlo; permitir consultarlo desde Ayuda/Perfil. Su estado es independiente de `newsId`: una novedad no reinicia la introducción. No obligar a memorizar instrucciones, conceder permisos, suscribirse o aceptar marketing para explorar lo disponible. Este tutorial no sustituye alta comercial, verificación de identidad, Connect o requisitos contractuales de sus propios flujos.

Apple recomienda una introducción opcional y solicitudes de permisos al acceder a la función que las necesita cuando no son imprescindibles para que la app funcione. Esa guía apoya la base propuesta; no demuestra aprobación de un diseño concreto. [Apple HIG: Onboarding](https://developer.apple.com/design/human-interface-guidelines/onboarding).

## 5. Tarjeta propia y autorización del sistema

Novedades y onboarding explican el producto. Un preaviso de permiso explica un acceso concreto. Solo el diálogo nativo o selector del sistema produce la autorización correspondiente; pulsar un botón propio no significa que ubicación, cámara o notificaciones estén concedidas.

Preferir explicación integrada junto a «Usar mi ubicación», «Activar avisos de pedido» o «Escanear QR». No mostrar una secuencia inicial de ubicación → notificaciones → cámara. Cada función comprueba su permiso y lo solicita por una acción intencionada cuando corresponde.

| Plataforma | Preaviso si resulta necesario |
| --- | --- |
| iOS | Un único botón neutral «Continuar»/«Siguiente» que abre el diálogo nativo; sin «Permitir», «Ahora no», cancelar o cerrar dentro del preaviso |
| Android | Rationale contextual cuando corresponda, con posibilidad de cancelar y seguir usando las funciones disponibles |

No copiar el diálogo del SO, simular que un toggle propio lo concede, dibujar la respuesta recomendada ni inducir a elegir «Permitir». La salida opcional de Novedades/onboarding no se traslada al preaviso iOS. Apple lo expresa así: “Include only one button and make it clear that it opens the system alert.” [Apple HIG: Privacy](https://developer.apple.com/design/human-interface-guidelines/privacy). Android exige una explicación cancelable y degradación útil ante rechazo, según su flujo de permisos. [Android: solicitudes runtime](https://developer.android.com/training/permissions/requesting).

## 6. Accesos mínimos de Foodtrucks

| Recurso / actor | Acción que justifica el acceso | Alcance y alternativa propuestos |
| --- | --- | --- |
| Ubicación de cliente | «Usar mi ubicación» al explorar/mapa | Primer plano; admitir aproximada; ciudad/zona manual y mapa/lista sin GPS |
| Ubicación de comerciante | «Usar mi ubicación» al configurar el punto público | Obtención puntual en primer plano; revisar/confirmar antes de publicar; posición manual alternativa |
| Notificaciones | Activar avisos operativos de pedido | Opcionales; seguimiento y recuperación de estado por API disponibles sin permiso |
| Cámara de comerciante | Abrir el escáner QR para recogida autorizada | Cámara solo durante el escáner; rechazo no bloquea el resto de operación |
| Cámara de cliente | Mostrar su ticket QR | No se solicita: mostrar un código no utiliza cámara |
| Fotos de comerciante | «Elegir foto» de puesto/producto | Selector del SO, solo imágenes seleccionadas; cancelación sin cambios y sin acceso general a la biblioteca |
| Micrófono, contactos y calendario del dispositivo | Ninguna función del alcance actual | No solicitarlos; no deducir permisos de las referencias visuales |

### Ubicación

La API candidata es `getForegroundPermissionsAsync` / `requestForegroundPermissionsAsync`; en iOS, primer plano corresponde a `When In Use`. Interpretar precisión reducida/coarse como un resultado válido. Si los servicios de ubicación están apagados o la lectura falla, distinguirlo de permiso denegado y ofrecer entrada manual. No exigir precisión exacta para descubrir puestos. [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/).

No solicitar `Always`/background, iniciar servicios de rastreo, geofencing o seguir al comerciante/cliente en segundo plano por este diseño. Detener suscripciones al salir de la función o perder actividad. Para el puesto, obtener una posición no publica automáticamente la ubicación: Go valida y autoriza negocio/coordenadas, y las reglas sobre cambios con pedidos activos continúan pendientes. [Mapbox y ubicaciones](12-mapbox.md).

### Notificaciones

Solicitar al activar avisos de pedidos, después de explicar su utilidad; nunca como consecuencia de cerrar Novedades. En Android 13+ existe `POST_NOTIFICATIONS`: con target 33+ la app controla el momento; con target 32 o inferior, crear el primer canal y abrir una actividad puede causar el diálogo automático. Comprobar target/SO reales antes de fijar la secuencia; cerrar el diálogo sin elegir no equivale a autorización. [Android: permiso de notificaciones](https://developer.android.com/develop/ui/compose/notifications/notification-permission).

Expo indica crear el canal Android antes de obtener el token con `getDevicePushTokenAsync`/`getExpoPushTokenAsync`. Coordinar canal, solicitud contextual y registro de token según SDK; un token no prueba entrega. En iOS consultar `ios.status`: `AUTHORIZED`, `PROVISIONAL` y `EPHEMERAL` tienen alcances distintos; provisional permite avisos no interruptivos y ephemeral es temporal. Revisar alertas/sonidos/badges, sin tratar todos esos estados como permiso completo ni solicitar provisional por defecto. [Expo Notifications](https://docs.expo.dev/versions/latest/sdk/notifications/).

Mantener contenido mínimo en pantalla bloqueada y asociación de token con usuario/entorno actual; logout y cambio de cuenta no pueden conservar avisos privados. Push, Live Activities/Updates y pantalla de pedido mantienen sus contratos específicos; conceder push no habilita automáticamente todas las superficies nativas. [Avisos y privacidad](15-notificaciones-tiempo-real.md).

### Cámara y fotografías

Comprobar cámara al abrir el escáner y desmontarla cuando la pantalla pierda foco. Restringir la lectura al tipo QR; no ejecutar enlaces o instrucciones arbitrarias contenidos en él. Escanear no acredita pago ni canje: Go valida autorización, negocio, estado y uso único conforme al contrato existente. No inventar un canje offline como alternativa a cámara denegada. [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/), [QA de QR](40-testing-qa-github.md).

Para uploads, el selector del SO da acceso a elementos elegidos; evitar solicitar acceso general por anticipado. `launchImageLibraryAsync` es candidato para imágenes. La documentación Expo distingue excepciones de vídeo en iOS; no extrapolar «sin permisos» a cualquier flujo multimedia. No incorporar captura de foto/vídeo por estas referencias. [Android Photo Picker](https://developer.android.com/training/data-storage/shared/photo-picker), [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/).

Cancelar conserva el formulario sin subir nada. Manejar pérdida de actividad/resultado según la integración elegida. Go autoriza el puesto y valida tamaño, MIME real, decodificación, dimensiones y almacenamiento; el filtro del picker no sustituye controles de subida. Mantener fotos persistentes locales y backups, conforme a [media](18-media-backups-operacion.md).

## 7. Estado real, denegación y vuelta desde ajustes

Los tipos actuales de Expo incluyen `status`, `granted` y `canAskAgain`. La capacidad de volver a preguntar no es autorización ni motivo para insistir. Consultar el estado nativo antes de usar el recurso; no persistir «concedido para siempre» junto a Novedades. [Expo Location: PermissionResponse](https://docs.expo.dev/versions/latest/sdk/location/#permissionresponse).

| Estado observado | Respuesta de la función |
| --- | --- |
| Cargando/comprobando | Estado visible sin abrir otra solicitud ni activar el sensor |
| Concedido | Ejecutar solo la acción/alcance autorizado |
| Sin determinar | Solicitar tras la acción contextual, con explicación cuando corresponda |
| Denegado y `canAskAgain: true` | Conservar alternativa; otra solicitud solo por nueva acción expresa, respetando el rationale del sistema |
| Denegado y `canAskAgain: false` | No repetir request; explicar la limitación en esa función y ofrecer ajustes si el usuario desea habilitarla |
| Error/servicio apagado | Informar el problema concreto y recuperar por alternativa; no falsear un rechazo del usuario |

«Abrir ajustes» es voluntario, sin modal insistente al rechazar. `Linking.openSettings()` abre ajustes, pero su resolución no acredita un permiso concedido. Al retornar a `active` mediante `AppState`, releer el permiso relevante y actualizar la interfaz; gestionar el error de apertura y limpiar listeners/suscripciones. No repetir el diálogo por cada transición de actividad. Esta secuencia es una recomendación de implementación apoyada en [React Native Linking](https://reactnative.dev/docs/linking#opensettings) y [AppState](https://reactnative.dev/docs/appstate).

iOS puede conceder ubicación «Allow Once», indistinguible de «While Using» durante esa sesión según Expo. Android también tiene autorizaciones temporales y revocación. Volver a comprobar en la siguiente operación/sesión; no basar la lógica en un contador fijo de rechazos o en `expires: never`. [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/), [Android: permisos temporales](https://developer.android.com/training/permissions/requesting#one-time).

## 8. Configuración nativa y finalidades separadas

Antes de implementar, inspeccionar SDK, lockfile, plugins, proyecto nativo y manifiesto final. Las fuentes `latest` consultadas no fijan el SDK de Foodtrucks; sustituirlas por las de la versión elegida. Consultar `expo-overview`, `expo-ui` y `expo-native-ui`; las dos últimas orientan componentes/plataforma, sin cambiar la necesidad de development build para Mapbox ni probar permisos reales en Expo Go.

Personalizar mensajes nativos con el propósito real de ubicación/cámara. Los permisos añadidos por módulos también deben auditarse. Expo documenta `recordAudioAndroid: false` para evitar audio en `expo-camera`, y `microphonePermission: false` para bloquear `RECORD_AUDIO` de `expo-image-picker`. Si otro manifiesto lo introduce, evaluar `android.blockedPermissions` y verificar el resultado de la build. No solicitar micrófono ni copiar descripciones de voz. [Expo Camera](https://docs.expo.dev/versions/latest/sdk/camera/), [Expo ImagePicker](https://docs.expo.dev/versions/latest/sdk/imagepicker/), [Expo Permissions](https://docs.expo.dev/guides/permissions/).

Cambios de manifest, capacidades o mensajes de `Info.plist` requieren una build nativa nueva; no se entregan solo con OTA. Verificar el comportamiento del binario que se distribuirá y actualizar declaraciones de privacidad según datos realmente tratados. No añadir permisos de calendario, contactos, background location o alarmas exactas por reutilizar un ejemplo. [Expo Permissions](https://docs.expo.dev/guides/permissions/).

Permiso de ubicación/cámara/push, consentimiento de analítica/publicidad, ATT cuando aplique y preferencias de marketing son decisiones diferentes. Novedades, onboarding, membresía y activar avisos de pedidos no aceptan marketing ni habilitan medición no esencial. Aplicar [analítica y consentimiento](34-analitica-consentimiento.md) y [comunicaciones](15-notificaciones-tiempo-real.md); no recoger coordenadas, QR, tokens o contenido de fotos como eventos de uso de las tarjetas.

## 9. Pruebas futuras y aceptación

Los siguientes casos complementan QA16–19 y la [política de pruebas por cambio](44-politica-commits-ci-cd-tests.md). No son tests escritos o ejecutados en este paquete.

| Área | Comportamiento que debe demostrar la implementación |
| --- | --- |
| Novedades | Cambios relevantes de una actualización se agrupan en una presentación automática; varias filas/páginas o un cambio de rol no generan otra apertura; irrelevante/incompatible/flag apagado no aparece; CTA, «Ahora no», atrás, reinicio y almacenamiento fallido no causan bucles |
| Disponibilidad y acceso | Destino retirado no navega; cliente manipulado no accede a acciones del comerciante/admin; Go rechaza directamente operaciones ajenas aunque se eluda la UI |
| Momento seguro | Pago/retorno, carrito, pedido activo, QR/escáner y datos sin guardar no sufren interrupción; presentación pospuesta conserva estado correcto |
| Pasos y accesibilidad | Sin autoplay; anterior/siguiente, salida, posición textual, foco, lector, texto ampliado, movimiento reducido y ambos temas funcionan |
| Onboarding | Completar/omitir no fuerza permisos ni repite introducción; consulta voluntaria no reinicia Novedades |
| Ubicación | Sin determinar, concedido aproximado, temporal, revocado, denegado, `canAskAgain: false`, servicios apagados y fallo de lectura mantienen alternativa manual y detienen sensores |
| Notificaciones | Secuencia por SO/target/canal, rechazo/cierre del diálogo, provisional/ephemeral, ajustes, logout y cambio de cuenta; el pedido sigue recuperable sin push |
| Cámara/QR | Cliente muestra QR sin cámara; comerciante pide permiso al abrir escáner; salida libera cámara; doble lectura no produce doble canje y contenido hostil no ejecuta un enlace |
| Fotos | Solo imágenes elegidas, cancelación sin upload, pérdida de actividad y error; upload ajeno, MIME falso, tamaño/dimensiones inválidos rechazados por servidor |
| Configuración/privacidad | Binario no solicita recursos innecesarios; cambios nativos llegan en nueva build; rechazar permisos no activa analítica o marketing |

Probar lógica de elegibilidad y componentes con fakes de frontera; comprobar diálogos del SO, sensores, Mapbox y notificaciones en development/release builds y dispositivos compatibles. Los tests cliente verifican interacción, fallback y errores; los del servidor prueban autorización y reglas autoritativas, sin duplicar reglas de negocio complejas en React. No sustituir estas pruebas por snapshots de texto o comprobaciones que solo reflejan nombres internos.

**Aceptación de la implementación futura:** comportamiento anterior demostrado, controles y mensajes compatibles con el SDK/SO real, accesibilidad/temas revisados, errores corregidos y evidencia registrada por el cambio. **Estado de esta entrega:** políticas, referencias y casos documentados; no se han ejecutado tests nativos, concedido permisos, configurado push, compilado una app, publicado una actualización o realizado Git por este documento.

## 10. Fuentes y mantenimiento

Fuentes primarias de Apple, Android, Expo y React Native consultadas el **14 de octubre de 2026**, enlazadas junto a cada afirmación. Los nombres de APIs y condiciones son referencia actual para planificar; deben revalidarse contra el SDK, target y mínimos de plataforma al implementar. Fecha de consulta no significa fecha de publicación ni garantía de compatibilidad con una app todavía inexistente.

Skills aplicadas en esta actualización: `expo-overview` para alcance/versiones; `expo-ui` para selección prudente de controles; `expo-native-ui` para comportamiento y adaptación nativa. No se instalaron paquetes ni se ejecutaron sus scripts. Las capturas 03/04 se inspeccionaron como ejemplos; la disponibilidad de assets no equivale a diseño final aprobado.

Pendiente de concretar con el código/diseño real: SDK/versiones/mínimos, copy e idiomas, componente final, catálogo inicial de novedades y destinos existentes, dispositivos de prueba y necesidad de sincronizar el estado entre dispositivos. No añadir funciones o permisos para completar visualmente una referencia.
