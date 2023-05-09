FROM php:7.2-apache

COPY src/ /var/www/html

RUN apt-get update && apt-get install -y libpq-dev && docker-php-ext-install pdo pdo_pgsql

EXPOSE 80
