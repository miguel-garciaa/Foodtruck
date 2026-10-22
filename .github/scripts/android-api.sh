#!/usr/bin/env bash
set -euo pipefail
test "$GITHUB_ACTIONS" = true
umask 077
mkdir -p .private/ci-tls
openssl req -x509 -newkey rsa:2048 -nodes -days 2 -subj '/CN=Foodtrucks CI localhost' \
  -addext 'subjectAltName=DNS:localhost' -addext 'basicConstraints=critical,CA:TRUE' \
  -keyout .private/ci-tls/key.pem -out .private/ci-tls/cert.pem 2>/dev/null
echo "FOODTRUCKS_CI_CERT=$GITHUB_WORKSPACE/.private/ci-tls/cert.pem" >> "$GITHUB_ENV"
cat > .private/android-api.env <<EOF
APP_ENV=testing
APP_DEBUG=false
APP_KEY=base64:$(openssl rand -base64 32)
APP_URL=https://localhost:8443
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_DATABASE=foodtrucks_testing
DB_USERNAME=postgres
DB_PASSWORD=ci-isolated-only
DB_URL=
REDIS_HOST=127.0.0.1
REDIS_DB=15
CACHE_STORE=array
SESSION_DRIVER=array
MAIL_MAILER=array
QUEUE_CONNECTION=database
FOODTRUCKS_EMAIL_ENABLED=false
FOODTRUCKS_CI=1
EOF
docker build --target checks -t foodtrucks-android-api .
docker run --rm --network host --env-file .private/android-api.env foodtrucks-android-api php artisan migrate --force
docker run --rm --network host --env-file .private/android-api.env foodtrucks-android-api php artisan db:seed --class=AndroidCiSeeder --force
docker run -d --name foodtrucks-android-api --network host --env-file .private/android-api.env foodtrucks-android-api php artisan serve --host=127.0.0.1 --port=8080
node .github/scripts/android-proxy.mjs > .private/android-proxy.log 2>&1 &
curl --fail --silent --retry 10 --retry-connrefused --retry-delay 1 --cacert .private/ci-tls/cert.pem https://localhost:8443/api/v1/foodtrucks | jq -e '.items | length == 2'
