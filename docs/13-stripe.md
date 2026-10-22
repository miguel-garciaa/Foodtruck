# Stripe Billing y Connect

**Cerrado:** licencia inicial y mensualidad de los comerciantes con Billing; pagos de comida mediante Connect. **Pendiente:** tarifas, comisión, responsabilidades comerciales, configuración Connect y política de devoluciones.

## Flujos económicos independientes

| Circuito | Quién paga | Beneficiario | Referencias locales |
| --- | --- | --- | --- |
| Billing | Comerciante | Plataforma Foodtrucks | Customer de plataforma, suscripción y facturas |
| Billing cliente, propuesto en web | Cliente suscriptor | Plataforma Foodtrucks | Customer/contexto y suscripción cliente separados por producto |
| Connect | Cliente de comida | Comerciante, según modelo aprobado | Cuenta conectada, pago y pedido |

Un food truck es vendedor de comida y cliente del software. No mezclar customers, facturas o saldos entre contextos.

## Alta y mensualidad

Base propuesta: Stripe Checkout en web para precio único de licencia junto a precio recurrente en la primera factura; renovaciones solo recurrentes. Customer Portal para gestión. Validar esta combinación con la API/versión elegida antes de implementarla.

| Ejemplo de C01 | Valor ilustrativo, NO aprobado |
| --- | --- |
| Licencia de alta | 99 € una vez |
| Mensualidad | 29 €/mes |
| Comisión inicial sugerida | 0 % |
| Comisión futura opcional | 2 % |
| Ticket de muestra | 24,50 €, datos ficticios |

IVA, precios con/sin impuestos, periodicidad contractual, descuentos y comisión de procesamiento están pendientes. Estos valores no deben aparecer como tarifas de producción ni semillas comerciales.

Activación exige pago confirmado y criterios de acceso; cancelar o fallar una factura requiere política de gracia definida, sin abandonar pedidos pagados. [Webhooks de suscripción](https://docs.stripe.com/billing/subscriptions/webhooks).

## Modelo Connect

C01 recomendó **cargos directos** con el comerciante como vendedor de comida y, cuando la configuración lo permita, responsable de costes de procesamiento. Esto es una propuesta; Stripe no decide por sí solo quién es vendedor legal, responsable fiscal o de disputas.

Antes de codificar: fijar país, modelo de cuentas, Dashboard/onboarding, capabilities, responsabilidad de saldo negativo, comisiones y devoluciones. No convertir destination charges o cargos/transferencias separados en decisión implícita. [Cargos directos](https://docs.stripe.com/connect/direct-charges).

Si se aprueban cargos directos, crear/consultar pagos en el contexto de la cuenta conectada y configurar SDK/webhooks coherentemente. IDs, customers y PaymentIntents no deben resolverse como si fueran siempre de la plataforma.

## Flujo económico propuesto

1. Laravel valida compra y crea intención/pedido pendiente con importe y moneda calculados.
2. Solicita pago Stripe con clave de idempotencia persistida y contexto de cuenta correcto.
3. Cliente completa PaymentSheet; web usa Checkout o Elements según selección pendiente.
4. Webhook verificado o conciliación autenticada confirma pago y relación con pedido.
5. Transacción local actualiza pago/pedido, habilita ticket y registra outbox.
6. Si el pago llega cuando la compra ya no puede cumplirse, abrir compensación/reembolso según política; no confirmar stock inexistente.

No guardar datos de tarjeta en Foodtrucks. El cliente recibe solo información mínima requerida por el SDK y nunca la clave secreta.

## Webhooks y recuperación

Verificar firma sobre cuerpo original, preservar entorno/cuenta y deduplicar eventos. Aceptar desorden y reintentos; persistir antes de responder éxito y procesar efectos de forma idempotente. Conciliar estados ambiguos. [Guía de webhooks](https://docs.stripe.com/webhooks).

Propuesta de suscripción: invoice.paid, invoice.payment_failed y customer.subscription.updated/deleted. Connect requiere cambios de capabilities/requisitos, pagos, refunds y disputas. La lista exacta depende de la versión/modelo de eventos elegidos; probar fixtures de esa versión.

## Casos de prueba y límites

Doble clic, abandono, autenticación adicional, webhook duplicado/fuera de orden, caída del worker, cuenta Connect restringida, pago tardío, reembolso fallido y disputa. Confirmar que nunca se activa un negocio solo por return_url.

La consulta del conector Stripe requirió reautenticación; se utilizaron referencias públicas oficiales. No se accedió a cuentas reales ni se configuraron claves, productos, precios o cobros.

## Nueva suscripción de clientes y descuentos

U01 solicita ofertas/promociones y puntos por compra; U02 confirma **5,99 €/mes en EUR**. Impuestos y condiciones de beneficios pendientes. Proponer Billing para contratación web; al implementarlo, precio base 599 unidades mínimas EUR e intervalo mensual, con configuración fiscal por definir. No se ha creado un precio real en Stripe. Verificar clasificación/canal móvil antes de dar por permitido Stripe dentro de la app.

Separar derechos de membresía de cliente de la licencia del puesto y del pago de comida. No aplicar un cupón Billing a una factura de software para simular un descuento en un pedido Connect. Laravel calcula el total de comida y conserva regla/financiador; compensación al comerciante depende del modelo acordado. [Especificación completa](25-suscripcion-clientes-fidelizacion.md).
