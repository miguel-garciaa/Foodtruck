# syntax=docker/dockerfile:1
FROM php:8.5.12-fpm-bookworm AS php-base
RUN apt-get update && apt-get install -y --no-install-recommends libpq-dev libicu-dev libpng-dev libjpeg62-turbo-dev libfreetype6-dev libzip-dev unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j2 pdo_pgsql intl gd exif bcmath pcntl posix zip \
    && pecl install redis-6.3.0 && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/* /tmp/pear
COPY --from=composer:2.9.7 /usr/bin/composer /usr/local/bin/composer
WORKDIR /app
COPY infrastructure/php.ini /usr/local/etc/php/conf.d/foodtrucks.ini
COPY infrastructure/fpm.conf /usr/local/etc/php-fpm.d/zz-foodtrucks.conf
COPY infrastructure/entrypoint.sh /usr/local/bin/foodtrucks-entrypoint
RUN chmod 755 /usr/local/bin/foodtrucks-entrypoint
ENTRYPOINT ["foodtrucks-entrypoint"]

FROM php-base AS dependencies
COPY backend/composer.json backend/composer.lock ./
RUN --mount=type=cache,target=/root/.composer/cache composer install --no-dev --no-scripts --prefer-dist --no-interaction --no-progress

FROM php-base AS checks
COPY backend/composer.json backend/composer.lock ./
RUN --mount=type=cache,target=/root/.composer/cache composer install --no-scripts --prefer-dist --no-interaction --no-progress
COPY backend/ ./
COPY contracts/ /contracts/
RUN composer dump-autoload --no-interaction && composer check-platform-reqs
CMD ["php", "artisan", "test"]

FROM php-base AS runtime
RUN groupmod -g 1000 www-data && usermod -u 1000 -g 1000 www-data
COPY --chown=www-data:www-data backend/ ./
COPY --from=dependencies --chown=www-data:www-data /app/vendor ./vendor
RUN composer dump-autoload --no-dev --no-interaction && composer check-platform-reqs --no-dev \
    && mkdir -p storage/app/private/media storage/framework/cache/data storage/framework/sessions storage/framework/views \
    && chown -R www-data:www-data storage bootstrap/cache
USER www-data
EXPOSE 9000
CMD ["php-fpm", "-F"]
