# 🔥 Railway Frontend Dockerfile - CACHE BUSTER v0.1.2
# Полностью новая структура для принудительной пересборки
# Apollo Client ПОЛНОСТЬЮ УДАЛЕН - только REST API

# ================================
# Stage 1: Build Environment
# ================================  
FROM node:20-bullseye-slim AS builder

# Принудительная очистка кеша
ENV CACHE_BUST=2025-01-29-15-30
ENV NODE_ENV=production
ENV APOLLO_REMOVED=true

# Системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build

# Копирование конфигурационных файлов
COPY package.json ./
COPY lingui.config.js postcss.config.js tailwind.config.js tsconfig.json vite.config.ts ./

# Установка всех зависимостей включая devDependencies для сборки
RUN npm install --include=dev --legacy-peer-deps --no-fund --no-audit

# Копирование исходного кода
COPY src/ ./src/
COPY public/ ./public/
COPY index.html ./

# Сборка приложения (новый bundle без Apollo)  
RUN npm run build

# Диагностика: проверяем что было создано
RUN ls -la /build/dist/ && cat /build/dist/index.html

# ================================
# Stage 2: Production Server
# ================================
FROM nginx:1.25-alpine AS production

# Принудительные метки для нового образа
LABEL cache-bust="2025-01-29-15-30"
LABEL apollo-removed="true"
LABEL version="0.1.2"

# Установка curl для healthcheck
RUN apk add --no-cache curl

# Копирование собранного приложения
COPY --from=builder /build/dist /usr/share/nginx/html

# Копирование nginx конфигурации
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Настройка прав
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]