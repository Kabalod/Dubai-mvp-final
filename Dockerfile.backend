# Railway Dockerfile for Django Backend - v4.1 (cache bust)
# This Dockerfile is in the root directory to work with Railway's build system

FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements from apps/realty-main/ and install Python dependencies
COPY apps/realty-main/requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Django app from apps/realty-main/
COPY apps/realty-main/manage.py .
COPY apps/realty-main/realty/ ./realty/

# Set environment variables
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=realty.settings_railway_simple
ENV PYTHONUNBUFFERED=1

# Create staticfiles directory
RUN mkdir -p /app/staticfiles

# Expose port (Railway will set PORT variable)
EXPOSE ${PORT:-8000}

# Start Gunicorn directly - migrations already applied
CMD ["sh","-c","echo 'Starting Gunicorn server...' && gunicorn realty.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 --access-logfile - --error-logfile - --log-level info"]
