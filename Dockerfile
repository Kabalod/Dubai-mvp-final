# Railway Dockerfile for Django Backend - v2.0 (cache bust)
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

# Minimal start for debugging - just Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

