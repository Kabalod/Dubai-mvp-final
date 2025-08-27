# Railway MVP Dockerfile v4.0 - Final production version  
# Version: 4.0 - Direct Gunicorn start without migrations/collectstatic
# Build: 2025-08-28 - Force complete cache rebuild
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

# Start Gunicorn directly - migrations already applied
CMD ["sh","-c","echo 'Starting Gunicorn server...' && gunicorn realty.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120 --access-logfile - --error-logfile - --log-level info"]
