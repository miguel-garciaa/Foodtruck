# Instrucciones de Foodtrucks para Codex

## Contexto y lectura por tarea

Este proyecto contiene documentación; inspecciona los archivos reales antes de asumir aplicación, Git, versiones, comandos o accesos. No inicialices código o infraestructura para aparentar una implementación.

Lee el [README](README.md), las decisiones y pendientes pertinentes de [23](docs/23-decisiones-pendientes.md) y las políticas aplicables de la tabla siguiente. Consulta [procedencia](docs/00-procedencia.md) solo para contexto histórico o conflictos; no leas los 49 documentos ni todo el historial por defecto. Las políticas enlazadas conservan sus reglas completas. Distingue confirmado, propuesto, pendiente y ejemplo; prevalece la instrucción explícita posterior del usuario.

## Stack y restricciones

- React Native + Expo + TypeScript móvil; Next.js web. Dock solo nativo, header/menú responsive web; claro/oscuro y accesibilidad. Los 120 FPS son objetivo adaptativo que exige medición.
- Laravel/PHP como backend principal por decisión expresa del 21/10/2026. Go reservado para necesidades específicas futuras, sin segundo backend ahora. PostgreSQL/PostGIS y Redis para Horizon; monorepo GitHub y monolito modular.
- Auth propia email/contraseña, Google y Apple; sin Supabase. Mapbox nativo/web; development build para módulos nativos. APNs/FCM, ActivityKit/Live Updates con Swift/Kotlin cuando proceda.
- Stripe Billing para licencia/mensualidad comercial; Connect para comida. Membresía cliente confirmada: **5,99 €/mes EUR**. Impuestos, beneficios y canal de cobro pendientes; tarifas comerciales ilustrativas nunca son defaults.
- Servidor doméstico DEV/PROD, Ubuntu Server 26.04, Compose/Caddy. VMware DEV: 4 vCPU/8 GB/40 GB; no dimensiona PROD. Fotos locales persistentes sin S3 y backups externos fuera del domicilio. Dominio en Cloudflare y correo Resend; foodtruck.bid comprado y DNS Resend verificado; clave de envío y Cloudflare Tunnel aplazados expresamente.

## Invariantes de trabajo

Prioriza correctitud, seguridad y simplicidad. KISS/YAGNI/DRY pragmáticos: dependencias, capas e interfaces solo con beneficio real. Avanza en trabajo autorizado y reversible; pregunta únicamente por decisiones que bloqueen el comportamiento afectado, sin repetir autorizaciones vigentes.

Laravel/PostgreSQL deciden importes enteros, moneda, stock, pagos, puntos y canjes. Autoriza cada acción/recurso, valida entradas y usa SQL parametrizado, constraints y transacciones. Reintentos económicos idempotentes y contexto Stripe correcto. Redis no concede permisos ni sustituye la autoridad duradera. QR opaco, protegido, hasheado y de canje único atómico; sin canje offline ni tokens en logs.

Secretos fuera de Git/frontend/logs; uploads con MIME real, límites, nombres y paths seguros. No desactivar TLS/CSRF sin fundamento, exponer DB/Redis, usar chmod 777, ejecutar comandos con entrada no validada ni borrar datos/volúmenes por una receta. Migraciones y recuperación siguen sus políticas. Pagar una membresía no concede consentimiento de marketing ni permisos del dispositivo.

## Fuentes por tarea

| Tarea | Consultar antes de actuar |
| --- | --- |
| Producto, flujos y membresía | [01](docs/01-producto-mvp.md), [02](docs/02-flujo-cliente.md), [03](docs/03-flujo-comerciante.md), [25](docs/25-suscripcion-clientes-fidelizacion.md) |
| Arquitectura, datos, API, pagos y auth | [07](docs/07-arquitectura-monorepo.md), [09](docs/09-backend-go.md), [10](docs/10-datos-postgresql-postgis.md), [11](docs/11-redis-cache.md), [13](docs/13-stripe.md), [14](docs/14-autenticacion.md), [20](docs/20-api.md) |
| Frontend y recursos | [04](docs/04-ux-ui.md), [05](docs/05-design-system.md), [06](docs/06-21st-dev-mcp.md), [08](docs/08-frontend.md), [12](docs/12-mapbox.md), [15](docs/15-notificaciones-tiempo-real.md), [16](docs/16-rendimiento.md), [45](docs/45-catalogo-21st-frontend.md), [46](docs/46-panel-admin-negocios-suscripciones.md), [47](docs/47-novedades-onboarding-permisos.md) |
| Entornos, entrega y operación | [21](docs/21-entornos-ci-cd.md), [44](docs/44-politica-commits-ci-cd-tests.md), [DevOps](docs/devops/README.md), [17](docs/17-infraestructura.md), [18](docs/18-media-backups-operacion.md), [29](docs/29-cloudflare-dominio-dns.md), [30](docs/30-correo-resend.md), [38](docs/38-servidor-domestico.md), [41](docs/41-observabilidad-grafana-prometheus-sentry.md) |
| Seguridad, pruebas y datos personales | [19](docs/19-seguridad.md), [39](docs/39-seguridad-devsecops.md), [40](docs/40-testing-qa-github.md); [48](docs/48-proteccion-datos-gobernanza.md) cuando haya datos personales |
| Marketing y costes | [27](docs/27-marketing-google-ads.md), [31](docs/31-marketing-digital-maestro.md), [32](docs/32-seo-local-nextjs.md), [33](docs/33-monetizacion-adsense-admob.md), [34](docs/34-analitica-consentimiento.md), [35](docs/35-aso-contenidos-roadmap-90-dias.md), [37](docs/37-costes-presupuesto.md) |

Evalúa recursos 21st.dev por necesidad, código/licencia y runtime antes del frontend visual; una demo web no es React Native ni una función aprobada. No inventes funciones, tarifas, datos, cumplimiento o resultados.

## Skills, verificación y entrega

Consulta solo el apartado pertinente de [skills](docs/26-skills-proyecto.md); lee la entrada completa y referencias necesarias de la skill elegida, sin recargarlas ni cargar todo el catálogo. Conserva las 37 skills base y cinco ECC del proyecto. Reutiliza fuentes de verdad existentes; las skills no cambian decisiones ni autorizan sus scripts o servicios externos.

Para cada cambio aplica [44](docs/44-politica-commits-ci-cd-tests.md): pruebas pertinentes y revisión, commit/push autorizado y CI del SHA vigente cuando existan Git/acceso. Staging automático; producción con aprobación manual del mismo artefacto verificado. No merge, force-push, publicación, gasto o mensajes a terceros por inferencia.

Informa cambios, comprobaciones realmente ejecutadas y límites. Ausencia de código/acceso no acredita tests, CI, despliegue o auditoría; indica la causa y los pasos apropiados al entorno real.
