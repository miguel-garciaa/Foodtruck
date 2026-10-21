# Hitos y roadmap

**Estado:** propuesta de secuencia sin fechas ni estimaciones definitivas. Mantener dependencias; no considerar implementado ningún hito.

| Hito | Resultado revisable | Dependencias y aceptación |
| --- | --- | --- |
| H0. Cierre mínimo | Decisiones de país, pagos, stock/franjas, web y reglas comerciales | Resolver bloqueos antes de codificar su comportamiento |
| H1. Fundamentos | Monorepo, versiones, VM/red, Compose base, health, dominio Cloudflare/HTTPS y CI mínima | App/emulador llega a Go; persistencia, puertos, DNS y certificados revisados |
| H2. Riesgos nativos | Expo development builds, Mapbox y panel animado | Prueba iOS/Android real; matriz de compatibilidad y FPS registrada |
| H3. Diseño previo | Catálogo 21st.dev evaluado y tokens claro/oscuro | Licencias y dependencias; dock móvil/header web; prototipo aprobado |
| H4. Identidad/datos | Auth propia, Google/Apple, correo Resend, negocio y ubicación | Permisos, enlaces de identidad, entrega/relay Apple y queries geográficas |
| H5. Carta/descubrimiento | Productos, fotos persistentes y mapa con fichas | Ambos temas, alérgenos, caché e invalidación verificadas |
| H6. Comercios/Billing | Onboarding Connect, licencia/mensualidad, acceso | Stripe test, impagos y cuenta restringida |
| H7. Compra | Pedido recuperable, pago y conciliación | Importes servidor, idempotencia, stock/franja según decisión |
| H8. Recogida/avisos | Estados, QR único, outbox, push y seguimiento | Doble canje, reintentos, fallback y recuperación |
| H9. Operación | Panel admin, backup/restore, monitorización y despliegue | Incidencias y rollback documentados; sin secretos expuestos |
| H10. Piloto | Recorrido real con puestos seleccionados | Autorización de producción y aceptación funcional/operativa |

H2 es una prueba de compatibilidad/rendimiento, no implementación visual final; respeta la evaluación previa pedida de 21st.dev. Live Activities/Live Updates pueden probarse técnicamente pronto por su riesgo, pero su prioridad exacta de lanzamiento está pendiente.

## Primera entrega de código recomendada

Monorepo mínimo, API health, conectividad del emulador y servicios de datos en VM. Antes de añadir compra, validar build nativa Mapbox y acceso geográfico. No construir suscripciones con tarifas ejemplo ni reglas de cancelación inventadas.

## Requisitos del piloto

- Registro y login; comercio elegible, ubicación y carta.
- Pago de prueba o live autorizado, pedido y notificación de listo.
- Canje QR con red y prevención de duplicado.
- Fallos recuperables y soporte de incidencias.
- Backups restaurados, límites, logs, alertas y secretos gestionados.
- Condiciones comerciales y legales revisadas para el mercado elegido.

La propuesta histórica de 5–10 puestos en una ciudad es orientativa. No se ha acordado fecha, ciudad, presupuesto o capacidad simultánea.

## Evolución posterior

Reseñas, campañas avanzadas adicionales, próximas paradas, pedidos anticipados, analítica comercial y comisión opcional. Escalar CPU/disco o separar servicios según mediciones; no añadir Kubernetes como destino obligatorio.

## Definición de terminado por cambio

Comportamiento acordado, permisos/errores revisados, pruebas significativas ejecutadas cuando exista entorno, lint/format/build aplicables y documentación actualizada. Informar comandos no ejecutados y limitaciones reales.

## Riesgos a vigilar

Compatibilidad Expo/Mapbox/nativo, rendimiento con mapa/fotos, pagos tardíos y rechazo, cambios de ubicación, espacio de 40 GB, pérdidas por host único y disponibilidad de notificaciones de SO. Cada riesgo tiene que tener prueba o decisión, no una promesa.

## Hito adicional H11 — membresía y fidelización

U01 incorpora suscripción cliente y puntos al proyecto; prioridad dentro del primer lanzamiento pendiente. Puede compartir fundamentos de Billing, auth y pedidos, pero exige cerrar impuestos, reglas de puntos, financiación y canal móvil. El precio **5,99 €/mes** ya está confirmado.

Entregable: contratación/gestión, derechos sincronizados, ofertas, ledger/saldo, descuentos en checkout y compensaciones. Aceptación: no doble crédito/gasto, canje válido, refund conciliado, separación cliente/comerciante y condiciones transparentes. H11 identifica trabajo adicional; su numeración no obliga a situarlo después del piloto.

## H12 — preparación de Google Ads

Antes de lanzamiento: cerrar ciudad, objetivos, beneficios reales y destinos; preparar medición/consentimiento y anuncios revisables. Después de verificar oferta y compra, aprobar un piloto de Search separado para clientes/comerciantes. Campañas App tras publicación y validación de eventos.

Referencia de inversión: 400 al mes, pendiente por petición del usuario. Calendario, moneda, reparto y gasto no están aprobados. Las skills se seleccionan/cargan en cada hito conforme a [inventario](26-skills-proyecto.md); no cambian el stack ni equivalen a trabajo implementado.

## Dependencias Cloudflare/Resend del piloto

Antes de H1 cerrar nombre del dominio y destino/IP, escoger estrategia de certificados y preparar cuentas/accesos mínimos. Antes de H4 verificar remitente/DNS, configurar webhook y flujo de identidad con pruebas; buzón atendido y Reply-To requieren decisión. H8/H9 incorporan estados de correo, supresiones, alertas y recuperación.

No enviar promociones antes de preferencias/bajas y beneficios reales definidos. Validar webhooks Stripe/Resend, API móvil, OAuth y enlaces de app con las reglas Cloudflare finales. Estos hitos especifican trabajo futuro, no acreditan compra/configuración. [Dominio](29-cloudflare-dominio-dns.md), [correo](30-correo-resend.md).

## H13/H14 — SEO, ASO, medición y monetización evaluada

H13 integra páginas públicas, SEO técnico/local, contenido, ASO y GA4/Firebase con fundamentos/auth/catálogo/pedidos. No exige esperar al final del desarrollo para diseñar SEO, ni declara compra web completa en el MVP. H14 evalúa AdSense/AdMob y configura pruebas únicamente cuando existan producto, elegibilidad, consentimiento y SDK compatibles; monetización live es una decisión posterior.

[Plan maestro](31-marketing-digital-maestro.md) registra la fase 1 del material disponible y prioridades. [Calendario de 90 días](35-aso-contenidos-roadmap-90-dias.md) adapta las seis ventanas del prompt a dependencias reales y contempla editorial/ASO. No sustituye hitos H0–H12 ni fija fecha de lanzamiento. Presupuesto 400 al mes continúa pendiente.

## H15–H17 — alojamiento, seguridad/QA y observabilidad

H15 valida servidor doméstico, aislamiento, WAN/Tunnel, capacidad, energía y backups fuera del domicilio; se incorpora a fundamentos/operación antes del piloto. H16 adapta seguridad/QA/testing/CI/CD/Git por fases A–G del prompt y pruebas críticas de auth/pedidos/pagos/QR/puntos. H17 instrumenta métricas/errores/dashboards/alertas verificables y recuperación por fases del prompt de observabilidad.

Los hitos describen resultados futuros. Empezar por código/Git/infraestructura reales; no marcar una fase de app terminada por crear documentación. Costes de herramientas conocidos 54,63 €/mes equivalente; alojamiento/proveedores/observabilidad pendientes y Google Ads 400 al mes pendiente. [Costes](37-costes-presupuesto.md), [servidor](38-servidor-domestico.md), [QA](40-testing-qa-github.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md).
