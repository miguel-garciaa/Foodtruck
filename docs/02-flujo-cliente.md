# Flujo del cliente: mapa, compra, pedido y QR

**Cerrado:** descubrir, encargar, pagar y recoger presencialmente. **Base propuesta:** secuencia detallada y comportamiento de errores.

## Recorrido principal

1. Abrir Explorar o Mapa. Solicitar ubicación solo con contexto; permitir búsqueda manual sin permiso GPS.
2. Consultar negocios del área visible. Mostrar apertura, disponibilidad, distancia si se conoce y momento de actualización.
3. Seleccionar un food truck y consultar ubicación, horario, fotos, carta, precios y alérgenos.
4. Añadir productos y complementos admitidos. Mostrar cantidades y total estimado.
5. Elegir recogida inmediata o franja si esa opción se aprueba. Mostrar dónde se recoge y cuándo.
6. Identificarse antes de comprar según la política pendiente de invitado. El backend vuelve a validar productos, precio, stock, horario y acceso comercial.
7. Confirmar el resumen calculado por Go y abrir Stripe PaymentSheet en móvil. Para web, elegir Checkout o Elements antes de implementar.
8. Mostrar “comprobando pago” cuando proceda. El retorno visual del SDK no confirma el pedido.
9. Tras confirmación verificada del servidor, mostrar pedido, ticket y progreso. El código existe para un pedido pagado; el canje se permite cuando esté listo.
10. Recibir avisos de aceptación y de pedido listo. Consultar la ubicación de recogida fijada para ese pedido.
11. Presentar QR en el puesto. El comerciante lo escanea y Go valida y registra la entrega una sola vez.

## Estados separados

| Eje | Estados de referencia |
| --- | --- |
| Pago | Pendiente, requiere acción, procesando, pagado, fallido; devolución pendiente/parcial/completa |
| Preparación | Pendiente de pago, recibido, aceptado, preparando, listo, entregado; rechazo/cancelación excepcional |
| Ticket | No emitido, emitido, canjeado, revocado o expirado |

Los nombres exactos son propuesta de contrato. Un reembolso no implica que el pedido haya sido entregado; un pedido cancelado puede seguir con reembolso pendiente. No condensar ambos ejes en una sola etiqueta.

## Mapa y ubicación

El mapa no contiene todos los negocios del país. Consulta un área acotada con filtros y límites. La ficha debe indicar la posición publicada del puesto, sin afirmar seguimiento continuo.

Fijar una instantánea de dirección, coordenadas y hora/franja al confirmar el pedido. Si el puesto cambia de ubicación, mantener el punto de recogida pactado y resolver el cambio con comunicación explícita; la política exacta está pendiente.

## Errores que la experiencia debe resolver

| Situación | Respuesta propuesta |
| --- | --- |
| Sin ubicación | Búsqueda manual y explicación de permisos |
| No hay negocios | Estado vacío y posibilidad de ampliar área |
| Cambia precio o stock | Recalcular y solicitar aceptación antes de cobrar |
| Stripe requiere autenticación | Completar el flujo seguro sin crear otro pedido |
| Se cierra la app tras pagar | Recuperar pedido desde API; no repetir el cobro |
| Pago pendiente prolongado | Mostrar pendiente y conciliar con Stripe |
| Comercio rechaza | Informar y gestionar devolución según política |
| QR ya utilizado | Mostrar entrega registrada; no entregar dos veces |
| Red ausente | Mostrar datos guardados como antiguos; no declarar pago o canje confirmado |

## Ticket y privacidad

QR con token aleatorio de alta entropía, sin datos personales ni importe como autoridad. No incluirlo en analítica, URLs de seguimiento o notificaciones de pantalla bloqueada. Acceder al ticket solo como cliente propietario o comerciante autorizado.

No permitir canje offline en el MVP propuesto: la unicidad requiere confirmación del servidor. Un código visible sin conexión no acredita una entrega.

## Aceptación

Probar recuperación tras cierre, doble toque en pagar, webhook retrasado, dos escaneos concurrentes, cambio de ubicación y acceso a pedidos ajenos. La ficha, el resumen y el pedido deben reflejar información consistente.

## Membresía, ofertas y canje en checkout

Añadir acceso a suscripción, beneficios y saldo/historial desde Perfil; ubicación final en UX pendiente. Antes de contratar mostrar **5,99 €/mes**, renovación, cancelación y tratamiento de impuestos, estos últimos aún pendientes de definir.

En checkout, el cliente solicita una oferta/canje; Go calcula descuento y total, reserva puntos/cupo de forma atómica y confirma o libera al resolver la compra. Mostrar precio base, descuento y quién/qué oferta lo concede. Pago y entrega generan puntos una sola vez según la política de acreditación por definir. Pedidos cancelados/reembolsados requieren ajustes auditados. [Detalles](25-suscripcion-clientes-fidelizacion.md).

## Novedades y permisos de la ampliación v1.8

Consultar [47](47-novedades-onboarding-permisos.md): novedades relevantes una vez por actualización y disponibles después en Perfil, sin interrumpir compra/pago/pedido/ticket. No pedir varios permisos por abrir esa tarjeta o completar onboarding.

En Explorar, Usar mi ubicación lleva a solicitud contextual del SO si hace falta; precisión aproximada y alternativa manual mantienen descubrimiento. Activar avisos de pedido puede solicitar notificaciones, pero consultar estado/QR sigue disponible si se rechazan. Mostrar el QR cliente no necesita cámara. Al volver de ajustes o con permiso temporal revocado, releer estado y conservar alternativas. Capturas y demos de recursos no son funciones/compras/promociones ya disponibles.
