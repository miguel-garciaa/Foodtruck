# Costes, suscripciones y presupuesto de Foodtrucks

**Versión:** 1.6 · **Fecha:** 13 de octubre de 2026. U09 pide incluir herramientas y servidor doméstico para desarrollo/producción. U12 aporta las cuantías siguientes. Son importes declarados por el usuario, no tarifas públicas consultadas ni facturas verificadas. La moneda se interpreta como EUR por su respuesta; Plus, OpenCode y Figma se presupuestan mensualmente. Comprobar periodicidad de facturas, impuestos y cualquier cambio antes de cerrar tesorería.

## Subtotal conocido de herramientas

| Concepto | Importe declarado | Periodicidad usada | Equivalente mensual | Doce meses sin cambios |
| --- | --- | --- | --- | --- |
| ChatGPT Plus | 23,00 € | Mensual | 23,00 € | 276,00 € |
| OpenCode/modelos | 9,30 € | Mensual | 9,30 € | 111,60 € |
| Figma Dev Mode | 15,00 € | Mensual | 15,00 € | 180,00 € |
| 21st.dev | 22,00 € | **Trimestral, indicado por el usuario** | 22 / 3 = 7,333… €; mostrado 7,33 € | Cuatro cobros: 88,00 € |
| **Herramientas** | | | **54,633… €; mostrado 54,63 €** | **655,60 €** |

El usuario aproxima 21st.dev a 7 €/mes; con 22 € por trimestre su equivalente exacto es 7,333… €. Mantener el cargo trimestral de 22 €, sin rebajarlo a 21 € al calcular. El anual se obtiene de pagos originales: 23 × 12 + 9,30 × 12 + 15 × 12 + 22 × 4. No multiplicar el subtotal mensual ya redondeado: 54,63 × 12 daría 655,56 €, cuatro céntimos menos por redondeo.

**54,63 €/mes es el subtotal equivalente de estas cuatro herramientas, no el coste total de Foodtrucks.** Hardware, electricidad, red, backups, correo, mapas, pagos, observabilidad y trabajo no tienen todavía un total verificable. Una partida pendiente no se contabiliza como gratuita.

## Caja y renovación trimestral

Los tres cargos mensuales suman 47,30 €. Si el trimestre de 21st.dev se paga completo en un mes, el desembolso de herramientas de ese mes es 69,30 €; los otros dos, 47,30 €. Una reserva de 7,333… €/mes financia cada renovación de 22 €, pero no constituye un segundo gasto además de esa factura.

Escenario ilustrativo de doce meses, suponiendo una renovación inicial en M1 y que todas las suscripciones siguen activas. **No son fechas reales de cobro ni un calendario aprobado.**

| Mes | Herramientas mensuales | Cobro 21st.dev | Salida de caja de herramientas |
| --- | --- | --- | --- |
| M1 | 47,30 € | 22,00 € | 69,30 € |
| M2 | 47,30 € | — | 47,30 € |
| M3 | 47,30 € | — | 47,30 € |
| M4 | 47,30 € | 22,00 € | 69,30 € |
| M5 | 47,30 € | — | 47,30 € |
| M6 | 47,30 € | — | 47,30 € |
| M7 | 47,30 € | 22,00 € | 69,30 € |
| M8 | 47,30 € | — | 47,30 € |
| M9 | 47,30 € | — | 47,30 € |
| M10 | 47,30 € | 22,00 € | 69,30 € |
| M11 | 47,30 € | — | 47,30 € |
| M12 | 47,30 € | — | 47,30 € |
| **Total** | **567,60 €** | **88,00 €** | **655,60 €** |

Registrar renovación real, medio de pago, plan, plazas, límites, descuento promocional y aviso de vencimiento en un inventario privado sin datos de tarjeta. Si una herramienta sirve a otros proyectos, conservar su gasto total y definir después la fracción atribuible a Foodtrucks; no presentar esa asignación como ya acordada.

## Licencia de herramienta, uso de modelos y cuotas

El cargo de 9,30 € se registra como **OpenCode/modelos**, sin identificar todavía plan/proveedor o consumos incluidos. OpenCode permite proveedores distintos; no asumir que el cliente, un plan de modelos y cualquier API son una sola cuota ilimitada. Registrar proveedor, modalidad, moneda original, límites y posibles recargas cuando exista evidencia. [Proveedores OpenCode](https://opencode.ai/docs/providers/).

No agregar otro cargo de Codex automáticamente si el acceso utilizado ya forma parte de la suscripción ChatGPT correspondiente. El uso con API key sigue facturación API separada; tampoco asumir que Plus cubre cualquier API o proveedor que se use desde OpenCode. Verificar la modalidad concreta y evitar doble conteo. Se conserva el importe declarado de 23 €, sin sustituirlo por una tarifa pública en USD. [Documentación oficial OpenAI sobre suscripción y API](https://learn.chatgpt.com/docs/pricing).

Figma: comprobar plaza Dev/Full, facturación mensual/anual y número de usuarios; el presupuesto incluye los 15 € declarados, no una plaza extra inventada. 21st.dev: conservar periodicidad trimestral del usuario y confirmar plan/créditos, licencia y acceso MCP; la elección de componentes no prueba un coste variable o licencia ilimitada. [Selección 21st.dev](06-21st-dev-mcp.md).

## Servidor de casa: inversión y funcionamiento

**Cerrado por U09:** desarrollo y producción en servidor doméstico. VPS deja de ser el destino base; no se suma una cuota VPS por defecto. Un servicio externo de contingencia solo se presupuesta si se decide contratarlo. [Diseño doméstico](38-servidor-domestico.md).

| Partida | Tratamiento y dato que falta |
| --- | --- |
| Servidor físico | Comprado o por comprar, precio real, garantía, CPU/RAM, consumo y capacidad: pendientes |
| NVMe/discos de datos | Precio/capacidad/endurance y reposición; separar expansión de inversión inicial |
| Backup externo | Destino fuera del host y del domicilio, capacidad, transferencia y retención; coste pendiente |
| SAI/UPS y baterías | Compra, autonomía medida, reposición y pérdidas energéticas; pendientes |
| Red doméstica | Router/switch, segmentación necesaria, red de administración y coste incremental |
| Internet | Servicio apto para hosting, subida medida, IP/CGNAT; coste adicional atribuible pendiente |
| IP fija/DDNS/túnel | Ruta de publicación por decidir y condiciones efectivas del ISP/proveedor |
| VMware/hipervisor | Edición, licencia y contrato reales; no asumir coste cero o cuota obligatoria |
| Electricidad/refrigeración | Medida de consumo y tarifa del contrato; no usar potencia nominal como consumo real |
| Operación | Horas de administración, pruebas de restore, incidentes, soporte y mantenimiento |

Los 4 vCPU, 8 GB RAM y 40 GB NVMe definen la VM de desarrollo anterior; no son el inventario físico ni el dimensionamiento de producción o monitorización. No valorar un servidor, una UPS o un equipo ya comprado sin conocer sus datos.

### Electricidad y recursos compartidos

Fórmula por intervalos, con W medidos en la entrada eléctrica:

~~~text
energia_kWh = suma(potencia_media_W_del_intervalo × horas_del_intervalo) / 1000
coste_electrico = suma(energia_kWh_del_intervalo × tarifa_EUR_por_kWh_del_intervalo)
~~~

Para potencia media constante, usar W / 1000 × horas reales del mes × tarifa. Medir reposo, carga normal, builds y backups; una fuente de 500 W no significa consumo continuo de 500 W. Si el contador incluye UPS, router y ventiladores, no sumarlos otra vez. Refrigeración adicional solo cuando exista incremento medible. Costes fijos del suministro se asignan aparte únicamente con criterio explícito, sin cargar toda la factura del hogar automáticamente.

Si DEV y PROD comparten el mismo host, medir una vez el consumo total y asignar después; no facturar dos servidores 24 horas al día como si fueran físicos independientes. Cambiar recursos virtuales no duplica por sí solo la electricidad. Reservar CPU/RAM/disco para producción y observabilidad; evitar builds en el host de pedidos activos cuando causen contención.

La inversión inicial se cuenta una vez en caja. Para comparar coste económico puede distribuirse un coste de reposición entre meses de vida útil propuesta; no sumar a la vez esa distribución y la compra completa al mismo indicador. Vida útil, valor de equipo existente, financiación y tratamiento fiscal pendientes; no se prescribe amortización tributaria.

## Servicios y partidas adicionales

| Grupo | Variable de coste y decisión pendiente |
| --- | --- |
| Dominio Cloudflare | Compra y renovación reales, TLD, titularidad; foodtrucks.com es referencia no verificada |
| Cloudflare | Plan/reglas, Access/Tunnel si se eligen, condiciones y límites reales; no dar por contratadas funciones de pago |
| Resend/buzón | Plan, volumen de correo operativo/promocional/alertas, cuotas, dominios y buzón atendido |
| Mapbox | Usuarios móviles, cargas web y APIs adicionales según uso/contrato; no reutilizar límites históricos como precio vigente |
| Stripe | Processing/Billing/Connect, reembolsos/disputes y quién soporta cada coste; separar plataforma y comerciante |
| Tiendas/builds | Cuentas Apple/Google, builds remotos/firma y distribución si se seleccionan; cantidades pendientes |
| GitHub/CI/registro | Plan, minutos, almacenamiento/artifacts e imágenes; no afirmar gratuitos por defecto |
| Observabilidad | CPU/RAM/disco local, series/retención, logs/trazas, Sentry, sondas externas y alertas; [doc41](41-observabilidad-grafana-prometheus-sentry.md) |
| Seguridad/QA | Herramientas efectivamente elegidas, runners aislados, mantenimiento y revisiones humanas; no contratar todos los scanners propuestos |
| Marketing/contenido | **400 al mes como referencia pendiente**, moneda/reparto y gasto sin aprobar; diseño/copy/creativos aparte |
| Legal/soporte/operación | Revisión del mercado, documentos, soporte comercial y administración: pendientes |

Los mapas, emails, pagos y errores crecen con uso. Definir límites/alertas antes de activar planes medidos, teniendo en cuenta que una alerta de presupuesto no garantiza un corte estricto. No registrar cuotas gratuitas como capacidad asegurada ni contratar extras automáticamente al agotar créditos.

## Indicadores del presupuesto

~~~text
equivalente_mensual_herramientas = 23 + 9.30 + 15 + 22/3
coste_operativo_conocido = subtotal de partidas verificadas, con su alcance
coste_total = herramientas + energia/red/backup + servicios variables + operacion + partidas pendientes
caja_mes = pagos que vencen en ese mes + compras/inversiones reales + consumos del mes
~~~

El coste total permanece **incompleto**, sin un número final que trate pendientes como cero. El escenario Google Ads no se incorpora al subtotal de herramientas ni se considera inversión aprobada. Tampoco se restan ingresos hipotéticos AdSense/AdMob, comisiones o suscripciones futuras.

Membresía cliente de 5,99 €/mes es **ingreso bruto de producto**, no gasto de herramientas ni margen. Para estudiar equilibrio usar contribución neta real después de impuestos aplicables, pagos, beneficios/puntos, reembolsos y costes variables. Contribución, mezcla cliente/comerciante y tarifas comerciales pendientes: no calcular una promesa de rentabilidad dividiendo gastos entre 5,99 sin esos datos.

## Datos pendientes y control mensual

Pendientes: facturas/periodos/IVA, plan OpenCode/proveedor, plazas Figma, renovaciones, asignación a Foodtrucks, compra/inventario físico, consumo W, tarifa kWh, horas/carga, ISP/IP/CGNAT, UPS, backups fuera de casa, costes de servicios/observabilidad y horas operativas. Conservar solo documentación de gasto necesaria y sin claves o datos de tarjeta.

Cada mes conciliar pagos reales y fechas con el presupuesto, consumos y factura; registrar aumentos y cancelaciones. Mantener vista de caja y vista mensual equivalente sin mezclarlas. Revisar alertas de cuota/modelos/email/telemetría y retención. Ningún importe aquí acredita una compra, cuota contratada, factura fiscal revisada o infraestructura instalada.
