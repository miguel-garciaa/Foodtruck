# Decisiones cerradas y preguntas pendientes

**Base documental:** v1.10 · **Actualización local:** 20 de octubre de 2026.

Consultar las decisiones y preguntas pertinentes antes de implementar; el historial se usa para contexto o conflictos. C01–C11 corresponden a [procedencia](00-procedencia.md). S indica la solicitud inicial de documentación; U01 identifica la ampliación de membresía cliente y U02 confirma su precio mensual. “Cerrado” no significa implementado.

## Decisiones cerradas

| ID | Decisión | Fuente |
| --- | --- | --- |
| D01 | Nombre Foodtrucks | C07/S |
| D02 | Marketplace: mapa, carta, encargo, pago y recogida presencial con ticket QR | C01/S |
| D03 | Licencia inicial y mensualidad a comerciantes, con Stripe | C01/S |
| D04 | React Native + Expo + TypeScript móvil; Next.js web | Evolución C07 confirmada en S |
| D05 | Dock solo app nativa; header y menú responsive web | C10/S |
| D06 | Go + Chi + pgx/sqlc para backend | C03/S |
| D07 | PostgreSQL + PostGIS | S, base mantenida desde C01 |
| D08 | Redis con caché e invalidación | C03/S |
| D09 | Mapbox personalizado, nativo/web | C03/S |
| D10 | Stripe Billing y Connect, circuitos separados | C01/S |
| D11 | Auth propia email/contraseña + Google + Apple; sin Supabase | C02/S |
| D12 | APNs/FCM, Live Activities/Android Live Updates | C06/S |
| D13 | Objetivo 120 FPS cuando hardware/SO permitan | C08/S |
| D14 | Ubuntu Server 26.04, VMware dev con 4 vCPU/8 GB/40 GB NVMe | C05/S |
| D15 | Servidor en casa para DEV/PROD, Ubuntu/Compose/Caddy; VPS histórico sustituido | U09 sustituye C04/S |
| D16 | Fotos persistentes locales, sin S3; backups externos | C04/S |
| D17 | Código y documentación en GitHub | C06/C11/S |
| D18 | Claro/oscuro y evaluar 21st.dev antes del frontend visual | C09/S |
| D19 | No afirmar auditoría exhaustiva ni código/claves reales | C09/S |
| D20 | Suscripción de clientes con ofertas, promociones y puntos por compra para descuentos | U01 |
| D21 | Suscripción cliente **5,99 €/mes en EUR**; impuestos aún pendientes | U01/U02 |
| D22 | Descubrir, seleccionar y cargar las skills pertinentes para Foodtrucks | U03 |
| D23 | Planificar Google Ads para captar clientes y comerciantes | U04 |
| D24 | Comprar el dominio en Cloudflare y utilizar su DNS | U07 |
| D25 | Resend para el envío de correos de Foodtrucks | U07 |
| D26 | Incorporar el prompt de marketing: SEO técnico/local, ASO, contenido y roadmap condicionado de 90 días | U08 |
| D27 | Evaluar elegibilidad y preparar AdSense web/AdMob móvil; no activación real por defecto | U08 |
| D28 | Planificar medición GA4 web y Firebase Analytics móvil, conservando auth propia | U08 |
| D29 | Incluir gastos de Plus/OpenCode/Figma/21st.dev; 21st.dev trimestral | U09 |
| D30 | Importes declarados: Plus 23, OpenCode 9,30, Figma 15 EUR; 21st.dev 22 EUR/trimestre; facturas/condiciones pendientes | U12 |
| D31 | Incorporar seguridad/QA/testing/CI/CD/Git y revisión conforme al prompt | U10 |
| D32 | Incorporar diseño/instrumentación Grafana, Prometheus, Sentry y alertas conforme al prompt | U11 |
| D33 | Commit y push tras cada cambio coherente, con comprobaciones y pruebas pertinentes | U13 y aclaración |
| D34 | GitHub Actions para CI/CD | U13/U14 |
| D35 | GHCR para imágenes aprobadas, con digest trazable | U14 |
| D36 | Staging automático; producción con aprobación manual de la release probada | U13 y aclaración |
| D37 | Integrar requisitos de prompts en políticas, sin copias independientes; alcance actual documental | U14/U15 |
| D38 | Primer panel del propietario centrado en negocios y suscripciones, con incidencias/auditoría | U16 y aclaración |
| D39 | Continuar identidad actual y modos claro/oscuro en la ampliación de componentes | U16 y aclaración; tokens finales no cerrados |
| D40 | Tarjetas de novedades una vez por actualización con cambios relevantes | U17 y aclaración |
| D41 | Calendario inicialmente para filtros de fechas/periodos del panel | U17 y aclaración |
| D42 | Capturas como ejemplos de recursos; no aprobar funciones/idiomas de las demos por su imagen | U17/U18 |
| D43 | Incorporar protección de datos y marcos de calidad/ciclo/testing/seguridad como controles prácticos proporcionados, sin preparar certificaciones | U20/U21 |
| D44 | Organizar la lectura en ocho bloques, con README principal de máximo 800 palabras e índice completo plegado; conservar los 49 documentos y políticas separados, sin borrarlos, fusionarlos ni añadir un documento | U22 |
| D45 | Instalar una selección de ECC compatible con Foodtrucks y las skills actuales, con alcance de proyecto en .agents/skills y procedencia fijada por commit | Petición del usuario y elección «Selección para Foodtrucks», 20/10/2026 |
| D46 | Consolidar AGENTS y CI/CD dentro de los 49 documentos existentes: AGENTS máximo 800 palabras, lectura por tarea e historial contextual; 21 define entornos, 40 pruebas, 44 política de entrega y DevOps procedimientos; conservar requisitos, casos QA y decisiones | Plan aprobado e implementación solicitada, 20/10/2026; complementa D44 sin borrar ni fusionar archivos |

## Bases propuestas, no cierres comerciales

**Inicio de implementación, 21/10/2026:** el usuario aprueba crear únicamente la base Android en `apps/mobile`, con Expo SDK 58, Expo Router, TypeScript, npm/lockfile, development build local y pantalla estática en español con tema automático. Identificador de desarrollo provisional `com.foodtrucks.dev`. Tras elegir inicialmente Pixel_10, cambia la prueba inicial a su móvil Android físico por USB. Esto concreta P17 para la base móvil y P54 para el gestor local; versiones mínimas de producto, Git/remoto y CI siguen pendientes. No cierra las demás cuestiones comerciales ni autoriza publicación. Evidencia de implementación y comprobaciones en la [guía móvil](../apps/mobile/README.md).

**Ampliación posterior del mismo día:** pospone la prueba en su móvil y autoriza desarrollar la interfaz cliente con estética y distribución inspiradas en sus capturas de Airbnb. Pixel_10 vuelve a estar disponible y se utiliza para build, instalación y QA. Se implementan búsqueda, categorías, filtros, favoritos de sesión, ficha/carta y estados vacíos con datos sintéticos; el mapa online sigue pendiente de configurar Mapbox. Por indicación expresa, se termina primero la base inicial y después se exploran las secciones principales de Airbnb en el navegador indicado. Se adapta su organización a Perfil, colección de favoritos, preferencias, ayuda y privacidad de la demostración. Esto no confirma funciones de alojamiento, chat, pagos, alta comercial o contratos de API por aparecer en las referencias.

Monolito modular; app única con modos cliente/comerciante; roles customer/truck_owner/admin; Expo Router; Reanimated/Worklets/Gesture Handler; Skia/FlashList según uso; cache-aside con TTL iniciales; outbox PostgreSQL; cargos directos Connect; Checkout/Portal para Billing; automático de tema por defecto; paleta marfil/coral/azul noche; aprobación administrativa; WebSocket preferente con SSE alternativo.

Herramientas auxiliares goose, slog, OpenTelemetry, Testcontainers, go-redis y stripe-go fueron recomendadas. Versiones e incorporación concreta se verificarán al implementar.

Entidades, rutas, errores, claves Redis, reglas de archivos y detalles de implementación/hitos concretan el proyecto como **propuestas**. Los cierres explícitos de commit/push, GitHub Actions, GHCR, staging automático y aprobación manual de producción prevalecen sobre su antigua clasificación como propuesta.

## Preguntas pendientes prioritarias

| ID | Pregunta | Bloquea |
| --- | --- | --- |
| P01 | ¿País/ciudad y territorio de comercios/clientes? | Connect, moneda, impuestos, condiciones |
| P02 | ¿Tarifa real de licencia/mensualidad, IVA y comisión? | Productos/precios de Billing y contratos |
| P03 | ¿Cargos directos y qué configuración/responsabilidades Connect? | Pago, KYC, disputes y saldos |
| P04 | ¿Quién vende legalmente y emite factura de comida? | Política comercial/fiscal |
| P05 | ¿Cuándo se cobra: antes o después de aceptación? ¿Captura inmediata o diferida? | Máquina de estados y compensación |
| P06 | ¿Cancelaciones, rechazo, no recogida y reembolsos? | UX, API y contabilidad |
| P07 | ¿Stock por unidades, reservas temporales y límites de complementos? | Transacciones y sobreventa |
| P08 | ¿Franjas/capacidad o recogida inmediata? ¿Cómo se estima ETA? | Checkout y seguimiento |
| P09 | ¿Web cliente con compra completa en primer MVP o web centrada en paneles? | Alcance y prioridad de Next.js |
| P10 | ¿Aceptación manual/automática y pausa de pedidos? | Operación y avisos |
| P11 | ¿Cambios de ubicación con pedidos ya pagados? | Recogida y soporte |
| P12 | ¿Periodo de gracia, suspensión y baja comercial? | Acceso Billing y obligaciones activas |
| P13 | ¿Una app única, varios negocios por cuenta y empleados? | Membresías y navegación |
| P14 | ¿Compra como invitado o cuenta obligatoria? | Auth y recuperación de pedido |
| P15 | Criterios/documentos de revisión y reglas de aprobación para publicar; facultad administrativa incluida, automatización/gates por definir | Onboarding/admin |
| P16 | ¿Live Activities/Updates obligatorias en lanzamiento o por fases? | Alcance nativo y pruebas |
| P29 | ¿Los 5,99 €/mes incluyen impuestos y qué configuración fiscal corresponde? | Total fiscal y presentación del precio |
| P30 | ¿Quién gana/canjea puntos, cuánto, cuándo y con qué caducidad? | Regla de fidelización |
| P31 | ¿Qué puestos participan y quién financia cada descuento? | Economía y conciliación Connect |
| P32 | ¿Mínimos, máximos, combinación de ofertas y límites? | Checkout y campañas |
| P33 | ¿Saldo/beneficios ante baja, impago, cancelación y refund? | Derechos y movimientos compensatorios |
| P34 | ¿Canal de contratación móvil, gestión de campañas y fase de lanzamiento? | Distribución, permisos y roadmap |
| P35 | ¿Ciudad/zona, calendario e idiomas de Google Ads? | Alcance del piloto |
| P36 | ¿Destinos y beneficios que estarán disponibles al anunciar? | Mensajes y conversión real |
| P37 | ¿SDK/configuración GA4/Firebase, consentimiento, atribución y responsable? | Arquitectura solicitada; ejecución y calidad de datos pendientes |
| P38 | Confirmar presupuesto, moneda y reparto: referencia 400 al mes, expresamente pendiente | No hay autorización de inversión |

## Pendientes técnicos y operativos

| ID | Definir/verificar |
| --- | --- |
| P17 | Versiones compatibles, gestor npm/pnpm, SDK Expo y mínimos iOS/Android |
| P18 | WebSocket o SSE, protocolo/versionado y reconexión |
| P19 | JWT/token opaco, duración de sesiones y revocación |
| P20 | OAuth IDs/redirects, APNs/FCM y firma móvil; proveedor de correo ya cerrado en Resend |
| P21 | Acceso MCP, licencias y selección final 21st.dev |
| P22 | Tokens/paleta/fuentes definitivos y estilos Mapbox publicados |
| P23 | foodtrucks.com indicado como referencia en U08: verificar control/disponibilidad y uso de producción; hardware doméstico/WAN o Tunnel, staging, presupuesto y disco |
| P24 | Cuotas de fotos, conversión, retención y política de privacidad |
| P25 | Destino backups, cifrado, frecuencia, retención, RPO/RTO y restore |
| P26 | SLO API, carga esperada, dispositivos y umbrales de frames |
| P27 | Detalles de implementación CI/CD y release, propiedad/visibilidad GHCR, promociones/tiendas/firma y acceso al servidor; proveedor y controles de promoción ya cerrados |
| P28 | Soporte, alertas, responsables, incidentes y acceso administrativo |
| P39 | Plan Cloudflare, hostnames, proxy/CDN, estrategia ACME y política de origen/DNSSEC a ejecutar |
| P40 | Resend: región/plan/volumen, remitentes, cuotas, retención, frecuencia y plantillas finales |
| P41 | Buzón de soporte/Reply-To, responsables y si se necesita Receiving de Resend |
| P42 | Alcance de campañas email, consentimiento, bajas, seguimiento y tratamiento de supresiones |
| P43 | Alcance/prioridad de páginas públicas web, ciudades/categorías/idiomas con oferta suficiente y reglas de publicación/indexación |
| P44 | Elegibilidad GBP de cada negocio, propietario/autorización, datos y enlace de navegación externa |
| P45 | AdSense/AdMob: elegibilidad, cuentas, formatos/slots, economía, frecuencia y autorización de producción |
| P46 | Mercados/edades, CMP/UMP, ATT cuando aplique, política de datos, retención y SDK compatibles |
| P47 | IDs/builds/tiendas, categoría, idiomas, assets verificados y experimentos ASO |
| P48 | Fecha de inicio, recursos/responsables y aprobación del calendario editorial/roadmap de 90 días |
| P49 | Patrocinios, herramientas premium y comisiones: si se adoptan, financiación, reglas y etiquetado; ningún precio nuevo aprobado |
| P50 | Facturas/periodos/IVA, plan proveedor OpenCode, plazas y asignación de cuotas al proyecto; renovaciones reales |
| P51 | Hardware existente/nuevo, total CPU/RAM/discos, reservas DEV/PROD/observabilidad, hipervisor y coste |
| P52 | ISP/contrato, subida real, IPv4 pública/CGNAT/IPv6, Tunnel o directo, administración y firewall |
| P53 | Consumo W/kWh, tarifa, horarios, SAI/autonomía y coste de red/refrigeración/mantenimiento |
| P54 | Repo Git/remoto/ramas/gestor/versiones, scripts/tests/gate configurado, plan/visibilidad GitHub, revisores/protecciones, mecanismo de aprobación/acceso y rollback probado; política principal ya cerrada |
| P55 | Modalidad Grafana/Prometheus/Sentry, cuotas/retención/series, instrumentación, alertas y destinatarios autorizados |
| P56 | SLI/SLO/error budget, sonda externa, incidentes, mantenimiento y disponibilidad de producción doméstica |
| P57 | Selección final 21st.dev por pantalla, fuente/version/hash/licencia, dependencias, runtime, accesibilidad y pruebas en app/web; catálogo preliminar 45–46 |
| P58 | Idiomas/locales disponibles, traducciones, persistencia, fallback y formato de fechas; selector mostrado solo como recurso |
| P59 | Matriz de facultades administrativas, criterios de altas/suspensión, integridad/auditoría, periodos y zona horaria de filtros; no nuevos permisos financieros aprobados |
| P60 | Release/identificador y contenido real de novedades, onboarding, enlaces internos y pruebas de permisos según SDK/SO; presentación contextual acordada |
| P61 | Entidad y responsabilidades de tratamiento, jurisdicción, bases jurídicas por finalidad, contratos/roles de proveedores, regiones/subencargados y transferencias |
| P62 | Plazos de conservación y excepciones económicas, canal/operativa de derechos y brechas, borrado multialmacén y restricciones/supresiones después de restore, responsables y evidencia |
| P63 | Evaluación de riesgos para personas, criterios/resultados de necesidad EIPD/DPD, riesgo residual/excepciones y revisión de controles de calidad según evidencia real |

## Historial y conflictos resueltos

Flutter sustituido por React Native; NestJS/ORM sustituidos por Go/SQL; Google Maps sustituido por Mapbox; S3 eliminado; dock web eliminado. Recomendaciones PHP/Laravel generales del usuario no cambian el stack Go explícito de Foodtrucks.

99 €, 29 €/mes, 0 % y 2 % son ejemplos no definitivos. Costes externos y tamaños de producción no son presupuestos aprobados. Ninguna arquitectura de este paquete acredita rendimiento o capacidad real.

## Cómo cerrar una decisión

Registrar pregunta, respuesta del usuario, fecha, motivo, documentos afectados y prueba requerida. Mantener IDs estables. No resolver silenciosamente cuestiones económicas o legales al escribir código; progresar con módulos independientes y pedir solo la información bloqueante.

## Ampliación U01

La membresía deja de ser una simple sugerencia de evolución: el usuario la ha solicitado. U02 confirmó **5,99 €/mes en EUR**; ya no quedan pendientes moneda ni periodicidad. Carácter opcional, compra sin plan, Billing web y acreditación tras entrega son propuestas, no respuestas del usuario. [Documento dedicado](25-suscripcion-clientes-fidelizacion.md).

## Skills y presupuesto de marketing

Se instalaron 25 skills pertinentes y se reutilizan capacidades disponibles; cargar entradas/referencias según la tarea. Las áreas sin skill oficial suficiente se cubren con documentación, sin forzar proveedores ajenos al stack.

**400 al mes se registra como referencia pendiente, no decisión cerrada de presupuesto**, de acuerdo con U05. No activar campañas, emitir pagos o contactar leads como consecuencia de un plan o de instrucciones genéricas de una skill.

## Actualización de skills v1.3

U06 refuerza búsqueda/selección en skills.sh evitando duplicados. Resultado: 25 conservadas más 12 nuevas, 37 registradas/verificadas; fuentes, motivos y descartes en docs/28-revision-skills-sh.md. La elección de skills no cierra versiones del framework, proveedor de builds, tests o requisitos comerciales.

## Actualización U07 — Cloudflare y Resend

La elección del registrador y del proveedor de envío ya no es una pregunta abierta. [Cloudflare](29-cloudflare-dominio-dns.md) y [Resend](30-correo-resend.md) contienen configuración propuesta y criterios de comprobación. Nombre/IP, valores generados, plan, recepción y condiciones de operación siguen pendientes; ningún marcador es una configuración real.

No se ha comprado el dominio, creado cuentas, modificado DNS o enviado mensajes. La petición se incorpora al paquete documental y no sustituye las decisiones Go/Expo/Next.js/Caddy ni autoriza gastos de Google Ads; U09 modifica posteriormente el alojamiento base a servidor doméstico.

## Actualización U08 — marketing digital completo

[Política de marketing](31-marketing-digital-maestro.md) integra los 22 apartados aportados, sin reproducir el prompt como archivo independiente. Foodtrucks.com es nombre proporcionado, no prueba de propiedad, compra o aplicación publicada. Mapbox se mantiene; Maps Platform/GBP se distinguen. Recogida sin reparto, licencia/mensualidad comercial, membresía 5,99 €/mes y presupuesto 400 al mes pendiente no cambian.

Las prioridades de SEO/medición/editores son requisitos futuros, no problemas constatados de un código ausente. Comparativas de monetización no convierten la cuota comercial en opcional ni fijan comisión. Evaluación AdSense/AdMob y 90 días no autorizan alta de cuentas, publicación, anuncios reales o despliegues.

## U09–U12 — costes, alojamiento y prompts operativos

Servidor doméstico sustituye VPS como destino base; equipo/recursos y conexión todavía pendientes. [Costes](37-costes-presupuesto.md) registra subtotal de herramientas 54,63 €/mes equivalente y 655,60 €/año a partir de las cuantías aportadas, con 22 €/trimestre para 21st.dev. No suma partidas desconocidas como cero ni cambia la referencia Google Ads pendiente.

[Seguridad](39-seguridad-devsecops.md), [testing/CI/CD](40-testing-qa-github.md) y [observabilidad](41-observabilidad-grafana-prometheus-sentry.md) adaptan los nuevos prompts. Inspección actual: documentación, sin código de producto/Git/accesos aportados. No se ha ejecutado una auditoría de app, CI, PR, despliegue, dashboard con datos reales o correo de alerta. Los requisitos se traspasan como políticas, sin documentos independientes con los textos originales.

## U13–U15 — cierres de CI/CD y uso de los requisitos

Leer [política de commits, pruebas y CI/CD](44-politica-commits-ci-cd-tests.md) y [guía DevOps](devops/README.md). Cada bloque coherente debe evaluar tests, ejecutar checks aplicables, crear commit/push y seguir CI del SHA vigente cuando exista repo/acceso. No equivale a commit por guardado ni autorización de merge/force-push/producción.

GitHub Actions, GHCR, staging automático y producción aprobada manualmente ya no son preguntas abiertas. Propiedad/cuentas/plan/protecciones, scripts/versiones, conexión al domicilio, recursos, responsables y validación real siguen pendientes. El servidor doméstico se confirma como destino, sin migrar a VPS ni Flutter por contexto genérico del texto de CI/CD.

Los prompts son requisitos para las políticas de marketing, seguridad, observabilidad y CI/CD; no se incluyen originales aparte. La entrega actual documenta y comprueba el paquete; no implementa una aplicación o pipeline ficticios.

## U16–U19 — componentes, referencias y panel del propietario

La ampliación mantiene el diseño actual como dirección y los componentes como candidatos hasta validar código/licencia/temas/runtime. [45](45-catalogo-21st-frontend.md), [46](46-panel-admin-negocios-suscripciones.md) y [47](47-novedades-onboarding-permisos.md) concretan los recursos y la conducta futura. Las cinco capturas no convierten métricas, menús, modo de voz, países/idiomas o funciones de sus demos en compromisos de producto.

Negocios y suscripciones es el primer alcance del panel del propietario; no sustituye el panel del comerciante. Las facultades de revisión/suspensión existen en el alcance, con motivos y auditoría; sus criterios y qué se automatiza quedan pendientes. Billing, Connect y publicación/operación son estados independientes. La cuota comercial no se deduce del precio cliente de 5,99 €/mes.

Novedades relevantes una vez por actualización y calendario de filtros están cerrados; recoger citas, reservar comida, rastrear de fondo, gestionar clientes íntegramente o cambiar planes/reembolsos no se añade por esta selección. Permisos reales del SO y consentimiento para publicidad/analítica/correo son decisiones distintas. La ejecución única autorizada entrega documentos e imágenes, no una app implementada.

## U20–U21 — privacidad y controles proporcionados

[48. Protección de datos y gobernanza](48-proteccion-datos-gobernanza.md) centraliza finalidades, inventario, derechos, riesgos, proveedores y evidencias sin duplicar controles técnicos. España/UE es referencia, no un cierre de mercado ni una afirmación de aplicabilidad jurídica definitiva. Se conservan P01, P24–25, P28, P40–42, P46 y P55–56; P61–63 precisan las decisiones transversales que faltan.

ISO/OWASP/NIST/CMMI/DevSecOps orientan calidad y gobernanza con fuentes/ediciones consultadas; no generan certificación, nivel de madurez, conformidad con cláusulas no leídas ni un despliegue. Tests de privacidad y procedimientos operativos se verificarán cuando exista aplicación. El precio cliente de 5,99 €/mes, presupuesto Ads pendiente y stack/alojamiento permanecen como estaban.

## U22 — organización de lectura v1.10

La simplificación aprobada organiza el acceso en ocho bloques y acorta el README principal, manteniendo el índice completo plegado y todos los documentos. El historial de entregas del README v1.9 se conserva en [procedencia](00-procedencia.md). D44 no incorpora condiciones de producto, tarifas, permisos o requisitos técnicos nuevos. D01–D43 y todas las preguntas P01–P63 permanecen; la reorganización no cierra decisiones pendientes.
