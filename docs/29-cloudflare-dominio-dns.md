# Dominio en Cloudflare: DNS, TLS, proxy y operación

**Actualización 22/10/2026 (D47–D50):** foodtruck.bid está comprado en Cloudflare y verificado en Resend. DEV publica api-dev.foodtruck.bid mediante Tunnel → Caddy → Laravel/PHP-FPM; [configuración y comprobaciones](../backend/README.md). Next.js, origen directo, hostnames y controles de staging/PROD siguientes siguen propuestos; esta política no acredita su despliegue.

Comprobación documental: 13 de octubre de 2026. `dominio.example`, hostnames, IP, rutas de montaje y nombres de servicios son ejemplos. El dominio exacto, TLD, titular, precio de compra/renovación, plan Cloudflare, conectividad del domicilio y estrategia final de certificados siguen pendientes. Registrar un dominio y contratar un plan de proxy son decisiones distintas; no se presupone un plan de pago.

## Compra, titularidad y acceso

1. Elegir nombre/TLD y comprobar disponibilidad, condiciones particulares y precio final en Cloudflare antes de comprar. No existe un precio aprobado en este paquete. La disponibilidad de un resultado de búsqueda no garantiza registro hasta la comprobación final.
2. Usar una cuenta propiedad del responsable de Foodtrucks, con email verificado y datos del titular correctos. Verificar también el email del registrante tras la compra; una verificación pendiente puede afectar la resolución del dominio. El TLD puede imponer condiciones distintas y la privacidad WHOIS depende del registro. [Registro oficial](https://developers.cloudflare.com/registrar/get-started/register-domain/).
3. Activar MFA/passkey o llave de seguridad para quienes administren la cuenta; guardar recuperación fuera del repositorio y mantener un contacto de recuperación independiente del propio dominio. Usuarios nominales y permisos mínimos, sin compartir contraseña. [MFA Cloudflare](https://developers.cloudflare.com/fundamentals/user-profiles/2fa/).
4. Registrar fecha de expiración, medio de pago, titular y responsable de renovación en el inventario operativo privado. Comprobar Auto-renew y alertas; no depender únicamente de que un cargo automático funcione. En el Dashboard la documentación describe renovación automática inicial; la API de registro tiene un valor por defecto distinto, por lo que se debe comprobar el estado real. [Renovación](https://developers.cloudflare.com/registrar/account-options/renew-domains/), [API Registrar](https://developers.cloudflare.com/registrar/registrar-api/).
5. Activar DNSSEC y comprobar la cadena de validación cuando la zona esté estable. Para dominios de Cloudflare Registrar el flujo integra la publicación en el registro; no pegar un DS de otra zona. [DNSSEC Registrar](https://developers.cloudflare.com/registrar/get-started/enable-dnssec/).

Cloudflare Registrar exige utilizar los nameservers de Cloudflare mientras el dominio permanezca en ese registrador. Esto permite mantener el servidor doméstico: no obliga a alojar la aplicación en Workers, Pages o R2. [Requisitos del registrador](https://developers.cloudflare.com/registrar/get-started/register-domain/).

## Elección doméstica antes de copiar una configuración

U09 decide servidor en casa. **Las recetas de IP pública/Caddy de este documento son para la ruta directa; con Tunnel se adaptan según [doc38](38-servidor-domestico.md).** No crear estos A/AAAA cuando se vaya a usar el CNAME del túnel. El ejemplo de proxies confiables tampoco vale sin cambios cuando el peer real es cloudflared local.

## Topología y registros propuestos

Flujo DEV vigente: app → Cloudflare Tunnel → Caddy interno `:8080` → PHP-FPM privado `api:9000` mediante FastCGI. PostgreSQL/PostGIS y Redis no publican puertos. El origen directo con HTTPS en Caddy es una alternativa futura de staging/PROD, con red/TLS por verificar; no sustituye automáticamente el Tunnel DEV. [Infraestructura](17-infraestructura.md).

| Tipo | Nombre en la zona | Valor de ejemplo, por sustituir | Estado propuesto | Uso |
| --- | --- | --- | --- | --- |
| A | `@` | `<IPV4_PUBLICA_DOMESTICA>` | DNS only durante bootstrap; Proxied tras verificar TLS | Web canónica `https://dominio.example` |
| CNAME | `www` | `dominio.example` | Igual que la web | Redirección HTTPS hacia el apex |
| A | `api` | `<IPV4_PUBLICA_DOMESTICA>` | DNS only durante bootstrap; Proxied después | API de la app nativa y clientes externos |
| A | `assets` | `<IPV4_PUBLICA_DOMESTICA>` | Opcional; Proxied después de TLS | Solo fotos públicas; siguen almacenadas en el servidor doméstico |
| A | `staging` | `<IPV4_ENTORNO_PRUEBAS>` | Opcional; decidir protección antes de publicar | Web de pruebas, sin datos reales |
| A | `api-staging` | `<IPV4_ENTORNO_PRUEBAS>` | Opcional | API/webhooks de pruebas |
| AAAA | Los hosts anteriores que realmente usen IPv6 | `<IPV6_PUBLICA_FUNCIONAL>` | Solo tras probar conectividad IPv6 completa | No crear si el origen no escucha o el firewall IPv6 no está preparado |
| TXT/MX/CNAME de correo | Nombres exactos que genere Resend | Valores del Dashboard Resend | DNS only cuando aplique; TXT/MX no tienen proxy HTTP | Verificación, SPF, DKIM y Return-Path |
| TXT | `_dmarc` o el hostname definido en la política de correo | Política revisada | DNS only | DMARC, despliegue gradual según el documento de correo |

Para registros Proxied utilizar el TTL automático que permita Cloudflare; para DNS only elegir un TTL operativo al preparar el cambio, sin asumir propagación instantánea. Los registros proxied devuelven IP de Cloudflare, por lo que `dig` no prueba la IP de origen. Los TXT/MX son DNS only y los CNAME de correo o verificación que lo necesiten deben conservarse sin proxy. [Uso de DNS/proxy](https://developers.cloudflare.com/dns/proxy-status/use-cases/).

No crear un comodín DNS sin necesidad, ni `mail` apuntando al servidor doméstico por inercia. La propuesta de remitente es `mail.dominio.example`; Resend determina los registros concretos y puede generar un Return-Path como `send.mail.dominio.example`, pero no debe codificarse ese nombre antes de recibirlo. No sustituir MX del apex si se elige posteriormente un buzón de soporte. [Correo Resend](30-correo-resend.md).

## HTTPS y certificados: dos capas distintas

Cloudflare presenta un certificado al visitante; Caddy presenta otro a Cloudflare/origen directo. **Base propuesta: Full (strict)** y certificado público válido gestionado por Caddy. El certificado de origen debe estar vigente y cubrir el hostname solicitado; habilitar el proxy antes de disponer de él puede producir 526. No usar Flexible ni desactivar la validación TLS para resolver un error. [Full (strict)](https://developers.cloudflare.com/ssl/origin-configuration/ssl-modes/full-strict/).

Configurar el TLS del borde de acuerdo con los clientes admitidos: mínimo TLS 1.2 y TLS 1.3 habilitado como propuesta. Esperar a que el certificado del borde esté activo para cada nombre publicado. En Caddy conservar los valores modernos por defecto salvo necesidad verificada. No habilitar HSTS preload o `includeSubDomains` inicialmente: primero inventariar todos los hosts y demostrar renovación/recuperación HTTPS. Una política HSTS permanece en los navegadores hasta su expiración; bajar su valor no borra de inmediato políticas ya recibidas. [TLS Caddy](https://caddyserver.com/docs/caddyfile/directives/tls), [HSTS Cloudflare](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/http-strict-transport-security/).

Cloudflare Origin CA es alternativa pendiente, no necesaria con un certificado público Caddy. Sus certificados son confiables para Cloudflare pero no para navegadores normales en una conexión directa; pasar a DNS only puede dejar el sitio inaccesible. Si se elige Origin CA hay que documentar renovación, custodia de clave y recuperación compatibles. [Origin CA](https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/).

### Opción sencilla propuesta: Caddy estándar y HTTP-01

1. Preparar rutas, variables, volúmenes persistentes y firewall. Publicar inicialmente A/AAAA como DNS only con la dirección correcta. IPv6 incorrecto puede romper validación aunque IPv4 funcione.
2. Permitir que el hostname alcance Caddy por TCP 80 para el challenge y 443 para HTTPS. Caddy debe responder al challenge ACME en `/.well-known/acme-challenge/`; ninguna app, WAF, autenticación de staging o redirección externa debe interceptarlo.
3. Emitir/verificar el certificado público y su SAN en Caddy. Las pruebas ACME de staging usan certificados de prueba no confiables para clientes ni para Full (strict); volver al emisor público antes de habilitar tráfico real.
4. Activar Full (strict) y, después, Proxied en los hosts probados. Mantener inicialmente **Always Use HTTPS desactivado en Cloudflare** y usar la redirección automática de Caddy: las rutas normales se redirigen, el challenge HTTP sigue llegando al origen por 80.
5. Excluir exactamente la ruta del challenge de reglas de caché, challenge de navegador y redirecciones que puedan alterar la validación. No redirigir todas las rutas del hostname de API hacia la página web.
6. Probar emisión/renovación con la topología final antes de restringir el origen a rangos Cloudflare. Con DNS Proxied el challenge HTTP viaja a Cloudflare y debe llegar a Caddy; TLS-ALPN-01 termina en el borde y no alcanza Caddy, por lo que el ejemplo fuerza HTTP-01.

HTTP-01 exige accesibilidad exterior por el puerto 80; cambiar el puerto interno de Caddy no cambia el puerto que usa la CA. La emisión empieza en segundo plano: que Caddy arranque no confirma que haya certificado. [ACME y HTTPS automático](https://caddyserver.com/docs/automatic-https).

Si se desea activar Always Use HTTPS en Cloudflare, primero verificar la validación ACME completa con ese cambio y la renovación a través de HTTPS, o elegir DNS-01. No combinar un certificado de origen ausente, Full (strict), redirección de todo HTTP en el borde y HTTP-01 esperando que se resuelva por sí solo.

### Alternativa propuesta: DNS-01 para un origen más restringido

Elegible si se decide cerrar el acceso HTTP al origen o evitar que ACME dependa de las reglas del borde. DNS-01 valida TXT y no necesita puertos entrantes para emitir; no elimina el 443 necesario para servir la aplicación. La imagen estándar de Caddy **no incluye** el módulo del proveedor Cloudflare: preparar una imagen reproducible con `dns.providers.cloudflare`, versiones fijadas y revisión de su dependencia comunitaria. No se ha instalado este módulo. [Challenges Caddy](https://caddyserver.com/docs/automatic-https), [módulo Cloudflare](https://github.com/caddy-dns/cloudflare).

El token se limita a `Zone:DNS:Edit` y `Zone:Zone:Read` de la zona concreta. Guardarlo como secreto de Caddy, con rotación y restricción de uso adecuada al entorno; no usar Global API Key, permisos de facturación/compra, acceso a todas las zonas ni token del CI genérico. El módulo necesita actualizar DNS y no debe conceder autoridad de dominio a Next.js, Laravel, móvil o navegador. [Permisos del módulo](https://github.com/caddy-dns/cloudflare), [tokens Cloudflare](https://developers.cloudflare.com/fundamentals/api/get-started/).

Tras elegir esta alternativa, sustituir el `cert_issuer` HTTP-01 del ejemplo por lo siguiente y comprobar que el módulo existe en la imagen usada:

~~~caddyfile
{
    email {$ACME_EMAIL}
    acme_dns cloudflare {env.CF_DNS_API_TOKEN}
    # Conservar aquí el bloque servers con los proxies confiables.
}
~~~

No concatenar ambos bloques globales: Caddy permite uno. No publicar TXT temporales ACME a mano como configuración permanente; el módulo crea/elimina los suyos. [Opciones globales Caddy](https://caddyserver.com/docs/caddyfile/options).

### CAA

CAA es un control opcional propuesto. Antes de restringir emisores, comprobar los que usa el certificado del borde, Caddy y cualquier servicio añadido. No permitir solo Let's Encrypt a ciegas: podría bloquear una emisión Cloudflare o un emisor de respaldo. Revisar valores actuales del proveedor, herencia del registro y política `issue`/`issuewild`, verificar emisión y registrar el rollback. No se proporciona una lista de CA universal ni un CAA definitivo. [CAA Cloudflare](https://developers.cloudflare.com/ssl/edge-certificates/caa-records/).

## Caddy y PHP-FPM

La fuente ejecutable DEV es [infrastructure/Caddyfile](../infrastructure/Caddyfile), junto a [compose.yaml](../compose.yaml) y [compose.tunnel.yaml](../compose.tunnel.yaml). Caddy limita body/paths y enruta `/api/*` y `/up` al front controller `/app/public/index.php` con transporte FastCGI a `api:9000`; el resto devuelve 404. El puerto 8080 es HTTP interno de Caddy, no un servidor HTTP Laravel. PHP-FPM queda privado y el web root se limita a `public/`, nunca a la raíz del repositorio.

Una futura web Next.js deberá conservar `/api/v1` al llegar a Laravel, con el mismo contrato y autorización para web/móvil. No copiar el antiguo `reverse_proxy api:8080` de Go: HTTP y FastCGI no son intercambiables. La configuración web/origen directo requerirá prueba propia de rutas, hosts, cookies/CSRF, TLS y exposición; no está implementada por estos ejemplos. [Despliegue Laravel](https://laravel.com/docs/13.x/deployment).

Complemento opcional, solo si se elige `assets` y se monta exclusivamente la carpeta pública procesada en lectura:

~~~caddyfile
{$ASSETS_HOST} {
    root * /srv/foodtrucks-public
    header X-Content-Type-Options nosniff
    header Cache-Control "public, max-age=3600"
    @write not method GET HEAD
    respond @write 405
    file_server
}
~~~

El TTL de una hora es ilustrativo, no aprobado. Nombres versionados/hash permiten valorar `immutable`; para borrado o moderación definir purga y URL nueva. No montar el directorio raíz del proyecto, uploads privados, backups, certificados o `.env`, ni activar listado de directorios. `file_server` no sustituye la validación de imágenes en Laravel. [Medios/backups](18-media-backups-operacion.md).

En Compose se deberán inyectar variables al **contenedor Caddy**; un `.env` utilizado para interpolación de Compose no garantiza por sí solo su presencia dentro del proceso. Montajes propuestos: Caddyfile → `/etc/caddy/Caddyfile` en lectura, estado de certificados → `/data` persistente, configuración runtime → `/config` persistente, medios públicos → `/srv/foodtrucks-public` en lectura. Backups del estado con acceso limitado porque incluye claves privadas. No publicar el puerto administrativo 2019; recargar dentro del contenedor. El token DNS-01, si se usa, requiere inyección secreta sin incluirlo en la imagen/Git.

### IP real y frontera de confianza

En origen directo, Caddy debe confiar solo en los CIDR Cloudflare vigentes si ese es el peer real. En Tunnel, confiar únicamente en el conector y la red privada aislada de esa ruta; no copiar sin revisión `private_ranges` a otro despliegue. Normalizar IP/protocolo en Caddy y configurar `trustProxies`/`trustHosts` en Laravel según esa frontera. Una cabecera enviada por el cliente no concede identidad ni permisos. [Proxies confiables Caddy](https://caddyserver.com/docs/caddyfile/options).

Verificar que Docker conserva la IP de origen en esta instalación: si Caddy ve todas las conexiones como una pasarela privada, no declarar toda esa red confiable para recuperar cabeceras. Resolver antes la red/NAT o un mecanismo autenticado. IPv4/IPv6, peticiones directas y cabeceras duplicadas deben formar parte de la comprobación. IP de cliente sirve para rate limits/auditoría, nunca para autorizar pedidos. No activar una transformación que elimine las cabeceras necesarias sin cambiar este contrato.

## Firewall del origen

| Acceso | Base propuesta |
| --- | --- |
| TCP 443 | Aplicación por Cloudflare tras estabilizar proxy y renovación; administración de pruebas solo mediante excepción temporal controlada |
| TCP 80 | Necesario para HTTP-01 y redirección; cerrar/restringir únicamente tras comprobar challenge final o elegir DNS-01 |
| SSH | Solo IP administrativas/VPN elegida; acceso por clave y recuperación documentada |
| PostgreSQL, Redis, Next.js, Laravel, Caddy admin | Sin puertos públicos; red interna Compose |
| Salida | DNS y HTTPS necesarios para ACME, Resend, Stripe y avisos; política concreta pendiente |

Usar la [lista oficial IPv4/IPv6 Cloudflare](https://www.cloudflare.com/ips/), comprobar diferencias, aplicar de forma revisable y verificar desde fuera después de cada actualización. No descargar una lista y ejecutarla como comandos. Revisar firewall del proveedor **y** reglas efectivas del host/Docker: un puerto publicado puede eludir expectativas basadas solo en UFW. No abrir datos internos para solucionar conectividad de un contenedor.

Una allowlist de rangos identifica infraestructura Cloudflare compartida; no demuestra por sí sola que una petición pertenece a la cuenta Foodtrucks. Como endurecimiento posterior valorar Authenticated Origin Pulls/configuración dedicada compatible con el plan, junto con validación de hosts y autorización de aplicación. No configurar mTLS del origen sin probar primero el handshake y tener recuperación. No anunciar protección total del origen por ocultar su IP en DNS.

## Caché y WAF: reglas explícitas

### Política inicial de caché propuesta

| Superficie | Política |
| --- | --- |
| Host `api`, `/api/v1` en web y API de staging | Bypass cache completo; Laravel/proxy `private, no-store` |
| Auth, `/me`, pedidos, QR, membresía, puntos, carrito, checkout/Billing/Connect, páginas personales/comerciante/admin | No almacenar en CDN ni caché compartida; SSR privado con `private, no-store` |
| Webhooks Stripe y Resend, SSE/WebSocket, callbacks OAuth | Bypass cache, sin reescritura de body ni redirecciones |
| HTML público Next.js | Comportamiento de origen al inicio; no activar Cache Everything global |
| `/_next/static/*` y fotos públicas versionadas | Elegibles solo GET/HEAD; respetar Cache-Control del origen |
| Medios privados/URLs protegidas | Autorización Laravel y `private, no-store`, sin servidor estático ni CDN pública |

Cloudflare no almacena todo por defecto; sus reglas y cabeceras de origen pueden cambiar la elegibilidad. No activar un Edge TTL que ignore `no-store` en superficies privadas ni deducir privacidad por extensión de URL. Una excepción debe prevalecer sobre cualquier regla general de cacheo; revisar el orden efectivo y probar dos cuentas distintas. `CF-Cache-Status: DYNAMIC` puede ser correcto para una regla Bypass; no exigir solo el texto BYPASS. [Comportamiento por defecto](https://developers.cloudflare.com/cache/concepts/default-cache-behavior/), [Cache Rules](https://developers.cloudflare.com/cache/how-to/cache-rules/settings/), [orden de reglas](https://developers.cloudflare.com/cache/how-to/cache-rules/order/).

Crear primero reglas acotadas por hostname/ruta en el plan disponible y documentar sus IDs, expresiones, orden y propósito. Si una función no está disponible, conservar política de origen conservadora y evitar cacheo general; no comprar una ampliación automáticamente. CDN de fotos públicas no cambia la decisión de almacenamiento persistente local ni es un backup.

### Política inicial de seguridad del borde propuesta

- Conservar protección disponible contra ataques y bloqueos justificados; revisar los eventos antes de endurecer. El WAF complementa validación, firma, permisos y rate limit Laravel.
- No imponer challenge JavaScript/CAPTCHA de navegador a API nativa, SSE, webhook o callback OAuth. Suprimir solo la regla/componente que cause el falso positivo y en la superficie exacta; no hacer Skip de toda la seguridad para `/api/*`.
- Endpoints de ejemplo que necesitan tránsito máquina a máquina: `POST /api/v1/webhooks/stripe/platform`, `POST /api/v1/webhooks/stripe/connect` y `POST /api/v1/webhooks/resend`. Deben seguir verificando firma, cuerpo original, tamaño, replay e idempotencia. User-Agent no acredita el proveedor.
- Las rutas de auth requieren controles de abuso compatibles con móvil y OAuth; los límites de edge no reemplazan controles por cuenta/identidad en Laravel ni deben bloquear reintentos legítimos de proveedor.
- **Bot Fight Mode no admite Skip** en custom rules y puede desafiar tráfico móvil/API. Dejarlo desactivado en esta zona compartida como propuesta inicial; no confiar en una excepción WAF para rescatar webhooks si se activa. La alternativa requiere evaluar funciones del plan y probar tráfico completo. [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/), [Skip WAF](https://developers.cloudflare.com/waf/custom-rules/skip/).
- En staging valorar Cloudflare Access para páginas humanas, con bypass acotado o host separado para webhooks y flujos móviles automatizados. Añadir `noindex` y bloquear indexación no equivale a control de acceso. No introducir una pantalla de Access en la URL que necesita Stripe/Resend.

No se asumen WAF gestionado completo, Bot Management, rate limits avanzados, reglas ilimitadas, logs exportables o funciones Enterprise en Free. Confirmar disponibilidad y coste en el plan efectivo al implementar. Guardar reglas/versiones sin secretos bajo revisión Git cuando se elija automatización.

## Conexiones largas, cargas y observación

Caddy admite WebSocket y vacía SSE automáticamente cuando el origen responde `Content-Type: text/event-stream`. No imponer un timeout global de escritura que corte todos los eventos de pedido; definir límites por operación y reutilización con pruebas. La API debe responder a un webhook tras validación/persistencia duradera y procesar trabajo largo fuera de la respuesta. [Streaming Caddy](https://caddyserver.com/docs/caddyfile/directives/reverse_proxy).

Cloudflare publica actualmente Proxy Read Timeout de 125 s y Proxy Write Timeout de 30 s para conexión a origen; son límites del proveedor, no tiempos recomendados para pedidos. Revalidarlos al desplegar. SSE debe emitir heartbeat apropiado, reconectar y recuperar estado/eventos autorizados; no tratar una conexión como entrega exactamente una vez. WebSocket también necesita heartbeat/reconexión porque actualizaciones del borde pueden cerrarlo. Elegir SSE o WebSocket sigue pendiente. [Límites Cloudflare](https://developers.cloudflare.com/fundamentals/reference/connection-limits/), [WebSockets Cloudflare](https://developers.cloudflare.com/network/websockets/).

Limitar cargas en Laravel antes de almacenar/decodificar y coordinar body, dimensiones, tiempo y concurrencia con los límites efectivos de Cloudflare/Caddy. No aumentar máximos generales para aceptar una imagen sin analizar abuso y espacio disponible. Monitorear errores 522/524/525/526, certificado de **origen además del borde**, DNSSEC, expiración del dominio, disco, caché de público/privado y entregas de webhook. Correlacionar Request ID/Ray ID sin registrar tokens, QR o URLs completas de recuperación de contraseña.

## Verificación de implementación y rollback

**Estos comandos son instrucciones para el futuro entorno; no se han ejecutado contra un dominio o infraestructura Foodtrucks.** Requieren herramientas instaladas, Compose existente y variables reales; `dominio.example` no resuelve como dominio de producción.

~~~sh
dig NS dominio.example
dig A dominio.example
dig AAAA dominio.example
dig +dnssec dominio.example
curl --head https://dominio.example/
curl --head https://www.dominio.example/
curl --head https://api.dominio.example/api/v1/health/live
docker compose exec caddy caddy version
docker compose exec caddy caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
~~~

La ruta health es propuesta y debe ajustarse al contrato final. Validar Caddy puede necesitar acceder a archivos/variables; su resultado correcto no confirma DNS, certificados emitidos ni upstream sano. Para cambios: guardar Caddyfile anterior e inventario DNS/reglas, validar el candidato, recargar y comprobar. [CLI Caddy](https://caddyserver.com/docs/command-line).

~~~sh
docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile
~~~

Criterios de aceptación:

1. Zona/registro/email y DNSSEC correctos; resolución desde al menos dos redes; IPv6 funcional si está publicado.
2. Web canónica y redirección www preservan ruta/query; HTTPS de borde y origen válido, sin loop ni 526; certificados/estado sobreviven a recreación del contenedor.
3. Router `/api/v1` llega a Laravel sin quitar prefijo, cookies web con atributos correctos y allowlists OAuth/CORS/App Links coordinadas. [Auth](14-autenticacion.md), [frontend](08-frontend.md).
4. No hay respuesta privada reutilizada entre usuarios; repetidas llamadas a `/me`, pedido/QR y puntos no devuelven HIT. Static público conserva política esperada y su purga/borrado funciona.
5. Webhooks de prueba Stripe/Resend alcanzan Laravel sin HTML de challenge, conservan cuerpo original y firma; falsificados se rechazan; duplicados no duplican cambios económicos.
6. Eventos sobreviven a reconexión y no muestran pedidos ajenos. Upload malformado no se publica. Cabeceras de IP falsificadas en conexión directa no alteran identidad/rate limits.
7. Puertos internos no son accesibles desde otra red; firewall IPv4/IPv6 y contenedores verificados; renovar certificado con la topología final funciona o se prueba emisión equivalente en entorno aislado sin forzar producción repetidamente.

Rollback: restaurar Caddyfile/reglas/DNS anteriores y validar/recargar. No borrar `/data`, volúmenes ni certificados. Para pasar a DNS only, primero comprobar certificado público válido en origen y abrir de forma controlada el acceso que antes se limitaba a Cloudflare; si solo se eligió Origin CA, recuperar un certificado público antes. HSTS y DNS cacheados pueden impedir recuperación inmediata: no resolver fallos bajando a HTTP o Flexible. En problemas de DNSSEC corregir estado/DS con el flujo del registrador; no desactivarlo sin entender la cadena y conservar evidencia.

## Pendiente antes de publicar

- Dominio/TLD definitivo, titular, precio final y renovación.
- Inventario/capacidad del servidor doméstico, ISP/WAN/CGNAT y entorno de staging separado; IPv6 real.
- Plan Cloudflare y aprobación del proxy/CDN; reglas exactas permitidas y responsable operativo.
- HTTP-01 estándar frente a DNS-01 y cierre del origen; emisor/cadena, CAA y posible mTLS.
- Host canónico, uso de `assets`, staging y lista de orígenes/retornos OAuth/App Links.
- Buzón de soporte/reply-to y configuración Resend generada, sin inventar registros ni credenciales.
- Política HSTS final, tiempos/retención de logs, recuperación y responsables.

Comprar/publicar/configurar recursos reales será una tarea posterior con los valores definitivos y el alcance correspondiente. Esta guía deja el trabajo preparado y revisable sin afirmar su ejecución.

## Coordinación con SEO/editores U08

El prompt indica foodtrucks.com como dominio de referencia. Antes de adoptarlo en producción verificar propiedad/control y disponibilidad para la compra prevista; no se ha hecho aquí. dominio.example sigue siendo marcador en los ejemplos hasta ese cierre.

Configurar verificación Search Console con los registros exactos emitidos por la cuenta autorizada; no sustituir SPF/DKIM/DMARC o ACME. Permitir servir desde Next.js las rutas públicas robots.txt, sitemap, ads.txt, app-ads.txt y archivos de asociación de app cuando se implementen; evitar challenges, reescrituras o redirecciones que rompan sus verificadores. Mantener privados y staging protegidos/fuera del índice.

Cloudflare no debe cachear respuestas de consentimiento, compra, puntos, QR ni auth para todos los usuarios. Inventario de anuncios y CSP se revisan antes de modificar reglas; no desactivar protecciones globalmente para un SDK. [SEO](32-seo-local-nextjs.md), [editores](33-monetizacion-adsense-admob.md), [medición](34-analitica-consentimiento.md).

## Alcance de la receta directa después de U09

**La tabla A/AAAA, bootstrap HTTP-01, Full (strict), allowlist de IP Cloudflare y ejemplo Caddyfile anteriores corresponden al acceso directo con WAN pública.** Para Tunnel, los hostnames publicados apuntan al túnel nombrado de la cuenta, y Caddy recibe tráfico de cloudflared local: adaptar validación TLS, ACME y peer confiable conforme a [doc38](38-servidor-domestico.md). No mezclar A/AAAA directo y destino de túnel para el mismo hostname ni publicar una IP privada/CGNAT como origen accesible.

Full (strict) valida el tramo de proxy directo; no sustituye la validación cloudflared→Caddy. El HTTP local deliberado de la alternativa aislada del túnel no implica usar Flexible o desactivar TLS. La selección se toma tras verificar red/capacidad; ninguna configuración del paquete se ha aplicado al router o a Cloudflare.
