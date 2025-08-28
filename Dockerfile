# 🐳 Railway Frontend Dockerfile - Принудительный режим
# Railway будет ОБЯЗАН использовать этот файл для сборки frontend
# Версия: Force-Deploy v1.0

# ================================
# Stage 1: Dependencies
# ================================
FROM node:20-alpine AS deps

# Метаданные
LABEL maintainer="kbalodk@gmail.com"
LABEL description="Dubai MVP Frontend - Railway Force Deploy"
LABEL version="1.0.0"

# Рабочая директория
WORKDIR /app

# Установка системных зависимостей
RUN apk add --no-cache git python3 make g++

# Копирование package files
COPY package.json yarn.lock* ./

# Настройка npm для стабильности
RUN npm config set registry https://registry.npmjs.org/ \
    && npm config set prefer-offline true

# Установка зависимостей
RUN npm install --legacy-peer-deps --prefer-offline --no-audit

# ================================
# Stage 2: Builder
# ================================
FROM deps AS builder

# Копирование node_modules из предыдущего stage
COPY --from=deps /app/node_modules ./node_modules

# Копирование исходного кода
COPY . .

# Сборка приложения
RUN npm run build

# ================================
# Stage 3: Production
# ================================
FROM nginx:1.25-alpine AS production

# Установка curl для healthcheck
RUN apk add --no-cache curl

# Копирование собранного приложения
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Копирование nginx конфигурации
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создание необходимых директорий
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run \
    && chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run \
    && chown -R nginx:nginx /usr/share/nginx/html \
    && chmod -R 755 /usr/share/nginx/html

# Порт
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]

# ================================
# Stage 4: Default (Production)
# ================================
FROM production
