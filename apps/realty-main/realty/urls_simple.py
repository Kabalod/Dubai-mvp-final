"""
Упрощенные URLs для Railway - ТОЛЬКО авторизация
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Простой корневой view
def root_view(request):
    return JsonResponse({
        "service": "dubai-auth-backend",
        "status": "ok",
        "version": "minimal",
        "endpoints": {
            "health": "/api/health/",
            "google_auth": "/api/auth/google/login/",
            "simple_auth": "/api/auth/login/"
        }
    })

urlpatterns = [
    # Корневая страница
    path("", root_view),
    
    # Health check
    path("healthz/", lambda request: JsonResponse({"status": "ok", "service": "auth-only"})),
    
    # API - только авторизация
    path("api/", include("realty.auth_urls")),
    
    # Admin (опционально)
    path("admin/", admin.site.urls),
]
