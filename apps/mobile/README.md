# Foodtrucks: desarrollo Android

Primera interfaz cliente React Native + Expo SDK 58 + TypeScript, creada desde `expo-template-default@58.0.25`. Compilada, instalada y utilizada en **Pixel_10** el 21/10/2026. El móvil físico queda para después por indicación del usuario. Identificador provisional: `com.foodtrucks.dev`; etiqueta instalada: **Foodtrucks Dev**.

Incluye exploración, búsqueda local, categorías, filtros nativos, colección de favoritos de sesión, ficha y carta. Perfil da acceso a preferencias, ayuda desplegable e información sobre los datos de esta demostración. Tema del sistema, áreas seguras y texto escalable. Los negocios, posiciones, disponibilidad, precios y alérgenos son **datos sintéticos**, sin valor comercial. Los favoritos no persisten al reiniciar la sesión. Pedidos y Perfil explican su estado de demostración.

Se aplican [AGENTS](../../AGENTS.md), [frontend](../../docs/08-frontend.md), [decisiones](../../docs/23-decisiones-pendientes.md), [entornos](../../docs/21-entornos-ci-cd.md) y [política 44](../../docs/44-politica-commits-ci-cd-tests.md). No hay backend, cuentas, compras, tickets QR o notificaciones. No acredita iOS, web de producto, 120 FPS o preparación para producción.

## Primera compilación

Herramientas comprobadas en Windows: Node **24.14.1**, npm **11.11.0**, Java **17.0.20**, Android Studio y SDK Android. Usar npm con `package-lock.json`. La plantilla genera minSdk 24; no cierra la matriz de soporte del producto.

```powershell
cd C:\Users\migue\Documents\FOODTRUCK\apps\mobile
. ./scripts/android-env.ps1
npm ci
adb devices -l
npm run android
```

`npm run android` ejecuta `expo run:android --device`: seleccionar Pixel_10. Genera Android si falta, compila debug, instala y arranca Metro. La primera compilación puede descargar Gradle, NDK y SDK conforme a las licencias aceptadas. No requiere EAS ni firma de publicación. El APK debug necesita Metro para cargar el JavaScript.

## Arranque diario con Pixel_10

Iniciar **Pixel_10** en Device Manager de Android Studio y esperar a que Android termine de arrancar:

```powershell
cd C:\Users\migue\Documents\FOODTRUCK\apps\mobile
. ./scripts/android-env.ps1
adb -s emulator-5554 reverse tcp:8081 tcp:8081
npm start
```

El identificador del emulador puede cambiar: comprobar `adb devices -l`. `npm start` usa `expo start --dev-client --localhost`. Abrir Foodtrucks Dev y conectar a `http://127.0.0.1:8081` desde su lanzador, o pulsar `a` en Metro y elegir Pixel_10. No iniciar otro Metro en el mismo puerto. Detener el servidor de una terminal con Ctrl+C al terminar.

El script valida Java 17/SDK, prepara PATH, establece el proxy local de Expo y prioriza IPv4 para ADB reverse. Se configuró ANDROID_HOME y se añadieron platform-tools/emulator al PATH de usuario conservando entradas existentes. Cargar el script en cada terminal nueva; aplicaciones abiertas antes pueden necesitar reiniciarse para heredar el entorno.

Editar `src/app/(tabs)/index.tsx` y guardar: Fast Refresh actualiza la pantalla sin compilar. En esta sesión se comprobó un cambio temporal visible en Perfil y su restauración. Recompilar con `npm run android` al añadir módulos nativos, modificar plugins/configuración nativa o actualizar SDK. Cambios JS/TS y estilos no requieren reconstruir el APK.

## Móvil físico, para la siguiente prueba

Activar Opciones de desarrollador → Depuración USB, conectar con cable de datos, aceptar la huella y mantener el teléfono desbloqueado. Si solo carga, revisar modo USB, cable y controlador. En `adb devices -l`, `device` indica autorización; `unauthorized` requiere aceptar el diálogo. No revocar autorizaciones ni borrar datos como solución inicial.

Usar `adb -d reverse tcp:8081 tcp:8081`, o `adb -s <serial> reverse ...` si hay varios dispositivos. Después `npm run android` y seleccionar el teléfono para compilar/instalar la arquitectura correspondiente. La interfaz actual se verificó en emulador x86_64; no se declara validación del móvil físico.

## Android Studio y configuración reproducible

Abrir **apps/mobile/android** con File → Open. En Settings → Build, Execution, Deployment → Build Tools → Gradle, elegir el **JDK 17 de JAVA_HOME**. Se dejó `android/.gradle/config.properties` con la ruta local de Java 17; está ignorado y puede desaparecer al regenerar. El runtime Java 25 del IDE es distinto del JDK de Gradle.

La fuente duradera es `app.json` y `plugins/`. Android/iOS generados, IDE, cachés, artefactos, variables de entorno y claves están excluidos. Revisar cambios nativos locales antes de regenerar; no usar `prebuild --clean` indiscriminadamente.

`plugins/with-font-scale.cjs` conserva los configChanges de MainActivity y añade `fontScale`: RN 0.88 recibe el cambio sin recrear su host. Se reprodujo y corrigió un fallo del development launcher al cambiar el tamaño de texto, se reconstruyó el APK y se repitió la prueba al 160 %, volviendo desde segundo plano. La configuración final del emulador se restauró a claro y escala 1,0.

### Corrección local de Ninja en Windows

Ninja 1.10.2 incluido en CMake 3.22.1 fallaba por rutas largas al compilar código nativo. Se actualizó **solo el ejecutable local del SDK** a [Ninja 1.13.2 oficial](https://github.com/ninja-build/ninja/releases/tag/v1.13.2), verificando SHA-256 `07fc8261b42b20e71d1720b39068c2e14ffcee6396b76fb7a795fb460b78dc65` del ZIP de Windows. Original conservado como `ninja.exe.foodtrucks-1.10.2.bak` en `Android/Sdk/cmake/3.22.1/bin`. No se parchearon node_modules ni se bajó el SDK. Otro equipo puede necesitar comprobar su versión si reproduce ese error.

## Mapbox

`@rnmapbox/maps` está instalado e integrado con agrupación, selección y temas. Sin token público válido se muestra un estado explicativo y la lista de resultados; no se dibuja un mapa ficticio. La carga de tiles, atribución visible online y agrupación todavía **NO están verificadas**.

Para la integración posterior, copiar `.env.example` a `.env` y configurar únicamente `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN` con un token público `pk.*` adecuado para el SDK nativo. Nunca usar secretos `sk.*` en el cliente. Revisar las condiciones de la cuenta antes de habilitar el servicio. Reiniciar Metro tras cambiar el entorno; reconstruir si cambia la configuración nativa. No se solicita ubicación GPS en esta fase.

## Comprobaciones reales: 21/10/2026

```powershell
npm run typecheck
npm run lint
npm run format:check
npm test
npm run check:dependencies
npm run doctor
npx expo export --platform android --output-dir dist
npm audit
```

| Control | Resultado |
| --- | --- |
| TypeScript, ESLint y formato | Correctos |
| Comportamiento del catálogo | 8/8 pruebas: acentos, filtros combinados, límite de precio, favoritos e integridad de fixtures |
| Compatibilidad Expo | Dependencias al día |
| Expo Doctor | 20/20 controles correctos |
| Export Android/Hermes | Correcto, 1534 módulos; bundle 3,2 MB |
| Build Android debug x86_64 | Correcto; última build nativa: 1 min 2 s, 485 tareas |
| Instalación y apertura | Correctas en Pixel_10 API 37.1, paquete `com.foodtrucks.dev` |
| Fast Refresh | Cambio visible y restauración sin compilar/reiniciar |
| Reapertura | Correcta desde segundo plano; también apertura tras reinstalar el APK |
| Búsqueda, categorías, favoritos, carta | Probados; vacío sin coincidencias y recuperación comprobados |
| Ampliación de Perfil y Favoritos | Preferencias, privacidad, desplegar ayuda, abrir/plegar colección y volver probados |
| Filtros nativos | Abrir, cambiar, restablecer y cerrar probados; texto 160 % visible |
| Temas y texto | Claro/oscuro y escala 1,6 revisados visualmente; evidencia y límites en [QA](design-qa.md) |
| Mapbox online, TalkBack, iOS y móvil físico | Pendientes; no acreditados por estas pruebas |
| Git, commit, push, PR y CI | Sin repositorio/remoto: no realizados; no se inicializó Git |
| Publicación/producción | No realizadas |

Las pruebas unitarias cubren la lógica nueva de filtrado/favoritos; no se añaden tests de texto estático ni snapshots artificiales. La revisión propia incluye imports, permisos, configuración regenerable y ausencia de secretos añadidos; Gitleaks no está instalado y no se acredita escaneo formal. Avisos de APIs de Gradle/AGP/Kotlin de dependencias siguen pendientes de actualización; no se ocultaron para conseguir una build verde.

Evidencia local ignorada: `artifacts/android-debug-build.log`, `artifacts/npm-audit.json` y capturas/XML citados por QA. APK debug: `android/app/build/outputs/apk/debug/app-debug.apk`, SHA-256 `cd734aa0f4c0526781bce7e963f37d48c75e892c5c86b2226967767d0387d35c`. No es un artefacto de release ni contiene un bundle autónomo de producción.

### Dependencias y seguridad

La revisión del 22/10/2026 incorpora parches locales verificados para braces 3.0.3 y node-forge 1.4.0, cuyos avisos aún no tienen release oficial corregida. Los parches compatibles de Expo incorporan xcode 4.0.0 y eliminan la dependencia vulnerable uuid sin overrides. Instalación: `npm ci`; comprobación completa: `npm run security:audit`.

La [guía de seguridad de dependencias](security/README.md) explica el código aplicado, fuentes, regresiones, límites y revisión obligatoria antes del 21/11/2026. `npm audit` conserva los avisos de las versiones originales: el gate solo considera resueltos los dos identificadores cuyo código parcheado ha verificado y bloquea cualquier otro alto/crítico pendiente. CI también comprueba compatibilidad Expo y el bundle Android; el resultado vigente se consulta por SHA en la PR.

ESLint 9 avisa de fin de soporte; eslint-plugin-react 7.37.5 y eslint-plugin-import 2.32.0 todavía declaran peers hasta ESLint 9. No se fuerza ESLint 10 rompiendo ese contrato.

## Recursos y decisiones visuales

Se evaluaron los candidatos de [06](../../docs/06-21st-dev-mcp.md) y [45](../../docs/45-catalogo-21st-frontend.md): búsqueda, tarjetas, filtros, dock y vacío. Su código completo/licencia exacta no están acreditados para esta app; no se importó código ni dependencias DOM. Se implementaron componentes nativos propios con React Native/Expo Router y sheet/controles de `@expo/ui`. No se añadió Reanimated solo para decoración.

Dos fotografías generadas con ImageGen el 21/10/2026, sin recursos descargados de Airbnb, en `assets/foodtrucks/`. Se reutilizan en cuatro fixtures y no identifican negocios reales. Prompts de procedencia:

- `orange-truck.png`: fotografía editorial natural de foodtruck vintage naranja quemado, puesto mediterráneo soleado, mostrador abierto, luces cálidas, árboles, personas sin rostros identificables, recorte cuadrado adaptable a 4:3; sin texto, logotipos ni marcas de agua.
- `teal-truck.png`: fotografía editorial natural de foodtruck turquesa de tacos, plaza mediterránea, toldo claro, macetas de terracota y sol de mediodía, sin rostros identificables, recorte cuadrado adaptable a 4:3; sin texto, logotipos ni marcas de agua.

Las capturas del usuario orientan jerarquía, búsqueda, carruseles y fichas. Tras cerrar la primera implementación, se exploraron las secciones principales de Airbnb en la pestaña indicada de Codex: Todo/Alojamientos, Experiencias, Servicios, Favoritos, Viajes, Mensajes y Perfil; también ayuda, entrada a ajustes, búsqueda, resultados/filtros y una ficha. Fue una consulta de referencias, sin reservas, guardados o edición de la cuenta. No acredita recorrer cada subpágina del servicio.

Se adaptaron Perfil, colección de favoritos, preferencias, ayuda desplegable y privacidad a los flujos actuales. No se copian datos de la cuenta de Airbnb. No se añaden chat, tarifas, alta comercial o edición de cuenta por aparecer en las referencias. Tipografía del sistema Android, paleta marfil/coral/azul noche y dock nativo siguen siendo provisionales.
