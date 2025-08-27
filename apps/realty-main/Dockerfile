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

# Create staticfiles directory (collectstatic will run at runtime)
RUN mkdir -p /app/staticfiles

# Expose port
EXPOSE 8000

# Auto-apply migrations and collect static files on start, then run Gunicorn
CMD ["sh","-c","echo 'Starting Django production server...' && python manage.py collectstatic --noinput --clear && echo 'Starting Gunicorn...' && gunicorn realty.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 30 --max-requests 1000 --preload --access-logfile - --error-logfile - --log-level info"]
