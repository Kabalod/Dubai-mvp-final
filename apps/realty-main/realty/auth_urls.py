"""
Упрощенные URLs ТОЛЬКО для авторизации
"""
from django.urls import path
from . import auth_views

app_name = "auth"

urlpatterns = [
    # Health Check
    path("health/", auth_views.health_check, name="health_check"),
    
    # User Registration with Email
    path("auth/register/", auth_views.register_user, name="register_user"),
    
    # Google OAuth
    path("auth/google/login/", auth_views.google_auth_init, name="google_auth_init"),
    path("auth/google/callback/", auth_views.google_auth_callback, name="google_auth_callback"),
    
    # Simple auth for testing
    path("auth/login/", auth_views.simple_login, name="simple_login"),
]
