# Protección de datos y gobernanza

**Operación DEV 22/10/2026:** [alarmas propias](devops/README.md#sonda-externa-y-catalogo-de-avisos) usan exclusivamente el destinatario técnico autorizado. Estado/contadores sin datos de clientes; el correo técnico pendiente se guarda hasta confirmar entrega y los recibos KV caducan en 48 horas. KV creado con almacenamiento duradero UE; eso no garantiza que cachés o procesamiento permanezcan en UE. Restic cifra DB/fotos/APP_KEY para recuperar DEV; copia local no sustituye destino externo ni habilita producción. Activación de envíos, restore real DEV y acuerdos/retención afectados requieren su evidencia; no se declara cumplimiento jurídico.

**Versión documental:** 1.9 · **Fecha:** 14 de octubre de 2026 · **Estado:** política y procedimientos documentados; implementación, operativa y pruebas pendientes. No acredita cumplimiento jurídico, certificación, auditoría de aplicación ni un tratamiento ya configurado.

## 1. Objetivo, alcance y autoridad

Foodtrucks debe poder explicar qué datos trata, para qué, quién accede, a quién se comunican, hasta cuándo y cómo se atienden derechos, supresiones e incidentes. La decisión D43 incorpora controles prácticos proporcionados; no inicia un proyecto de certificación. Este documento centraliza la gobernanza y enlaza los controles específicos, evitando duplicarlos: [seguridad base](19-seguridad.md), [DevSecOps](39-seguridad-devsecops.md), [QA](40-testing-qa-github.md), [analítica/consentimiento](34-analitica-consentimiento.md), [observabilidad](41-observabilidad-grafana-prometheus-sentry.md), [fotos/backups](18-media-backups-operacion.md), [permisos nativos](47-novedades-onboarding-permisos.md) y [cambios/CI/CD](44-politica-commits-ci-cd-tests.md).

**España/UE es el marco de referencia, no un mercado confirmado.** P01 y P61–63 deben concretar territorio, entidad responsable, funciones de comerciantes/proveedores, bases, contratos, conservación y operativa antes de activar los tratamientos afectados. El RGPD define ámbitos material y territorial; no basta deducir aplicabilidad del idioma, de un precio en EUR o de dónde esté un servidor. Un alojamiento doméstico de una actividad comercial no implica la excepción de uso exclusivamente personal/doméstico. [RGPD, artículos 2–3, publicación oficial consultada en BOE](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

Se mantienen Laravel/PHP, PostgreSQL/PostGIS, Redis, Next.js, React Native/Expo, auth propia, Mapbox, Stripe, Cloudflare, Resend y servidor doméstico. No añadir otro backend, almacenamiento S3, un servicio de privacidad o SDK por esta política. La membresía cliente de 5,99 €/mes no cambia las finalidades ni implica consentimiento para marketing o medición.

## 2. Obligaciones y responsables por asignar

Cada tratamiento requiere finalidad concreta, datos mínimos, justificación validada, acceso por necesidad, destino y ciclo de vida conocidos. Una clave opaca o hash puede seguir vinculándose a una persona: seudonimizar no acredita anonimización. Distinguir ficha pública del negocio de domicilio, contacto y documentación privada del titular; ser autónomo o publicar un contacto no autoriza cualquier reutilización.

| Función operativa por asignar | Obligación | Evidencia necesaria |
| --- | --- | --- |
| Dirección/titular del proyecto | Identificar entidad, jurisdicción, responsabilidades y decisiones pendientes; aprobar finalidad y recursos | Decisión fechada, alcance y responsable efectivo, sin personas ficticias |
| Coordinación de privacidad | Mantener inventario, información, derechos, bases, conservación, contratos y evaluación de riesgos | Versiones revisadas y registro mínimo de decisiones/solicitudes |
| Backend/datos | Aplicar acceso, minimización, integridad, restricciones y supresión coherente | Tests de comportamiento, trazabilidad de ejecución y ausencia de exposición cruzada |
| Web/móvil | Información accesible, preferencias y estado real; impedir emisiones no permitidas | Pruebas de arranque, retirada, cuenta compartida y datos que salen del dispositivo |
| Operación/seguridad | Accesos, claves, proveedores, backups, restauración y respuesta a incidentes | Inventario real, restore controlado, revisión de datos emitidos y registro de incidentes |
| QA/DevSecOps y revisión | Relacionar requisito/riesgo/control/prueba/evidencia con la revisión vigente | Resultados reales y gates de 44; revisión humana cuando corresponda |

Son responsabilidades internas propuestas. No determinan por sí mismas quién es responsable, encargado o corresponsable según la normativa. Esas funciones jurídicas se verifican por tratamiento y contrato. Una persona puede asumir varias tareas operativas; si procede designar DPD, respetar su independencia, recursos y ausencia de conflicto de intereses.

Mantener un inventario de tratamientos y revisar su obligación y contenido como RAT según el caso. La tabla siguiente es un punto de partida, **no un RAT completo ni prueba de sistemas inspeccionados**. Para cada fila registrar titulares/categorías, origen, sistemas/entornos, ubicación efectiva, finalidad, base y su evaluación, accesos, destinatarios/transferencias, conservación, supresión, riesgo, propietario y evidencia. El contenido se ajustará a los tratamientos reales. [AEPD: Registro de actividades de tratamiento](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/actividades-tratamiento).

## 3. Inventario inicial y decisiones por finalidad

Las bases de la tabla son **candidatas que necesitan validación**, no una autorización universal. Contrato exige necesidad para ese servicio; obligación legal exige norma aplicable; interés legítimo requiere evaluación; consentimiento debe obtenerse y poder retirarse cuando sea la base utilizada. No escoger consentimiento para todos los procesos por comodidad ni reutilizar datos en otra finalidad silenciosamente. [RGPD, artículos 5–7](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

| Tratamiento y categorías previstas | Finalidad | Base candidata por validar | Acceso / destinatarios mínimos propuestos | Conservación, supresión y evidencia que concretar |
| --- | --- | --- | --- | --- |
| Cuentas: identidad/contacto, referencia OAuth, credenciales protegidas, sesiones y preferencias | Autenticar, gestionar cuenta y recuperar acceso | Contrato para cuenta; seguridad evaluada por separado | Persona titular; soporte autorizado; Google/Apple en el flujo elegido; equipo técnico limitado | Vida de cuenta/sesión, vencimientos y cierre; revocación comprobada, sin contraseñas/tokens en evidencia |
| Negocios: titular/contacto privado, membresías, ficha/carta pública, revisión e incidencias | Alta, operación y administración comercial | Contrato; obligaciones concretas o interés legítimo justificado según operación | Miembros autorizados y administración; público solo para campos publicados | Baja/publicación, relaciones vigentes y obligaciones; decisión de moderación y retirada de campos privados |
| Ubicación: punto público del puesto y posición puntual del dispositivo | Descubrir puestos o configurar recogida | Necesidad y base de cada uso por validar; permiso SO separado | Persona que lo solicita; negocio para su punto; Mapbox según tráfico/configuración real | No rastreo continuo; minimizar persistencia de posición cliente, vigencia del punto y prueba de alternativa manual |
| Pedidos/pagos/recogida: artículos, importes, estados, referencias Stripe y capacidad QR | Comprar, preparar, conciliar y recoger | Contrato y obligaciones aplicables a la operación/contabilidad | Cliente propio, negocio correspondiente, soporte limitado; Stripe para su circuito | Fin de operación y plazos legales/reclamaciones por determinar; invalidar QR y restringir historial conservado |
| Membresías y puntos: estado, movimientos, reservas y ajustes | Beneficios contratados y consistencia del saldo | Contrato/obligaciones que correspondan, con reglas P29–34 pendientes | Persona titular; operaciones autorizadas; proveedor de cobro elegido | Baja, movimientos pendientes y conservación justificada; no borrar hechos económicos ni inventar equivalencias |
| Fotos: archivo, variantes, referencia y metadatos mínimos | Publicar puesto/producto autorizado | Necesidad y derechos sobre imagen por validar | Negocio y administración autorizados; público solo para medio publicado | Sustitución/retirada, temporales y variantes; eliminar metadatos sensibles y verificar retirada de URL/cachés |
| Comunicaciones: destino, finalidad, preferencias, token push y resultado mínimo | Identidad y avisos operativos; marketing por separado | Base operativa propia; marketing con requisitos/base validados | Titular, worker limitado; Resend/APNs/FCM según canal | Tokens vigentes, entrega, retirada y supresión; evidencia mínima de elección/baja, sin retener cuerpo completo por defecto |
| Analítica/publicidad: eventos permitidos e identificadores seudónimos si se autorizan | Medir uso/captación y monetización aprobada | Consentimiento/requisitos aplicables pendientes; bloqueo inicial según 34 | Equipo autorizado; Google y destinos concretos revisados | Plazos y exportaciones por decidir; impedir recogida/replay no permitido y comprobar retirada |
| Observabilidad/seguridad: señales técnicas, IDs de correlación y auditoría mínima | Diagnóstico, disponibilidad, prevención y gestión de incidentes | Necesidad, base y proporcionalidad por validar | Operación/seguridad; Grafana/Prometheus/Sentry según modalidad elegida | Retención por señal y riesgo, acceso restringido, filtrado antes de salida y evidencia saneada |
| Backups/exportaciones/solicitudes: copias cifradas y registro mínimo de actuaciones | Recuperación y atención de derechos | Derivada de finalidad/base válida y obligaciones que correspondan | Operador de recuperación o tramitador autorizado; destino externo pendiente | Rotación, expiración, aislamiento y reaplicación de supresiones; prueba de restore y cierre de solicitud |

No guardar tarjeta completa ni CVV; KYC permanece en flujos Stripe, sin crear una copia documental propia por defecto. No exportar notas de pedido, alergias de una persona, GPS preciso, QR, datos de cuenta o textos libres a Analytics. La información sobre alérgenos de un producto no es un perfil de salud del comprador. Si una función futura tratara categorías especiales o realizara inferencias sensibles, revisar condiciones y riesgo antes de incorporarla; una base general no cierra esa evaluación.

## 4. Acceso, conservación y excepciones

Aplicar mínimo privilegio por acción/recurso y separar público, usuario, negocio, administración y operación. Acceso de soporte con finalidad y registro; no permiso universal por llamarse propietario. Revisar altas/bajas de miembros, cambio de cuenta, revocación, exports y sesiones. No replicar datos productivos en desarrollo/CI o pruebas para obtener comodidad.

**No hay plazos de conservación cerrados en este paquete.** Cada categoría necesita un calendario aprobado: finalidad, acontecimiento que inicia el cómputo, periodo o criterio verificable, excepción legal, quién revisa, cómo restringe/suprime y qué evidencia deja. Coste/disco disponible no son la justificación de conservar datos personales indefinidamente. Una política legal pendiente no debe convertirse en un default de retención ilimitada.

| Situación | Decisión y control exigidos |
| --- | --- |
| Uso operativo vigente | Datos necesarios para la finalidad; retirar copias/atributos que no aportan |
| Finalidad terminada o supresión procedente | Suprimir o anonimizar de forma efectiva según decisión; evaluar también destinatarios y derivados |
| Obligación legal/reclamación aplicable | Conservar solo el subconjunto necesario, con fundamento/plazo documentados y acceso restringido; no cuenta activa ni marketing |
| Restricción/bloqueo que corresponda | Separar del uso ordinario y registrar causa, permisos y revisión/destrucción posterior |
| Copia/backup retenido justificadamente | Acceso exclusivo de recuperación, límite aprobado y medidas para que no reaparezca en uso ordinario |

El derecho de supresión tiene condiciones y excepciones, por ejemplo obligaciones legales o defensa de reclamaciones cuando se cumplen sus requisitos; no se decide borrar o retener toda la cuenta en bloque. Si aplica España, revisar además el bloqueo de la LOPDGDD: identifica/reserva datos e impide su tratamiento ordinario, incluida visualización, para la puesta a disposición legal prevista y por los plazos de responsabilidad aplicables; después corresponde destruirlos. No equivale a archivar sin límite. [RGPD, artículo 17](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807), [LOPDGDD, artículo 32](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673#a3-4).

Retención fiscal/comercial, prescripción, facturas y compensaciones requieren identificar vendedor legal, territorio y obligación concreta. No fijar años inventados ni eliminar el ledger de puntos/pagos sin resolver conservación e integridad. No retener sesiones, credenciales, foto o localización porque una factura deba conservarse.

## 5. Procedimientos de información, derechos y retirada

### Información y cambios de finalidad

Antes de activar un tratamiento, preparar información comprensible y accesible en web/app: entidad/contacto reales, finalidad/base, categorías/origen cuando corresponda, destinatarios, conservación o criterios, transferencias, derechos y canal. Completar las obligaciones aplicables de información según obtención directa o indirecta; no publicar un texto legal con proveedores/regiones ficticios. Registrar versión y qué flujo la muestra. Nuevos SDK, finalidades, destinatarios o cambios sustanciales requieren reevaluar información, base/riesgo y elección necesaria. [RGPD, artículos 13–14](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

Novedades/onboarding no aceptan privacidad, marketing ni permisos por cerrarse. Ubicación/cámara/push del SO y finalidades operativas, analítica, publicidad y email marketing permanecen separadas. Conservar las interfaces y alternativas de [47](47-novedades-onboarding-permisos.md) y el bloqueo de [34](34-analitica-consentimiento.md).

### Atención de derechos

1. Habilitar un canal visible y atendido, con responsable/suplente por asignar; no inventar un buzón ni exigir conservar cuenta/login para solicitar un derecho.
2. Registrar recepción, alcance y plazo; verificar identidad de forma proporcional. No pedir copia completa de DNI a toda persona por defecto. Si hacen falta datos adicionales por dudas razonables, documentar necesidad y tratarlos con mínima conservación.
3. Identificar tratamientos, datos y destinatarios afectados; proteger información de otras personas. Acceso, rectificación, supresión, limitación, oposición y portabilidad tienen condiciones distintas; no confundirlos con un dump completo de DB o una sola operación «borrar usuario».
4. Resolver y ejecutar con permisos adecuados; entregar por medio seguro, con visibilidad y vigencia controladas. Coordinar comunicación a destinatarios cuando proceda, y distinguir resultado confirmado de solicitud externa pendiente.
5. Responder con actuación, alcance, excepciones/motivo y vías de reclamación aplicables. Conservar evidencia mínima de la tramitación, sin copiar de nuevo todo el conjunto entregado.

En el marco RGPD, atender sin dilación indebida y responder como máximo en **un mes desde la recepción**. Puede ampliarse hasta **otros dos meses** si lo justifican complejidad/número; informar dentro del primer mes con motivos. No son 30 días universales ni una ampliación automática. [AEPD: plazo de respuesta](https://www.aepd.es/preguntas-frecuentes/1-tus-derechos/2-tus-derechos-de-proteccion-de-datos/FAQ-0106-cual-es-el-plazo-para-responder-cuando-se-ejercitan-estos-derechos). La atención es generalmente gratuita; restricciones, cobro o negativa requieren condiciones y justificación, no una barrera por conveniencia. [AEPD: guía para responsables, derechos](https://www.aepd.es/es/documento/guia-rgpd-para-responsables-de-tratamiento.pdf).

### Cierre de cuenta, baja comercial y supresión

Verificar intención/identidad y distinguir cierre de acceso, baja de suscripción, retirada de publicación y supresión. Identificar pedidos/recogidas activos, pagos, facturas, puntos y obligaciones; informar de su tratamiento sin inventar cancelaciones, reembolsos o condiciones comerciales. Revocar sesiones y asociaciones de dispositivos; cerrar el uso ordinario y marketing. La continuidad justificada de obligaciones no convierte la cuenta en activa ni permite nuevas finalidades.

Decidir qué se suprime, restringe o conserva con base/plazo, ejecutar §6 y comunicar el resultado. Una baja de Foodtrucks no cancela por sí misma Billing/Connect ni elimina automáticamente datos de un tercero; aplicar la política contractual y los roles confirmados. No condicionar el derecho a una operación comercial no necesaria.

### Retirada y oposición a marketing/medición

Retirar debe resultar tan fácil como otorgar cuando el tratamiento se base en consentimiento. Actualizar preferencias y detener recogida/exportación/envíos futuros de la finalidad retirada; revisar colas/reintentos y estado vigente justo antes del envío. No reproducir posteriormente el historial rechazado. La retirada no vuelve ilícito retroactivamente el tratamiento anterior válido; evaluar separadamente la solicitud de supresión y cualquier fundamento que permita conservar datos. [RGPD, artículo 7.3](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

Para marketing, aplicar oposición/baja, lista de supresión mínima y controles de destinatario/finalidad, con base y conservación propias por revisar. No borrar una supresión para que una importación o restore pueda reactivar una campaña. Rechazar analítica/publicidad no bloquea compra/QR o mapa manual. Mantener los avisos operativos necesarios por su fundamento real, sin insertar promociones. [Comunicaciones](15-notificaciones-tiempo-real.md), [Resend](30-correo-resend.md), [analítica](34-analitica-consentimiento.md).

## 6. Supresión coordinada y restauración sin reaparición

La futura implementación necesita una actuación verificable por solicitud y almacén, con reintentos controlados. Su diseño exacto se decide con el repositorio; no se crean aquí APIs, tablas, tareas o workflows.

| Superficie | Efecto requerido y evidencia futura |
| --- | --- |
| PostgreSQL y relaciones | Retirar/restringir datos aprobados, preservar integridad y subconjunto legal justificado; probar solicitud repetida/concurrente |
| Redis, cachés cliente/web y CDN | Invalidar datos, sesiones y contenido público afectados; comprobar que no se rellenan desde una fuente obsoleta |
| Fotos, variantes, temporales y exports | Retirar publicación y copias activas sujetas a supresión; limpiar rutas autorizadas y confirmar resultado, sin borrado recursivo ciego |
| Outbox, colas y tokens de comunicación | Impedir envíos/exports ya no permitidos, romper asociaciones y revisar acciones pendientes; no alterar hechos económicos con un borrado indiscriminado |
| Proveedores/destinatarios | Ejecutar el procedimiento aplicable a su función, registrar solicitud/respuesta y limitaciones legales; un HTTP correcto no prueba borrado completo |
| Logs/trazas/auditoría | Minimizar desde origen, localizar los datos sujetos a actuación y respetar excepciones concretas; conservar evidencia mínima protegida |
| Backups | Identificar copias afectadas, restricción y vencimiento aprobados; aplicar decisiones antes de volver a utilizar una copia restaurada |

No prometer eliminación instantánea de un backup inmutable. Su rotación **no es una exención automática del derecho de supresión**: justificar el tratamiento residual, acceso/aislamiento, plazo y medidas; valorar técnicamente eliminación, restricción o expiración según el soporte y decisión jurídica. La compatibilidad DB/archivos de [18](18-media-backups-operacion.md) no permite conservar indefinidamente medios activos solo porque aparezcan en una copia.

Antes de abrir acceso o reactivar workers tras un restore, obtener y aplicar las supresiones, restricciones y retiradas posteriores al corte. El registro mínimo necesario para reaplicarlas debe sobrevivir al fallo que motivó la recuperación, estar protegido y tener su propia conservación; no guardar una segunda copia completa de los datos suprimidos. Si ese registro falta o no puede conciliarse, no declarar restauración lista para uso productivo.

Mantener el restore aislado, email/push/exportación/Stripe live deshabilitados; revisar outbox antigua, tokens, preferencias y cachés y conciliar hechos económicos. Verificar con casos sintéticos que un dato suprimido no se sirve, una cuenta cerrada no inicia sesión y una baja no recibe marketing. Registrar qué se eliminó/restringió, qué excepción subsiste, dónde y hasta cuándo; resultado parcial o externo incierto permanece pendiente. [Recuperación](18-media-backups-operacion.md), [QA26–27](40-testing-qa-github.md).

## 7. Proveedores y destinatarios por servicio

El nombre de una empresa no determina su función jurídica. Para cada servicio/configuración registrar entidad contractual, operación/datos, responsable/encargado/corresponsable u otra posición que resulte, contrato pertinente, instrucciones, subencargados, regiones/accesos remotos, transferencias/garantías, conservación, derechos/incidentes y evidencia de configuración. Una región de almacenamiento no resuelve por sí sola todas las transferencias. [RGPD, artículos 26/28 y capítulo V](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807).

| Servicio previsto | Comprobaciones antes de activar; sin rol/contrato/región presumidos |
| --- | --- |
| Stripe Billing/Connect | Distinguir comida, comerciante y membresía cliente; funciones por flujo, datos necesarios, KYC alojado en Stripe, conservación propia y derechos/canales aplicables |
| Mapbox | Revisar SDK/telemetría/peticiones reales, localización e identificadores enviados, atribución/opciones exigidas y ciclo de datos; no enviar GPS a otros destinos por reutilización |
| Cloudflare | Distinguir Registrar/DNS, proxy/Tunnel/CDN si se seleccionan y logs; origen/IP/cabeceras, caché pública y datos que realmente atraviesan el servicio |
| Resend | Separar correo transaccional, marketing y alertas; contenido/destinos mínimos, bajas, logs, región/retención/subencargados y resultado de derechos |
| Google / Apple | Separar OAuth de Google Analytics/Firebase/Ads y de transporte push; scopes/datos/token por función, condiciones, preferencias y destinos; auth propia permanece |
| Grafana / Prometheus / Sentry | Modalidad local/gestionada elegida, accesos/región, filtrado, retención y destinatarios; Replay/profiling y trazas necesitan finalidad/evaluación propias |
| Backup externo y tooling de desarrollo/CI/IA | Destino, operador, cifrado/claves, acceso de recuperación, retención y datos efectivamente enviados; sin copias productivas en herramientas por defecto |

Las políticas [Stripe](13-stripe.md), [Mapbox](12-mapbox.md), [Cloudflare](29-cloudflare-dominio-dns.md), [correo](30-correo-resend.md), [medición](34-analitica-consentimiento.md) y [observabilidad](41-observabilidad-grafana-prometheus-sentry.md) desarrollan el uso técnico. **No se revisaron contratos privados, cuentas, DPA firmados o regiones reales en esta entrega.** Sus condiciones vigentes se comprobarán al elegir servicio/plan y configurar el entorno. Publicar un nombre en la política no demuestra garantías ni autoriza exportar datos.

## 8. Riesgos, EIPD/DPD y brechas

Evaluar riesgos para las personas antes de activar o ampliar una finalidad: exposición de localización, relaciones entre pedidos/cuentas, uso comercial del contacto, accesos cruzados, pérdida del host/backups, perfilado y datos sensibles. Considerar necesidad, alternativas, escala, personas afectadas, probabilidad/impacto y medidas. Registrar decisión y riesgo residual con propietario y fecha; no inventar scores, ausencia de riesgo o una EIPD completada.

**EIPD condicional:** determinar si el tratamiento probablemente entraña alto riesgo y revisar las listas/criterios aplicables antes del tratamiento. Una nueva tecnología o localización no decide automáticamente su obligación ni su exención. Cuando concurran las condiciones del artículo 36.1 RGPD, realizar la consulta previa exigible a la autoridad de control antes de proceder. [AEPD: EIPD](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/realizacion-de-evaluaciones-de), [consulta previa](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/consulta-previa).

**DPD condicional:** comprobar supuestos del artículo 37 RGPD y, si aplica España, artículo 34 LOPDGDD; documentar necesidad/designación o motivo de la decisión. No asignar un DPD ficticio, equiparar coordinación de privacidad con esa función ni presumir obligación/exención por tamaño reducido. La revisión debe contemplar independencia/conflictos, recursos y contacto cuando proceda. [RGPD](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807), [LOPDGDD, DPD](https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673#a3-6).

### Procedimiento de brechas

1. Detectar y registrar incidente/constancia, entorno, hechos y datos posiblemente afectados; escalar a operación/seguridad y privacidad asignadas.
2. Contener accesos/secretos y preservar evidencia mínima segura; no volcar PII o payloads completos a un ticket público o alerta.
3. Determinar si existe brecha de confidencialidad, integridad o disponibilidad de datos personales y valorar riesgo para personas, no solo reputación o coste del negocio.
4. Determinar función jurídica, autoridad competente y obligaciones de comunicar; preparar naturaleza, categorías/volumen aproximado cuando posible, consecuencias, contacto y medidas, con actualización de hechos.
5. Registrar decisión, comunicaciones y motivos; corregir causa, verificar recuperación, revisar accesos y tratamiento afectado y conservar evidencia restringida.

En el marco RGPD, el **responsable** notifica a la autoridad competente sin dilación indebida y, de ser posible, dentro de **72 horas desde que tiene constancia**, salvo que sea improbable el riesgo para derechos/libertades, con decisión documentada. Si se retrasa, explicar motivos; aportar información por fases cuando corresponda, sin esperar a cerrar toda investigación. No identificar siempre a AEPD como competente sin validar establecimiento/territorio. [RGPD, artículo 33.1/4/5](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807), [AEPD: notificación](https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/brechas-de-datos-personales-notificacion).

El **encargado** avisa al responsable sin dilación indebida de las brechas que conoce; no le corresponde aplicar la excepción de riesgo improbable que rige la notificación del responsable a la autoridad. Si hay probable **alto riesgo**, el responsable comunica a las personas afectadas sin dilación indebida, salvo excepciones aplicables y documentadas del artículo 34. No es otro plazo genérico de 72 horas. [RGPD, artículos 33.2/34](https://www.boe.es/buscar/doc.php?id=DOUE-L-2016-80807), [AEPD: comunicación a afectados](https://www.aepd.es/preguntas-frecuentes/2-tus-obligaciones-como-responsable-del-tratamiento/11-brechas-de-datos-personales/FAQ-0254-a-quien-hay-que-comunicar-lo-ocurrido-en-una-brecha).

Esta política prepara el procedimiento y no autoriza notificaciones reales desde el paquete. El contacto operativo, suplencia, autoridad/canales y capacidad de responder durante una caída del domicilio deben definirse antes de operar; un correo de alerta recibido no acredita que se hayan atendido las obligaciones de una brecha.

## 9. Marcos de calidad, ciclo de vida, seguridad y mejora

Se emplean como referencias proporcionadas para requisitos, revisiones y evidencias del proyecto. No son pruebas de conformidad jurídica, certificación, nivel de madurez o auditoría completada. Se consultaron fichas/resúmenes y documentación pública; **no se adquirieron ni se reprodujeron normas de pago ni matrices de cláusulas cuyo texto íntegro no se ha leído**.

| Referencia / edición pública comprobada | Alcance | Aplicación proporcionada a Foodtrucks |
| --- | --- | --- |
| [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html), edición 2 | Modelo de calidad de producto | Formular resultados medibles de seguridad, fiabilidad, rendimiento/interacción y mantenimiento; criterios reales, no porcentajes de conformidad |
| [ISO/IEC/IEEE 12207:2026](https://www.iso.org/standard/90219.html), edición 2, publicada abril de 2026 | Procesos del ciclo de vida del software | Relacionar necesidad, desarrollo, operación, mantenimiento y retirada; no usar 2017 como edición vigente ni crear una capa por cada proceso |
| Serie [ISO/IEC/IEEE 29119](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html): [1:2022](https://www.iso.org/standard/81291.html), [2:2021](https://www.iso.org/standard/79428.html), [3:2021](https://www.iso.org/standard/79429.html), [4:2021](https://www.iso.org/standard/79430.html) | Conceptos, procesos, documentación y técnicas de testing en sus partes respectivas | Seleccionar casos por riesgo y conservar resultados útiles en 40/44; no generar plantillas vacías ni afirmar aplicación de toda la serie |
| [ISO/IEC 27001:2022](https://www.iso.org/standard/27001), edición 3; ficha con Amd 1:2024 | Requisitos de sistema de gestión de seguridad de la información | Propietarios, riesgos, accesos, proveedores, cambios e incidentes; no declarar un SGSI conforme o certificado por esta política |
| OWASP [Top 10 2025](https://owasp.org/projects/top-ten), [API Top 10 2023](https://api-security.owasp.org/editions/2023/en/0x11-t10/), [ASVS 5.0.0](https://owasp.org/projects/asvs) y [MASVS/MASTG](https://mas.owasp.org/MASVS/) | Concienciación y verificación técnica web/API/móvil, con alcances distintos | Mantener la selección/versionado de 39; fijar versión/perfil móvil cuando se use. No convertir Top 10 en auditoría completa ni inventar IDs de requisitos |
| [NIST SP 800-218, SSDF 1.1 final](https://csrc.nist.gov/pubs/sp/800/218/final), febrero de 2022 | Prácticas de desarrollo seguro integrables en el ciclo de vida | Preparación, protección de artefactos, producción segura y respuesta a vulnerabilidades vinculadas a 39/44; no un sello de producto seguro |
| [CMMI V3.0, referencia pública ISACA de 2023](https://www.isaca.org/resources/news-and-trends/isaca-now-blog/2023/cmmi-updates-take-performance-improvements-to-the-next-level) y [método de appraisal](https://cmmiinstitute.com/learning/appraisals/method) | Mejora de capacidad/procesos y evaluación formal según su método | Revisar problemas/acciones/resultados y mejorar con evidencia; sin rating, nivel o appraisal atribuido ni compra de acceso al modelo |
| DevSecOps; [NIST SP 800-204D final](https://csrc.nist.gov/pubs/sp/800/204/d/final), febrero de 2024 | Seguridad de cadena de suministro en pipelines CI/CD | Adaptar procedencia, artefacto, revisión y gate de 44; el contexto cloud-native del documento no obliga a microservicios, Kubernetes o service mesh |

La consulta del **borrador SSDF 1.2**, SP 800-218 Rev. 1, muestra estado Initial Public Draft de diciembre de 2025; no se usa como una publicación final ni sustituye silenciosamente la referencia 1.1. Revalidar estado/versiones al implantar. [NIST: borrador 1.2](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd).

Los resúmenes no autorizan redistribuir textos, modelos o recursos ajenos. Cotejar licencia/procedencia exacta si se incorporan materiales o código; la selección documental solo enlaza fuentes primarias y sintetiza su alcance. No trasladar cláusulas, certificaciones, ratios o benchmarks de una guía a decisiones aprobadas.

## 10. Trazabilidad, IA y comprobación de controles

Por cada obligación/cambio registrar finalidad/riesgo, decisión/propietario, control, prueba, evidencia, versión/entorno, resultado y limitaciones. Reutilizar los IDs **internos de Foodtrucks** SEC/QA existentes; no presentarlos como códigos ISO, RGPD u OWASP. Las matrices completas permanecen en 39/40. Los requisitos están documentados; el estado siguiente se refiere a su implementación y comprobación real.

| Requisito | Riesgo | Control existente | Prueba/evidencia | Responsable por asignar | Estado |
| --- | --- | --- | --- | --- | --- |
| Acceso mínimo y entrega de datos propios | Exposición entre cuentas/negocios o acceso tras revocación | SEC01–02 | QA01/03/25: petición directa, usuario ajeno, revocación y export autorizado; resultados y salida saneada | Backend/datos, privacidad y QA | Documentado; implementación/pruebas pendientes |
| Supresión, restricción y cierre coherentes | Datos residuales accesibles o pérdida de historia necesaria | SEC02/07, §4–6 y 18 | QA26: DB/caché/archivos/colas, concurrencia, excepción restringida y resultado externo confirmado | Backend/datos, operación y privacidad | Documentado; implementación/pruebas pendientes |
| Recuperación sin reactivar datos/envíos | Restore reintroduce supresiones o comunicaciones retiradas | SEC07, 18 y runbooks de 41 | QA27: restaurar corte anterior, reaplicar decisiones posteriores y comprobar acceso/envíos antes de reabrir | Operación, datos y QA | Documentado; implementación/pruebas pendientes |
| Consentimiento, comunicaciones y permisos separados | Recogida/envío no permitido o consentimiento atribuido a otra finalidad | SEC05–07, 30/34/47 | QA15/19/22/29: rechazo/retirada antes de arranque y worker, sin replay; evidencia de tráfico/colas | Web/móvil, backend y privacidad | Documentado; implementación/pruebas pendientes |
| Telemetría y evidencia saneadas | PII/secretos en logs, terceros, dashboards o artifacts | SEC05–08 y 41 | QA28: señuelos sintéticos filtrados antes de salir, accesos/retención comprobados y reportes saneados | Operación/seguridad, web/móvil y QA | Documentado; implementación/pruebas pendientes |
| Proveedores, riesgos y brechas | Destinos/roles desconocidos o respuesta y comunicación inadecuadas | SEC07–08, §7–8 y procedimientos 39/41 | Revisión contractual, decisión de riesgo y ensayo de contactos/plazos; registro mínimo de decisiones/resultados | Privacidad, dirección y operación/seguridad | Documentado; implementación/pruebas pendientes |
| Cambio y release trazables | Control omitido o artefacto no validado promovido | Política 44 | QA20: checks de revisión vigente, staging/artefacto y aprobación de producción; no sustituyen pruebas de privacidad | QA/DevSecOps, revisión y operación | Documentado; implementación/pruebas pendientes |

### Trabajo asistido por IA y datos de prueba

No enviar secretos ni datos personales reales a prompts, memorias, repositorios, issues, herramientas externas, fixtures o artifacts por esta autorización documental. Usar ejemplos y datos sintéticos mínimos; sustituir también emails, ubicaciones, tokens, fotografías, trazas y enlaces que puedan identificar. Una limpieza parcial o hash de email no convierte un dataset productivo en sintético. Cualquier excepción requiere evaluar necesidad/base, destino/condiciones y autorización dentro del alcance real.

El código generado con IA sigue los mismos controles/revisión/tests de 44 que otro cambio; no recibe un bypass ni una aprobación humana ficticia. Verificar dependencias/licencias, datos que emite, llamadas de red y efecto económico. CI rápido usa fakes/datos sintéticos y salidas live deshabilitadas; una prueba de eliminación con fake no demuestra la supresión en un proveedor real. Reportes/capturas/exports también se sanean y retienen con acceso limitado.

### Aceptación futura

Antes de declarar un tratamiento implantado: inventario/bases/finalidades y conservación revisados, información y canales disponibles, proveedor/configuración validados, acceso/revocación/retirada/supresión probados, riesgos y EIPD/DPD resueltos cuando proceda, restore sin reaparición y operativa de incidentes ensayada. Mantener evidencia segura y actualizar decisiones ante cambios. Una build o CI verde no acredita legalidad, cumplimiento de todas las normas ni ausencia de riesgos.

## 11. Estado de la entrega, fuentes y pendientes

| Estado | Significado y aplicación actual |
| --- | --- |
| Documentado | Esta política, inventario inicial, procedimientos y trazabilidad están escritos |
| Implementado | Exige código/configuración/procedimiento operativo realmente incorporado; no acreditado aquí |
| Probado | Exige ejecución, entorno/versión y resultado verificables; las pruebas de aplicación siguen pendientes |
| Pendiente | P01/P24–25/P28/P40–42/P46/P55–56/P61–63 y decisiones de tratamiento aún sin cierre |
| NO VERIFICADO | Contratos, cuentas/regiones, RAT completo, bases finales, canales/responsables efectivos, EIPD/DPD, supresión externa y controles operativos sin evidencia disponible |

**Decisión de pruebas de esta actualización:** no añadir un test artificial de aplicación a un texto Markdown sin código ejecutable. Comprobar enlaces/tablas/coherencia/ediciones y registrar resultados documentales en la entrega; QA25–29 son pruebas futuras de comportamiento, no ejecutadas. No se crearon modelos/endpoints, fixtures, workflows, cuentas, contratos, certificaciones o servicios ni se enviaron comunicaciones por este documento.

Fuentes públicas primarias enlazadas consultadas el **14 de octubre de 2026**: RGPD publicado en BOE, LOPDGDD y orientaciones AEPD; fichas ISO, proyectos OWASP, NIST e ISACA/CMMI. La consolidación BOE de LOPDGDD es informativa y se contrastará con publicaciones oficiales para una decisión jurídica. Fecha de consulta no equivale a publicación ni a revisión de todos los contratos. EUR-Lex exigió JavaScript en esta consulta; se utilizó la publicación oficial accesible desde BOE, sin atribuir lectura íntegra a una página bloqueada.

En esta actualización del paquete se ha confirmado la lectura de `security-best-practices` y sus referencias Go, JavaScript web, React y Next.js como apoyo técnico. Sus snapshots de enero de 2026 no son una auditoría ni sustituyen fuentes/versiones actuales; no se ejecutó un scan por leer la skill. Esta lectura histórica no cubre Laravel/PHP; para el backend vigente se consultan fuentes oficiales Laravel/PHP y las pruebas reales del repositorio. Las obligaciones legales se contrastan con las fuentes primarias anteriores, no se deducen de esa guía.

Próximo cierre: entidad/territorio y funciones de tratamiento; información/contactos; bases por finalidad; contratos/regiones/transferencias; periodos/excepciones y borrado multialmacén; riesgos/EIPD/DPD; personas/suplencias y evidencias del repositorio real. Mantener este documento junto a las políticas existentes y revisar al cambiar finalidad, proveedor, datos, escala o riesgos, sin generar archivos de certificación vacíos.
