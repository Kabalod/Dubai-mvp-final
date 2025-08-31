# 🔥 Railway Frontend Dockerfile - CACHE BUSTER v0.1.3
# Полностью новая структура для принудительной пересборки
# Apollo Client ПОЛНОСТЬЮ УДАЛЕН - только REST API
# ЗАМЕНЕН nginx на Caddy для простоты

# ================================
# Stage 1: Build Environment
# ================================  
FROM node:20-bullseye-slim AS builder

# Принудительная очистка кеша
ENV CACHE_BUST=2025-01-29-16-30
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
# Stage 2: Production Server (Caddy)
# ================================
FROM caddy:2-alpine AS production

# Принудительные метки для нового образа
LABEL cache-bust="2025-01-29-17-00"
LABEL apollo-removed="true"
LABEL caddy-replaced-nginx="true"
LABEL version="0.1.3"

# Копирование собранного приложения
COPY --from=builder /build/dist /usr/share/caddy

# Копирование Caddyfile конфигурации
COPY Caddyfile /etc/caddy/Caddyfile

# Настройка прав
RUN chown -R 1000:1000 /usr/share/caddy && \
    chmod -R 755 /usr/share/caddy

# Порт
EXPOSE 80

# Запуск Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]