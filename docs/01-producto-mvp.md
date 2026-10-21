# Visión y alcance del MVP

**Cerrado:** marketplace Foodtrucks con descubrimiento en mapa, compra anticipada y recogida presencial mediante QR. Inspiración en la claridad de Airbnb y el seguimiento de Glovo, con identidad propia.

## Valor y actores

El cliente encuentra comida cercana y recoge un pedido ya pagado. El comerciante publica su negocio, ubicación y carta, recibe pedidos y controla la preparación y la entrega. La plataforma gestiona el acceso de negocios y cobra licencia inicial más mensualidad.

Roles de referencia de la conversación: cliente, propietario y administrador. Una cuenta puede comprar y gestionar un negocio. La aplicación móvil única con cambio de modo por permisos es la **base propuesta**; el detalle de empleados y múltiples propietarios está pendiente.

## Alcance base

| Área | Funcionalidad |
| --- | --- |
| Identidad | Registro, verificación de email, login tradicional/Google/Apple, recuperación y cierre de sesión |
| Descubrimiento | Explorar, mapa por área visible, categorías, ficha, horarios y disponibilidad |
| Negocio | Alta, fotos, carta, alérgenos, ubicación manual/GPS publicada y apertura/cierre |
| Compra | Carrito, comprobación de precios/disponibilidad, pago Stripe y resumen |
| Preparación | Recibido/pagado, aceptado, preparando, listo y entregado |
| Recogida | Ticket QR y canje único autorizado en el backend |
| Suscripción | Alta/licencia, mensualidad, estado de acceso y portal de facturación |
| Administración | Revisión de altas, suspensiones, consulta de incidencias y registros económicos |
| Calidad | Claro/oscuro, accesibilidad, seguridad, backups y fluidez móvil |

Complementos de platos y franjas de recogida se propusieron en C01. Definir su profundidad para el MVP; no introducir un configurador complejo sin necesidad. Los alérgenos deben figurar en la ficha y antes de pagar; su contenido y responsabilidad necesitan revisión para el mercado de lanzamiento.

## Fuera del núcleo inicial, salvo aprobación posterior

Repartidores y entrega a domicilio, campañas avanzadas ajenas a la membresía, reseñas, calendario amplio de eventos, analítica comercial avanzada y navegación giro a giro. C01 propuso próximas ubicaciones y pedidos anticipados: conservar como evolución, sin exigirlos al primer piloto.

**No hay seguimiento GPS de un repartidor.** El progreso describe la preparación y disponibilidad para recoger.

## Acceso comercial

Un negocio visible y habilitado para nuevas ventas necesita cumplir reglas independientes: aprobación administrativa si se adopta, acceso de Billing vigente, cuenta Connect habilitada, ubicación operativa y aceptación de pedidos. El pago de la cuota no garantiza por sí solo capacidad de vender.

No perder el acceso a pedidos ya pagados al suspender nuevas ventas. Una suspensión no debe bloquear la recogida o resolución de un pedido existente.

## Validación del MVP

Se considera demostrable cuando un cliente de prueba completa descubrimiento → pago de prueba confirmado → preparación → canje único QR, y el comerciante gestiona el ciclo y su suscripción. También deben resolverse reintentos, permisos, stock agotado y fallos de red.

C01 sugirió un piloto de 5–10 food trucks en una ciudad: **ejemplo de piloto**, sin comprometer número, ciudad ni fecha. El país de lanzamiento sigue pendiente; España apareció como supuesto, no como elección explícita.

## Pendiente

Paridad comercial de la web cliente, ciudad/país, comisiones, cancelaciones, política de no recogida, stock y franjas, confirmación automática/manual, devoluciones y soporte. Véase [registro central](23-decisiones-pendientes.md).

## Ampliación de producto: membresía de cliente

U01 añade suscripción de clientes, ofertas/promociones y puntos por compra para descuentos. U02 confirma **5,99 €/mes en EUR**. El requisito forma parte del proyecto; impuestos, reglas de beneficios y entrada en el primer MVP están pendientes. Las recomendaciones históricas de dejar toda fidelización para después quedan actualizadas.

Base propuesta: membresía opcional, compra de comida disponible sin ella y reglas de beneficio calculadas en Go. No prometer exclusividad, descuentos universales o ratios hasta acordarlos. [Especificación](25-suscripcion-clientes-fidelizacion.md).

## Preparación de captación

Preparar mensajes y destinos distintos para clientes y comerciantes. Priorizar una zona con oferta realmente operativa antes de atraer compras. Las páginas previas al lanzamiento pueden captar interés, identificándolo como tal; no ofrecer funciones todavía inexistentes.

La inversión 400 al mes se conserva como referencia pendiente del usuario, sin reparto ni autorización. [Plan Google Ads](27-marketing-google-ads.md).

## Plan de crecimiento U08

El usuario incorpora SEO técnico/local, ASO, medición GA4/Firebase y evaluación AdSense/AdMob al proyecto. Priorizar contenido público real y convertir descubrimiento en pedidos recogidos/comercios activos. La planificación de páginas/tiendas/editorial no declara todas esas funciones disponibles en el primer MVP ni cierra la compra web pendiente.

Mantener recogida sin reparto, Mapbox y el modelo comercial vigente. El calendario de 90 días se ajusta a hitos/datos reales; anuncios e ingresos publicitarios no se priorizan sobre pedidos. [Plan maestro y límites de fase 1](31-marketing-digital-maestro.md).
