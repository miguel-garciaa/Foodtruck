# Seguridad avanzada y DevSecOps de Foodtrucks

**Actualización técnica:** 22/10/2026, conforme a D47. Política aplicada a Laravel/PHP y su integración web/móvil; define controles y criterios, no un informe de vulnerabilidades. Integra [seguridad base](19-seguridad.md), [API](20-api.md), [QA](40-testing-qa-github.md) y [entrega](44-politica-commits-ci-cd-tests.md).

Existen backend Laravel, app Expo, Git/remoto y el workflow [DEV](../.github/workflows/dev.yml). Inspeccionar manifests, locks, rutas y configuración del SHA afectado antes de validar controles. Esta actualización documental no ejecuta un escaneo ni acredita cobertura, ausencia de vulnerabilidades o controles productivos.

U09 establece servidor doméstico para desarrollo y producción. Mantener Ubuntu Server 26.04, Compose y Caddy, conforme a [infraestructura doméstica](38-servidor-domestico.md). Los 4 vCPU/8 GB/40 GB corresponden a la VM de desarrollo del historial; no describen el equipo físico ni la capacidad productiva. DEV y sus proveedores tienen comprobaciones parciales registradas en la [guía del backend](../backend/README.md); pagos, staging y producción no se presumen operativos.

## Objetivo, obligaciones y responsables propuestos

El objetivo es proteger identidad, datos y operaciones económicas de Foodtrucks mediante controles comprobables en Laravel, web, app nativa y operación. La política exige mínimo privilegio, validación en servidor, autorización por recurso, integridad transaccional y evidencia de cada cambio. Seguridad, simplicidad y comportamiento legítimo se evalúan juntos: no añadir capas, servicios, escáneres duplicados ni dependencias sin una necesidad concreta.

| Responsabilidad propuesta | Obligación | Evidencia exigida antes de aceptar |
| --- | --- | --- |
| Responsable técnico del proyecto | Confirmar alcance, contratos pendientes y propietarios; priorizar riesgos y excepciones | Inventario real, decisión registrada, responsable y fecha de revisión |
| Responsable de backend/seguridad | Aplicar SEC01–04 y permisos en cada entrada real; revisar SQL, workers y límites | Tests negativos, de integración y concurrencia pertinentes; revisión del cambio |
| Responsable de web y móvil | Aplicar SEC05–06 y comprobar bundles, almacenamiento, caché, enlaces y permisos | Build correspondiente, pruebas de UI y evidencia nativa cuando aplique |
| Responsable de QA/DevSecOps | Relacionar requisito, test, comando, resultado y SHA; bloquear controles ausentes o fallidos | Gate de CI correcto para el SHA exacto y reportes saneados según [44](44-politica-commits-ci-cd-tests.md) |
| Responsable de operación y release | Aislar entornos/red/secretos; validar backup, recuperación y artefacto aprobado | Evidencia de staging, digest, aprobación manual de producción y procedimiento de rollback |
| Revisor humano autorizado | Revisar cambios sensibles y aprobar cuando lo exijan las reglas | Revisión auténtica y aprobación sobre la versión vigente; IA no sustituye esta función |

Son funciones propuestas, no personas, cuentas ni permisos ya asignados. Una persona puede cubrir varias funciones; la independencia de revisión exigida por la política no se presume. Nombres, canales, suplencias, tiempos de respuesta y autorizaciones permanecen pendientes.

Procedimiento obligatorio para la futura auditoría: inspeccionar código/Git/versiones/infra y pruebas reales → establecer baseline → trazar entradas, activos y controles → separar riesgo hipotético de hallazgo demostrado → priorizar corrección mínima → añadir/adaptar o ejecutar pruebas relacionadas → revisar diff → cerrar el bloque conforme a [44](44-politica-commits-ci-cd-tests.md). Cada cambio coherente se cierra con commit atómico y push autorizado desde el agente local, seguido de CI del SHA exacto; CI no genera commits ni empuja correcciones. Sin repositorio o acceso, documentar el pendiente concreto; nunca simular hashes, pruebas o publicación.

Ningún control se considera aceptado por estar escrito o por un resultado verde ajeno al cambio. No desactivar TLS, CSRF, validación, autorización, tests o escáneres para conseguir aceptación. No ejecutar ataques contra terceros, compras/envíos reales, auto-merge, force-push ni despliegues productivos sin aprobación manual. La aceptación documental de esta versión no acredita la aplicación ni el servidor.

## Principios y alcance de revisión

Laravel/PHP con Eloquent y SQL parametrizado conserva la autoridad de usuarios, permisos, catálogo, precios, pedidos, pagos, recogida y puntos. PostgreSQL/PostGIS conserva integridad; Redis acelera. Next.js y React Native + Expo + TypeScript presentan el producto. No introducir un segundo backend, otra auth comercial, S3, otro mapa o microservicios para satisfacer un ejemplo del prompt.

La revisión futura debe cubrir código, dependencias, SQL/migraciones, contenedores, configuración de proxy, móvil, CI y procedimientos. Cada control debe tener dueño, prueba, evidencia y estado. Un escáner, TypeScript, UUID, WAF o revisión de IA no reemplaza autorización en servidor ni demuestra ausencia de vulnerabilidades.

| Marco | Uso propuesto | Límite |
| --- | --- | --- |
| OWASP Top 10 2025 | Priorizar riesgos web, incluidas dependencias y configuración | Documento de concienciación, no checklist suficiente de auditoría |
| OWASP API Security Top 10 2023 | BOLA, permisos de función/propiedades, recursos, flujos sensibles, SSRF e inventario | Aplicar a contratos y código reales |
| ASVS 5.0.0 | Requisitos verificables web/API; proponer nivel 2 como objetivo sujeto a alcance | No afirmar certificación ni conformidad; conservar versión en cada identificador |
| MASVS y MASTG | Almacenamiento, auth, red, plataforma, código y privacidad móvil | Seleccionar controles/perfil de riesgo; no trasladar niveles antiguos automáticamente |
| CWE | Clasificar una debilidad confirmada y facilitar su seguimiento | No asignar un CWE o severidad como prueba de explotación |

Versiones y alcance contrastados con [OWASP Top 10](https://owasp.org/projects/top-ten), [API Top 10](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [ASVS](https://owasp.org/projects/asvs), [MASVS](https://mas.owasp.org/MASVS/) y [CWE](https://cwe.mitre.org/). Revalidar ediciones al iniciar la auditoría. Los IDs de controles de este documento son internos de Foodtrucks, no IDs inventados de ASVS.

## Activos, actores y fronteras

Activos críticos: sesiones, identidades, permisos de negocio, precios e instantáneas de compra, saldos/pagos, derechos de membresía, ledger de puntos, ticket QR, fotos, preferencias de comunicación, secretos, backups y artefactos firmados.

Actores: visitante, cliente, miembro autorizado de un negocio, administrador, proveedor autenticado por firma y procesos internos. Las funciones de empleado/múltiples negocios permanecen pendientes en P13. Una suscripción de 5,99 €/mes no concede acceso a recursos ajenos ni consentimiento de marketing; Billing comercial tampoco concede membresía cliente.

| Frontera | Comprobación indispensable |
| --- | --- |
| Internet → Cloudflare/Caddy → Laravel/Next.js | Host/origen permitidos, TLS, proxy confiable, límites y autenticación correspondiente |
| Frontend → API | Runtime validation y permisos por objeto/acción; datos y estados del cliente no son autoridad |
| Laravel → PostgreSQL/Redis/fotos | Credenciales mínimas, transacciones, paths acotados; Redis no decide obligaciones económicas |
| Proveedor → webhook → outbox/worker | Firma sobre bytes originales, entorno/cuenta correctos, persistencia, unicidad y conciliación |
| GitHub/estación de desarrollo → build → servidor doméstico | Código confiable, artefacto identificable, aislamiento y autorización del despliegue |
| App → servicios nativos/proveedores | Solo configuración pública; firma y permisos revisados, almacenamiento seguro y links válidos |
| Servidor doméstico → red de casa | Separar producción, desarrollo y dispositivos familiares; SSRF y contenedor comprometido no dan acceso libre a la LAN |

Estos escenarios orientan un modelo de amenazas futuro con el código y la red reales. No se ha ejecutado un threat model de repositorio ni un escaneo Codex Security.

## SEC01 — autenticación, sesiones y recuperación

Usar `APP_DEBUG=false` en DEV compartido/producción y render de errores JSON sin secretos. Conservar `APP_KEY` de cada entorno: no regenerarla sobre datos cifrados existentes. Horizon/Telescope y diagnósticos son privados; su instalación no autoriza exposición pública ni captura de PII/tokens.

Conservar la [auth propia](14-autenticacion.md): hash adaptativo de contraseña, Argon2id como base propuesta con parámetros medidos, tokens de alta entropía, expiración y consumo único. Usar bibliotecas mantenidas, sin criptografía casera. No registrar contraseñas ni rechazar frases largas por una suposición del algoritmo; verificar límites y política antes de configurar.

La implementación móvil DEV usa Sanctum con access tokens opacos de 15 minutos y refresh propio hasheado de 30 días, rotatorio y con familia/replay; comprobarlo en el código y [auth](14-autenticacion.md). Rotar al autenticar/cambiar privilegios y revocar según logout/reset. Probar refresh simultáneo legítimo, reintento, robo/reutilización, expiración y revocación con Redis caído. La sesión web sigue por definir; no aceptar un token revocado por fallo de caché.

Google/Apple: validar firma, issuer, audience, expiración y nonce según flujo; state/PKCE cuando corresponda y redirect exacto. Vincular por proveedor y subject, con prueba de control; email coincidente no fusiona cuentas. Callbacks y deep links no sustituyen una sesión válida. MFA/step-up administrativo es requisito propuesto antes de habilitar administración sensible; mecanismo, recuperación y responsables pendientes.

Registro/login/reset tienen límites por identidad normalizada e IP confiable, respuesta no enumerativa y telemetría agregada. Los valores de ráfaga, ventana y backoff se calibran; no fijar una cifra universal. Proteger contra bloqueo abusivo de otra cuenta, envío masivo de correos y coste de hashing. Reset/verificación muestran una página al GET y consumen el token mediante acción explícita, evitando escáneres de correo. [OWASP sesiones](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html).

## SEC02 — autorización por acción y recurso

Comprobar identidad y relación con el objeto antes de leer o modificar; filtrar también listados, relaciones anidadas, fotos privadas, eventos, exportaciones y agregados. No basta un rol merchant: el actor debe pertenecer al negocio del pedido/producto. No aceptar user_id, owner_id, role, food_truck_id o stripe_account del cliente como prueba de permiso.

Permisos administrativos explícitos, menor privilegio, motivo y auditoría de suspensiones/ajustes/reembolsos. Evitar mass assignment: persistir solo campos validados, controlar `$fillable`/`$guarded` y no pasar `$request->all()` a una mutación. Usar validación del servidor/Form Requests, Policies/Gates y Resources con campos públicos/privados explícitos según recurso. Bloquear cambios de propietario/beneficiario por rutas de edición ordinaria. La UI puede ocultar opciones, pero Laravel debe rechazar la petición directa.

Para acciones sensibles comprobar estado y permisos dentro del ámbito transaccional apropiado para evitar un cambio entre comprobación y uso. Elegir 403/404 según política coherente de visibilidad, sin filtrar existencia o datos en el error. Repetir pruebas con cliente A/B, comerciante X/Y, miembro retirado y administrador de permisos reducidos. [OWASP autorización](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## SEC03 — validación, límites y Laravel/PHP

Validar entradas de path/query/body/header: tipos, longitudes, rangos, formato, listas, paginación, moneda, zona horaria y coordenadas finitas. Rechazar campos desconocidos en mutaciones sensibles según el contrato, JSON malformado o contenido adicional y Content-Type incompatible. Límites de body antes de parsear, número de partes/archivos, dimensiones y complejidad geográfica. Definir valores en OpenAPI/configuración probada, con errores 4xx sin stack.

Coordinar límites de body/cabeceras y timeouts entre Caddy, PHP/PHP-FPM y Laravel; limitar concurrencia de procesos, memoria y coste de consultas. Clientes HTTP con timeout de conexión/respuesta y reintentos acotados; no mantener locks SQL durante una llamada externa. Horizon necesita límites de intentos/duración coherentes con la reserva del job y su idempotencia. SSE/WebSocket requieren estrategia y heartbeats específicos; no añadir Octane/Reverb u otro runtime sin necesidad aprobada.

Generar secretos/nonces con `random_bytes` o utilidades seguras del framework, hashes y comparaciones apropiadas (`hash_equals` para MACs/secretos de longitud controlada). No usar `rand`/`mt_rand` ni criptografía propia. Evitar estado de usuario retenido entre jobs de Horizon; las carreras económicas se prueban con procesos/conexiones SQL independientes, constraints y transacciones, no con un detector de memoria de Go.

Eloquent/Query Builder y bindings en SQL/PostGIS; columnas/orden dinámicos en allowlist. No concatenar SQL, shell, templates ejecutables o rutas con entradas del usuario. Plantillas HTML de correo controladas por el proyecto, con escape contextual. No importar imágenes/URLs arbitrarias: si aparece esa función, limitar esquema/destino/redirects/tamaño/tiempo y bloquear loopback, link-local y redes internas tras resolver DNS, incluyendo rebinding. En el host doméstico también son activos la LAN, router y servicios de administración. [OWASP SSRF](https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html).

## Inventario de seguridad de API propuesto

El prefijo es /api/v1 salvo health, conforme a [20](20-api.md). **La tabla es diseño ampliado; las rutas implementadas se contrastan con [OpenAPI](../contracts/openapi.json) y [rutas Laravel](../backend/routes/api.php).** Las agrupaciones comparten controles, no omiten autorización individual. Roles E: sesión propia; C: cliente propietario; M: miembro autorizado del negocio; A: administrador con permiso; P: público; W: firma proveedor. Política de límites: L1 auth/identidad/IP; L2 lectura/IP/actor y coste; L3 mutación/actor/negocio e idempotencia cuando aplique; L4 firma/volumen/coste de ingestión; L5 upload/cuota/negocio. Valores numéricos pendientes de medidas.

| Método/ruta | Acceso y propósito | Entrada/validaciones | Salida permitida y límites | Riesgo/prueba principal |
| --- | --- | --- | --- | --- |
| GET /health/live, /health/ready | P o acceso interno según uso; salud mínima | Sin parámetros operativos arbitrarios | Solo estado mínimo; L2; readiness detallada interna | Sin versión, DSN, dependencias privadas ni diagnósticos públicos |
| POST /auth/register, /auth/login | P; crear/autenticar | Email/contraseña acotados, política servidor | Respuesta genérica/señal de sesión según contrato; L1 | Enumeración, brute force y hashing agotado |
| POST /auth/refresh, /auth/logout | E o prueba del refresh; renovar/revocar | Token/familia válido, CSRF en transporte cookie | Tokens según transporte, nunca logs; L1 | Reutilización, refresh concurrente y revocación |
| POST /auth/email/verify, /auth/password/forgot, /auth/password/reset | Token dedicado o P según operación | Propósito, expiry, unicidad, contraseña y acción explícita | Respuesta mínima/no enumerativa; L1 | Token repetido/expirado; GET de escáner no consume |
| POST /auth/google, /auth/apple | P con prueba OIDC/OAuth | Firma/iss/aud/exp/nonce/state/PKCE según flujo | Sesión propia; L1 | Cuenta/redirect incorrectos y vinculación fraudulenta |
| GET /me | E; perfil propio | Sesión vigente | DTO propio sin hashes/secretos; L2, no-store | Acceso ajeno o caché entre usuarios |
| GET /foodtrucks, /foodtrucks/{id}, /foodtrucks/{id}/products | P; descubrimiento publicado | bbox/radio/limit/cursor/filtros acotados; IDs | Solo datos publicados, vigencia y carta pública; L2 | DoS geográfico; negocio oculto/ubicación privada |
| POST /orders/quote, /orders | C; cotizar/crear | Productos/opciones del negocio, cantidades, campaña/puntos, versión e idempotencia | Total calculado e intención propia; L3 | Precio manipulado, negocio mezclado, descuento doble y stock |
| POST /orders/{id}/payment | C propietario; iniciar/recuperar | Pedido/estado/contexto; clave idempotente | Datos mínimos del SDK autorizado; no claves privadas; L3 | Cobro duplicado, importe/cuenta alterados y timeout incierto |
| GET /orders, /orders/{id} | C propietario; M solo pedido de su negocio según ruta/DTO | ID/cursor y pertenencia | DTO según actor, sin historial privado de otro usuario; L2, no-store | BOLA, listados y relaciones que filtran datos |
| GET /orders/{id}/pickup-ticket | C propietario con estado permitido | Sesión, pedido/pago/estado | QR protegido, no-store; L2 | QR ajeno, URL indexable o caché compartida |
| POST /merchant/foodtrucks; PATCH /merchant/foodtrucks/{id} | E para solicitud; M para edición | Campos permitidos; propiedad/estado no modificables arbitrariamente | DTO comercial permitido; L3 | Alta abusiva/mass assignment/cambio de dueño |
| PUT /merchant/foodtrucks/{id}/location, /opening-hours | M; publicar datos válidos | Coordenadas/rangos/vigencia/IANA y horarios | Resultado del propio negocio; L3 | Posición inválida/cambio con pedidos activos; P11 pendiente |
| POST/PATCH /merchant/foodtrucks/{id}/products | M; editar carta | Precio entero/moneda, opciones, alérgenos, disponibilidad, versión | Producto del negocio; L3 | Producto ajeno, precio inválido y contenido XSS |
| POST /merchant/foodtrucks/{id}/media | M; subir foto | MIME real, decodificación, dimensiones, bytes, partes/cuota | ID/URL pública solo cuando publicada; L5 | Traversal, MIME falso, imagen bomba y cuota agotada |
| GET /merchant/foodtrucks/{id}/orders | M; cola de pedidos propia | Cursor/filtros permitidos y pertenencia | Datos necesarios para preparar/recoger; L2, no-store | Otro negocio, exportación o exceso de PII |
| POST /merchant/orders/{id}/transitions | M del pedido; transición permitida | Versión esperada, estado, motivo según operación | Estado actualizado; L3 | Estado ilegal/duplicado/cambio concurrente |
| POST /merchant/pickup/redemptions | M del negocio; recogida | Token opaco acotado, pedido elegible y transacción | Resultado de canje; nunca token en error/log; L3 | Dos canjes simultáneos, token ajeno/cancelado/impagado |
| POST /merchant/foodtrucks/{id}/connect/onboarding; GET /connect/status | M con permiso financiero | Cuenta vinculada por Laravel; return/refresh URLs allowlist | Enlace efímero/estado mínimo; L3 o L2 | Cuenta ajena, open redirect, suplantación de estado |
| POST /merchant/foodtrucks/{id}/billing/checkout, /billing/portal | M con permiso financiero | Producto/contexto servidor y return URL allowlist | Enlace autorizado; L3 | Tarifa ejemplo usada como real/derechos cruzados |
| POST /devices; DELETE /devices/{id} | E; dispositivo propio | Token/plataforma/app/entorno y relación usuario | ID/estado; token no público; L3 | Enviar avisos de un usuario a otro o token de build incorrecto |
| POST /webhooks/stripe/platform, /webhooks/stripe/connect, /webhooks/resend | W; ingestión externa | Bytes originales acotados, firma, tiempo/entorno/cuenta y unicidad | Ack después de persistir; L4; sin challenge/CSRF de usuario | Falso/replay/duplicado/desordenado; Resend no cambia pago |
| GET/PATCH /me/communication-preferences | E; preferencias propias | Canal/finalidad/version y consentimiento | Solo preferencias propias; L2/L3, no-store | Cuota tratada como consentimiento o cambio ajeno |
| POST /communications/email/unsubscribe | Token exclusivo de baja | Propósito/formato y contrato one-click aprobado | Confirmación mínima; L1/L3 | Token de login reutilizado o baja inválida; nunca dar acceso |
| GET /orders/{id}/events | C/M autorizado; SSE candidato | Reautorizar conexión/reconexión, cursor acotado | Eventos mínimos y versionados; L2/conexiones | Escucha ajena, revocación ignorada y datos en broadcasts |
| PATCH /admin/foodtrucks/{id}/status | A con permiso; moderación | Acción/estado/motivo/version; step-up según riesgo | DTO/auditoría autorizada; L3 | Escalada vertical y suspensión sin rastro |
| GET /me/membership, /me/loyalty, /me/loyalty/entries | E; derechos/saldo propios | Sesión/cursor | Datos propios; L2, no-store | Suscripción comercial confundida; ledger ajeno |
| POST /me/membership/checkout, /portal | E; canal de cobro aprobado | Producto cliente 5,99 €/mes; impuestos/canal pendientes | Enlace/contexto propio; L3/idempotencia | Doble contratación, acceso falso y reglas de tienda |
| GET /offers | P para publicación o E para elegibilidad | Vigencia/cursor/filtros | Oferta real; no reglas/segmentos privados; L2 | Oferta caducada/elegibilidad deducida solo por UI |
| Cancelaciones/refunds/ajustes de puntos/campañas/exportaciones | Contrato pendiente, sin ruta ficticia definitiva | Política, dueño, financiación, permisos y motivos antes de implementar | Mínimos por rol; L3/idempotencia | Refund duplicado, saldo fabricado o acción administrativa masiva |

Las rutas abreviadas de Connect/Billing/location comparten el prefijo del negocio de su fila; expandirlas en OpenAPI. No reutilizar rate limits de auth para bloquear reintentos legítimos de un proveedor. Su firma no exime límites de recursos; devolver errores retryables adecuados cuando no se ha persistido. Webhooks no son endpoints públicos de administración aunque no lleven cookie.

## SEC04 — pedidos, importes, pagos, QR y fidelización

Calcular precio, cantidad, moneda, impuestos aprobados, descuentos y financiador en Laravel con enteros en unidad mínima y límites de overflow. Cotejar producto/opciones con negocio y disponibilidad; snapshot versionado. El cliente no declara total, cuenta Connect, estado paid ni saldo. Una cotización expirada debe revalidarse y presentarse al cliente cuando cambie; no ejecutar un importe diferente silenciosamente.

Idempotencia por actor/operación y hash de payload en creación, pago, canje económico y refund; misma clave/datos devuelve resultado recuperable, distinta entrada da conflicto. Stock/reservas/franjas/cupos se comprueban atómicamente cuando P07/P08 estén cerradas. No mantener una transacción SQL abierta esperando a Stripe. Un timeout no prueba fallo: recuperar y conciliar en el mismo contexto antes de crear otro cobro. Separar estado financiero y preparación.

Billing comercial, Billing cliente y Connect comida tienen derechos/cuentas separados. Validar autenticidad e importe/moneda/cuenta/objeto económico en evidencia servidor. Persistir eventos de forma duradera y deduplicar por proveedor/entorno/contexto/evento; procesar fuera de orden sin retroceder un estado válido. Outbox en la transacción de negocio y consumidores idempotentes evitan efectos duplicados; no prometen entrega exactamente una vez del proveedor. Nunca almacenar PAN/CVC ni crear un canal propio de tarjeta.

QR opaco, alta entropía, hash en DB, acceso protegido y consumo único atómico por negocio autorizado, pedido pagado/listo y estado permitido. Scanner/envío duplicado devuelve resultado coherente. No canje offline, QR en URL pública, logs, analítica, emails promocionales o notificaciones de pantalla bloqueada.

Puntos: origen único del crédito, ledger/compensaciones, reserva/canje en PostgreSQL y regla versionada. Probar pago tardío tras liberar reserva, dos dispositivos gastando el mismo saldo, refund parcial repetido y campaña con cupo simultáneo. No borrar movimientos ni aceptar saldo/descuento del cliente. Ratio, acreditación, caducidad, baja/impago y financiador siguen pendientes; no construir una regla económica ficticia. [Pagos](13-stripe.md), [fidelización](25-suscripcion-clientes-fidelizacion.md).

## SEC05 — Next.js y contenido público

Inventariar router real, Route Handlers/API Routes y Server Actions si existen. Ejecutar Next.js en modo producción detrás de Caddy; páginas/header responsive permanecen y dock queda solo nativo. Autorización en cada entrada sensible y otra vez en Laravel; middleware/proxy, layout o componente oculto no protegen todos los accesos. Separar server-only y DTO mínimos; NEXT_PUBLIC_* es público. [Next.js data security](https://nextjs.org/docs/app/guides/data-security).

Cookies Secure/HttpOnly/SameSite y scope mínimo para HTTPS; protección CSRF de mutaciones cookie, Origin/Host permitidos y redirects validados. No debilitar protecciones Server Actions para resolver un proxy mal configurado. Las rutas con bearer sin cookie ambiental y webhooks firmados tienen tratamiento propio, sin desactivar CSRF globalmente. CORS allowlist no es autorización. [OWASP CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).

Escapar catálogo/descripciones; no HTML/SVG activo arbitrario. JSON-LD y metadata deben serializarse con seguridad y solo datos publicados. Revisar CSP en modo report-only antes de enforcement, según runtime y scripts realmente usados: Mapbox, Stripe y Google si se adoptan. Nonces pueden afectar render/caché, por lo que deben probarse en la versión elegida. Evitar comodines, unsafe-inline/eval generales y cabeceras que rompan OAuth/pagos sin análisis. Nosniff, referrer y frame policy revisadas; HSTS solo después de probar HTTPS/renovación/subdominios, sin preload automático. [Next.js CSP](https://nextjs.org/docs/app/guides/content-security-policy).

No persistir sesiones o refresh sensibles en localStorage/sessionStorage; el contrato web debe definir cookies HttpOnly o transporte equivalente revisado. Validar destinos de enlaces/fetch, nunca enviar credenciales a un origen arbitrario. Si existen postMessage, iframes o service workers: validar origen exacto, emisor y forma del mensaje, restringir navegación y no cachear datos de otro usuario. Revisar Permissions-Policy para capacidades usadas. Evitar dangerouslySetInnerHTML, innerHTML, eval y deserialización ejecutable de datos externos; HTML enriquecido solo con necesidad, sanitización mantenida y pruebas de XSS.

Auth/me/pedido/ticket/portal y respuestas personalizadas no se cachean en CDN/HTML/caché compartida; comprobar HTML/RSC/props y cambio de sesión. Contenido público tiene invalidación tras commit, vigencia y separación de privados. Robots/noindex y slugs aleatorios no protegen datos. Analítica, GTM, ads y SDK requieren consentimiento/finalidad propios, URLs saneadas y configuración por entorno. No confiar en SRI para un script de proveedor que cambia: verificar integración admitida y gobernar versiones/accesos. [SEO](32-seo-local-nextjs.md), [medición](34-analitica-consentimiento.md).

## SEC06 — app Expo/React Native y capacidades nativas

Confirmar SDK y matriz de módulos antes de configurar. Backend secrets no van a EXPO_PUBLIC_*, assets ni builds; un publishable token sigue necesitando scopes/entorno correctos. Refresh/sesiones en almacenamiento seguro compatible, con borrado al logout y revocación servidor; AsyncStorage no es un almacén de secretos. Deep/universal/app links en allowlist con validación de parámetros y sesión; QR o callback no otorgan privilegios por abrir una ruta. [React Native security](https://reactnative.dev/docs/security).

Evaluar expo-secure-store según el SDK, Keychain/Keystore, cambios biométricos, reinstalación/transferencia y exclusiones de backup Android; no usar almacenamiento local como única copia de derechos/saldos. Sus limitaciones deben probarse en dispositivos. [Expo SecureStore](https://docs.expo.dev/versions/latest/sdk/securestore/) es referencia de consulta; fijar página de la versión elegida antes de implementar.

Permisos mínimos para ubicación/cámara/avisos, petición contextual y fallback al rechazo. HTTPS con validación normal; pinning/attestation son decisiones de riesgo con plan de rotación y compatibilidad, no requisitos automáticos que bloqueen certificados de Caddy. WebViews solo si hay necesidad real, con navegación/puentes/orígenes restringidos y sin lectura arbitraria de archivos; no convertir componentes web en nativos por una WebView improvisada.

Inspeccionar release: firma/identidad, endpoint, app IDs, permisos/entitlements, librerías nativas, debugger, sourcemaps y logs. Live Activities/Android Live Updates muestran estado mínimo del pedido sin secretos, ubicación privada ni marketing; fallback funciona sin permiso o SO compatible. No afirmar que Jest o un emulador acreditan Mapbox nativo, push, ActivityKit o 120 FPS. [Avisos](15-notificaciones-tiempo-real.md), [rendimiento](16-rendimiento.md).

## SEC07 — fotos, datos, proxy, correo y servidor doméstico

Fotos locales persistentes fuera de contenedores efímeros, con MIME real, decodificación/límites de dimensiones, nombre generado y visibilidad. Rechazar formatos activos no necesarios; quitar metadatos sensibles cuando corresponda. Caddy solo lee medios públicos aprobados, sin listing del árbol de datos; archivos privados sirven por handler autorizado. Cuota, retención y limpieza que respete referencias: nada de borrado recursivo ciego. [OWASP uploads](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html).

Minimizar datos personales/geolocalización; DTO, logs y métricas sin tokens, QR, cuerpos de auth, correo completo o datos de tarjeta. Retención y borrado/anónimo compatibles con obligaciones financieras pendientes de revisión territorial. Acceso soporte mínimo y auditado; no dar acceso universal por el nombre de un rol. Backups cifrados fuera de casa, claves separadas y restore aislado con side effects deshabilitados. No prueba de recuperación sin restauración real. [Fotos/operación](18-media-backups-operacion.md).

Cloudflare como registrador/DNS, ruta directa o Tunnel según decisión y HTTPS público. En proxy directo al origen usar certificado válido y Full (strict); en Tunnel validar cloudflared→Caddy y su estrategia ACME según doc38. HTTP local solo como alternativa deliberada dentro de loopback/red Compose estrictamente aislada, nunca como Flexible o verificación desactivada. Hostnames y cadena de confianza acotados; no aceptar X-Forwarded-For/Host de cualquiera. Validar exposición desde fuera de la red: IPv4/IPv6, Docker publicado, administración, origen directo y bypass del WAF. No publicar PostgreSQL/Redis/metrics/diagnósticos/Prometheus/Grafana/hipervisor/SSH indiscriminadamente. Segregar dev/prod, volúmenes, secretos y redes; CI no accede a la LAN familiar. [Cloudflare](29-cloudflare-dominio-dns.md), [servidor](38-servidor-domestico.md).

Correo de aplicación Resend desde Laravel/worker, dominios/keys mínimos por entorno y webhook autenticado/deduplicado. Las alertas operativas pueden usar SMTP desde Grafana/servicio notificante, con otra credencial mínima y destinatario autorizado; claves de envío nunca en cliente. Separar transaccional/marketing, bajas/rebotes/quejas y protección de tokens de identidad. No API de envío a destinatarios arbitrarios, tracking de links de reset ni correo live desde CI/restores. Sandbox/sink y allowlist para pruebas según [30](30-correo-resend.md); [alertas](41-observabilidad-grafana-prometheus-sentry.md). La firma de correo nunca activa derechos económicos.

## SEC08 — dependencias, secretos, componentes externos y artefactos

Inventariar directas/transitivas en manifests/lockfiles reales, incluyendo Laravel, Node, Swift/Kotlin/Pods/Gradle, SDK de pago/mapa/publicidad, actions, base images y componentes copiados. Registrar uso, versión/origen, licencia y mantenimiento. 21st.dev/Figma/Framer/IA no producen código automáticamente aprobado: revisar licencia y atribución, sinks, env, scripts y dependencias; probar comportamiento antes de integrar. No afirmar auditoría exhaustiva de 21st.dev.

Instalación reproducible; scripts de instalación revisados y toolchains soportadas/parches verificados. Mantener `composer.json`/`composer.lock`, instalación con `composer install` y comprobación de plataforma en Linux; ejecutar Pint, Larastan y `composer audit --locked` según CI; npm ci o pnpm frozen-lockfile según gestor cerrado. Upgrades por cambio acotado con compatibilidad, lockfile, tests/build y rollback; no audit fix --force. SBOM por artefacto y scan de imagen cuando existan Dockerfiles; no añadir escaneo de Terraform inexistente.

Secret scanning preventivo y revisión histórica cuando haya Git. Gitleaks y controles GitHub elegibles complementan una inspección de `.env`, signing material, backups, fixtures, sourcemaps, logs y artefactos. Un simple rg sin coincidencias no acredita ausencia de secretos. No mostrar valores en informes. Si se confirma uno: delimitar exposición, contener y rotar/revocar con alcance autorizado, sustituir mediante canal seguro y comprobar que no aparece otra vez. Limpieza del último commit no limpia clones/historia; no reescribir remoto sin coordinación. [Gitleaks](https://github.com/gitleaks/gitleaks), [GitHub secret scanning](https://docs.github.com/en/code-security/how-tos/secure-your-secrets/detect-secret-leaks/enable-secret-scanning).

La [política de CI](40-testing-qa-github.md) distingue SAST/SCA/secretos/imagen/DAST y disponibilidad por plan. [44](44-politica-commits-ci-cd-tests.md) fija el cierre por commit/push/CI, tests y promoción. GitHub Actions es el mecanismo de CI/CD previsto y GHCR el registro de imágenes previsto: build desde SHA confiable, escaneo y procedencia por digest, staging automático tras gates y producción con aprobación manual del mismo digest, sin rebuild entre entornos. Los secretos se inyectan por entorno y no se incluyen en capas, build args, bundles, SBOM o logs. Permisos de publicación restringidos al job confiable; el host solo necesita lectura del paquete correspondiente. [GitHub Container registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

PR de fork o código no confiable se valida sin secretos de proveedores, firma, publicación o despliegue y sin runners con acceso a producción o LAN doméstica. El gate estable se programa para comprobar resultados esperados incluso tras fallos; comando inexistente, job ausente, fallo, cancelación o salto inesperado cierran la aceptación. Estas son exigencias para la implementación futura, no workflows, scans o permisos ya configurados. No activar paquetes duplicados por una plantilla; priorizar evidencia, compatibilidad y controles de los flujos críticos.

## Hallazgos, excepciones e incidentes

Un hallazgo futuro requiere ID, severidad/urgencia, archivo y línea reales o configuración/runtime observado, input→sink/control ausente, impacto, condición de explotación, reproducción controlada, solución y test. Separar hipótesis de confirmado, limitaciones de falsos positivos y mitigación de corrección definitiva. No crear un CVE, bug o prueba exitosa por interpretar este documento.

Crítico/alto confirmado: contener de forma proporcionada, preservar evidencia saneada y priorizar corrección/rotación. DAST/reproducciones solo en entorno propio autorizado con límites; nunca atacar dominio de terceros o producir compras reales. Si no hay acceso a código, dejar auditoría runtime pendiente por material ausente, no calificar el producto como aprobado o vulnerable.

Excepción: control/hallazgo, motivo, alcance, responsable, mitigación, test alternativo, vencimiento y revisión; no wildcard de ignore ni suppressions para poner CI verde. Un fallo de escáner puede exigir reintento diagnóstico o decisión explícita, nunca equivaler a "sin vulnerabilidades".

Incidente: detección → triage → contención → preservación de evidencia → recuperación verificada → conciliación de pedidos/pagos/QR/puntos/outbox → revisión y prevención. Restaurar servidor no revierte cobros ni elimina datos externos; no activar envío/marketing al restaurar. Responsables, canal y tiempos pendientes. [Observabilidad](41-observabilidad-grafana-prometheus-sentry.md), [QA/CI](40-testing-qa-github.md).

## Evidencia de aceptación y pendientes

| Control | Evidencia futura para aceptarlo | Estado en este paquete |
| --- | --- | --- |
| SEC01/02 | Tests directos de auth y permisos cruzados, revocación/OAuth y revisión de rutas reales | Requisitos documentados; código/pruebas pendientes |
| SEC03 | Límites/timeouts probados, validadores/fuzzing, queries parametrizadas y planes relevantes | Propuesta; no runtime |
| SEC04 | Reintentos y concurrencia reales PostgreSQL, webhooks, reconciliación, QR/puntos únicos | Reglas técnicas propuestas; P03/P05–08/P29–34 condicionan partes |
| SEC05/06 | Build web/nativa real, headers/caché/CSRF, datos emitidos y dispositivos/links | No app, build ni mediciones |
| SEC07 | Exposición externa, puertos/TLS, uploads, DNS/correo y restore aislado | No acceso a host/cuentas; no configurado |
| SEC08 | Lockfiles/SBOM/escáneres ejecutados, licencias y resultados por artefacto | No manifests/artefactos de app |
| Cierre y release | Commit/push/CI del SHA exacto, tipo de prueba y resultado real; staging correcto y producción aprobada del mismo digest | Política [44](44-politica-commits-ci-cd-tests.md); sin Git, Actions, GHCR o deploy verificados |

Para aceptar una implementación, el responsable registra control/versión, rutas o configuración reales, test y comando, fecha, SHA y entorno, resultado y artefactos saneados. Un control obligatorio ausente o fallido bloquea aceptación; no aplicable requiere alcance/motivo verificable y revisión. La trazabilidad completa de los 29 apartados se mantiene en [40](40-testing-qa-github.md), como políticas integradas.

Pendientes antes de la auditoría de aplicación: acceso al repositorio y remoto reales; toolchains/manifests/rutas; propietarios y matriz de permisos; P19 y contratos económicos condicionantes; baseline de tests/escáneres; cuentas y elegibilidad GitHub/GHCR; host, exposición y recursos de staging/producción; gestión de secretos, canales de incidente y restauración. No convertir un pendiente en implementación mediante un ejemplo de YAML o una captura sin contexto.

La revisión documental v1.7 aplicó security-best-practices y sus referencias Go, React, Next.js y JavaScript general; esa evidencia histórica no cubre PHP. El backend vigente se revisa con fuentes oficiales Laravel/PHP, PHPUnit, Pint, Larastan y auditoría Composer. Sus snapshots/versiones orientan la política y deben contrastarse con la versión real al implementar; no se copian recetas de TLS, CSP, rutas o dependencias por inercia. No se ha ejecutado ningún script de scan ni instalado software de aplicación.

## Gobernanza, riesgos y desarrollo seguro — v1.9

La [política de protección de datos y gobernanza](48-proteccion-datos-gobernanza.md) conecta estas obligaciones con calidad, ciclo de vida y gestión del riesgo. Mantener un registro único de riesgos/excepciones con alcance, impacto y prioridad justificados, responsable, tratamiento, riesgo residual, aceptación, vencimiento y revisión. Los datos se inventarían desde su recogida hasta proveedores, medios, cachés y copias; finalidad, acceso, conservación y eliminación se deciden antes de habilitar el tratamiento afectado.

Los marcos orientan requisitos propios comprobables: requisito/riesgo → control SEC o QA existente → prueba/gate → evidencia y SHA/entorno → responsable y estado. Conservar edición e identificador reales al citar una norma; no crear IDs normativos ni duplicar las matrices técnicas. NIST SSDF 1.1 es la base final verificada; su revisión 1.2 sigue publicada como borrador. [Publicaciones oficiales NIST](https://csrc.nist.gov/Projects/ssdf/publications). La adaptación de ISO, OWASP, SSDF y CMMI no acredita certificación, madurez evaluada, cumplimiento legal ni seguridad de una app ausente.

El código generado o modificado con IA atraviesa la misma revisión, pruebas y gates de [44](44-politica-commits-ci-cd-tests.md). Usar datos sintéticos y contexto mínimo; no enviar secretos, datos de clientes, backups o payloads privados a herramientas de IA sin autorización expresa y evaluación de necesidad, finalidad/base, condiciones y protección del destino. La autorización de escribir código no concede permiso para esos envíos. Verificar dependencias, licencias y comportamiento antes de aceptar. La revisión de IA no sustituye una aprobación humana requerida. No añadir otra plataforma, scanner o proceso por citar un marco.

El criterio de salida futura combina comportamiento, permisos, pruebas, escáneres aplicables, revisión y recuperación. Cumplimiento legal, certificaciones, pentest independiente y capacidad del servidor no quedan demostrados por este paquete.
