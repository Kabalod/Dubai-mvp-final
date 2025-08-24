from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .health import health_check
from .views import (
    RegisterView,
    OTPLoginView,
    UserProfileView,
)

app_name = "api"

urlpatterns = [
    # Health
    path("health/", health_check, name="health_check"),

    # Auth (class-based)
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", OTPLoginView.as_view(), name="login"),
    path("auth/profile/", UserProfileView.as_view(), name="profile"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
