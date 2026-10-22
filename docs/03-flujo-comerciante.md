# Flujo del comerciante

**Cerrado:** publicar negocio y comida, gestionar pedidos y pagar licencia inicial más mensualidad con Stripe. **Base propuesta:** onboarding, permisos y compuertas de acceso.

## Alta y activación

1. Crear cuenta o iniciar sesión; verificar email cuando corresponda.
2. Solicitar alta de negocio: nombre, descripción, contacto, fotos, categorías y responsables.
3. Publicar ubicación y horarios iniciales; cargar carta, precios, disponibilidad y alérgenos.
4. Crear/vincular la cuenta conectada de Stripe mediante onboarding de Stripe. No almacenar documentos KYC en Foodtrucks salvo necesidad aprobada.
5. Contratar en web la licencia inicial y mensualidad usando Stripe Billing.
6. Esperar confirmación de facturación, capacidades Connect y revisión administrativa si se adopta.
7. Ver un panel que explique qué requisito falta para poder aparecer y vender.

Alta de negocio y onboarding de Stripe son procesos diferentes. Volver de Stripe no acredita que su verificación haya terminado. Tampoco el primer pago habilita ventas si Connect sigue restringido.

## Operación diaria

- Publicar la posición operativa, por selección manual o GPS consentido.
- Abrir/cerrar y habilitar o pausar pedidos.
- Actualizar carta y marcar agotados. Invalidar caché después de persistir cambios.
- Consultar pedidos pagados, observaciones y recogida prevista.
- Aceptar, preparar y marcar “listo” con transiciones autorizadas.
- Escanear ticket QR, ver una confirmación del pedido y completar el canje.
- Consultar historial, incidencias y estado de facturación.

El usuario propietario puede utilizar también el modo cliente. Todos los permisos se validan en Laravel para el negocio concreto; cambiar de modo en la interfaz no concede acceso.

## Recogida segura

Escanear requiere permiso de cámara contextual. Laravel resuelve el token, identifica el negocio y comprueba pago, estado listo, vigencia y ausencia de canje. El cambio a entregado y el registro de canje ocurren en la misma transacción.

Si dos dispositivos escanean a la vez, solo uno completa la operación. El segundo recibe un resultado coherente indicando que ya se registró. Un propietario no puede canjear pedidos de otro negocio.

## Facturación y suspensión

Customer Portal es la base propuesta para tarjetas, facturas y cancelación. Separar claramente ventas de comida de pagos por el software.

Un impago debe producir aviso y el estado correspondiente; **duración de gracia y restricciones pendientes**. La cancelación al final del periodo fue recomendada, sin fijar una política contractual definitiva. Conservar el tratamiento de pedidos activos aun cuando se bloquee la creación de otros.

## Administración

El panel Next.js del propietario de Foodtrucks se centra primero en negocios y suscripciones: revisar altas/fichas, aprobar o suspender con motivo, consultar licencia/mensualidad, estados Billing/Connect, incidencias y auditoría. Es distinto del panel del comerciante. [Especificación](46-panel-admin-negocios-suscripciones.md). Criterios/reglas de revisión y publicación siguen pendientes; las facultades para devolver pagos o modificar planes no quedan aprobadas por una demo y requieren decisión/permiso específicos. No conceder acceso indiscriminado a datos o secretos.

## Pendiente

Varios puestos por negocio, varios propietarios/empleados, permisos de cocina frente a caja, aceptación automática, capacidad por franja, documentación comercial, periodo de gracia, reembolso de licencia y condiciones de soporte.

## Promociones y financiación de descuentos

Definir participación de negocios y quién crea/aprueba campañas. Mostrar al comerciante el descuento aplicado, su coste y el importe económico correspondiente en cada pedido.

La membresía de cliente no modifica su suscripción comercial ni garantiza al puesto compensación por descuentos. No reducir ingresos del comerciante con una promoción sin reglas/acuerdo de financiación. En cargos directos Connect, un importe menor no genera automáticamente una subvención de plataforma. [Membresía](25-suscripcion-clientes-fidelizacion.md).

## Recursos y permisos contextuales v1.8

[Catálogo app](45-catalogo-21st-frontend.md) y [novedades/permisos](47-novedades-onboarding-permisos.md) guían adaptación por rol. Pedir cámara al entrar en escáner QR, liberar su uso al salir y comprobar recurso real/permisos del negocio; una autorización de cámara no concede autorización de canje. Publicar ubicación admite selección manual y GPS en primer plano cuando el comerciante lo solicite. Elegir fotos usa selector del sistema/acceso mínimo a imágenes; no pedir toda la biblioteca o micrófono como requisito de esa función.

Novedades del modo comerciante solo anuncian funciones realmente disponibles; no interrumpen preparación/recogida ni borran estado de pedidos. El calendario administrativo filtra actividad/facturas/suscripciones; no cambia franjas/stock/reservas del negocio.
