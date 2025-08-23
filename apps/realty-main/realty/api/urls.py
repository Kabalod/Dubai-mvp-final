from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    health_check,
    RegisterView,
    OTPLoginView,
    UserProfileView,
    StripeWebhookView,
    UserProfileAdminView,
    PaymentAdminView,
    analytics_summary,
    reports_list,
)

app_name = "api"

urlpatterns = [
    # Health & metrics
    path("health/", health_check, name="health_check"),

    # Auth (class-based)
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/login/", OTPLoginView.as_view(), name="login"),
    path("auth/profile/", UserProfileView.as_view(), name="profile"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Webhooks (class-based)
    path("webhooks/stripe/", StripeWebhookView.as_view(), name="stripe_webhook"),

    # Admin (read-only, class-based list views)
    path("admin/users/", UserProfileAdminView.as_view(), name="admin_users"),
    path("admin/payments/", PaymentAdminView.as_view(), name="admin_payments"),

    # Analytics & reports (function-based retained)
    path("analytics/", analytics_summary, name="analytics_summary"),
    path("reports/", reports_list, name="reports_list"),
]
