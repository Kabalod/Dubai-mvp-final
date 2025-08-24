from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # Health Check
    path("health/", views.health_check, name="health_check"),
    
    # Authentication
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", views.OTPLoginView.as_view(), name="otp_login"),
    
    # User Profile
    path("profile/me/", views.UserProfileView.as_view(), name="user_profile"),
    
    # Admin Views
    path("admin/users/", views.UserProfileAdminView.as_view(), name="admin_users"),
    path("admin/payments/", views.PaymentAdminView.as_view(), name="admin_payments"),
    
    # Webhooks
    path("webhooks/stripe/", views.StripeWebhookView.as_view(), name="stripe_webhook"),
]
