#!/bin/sh
# Administrative bootstrap only. Review the checkout first; this never starts a timer.
set -eu
test "$(id -u)" = 0 || { echo 'Ejecutar en una sesión administrativa local de la VM.' >&2; exit 1; }
test "$#" = 1 || { echo 'Uso: sudo sh infrastructure/ops/install.sh /ruta/checkout-revisado' >&2; exit 1; }
source_dir=$(realpath "$1")
test -f "$source_dir/AGENTS.md" && test -f "$source_dir/infrastructure/ops/ops.py"
command -v docker >/dev/null
command -v python3 >/dev/null
command -v restic >/dev/null || { echo 'Instalar restic desde los paquetes oficiales de Ubuntu antes de continuar.' >&2; exit 1; }
install -d -m 0755 /opt/foodtrucks/ops /opt/foodtrucks/runtime/infrastructure
install -d -m 0700 /etc/foodtrucks /etc/foodtrucks/registry /var/lib/foodtrucks-ops /var/backups/foodtrucks-restic
for file in ops.py restore.py; do
    install -o root -g root -m 0644 "$source_dir/infrastructure/ops/$file" "/opt/foodtrucks/ops/$file"
done
for file in compose.yaml compose.tunnel.yaml compose.release.yaml; do
    install -o root -g root -m 0644 "$source_dir/$file" "/opt/foodtrucks/runtime/$file"
done
for file in Caddyfile db-init.sh; do
    install -o root -g root -m 0644 "$source_dir/infrastructure/$file" "/opt/foodtrucks/runtime/infrastructure/$file"
done
if ! test -e /etc/foodtrucks/ops.json; then
    install -o root -g root -m 0600 "$source_dir/infrastructure/ops/ops.example.json" /etc/foodtrucks/ops.json
fi
for operation in agent monitor backup restore-check; do
    sed "s/@OPERATION@/$operation/g" "$source_dir/infrastructure/ops/systemd/foodtrucks-ops@.service" > "/etc/systemd/system/foodtrucks-ops-$operation.service"
    chmod 0644 "/etc/systemd/system/foodtrucks-ops-$operation.service"
done
for file in "$source_dir"/infrastructure/ops/systemd/*.timer; do
    install -o root -g root -m 0644 "$file" /etc/systemd/system/
done
systemctl daemon-reload
echo 'Instalación preparada, temporizadores sin activar. Completar y verificar docs/devops/README.md.'
