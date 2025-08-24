from django.urls import path
from . import views

app_name = "api"

urlpatterns = [
    # Health Check
    path("health/", views.health_check, name="health_check"),
    
    # Authentication
    path("auth/register/", views.RegisterView.as_view(), name="register"),
    path("auth/login/", views.PasswordLoginView.as_view(), name="password_login"),  # Обычный логин для тестовых пользователей
    
    # OTP Authentication - полный цикл
    path("auth/send-otp/", views.SendOTPView.as_view(), name="send_otp"),  # Отправка OTP кода
    path("auth/verify-otp/", views.VerifyOTPView.as_view(), name="verify_otp"),  # Верификация OTP кода
    path("auth/otp-login/", views.OTPLoginView.as_view(), name="otp_login"),  # Legacy OTP логин
    
    # Google OAuth
    path("auth/google/login/", views.GoogleAuthInitView.as_view(), name="google_auth_init"),
    path("auth/google/callback/", views.GoogleAuthCallbackView.as_view(), name="google_auth_callback"),
    
    # User Profile
    path("profile/me/", views.UserProfileView.as_view(), name="user_profile"),
    
    # Properties API (Mock Data)
    path("properties/", views.PropertiesListView.as_view(), name="properties_list"),
    path("properties/<str:listing_id>/", views.PropertyDetailView.as_view(), name="property_detail"),
    path("areas/", views.AreasListView.as_view(), name="areas_list"),
    path("stats/", views.PropertyStatsView.as_view(), name="property_stats"),
    
    # Admin Views
    path("admin/users/", views.UserProfileAdminView.as_view(), name="admin_users"),
    path("admin/payments/", views.PaymentAdminView.as_view(), name="admin_payments"),
    
    # Webhooks
    path("webhooks/stripe/", views.StripeWebhookView.as_view(), name="stripe_webhook"),
]
