# MVP Dockerfile для основного API сервиса (простая версия)
FROM python:3.11-slim

WORKDIR /app

# Копирование всего кода
COPY . .

# Установка зависимостей без системных пакетов
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir psycopg[binary] granian \
    && pip install --no-cache-dir django djangorestframework \
    && pip install --no-cache-dir django-cors-headers environs \
    && pip install --no-cache-dir sentry-sdk django-allauth \
    && pip install --no-cache-dir whitenoise pillow django-extensions \
    && pip install --no-cache-dir django-health-check

# Создание необходимых директорий
RUN mkdir -p /app/logs /app/media /app/static

# Простой запуск без entrypoint
ENV PYTHONPATH=/app

# Запуск приложения
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]