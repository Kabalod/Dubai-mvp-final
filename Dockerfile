# 🐳 Оптимизированный Dockerfile для Django Backend Railway
# Версия: Production-Ready MVP
# Дата: 2025-08-25

FROM python:3.11-slim AS base

# Метаданные
LABEL maintainer="kbalodk@gmail.com"
LABEL description="Dubai MVP Backend - OTP Authentication System"
LABEL version="1.0.0"

# Системные зависимости
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Создание пользователя для безопасности
RUN groupadd -r django && useradd -r -g django django

# Рабочая директория
WORKDIR /app

# Копирование requirements (для кеширования слоёв)
COPY apps/realty-main/requirements.txt ./

# Установка Python зависимостей
RUN pip install --no-cache-dir --upgrade pip==25.2 \
    && pip install --no-cache-dir \
        # Database
        "psycopg[binary,pool]==3.2.9" \
        dj-database-url==2.3.0 \
        # Django Core
        django==4.2.17 \
        djangorestframework==3.15.2 \
        # Authentication
        djangorestframework-simplejwt==5.3.0 \
        # Validation (required by settings.py)
        marshmallow==3.21.3 \
        # CORS & Security
        django-cors-headers==4.6.0 \
        # Email
        django-anymail==13.0.0 \
        # Configuration (совместимая)
        environs==11.2.1 \
        # Additional (only if needed)
        python-dateutil==2.9.0.post0 \
        pillow==11.1.0 \
        whitenoise==6.8.2 \
        # Cache backend (для PROD совместимости)
        diskcache==5.6.3 \
        # Monitoring
        prometheus-client==0.20.0 \
        # Production server
        gunicorn==21.2.0 \
    && pip cache purge

# Копирование кода приложения
COPY apps/realty-main/ .

# Установка прав доступа
RUN chown -R django:django /app \
    && chmod +x /app/manage.py

# Переключение на непривилегированного пользователя
USER django

# Переменные окружения
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PORT=8000

# Порт
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Команда запуска для Railway: миграции + сбор статики + gunicorn
CMD ["sh", "-c", "python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && gunicorn realty.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120"]
