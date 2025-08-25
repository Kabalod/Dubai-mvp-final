from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection
from django.core.cache import cache
import redis
import os


@csrf_exempt
@require_http_methods(["GET"])
def health_check(request):
    """
    Simple health check endpoint for Railway
    """
    health_status = {
        "status": "healthy",
        "timestamp": None,
        "services": {}
    }
    
    # Check database
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_status["services"]["database"] = "healthy"
    except Exception as e:
        health_status["services"]["database"] = f"unhealthy: {str(e)}"
        health_status["status"] = "unhealthy"
    
    # Check Redis (if configured)
    try:
        redis_url = os.environ.get('REDIS_URL')
        if redis_url:
            r = redis.from_url(redis_url)
            r.ping()
            health_status["services"]["redis"] = "healthy"
        else:
            health_status["services"]["redis"] = "not configured"
    except Exception as e:
        health_status["services"]["redis"] = f"unhealthy: {str(e)}"
        if redis_url:  # Only mark as unhealthy if Redis is configured
            health_status["status"] = "unhealthy"
    
    # Check environment
    health_status["services"]["environment"] = {
        "debug": os.environ.get('DEBUG', 'False'),
        "django_settings": os.environ.get('DJANGO_SETTINGS_MODULE', 'Not set'),
        "port": os.environ.get('PORT', 'Not set')
    }
    
    # Set timestamp
    from django.utils import timezone
    health_status["timestamp"] = timezone.now().isoformat()
    
    # Return appropriate status code
    status_code = 200 if health_status["status"] == "healthy" else 503
    
    return JsonResponse(health_status, status=status_code)
