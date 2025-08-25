# Dockerfile for Railway - copy everything first
# Alternative approach to avoid context issues

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy everything first to avoid context issues
COPY . .

# Verify that we have the right files
RUN ls && echo "Files copied successfully"

# Install Python dependencies from requirements.txt
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
