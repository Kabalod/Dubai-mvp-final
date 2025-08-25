# Railway-optimized Dockerfile with pip fallback strategy
FROM python:3.11-slim

# Install system dependencies first
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy only essential files first
COPY requirements.txt .
COPY manage.py .
COPY realty/ ./realty/

# Railway-optimized pip installation with fallback
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --timeout 300 --retries 3 -r requirements.txt || \
    (echo "Primary pip install failed, trying alternative..." && \
     pip install --no-cache-dir --timeout 600 --retries 5 \
        Django>=5.1 \
        djangorestframework>=3.15 \
        psycopg[binary]>=3.2 \
        django-cors-headers>=4.7 \
        environs[django]>=11.2 \
        whitenoise>=6.8 \
        marshmallow>=3.20)

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/api/health/ || exit 1

# Run Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
