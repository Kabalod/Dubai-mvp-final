# Ultra-minimal Dockerfile for Railway
# Version: 2.0 - Fixed dj-database-url dependency
FROM python:3.11-slim

WORKDIR /app

# Copy requirements first for caching
COPY requirements.txt .

# Install dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy only essential files
COPY manage.py .
COPY realty/ ./realty/

# Environment
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

# Simple startup
CMD ["gunicorn", "realty.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--timeout", "60"]
