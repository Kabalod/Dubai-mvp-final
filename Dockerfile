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
    && pip install --no-cache-dir -r requirements.txt

ENV DJANGO_SETTINGS_MODULE=realty.settings 
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

# Запуск Django для MVP
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


