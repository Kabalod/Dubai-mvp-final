# MVP Dockerfile для основного API сервиса (ASGI + Granian)
FROM python:3.12

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование pyproject.toml и установка зависимостей
COPY pyproject.toml uv.lock ./
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -e .

# Копирование остального кода
COPY . .

# Создание необходимых директорий
RUN mkdir -p /shared-data \
    && mkdir -p /app/logs \
    && mkdir -p /app/media \
    && mkdir -p /app/static

# Создание пользователя для безопасности
RUN useradd --create-home --shell /bin/bash --uid 1000 app \
    && chown -R app:app /app \
    && chown -R app:app /shared-data

# Entrypoint script для инициализации
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "🚀 Starting Django API service..."\n\
\n\
# Wait for database\n\
if [ -n "${DATABASE_URL}" ]; then\n\
  echo "⏳ Waiting for database..."\n\
  while ! python -c "import psycopg; psycopg.connect(\"$DATABASE_URL\").close()" 2>/dev/null; do\n\
      echo "Database not ready, waiting..."\n\
      sleep 2\n\
  done\n\
  echo "✅ Database is ready"\n\
fi\n\
\n\
# Run migrations\n\
echo "📊 Running database migrations..."\n\
python manage.py migrate --noinput\n\
\n\
# Collect static files\n\
echo "📁 Collecting static files..."\n\
python manage.py collectstatic --noinput\n\
\n\
# Create superuser if needed (only in development)\n\
if [ "$DEBUG" = "1" ]; then\n\
    echo "👤 Creating superuser (if not exists)..."\n\
    python manage.py shell -c "\
from django.contrib.auth.models import User;\
if not User.objects.filter(username=\"admin\").exists():\
    User.objects.create_superuser(\"admin\", \"admin@example.com\", \"admin\")\
    print(\"Superuser created: admin/admin\")\
else:\
    print(\"Superuser already exists\")\
"\n\
fi\n\
\n\
echo "✅ Django API service ready"\n\
exec "$@"' > /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh \
    && chown app:app /app/entrypoint.sh

USER app

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Запуск приложения (Granian ASGI)
EXPOSE 8000
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["granian", "--interface", "asgi", "realty.asgi:application", "--host", "0.0.0.0", "--port", "8000"]