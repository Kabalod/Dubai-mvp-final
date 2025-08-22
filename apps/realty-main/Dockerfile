# Минимальный Dockerfile только для OTP системы
FROM python:3.11-slim

WORKDIR /app
COPY . .

# Все необходимые зависимости (найдены комплексной проверкой)
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir psycopg[binary] \
    && pip install --no-cache-dir django==4.2.* djangorestframework \
    && pip install --no-cache-dir django-cors-headers \
    && pip install --no-cache-dir djangorestframework-simplejwt \
    && pip install --no-cache-dir django-anymail \
    && pip install --no-cache-dir environs dj-database-url \
    && pip install --no-cache-dir django-allauth python-dateutil \
    && pip install --no-cache-dir django-lifecycle django-tasks \
    && pip install --no-cache-dir falco-app strawberry-graphql-django

ENV PYTHONPATH=/app
EXPOSE 8000

# Запуск с миграциями
CMD ["sh", "-c", "python manage.py migrate --run-syncdb && python manage.py runserver 0.0.0.0:8000"]