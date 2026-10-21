# Suscripción de clientes, ofertas y puntos

**Requisito confirmado por el usuario:** suscripción de clientes de **5,99 €/mes en EUR**, para recibir ofertas/promociones y obtener puntos por cada compra que permitan conseguir descuentos. U01 solicita el producto y U02 confirma el precio mensual. **Impuestos y reglas de beneficios pendientes de confirmar.** Este precio procede de una decisión explícita y no es una tarifa ficticia del historial.

No hay suscripción, campañas, cálculo de puntos ni precios reales creados en Stripe. La implementación detallada de este documento es una **base propuesta**.

## Producto y relación con el resto del proyecto

Añadir una membresía de cliente separada de la licencia/mensualidad del comerciante. Un propietario que compre también como cliente puede tener ambos productos, sin que una suscripción habilite la otra.

Propuesta: comprar comida continúa disponible sin membresía; la suscripción concede beneficios adicionales. El usuario aún no ha definido si las ofertas son exclusivas, si los clientes gratuitos también reciben puntos o si todos los puestos participan. No prometer descuentos en todos los negocios hasta acordarlo.

| Elemento | Estado |
| --- | --- |
| Suscripción para clientes | Solicitada |
| Precio 5,99 €/mes | Confirmado por el usuario |
| Moneda y periodo | EUR y mensual, confirmados en U02 |
| Ofertas y promociones | Solicitadas; frecuencia/canal/exclusividad pendientes |
| Puntos por compra para descuentos | Solicitados; cálculo, canje y elegibilidad pendientes |
| Nombre comercial del plan | Pendiente; no se inventa una marca definitiva |
| Carácter opcional y compra sin plan | Propuesta de producto |
| Lanzamiento en MVP o una fase siguiente | Pendiente de priorizar |

## Recorrido propuesto del cliente

1. Consultar beneficios desde Perfil y una sección de ofertas. Mantener dock solo nativo/header web; no añadir automáticamente una pestaña nueva por esta función.
2. Ver importe, moneda, periodo, renovación, cancelación y condiciones antes de contratar. Mostrar el precio confirmado **5,99 €/mes** y cerrar la presentación fiscal antes de vender.
3. Completar el pago mediante el canal aprobado para esa superficie. Go activa derechos solo con evidencia autenticada de cobro/estado vigente.
4. Ver ofertas elegibles con condiciones, negocios, vigencia y límites. La membresía no garantiza recibir promociones si no existen campañas publicadas.
5. Realizar una compra; el backend calcula y registra los puntos de acuerdo con la regla versionada que corresponda.
6. Consultar saldo disponible, puntos pendientes/reservados e historial. Mostrar cuándo se acreditan, si caducan y para qué sirven.
7. Elegir una oferta o canje en checkout. Go calcula precio base, descuento y total; el cliente acepta el resumen antes del pago.
8. Consultar o cancelar la suscripción mediante un flujo claro, sin impedir ver pedidos, facturas o movimientos previos.

No prometer ahorro fijo, recuperación automática de la cuota, puntos ilimitados ni descuentos mínimos sin acuerdo.

## Facturación y derechos

Stripe Billing en web es la **base propuesta** para esta suscripción de plataforma, independiente de Billing de comerciantes y Connect de comida. Moneda EUR, intervalo mensual y precio base 599 unidades mínimas están confirmados; impuestos/configuración comercial pendientes. No crear un Price real durante la documentación.

Registrar customer/contexto de cobro, suscripción y estado normalizado de acceso de forma separada. No inferir membresía por tener cualquier suscripción activa. Una misma cuenta puede asociarse a varios productos; definir unicidad del plan de cliente vigente para evitar doble contratación entre web y móvil.

Cancelación al final del periodo, impago/gracia, reactivación y derechos sobre puntos tras la baja son **políticas pendientes**. No borrar saldo o historial automáticamente cuando termine la membresía.

### Canal móvil por validar

Los pagos por comida física y la membresía son productos distintos. Las reglas de Apple/Google distinguen compras físicas y funciones/suscripciones digitales; la clasificación de esta membresía depende de los beneficios finales, mercado y distribución. No asumir ni que Stripe siempre será admisible dentro de la app ni que siempre se exigirá compra de tienda. Tampoco añadir enlaces de contratación externa sin comprobar su elegibilidad. [Apple App Review](https://developer.apple.com/app-store/review/guidelines/), [Google Play Payments](https://support.google.com/googleplay/android-developer/answer/9858738?hl=en).

Google documenta que puntos obtenidos como recompensa pueden emitirse sin su sistema de facturación, y distingue la venta de puntos dentro de la app. Esto no resuelve por sí solo el canal de la cuota de membresía. [FAQ de puntos Google Play](https://support.google.com/googleplay/android-developer/answer/10281818?hl=en).

Si se requiere cobro de tienda, adaptar verificación de transacciones/notificaciones y normalización de derechos; no obligar a mantener dos membresías por el mismo usuario. Decidir este canal antes de implementar la pantalla de contratación móvil.

## Puntos: autoridad y cálculo

PostgreSQL conserva un registro de movimientos inmutable y auditable; Redis puede cachear una vista, pero nunca decidir el saldo gastable. Calcular en Go con enteros y reglas versionadas; no admitir un saldo o descuento enviado por el teléfono.

**Base propuesta:** marcar puntos pendientes tras pago y acreditarlos después de entrega/recogida confirmada, para limitar acumulación por compras canceladas. Alternativa de acreditación al pagar pendiente de decisión. Cada compra elegible debe producir su crédito exactamente una vez, aunque el webhook o evento se repita.

Definir puntos según importe neto elegible y reglas comerciales: excluir o incluir impuestos, descuentos, propinas y pagos de membresía solo después de decidirlo. No inventar que 1 € equivale a cierto número de puntos ni que cierto saldo equivale a un euro.

Guardar regla, base de cálculo, pedido y motivo en cada movimiento. Un cambio futuro de equivalencia no debe reescribir silenciosamente movimientos anteriores. Distinguir recompensa de dinero; transferencias, venta de puntos o retirada en efectivo quedan fuera de esta propuesta y requerirían otra decisión.

## Canje y concurrencia

1. Backend valida membresía/elegibilidad, saldo disponible, campaña, negocio, mínimo, acumulación y límites.
2. Reserva puntos y cupo de campaña en una transacción vinculada a la intención de compra. Usar bloqueo/actualización condicional y restricción de unicidad, sin mantener la transacción abierta mientras se espera a Stripe.
3. Pagar únicamente el total final calculado; guardar la instantánea del descuento, regla y financiador en el pedido.
4. Confirmar consumo una vez cuando se confirme la operación; liberar reserva ante fallo/expiración según política.
5. Resolver pagos tardíos después de liberar puntos: conciliar antes de confirmar, impedir que el mismo saldo financie dos compras. Política de compensación pendiente.

Descuento nunca superior al importe elegible; definir redondeo y tratamiento de total cero antes de habilitar canjes completos. Una compra totalmente descontada no debe crear automáticamente un cargo Stripe de cero.

## Reembolsos y abuso

Registrar correcciones mediante movimientos compensatorios, sin editar el historial. Propuesta: revertir puntos ganados por el importe reembolsado con cálculo consistente en devoluciones parciales; restitución de puntos canjeados y ajuste de beneficios son decisiones comerciales pendientes.

Si el usuario ya gastó puntos que posteriormente deben revertirse, no crear saldo negativo utilizable ni cobrarle automáticamente. Conservar el ajuste y definir una política explícita de compensación/futuros créditos y revisión.

No regalar puntos repetidos por reintento, auto-compras fraudulentas, cuentas duplicadas o un pedido nunca entregado. Controles proporcionales, auditoría y ajustes administrativos con motivo y autorización.

## Ofertas, financiación y comerciantes

Cada campaña necesita alcance, vigencia, elegibilidad, descuento, límites, presupuesto y responsable. La campaña puede pertenecer a la plataforma o a un comerciante; creación/aprobación y participación pendientes de acordar.

**Decisión necesaria:** quién asume el coste de cada descuento. Reducir el pago en un cargo directo Connect puede reducir el ingreso del negocio; la cuota del cliente no compensa automáticamente esa diferencia. Una subvención de plataforma exige conciliación y un flujo económico expresamente aprobado.

Los cupones Stripe de una factura de suscripción no implementan por sí solos puntos/descuentos en comida de varias cuentas conectadas. Calcular el beneficio Foodtrucks en el pedido y reconciliar importes, comisiones y financiación.

## Datos y API propuestos

| Entidad | Propósito |
| --- | --- |
| customer_memberships | Plan/usuario, proveedor/contexto, estado, periodo y derechos |
| loyalty_accounts | Cuenta de puntos y proyección transaccional de saldo |
| loyalty_entries | Crédito/débito/ajuste, pedido/reembolso, regla y clave de origen única |
| loyalty_reservations | Puntos reservados, intención de compra, estado y vencimiento |
| promotions | Campaña, negocios, reglas, financiador, vigencia y presupuesto |
| promotion_redemptions | Uso/reserva y límites por usuario/pedido/campaña |

GET /me/membership; POST /me/membership/checkout y /portal para canal web aprobado; GET /me/loyalty y /me/loyalty/entries; GET /offers; POST /orders/quote con solicitud de canje. El contrato se consolidará en [API](20-api.md); todas estas rutas son preliminares.

## Avisos y seguridad

Recibir ofertas implica preferencias de comunicación y consentimiento cuando corresponda; pagar membresía no concede permiso de push/email por sí solo. Separar mensajes de servicio de campañas y permitir controlar los canales. No usar Live Activities/Live Updates para promociones.

Autorizar saldo/movimientos por usuario, validar descuentos otra vez en checkout y no confiar en estados de UI/caché. No registrar datos sensibles de compra en campañas sin necesidad.

## Preguntas pendientes

- ¿Los 5,99 €/mes incluyen impuestos? ¿Qué tratamiento fiscal y presentación final corresponden?
- ¿Solo suscriptores ganan/canjean puntos? ¿Qué beneficios tienen los no suscritos?
- ¿Puntos por importe o por pedido? ¿Cuándo se acreditan, cuánto valen y cuándo caducan?
- ¿Descuentos en todos los food trucks o participantes? ¿Quién paga el descuento?
- ¿Mínimos, máximo de descuento, compatibilidad con ofertas y límites por cliente?
- ¿Qué ocurre con saldo, canjes y derechos al cancelar, impagar o reembolsar?
- ¿Quién crea campañas y por qué canales se reciben?
- ¿Entra en el primer MVP? ¿Qué canal de contratación móvil corresponde al diseño final?

## Verificación futura

Pruebas de doble crédito por evento repetido, canjes concurrentes desde dos dispositivos, reserva liberada con pago tardío, refund parcial repetido, uso de campaña expirada, membresía cancelada, financiación incorrecta y acceso a saldo ajeno. Comparar conciliación ledger/proyección y pago final. No se han ejecutado porque todavía no existe implementación.
