# Railway MVP Dockerfile v3.2 - Ultra-simplified for Railway
# Version: 3.2 - Use simplified settings and minimal startup
# Build: 2025-08-25 - Force Railway to rebuild
FROM python:3.12-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy Django app
COPY manage.py .
COPY realty/ ./realty/

# Set environment variables
ENV PYTHONPATH=/app
ENV DJANGO_SETTINGS_MODULE=realty.settings_railway
ENV PYTHONUNBUFFERED=1

# Collect static files for Whitenoise (STATIC_ROOT in settings_railway -> /app/staticfiles)
RUN mkdir -p /app/staticfiles && \
    python manage.py collectstatic --noinput

# Expose port
EXPOSE 8000

# Auto-apply migrations on start (always generate), then run Gunicorn with access logs
CMD ["sh","-c","python manage.py makemigrations --noinput; python manage.py migrate --noinput; gunicorn realty.wsgi:application --bind 0.0.0.0:8000 --workers 1 --timeout 60 --access-logfile - --error-logfile -"]
