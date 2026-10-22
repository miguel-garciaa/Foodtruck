# Seguridad de las dependencias móviles

La instalación sigue usando npm y el lockfile del SDK 58. No se cambia Expo/React Native ni se incorporan forks remotos.

| Aviso | Corrección aplicada |
| --- | --- |
| [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), braces 3.0.3 | Límite de profundidad 100 en parser y walkers, incluidos AST externos; exceso rechazado con SyntaxError. |
| [GHSA-86w9-cpqp-85rv](https://github.com/advisories/GHSA-86w9-cpqp-85rv), node-forge 1.4.0 | Validar el número de elementos del DigestAlgorithm anidado; se conservan firmas válidas con NULL u omitido. |
| [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq), uuid | Override limitado a xcode: uuid 11.1.1, compatible con require y su uso de v4. Lockfile con integridad del tarball. |

El 22/10/2026 los dos primeros avisos no tienen versión corregida publicada en sus fichas oficiales. Se trasladan los cambios de código de [braces PR 78, commit 97308a01d091b211cf015314a2d0696da28a5392](https://github.com/micromatch/braces/pull/78) y [forge PR 1152, commit ceba34402e329f0365134f23fe19898756527d65](https://github.com/digitalbazaar/forge/pull/1152) a las versiones instaladas. Son propuestas upstream pendientes de aprobación, no releases oficiales. Se conservan las licencias MIT de braces y BSD-3-Clause/GPL-2.0 de node-forge presentes en sus paquetes.

## Instalación y verificación

~~~sh
npm ci
npm run security:audit
~~~

postinstall aplica los parches de dependency-patches.json. Antes de escribir comprueba la versión y el Git blob de cada archivo original; una segunda instalación reconoce únicamente el parche exacto. Un archivo alterado o una versión distinta bloquea el proceso. No se descargan parches ni se modifican los números de versión para alterar el resultado del escáner. No usar --ignore-scripts para preparar la app: security:check detecta una instalación sin parche.

security:audit verifica las fuentes instaladas, ejecuta regresiones y conserva el JSON completo de npm audit --audit-level=high. npm sigue señalando las versiones originales porque desconoce los cambios locales. El control admite únicamente esos dos identificadores cuando cada fuente coincide con el parche y todas las rutas señaladas corresponden al paquete comprobado. Resuelve también los avisos propagados por Expo/Metro; un aviso nuevo, copia anidada sin parche, informe incompleto, error del escáner o riesgo alto/crítico pendiente bloquea CI. Los avisos moderados conservan el umbral existente y permanecen visibles.

Las pruebas cubren profundidad maliciosa y patrones normales, AST externos, firmas válidas e inválidas, reproducción RSA sin parche, generación de identificadores con xcode/uuid, idempotencia, alteraciones y casos negativos del gate. CI comprueba además compatibilidad Expo y exportación Android/Hermes, junto con los tipos, lint, formato y catálogo existentes. Exportar JavaScript no acredita una compilación nativa ni QA en teléfono.

## Mantenimiento y alcance

Responsable de revisión: mantenedor de esta rama/PR. Revisar y sustituir por releases oficiales antes del **21/11/2026**; security:audit bloquea desde esa fecha si no se ha revisado la solución. Para retirar cada parche, actualizar su dependencia y lockfile, comprobar la corrección con las regresiones y eliminar únicamente su entrada/remediación temporal. No prolongar el plazo sin revisar upstream, alcance y pruebas.

braces se usa a través de micromatch/Metro para patrones de archivos. El parche limita la recursión; no convierte patrones arbitrarios en operaciones de CPU/memoria acotadas. node-forge llega por las herramientas de certificados/firma de Expo. Mantener Metro local y las fuentes de confianza sigue siendo necesario. Esta corrección de dependencias no acredita una auditoría completa de la aplicación ni autoriza producción.
