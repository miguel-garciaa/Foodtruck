#!/bin/sh
set -eu
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" --set=app_password="$(cat /run/secrets/app_password)" <<'SQL'
CREATE ROLE foodtrucks LOGIN PASSWORD :'app_password';
GRANT CONNECT ON DATABASE foodtrucks TO foodtrucks;
GRANT USAGE ON SCHEMA public TO foodtrucks;
ALTER DEFAULT PRIVILEGES FOR ROLE foodtrucks_migrator IN SCHEMA public GRANT SELECT,INSERT,UPDATE,DELETE ON TABLES TO foodtrucks;
ALTER DEFAULT PRIVILEGES FOR ROLE foodtrucks_migrator IN SCHEMA public GRANT USAGE ON SEQUENCES TO foodtrucks;
SQL
