"""
Упрощенные URLs для Railway - ТОЛЬКО авторизация
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from . import auth_views

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
    
    # API - прямое подключение auth views
    path("api/health/", auth_views.health_check, name="health_check"),
    path("api/auth/register/", auth_views.register_user, name="register"),
    path("api/auth/google/login/", auth_views.google_auth_init, name="google_init"),
    path("api/auth/google/callback/", auth_views.google_auth_callback, name="google_callback"),
    path("api/auth/login/", auth_views.simple_login, name="simple_login"),
    
    # Admin (опционально)
    path("admin/", admin.site.urls),
]
