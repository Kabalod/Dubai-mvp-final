# Root Dockerfile for Railway monorepo: builds backend from apps/realty-main

FROM python:3.11-slim AS base

# Копируем весь репозиторий, затем переключимся в папку backend
WORKDIR /repo
COPY . /repo

# Переходим в директорию бэкенда внутри монорепо
WORKDIR /repo/apps/realty-main

# System deps required for psycopg and builds
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        libpq-dev \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Install python deps
RUN pip install --no-cache-dir --upgrade pip==25.2 setuptools wheel \
    && pip install --no-cache-dir -r requirements.txt \
    && pip install --no-cache-dir \
        djangorestframework==3.15.2 \
        djangorestframework-simplejwt==5.3.0 \
        django-cors-headers==4.6.0 \
        environs==11.2.1 \
        dj-database-url==2.3.0 \
        'psycopg[binary,pool]==3.2.9' \
        whitenoise==6.8.2

ENV DJANGO_SETTINGS_MODULE=realty.settings 
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Не запускаем миграции на старте (пустая БД / не нужны миграции)
CMD ["sh", "-c", "python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]


