# Railway Dockerfile for Django Backend - v4.0 (final fix)
# This Dockerfile is in the root directory to work with Railway's build system

FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements from the correct path
COPY apps/realty-main/requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Django app from the correct path
COPY apps/realty-main/manage.py .
COPY apps/realty-main/realty/ ./realty/

# Set environment variables
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=realty.settings_railway
ENV PYTHONUNBUFFERED=1

# Create staticfiles directory (collectstatic will run at runtime)
RUN mkdir -p /app/staticfiles

# Expose port
EXPOSE 8000

# Auto-apply migrations and collect static files on start, then run Gunicorn
CMD ["sh","-c","echo 'Starting Django production server...' && python manage.py collectstatic --noinput --clear && echo 'Starting Gunicorn...' && gunicorn realty.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 30 --max-requests 1000 --preload --access-logfile - --error-logfile - --log-level info"]
