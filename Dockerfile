# Ultra-minimal Dockerfile for Railway
FROM python:3.11-slim

WORKDIR /app

# Copy only essential files
COPY apps/realty-main/manage.py .
COPY apps/realty-main/realty/ ./realty/

# Install only core dependencies
RUN pip install --no-cache-dir \
    django>=4.2 \
    djangorestframework>=3.15 \
    psycopg[binary]>=3.2 \
    django-cors-headers>=4.7 \
    environs>=11.2 \
    gunicorn>=21.2

# Environment
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Simple startup
CMD ["gunicorn", "realty.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--timeout", "60"]
