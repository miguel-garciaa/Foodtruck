# Política de marketing digital, adquisición y monetización

**Versión:** 1.7 · **Fecha:** 13 de octubre de 2026. **Estado:** política documental para el desarrollo y la operación futura. Los 22 apartados de los requisitos de marketing aportados en U08 se integran aquí como objetivos, controles, procedimientos y pendientes. Sus instrucciones de ejecución se aplicarán al disponer del producto y del alcance autorizado; no acreditan una auditoría, una implementación o una activación.

Este documento gobierna marketing, SEO, descubrimiento local, ASO, medición y evaluación publicitaria. Las guías enlazadas contienen el detalle técnico y los ejemplos de implementación; no se duplican aquí. Ante una discrepancia, conservar las decisiones confirmadas del proyecto y resolver el punto en [decisiones pendientes](23-decisiones-pendientes.md) antes de publicar o activar la función afectada.

## Objetivos y decisiones vinculantes

Foodtrucks facilita descubrir vendedores, consultar sus menús y hacer pedidos para **recoger personalmente, sin reparto a domicilio**. Esta condición rige textos, campañas, fichas de tienda, metadatos y datos estructurados. Las prestaciones previstas se describen como propuestas hasta comprobarlas en código y en el entorno correspondiente.

| Objetivo | Resultado que se debe evaluar | Regla de medición |
| --- | --- | --- |
| Descubrimiento gastronómico útil | Búsqueda orgánica y visitas a oferta real por ciudad/categoría | Search Console y navegación consentida; no fabricar demanda ni páginas locales vacías |
| Activación de la oferta | Vendedores verificados con carta, ubicación y capacidad de recibir pedidos | Datos operativos de Laravel/PostgreSQL; un registro no equivale a un negocio activo |
| Conversión y recurrencia | Compras confirmadas, pedidos recogidos y repetición | Pagos y recogida autoritativos, deduplicados y conciliados; no usar impresiones como sustituto |
| Adquisición móvil | Instalaciones, primera apertura y uso que termina en pedido | Separar datos de tienda de eventos de la app; no equiparar descarga, apertura y compra |
| Monetización sostenible | Ingreso y contribución por fuente/ciudad, frente a impacto en conversión | Separar GMV de ingresos de plataforma y publicidad; comparar periodos y cohortes equivalentes |
| Calidad y confianza | Privacidad, accesibilidad, rendimiento y estabilidad de compra | Evidencia verificable antes/después; sin garantías de ranking, aprobación o ingresos |

Las metas numéricas de adquisición, conversión, retención y rentabilidad están **PENDIENTES**: se fijarán con una base real, una definición de cálculo y un periodo de observación. Calidad del producto y pedidos recogidos tienen prioridad sobre tráfico, instalaciones e impresiones publicitarias.

| Decisión que se conserva | Aplicación obligatoria en marketing |
| --- | --- |
| Next.js web; React Native + Expo + TypeScript móvil | Verificar versión y router en el repositorio. Expo Go solo permite comprobación parcial compatible; Mapbox, pagos, avisos y SDK nativos requieren development/native builds y pruebas propias. No acreditar esos flujos con Expo Go |
| Mapbox para web y app; PostgreSQL/PostGIS para datos propios | Google Maps Platform se evalúa solo si hay una necesidad justificada; no sustituir Mapbox ni añadir otro SDK automáticamente. Business Profile es un servicio distinto |
| Laravel/PHP, Eloquent y migraciones, auth propia, Redis justificado | Marketing no crea otro backend comercial, proveedor de identidad o plataforma genérica de eventos |
| Servidor en casa, Compose/Caddy, fotos locales y backups externos fuera del domicilio | Mantener este alojamiento; marketing no introduce S3, Supabase o Firestore para contenido, imágenes o autenticación |
| Cloudflare para dominio/DNS; Resend para correo | Dominio y comunicaciones siguen sus guías. Header en Next.js incluso en navegador móvil; dock solo en app nativa |
| Membresía cliente de **5,99 €/mes en EUR** | Importe confirmado; impuestos, beneficios, puntos y financiación pendientes. No prometer ahorro, equivalencias o plan sin anuncios no aprobados |
| Licencia inicial y mensualidad de comerciantes | Modelo confirmado; tarifas/condiciones y comisión por pedido pendientes. Evaluar otras fuentes sin convertirlas en condiciones comerciales |
| Google Ads para clientes y comerciantes | **400 al mes: PENDIENTE**, sin moneda, reparto ni gasto aprobados. Ninguna política de medición concede autorización de inversión |
| AdSense y AdMob | Evaluación y preparación separadas, desactivadas por defecto, sin identificadores de producción activados ni aprobación acreditada |
| GA4 web y Firebase Analytics móvil | Arquitectura solicitada; propiedades, proyectos, SDK, consentimiento e instrumentación pendientes. Firebase no sustituye auth propia |
| Dominio de referencia `foodtrucks.com` | Titularidad, compra, control DNS y adopción como producción no verificados. No auditar ni configurar ese sitio como si fuera del proyecto |

[Producto](01-producto-mvp.md), [frontend](08-frontend.md), [Mapbox](12-mapbox.md), [servidor doméstico](38-servidor-domestico.md), [dominio](29-cloudflare-dominio-dns.md), [membresía](25-suscripcion-clientes-fidelizacion.md) y [correo](30-correo-resend.md) concretan estas decisiones.

## Responsabilidades propuestas

Son **roles propuestos, sin asignaciones personales confirmadas**. Una misma función puede cubrir varios roles; no se presume que exista un equipo contratado. Antes de ejecutar una fase, registrar qué rol la realiza y qué rol ejerce su revisión conforme a la organización que se acuerde.

| Rol propuesto | Responsabilidad y evidencia de revisión |
| --- | --- |
| Producto y operación comercial | Validar oferta, ciudades, funciones disponibles, instrucciones de recogida y criterios de publicación/activación de vendedores |
| Marketing y edición | Investigar intención de búsqueda, preparar contenidos/ASO/campañas, verificar afirmaciones y derechos, conservar fuentes y fechas de revisión |
| Desarrollo web y móvil | Adaptar SEO, enlaces, rendimiento, interfaces y SDK a versiones reales; entregar pruebas y cambios reversibles |
| Backend y datos | Aplicar publicación, autorización, precios y eventos autoritativos; deduplicación, frescura y conciliación de pedidos/pagos/recogida |
| Infraestructura y administración de cuentas | Acreditar control del dominio, separar entornos, proteger accesos/secretos, configurar cuentas y apagado de canales cuando esté autorizado |
| Privacidad y revisión legal especializada | Revisar países/públicos, bases/finalidades, CMP/TCF/UMP/ATT, retención y textos legales; sin certificación de cumplimiento por esta documentación |
| Analítica y control económico | Definir métricas y ventanas, validar cobertura/atribución, separar ingresos, costes y GMV y revisar viabilidad del piloto |
| QA y revisión de calidad | Comprobar aceptación funcional, autorización, privacidad, accesibilidad, rendimiento y ausencia de regresiones en flujos críticos |

## Controles obligatorios por área

| Área | Política y control previo a publicación o activación | Detalle operativo |
| --- | --- | --- |
| Veracidad y publicación | Usar negocios, menús, precios, horarios, ubicación y disponibilidad verificados; conservar fuente, vigencia y revisión. Prohibidas reseñas, experiencias, cifras y funciones inventadas | [SEO local](32-seo-local-nextjs.md), [editorial/ASO](35-aso-contenidos-roadmap-90-dias.md) |
| SEO Next.js | Para cada página pública candidata: contenido principal accesible, title/description propios, canonical, robots, Open Graph/Twitter, idioma y assets existentes. Elegir CSR/SSR/SSG/ISR por ruta; no migrar router o todo el renderizado sin necesidad | [Rutas, metadatos y renderizado](32-seo-local-nextjs.md) |
| Indexación y privacidad | Sitemap solo con URLs publicadas, útiles, canónicas y 200. Resolver filtros/paginación, cambios de slug, baja y cierres temporales con estados correctos. Cuenta, carrito, pagos, pedidos, QR y paneles fuera del índice y protegidos por autorización; robots no es seguridad | [Matriz SEO](32-seo-local-nextjs.md), [seguridad](19-seguridad.md) |
| Ciudades, fichas y menús | Publicar una página local solo con oferta suficiente y contenido propio; umbral pendiente. Mostrar datos vigentes, alérgenos declarados, recogida y preparación solo cuando exista cálculo fiable. Evitar duplicados por variantes o ubicaciones y mantener slugs estables | [Publicación y frescura](32-seo-local-nextjs.md) |
| Geografía y Business Profile | Permiso de ubicación al necesitarlo, alternativa manual y contenido indexable independiente del GPS. Distinguir posición vigente de habitual. Comprobar elegibilidad y autorización del vendedor para su perfil; el alta en Foodtrucks no crea presencia automática en Google Maps | [Mapbox](12-mapbox.md), [estrategia local](32-seo-local-nextjs.md) |
| Datos estructurados | Elegir tipos Schema.org según entidad/contenido real, representar ubicación móvil correctamente y mantener JSON-LD coherente con lo visible. Validar página renderizada y funciones admitidas por Google; semántica válida no garantiza rich results | [JSON-LD y validación](32-seo-local-nextjs.md) |
| ASO y web hacia app | Textos, categoría, icono, capturas, vídeo e idiomas deben describir el binario disponible. Verificar reglas actuales de cada tienda, IDs y plataformas; App Links/Universal Links con archivos de asociación, fallback web y autorización de rutas privadas. No usar servicios de enlaces retirados | [ASO y enlaces](35-aso-contenidos-roadmap-90-dias.md), [frontend](08-frontend.md) |
| AdSense y AdMob | Evaluar cada superficie y cada producto por separado. Mantener anuncios fuera de mapa accionable, menú/precios/alérgenos, compra, pago, pedido/QR, auth y paneles. Prohibidos clics incentivados/accidentales y apariencia de control de compra. Elegibilidad, configuración oficial, archivos ads.txt/app-ads.txt, pruebas y permiso de activación son requisitos distintos | [Inventario, SDK y criterios](33-monetizacion-adsense-admob.md) |
| Consentimiento publicitario | Analítica, publicidad, personalización, email, push y geolocalización tienen finalidades separadas. Bloqueo inicial; aceptación granular, rechazo y retirada accesibles; error/estado desconocido mantiene la función no esencial desactivada. Evaluar CMP certificada/TCF, UMP y ATT según territorio, producto y comportamiento real | [Consentimiento](34-analitica-consentimiento.md), [editores](33-monetizacion-adsense-admob.md) |
| Google Ads | Separar públicos cliente/comerciante, intención, landings, geografía, conversiones y atribución. Antes del gasto: oferta operativa, destino funcional, conversiones verificadas, presupuesto y criterios de revisión aprobados. No fijar CPC/CPA/ROAS ni escalado con cifras inventadas | [Captación B2C/B2B](27-marketing-google-ads.md) |
| GA4/Firebase/Search Console | Diccionario versionado, parámetros permitidos, un emisor por hecho y eventos automáticos sin recrearlos. Mapear `select_product` a `select_item` cuando corresponda; pago confirmado y recogida son eventos distintos. No enviar nombres, emails, teléfonos, direcciones personales, GPS preciso, notas, tokens ni QR en eventos, URLs o campañas | [Diccionario, conciliación y dashboards](34-analitica-consentimiento.md) |
| Rendimiento y accesibilidad | Medir búsqueda, fichas y menús antes de cambiar. Controlar JS, imágenes/fuentes, mapas, publicidad, consultas/peticiones, caché y componentes pesados. Mapa/anuncios no bloquean interfaz. Separar laboratorio de campo y métricas web de fluidez nativa | [SEO/CWV](32-seo-local-nextjs.md), [rendimiento](16-rendimiento.md) |
| Editorial y conversión | Cada pieza tiene utilidad, fuente/autoría, revisión, CTA real y objetivo de conversión. Calendario de 90 días condicionado a capacidad/oferta. Analizar embudos cliente y comerciante sin añadir pasos innecesarios al checkout ni presentar mejoras como existentes | [Contenido y embudos](35-aso-contenidos-roadmap-90-dias.md) |
| Economía y seguridad | Comparar comisiones, cuotas, herramientas premium, patrocinios, acuerdos y anuncios con margen y efecto en pedidos. Etiquetar patrocinio; separar fuentes. Cambios en auth/pagos/vendedores requieren análisis de impacto; secretos por entorno, mínimo privilegio y datos mínimos | [Modelo de ingresos](33-monetizacion-adsense-admob.md), [pagos](13-stripe.md), [seguridad](19-seguridad.md) |

Los controles locales de Foodtrucks pueden ser más conservadores que los mínimos de un proveedor. Las prohibiciones de páginas locales duplicadas/de poco valor se contrastan con las [políticas de Google Search](https://developers.google.com/search/docs/essentials/spam-policies); la elegibilidad presencial y propiedad de perfiles con [Google Business Profile](https://support.google.com/business/answer/13763036?hl=en); la ausencia de datos personales en URLs/eventos con [Analytics](https://support.google.com/analytics/answer/6366371?hl=en). Para publicidad personalizada en EEE, Reino Unido y Suiza, revisar la [CMP certificada y su plataforma](https://support.google.com/adsense/answer/13554116?hl=en-GB); la certificación no acredita cumplimiento legal definitivo. Fuentes comprobadas el **13 de octubre de 2026**, con nueva revisión obligatoria al implementar o lanzar.

## Procedimiento de auditoría, implementación y operación

1. **Delimitar producto y acceso.** Identificar repositorio/entorno/cuentas autorizados y dominio bajo control. Inventariar versiones Next.js/Expo/React Native, router, TypeScript/JavaScript real, dependencias/lockfiles, rutas, API, modelos de vendedores/productos/ubicaciones/pedidos, auth, pagos y geografía. Conservar configuraciones y lógica válidas; justificar cambios de dependencias o componentes.
2. **Obtener evidencia específica.** Revisar rutas públicas y privadas, HTML/estados, permisos, frescura, móvil, accesibilidad, rendimiento, enlaces, SDK/consentimiento y datos de cuentas disponibles. Cada hallazgo registra evidencia, prioridad P0/P1/P2, impacto y esfuerzo; lo no comprobable se marca desconocido o pendiente, nunca fallo confirmado.
3. **Preparar el cambio concreto.** Relacionar problema y objetivo; indicar archivos reales, solución compatible, datos/dependencias necesarios, alcance, pruebas y rollback. No publicar información ni introducir un servicio para cubrir un ejemplo documental. Explicar cambios importantes antes de ejecutarlos.
4. **Implementar y verificar por grupos.** Priorizar P0 del área afectada y después P1/P2. Ejecutar tests de comportamiento, permisos y errores pertinentes, formatter/lint/typecheck/build que existan en el repositorio. Registrar comandos/resultados efectivos; corregir fallos relevantes antes de cerrar. Sin acceso al código, mantener la entrega como especificación.
5. **Revisar el avance y su autorización.** Aplicar los criterios siguientes por función. La autorización documental no activa campañas, anuncios, cuentas, publicaciones de contenido/tienda, comunicaciones ni despliegues. Cuando esa ejecución esté autorizada, conservar evidencia del alcance, configuración y verificación posterior.
6. **Operar y aprender.** Revisar oferta/frescura, Search Console, embudos, cobertura analítica, gasto/ingresos, privacidad y rendimiento según la fase. Registrar periodo y decisión; detener el canal o cambio afectado ante problema confirmado de privacidad, estabilidad, colocación o conversión. Revertir con el procedimiento probado y validar la recuperación.

La cadencia de revisión se propone semanal durante un piloto activo y al cierre de cada fase; responsable, frecuencia definitiva y umbrales están pendientes. Un calendario no sustituye las condiciones de avance ni autoriza gasto. Las entregas técnicas siguen la [política de commits, CI/CD y tests](44-politica-commits-ci-cd-tests.md) y la [política DevOps](devops/README.md).

## Estado comprobado y prioridades pendientes

La revisión histórica inicial comprobó un paquete documental bajo `outputs/Foodtrucks`, sin `package.json`, `go.mod`, `app.json` o `next.config.*` del producto. No se aportaron accesos a Search Console, GA4/Firebase, tiendas ni cuentas de anunciantes/editores. Ese inventario es histórico: hoy existen Laravel/móvil y CI en este repositorio; consultar README y sus guías. La revisión documental inicial no acreditaba funciones ni defectos del producto.

| Comprobación | Resultado documental del 13 de octubre de 2026 |
| --- | --- |
| Estructura y arquitectura | Documentos de producto, frontend, API, datos y operaciones disponibles; runtime no inspeccionado |
| Versiones, router y dependencias | Desconocidos sin fuentes/lockfiles; no fijar por suposición |
| Expo Go y capacidades nativas | Decisión de flujo documentada; binarios/plugins y compatibilidad de SDK no comprobados |
| Pago, auth, geografía y recogida | Diseñados en el paquete; integración y tests de aplicación no ejecutados |
| SEO, CWV, perfiles, anuncios y eventos | Políticas y guías preparadas; sin auditoría de sitio, validación de cuenta, puntuaciones o resultados reales |
| Incorporación de requisitos de marketing | **22/22 apartados trazados** a políticas, procedimientos, aceptación o pendientes; no equivale a 22 funcionalidades implementadas |

P0 es condición previa a publicar/activar la función afectada; P1 prepara su primera entrega de calidad; P2 amplía después de medir. Son prioridades de implementación, **no hallazgos de errores existentes**. El esfuerzo es relativo, sin horas ni coste aprobados.

| Prioridad | Trabajo pendiente | Impacto/dependencia | Esfuerzo orientativo |
| --- | --- | --- | --- |
| P0 | Acceso al repositorio, inspección y control del dominio | Define producto, versiones y entorno que se puede intervenir | Bajo al disponer de acceso |
| P0 | Autoridad de pagos/recogida, privacidad y acceso a datos | Depende de API, contratos y MVP; condición del recorrido comercial | Alto |
| P0 | Consentimiento, separación de entornos y exclusión publicitaria de flujos críticos | Condición de medición/SDK/anuncios y de compra segura | Medio |
| P1 | SEO público, indexación, fichas/menús y frescura | Requiere router y oferta verificados | Medio |
| P1 | Rendimiento, accesibilidad, ASO y enlaces web/app | Requiere builds, rutas y base de medición | Medio |
| P1 | Instrumentación, conciliación y dashboards | Requiere eventos autoritativos, permisos y configuración | Medio/alto |
| P1 | Landings y calendario editorial útiles | Requiere funciones/oferta disponibles y revisión | Medio |
| P2 | Piloto Ads de clientes/comerciantes | Requiere destino, medición, mercado y presupuesto aprobados | Variable |
| P2 | Piloto AdSense/AdMob | Requiere elegibilidad, consentimiento, pruebas y evaluación de conversión | Variable |

## Aceptación y evidencia de cierre

| Entrega | Condiciones verificables para declararla terminada | Guía de detalle |
| --- | --- | --- |
| Auditoría y arquitectura | Repositorio/entorno/versiones reales, datos consultados y límites registrados; hallazgos P0/P1/P2 con evidencia y tabla impacto/esfuerzo | Procedimiento anterior y [arquitectura](07-arquitectura-monorepo.md) |
| SEO técnico y local | Matriz indexable/noindex validada, HTML/HTTP correctos, robots/sitemap/canonical coherentes, metadatos y JSON-LD con datos reales; privados autorizados, slugs/estados/frescura probados | [SEO Next.js](32-seo-local-nextjs.md) |
| Fichas, menús y ciudades | Fuente/vigencia y contenido útil comprobados; sin ciudades vacías, datos falsos ni precios obsoletos; pedido y punto de recogida verificables | [Publicación SEO](32-seo-local-nextjs.md) |
| ASO y web hacia app | Binarios/plataformas e IDs reales, textos/assets compatibles con tiendas, asociaciones/links y fallback probados en dispositivos, acceso privado protegido | [ASO](35-aso-contenidos-roadmap-90-dias.md), [frontend](08-frontend.md) |
| AdSense/AdMob | Inventario y formato admitidos, cuentas/estado del editor acreditados, archivos públicos correctos, IDs test, consentimiento/retirada/errores y ciclo de vida probados; apagado operativo | [Monetización](33-monetizacion-adsense-admob.md) |
| Analítica y conversiones | Eventos permitidos únicos, ningún dato prohibido, bloqueo inicial/retirada probados, entornos separados, pago/refund/recogida conciliados y cobertura explicada | [Analítica](34-analitica-consentimiento.md) |
| Calidad móvil/web | Base y resultado medidos con condiciones comparables, laboratorio/campo diferenciados, accesibilidad y flujo crítico sin regresiones; tests/checks pertinentes ejecutados | [SEO/CWV](32-seo-local-nextjs.md), [rendimiento](16-rendimiento.md) |
| Captación cliente/comerciante | Oferta y landings funcionales, objetivos/atribución verificados, presupuesto/mercado/periodo/criterios aprobados; resultados separados por público | [Google Ads](27-marketing-google-ads.md) |
| Editorial y roadmap | Contenido original verificado, derechos/fuentes/revisión, CTA real y fechas/roles acordados; avance por condiciones de cada ventana de 90 días | [Calendario y roadmap](35-aso-contenidos-roadmap-90-dias.md) |

El cierre de **esta versión documental** exige cobertura de los 22 requisitos, estados honestos, decisiones coherentes y enlaces internos válidos. El cierre de una **implementación** exige la evidencia de su fila y el registro de ruta exacta, problema, solución, dependencias justificadas, pruebas ejecutadas, resultado esperado/observado y rollback. No se han ejecutado builds, auditorías de runtime, pruebas de SDK/consentimiento ni campañas con esta actualización.

## Trazabilidad de los 22 requisitos de marketing

La numeración permite comprobar cobertura de la aportación original; cada fila expresa su efecto operativo y el pendiente correspondiente, sin conservar una copia independiente de sus instrucciones.

| Nº / área de requisito | Política, procedimiento o aceptación incorporados | Ejecución/decisión pendiente y referencia |
| --- | --- | --- |
| 1 · Identidad y objetivos | Recogida sin reparto, funciones veraces y objetivos vinculados a pedidos/oferta/rentabilidad | Metas, mercado y dominio; decisiones vinculantes de este documento |
| 2 · Forma de trabajo | Inventario real, conservación de lógica/configuración, cambios compatibles, pruebas por grupos y registro de evidencia | Acceso al repositorio; procedimiento anterior y [AGENTS](../AGENTS.md) |
| 3 · SEO de Next.js | Metadatos, robots/sitemap, estados/indexación, filtros/paginación y render según ruta | Router/versiones y generación efectiva; [guía SEO](32-seo-local-nextjs.md) |
| 4 · Arquitectura local | Rutas útiles, ciudades con oferta comprobada y descubrimiento independiente del GPS | Ciudad/umbral editorial y datos; [rutas y geografía](32-seo-local-nextjs.md) |
| 5 · Fichas de vendedores | Datos públicos verificados, carta/recogida, preparación fiable, slugs estables y política ante contenido insuficiente | Criterio de publicación y baja; [fichas](32-seo-local-nextjs.md) |
| 6 · Schema.org | Tipos adecuados, contenido visible coherente, ubicación real y validación renderizada | JSON-LD y pruebas reales; [datos estructurados](32-seo-local-nextjs.md) |
| 7 · Maps y posicionamiento local | Mapbox conservado, evaluación de Google APIs con condiciones/coste y perfiles solo elegibles/autorizados | Necesidad de APIs/GBP y acceso; [SEO local](32-seo-local-nextjs.md), [Mapbox](12-mapbox.md) |
| 8 · Menús y productos | Contenido útil, sin URLs por variantes irrelevantes, duplicados o precios/disponibilidad obsoletos | Taxonomía y frescura; [catálogo SEO](32-seo-local-nextjs.md) |
| 9 · ASO y enlaces | Assets/textos reales, reglas por tienda, App Links/Universal Links y fallback autorizado | Builds, asociaciones, países/idiomas y publicación; [ASO](35-aso-contenidos-roadmap-90-dias.md) |
| 10 · AdSense web | Elegibilidad por superficie, configuración oficial/entorno, ads.txt, consentimiento y exclusiones de compra | Cuenta, revisión, integración/test y activación; [AdSense](33-monetizacion-adsense-admob.md) |
| 11 · AdMob nativo | Formatos seguros, SDK/build compatibles, IDs test, UMP, ciclo de vida, frecuencia y app-ads.txt | Caso de uso, build propia y piloto; [AdMob](33-monetizacion-adsense-admob.md) |
| 12 · Google Ads | Estrategias independientes para clientes/vendedores, landings, keywords, geografía, conversiones y experimentos | Mercado, datos y **400 al mes pendiente**; [captación](27-marketing-google-ads.md) |
| 13 · GA4/Firebase/Search Console | Diccionario con todos los eventos requeridos, mapeos GA4, autoridad/deduplicación, métricas y dashboards por rol | Proyectos/SDK, retención, cobertura y eventos reales; [medición](34-analitica-consentimiento.md) |
| 14 · Rendimiento | Medir CWV, JS, imágenes/fuentes, mapas/anuncios, datos/caché y diferencias laboratorio/campo | Base y optimización verificadas; [CWV](32-seo-local-nextjs.md), [rendimiento](16-rendimiento.md) |
| 15 · Contenido original | Calendario inicial de 90 días, utilidad, fuentes/derechos, CTA y prohibición de experiencias/listas falsas | Capacidad, revisión y publicación; [editorial](35-aso-contenidos-roadmap-90-dias.md) |
| 16 · Conversión y crecimiento | Embudos cliente/comerciante, análisis de abandono, accesibilidad/confianza y checkout simple | Oferta, flujos y datos de conversión; [embudos](35-aso-contenidos-roadmap-90-dias.md), [analítica](34-analitica-consentimiento.md) |
| 17 · Privacidad y seguridad | Finalidades separadas, permisos/retirada, datos mínimos, auth/pedidos protegidos, revisión legal y móvil | Territorios, CMP/TCF/ATT, retención y textos; [consentimiento](34-analitica-consentimiento.md), [seguridad](19-seguridad.md) |
| 18 · Modelo de negocio | Comparar cuotas, comisión, premium, patrocinio, anuncios y acuerdos por margen/retención/ciudad sin perjudicar pedidos | Tarifas, beneficios y viabilidad; [ingresos](33-monetizacion-adsense-admob.md), [membresía](25-suscripcion-clientes-fidelizacion.md) |
| 19 · Fases de 90 días | Avance por dependencias/aceptación, ajustado al producto real y coordinado con hitos | Inicio/roles/recursos y calendario; [roadmap de marketing](35-aso-contenidos-roadmap-90-dias.md), [hitos](22-roadmap.md) |
| 20 · Entregables | Matriz de aceptación cubre auditoría/prioridades, arquitectura, SEO/catálogo, ASO/enlaces, anuncios, analítica, rendimiento, captación, editorial y roadmap | Archivos reales, implementación y pruebas; matriz anterior y guías enlazadas |
| 21 · Calidad | Seguridad, mantenibilidad, accesibilidad, privacidad, compatibilidad, datos veraces, pruebas y reversibilidad; análisis antes de alterar lógica crítica | Verificación del producto; [AGENTS](../AGENTS.md), [entornos](21-entornos-ci-cd.md) |
| 22 · Inicio por auditoría | Primero inspección específica, después prioridades y arquitectura; cambios críticos verificados y avance por fases | Revisión documental realizada; auditoría específica y ejecución pendientes al recibir producto/acceso |

## Decisiones pendientes y condiciones para avanzar

Estos puntos deben cerrarse en el [registro de decisiones](23-decisiones-pendientes.md); la tabla identifica la condición, sin crear aprobaciones ni resultados ficticios.

| Pendiente | Rol propuesto para prepararlo | Condición de cierre |
| --- | --- | --- |
| Repositorio, versiones/router y alcance de compra web del MVP | Desarrollo + producto | Inventario real y flujo disponible acreditados |
| Dominio/origen, identidad legal, soporte, cuentas y accesos | Infraestructura + administración de cuentas | Control y permisos verificables, sin adoptar un dominio ajeno |
| Ciudad/país/idiomas, oferta mínima y reglas de publicación/suspensión | Producto + operación + marketing | Criterio documentado y datos vigentes de oferta |
| Taxonomía, slugs, render y propagación de cambios | Web + backend | Contratos y tiempos acordados, estados/invalidación probados |
| Builds móviles, plataformas, SDK y enlaces de asociación | Móvil + QA | Compatibilidad demostrada; límites Expo Go/build propia diferenciados |
| CMP, finalidad/base, público/edad, ATT, retención y política tras rechazo | Privacidad + desarrollo | Revisión especializada y pruebas antes de recoger/servir datos |
| Diccionario, primera compra/refunds, dashboards y atribución | Analítica + backend + control económico | Definiciones/ventanas, origen único y conciliación verificadas |
| Metas, presupuesto Ads, reparto, moneda y criterios del piloto | Marketing + control económico + producto | **400 al mes sigue PENDIENTE** hasta acuerdo explícito; destinos/oferta/medición listos |
| Elegibilidad, cuentas/IDs, inventario, formatos y frecuencia publicitarios | Marketing + privacidad + desarrollo | Revisión de proveedor y prueba aislada aceptadas; activación posterior autorizada |
| Impuestos/beneficios de membresía y tarifas/comisiones comerciales | Producto + control económico | Condiciones finales coherentes con 5,99 €/mes y modelo comercial confirmado |
| Calendario, revisión editorial, métricas base y cadencia | Marketing + producto + QA | Fuentes, roles, capacidad y condiciones de fase registradas |

No hay campañas activadas, anuncios reales servidos, sitio implementado, app publicada o resultados de marketing comprobados por este paquete. Esta política deja definidos los requisitos y el procedimiento para ejecutar y verificar esas entregas cuando proceda.
