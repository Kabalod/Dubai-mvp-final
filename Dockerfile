# Dockerfile for Railway - copy everything first
# Alternative approach to avoid context issues

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy everything first to avoid context issues
COPY . .

# Verify that realty-main exists
RUN ls && ls apps/ && ls apps/realty-main/

# Move to realty-main directory
WORKDIR /app/apps/realty-main

# Install Python dependencies (only what's needed)
RUN pip install --no-cache-dir Django djangorestframework django-cors-headers

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=realty.settings
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Expose port
EXPOSE 8000

# Run Django
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
