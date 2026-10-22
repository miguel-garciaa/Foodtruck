# ASO, contenido y roadmap de marketing a 90 días

**Estado:** propuesta derivada de U08, previa al desarrollo y al lanzamiento. Ventana de 90 días relativa a una fecha de inicio aún pendiente; no es compromiso de entrega ni publicación. Ciudad/país/idiomas, oferta real, cuentas, recursos y presupuesto siguen pendientes. No hay app publicada, artículos publicados ni métricas Foodtrucks comprobadas en esta carpeta.

Prioridad: convertir descubrimiento en pedidos recogidos y comercios activos. Google Ads continúa como captación; AdSense/AdMob se evalúan como ingresos complementarios. Referencia de 400 al mes expresamente pendiente. La membresía cliente es 5,99 €/mes, con impuestos y beneficios por definir.

## ASO para Android e iOS

Antes de preparar la ficha final, inventariar bundle/package IDs, plataformas/builds realmente disponibles, zonas atendidas y funcionalidades demostrables. Cargar expo-overview y eas-app-stores cuando se aborde distribución; EAS no está contratado por este plan. Preparar assets de la app real, con claro/oscuro legibles y sin prometer prestaciones futuras.

| Campo | Android, referencia actual | iOS, referencia actual |
| --- | --- | --- |
| Nombre | Hasta 30 caracteres | Hasta 30 caracteres |
| Resumen | Descripción breve hasta 80 | Subtítulo hasta 30 |
| Descripción | Hasta 4.000 caracteres | Límites de la versión en App Store Connect; descripción basada en funciones reales |
| Palabras clave | Investigación aplicada de forma natural a textos | Campo de keywords hasta 100 caracteres, sin marcas ajenas ni términos irrelevantes |
| Promoción | Recursos y campañas compatibles con políticas | Texto promocional hasta 170 caracteres |
| Assets | Icono, capturas y vídeo cuando proceda | Icono, capturas y previews cuando proceda |

Los límites se consultaron el 13 de octubre de 2026 y deben revisarse al enviar la ficha. [Google Play: datos de ficha](https://support.google.com/googleplay/android-developer/answer/9859152?hl=en), [Apple: información de app](https://developer.apple.com/help/app-store-connect/reference/app-information/app-information), [Apple: página de producto](https://developer.apple.com/app-store/product-page/).

Hipótesis de investigación: food trucks, comida para recoger, puestos de comida, comida callejera y descubrimiento gastronómico local. No representan volúmenes comprobados ni garantía de ranking. Estudiar consultas reales, país/idioma y términos que describan el producto; no rellenar keywords o nombre con listas de ciudades sin cobertura.

Borradores para la futura app funcional, sujetos a validación antes de publicar:

| Variante | Nombre | Mensaje breve |
| --- | --- | --- |
| A: descubrimiento | Foodtrucks | Encuentra puestos de comida, consulta su menú y recoge tu pedido |
| B: propuesta local | Foodtrucks: comida local | Consulta menús de puestos cercanos y pide para recoger |

Los mensajes encajan dentro de la referencia Android de 80 caracteres. Subtítulo iOS propuesto: «Comida local para recoger». Estos textos no son anuncios RSA ni fichas publicadas. Solo se activan cuando esos flujos, puestos y plataformas existen. Evitar «entrega a domicilio», «el mejor», posiciones en rankings, descargas o reseñas inventadas. [Política de metadata Google Play](https://support.google.com/googleplay/android-developer/answer/9898842?hl=en-GB).

Guion de capturas propuesto: descubrir puestos reales, consultar carta/precios/alérgenos, confirmar recogida/pago, seguir preparación y mostrar el QR en el puesto. El QR de las capturas será una muestra sin capacidad de canje; anonimizar pedidos/clientes. Preparar también un recorrido comercial si el modo comerciante está disponible. No utilizar screenshots de una maqueta como prueba de una función publicada.

Capturas y descripción deben explicar recogida y zona operativa. Botones de descarga apuntarán al ID/link oficial real, nunca a una URL de tienda inventada. Antes de disponibilidad, usar un mensaje de preparación o registro de interés coherente. Privacidad, ficha de datos, permisos y declaración de anuncios/SDK deben coincidir con el binario. [Medición](34-analitica-consentimiento.md), [AdMob](33-monetizacion-adsense-admob.md).

## Web hacia app y experimentos de ficha

Registrar un mapa de rutas compartibles: ficha de vendedor, menú y vista del pedido autorizado. Android App Links y iOS Universal Links se especifican en [frontend](08-frontend.md); el dominio confirmado, assetlinks/AASA, firmas y capacidades deben verificarse. Mantener fallback web útil y no forzar descarga para acceder a toda la información pública.

Cuando la app abra un pedido, autenticar y autorizar mediante Laravel; el enlace no concede acceso ni acredita pago. Los enlaces de auth no mutan por GET. No utilizar Firebase Dynamic Links para la propuesta nueva; verificar vigencia del mecanismo elegido antes de añadir un proveedor. [Analítica/enlaces](34-analitica-consentimiento.md).

Probar una hipótesis por experimento: primera captura de mapa frente a menú; claridad de recogida; icono legible. Separar plataformas/idiomas, documentar muestra/periodo y conversión a instalación/primera apertura, y después compra/recogida. No elegir ganador con una muestra pequeña o varias variables cambiadas a la vez. Emplear herramientas de las tiendas cuando estén disponibles y corresponda el estado de la app. [Experimentos Play](https://support.google.com/googleplay/android-developer/answer/12053285?hl=en), [optimización Apple](https://developer.apple.com/help/app-store-connect/create-product-page-optimization-tests/run-a-test).

## Calendario editorial inicial

Propuesta de una pieza principal por semana y revisión al cierre de los 90 días. La frecuencia depende de capacidad y evidencia, no de una cuota de páginas para anuncios. Preparar textos durante desarrollo; publicar únicamente cuando su información, CTA y destino sean reales. Cada artículo tiene responsable/editor, fuentes y fecha de revisión; no se inventan visitas, experiencias o testimonios.

| Ventana | Pieza propuesta y público | Evidencia necesaria | Conversión y enlace útil |
| --- | --- | --- | --- |
| Días 1–7 | Cómo funcionan los pedidos para recoger — cliente | Flujo validado, estados y condiciones vigentes | /como-funciona; explorar si ya funciona |
| 8–14 | Cómo encontrar food trucks cerca de ti — cliente | Búsqueda manual, permisos y datos operativos | /explorar; ficha de vendedor real |
| 15–21 | Cómo digitalizar el menú de un puesto — comerciante | Proceso/formatos/funciones disponibles | /para-vendedores; alta o interés según estado |
| 22–28 | Qué revisar antes de recoger un pedido — cliente | Horario, lugar, cambios e instrucciones reales | Menú/ficha; compra o estado del pedido |
| 29–35 | Guía de comida callejera en [ciudad piloto] — cliente | Oferta local suficiente y comprobada | /ciudades/[ciudad]; puestos activos |
| 36–42 | Cómo gestionar pedidos en un pequeño negocio — comerciante | Pantallas y operación probadas | Landing comercial; alta validada |
| 43–49 | Hamburguesas para recoger en [zona] — cliente | Menús, precios y disponibilidad actuales | Página local/categoría útil, sin filtro duplicado |
| 50–56 | Pedir para recoger y pedir a domicilio: diferencias — cliente | Explicar que Foodtrucks ofrece recogida | /como-funciona; instrucciones de recogida |
| 57–63 | Guía de un mercado gastronómico real — ambos | Autorización/fuentes, puestos, fechas y ubicación verificados | Fichas y lugar real; no perfil ficticio |
| 64–70 | Cómo publicar horarios y ubicación de un puesto móvil — comerciante | Herramientas y regla de vigencia reales | Alta/panel si corresponde |
| 71–77 | Cómo consultar menús y alérgenos antes de pedir — cliente | Información del vendedor; no diagnóstico sanitario | Menú real, ayuda y CTA accesible |
| 78–84 | Cómo encargar comida a pequeños puestos — cliente | Flujo funcional y ejemplos autorizados | Fichas, menú y recogida |
| 85–90 | Revisión de contenidos y próximos temas — equipo | Búsquedas, oferta, enlaces y resultados disponibles | Actualizar piezas útiles; retirar datos obsoletos |

Si no hay ciudad/oferta verificada en una ventana local, sustituir la pieza por ayuda del producto o material comercial verificable; no generar una ciudad vacía. No inventar demanda para Madrid/Barcelona/Valencia ni publicar negocios de un listado no autorizado. Los títulos son ideas de investigación, no contenido publicado.

Enlazar dentro de cada artículo a la página que resuelve el siguiente paso; mantener navegación header web y accesibilidad. FAQ usa respuestas verdaderas y no promete rich results. Un artículo sobre membresía necesita impuestos, financiación y reglas cerrados; no anunciar equivalencias de puntos, ahorro garantizado o un plan sin anuncios.

Cada pieza registra slug/canonical, objetivo, fuente/autor, oferta citada, fecha de revisión, CTA, evento consentido y responsable. Al cambiar precio, menú, ubicación u horario, actualizar referencias y metadatos. Robots/noindex no protege contenido privado. No publicar a gran escala para aumentar impresiones AdSense.

## Dos embudos y mejoras por evaluar

| Embudo | Etapas y diagnóstico | Mejoras propuestas |
| --- | --- | --- |
| Cliente | Búsqueda → página útil → vendedor → menú → carrito → pago → recogida | Explicar recogida desde el primer contacto, indicar disponibilidad real, mostrar costes aprobados y recuperar pedidos ante fallo |
| Comerciante | Búsqueda → landing → registro → alta/verificación → menú/ubicación → recepción activa | Explicar requisitos/tarifas confirmadas, conservar progreso y diferenciar registro de negocio operativo |

Medir cada paso con denominadores y ventanas equivalentes; una caída entre menú y carrito puede depender de oferta, horario, precio o fricción, y necesita evidencia. No añadir formularios/pasos al checkout para aumentar leads. Si compra web completa no pertenece al primer MVP, el embudo web deriva honestamente a app funcional o interés; no anunciar un checkout inexistente.

Mantener ingresos separados: GMV comida, cobros comerciales, membresía cliente, comisión si se aprueba, anuncios y patrocinios. Evaluar margen/contribución tras comisiones Stripe, descuentos, reembolsos y costes operativos, sin CPC/CPA/ROAS inventados. [Captación](27-marketing-google-ads.md), [dashboards](34-analitica-consentimiento.md).

## Roadmap condicionado de 90 días

| Ventana del prompt | Entregable propuesto | Dependencias y aceptación |
| --- | --- | --- |
| 1–15 | Inspección específica, control del dominio, prioridades y diseño SEO/privacidad/CWV | Código/cuentas correctos, baseline disponible; resolver P0 de la función afectada |
| 16–30 | Páginas públicas, fichas/menús, ciudades reales, sitemap y JSON-LD | App/router y datos publicados; HTML, estados, canonicals, acceso privado e invalidación probados |
| 31–45 | ASO, enlaces web/app y analítica de prueba | Builds firmadas, IDs, rutas, consentimiento y eventos sin duplicados/PII |
| 46–60 | Elegibilidad AdSense y AdMob de prueba/consentimiento | Producto funcional, política/CMP/UMP, IDs test y formatos seguros; mantener live desactivado |
| 61–75 | Landings y editorial, oferta local/GBP, revisión de conversiones | Vendedores elegibles, contenidos autorizados y destinos/eventos reales |
| 76–90 | Validación y experimentos de adquisición; revisión por ciudad/cohorte | Presupuesto explícitamente aprobado, conversiones fiables y capacidad; publisher live solo tras requisitos y autorización |

El orden integra marketing con [hitos del producto](22-roadmap.md), sin sustituir H0–H11. Si faltan API, builds, compra, cuentas o oferta, desplazar la ventana afectada y avanzar con diseño/contenido independiente. Un plazo no concede autorización de campaña, tienda, anuncio, email o despliegue.

## Evidencia de cierre y seguimiento

Antes de publicación: links/fallback, texto y assets, veracidad de funciones, revisión editorial, geografía y horas actuales, pruebas de privacidad, cuentas/tiendas y dominio controlados. Antes de adquisición: pago/activación conciliados, presupuesto/mercado aprobados y conversiones verificadas. Antes de anuncios: consentimiento/eligibilidad/pruebas y efecto sobre compra evaluados.

Informe por fase: archivos reales afectados, problema y solución, dependencias, pruebas ejecutadas, resultado esperado frente a observado y rollback. Cambios reversibles y sin alterar pagos/auth/vendedores sin revisar impacto. El paquete actual aporta el calendario y procedimiento; no se han ejecutado builds, pruebas de app, publicaciones o experimentos.
