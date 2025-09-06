"""
Упрощенные URLs для Railway - ТОЛЬКО авторизация (Усиленная безопасность)
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from . import auth_views

# Упрощенный корневой view, не раскрывающий внутренние эндпоинты
def root_view(request):
    return JsonResponse({
        "service": "dubai-auth-backend",
        "status": "ok",
        "version": "mvp-secure"
    })

urlpatterns = [
    # Корневая страница для health check
    path("", root_view, name="root"),
    
    # Стандартный health check
    path("healthz/", lambda request: JsonResponse({"status": "ok"}), name="healthz"),
    
    # Основные API эндпоинты для аутентификации
    path("api/health/", auth_views.health_check, name="health_check"),
    path("api/csrf/", auth_views.csrf_token_view, name="csrf_token"),
    path("api/auth/register/", auth_views.register_user, name="register"),
    path("api/auth/send-otp/", auth_views.send_otp, name="send_otp"),
    path("api/auth/verify-otp/", auth_views.verify_otp, name="verify_otp"),
    path("api/auth/google/login/", auth_views.google_auth_init, name="google_init"),
    path("api/auth/google/callback/", auth_views.google_auth_callback, name="google_callback"),
    path("api/auth/login/", auth_views.simple_login, name="simple_login"),
    
    # Удалены эндпоинты: /api/auth/force-login/, /api/stats/, /api/properties/
    # для повышения безопасности в продакшене.
    
    # Доступ к админ-панели Django
    path("admin/", admin.site.urls),
]
