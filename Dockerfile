# 🔥 Railway Frontend Dockerfile - УПРОЩЕННАЯ ВЕРСИЯ v0.1.5
# Одноэтапная сборка для избежания проблем с копированием между stages
# Apollo Client ПОЛНОСТЬЮ УДАЛЕН - только REST API
# ЗАМЕНЕН nginx на Caddy для простоты
# MVP-146: FINAL FORCE REBUILD - CACHE_BUST=134

FROM node:25-bullseye-slim

# Принудительная очистка кеша
ARG CACHE_BUST=134
ENV CACHE_BUST=${CACHE_BUST}
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ARG APOLLO_REMOVED=true
ENV APOLLO_REMOVED=${APOLLO_REMOVED}
ARG BACKEND_URL=https://dubai.up.railway.app
ENV BACKEND_URL=${BACKEND_URL}
ARG VITE_DEMO_MODE=true
ENV VITE_DEMO_MODE=${VITE_DEMO_MODE}

# Метки для идентификации
LABEL cache-bust="2025-09-01-21-15-final-force"
LABEL apollo-removed="true"
LABEL caddy-replaced-nginx="true"
LABEL version="0.1.5"
LABEL single-stage="true"

# Системные зависимости
RUN apt-get update && apt-get install -y \
    git \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

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
RUN ls -la /app/dist/ && cat /app/dist/index.html

# Установка Caddy
RUN apt-get update && apt-get install -y curl && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg && \
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list && \
    apt-get update && apt-get install -y caddy && \
    rm -rf /var/lib/apt/lists/*

# Создание Caddyfile конфигурации (использует переменную окружения BACKEND_URL)
RUN echo '# 🚀 Caddy Configuration for Dubai MVP Frontend' > /etc/caddy/Caddyfile && \
    echo '# Простая и надежная замена nginx' >> /etc/caddy/Caddyfile && \
    echo '' >> /etc/caddy/Caddyfile && \
    echo ':{$PORT}, :80 {' >> /etc/caddy/Caddyfile && \
    echo '    # Router: сначала API, потом SPA' >> /etc/caddy/Caddyfile && \
    echo '    route {' >> /etc/caddy/Caddyfile && \
    echo '        # API → backend (сохраняем полный путь, не обрезаем /api)' >> /etc/caddy/Caddyfile && \
    echo '        handle /api/* {' >> /etc/caddy/Caddyfile && \
    echo '            reverse_proxy {$BACKEND_URL} {' >> /etc/caddy/Caddyfile && \
    echo '                header_up Host {upstream_hostport}' >> /etc/caddy/Caddyfile && \
    echo '                header_up X-Real-IP {remote_host}' >> /etc/caddy/Caddyfile && \
    # remove redundant header_up per Caddy defaults
    echo '                transport http {' >> /etc/caddy/Caddyfile && \
    echo '                    tls_insecure_skip_verify' >> /etc/caddy/Caddyfile && \
    echo '                }' >> /etc/caddy/Caddyfile && \
    echo '            }' >> /etc/caddy/Caddyfile && \
    echo '        }' >> /etc/caddy/Caddyfile && \
    echo '        # STATIC & MEDIA → backend (DRF browsable API, admin assets)' >> /etc/caddy/Caddyfile && \
    echo '        handle /static/* {' >> /etc/caddy/Caddyfile && \
    echo '            reverse_proxy {$BACKEND_URL}' >> /etc/caddy/Caddyfile && \
    echo '        }' >> /etc/caddy/Caddyfile && \
    echo '        handle /media/* {' >> /etc/caddy/Caddyfile && \
    echo '            reverse_proxy {$BACKEND_URL}' >> /etc/caddy/Caddyfile && \
    echo '        }' >> /etc/caddy/Caddyfile && \
    echo '        # SPA статика' >> /etc/caddy/Caddyfile && \
    echo '        handle {' >> /etc/caddy/Caddyfile && \
    echo '            root * /app/dist' >> /etc/caddy/Caddyfile && \
    echo '            try_files {path} /index.html' >> /etc/caddy/Caddyfile && \
    echo '            file_server' >> /etc/caddy/Caddyfile && \
    echo '            @html {' >> /etc/caddy/Caddyfile && \
    echo '                path /index.html' >> /etc/caddy/Caddyfile && \
    echo '            }' >> /etc/caddy/Caddyfile && \
    echo '            header @html Cache-Control "no-cache, no-store, must-revalidate"' >> /etc/caddy/Caddyfile && \
    echo '            @static {' >> /etc/caddy/Caddyfile && \
    echo '                file' >> /etc/caddy/Caddyfile && \
    echo '                path *.js *.css *.png *.jpg *.jpeg *.gif *.ico *.svg *.woff *.woff2 *.ttf *.eot' >> /etc/caddy/Caddyfile && \
    echo '            }' >> /etc/caddy/Caddyfile && \
    echo '            header @static Cache-Control "public, max-age=31536000, immutable"' >> /etc/caddy/Caddyfile && \
    echo '        }' >> /etc/caddy/Caddyfile && \
    echo '    }' >> /etc/caddy/Caddyfile && \
    echo '    # Health check endpoint' >> /etc/caddy/Caddyfile && \
    echo '    respond /health "healthy" 200' >> /etc/caddy/Caddyfile && \
    echo '}' >> /etc/caddy/Caddyfile

# Настройка прав
RUN chown -R 1000:1000 /app && \
    chmod -R 755 /app

# Порт
EXPOSE 80

# Запуск Caddy (явно указываем команду для Railway)
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]

# Альтернативная команда для отладки (закомментирована)
# CMD ["sh", "-c", "echo 'Starting Caddy...' && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]