# Fotos locales, backups y operación

**Cerrado:** fotografías persistentes en el servidor, sin S3, y backups externos. **Base propuesta:** organización, validación y recuperación.

## Subida y publicación

1. Autorizar al usuario para el negocio/recurso.
2. Limitar tamaño, cantidad y dimensiones; comprobar extensión, MIME real y decodificación.
3. Guardar temporalmente fuera de la ruta pública con nombre generado.
4. Reprocesar la imagen, eliminar metadatos sensibles y producir tamaños necesarios.
5. Guardar archivo final inmutable con nombre aleatorio/versionado y metadatos en PostgreSQL.
6. Publicar solo rutas autorizadas; limpiar temporales y huérfanos con margen seguro.

WebP/AVIF son alternativas propuestas; comprobar soporte en consumidores y librería de conversión. No crear una dependencia pesada sin valorar su uso. Límites exactos de bytes/píxeles y cuotas pendientes.

No aceptar SVG/HTML como fotos por defecto. Protegerse de archivos polimórficos, bombas de descompresión y path traversal. No confiar en el nombre enviado ni permitir rutas fuera del directorio asignado.

PostgreSQL conserva metadatos/ruta relativa, no bytes binarios de fotografías. Caddy sirve medios públicos; privados requieren autorización o mecanismo temporal revisado. No servir perfiles privados, documentos o tickets como fotos públicas.

## Persistencia y caché HTTP

Directorio montado de forma persistente y permisos mínimos. Caddy lectura, Go escritura solo donde necesita. Reiniciar/reemplazar contenedores no elimina fotos.

Fotos finales con nombre inmutable permiten cachear y actualizar por URL nueva. Mantener originales solo si hay propósito. La limpieza ordinaria de medios debe respetar la consistencia de backups retenidos; una solicitud de supresión aprobada sigue el procedimiento de protección de datos, sin mantener accesible una foto activa solo porque exista una copia histórica.

## Backups externos

Guardar fuera del host doméstico, fuera de la VM y fuera del domicilio: otro servidor o almacenamiento de backup elegido por el usuario, sin introducir S3 como requisito. Cifrar en tránsito y reposo, credenciales de mínimo privilegio y acceso de recuperación separado.

Incluir PostgreSQL, uploads, configuración declarativa y medios de recuperación de secretos/firma. Secretos se respaldan cifrados en canal separado; nunca al repositorio. Redis de caché puede reconstruirse; si acaba almacenando datos críticos, revisar persistencia y backup.

Frecuencia, retención, destino, RPO y RTO pendientes. Un ejemplo diario no constituye garantía suficiente para pedidos reales.

## Consistencia DB + archivos

No copiar en caliente el directorio de PostgreSQL como si fuera un backup válido. Propuesta MVP: dump lógico consistente y conjunto coherente de archivos inmutables.

Para asegurar la relación DB/fotos, pausar publicación y borrado de medios durante el corte, fijar el conjunto referenciado por el dump, copiar/verificarlo y después reanudar. Alternativa de snapshots/PITR requiere diseño y pruebas adicionales. No asumir que DB y uploads tomados a horas distintas restauran correctamente.

Backups locales son staging temporal, no protección ante pérdida del host. Evitar que el staging llene los 40 GB.

## Restauración verificable

Restaurar en entorno aislado: PostgreSQL/PostGIS compatible, migraciones correspondientes y uploads. Comparar recuentos/referencias, abrir fotos, comprobar autorizaciones y ejecutar un pedido de prueba.

Mantener email, Stripe live y push reales deshabilitados en el entorno restaurado. Outbox restaurada puede contener acciones antiguas; revisar antes de activar workers. Conciliar pagos pendientes con Stripe antes de reanudar ventas.

Registrar fecha de prueba, tiempo de recuperación, pérdidas esperadas y responsable. Un backup sin prueba de restore no demuestra recuperabilidad.

## Operación diaria

Métricas de API, CPU/RAM, disco/WAL, conexiones DB, cola outbox, errores push, webhooks pendientes y antigüedad del último backup externo. Logs rotados y sin QR/tokens/contraseñas. Alertas accionables y plan para caída de Redis, Stripe, host doméstico, luz o Internet.

Herramientas concretas de monitorización y destino de alertas pendientes. Los snapshots VMware son útiles para pruebas, pero no sustituyen backup externo de datos.

## Entorno doméstico y nuevas alertas

Un NAS, disco o VM en la misma casa puede ser copia adicional, pero no reemplaza el backup externo ante pérdida del domicilio. Programar copias sin agotar disco/subida ni afectar pedidos; mantener evidencia de restore. Alertas operativas y una sonda externa deben detectar también cortes de luz/red y de la propia monitorización, con destino autorizado y canal de recuperación.

Respaldar configuración de observabilidad y secretos de recuperación con controles separados; no conservar telemetría sensible indefinidamente. Retención de métricas/logs/trazas y cuotas dependen de capacidad medida. [Servidor doméstico](38-servidor-domestico.md), [observabilidad/runbooks](41-observabilidad-grafana-prometheus-sentry.md).

## Supresión y recuperación con protección de datos — v1.9

Aplicar la [política de protección de datos y gobernanza](48-proteccion-datos-gobernanza.md). Distinguir eliminación de datos activos, restricciones de uso y vencimiento de copias históricas. Registrar finalidad, plazo, acceso y procedimiento de las copias; no imponer retención indefinida ni borrar un backup íntegro sin evaluar consistencia y recuperación. Plazos y excepciones de conservación siguen pendientes de aprobación por clase de dato.

Una restauración se realiza primero en aislamiento, con workers, correo, pagos live, push, publicidad y exportaciones desactivados. Antes de reabrir accesos o procesar la outbox, aplicar las supresiones/restricciones aprobadas posteriores al punto restaurado, invalidar cachés y comprobar medios y enlaces según su visibilidad. Conservar evidencia mínima de las decisiones necesaria para hacerlo; no proponer aquí un esquema nuevo ni copiar datos personales en el informe.

La prueba futura utiliza datos sintéticos: una cuenta/foto suprimida después del backup no vuelve a ser accesible tras recuperar; un archivo económico con conservación aprobada mantiene esa restricción y no reaparece en perfiles/marketing. Revisar también entregas antiguas, sesiones y secretos restaurados antes de reactivar servicios. Registrar backup/version, decisiones reaplicadas, controles, resultado y responsable, sin credenciales ni contenido privado. Este procedimiento no acredita un restore ni una supresión ejecutados.
