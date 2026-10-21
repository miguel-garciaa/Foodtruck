# Procedencia, fidelidad y evolución

Fecha de consolidación: 13 de octubre de 2026. Fuente principal: [conversación Foodtrucks](https://chatgpt.com/c/6acd5ac8-e940-83ed-8cd7-ce49c9e68859).

**Actualización documental:** 15 de octubre de 2026 · v1.10.

## Consulta realizada

La herramienta de lectura devolvió inicialmente cinco intercambios recientes y referencias sin el texto de las respuestas. Se abrió después la conversación en ChatGPT, se cargaron sus mensajes anteriores y se leyeron los **once intercambios completos de la rama visible**, desde la idea inicial hasta la petición de documentación. No se consultaron razonamientos internos ni ramas alternativas.

Este paquete consolida decisiones; no es una transcripción literal. Las fuentes técnicas actuales complementan la conversación y no convierten recomendaciones en requisitos aprobados.

## Trazabilidad de los once intercambios

| ID | Tema del mensaje del usuario | Resultado conservado |
| --- | --- | --- |
| C01 | Marketplace como Airbnb, food trucks, mapa, encargo/pago/recogida, licencia y mensualidad con Stripe | Modelo de producto y dos circuitos económicos |
| C02 | Flutter, rechazo de Supabase, email/contraseña y Google; duda entre mapas | Backend y auth propios; Flutter queda sustituido después |
| C03 | Redis, Go donde aporte eficiencia, mapa Mapbox personalizado | Go + Chi + pgx/sqlc, PostgreSQL/PostGIS, Redis y Mapbox |
| C04 | Eliminar S3; VPS; utilidad de Docker | Fotos locales persistentes, Compose, Caddy y backups externos |
| C05 | VMware Ubuntu Server 26, 4 vCPU, 8 GB RAM, 40 GB NVMe; lugar de desarrollo | VM para servicios; herramientas móviles y emulador en el ordenador |
| C06 | Todo el código en GitHub; Airbnb/Glovo; seguimiento y MCP 21st.dev | Monorepo, identidad propia, APNs/FCM y seguimiento nativo |
| C07 | Nombre Foodtrucks y cambio a React Native para móvil y web | React Native/Expo/TypeScript móvil y Next.js web |
| C08 | Animaciones a 120 FPS en móviles compatibles | Objetivo adaptativo, pruebas reales y herramientas de animación |
| C09 | Revisar componentes 21st.dev antes del diseño; día/noche | Selección preliminar y proceso de evaluación, temas propios |
| C10 | Dock solo en app móvil | Corrección definitiva: dock nativo; header Next.js |
| C11 | Documentar diseño, funcionamiento, servidor y herramientas para Codex | Paquete documental y mantenimiento en GitHub |

La solicitud actual explicita además Apple Login, Ubuntu Server 26.04, API, seguridad, CI/CD y entregables Markdown/ZIP. Estos requisitos forman parte del alcance cerrado del paquete.

## Propuestas sustituidas

- Flutter/Dart, Riverpod y GoRouter: históricos; el frontend vigente es React Native + Expo.
- NestJS, Prisma/Drizzle y backend adicional Node: históricos; la lógica de negocio reside en Go.
- Supabase: rechazado. FCM como transporte push no implica Firebase Authentication.
- Google Maps: propuesta anterior reemplazada por la elección explícita de Mapbox.
- S3 y almacenamiento compatible: descartados para las fotos del proyecto.
- Dock para web: propuesta corregida expresamente por el usuario.
- PWA primero: estrategia inicial sugerida, sin convertirla en secuencia definitiva del lanzamiento.
- VPS con 100–160 GB: dimensionamiento sugerido, no sustituto de los 40 GB decididos para la VM de desarrollo.

## Reglas de consolidación

Las afirmaciones del asistente como “arquitectura definitiva” no acreditan aprobación de todas sus herramientas auxiliares. Las bases propuestas se mantienen como tales. Contratación, cumplimiento normativo, comisiones, cancelaciones, territorio y niveles de servicio requieren decisiones específicas.

No hay evidencia de instalación del MCP, auditoría exhaustiva de 21st.dev, aplicación funcionando, compra de VPS, claves reales, pagos reales ni pruebas de rendimiento. La preparación de un traspaso en la conversación tampoco acreditaba la existencia de archivos descargables; este paquete sí proporciona los archivos.

## Ampliación posterior U01 — versión 1.1

Después del paquete inicial, el usuario pidió una suscripción de clientes de 5,99 para recibir ofertas/promociones y obtener puntos por cada compra canjeables por descuentos. U01 identifica esta petición en el chat de documentación, no un duodécimo intercambio de la conversación original.

En U02 el usuario confirmó **5,99 €/mes**: moneda EUR y periodicidad mensual quedan cerradas. Impuestos, equivalencias de puntos, financiación y prioridad de lanzamiento siguen pendientes. No se reinterpretan como decisión los 99/29 o 0/2 del historial. Véase [membresía y fidelización](25-suscripcion-clientes-fidelizacion.md).

## Ampliación U03–U05: skills y marketing

U03: el usuario pide incorporar descubrimiento, selección y carga de skills necesarias para Foodtrucks y planificar marketing. U04 aclara que quiere **Google Ads para captar usuarios y negocios**, no AdSense. U05 indica **400 al mes, pero pide dejarlo pendiente**; no supone autorización de gasto ni un presupuesto definitivo.

Se actualiza el paquete a v1.2. Instalación local verificada y fuentes en [skills](26-skills-proyecto.md); estrategia propuesta y datos faltantes en [marketing](27-marketing-google-ads.md). La planificación no acredita campañas o medición implementadas.

## U06 — revisión de mejores skills en skills.sh

El usuario pidió buscar en skills.sh las skills adecuadas que no estuvieran ya instaladas. Se comparó con la selección inicial, se investigaron contenidos/repositorios y se incorporaron 12 complementos. El paquete v1.3 registra 37 instalaciones verificadas y una política de carga por tarea. [Revisión](28-revision-skills-sh.md).

No se sustituyeron decisiones del stack ni se desplegó código por la instalación. Budget 400 al mes permanece pendiente; membresía 5,99 €/mes permanece confirmada.

## U07 — dominio Cloudflare y correo Resend, versión 1.4

El usuario indica que el dominio se comprará en Cloudflare y que los correos se enviarán con Resend, y pide añadir la configuración necesaria. Ambas elecciones quedan cerradas. Se preparan [dominio/DNS/HTTPS](29-cloudflare-dominio-dns.md) y [correo](30-correo-resend.md), y se sincronizan arquitectura, auth, datos, API, seguridad, entornos y roadmap.

El nombre del dominio, VPS, IP, cuentas, registros generados, buzón de soporte, plan de servicios y volúmenes no se conocen. El proxy Cloudflare, nombres auxiliares, plantillas, modelos y ajustes propuestos no son compras o configuración ejecutadas. No se envió ningún correo ni se modificó DNS. Esta ampliación no altera el stack, los 5,99 €/mes confirmados ni el presupuesto publicitario pendiente.

## U08 — prompt maestro de marketing digital, versión 1.5

El usuario aporta Texto pegado.txt y pide tenerlo en cuenta para marketing. Sus 22 apartados amplían SEO técnico/local, fichas/menús, Search Console/Business Profile, ASO/enlaces, GA4/Firebase, evaluación AdSense/AdMob, ingresos, contenidos y roadmap de 90 días. Los requisitos se incorporan en la [política de marketing](31-marketing-digital-maestro.md) y sus documentos asociados.

La referencia foodtrucks.com se registra como nombre indicado, sin compra/control/disponibilidad comprobados ni atribución de un sitio existente al usuario. El análisis de Google Maps Platform no sustituye la decisión Mapbox. AdSense/AdMob se añaden como evaluación/preparación; Google Ads sigue siendo captación, con referencia de 400 al mes pendiente. La comparativa de ingresos no cambia licencia/mensualidad comercial ni la membresía cliente de 5,99 €/mes.

Se inspeccionó la carpeta accesible y no hay código del producto. La fase 1 identifica ese alcance y prioridades futuras; no inventa errores de runtime, ranking, elegibilidad o tests. El calendario es condicionado, sin publicación, SDK instalado, campaña activada o despliegue.

## U09–U12 — ampliación v1.6

U09 pide contemplar gastos ChatGPT Plus, OpenCode, Figma Dev Mode, 21st.dev trimestral y servidor doméstico para desarrollo/producción. El alojamiento base cambia del VPS histórico a casa, manteniendo stack y fotos locales/backups externos fuera del domicilio. Hardware, red, consumo y capacidad no se han aportado.

U10 aporta el prompt de seguridad/QA/CI/CD/Git (29 apartados); U11 el de observabilidad/Grafana/Prometheus/Sentry/alertas (36). Sus requisitos se integran en [seguridad](39-seguridad-devsecops.md), [QA](40-testing-qa-github.md) y [observabilidad](41-observabilidad-grafana-prometheus-sentry.md), adaptados al estado accesible, sin afirmar auditoría o implementación de código inexistente aquí.

U12 responde con 23 de Plus, 9,30 de OpenCode, 22 de 21st.dev por trimestre y 15 euros de Figma Dev Mode. Se presupuestan en EUR con mensualidad para Plus/OpenCode/Figma y se dejan facturas/condiciones por verificar. 22/3 es 7,333… al mes, no 7 exactos: subtotal 54,63 €/mes mostrado y 655,60 €/año de pagos originales. [Presupuesto](37-costes-presupuesto.md).

Tras la interrupción por límites, el usuario pide continuar. Se retoma el paquete, no se crean servicios o Git en una carpeta sin aplicación. Las nuevas pruebas son documentales/cálculo/ZIP; no se han enviado alertas, ejecutado tests de producto, hecho escaneos dinámicos o publicado PR.

## U13–U15 — política de cambios, CI/CD y consolidación v1.7

U13 solicita commit/push tras los cambios y adaptar o crear pruebas cuando sean necesarias. El usuario concreta **cada cambio coherente**, **staging automático** y **producción con aprobación manual**. La autorización de commit/push persiste para cambios propios solicitados; no incluye merge, force-push, producción o tiendas.

U14 aporta requisitos ampliados de CI/CD/DevSecOps y elige **GHCR**. Tras inspección de carpeta y proyectos disponibles, el usuario confirma que se aplican al **paquete documental** y que producción continúa en el **servidor de casa**, pese al contexto genérico VPS del texto. No hay manifests/código/Git/workflows de Foodtrucks ni artefactos adjuntos que permitan implementar CI real aquí. Se documenta auditoría futura, pruebas/gates, promoción por digest, migraciones/rollback, secretos y mantenimiento en [política](44-politica-commits-ci-cd-tests.md) y [guía DevOps](devops/README.md).

U15 aclara que los prompts de marketing, seguridad y observabilidad son referencias para elaborar políticas, no archivos independientes; este criterio se aplica también a CI/CD. Se retiran sus copias del paquete actual y se actualizan enlaces, conservando requisitos y decisiones en sus áreas. No se renumeran documentos restantes. La petición de implementación confirma esta consolidación documental y la generación de ZIP v1.7.

Las verificaciones de v1.7 corresponden al paquete y sus políticas. No se han ejecutado tests/cobertura de aplicación, commits, CI remota, build nativa, GHCR, migraciones, despliegues, rollback o alertas.

## U16–U19 — ampliación visual y ejecución única v1.8

U16 solicita continuar seleccionando recursos 21st.dev para app y después para un panel administrativo llevado por el propietario. En la aclaración elige **Negocios y suscripciones** como primer alcance y **continuar el diseño actual**; se conservan claro/oscuro y navegación por plataforma. [Catálogo](45-catalogo-21st-frontend.md), [panel](46-panel-admin-negocios-suscripciones.md).

U17 aporta cuatro capturas y solicita tarjetas de novedades y permisos como los patrones habituales del iPhone. Confirma **novedades relevantes**, una vez por actualización correspondiente, y **calendario para filtros del panel**. U18 aporta una quinta captura de selector de idioma y aclara que está pasando **ejemplos de recursos**, no decisiones definitivas de funcionalidades. Las cinco se inspeccionan y copian sin edición a docs/assets/referencias-ui: 01-dashboard.png, 02-calendar.png, 03-whats-new.png, 04-step-indicators.png y 05-language-selector.png. La primera coincide visualmente con App Dashboard Layout/ShadcnStore; para las demás no se inventa un autor o componente exacto. Textos, usuarios, métricas y funciones de las demos no son datos o capacidades de Foodtrucks.

U19 pide posponer implementación hasta las 00:27 y después autoriza programar una ejecución única en este chat. Se activó para el **14 de octubre de 2026 a las 00:27 Europe/Madrid**. El inicio recibido fue **00:30:29** de Madrid, posterior a la hora mínima; se retoma v1.7 sin una entrega v1.8 anterior. Antes del inicio solo se preservaron las cinco imágenes en work para evitar pérdida desde Temp. La implementación de esta versión es documental; no implica publicar una aplicación.

Las fuentes públicas de componentes y documentación de plataforma se consultan para clasificar evidencia: ficha, demo/extracto, código público o licencia identificada. No hay conexión MCP autenticada, instalación de componentes, SDK fijado, runtime de app, permisos concedidos, pruebas de UI, commits, CI o despliegues demostrados. [Novedades y permisos](47-novedades-onboarding-permisos.md) documenta reglas y comprobación futura.

## U20–U21 — protección de datos y gobernanza v1.9

U20 aporta una captura textual que cita ISO/IEC 25010, ISO/IEC/IEEE 12207, serie 29119, ISO 27001, OWASP, NIST SSDF, CMMI y DevSecOps, y solicita considerarla en protección de datos. Es una referencia de requisitos y no una norma adquirida, auditoría, certificación o prueba del proyecto.

U21 elige **controles prácticos proporcionados**, sin preparar certificación, y aprueba implementar el plan v1.9. Se crea [política central](48-proteccion-datos-gobernanza.md) y se conectan seguridad, QA, observabilidad, consentimiento y backups con controles/evidencias. No se reproduce la captura como documento independiente ni se incorporan normas completas. Fuentes primarias de ISO, NIST, OWASP, CMMI, RGPD/BOE y AEPD fundamentan las referencias con sus límites.

La carpeta continúa siendo un paquete documental, sin aplicación/Git. La ejecución v1.9 no modifica contratos API, entidades, workflows o servicios, no ejecuta solicitudes de derechos o borrados reales y no envía datos personales a proveedores. Los cinco recursos visuales y la entrega ZIP v1.8 se conservan. Las comprobaciones de v1.9 son coherencia/enlaces/Markdown, patrones de secretos e integridad de imágenes y ZIP, no cumplimiento legal ni pruebas de aplicación.

## U22 — reorganización de la lectura v1.10

El usuario solicita simplificar la entrada al paquete y aprueba reorganizar su lectura en **ocho bloques temáticos**, con un README principal de **como máximo 800 palabras** y el **índice completo plegado**. Se conservan los **49 documentos Markdown** y sus políticas separados, sin borrarlos, fusionarlos ni crear un nuevo documento. La reorganización cambia cómo se accede a la documentación; no añade condiciones comerciales, capacidades de producto o requisitos técnicos.

El historial de entregas del README v1.9 se centraliza en este documento, conservando íntegra la información desde «Ampliación v1.2: skills y captación» hasta el final de v1.9. La procedencia U01–U21 permanece. D44 registra únicamente la organización aprobada; D01–D43 y las preguntas P01–P63 se conservan sin resolver pendientes por esta simplificación.

La entrega v1.10 es documental. No cambia políticas de seguridad, privacidad, pruebas, CI/CD, API o datos, ni instala componentes, configura cuentas, realiza pruebas de aplicación o despliega servicios. README y AGENTS mantienen las rutas de entrada y la obligación de consultar las fuentes aplicables antes de implementar.

## Historia de entregas trasladada del README v1.9

Se conserva a continuación el fragmento completo del README incluido en Foodtrucks-documentacion-v1.9.zip, desde «Ampliación v1.2: skills y captación» hasta el final de v1.9. Sus datos y estados pertenecen a las entregas originales. Solo se ajustan los destinos de enlaces Markdown que empezaban por docs/ para que funcionen desde este documento; el texto visible y los demás caracteres del historial se mantienen. El [README](../README.md) ofrece la entrada y el índice completo actuales.

## Ampliación v1.2: skills y captación

El usuario solicita seleccionar/cargar las skills pertinentes y planificar Google Ads para captar clientes y comerciantes. Se instalaron y verificaron 25 skills; su uso por fase queda en AGENTS.md y [el inventario](26-skills-proyecto.md). La instalación es local: el ZIP incluye el registro para reproducirla, no copias completas de terceros.

[Plan de marketing](27-marketing-google-ads.md) preparado sin activar campañas. Referencia de presupuesto: **400 al mes, expresamente pendiente**, sin moneda/inversión final aprobadas. Ciudad, calendario, distribución de presupuesto y proveedor de medición pendientes.

## Ampliación v1.3: revisión de skills.sh

Se revisaron candidatas del directorio y sus repositorios, se conservaron las 25 anteriores y se instalaron 12 complementos ausentes. El [inventario](skills-inventory.json) registra **37 skills verificadas**, además de plugins/capacidades reutilizados. [Selección comparada y motivos](28-revision-skills-sh.md).

La carga continúa por tarea; no se instalaron runtimes, dependencias del proyecto, servicios o campañas como consecuencia de esta selección.

## Ampliación v1.4: Cloudflare y Resend

El usuario elige **comprar el dominio en Cloudflare** y **Resend para los correos**. El nombre del dominio todavía no está indicado. Se añaden las guías de configuración, variables propuestas, registros DNS, HTTPS, controles de caché/proxy, envío desde Go, webhooks y comprobaciones antes del piloto. Los valores del panel del proveedor se copiarán al configurar las cuentas, sin inventar claves ni registros de verificación.

Los ejemplos usan dominio.example y marcadores. Compra, alta de cuentas, cambios DNS y correos reales no se han ejecutado. La suscripción de 5,99 €/mes continúa confirmada y la referencia de marketing de 400 al mes continúa pendiente.

## Ampliación v1.5: plan maestro de marketing digital

Se incorpora el prompt del usuario con SEO técnico/local, Google Business Profile, ASO, Google Ads, GA4/Firebase Analytics y evaluación de AdSense/AdMob. El [plan maestro](31-marketing-digital-maestro.md) relaciona sus 22 apartados con entregables, prioridades y pruebas futuras. Incluye calendario editorial y roadmap de 90 días condicionado al estado del producto.

foodtrucks.com es el dominio indicado en el prompt; titularidad, disponibilidad para compra, control DNS y uso de producción no se han verificado. No se auditó ese sitio como si fuera una aplicación del usuario. Los ejemplos DNS de v1.4 conservan marcadores hasta validar el dominio. Mapbox sigue siendo el mapa decidido y los pedidos siguen siendo de recogida, sin reparto.

La carpeta inspeccionada contiene documentación, sin código de aplicación. Se prepara implementación, sin afirmar SEO instalado, ranking, monetización aprobada o campañas activas. Los 400 al mes continúan pendientes; AdSense/AdMob son una evaluación adicional y no sustituyen Google Ads ni el modelo económico cerrado.

## Ampliación v1.6: costes, servidor en casa, seguridad y observabilidad

El usuario decide servidor doméstico para desarrollo/producción, sustituyendo el VPS como base. Se conservan Ubuntu/Compose/Caddy y la VM DEV de 4 vCPU/8 GB/40 GB; recursos físicos y de PROD pendientes. Se añaden seguridad/QA/CI/CD y observabilidad conforme a los dos prompts aportados, integrados como requisitos de las políticas respectivas.

Herramientas declaradas: ChatGPT Plus 23 €/mes, OpenCode/modelos 9,30 €/mes, Figma Dev Mode 15 €/mes y 21st.dev 22 €/trimestre. **Subtotal equivalente 54,63 €/mes; doce meses 655,60 €**, sin redondear antes del anual. Electricidad, hardware/red, backups, proveedores y observabilidad siguen pendientes; no es el coste total. Google Ads 400 al mes continúa pendiente.

La inspección actual confirma documentación sin código de aplicación y sin repositorio Git. No se han desplegado servicios, enviado alertas, ejecutado tests de app/escaneos dinámicos o creado commits/PR. Las pruebas de entrega comprueban documentos, cálculos y ZIP. [Costes](37-costes-presupuesto.md), [seguridad](39-seguridad-devsecops.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md).

## Ampliación v1.7: políticas consolidadas y entrega trazable

Los prompts de marketing, seguridad, observabilidad y CI/CD se utilizan como requisitos; no se incluyen copias independientes. Se mantienen los números de los demás documentos. Los antiguos números 36, 42 y 43 quedan libres para conservar referencias estables.

La [política operativa](44-politica-commits-ci-cd-tests.md) recoge commit/push por cambio coherente, evaluación de pruebas en cada cambio, checks de la revisión vigente, GHCR por digest, staging automático y producción con aprobación manual. La [guía DevOps](devops/README.md) organiza los manuales, secretos, mantenimiento y diagnóstico. Marketing, seguridad/QA y observabilidad incluyen obligaciones, procedimientos, roles por asignar, aceptación y pendientes.

La entrega v1.7 contenía **45 documentos Markdown** y el inventario de **37 skills**. Se verifican documentos/enlaces/integridad del ZIP; aplicación, workflows, tests/cobertura, Git/PR, imágenes, despliegues y alertas siguen NO VERIFICADO. No se ha inicializado Git ni generado infraestructura ficticia.

## Ampliación v1.8: recursos UI, panel del propietario y permisos

El usuario amplía las referencias de 21st.dev y confirma un panel propio centrado primero en **negocios y suscripciones**, manteniendo la identidad actual y claro/oscuro. Los documentos [45](45-catalogo-21st-frontend.md), [46](46-panel-admin-negocios-suscripciones.md) y [47](47-novedades-onboarding-permisos.md) separan catálogo, especificación administrativa y novedades/permisos.

Las **cinco capturas** se incluyen sin modificaciones como ejemplos de recursos en docs/assets/referencias-ui. Ilustran dashboard, calendario, tarjeta de novedades, indicadores de pasos y selector de idioma; no prueban pantallas Foodtrucks implementadas ni aprueban todas las funciones/textos de sus demos. Calendario para filtros de fechas del panel; idiomas definitivos pendientes. Las tarjetas de novedades aparecen una vez por actualización relevante; los permisos se solicitan contextualmente mediante el sistema nativo.

La entrega v1.8 contenía **48 documentos Markdown**, **5 imágenes de referencia** y el inventario de **37 skills registradas**. Candidatos, código público y licencias tienen evidencia individual y límites; no hay auditoría exhaustiva, conexión MCP autenticada ni componentes probados en una app. La entrega verifica documentos/enlaces, copia íntegra de imágenes y ZIP; los tests/CI/builds/deploy de producto siguen NO VERIFICADO.

## Ampliación v1.9: protección de datos y controles prácticos

La [política central](48-proteccion-datos-gobernanza.md) integra el inventario de tratamientos, privacidad desde el diseño, información/derechos, cierre de cuenta, retirada de consentimiento, brechas, evaluación de proveedores y borrado coherente con cachés, archivos y backups. España/UE es una referencia de planificación; mercados, entidad responsable, bases jurídicas, retenciones y obligaciones concretas requieren validación.

Los marcos ISO/IEC 25010, ISO/IEC/IEEE 12207 y serie 29119, ISO/IEC 27001, OWASP, NIST SSDF, CMMI y DevSecOps se conectan a controles/evidencias existentes de forma proporcionada. El usuario elige **controles prácticos**, sin preparar certificación. No se atribuye conformidad normativa, auditoría o nivel de madurez a partir de documentos. La referencia textual aportada se integra en políticas, sin reproducirla como archivo independiente.

La entrega actual contiene **49 documentos Markdown**, **5 imágenes de referencia** preservadas y el inventario de **37 skills registradas**. Su comprobación es documental; controles de privacidad ejecutados, tests de aplicación, CI, proveedores configurados y cumplimiento efectivo siguen pendientes/NO VERIFICADO. Se conserva el ZIP v1.8 y se entrega ZIP/reporte v1.9.
