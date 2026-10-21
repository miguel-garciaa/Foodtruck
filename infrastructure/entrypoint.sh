#!/bin/sh
set -eu
umask 077
if [ -n "${DB_PASSWORD_FILE:-}" ]; then
    DB_PASSWORD="$(cat "$DB_PASSWORD_FILE")"
    export DB_PASSWORD
fi
if [ -n "${APP_KEY_FILE:-}" ]; then
    APP_KEY="$(cat "$APP_KEY_FILE")"
    export APP_KEY
fi
exec "$@"
