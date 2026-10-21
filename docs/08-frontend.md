# Frontend: React Native, Expo y Next.js

## Decisiones vigentes

Móvil: React Native + Expo + TypeScript para iOS y Android. Web: Next.js con React/TypeScript, panel de comerciantes y administración. Flutter/Dart queda como historial sustituido.

La conversación propuso Expo Router y navegación con pantallas nativas, Reanimated 4/Worklets, Gesture Handler, Skia y FlashList. Mantener como herramientas de referencia; **versiones compatibles pendientes de fijar**. No instalar toda la lista sin relación con pantallas reales.

## Móvil

Development build necesaria para Mapbox y código nativo; Expo Go no contiene esos módulos. Revisar configuración regenerable de Expo y plugins para no perder extensiones Swift/Kotlin al reconstruir.

Auth y sesiones en almacenamiento seguro del sistema. Mapa con SDK nativo mediante @rnmapbox/maps; pagos con SDK Stripe React Native/PaymentSheet. Cámara para QR solo en flujo autorizado. Dock inferior exclusivo de esta aplicación.

Clientes y comerciantes comparten app como base propuesta, con rutas y permisos por contexto. No confiar en que una pantalla esté oculta para autorizar acciones.

## Web

Header superior y menús responsive, sin dock incluso en navegador móvil. Integración Mapbox GL JS cargada en cliente; evitar evaluar APIs de navegador durante render de servidor.

Usar 21st.dev para componentes evaluados, con Tailwind donde encaje. Paneles pueden añadir sidebar contextual. El alcance de compra web equivalente a móvil sigue pendiente de confirmación; la arquitectura lo permite, pero no se fija como compromiso del primer MVP.

Las claves públicas de Mapbox/Stripe son configuración cliente controlada; claves secretas nunca entran en NEXT_PUBLIC_* ni EXPO_PUBLIC_*.

## Estado y llamadas

Estado local para formularios y UI. Caché de datos remotos con una biblioteca ligera como TanStack Query solo si compensa; fue añadida aquí como propuesta, no elegida en la conversación. No crear un estado global para todo.

Cliente HTTP compartido con timeout, cancelación, errores tipados y renovación coordinada de sesión. Reintentar GET transitorios con límites; mutaciones económicas solo con clave de idempotencia y recuperación del resultado.

No duplicar validación compleja del servidor. Mantener feedback inmediato de campos y presentar los errores de Go. No confiar en precios del carrito cliente.

## Herramientas

**Arranque local, 21/10/2026:** base Expo SDK 58/React Native 0.88/TypeScript en `apps/mobile`, npm con lockfile y development build Android. El usuario pospone el móvil físico; se compila e instala en Pixel_10. Incluye exploración, filtros, favoritos de sesión y carta con fixtures sintéticas, siguiendo las capturas aportadas. Mapbox nativo integrado, sin mapa online verificado por falta de configuración pública. La [guía de arranque](../apps/mobile/README.md) conserva comandos, requisitos y resultados reales; no acredita backend, web, iOS o funcionalidades comerciales. El identificador `com.foodtrucks.dev` es provisional y exclusivo de desarrollo.

Editor principal VS Code/Cursor/Codex según elección del usuario; Android Studio aporta SDK y emulador en el ordenador anfitrión. VM Ubuntu ejecuta servicios. Go puede editarse por Remote SSH o en checkout sincronizado; elegir un flujo sin copias divergentes.

Para simulador/compilación local iOS se necesita macOS/Xcode; VMware Ubuntu no los sustituye. EAS Build fue sugerido para compilación remota, sin contratación ni configuración realizada.

## Primera prueba técnica

Validar Expo + Mapbox + capas/agrupación + tarjeta + panel inferior animado en iOS y Android. Comprobar liberación de memoria, cambios de tema y gestos. Después integrar login, Stripe y superficies nativas.

Fuente: [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/), [instalación @rnmapbox/maps](https://rnmapbox.github.io/docs/install).

## Pantallas de beneficios y estado de cliente

Añadir contratación/gestión de membresía, ofertas, puntos e historial y selector de canje en checkout. El frontend nunca calcula el saldo gastable ni concede derechos a partir de un retorno de pago.

Stripe Billing web es propuesta; canal de contratación dentro de iOS/Android por validar con los beneficios/territorio finales. Recuperar el estado desde Go y evitar doble contratación entre dispositivos. No añadir un botón externo de pago hasta confirmar el flujo permitido.

## Configuración del dominio en web y móvil, base propuesta

Cloudflare será registrador/DNS y Resend enviará los correos. Todos los nombres siguientes son ejemplos bajo dominio.example, sin servicio configurado. Coordinar los valores con [DNS/Caddy](29-cloudflare-dominio-dns.md) y [correo/enlaces](30-correo-resend.md).

| Configuración propuesta | Ejemplo y alcance |
| --- | --- |
| WEB_ORIGIN | https://dominio.example; origen canónico validado por servidor |
| API_PUBLIC_ORIGIN | https://api.dominio.example; hostname API para móvil y webhooks |
| NEXT_PUBLIC_API_BASE_URL | /api/v1; propuesta web con proxy Caddy en el mismo origen |
| EXPO_PUBLIC_API_BASE_URL | https://api.dominio.example/api/v1; URL pública, nunca credenciales |
| ASSETS_PUBLIC_ORIGIN | https://assets.dominio.example, si se adopta; solo medios públicos |

Caddy conserva el prefijo /api/v1 hacia Go. Si se elige llamada web directa al hostname api, configurar CORS con orígenes exactos y cookies/CSRF coherentes; no añadir wildcard con credenciales. Los orígenes de staging y callbacks OAuth serán distintos y se registrarán explícitamente. Evitar compartir cookies de sesión con mail/assets/staging.

## Asociación dominio/app y retornos

Proponer enlaces HTTPS que abran el flujo móvil cuando la app esté instalada y tengan fallback web. iOS: archivo public/.well-known/apple-app-site-association en Next.js, Team ID/bundle ID reales y rutas limitadas; ios.associatedDomains con applinks:dominio.example. Servir JSON por HTTPS, sin challenge ni redirección del archivo. [Expo iOS Universal Links](https://docs.expo.dev/linking/ios-universal-links/).

Android: public/.well-known/assetlinks.json con package real y huellas SHA-256 de la firma adecuada, incluyendo Play App Signing cuando corresponda. Configurar android.intentFilters con autoVerify y host/rutas admitidos. Separar builds de desarrollo y release; no publicar huellas ficticias. [Expo Android App Links](https://docs.expo.dev/linking/android-app-links/).

Estos archivos y capacidades se añadirán cuando existan identificadores/firma, con build nativa apropiada y pruebas de apertura instalada/no instalada. Los nombres de ruta son por definir; no asociar todos los paths si bastan identidad y pedidos. Mantener los archivos públicos accesibles a los verificadores, con estrategia de caché que permita actualizar asociaciones.

El retorno Stripe muestra el resultado recuperado desde Go; nunca acredita pago por la URL. Los enlaces de email no consumen verificación/reset por un GET. Validar destinos internos y no aceptar redirección a un host arbitrario. Resend y Cloudflare no sustituyen los mecanismos de sesión de cada plataforma.

## SEO, ASO y SDK de marketing U08

Comprobar versión/router de Next.js antes de elegir Metadata API y archivos convencionales; [doc32](32-seo-local-nextjs.md) ofrece paths propuestos, no código existente. Renderizar texto público útil sin obligar a ubicación/JS/mapa, conservar estados HTTP y mantener páginas privadas protegidas y fuera del índice. Compartir contratos y tokens, no importar dependencias nativas en web.

GA4/Firebase y AdSense/AdMob se planifican por separado. [Doc34](34-analitica-consentimiento.md) exige bloquear la recopilación no esencial antes del arranque nativo según la base propuesta; un toggle JS tardío no basta. [Doc33](33-monetizacion-adsense-admob.md) exige SDK/build compatibles, IDs de prueba y flags desactivados. No asumir Expo Go ni añadir todos los SDK en una sola entrega.

Mantener anuncios fuera del mapa accionable, menús/alérgenos, carrito, pago, pedido y QR. Reservar espacio solo en inventario editorial autorizado y revisar layout/rendimiento/accesibilidad. ASO y enlaces a tiendas usarán assets/IDs reales y apertura web/app verificable. [ASO/calendario](35-aso-contenidos-roadmap-90-dias.md).

## Componentes, panel y permisos v1.8

El [catálogo](45-catalogo-21st-frontend.md) clasifica fuentes/runtime/adaptaciones, el [panel admin](46-panel-admin-negocios-suscripciones.md) acota negocios y suscripciones del propietario y [novedades/permisos](47-novedades-onboarding-permisos.md) define flujos nativos. 21st puede alojar recursos móviles, pero solo código RN compatible con SDK real se importa en app; las piezas DOM/Tailwind quedan como referencia o implementación web adaptada. No elegir SDK/paquetes a partir de una portada de móvil.

Novedades se resuelve con contenido/identificador estable de release y estado local de presentación, sin una nueva API o entidad por esta documentación. Elegibilidad por rol/plataforma/función realmente disponible; presentación una vez por actualización relevante, en momento seguro, con consulta posterior. El selector de idioma conserva el alcance pendiente; el calendario web filtra periodos y no incorpora permisos de calendario o reservas.

Permisos se consultan desde el SO antes de usar recurso y al volver de ajustes. Ubicación al pedirla, primer plano/manual; push al activar aviso; cámara en escáner de comerciante; fotos con selector. canAskAgain y permisos temporales/provisionales se interpretan según SDK/SO, sin un booleano local como autorización duradera. Revisar usage strings/config plugins/manifiestos, permisos añadidos por módulos, firma y build nativa; OTA no basta para cambiar capacidades del binario. No hay manifests/configuración nativa o permisos reales implementados en esta entrega.

Header/menú web y dock nativo siguen separados. Compartir tokens/contratos compatibles; las facultades admin se autorizan en Go y no se deducen del menú. Un archivo de ejemplo de Billing/Invoice no integra Stripe ni acredita permiso de cambios de plan/reembolsos. Los contratos de API y datos de este paquete no se modifican por esta ampliación.
