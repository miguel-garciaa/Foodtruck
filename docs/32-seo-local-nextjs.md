# SEO técnico, SEO local y descubrimiento geográfico

**Estado:** especificación para desarrollar, incorporada a partir del prompt de marketing aportado por el usuario. No hay aplicación web, rutas, metadatos, sitemap, datos estructurados ni perfiles Google implementados o auditados en este paquete. La revisión actual es documental. Fuentes oficiales consultadas el 13 de octubre de 2026; volver a comprobar APIs y políticas al implementar.

Foodtrucks permite descubrir vendedores y pedir comida para **recoger personalmente en el puesto**. No hay reparto a domicilio. El dominio `foodtrucks.com` aparece como referencia en el prompt, pero no se ha verificado compra, control ni disponibilidad; los ejemplos usan `dominio.example`. Cloudflare sigue siendo la elección para adquirir y gestionar el dominio. Mapbox sigue siendo el mapa web/nativo elegido. [Frontend](08-frontend.md), [Mapbox](12-mapbox.md), [Cloudflare](29-cloudflare-dominio-dns.md).

## Inspección previa y adaptación a Next.js

Antes de implementar, inspeccionar el repositorio real: `package.json`, lockfile, configuración Next.js, carpeta `app`/`src/app` o `pages`/`src/pages`, TypeScript, convenciones de rutas, renderizado/caché, API Go, permisos y modelos publicados. TypeScript y Next.js están decididos; su versión y el router no están fijados. No migrar de router para añadir SEO ni instalar `next-seo`, `next-sitemap` o un CMS sin necesidad.

| Responsabilidad | App Router, si se confirma compatible | Pages Router, si es el existente |
| --- | --- | --- |
| Metadatos | `metadata`/`generateMetadata` desde el servidor | `next/head` con datos preparados por la página |
| Contenido público | Componentes de servidor; interacciones cliente acotadas | SSG/ISR o `getServerSideProps` según los datos |
| Robots y sitemap | Convenciones `robots.ts` y `sitemap.ts`, o archivo estático apropiado | Archivos públicos o generación servidor con las rutas reales |
| Ficha no encontrada | Mecanismo `notFound` compatible; verificar respuesta HTTP | `notFound`/página 404 compatible con su estrategia de datos |
| JSON-LD | Script JSON-LD con datos públicos saneados | Mismo principio, incorporado a la página renderizada |

La Metadata API pertenece al entorno servidor compatible de App Router; Pages Router mantiene su mecanismo `Head`. No mezclar ambas implementaciones para una misma ruta. [Metadatos Next.js](https://nextjs.org/docs/app/getting-started/metadata-and-og-images), [Head en Pages Router](https://nextjs.org/docs/pages/api-reference/components/head).

Las rutas de archivos indicadas abajo son **destinos futuros propuestos** bajo `apps/web`; deben adaptarse si el código utiliza `src`, otra organización o nombres distintos. No se han creado archivos ejecutables ni comprobado compilación.

## Matriz de rutas públicas y privadas

`Indexable` significa candidata a indexación cuando esté publicada, sea útil y cumpla el criterio de contenido. No garantiza que Google la indexe. Todas las rutas son propuestas; no crear una página solo porque figure en esta tabla.

| Ruta propuesta | Indexación prevista | Contenido/condición y render propuesto |
| --- | --- | --- |
| `/` | Indexable | Propuesta de valor real, recogida, accesos a oferta publicada; SSG/ISR |
| `/explorar` | Base pública indexable si tiene contenido útil; búsqueda personalizada noindex | Listado HTML inicial y enlaces; mapa/ubicación en cliente |
| `/foodtrucks` | Indexable si aporta un directorio distinto | Listado navegable/paginado; si duplica `/explorar`, elegir una ruta y redirigir la otra |
| `/ciudades` | Indexable al existir oferta comprobada | Ciudades publicadas, con enlaces; sin catálogo de ciudades vacías |
| `/ciudades/[ciudad]` | Indexable con contenido suficiente | Vendedores reales, ubicaciones/horarios, explicación local útil; SSR/ISR |
| `/ciudades/[ciudad]/[tipo-comida]` | Condicional | Oferta y contenido local propios; evitar combinaciones automáticas vacías |
| `/foodtruck/[slug]` | Indexable para ficha completa publicada | Datos originales del negocio, recogida y ubicación vigente; SSR/ISR |
| `/foodtruck/[slug]/menu` | Condicional; canonical propio si es página completa | Carta real legible y enlazada; si solo duplica una pestaña, consolidar en ficha |
| `/categorias` | Indexable si facilita explorar oferta | Categorías existentes, descripción útil y enlaces |
| `/categorias/[categoria]` | Condicional | Vendedores/menús reales y contenido propio; filtros adicionales noindex |
| `/como-funciona` | Indexable | Descubrimiento, pago y recogida según funciones realmente disponibles |
| `/para-vendedores` | Indexable | Beneficios y condiciones confirmados; CTA de alta, sin ingresos garantizados |
| `/registrar-negocio` | Landing indexable si aporta contenido propio | Diferenciar de `/para-vendedores`; formulario interno/pasos de alta noindex |
| `/descargar-app` | Indexable cuando tenga contenido útil | Enlaces reales a tiendas únicamente al existir publicación |
| `/blog` | Indexable tras publicar artículos originales | Listado, temas y paginación rastreable; no lanzar un índice vacío |
| `/blog/[slug]` | Indexable para artículo publicado | Autoría verificable, fecha real, contenido original y enlaces útiles |
| `/ayuda` | Indexable para ayuda pública | Instrucciones de uso reales; casos privados del usuario autenticados/noindex |
| `/contacto` | Indexable | Contacto real de soporte; no publicar buzón ficticio |
| `/privacidad`, `/cookies`, `/terminos` | Indexables como base propuesta | Textos aprobados y accesibles; no incorporar datos de cuentas ni pedidos |
| `/login`, `/registro`, recuperación/verificación | Noindex | Pantallas de autenticación públicas; tokens excluidos de analítica y logs |
| Carrito, checkout y retornos de pago | Noindex | Datos/acciones de usuario; sin caché compartida ni sitemap |
| Cuenta, membresía/puntos personales, pedidos y QR | Noindex y autenticación/autorización | Identidad y permisos comprobados en Go, no solo en Next.js |
| Panel comerciante, administración y vistas previas | Noindex y acceso restringido | Borradores/gestión ajenos al índice; sin exposición de datos internos |
| Staging y desarrollo | Fuera de indexación y con acceso restringido | Proteger el entorno; robots/noindex son complementos, no control de acceso |

La arquitectura admite compra web, pero el alcance equivalente al móvil sigue pendiente en el MVP. Mientras no exista checkout web, una página pública podrá dirigir a la app publicada; no describir una compra web como disponible. Conservar **header web incluso en navegador móvil**; el dock pertenece solo a la app nativa.

## Canonical, filtros, paginación y estados del negocio

Elegir un origen HTTPS canónico, apex o `www`, tras adquirir el dominio. HTTP y host alternativo redirigen al elegido preservando ruta; evitar cadenas. Usar `WEB_ORIGIN` validado por servidor, nunca un `Host` recibido arbitrariamente, para canonical, sitemap, Open Graph y JSON-LD.

| Caso | Regla propuesta |
| --- | --- |
| URL pública única | Canonical a sí misma, sin parámetros de atribución |
| `utm_*`, click IDs y orden visual equivalente | Canonical a la URL limpia; conservar atribución permitida en medición |
| Filtros combinados, búsqueda libre, coordenadas/radio | Noindex; no crear enlaces que produzcan millones de variantes |
| Ciudad/categoría con intención útil y oferta propia | Ruta editorial aprobada, canonical propio, contenido real |
| Paginación pública con elementos distintos | URL estable por página, enlaces HTML y canonical propio por página |
| Negocio cerrado esta tarde o temporalmente sin pedidos | Mantener ficha útil con 200, informar estado real; no convertir en 404 por cada cierre |
| Negocio no publicado/borrador/restringido | No exponer información; resolver permiso/estado con la política backend |
| Cambio de nombre/slug | Slug estable por identidad; si cambia, redirección permanente de alias al actual |
| Eliminación definitiva sin sustituto equivalente | 404 o 410 real, retirado del sitemap; no redirigir todo al inicio |
| Caída transitoria de API | Error temporal controlado; no tratar timeout como negocio inexistente |

Un negocio suspendido comercialmente puede conservar información pública útil o retirarse según su causa y política: **decisión pendiente**, separada de aceptar pedidos. No utilizar un booleano `active` ambiguo para publicación, horarios, elegibilidad Stripe y baja definitiva.

La paginación necesita enlaces que el rastreador pueda seguir; un botón que solo revela elementos tras interacción no basta como vía de descubrimiento. Las páginas 2 y siguientes no deben apuntar todas a la primera mediante canonical si contienen elementos diferentes. [Paginación Google](https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading). Verificar códigos HTTP y evitar errores con contenido de 404 servido como éxito. [Estados HTTP Google](https://developers.google.com/crawling/docs/troubleshooting/http-status-codes).

## Robots.txt y sitemap: ejemplos documentales

Ejemplo mínimo de producción **por adaptar a las rutas publicadas**; no desplegado. No bloquear JS/CSS/fotos necesarias para renderizar páginas públicas. El bloqueo de API evita rastreo innecesario y no protege sus datos.

~~~text
User-agent: *
Disallow: /api/
Sitemap: https://dominio.example/sitemap.xml
~~~

Los caminos públicos no indexables reciben `noindex` mediante metadato o cabecera. No añadir simultáneamente un `Disallow` a una URL pública esperando que Google lea su `noindex`: necesita poder rastrearla para ver esa instrucción. Las rutas privadas conservan autenticación/autorización aunque se añada robots. Robots.txt no es una herramienta para guardar secretos. [Robots Google](https://developers.google.com/search/docs/crawling-indexing/robots/intro), [Uso de noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

Ejemplo sintáctico de sitemap con una sola ruta ilustrativa. No inventar `lastmod`, prioridades ni frecuencias. Sustituir el dominio y enumerar únicamente páginas reales, canónicas, indexables, publicadas y con respuesta 200.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://dominio.example/</loc>
  </url>
</urlset>
~~~

Usar una fecha de modificación relevante del contenido cuando sea conocida; no asignar la hora de cada petición a todas las entradas. Añadir fichas/ciudades/artículos con el mismo criterio de publicación empleado por sus páginas. Eliminar privadas, redirects, borradores, filtros, 404 y noindex. Escapar caracteres XML y URLs. Separar sitemaps por tipo/tamaño solo si el volumen lo requiere; Google documenta el límite de 50.000 URLs y 50 MB sin comprimir por sitemap. [Sitemaps Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

En App Router, futuros archivos `apps/web/app/robots.ts` y `apps/web/app/sitemap.ts` pueden generar estos recursos con las convenciones compatibles. En Pages Router, valorar `apps/web/public/robots.txt` y generación de XML desde servidor o build existente. No crear dos productores para `/sitemap.xml`. Revisar caché/revalidación y firma de funciones para la versión real. [Robots Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots), [Sitemap Next.js](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap).

## Metadatos por tipo de página

Preparar un objeto por página con title y description únicos, canonical, robots, Open Graph, Twitter Card, idioma, favicon y referencia social optimizada. El diseño de las imágenes sociales queda por producir; no apuntar a un archivo inexistente.

| Página | Patrón orientativo con datos verificados |
| --- | --- |
| Inicio | `Foodtrucks \| Descubre comida local para recoger` |
| Ciudad | `Food trucks en {ciudad} \| Comida para recoger \| Foodtrucks` |
| Ciudad + categoría | `{tipo de comida} para recoger en {ciudad} \| Foodtrucks` |
| Vendedor | `{nombre comercial} \| Menú y recogida \| Foodtrucks` |
| Menú | `Menú de {nombre comercial} \| Foodtrucks` |
| Vendedores | `Recibe pedidos para recoger con Foodtrucks`, únicamente al existir ese flujo |
| Descarga | `Foodtrucks para iOS y Android`, únicamente al publicar ambas versiones |

Son propuestas de texto, sin demanda de keywords confirmada ni garantía de ranking. No duplicar marca si el layout aplica una plantilla de title. Las descripciones deben resumir contenido real: ubicación publicada, comida ofrecida e instrucciones de recogida. Evitar insertar precios, promociones u horarios en la descripción si no puede mantenerse su vigencia. No añadir «abierto ahora», «mejor», «envío» ni cifras de clientes sin evidencia adecuada.

Ejemplo documental del resultado esperado, con marcadores no publicables:

~~~html
<title>{{TITULO_VERIFICADO}}</title>
<meta name="description" content="{{DESCRIPCION_VERIFICADA}}">
<link rel="canonical" href="{{URL_CANONICA_PUBLICA}}">
<meta name="robots" content="index, follow">
<meta property="og:title" content="{{TITULO_VERIFICADO}}">
<meta property="og:description" content="{{DESCRIPCION_VERIFICADA}}">
<meta property="og:url" content="{{URL_CANONICA_PUBLICA}}">
<meta property="og:type" content="website">
<meta property="og:image" content="{{URL_IMAGEN_SOCIAL_PUBLICADA}}">
<meta name="twitter:card" content="summary_large_image">
~~~

Generar/escapar los atributos con el framework, no concatenando HTML aportado por comerciantes. Definir `<html lang="es">` para contenido en español; usar la variante regional solo si se confirma el mercado. `hreflang` se añade cuando existan versiones traducidas completas y URLs propias, con referencias recíprocas; no crear alternates hacia idiomas que no están publicados. Favicons/imagen social y nombres legales quedan pendientes.

## Datos públicos, renderizado y frescura

Go conserva autoridad sobre publicación y comercio. Los modelos [PostgreSQL/PostGIS](10-datos-postgresql-postgis.md) y la [API](20-api.md) son propuestas; las necesidades SEO añaden una **vista pública acotada**, sin duplicar un segundo backend comercial en Next.js.

| Necesidad | Contrato futuro propuesto, bajo `/api/v1` |
| --- | --- |
| Resolver ficha canónica | Ampliar `GET /foodtrucks/{id}` y/o añadir resolución por slug a ID; devolver slug actual y alias permitido |
| Carta pública | `GET /foodtrucks/{id}/products`: productos publicados, precios/moneda actuales, alérgenos declarados y versión |
| Listado local | `GET /foodtrucks` con ciudad/categoría/bbox acotados y paginación; no consultar todos los negocios para cada página |
| Sitemap | Consulta interna de IDs/slugs públicos y modificación relevante, paginada; excluir datos privados |
| Ciudades y categorías | Taxonomía aprobada y oferta publicada; contrato/nombres de endpoint por cerrar |

Campos propuestos: ID público, slug, nombre/descripcion editorial, fotos públicas, categorías, publicación, zona, ubicación operativa con vigencia/fecha de verificación, ubicación habitual diferenciada, horarios/zona IANA/excepciones, aceptación de pedidos y `content_version`. No exponer domicilio particular oculto, IDs Stripe, miembros, pagos, QR, tokens o datos de clientes. El modelo de alias y la fecha de última edición pública requiere diseño/migración al implementar.

La ficha y la carta deben ofrecer texto, precios válidos y enlaces en el HTML servido/renderizado, sin depender del permiso GPS, de iniciar sesión o de abrir el mapa. Reservar Mapbox, filtros/gestos, carrito y consultas personalizadas para el cliente. Landing/ayuda/blog pueden ser estáticos o ISR; fichas/menús requieren SSR o ISR con invalidación. No convertir paneles privados a SSR por razones de SEO.

Base propuesta de frescura: tras una transacción de producto, ubicación, horario o publicación, la outbox informa al proceso encargado de invalidar Redis y las páginas/metadatos/JSON-LD/sitemaps afectados de Next.js. Autenticar la revalidación interna, limitar destinos y evitar secrets en query strings. TTL y tiempo máximo de propagación siguen pendientes; comprobar comportamiento ISR y fallo de regeneración en la versión desplegada. [ISR Next.js](https://nextjs.org/docs/app/guides/incremental-static-regeneration).

No cachear respuestas personalizadas ni pedido/checkout. El precio visible, el schema y la carta proceden de una misma versión pública. Si no puede acreditarse precio/vigencia, omitir Offer en vez de publicar datos obsoletos. La interfaz actualiza disponibilidad al interactuar; **Go revalida precio, productos, descuento y lugar de recogida antes de confirmar/pagar**, aunque una página pública se haya generado hace unos minutos. [Caché e invalidación](11-redis-cache.md).

## Fichas, menús y páginas locales útiles

Una ficha publicable contiene nombre comercial verificado, descripción original, tipo de comida, imágenes autorizadas, ubicación pública de recogida, horarios cuando existan, carta, alérgenos declarados y estado de pedidos. Tiempo estimado de preparación solo si existe un cálculo fiable; sin reseñas, ventas ni precios ficticios. La carta necesita contenido HTML propio si tendrá URL separada; no crear una URL por salsa/tamaño/variante irrelevante.

La identidad del vendedor mantiene un slug estable aunque cambie la ubicación del camión. Mostrar el punto actual **y su fecha/vigencia**, separándolo del habitual. Una posición vencida no debe parecer el lugar vigente de recogida; ofrecer información útil y desactivar pedido si no hay punto operativo verificado. El pedido pagado mantiene la instantánea del lugar acordado.

Publicar una ciudad/categoría local solo tras comprobar oferta suficiente y contenido útil. El umbral concreto se decide con producto; no se impone una cifra inventada de vendedores. Incluir vendedores/menús, lugares reales, horarios disponibles, instrucciones útiles y enlaces a fichas, categorías y ciudades relacionadas. No copiar el mismo texto cambiando «Madrid» por «Barcelona», publicar listas no verificadas ni inventar experiencias personales. Las páginas vacías permanecen sin publicar; páginas ya útiles con cierres temporales requieren evaluación de contenido, no eliminación automática. [Política Google sobre doorway y contenido masivo](https://developers.google.com/search/docs/essentials/spam-policies).

Las búsquedas «food trucks en Madrid», «tacos para llevar» y «hamburguesas para recoger cerca de mí» son hipótesis del prompt para investigar; la ciudad piloto, el volumen y la competencia no están confirmados. Vincular cada intención a una página útil antes de multiplicar URLs. Para geolocalización: pedir permiso al necesitarlo, permitir búsqueda manual, indicar distancia aproximada y no enviar coordenadas personales en canonical/metadatos/analítica. No crear páginas SEO por cada coordenada del usuario.

## JSON-LD: semántica, seguridad y validación

| Tipo | Uso propuesto y requisito |
| --- | --- |
| `Organization`, `WebSite` | Identidad real de Foodtrucks y origen adquirido; no una dirección ficticia para la plataforma |
| `BreadcrumbList` | Jerarquía visible de la página y URLs publicadas |
| `Restaurant`/`LocalBusiness` | Vendedor que corresponda al tipo, con datos reales públicos; no asumir que todo puesto tiene local permanente |
| `Menu`, `MenuItem` | Carta visible y productos reales, con categorías/relación pertinentes |
| `Offer` | Precio, moneda, condiciones y disponibilidad vigentes verificadas; no inventar promociones |
| `Product` | Solo si representa un producto real y su página/contenido lo justifica; no convertir cada variante en landing |
| `SoftwareApplication`/`MobileApplication` | Aplicación publicada con datos reales; enlaces de tienda, precio y ratings solo si están acreditados |

Schema.org describe entidades; los requisitos de Google para una función enriquecida son distintos. `Menu`/`MenuItem` no implican un resultado enriquecido específico. El requisito `address` de Google para LocalBusiness no se satisface inventando un domicilio o sustituyéndolo por una ciudad; si no puede publicarse una dirección correcta, no prometer elegibilidad para esa función. [Menu en Schema.org](https://schema.org/Menu), [LocalBusiness Google](https://developers.google.com/search/docs/appearance/structured-data/local-business).

Ejemplo JSON-LD **mínimo documental**, sin vendedor, dirección, horario, oferta ni valoraciones fabricadas. El nombre del proyecto está confirmado; las URLs se sustituyen únicamente tras adquirir y validar el origen:

~~~json
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dominio.example/#organization",
      "name": "Foodtrucks",
      "url": "https://dominio.example/"
    },
    {
      "@type": "WebSite",
      "@id": "https://dominio.example/#website",
      "name": "Foodtrucks",
      "url": "https://dominio.example/",
      "publisher": { "@id": "https://dominio.example/#organization" }
    }
  ]
}
~~~

Para fichas móviles, no presentar una ubicación temporal como sede permanente ni publicar un domicilio particular; añadir información espacial/horarios solo cuando corresponda y esté vigente en la página. No importar fotos/ratings de Google Maps como shortcut ni añadir `aggregateRating` sin un sistema real de reseñas, su origen, permiso y revisión de la política.

Crear JSON-LD a partir de una allowlist de campos del DTO público, no del objeto completo enviado por un comerciante. Al insertarlo en un `<script>`, `JSON.stringify` por sí solo no elimina una secuencia de cierre de script. Una medida documentada por Next.js es escapar `<` antes de la inserción. Ejemplo documental, para adaptar y probar:

~~~ts
const jsonLdText = JSON.stringify(publicStructuredData)
  .replace(/</g, '\\u003c');
~~~

Además validar tipos, tamaños y URLs HTTPS permitidas, mantener contenido visible consistente y comprobar la integración CSP. No hace falta añadir una dependencia solo para este ejemplo. [JSON-LD Next.js](https://nextjs.org/docs/app/guides/json-ld).

Validar la página renderizada con [Schema Markup Validator](https://validator.schema.org/) para vocabulario y [Rich Results Test](https://search.google.com/test/rich-results) para funciones admitidas por Google. Revisar las diferencias entre requisito, aviso y tipo no soportado. Un extractor que elimina scripts no demuestra ausencia de JSON-LD. Tras despliegue autorizado, comprobar URL Inspection y correspondencia con el contenido vigente. Validación correcta no garantiza enriquecidos, ranking ni posición en Maps. [Políticas de datos estructurados Google](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

## Search Console y Cloudflare

Una vez comprado/controlado el dominio, el propietario crea una propiedad de dominio en Search Console y obtiene su TXT de verificación. Añadir **el valor real generado por Google** en Cloudflare DNS, verificar resolución y completar la comprobación; no copiar un token ficticio de esta documentación. La verificación por DNS es pública y no debe confundirse con una API key privada. Mantener el registro para conservar la verificación, acceso nominal mínimo y recuperación de cuenta. [Verificación Search Console](https://support.google.com/webmasters/answer/9008080?hl=es).

Enviar el sitemap canónico publicado, inspeccionar una muestra por tipo de ruta, comprobar canonical elegido/indexación, respuestas HTTP y render. Revisar informes de consultas/páginas por ciudad, marca/no marca, dispositivo y país. No interpretar la ausencia inicial de datos como una medición de cero tráfico; existen retrasos/umbrales y no hay propiedad conectada hoy. TXT, TLS/redirects y exclusiones de caché se coordinan con [Cloudflare](29-cloudflare-dominio-dns.md); Search Console no requiere instalar Google Workspace ni cambiar Resend.

## Google Maps Platform y Google Business Profile

Son servicios separados. **Google Maps Platform** ofrece APIs/SDKs; **Google Business Profile** permite a un negocio elegible gestionar su presencia. Registrar un vendedor en Foodtrucks no crea una ficha ni garantiza aparición en Maps. La plataforma Foodtrucks online no debe inventar una sede local para obtener un perfil. El vendedor controla su propio perfil o concede permisos reales a un representante; no reclamar cuentas ajenas.

La elegibilidad general requiere contacto presencial durante los horarios declarados; negocios exclusivamente online no son elegibles. Para un food truck comprobar con su propietario la actividad, ubicación atendida, horarios, señalización y el tratamiento permitido de su modelo móvil. No asumir que moverse entre ferias permite crear una ficha por parada, ni utilizar un domicilio oculto como punto público. [Elegibilidad Google Business Profile](https://support.google.com/business/answer/13763036?hl=en), [Representación del negocio](https://support.google.com/business/answer/3038177).

Guía propuesta para vendedores elegibles: verificar identidad/categoría real, contacto, ubicación/horarios especiales, fotos propias y enlace a su ficha/carta Foodtrucks publicada. Resolver duplicados y cambios con el flujo de Google, sin nombres cargados de keywords. Opiniones auténticas y solicitud neutral sin incentivos, filtrado de clientes satisfechos ni reseñas inventadas. La captación de opiniones será una acción posterior autorizada; no equivale a prometer resultados locales.

Mapbox permanece en web y móvil; las coordenadas propias proceden de PostgreSQL/PostGIS. El análisis Google Maps Platform del prompt se mantiene como evaluación, **sin migración ni segundo SDK automático**. Si se propone geocodificación/Places Google, antes verificar API elegida, cuotas/coste vigente, condiciones regionales, almacenamiento y atribución. Los datos Places no se pueden tratar como datos propios cacheables sin límites; la política contiene restricciones de almacenamiento y presentación en mapas. No superponer resultados Google sobre Mapbox sin comprobar permiso del servicio/contrato. [Políticas Places](https://developers.google.com/maps/documentation/places/web-service/policies).

Para «Cómo llegar», una opción propuesta es un enlace externo a Google Maps/Apple Maps hacia el punto de recogida verificado, sin descargar datos Places ni incorporar otro mapa. Maps URLs admite apertura web/app sin API key; construir la URL con codificación estándar y coordenadas del destino, sin añadir origen GPS del cliente a logs/analítica. [Maps URLs Google](https://developers.google.com/maps/documentation/urls/get-started). En puestos móviles, el destino se obtiene de la ubicación vigente o de la instantánea del pedido, según la pantalla.

## Core Web Vitals y criterios de verificación

Objetivos web propuestos, medidos en el percentil 75 y separados móvil/escritorio: **LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1**. Son umbrales de referencia, no resultados obtenidos ni garantía de ranking. El objetivo nativo de 120 FPS se mide con instrumentos y teléfonos reales, no con Lighthouse. [Web Vitals Google](https://web.dev/articles/vitals), [Rendimiento nativo](16-rendimiento.md).

| Superficie | Trabajo propuesto | Evidencia futura |
| --- | --- | --- |
| Descubrimiento | HTML útil primero, mapa cliente diferido, filtros sin largas tareas JS | LCP/INP en entrada y uso del listado/mapa |
| Ficha/menú | Imágenes dimensionadas/responsive, no cargar toda la galería, datos sin waterfall | LCP/CLS, tamaño JS, peticiones y tiempos API |
| Shell web | Header accesible, fuentes limitadas, componentes cliente solo necesarios | Navegación/teclado, INP, waterfall |
| Publicidad futura | Espacio reservado, carga condicionada a permiso y emplazamiento | CLS/INP y conversión comparados con/sin anuncios |
| API/SSR/ISR | Consultas acotadas, métricas de origen e invalidación fiable | Latencia, caché, errores y desfase del contenido |

Laboratorio: build producción, navegador móvil emulado con condiciones documentadas, PageSpeed Insights/Lighthouse/DevTools, navegación y red lenta. Sirve para detectar causas, pero no acredita experiencia real de toda la audiencia. Campo: CrUX/Search Console cuando exista muestra suficiente y RUM con permisos/datos mínimos de la [arquitectura de analítica](34-analitica-consentimiento.md). Agrupar por plantilla sin registrar URLs privadas ni coordenadas. No afirmar «100 en Lighthouse» ni 120 FPS porque se haya configurado una biblioteca.

## Prioridades futuras, aceptación y pendientes

Estas filas son **requisitos de implementación**, no hallazgos de una web existente.

| Prioridad | Trabajo | Responsable propuesto | Aceptación futura |
| --- | --- | --- | --- |
| P0 antes de publicar | Origen controlado, HTTPS, privacidad/permiso y ausencia de indexación de pedidos/QR | Infraestructura + Go + web | Rutas privadas sin datos ajenos, secretos ni caché pública; staging restringido |
| P1 antes de captación | Fichas/carta HTML reales, metadatos, estados HTTP, canonical, robots/sitemap | Web + Go + producto | Muestra de rutas correcta, filtro fuera de sitemap, vendedor temporalmente cerrado sin 404 automático |
| P1 | Publicación y frescura coherente en página/schema/precio | Go + web | Edición/despublicación invalida destinos; checkout rechaza dato obsoleto |
| P1 | Search Console y Core Web Vitals | Propietario + web | Propiedad verificada y métricas registradas cuando haya datos, sin resultados inventados |
| P2 tras oferta local suficiente | Ciudades/categorías y fichas GBP elegibles | Producto + marketing + comerciantes | Evidencia local, sin páginas vacías ni perfiles ficticios |
| P2 | Schema adicional, contenidos y mejoras medidas | Web + marketing | Datos verificados/visibles y comparación de resultados, sin garantía de ranking |

Pruebas futuras de comportamiento: slug antiguo redirige una sola vez; negocio inexistente devuelve estado correcto; cierre temporal conserva ficha honesta; privado exige autorización; filtros noindex; sitemap excluye todo lo anterior; texto/JSON-LD coinciden; string malicioso no cierra el script; precio cambia coherentemente e importe final se valida en Go. Ejecutar lint/typecheck/build y tests reales del repositorio; no añadir comandos ficticios ni afirmar que están aprobados hoy.

Pendiente: dominio/origen real, versión/router Next.js, ciudad y umbral editorial de oferta, política pública de suspensión/baja, taxonomía y slugs, soporte/identidad legal, autoría y revisión de artículos, idioma/territorio, compra web MVP, TTL/propagación de caché, accesos Search Console/GBP y datos para la primera medición.

El [plan maestro de marketing](31-marketing-digital-maestro.md) registra el alcance del prompt y la fase inicial sin código. La captación pagada conserva [Google Ads](27-marketing-google-ads.md), y el [plan de 90 días](35-aso-contenidos-roadmap-90-dias.md) coordina contenidos, ASO y conexión web/app.
