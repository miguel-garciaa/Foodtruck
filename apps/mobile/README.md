# Foodtrucks: desarrollo Android

App React Native 0.88, Expo SDK 58 y TypeScript contra Laravel en la VM DEV. Identificador provisional `com.foodtrucks.dev`; etiqueta **Foodtrucks Dev**. Fuentes y contrato compartidos en el monorepo; [PR de implementación](https://github.com/miguel-garciaa/Foodtruck/pull/1), sin merge ni publicación.

## Alcance implementado

- Registro, verificación de correo, contraseña, recuperación y Google nativo mediante Android Credential Manager. Laravel valida la identidad y emite sus propias sesiones; Firebase se usa para FCM, no para autenticar cuentas.
- Perfil, avatar privado y modos cliente/propietario persistidos en el servidor. Refresh rotatorio en SecureStore; acceso en memoria. Las respuestas de una cuenta anterior se descartan al cambiar de sesión.
- Varios anuncios propios: borrador, fotos JPEG/PNG, ubicación, franjas horarias, carta en céntimos enteros, envío a revisión y archivo. La herramienta administrativa del servidor decide qué versión se publica.
- Búsqueda real por área de España y filtros combinados con AND. Los favoritos pertenecen a la cuenta. Solo se muestran anuncios publicados; una caída de API nunca activa los fixtures de los tests.
- Mapbox nativo con agrupación/selección y panel persistente de Gorhom. Filtros con `@expo/ui`, tema automático y texto escalable; buscador 14 sp, corazones de 20 dp/área táctil 48 dp y dock de 60 dp adaptable.
- Push nativo FCM: permiso contextual, registro/renovación del dispositivo, limpieza al salir y apertura autorizada del destino. El servidor usa outbox PostgreSQL y Horizon.

Google, recuperación de sesión, avatar y entrega FCM están comprobados contra la VM en Pixel_10. El recorrido completo de anuncios, revisión/publicación, favoritos y filtros con datos publicados sigue en QA. No incluye compras, QR, cobros, Apple, iOS, web de producto, tiendas ni producción. No acredita 120 FPS ni cumplimiento jurídico. Se aplican [AGENTS](../../AGENTS.md), [decisiones](../../docs/23-decisiones-pendientes.md), [entornos](../../docs/21-entornos-ci-cd.md) y [política 44](../../docs/44-politica-commits-ci-cd-tests.md).

## Configuración local

Node 24.14.1, npm 11.11.0, Java 17.0.20, Android Studio/SDK y `package-lock.json`. Copiar `.env.example` a `.env` y configurar:

- `EXPO_PUBLIC_API_URL`: en este DEV, `https://api-dev.foodtruck.bid/api/v1`.
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`: ID del cliente API de Google, nunca su secreto. El cliente Android debe corresponder al paquete y SHA-1 de la firma local.
- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`: token público `pk.*` de la cuenta propia; nunca `sk.*`.

`google-services.json` corresponde al proyecto Firebase DEV y se guarda en esta carpeta, excluido de Git. Credenciales FCM, Resend, Tunnel, contraseñas y APP_KEY permanecen en la configuración privada del servidor. Las variables `EXPO_PUBLIC_*` se incluyen en el bundle: no son un lugar para secretos.

El token público Mapbox ya permitió cargar cartografía real en Android el 22/10/2026. La cuenta Demo sin tarjeta limita el uso móvil a 100 MAU y utiliza el token público predeterminado; no permite crear/rotar otros tokens sin cambiar las condiciones de cuenta. Revisar límites antes de ampliar usuarios. No se contrataron planes ni se activó GPS. [Guía oficial Demo](https://docs.mapbox.com/accounts/guides/demo-access/).

## Compilar y arrancar

```powershell
cd C:\Users\migue\Documents\FOODTRUCK\apps\mobile
. ./scripts/android-env.ps1
npm ci
adb devices -l
npm run android
```

Elegir el dispositivo mostrado por ADB; no asumir su serial si hay varios emuladores. `npm run android` genera el proyecto nativo, compila, instala y arranca Metro. La primera build descarga herramientas con las licencias aceptadas. No necesita EAS ni firma de publicación. El APK debug requiere Metro.

Arranque diario después de iniciar Pixel_10 en Device Manager:

```powershell
. ./scripts/android-env.ps1
adb -s emulator-5554 reverse tcp:8081 tcp:8081
npm start
```

Conectar Foodtrucks Dev a `http://127.0.0.1:8081` cuando Metro esté listo. Evitar dos servidores en el mismo puerto. Si el lanzador muestra un fallo anterior, revisar el registro y reintentar con Metro disponible. Un arranque en frío conserva la cuenta y los datos; no usar Wipe Data como diagnóstico inicial.

El script valida Java 17/SDK, prepara PATH y prioriza IPv4. Los cambios JS/TS se actualizan con Fast Refresh. Cambiar módulos nativos, plugins o versiones exige reconstruir el APK. Las fuentes duraderas son `app.json`, `plugins/` y el módulo local `modules/foodtrucks-google`; Android/iOS generados y artefactos quedan excluidos.

En Windows se sustituyó el Ninja local de CMake 3.22.1 por [Ninja 1.13.2 oficial](https://github.com/ninja-build/ninja/releases/tag/v1.13.2), comprobando el SHA-256 del ZIP `07fc8261b42b20e71d1720b39068c2e14ffcee6396b76fb7a795fb460b78dc65`, para resolver rutas largas. El original conserva el sufijo `.foodtrucks-1.10.2.bak`. No se modifican dependencias para ese ajuste. En Android Studio abrir `apps/mobile/android` y seleccionar el JDK 17 para Gradle.

## Comprobaciones ejecutadas el 22/10/2026

```powershell
npx expo customize tsconfig.json
npm run typecheck
npm run lint
npm run format:check
npm test
npm run check:dependencies
npm run doctor
npm run security:audit
npx expo export --platform android --output-dir dist-verified
```

| Control | Evidencia y límites |
| --- | --- |
| Tipos, lint y formato | Pasan con las rutas actuales; CI genera los tipos de Expo Router antes de comprobarlos. |
| Tests móviles | 20 pasan: catálogo, céntimos/filtros, concurrencia de sesión, fotos autenticadas y destino push por cuenta. |
| Compatibilidad / Expo Doctor | Dependencias compatibles y 20/20 controles. |
| Seguridad de dependencias | 23 regresiones pasan y fuentes parcheadas verificadas; npm conserva 20 entradas altas correspondientes a dos avisos upstream corregidos localmente. Detalle, vencimiento y límites en [seguridad](security/README.md). |
| Export Android/Hermes | Correcto; bundle de aproximadamente 4,9 MB. |
| Build debug x86_64 | Correcta, 729 tareas, 3 min 59 s; instalada y abierta en Pixel_10 API 37.1. |
| VM y proveedores | HTTPS del catálogo 200, recurso privado 401 y archivos privados 404; Resend entregó el correo técnico y Google aceptó la credencial FCM. |
| Mapbox | Tiles reales, atribución y panel visibles; interacción con anuncios y clusters reales pendiente. |
| Google y sesión (23/10) | Corrección aplicada a la VM; acceso con cuenta real y recuperación tras detener/reabrir la app comprobados. Cuatro regresiones criptográficas cubren el verificador. |
| Avatar (23/10) | Fotografía elegida con el selector Android, subida, mostrada mediante acceso autenticado y retirada después de la prueba. |
| FCM (23/10) | Permiso denegado y posterior concesión; recepción en primer plano, aviso genérico en segundo plano y apertura de Cuenta desde el aviso, partiendo de Mapa. Rotación de token y cambio de cuenta aún requieren prueba real. |
| Propietario (23/10) | Cambio de modo, creación/reapertura de borrador con foto/ubicación/horario/plato de 0,29 €, envío a revisión y archivo comprobados. Anuncio técnico privado, identificado como QA. |
| Publicación, favoritos y búsqueda | Aprobación administrativa y recorrido Android con varios anuncios publicados todavía pendientes; no se deducen de los tests de servidor. |
| Móvil físico, TalkBack, iOS y producción | No acreditados. |

CI se comprueba por SHA; consultar la [PR](https://github.com/miguel-garciaa/Foodtruck/pull/1) para el resultado vigente. La revisión `d78d918` superó sus cinco trabajos, incluidos servidor/PostGIS y seguridad móvil: [ejecución 39832733801](https://github.com/miguel-garciaa/Foodtruck/actions/runs/39832733801). Una actualización posterior necesita su propia ejecución. [Backend y comandos de operación](../../backend/README.md), [evidencia visual y pendientes](design-qa.md).

Los registros y capturas se guardan en `artifacts/`, fuera de Git. `providers-android-updated-build.log` documenta la última build; `mapbox-online.png` documenta la cartografía. No subir tokens, cuentas del dispositivo, dumps privados ni credenciales con las evidencias.

## Recursos y prueba física

Las referencias de Airbnb orientaron jerarquía, búsqueda, tarjetas y organización de Perfil; no se copian sus datos ni se aprueban funciones por aparecer en una captura. Se revisaron los candidatos de [06](../../docs/06-21st-dev-mcp.md) y [45](../../docs/45-catalogo-21st-frontend.md), sin importar código DOM. Dos fotografías generadas con ImageGen el 21/10/2026 se conservan solo para los fixtures de tests, identificados como sintéticos; la app consulta las fotos publicadas en Laravel.

Para teléfono físico: activar depuración USB, aceptar la huella, comprobar `adb devices -l`, aplicar `adb -s <serial> reverse tcp:8081 tcp:8081` y seleccionar ese dispositivo con `npm run android`. No borrar autorizaciones/datos como primera medida. Repetir los flujos descritos en QA antes de considerar verificado el dispositivo.
