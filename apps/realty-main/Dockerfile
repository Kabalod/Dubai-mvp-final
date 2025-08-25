# Railway MVP Dockerfile v3.1 - COMPLETE REBUILD REQUIRED
# Version: 3.1 - Force Railway to rebuild completely
# Build: 2025-08-25-18-30 - Force Railway to rebuild NOW
# Timestamp: 2025-08-25T18:30:00Z
# This is a completely new Dockerfile structure

FROM python:3.11-slim

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
ENV DJANGO_SETTINGS_MODULE=realty.settings

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && gunicorn realty.wsgi:application --bind 0.0.0.0:8000 --workers 2 --timeout 120"]
