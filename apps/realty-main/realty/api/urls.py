from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'api'

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # OTP Authentication
    path('auth/send-otp/', views.send_otp_code, name='send_otp_code'),
    path('auth/verify-otp/', views.verify_otp_code, name='verify_otp_code'),
    
    # Properties
    path('properties/', views.properties_list, name='properties_list'),
    path('areas/', views.areas_list, name='areas_list'),
    path('buildings/', views.buildings_list, name='buildings_list'),
    
    # Analytics
    path('analytics/', views.analytics_summary, name='analytics_summary'),
    path('reports/', views.building_reports, name='building_reports'),
]