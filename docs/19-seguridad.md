# Seguridad y preparación para producción

**Requisito transversal:** mínimo privilegio, validación servidor, autorización por recurso y secretos fuera del código. Estos controles son especificación; no acreditan auditoría ni implementación.

## Amenazas y controles

| Riesgo | Control exigido o propuesto |
| --- | --- |
| IDOR entre clientes/negocios | Filtrar por identidad y membresía; comprobar en cada endpoint |
| Manipulación de precio/pago | Calcular en Laravel; verificar importe, moneda, cuenta y pedido |
| Webhook falsificado/repetido | Firma original, idempotencia y conciliación |
| Canje QR duplicado | Token opaco, autorización del puesto y transacción única |
| SQL injection | Eloquent/Query Builder y bindings en SQL/PostGIS; allowlist de columnas y orden |
| XSS | Escape de salida, contenido permitido, CSP revisada; sin HTML arbitrario |
| CSRF | Protección de mutaciones con cookies; excepciones delimitadas para webhooks firmados |
| Robo de sesión | Tokens cortos/rotación, cookies seguras y almacenamiento nativo seguro |
| Brute force/enumeración | Rate limit por identidad/IP, respuestas coherentes y auditoría |
| Upload malicioso | MIME real, decodificación, límites, nombre generado y ubicación segura |
| Path traversal | Rutas relativas controladas; nunca usar nombre externo como ruta |
| SSRF | No descargar URLs arbitrarias; allowlist y control de red si se incorpora importación |
| DoS | Límites de body, bbox/radio/resultados, timeouts, concurrencia y consultas |
| Exposición del servidor | Datos internos sin puertos públicos, SSH restringido, TLS verificado |
| Fuga por caché/logs | Separar público/privado, no registrar secretos ni tokens QR |

## Secretos y configuración

Servidor: contraseña PostgreSQL, claves Stripe/webhooks, OAuth privado, APNs/FCM, clave API/secreto webhook Resend, tokens Cloudflare si son necesarios y material de firma. Cliente: solo configuración pública necesaria. NEXT_PUBLIC_* y EXPO_PUBLIC_* nunca contienen secretos.

No incluir .env reales en Git, Dockerfiles, imágenes, artefactos CI ni capturas. Ejemplos con campos vacíos o marcadores inequívocos. Rotación/revocación tras exposición; borrar del último commit no elimina el historial.

Configurar proxy confiable de forma acotada y CORS con orígenes permitidos, sin wildcard con credenciales. CORS no autoriza una compra ni protege contra llamadas directas a la API.

## Sistema y contenedores

Usuarios limitados, actualizaciones, permisos de directorios y volúmenes, servicios sin privilegios innecesarios. Evitar root en app y socket Docker dentro de contenedores. Usuarios del grupo docker deben tratarse como administradores del host.

No chmod 777, no TLS desactivado, no secretos en frontend. Firewall y puertos Docker verificados externamente. Read-only filesystem y límites de capacidades donde la app lo permita.

## Privacidad y datos

No solicitar ubicación continua si publicar un punto basta. No exponer ubicación del cliente, QR o datos privados en eventos, mapas o pantalla bloqueada. Definir retención, exportación, borrado/anónimo y acceso de soporte.

KYC de Stripe en flujos Stripe. Condiciones de uso, privacidad, alérgenos, vendedor de comida, impuestos y emisión de facturas necesitan revisión en el territorio elegido. Este documento no determina cumplimiento legal.

## Criterios de salida al piloto

- Pruebas de acceso cruzado, precio manipulado, webhook falso y doble canje concurrente.
- Recuperación de sesión y revocación, reset de contraseña y vinculación OAuth segura.
- Uploads malformados, límites y comprobación de medios privados.
- Backup externo restaurado y puertos internos inaccesibles desde Internet.
- Logs revisados sin secretos y procedimiento de incidentes asignado.

No afirmar “seguro para producción” por una build verde. Definir una revisión proporcional de cambios sensibles y registrar lo verificado.

## Abuso de puntos y promociones

Prevenir doble crédito, canje concurrente, manipulación de descuento, cambio de reglas desde cliente y consulta de saldo ajeno. Limitar campaña/cupo por operación transaccional, registrar origen único y autorizar ajustes con motivo.

No asumir que una devolución borra puntos sin historia; usar compensación y política explícita si ya se gastaron. Revisar consentimiento de campañas y canal de cobro móvil con el producto final. [Membresía](25-suscripcion-clientes-fidelizacion.md).

## Dominio, proxy y correo

Cloudflare: MFA/recuperación de cuenta, renovación y DNSSEC verificados; TLS al origen validado, caché pública delimitada y cabeceras/IP del cliente aceptadas solo desde proxies autorizados. No aplicar challenges de navegador a clientes móviles, OAuth o webhooks máquina a máquina. Probar también acceso directo al origen para evaluar el bypass real de las protecciones. [Configuración](29-cloudflare-dominio-dns.md).

Resend: send-only con dominio acotado cuando corresponda, secretos por entorno, firma webhook sobre bytes originales, tolerancia temporal/replay según verificador y unicidad duradera del evento. Limitar cuerpo/carga y responder después de persistencia; un webhook de correo nunca modifica estado financiero.

Auth por correo: tokens no legibles en persistencia ni registros y consumo explícito; cifrar cualquier payload temporal indispensable para la entrega, con clave separada y purga. Escapar datos interpolados en HTML, validar destinatario/finalidad y bloquear envíos live de CI/restores. Separar consentimiento, bajas y rebotes; restringir lectura/reproceso de mensajes. [Configuración y pruebas](30-correo-resend.md).

## SEO, publicidad y analítica U08

Las rutas indexables reciben DTO de datos publicados; robots/noindex no sustituyen autorización. No incluir contenido privado en HTML/metadata/JSON-LD/sitemap/feeds ni URLs de auth/pedido en eventos automáticos. Serializar JSON-LD de forma segura, especialmente contenido de vendedores, sin interpolar HTML arbitrario.

Revisar CSP/orígenes/frame policies cuando se adopten scripts de Google, sin comodines o unsafe-inline generales como solución. Credenciales de administración/Measurement Protocol solo servidor; IDs públicos de SDK no equivalen a permiso para activarlos. Configuración de datos, CMP/UMP/ATT, mercados y retención necesitan validación específica; Consent Mode no obtiene consentimiento ni garantiza cumplimiento.

No cargar tracking no esencial antes de la elección conforme a la base propuesta; probar rechazo/retirada, URLs saneadas y aislamiento de entornos. No dar acceso a dashboards de terceros o pedidos ajenos desde la UI comercial. [Medición](34-analitica-consentimiento.md), [publicidad](33-monetizacion-adsense-admob.md), [SEO](32-seo-local-nextjs.md).

## Seguridad avanzada y QA del prompt U10

[Doc39](39-seguridad-devsecops.md) concreta controles, matriz API, dependencias/secretos y evidencia; [doc40](40-testing-qa-github.md) los vincula a tests/gates/revisión/CI/CD. Existen código Laravel/móvil y Git; validar findings y cobertura contra el SHA y los comandos reales, sin presentar esta actualización documental como auditoría de código. OWASP y los ejemplos no se convierten en defectos descubiertos.

Servidor doméstico: separar entornos, gestión y datos de la LAN; aceptar IP/cabeceras solo por la ruta confiable real. Observabilidad debe mantener /metrics, exporters, datos y administración privados, con redacción de logs/traces/Sentry y secretos solo servidor. [Servidor](38-servidor-domestico.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md).

## Protección de datos y gobernanza — v1.9

[48. Política central](48-proteccion-datos-gobernanza.md) conecta seguridad técnica con finalidades, derechos y riesgo para las personas. Separar datos publicados del negocio de datos privados de titulares/clientes; acceso administrativo y telemetría se limitan a su necesidad autorizada. Ubicación puntual no justifica un historial de seguimiento ni permisos de fondo.

Supresión, retirada de consentimiento y cierre de cuenta tienen procedimientos y efectos distintos. Tratar excepciones de conservación financiera bajo base/plazo validados, con acceso restringido. Coordinar eliminación con DB, Redis/caché, medios, colas y proveedores; aplicar restricciones/supresiones posteriores al restaurar un backup. No registrar PII innecesaria, QR, tokens o contenido privado en reportes de CI, prompts o herramientas de IA.

Una vulnerabilidad/incidente de seguridad requiere evaluar afectación de datos personales, responsables y notificación aplicable; una alerta 5xx no demuestra por sí sola una brecha. Los marcos son prácticas proporcionadas y trazables, sin certificaciones ni cumplimiento demostrados. Ver [controles técnicos](39-seguridad-devsecops.md), [QA](40-testing-qa-github.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md) y pendientes P61–63.
