# MVP Dockerfile для парсера PropertyFinder
FROM python:3.12-slim

WORKDIR /app

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements
COPY requirements.txt .

# Установка Python зависимостей
RUN pip install --no-cache-dir -r requirements.txt

# Копирование кода приложения
COPY . .

# Создание shared-data директории
RUN mkdir -p /shared-data

# Создание пользователя (безопасность)
RUN useradd --create-home --shell /bin/bash app \
    && chown -R app:app /app \
    && chown -R app:app /shared-data

USER app

# Health check
HEALTHCHECK --interval=60s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/admin/ || exit 1

# Запуск приложения
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]