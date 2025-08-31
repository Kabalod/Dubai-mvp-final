# 🔥 Railway Frontend Dockerfile - CACHE BUSTER v0.1.3
# Полностью новая структура для принудительной пересборки
# Apollo Client ПОЛНОСТЬЮ УДАЛЕН - только REST API
# ЗАМЕНЕН nginx на Caddy для простоты

# ================================
# Stage 1: Build Environment
# ================================  
FROM node:20-bullseye-slim AS builder

# Принудительная очистка кеша
ENV CACHE_BUST=2025-01-29-18-00
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
LABEL cache-bust="2025-01-29-18-00"
LABEL apollo-removed="true"
LABEL caddy-replaced-nginx="true"
LABEL version="0.1.3"

# Копирование собранного приложения
COPY --from=builder /build/dist /usr/share/caddy

# Создание Caddyfile конфигурации
RUN echo '# 🚀 Caddy Configuration for Dubai MVP Frontend' > /etc/caddy/Caddyfile && \
    echo '# Простая и надежная замена nginx' >> /etc/caddy/Caddyfile && \
    echo '' >> /etc/caddy/Caddyfile && \
    echo ':80 {' >> /etc/caddy/Caddyfile && \
    echo '    # Корневая директория для React приложения' >> /etc/caddy/Caddyfile && \
    echo '    root * /usr/share/caddy' >> /etc/caddy/Caddyfile && \
    echo '    file_server' >> /etc/caddy/Caddyfile && \
    echo '    ' >> /etc/caddy/Caddyfile && \
    echo '    # React SPA маршрутизация' >> /etc/caddy/Caddyfile && \
    echo '    try_files {path} /index.html' >> /etc/caddy/Caddyfile && \
    echo '    ' >> /etc/caddy/Caddyfile && \
    echo '    # API endpoints - проксирование к backend' >> /etc/caddy/Caddyfile && \
    echo '    reverse_proxy /api/* https://workerproject-production.up.railway.app {' >> /etc/caddy/Caddyfile && \
    echo '        # Передаем заголовки' >> /etc/caddy/Caddyfile && \
    echo '        header_up Host {upstream_hostport}' >> /etc/caddy/Caddyfile && \
    echo '        header_up X-Real-IP {remote_host}' >> /etc/caddy/Caddyfile && \
    echo '        header_up X-Forwarded-For {remote_host}' >> /etc/caddy/Caddyfile && \
    echo '        header_up X-Forwarded-Proto {scheme}' >> /etc/caddy/Caddyfile && \
    echo '        ' >> /etc/caddy/Caddyfile && \
    echo '        # CORS заголовки' >> /etc/caddy/Caddyfile && \
    echo '        header_down Access-Control-Allow-Origin *' >> /etc/caddy/Caddyfile && \
    echo '        header_down Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"' >> /etc/caddy/Caddyfile && \
    echo '        header_down Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization"' >> /etc/caddy/Caddyfile && \
    echo '        ' >> /etc/caddy/Caddyfile && \
    echo '        # Настройки транспорта' >> /etc/caddy/Caddyfile && \
    echo '        transport http {' >> /etc/caddy/Caddyfile && \
    echo '            tls_insecure_skip_verify' >> /etc/caddy/Caddyfile && \
    echo '        }' >> /etc/caddy/Caddyfile && \
    echo '    }' >> /etc/caddy/Caddyfile && \
    echo '    ' >> /etc/caddy/Caddyfile && \
    echo '    # Статические файлы с кешированием' >> /etc/caddy/Caddyfile && \
    echo '    @static {' >> /etc/caddy/Caddyfile && \
    echo '        file' >> /etc/caddy/Caddyfile && \
    echo '        path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot' >> /etc/caddy/Caddyfile && \
    echo '    }' >> /etc/caddy/Caddyfile && \
    echo '    header @static Cache-Control "public, max-age=31536000, immutable"' >> /etc/caddy/Caddyfile && \
    echo '    ' >> /etc/caddy/Caddyfile && \
    echo '    # Health check endpoint' >> /etc/caddy/Caddyfile && \
    echo '    respond /health "healthy" 200' >> /etc/caddy/Caddyfile && \
    echo '}' >> /etc/caddy/Caddyfile

# Настройка прав
RUN chown -R 1000:1000 /usr/share/caddy && \
    chmod -R 755 /usr/share/caddy

# Порт
EXPOSE 80

# Запуск Caddy
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]