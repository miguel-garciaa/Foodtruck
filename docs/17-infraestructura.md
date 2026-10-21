# Infraestructura: servidor doméstico, VMware, Ubuntu y Compose

## Base cerrada y dimensionamiento

**Decisión vigente U09:** servidor en casa para desarrollo y producción, sustituyendo el VPS como base. Desarrollo/pruebas en VMware con Ubuntu Server 26.04, 4 vCPU, 8 GB RAM y 40 GB NVMe. Producción mantiene Ubuntu/Compose/Caddy, en entorno separado; hardware físico, recursos de PROD, red/ISP, energía y coste pendientes. [Diseño doméstico](38-servidor-domestico.md).

Los 40 GB son la elección de la VM, no una capacidad aprobada para todas las fotos y datos de producción. La conversación sugirió ampliar a 80 GB en desarrollo si hace falta y 100–160 GB como referencia de VPS; ambas son propuestas, no requisitos ni compras realizadas.

Ubuntu 26.04 figura como LTS en [notas oficiales](https://documentation.ubuntu.com/release-notes/26.04/). Instalar Docker desde su [documentación Ubuntu](https://docs.docker.com/engine/install/ubuntu/) y verificar compatibilidad de versión/arquitectura al preparar el entorno.

## Dónde se trabaja

| Ordenador anfitrión | VM Ubuntu |
| --- | --- |
| Editor, Node/TypeScript, Expo/Next.js | API y worker Go |
| Android Studio SDK/emulador | PostgreSQL/PostGIS y Redis |
| Navegador/Mapbox Studio | Compose y Caddy |
| MCP de 21st.dev | Fotos locales y pruebas backend |

No instalar emulador/Android Studio en la VM de 8 GB. Para iOS local se necesita macOS/Xcode; compilación remota es alternativa propuesta, pendiente de elegir.

Repositorio único con checkout local y/o Remote SSH de forma coherente. No editar dos copias sin Git. Que todo esté en monorepo no obliga a ejecutar todos los procesos en la misma máquina.

## Red de desarrollo

Bridged fue recomendado si la red lo permite; NAT con acceso/forwarding controlado es alternativa. Determinar IP y hostname reales antes de configurar.

El emulador se conecta a la IP accesible de la VM. 10.0.2.2 suele referirse al host del emulador, no a una VM independiente. No introducir IP de ejemplo como configuración real.

HTTPS para entornos compartidos y producción. HTTP de desarrollo, si se usa, solo en red de pruebas y variante debug; ninguna excepción TLS debe llegar a release. Para TLS local configurar confianza de certificados correctamente, sin desactivar verificaciones.

## Servicios Compose propuestos

Caddy, Next.js, API Go, worker Go, PostgreSQL con PostGIS y Redis. Imágenes con versiones fijadas, restart policy, healthchecks y límites adecuados. Ajustar logging para evitar llenar disco. Arranque de Compose no garantiza readiness; clientes reintentan con límites.

Separar servicios públicos de datos internos. Solo Caddy publica HTTP/HTTPS; SSH restringido a acceso administrativo. PostgreSQL, Redis y puertos de aplicaciones no se exponen a Internet.

Precaución: puertos publicados por Docker pueden interactuar con firewall del host. Verificar exposición desde otra máquina; no asumir que una regla UFW protege un puerto publicado.

## Caddy

Proxy inverso con rutas propuestas para web, API y medios; nombre del dominio pendiente. **La compra se hará en Cloudflare (U07)**, con DNS en Cloudflare. Proxy/CDN y plan son propuestas por definir. Certificados y estado de Caddy en almacenamiento persistente. HTTPS automático requiere requisitos DNS/red y configuración correctos. [Caddy HTTPS](https://caddyserver.com/docs/automatic-https).

No configurar listado de directorios de uploads, ni servir backups/configuración. Cabeceras de proxy solo desde Caddy confiable. Timeouts y límites de uploads coherentes entre proxy y Go.

## Persistencia y capacidad

Base de rutas propuesta, nombres aún no instalados:

~~~text
/srv/foodtrucks/
  uploads/public/
  uploads/private/
  postgres/
  caddy/
  backup-staging/
~~~

Volúmenes/bind mounts fuera del filesystem efímero. La API escribe uploads con usuario limitado; Caddy monta únicamente la parte pública en lectura.

En 40 GB vigilar SO, imágenes/caché de build, PostgreSQL/WAL, uploads, backups temporales y logs. Definir umbrales de disco y rotación antes de pruebas extensas. No ejecutar limpiezas de volúmenes para recuperar espacio.

## Disponibilidad

Un host implica punto único de fallo. Compose no ofrece alta disponibilidad ni sustituye backup. RPO/RTO, monitorización externa y planes de recuperación pendientes. No se ha instalado Ubuntu, Docker ni desplegado ningún servicio durante esta documentación.

## Configuración de Cloudflare y correo

[Guía Cloudflare](29-cloudflare-dominio-dns.md): registro del dominio, DNS por hostname, Full (strict) si se activa proxy, Caddy/ACME, bypass de caché privada, protección compatible con clientes móviles y webhooks, IP real, staging y pruebas/rollback. No añadir registros AAAA sin IPv6 operativo ni cerrar origen antes de verificar emisión y renovación de certificados.

[Guía Resend](30-correo-resend.md): API HTTPS saliente desde el worker y webhook entrante firmado. No hace falta SMTP/MTA propio en el servidor doméstico ni abrir puertos de correo para el envío HTTP de la aplicación. Las alertas de observabilidad pueden usar SMTP saliente Resend mediante su contrato específico, sin MTA local. Registros de correo copiados del panel y separados de web; credenciales del proveedor fuera de imágenes/frontend. Receiving no se activa por configurar el envío.

## Publicación doméstica y capacidad de observabilidad

Elegir Tunnel saliente o acceso directo mediante WAN pública/forwarding después de verificar ISP/CGNAT/IPv6. La receta directa de doc29 no se copia al túnel sin adaptar TLS y peer confiable. No exponer datos/exporters/hipervisor ni confundir localhost del contenedor con el host. DEV y PROD tienen credenciales, almacenamiento y redes propios; si comparten hardware, permanecen en el mismo dominio de fallo.

Grafana/Prometheus y Sentry se planifican por fases; modalidad y reserva de CPU/RAM/disco pendientes. Medir capacidad, retención, backup y efecto de builds sobre venta antes de publicar. [Servidor](38-servidor-domestico.md), [costes](37-costes-presupuesto.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md).
