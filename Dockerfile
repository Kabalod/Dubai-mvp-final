# Root Dockerfile for Railway monorepo: builds backend from apps/realty-main

FROM python:3.11-slim AS base

WORKDIR /app

# Copy backend app into image
COPY apps/realty-main/ /app/

# Install deps (lean: rely on backend Dockerfile structure)
RUN pip install --no-cache-dir --upgrade pip==25.2 \
    && pip install --no-cache-dir -r api/requirements.txt \
    && pip install --no-cache-dir \
        djangorestframework==3.15.2 \
        djangorestframework-simplejwt==5.3.0 \
        django-cors-headers==4.6.0 \
        environs==11.2.1 \
        dj-database-url==2.3.0 \
        psycopg[binary,pool]==3.2.9 \
        whitenoise==6.8.2

ENV DJANGO_SETTINGS_MODULE=realty.settings 
ENV PYTHONDONTWRITEBYTECODE=1 
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && python manage.py runserver 0.0.0.0:8000"]


