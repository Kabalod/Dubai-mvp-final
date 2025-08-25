# Railway-optimized Dockerfile with minimal dependencies
FROM python:3.11-slim

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only essential files first
COPY requirements.railway-minimal.txt requirements.txt
COPY manage.py .
COPY realty/ ./realty/

# Install minimal dependencies for Railway
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --timeout 600 --retries 5 -r requirements.txt

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Run Django with gunicorn for production
CMD ["gunicorn", "realty.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "120"]
