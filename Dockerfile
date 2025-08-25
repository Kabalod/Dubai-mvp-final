# Root Dockerfile for Railway - redirects to apps/realty-main
# This file tells Railway where to find the actual application

FROM python:3.11-slim

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the realty-main directory
COPY apps/realty-main/ .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Run Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
