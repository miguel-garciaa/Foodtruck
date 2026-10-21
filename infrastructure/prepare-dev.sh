#!/bin/sh
# Run as miguel, never with sudo. Secrets stay outside Git and image layers.
set -eu
cd "$(dirname "$0")/.."
umask 077
mkdir -p .private/providers
for name in db-password app-password outbox-key; do
  if [ ! -f ".private/$name" ]; then
    od -An -N32 -tx1 /dev/urandom | tr -d ' \n' > ".private/$name"
  fi
done
if [ ! -f .private/app-key ]; then
  printf 'base64:' > .private/app-key
  head -c 32 /dev/urandom | base64 | tr -d '\n' >> .private/app-key
fi
if [ ! -f .private/providers.env ]; then
  printf '%s\n' 'RESEND_API_KEY=' 'MAIL_FROM_ADDRESS=' 'DEV_EMAIL_ALLOWLIST=' 'FOODTRUCKS_EMAIL_ENABLED=false' 'GOOGLE_WEB_CLIENT_ID=' 'FCM_PROJECT_ID=foodtrucks-dev' > .private/providers.env
fi
printf '%s\n' 'Configuración privada preparada. Proveedores vacíos: envíos deshabilitados hasta configurar.'
