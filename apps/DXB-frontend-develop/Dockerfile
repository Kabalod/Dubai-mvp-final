# 🐳 Оптимизированный Dockerfile для React Frontend
# Версия: Production-Ready MVP
# Дата: 2025-01-23

# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS builder

# Метаданные
LABEL maintainer="kbalodk@gmail.com"
LABEL description="Dubai MVP Frontend - React + Vite + Ant Design"
LABEL version="1.0.0"

# Установка системных зависимостей
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++

# Рабочая директория
WORKDIR /app

# Копирование package files для кеширования
COPY package.json yarn.lock ./

# Включение corepack и установка зависимостей
RUN corepack enable \
    && yarn config set network-timeout 300000 \
    && yarn install --frozen-lockfile --production=false \
    && yarn cache clean

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN yarn build

# ================================
# Stage 2: Production
# ================================
FROM nginx:1.25-alpine AS production

# Метаданные
LABEL maintainer="kbalodk@gmail.com"
LABEL description="Dubai MVP Frontend - Production"
LABEL version="1.0.0"

# Установка дополнительных утилит
RUN apk add --no-cache \
    curl \
    tzdata

# Создание пользователя nginx
RUN addgroup -g 101 -S nginx \
    && adduser -S -D -H -u 101 -h /var/cache/nginx -s /sbin/nologin -G nginx -g nginx nginx

# Копирование собранного приложения
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Копирование конфигурации nginx
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf

# Создание директорий для nginx
RUN mkdir -p /var/cache/nginx/client_temp \
    && mkdir -p /var/cache/nginx/proxy_temp \
    && mkdir -p /var/cache/nginx/fastcgi_temp \
    && mkdir -p /var/cache/nginx/uwsgi_temp \
    && mkdir -p /var/cache/nginx/scgi_temp \
    && chown -R nginx:nginx /var/cache/nginx \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Переключение на непривилегированного пользователя
USER nginx

# Порт
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Команда запуска
CMD ["nginx", "-g", "daemon off;"]

# ================================
# Stage 3: Development (optional)
# ================================
FROM node:20-alpine AS development

WORKDIR /app

# Установка зависимостей для разработки
RUN apk add --no-cache git

# Копирование package files
COPY package.json yarn.lock ./

# Установка зависимостей
RUN corepack enable \
    && yarn install

# Копирование исходного кода
COPY . .

# Порт для разработки
EXPOSE 3000

# Команда для разработки
CMD ["yarn", "dev", "--host", "0.0.0.0"]

# ================================
# Stage 4: Final (default build target for PaaS)
# Ensure platforms that build the LAST stage use production image with Nginx
# ================================
FROM production AS final