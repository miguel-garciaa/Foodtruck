# Push, tiempo real y seguimiento nativo

**Cerrado:** APNs/FCM, Live Activities y Android Live Updates con adaptación al dispositivo. Seguimiento de preparación para recogida, sin repartidor.

## Canales

| Estado de app | Canal propuesto |
| --- | --- |
| Abierta | WebSocket o SSE y consulta API para reconciliar |
| Segundo plano/cerrada | Push APNs/FCM |
| iOS compatible | ActivityKit y extensión SwiftUI, actualizaciones remotas APNs |
| Android compatible | Live Updates/progreso mediante integración Kotlin |
| Sin soporte o permisos | Pantalla de pedido y avisos disponibles; push convencional si autorizado |
| Web | Estado dentro de la página; Web Push solo si se aprueba |
| Email transaccional | Resend desde Go/worker para identidad y avisos acordados; no reemplaza seguimiento/push |

C03 dejó WebSocket/SSE como alternativas. C06 propuso WebSocket; mantener como preferencia provisional, pendiente de escoger y probar. No prometer conexión permanente en segundo plano.

## Evento duradero

Cambio autorizado de estado → transacción PostgreSQL con pedido y outbox → worker Go → aviso/push/actualización de app. Redis acelera distribución; no conserva la única copia.

Eventos con ID y versión por pedido. Tras reconectar o recibir push, cliente consulta API y converge al estado actual; no retrocede por un aviso antiguo. Reintentos limitados y consumidores idempotentes.

Registrar tokens por usuario/dispositivo/plataforma/entorno, gestionar renovación y retirar inválidos. Logout rompe asociación de avisos privados. No enviar estado de un pedido a un dispositivo que ya cambió de cuenta.

## iOS

Live Activity representa pedido activo, ETA orientativa y estado. Dynamic Island es una superficie compatible del sistema, no una animación web. Requiere extensión nativa y configuración/firma específicas. Revisar permisos, tokens de actualización, expiración y finalización. [ActivityKit](https://developer.apple.com/documentation/ActivityKit).

Al terminar o cancelar, finalizar la actividad; no mantener un pedido antiguo indefinidamente. No incluir token QR, datos sensibles o capacidad de canje en pantalla bloqueada.

## Android

Live Updates requieren características y permisos de notificación promovida; el sistema y fabricantes pueden condicionar su promoción. No garantizar visualización destacada en todos los modelos. Representar solo actividad iniciada por el usuario y temporalmente relevante; ofrecer fallback. [Guía Android](https://developer.android.com/develop/ui/views/notifications/live-update).

La conversación mencionó Android 16 y ProgressStyle. Validar API mínima, versión target y comportamiento OEM con la integración elegida. Una notificación custom con apariencia similar no equivale a Live Update real.

## Mensajes y privacidad

Avisar cuando se acepta y cuando está listo. Informar rechazos/cancelaciones/cambios relevantes según política. No mandar notificaciones a 120 Hz: los avisos reflejan cambios de negocio, no cada fotograma.

Pedir permisos con explicación contextual. Cámara/ubicación/push son permisos separados. Elegir contenido mínimo de pantalla bloqueada; ajustes y retención pendientes.

## Pruebas

Primer plano, segundo plano, app terminada, permisos denegados, token cambiado, logout, múltiples dispositivos, eventos desordenados, worker reiniciado y fin de actividad. Probar en builds firmadas y dispositivos reales.

No hay APNs/FCM, certificados, extensiones ni notificaciones reales configuradas.

## Comunicaciones de ofertas

Ofertas/promociones de la nueva membresía utilizan preferencias y canales autorizados. Separar campañas de avisos operativos de pedido/suscripción; pagar el plan no equivale a consentir email o push.

No utilizar Live Activities/Android Live Updates para publicidad. Aplicar bajas, horarios/frecuencia definidos y límites; canal y frecuencia aún pendientes. El cliente puede consultar ofertas disponibles en la app aunque no autorice push.

## Correo de aplicación

Resend es elección cerrada por U07. Proponer correo de verificación/recuperación y confirmaciones relevantes de pedido/alta/suscripción; la frecuencia y responsabilidad de recibos se concretan para no duplicar mensajes Stripe. Envío diferido con outbox, destinatario autorizado y entorno correcto, sin poner tokens QR en correo como base.

Promociones por email requieren la preferencia/finalidad aprobada, baja y supresiones antes del envío. Un evento delivered no prueba lectura ni compra; no habilitar seguimiento de aperturas por defecto. [Guía de correo y eventos](30-correo-resend.md).

## Solicitud de permisos y novedades v1.8

[47](47-novedades-onboarding-permisos.md) separa tarjeta informativa, explicación contextual y alerta del SO. Pedir avisos al activarlos para una función concreta; no encadenarlos tras ubicación ni al mostrar novedades. Rechazo mantiene seguimiento en la app y no autoriza automáticamente otro canal publicitario. Interpretar permiso provisional/capacidades según plataforma, canal Android y tokens según SDK real; releer estado al volver de ajustes y gestionar revocación.

Una tarjeta estilo iPhone no crea una Live Activity, Dynamic Island o Android Live Update. Mantener integración/firma/build y fallback propios. Copias de capturas se incluyen como referencias; no se han recibido notificaciones ni concedido permisos durante esta entrega.
