# Ультра-минимальный Dockerfile для Railway
FROM python:3.11-slim

WORKDIR /app
COPY . .

# Только критически важные зависимости
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir psycopg[binary] \
    && pip install --no-cache-dir django djangorestframework \
    && pip install --no-cache-dir django-cors-headers \
    && pip install --no-cache-dir djangorestframework-simplejwt \
    && pip install --no-cache-dir django-anymail \
    && pip install --no-cache-dir environs dj-database-url

ENV PYTHONPATH=/app
EXPOSE 8000

# Простой запуск без миграций (пока)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]