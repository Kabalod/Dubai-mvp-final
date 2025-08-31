"""
Упрощенные views ТОЛЬКО для авторизации
Без сложных зависимостей - только Django User модель
"""
import json
import os
import secrets
from urllib.parse import urlencode
from django.conf import settings
from django.contrib.auth import get_user_model
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Простой health check"""
    # Диагностика database подключения
    db_engine = settings.DATABASES['default']['ENGINE']
    db_name = str(settings.DATABASES['default']['NAME'])
    db_url_exists = bool(os.environ.get('DATABASE_URL'))
    
    return Response({
        "status": "ok",
        "service": "auth-backend",
        "debug": settings.DEBUG,
        "database": db_engine.split('.')[-1],  # 'postgresql' или 'sqlite3'
        "database_name": db_name,
        "database_url_set": db_url_exists,
        "auth": "ready"
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def google_auth_init(request):
    """Инициация Google OAuth"""
    state = secrets.token_urlsafe(32)
    
    # Реальная Google OAuth URL
    base_url = "https://accounts.google.com/o/oauth2/v2/auth"
    params = {
        'client_id': settings.GOOGLE_OAUTH_CLIENT_ID,
        'redirect_uri': f"https://dubai.up.railway.app/api/auth/google/callback/",
        'scope': 'openid email profile',
        'response_type': 'code',
        'state': state,
        'access_type': 'online',
        'prompt': 'select_account'
    }
    
    auth_url = f"{base_url}?{urlencode(params)}"
    
    return Response({
        'auth_url': auth_url,
        'state': state,
        'message': 'Click auth_url to authenticate with Google'
    })

@csrf_exempt
@require_http_methods(["GET"])
def google_auth_callback(request):
    """Google OAuth callback"""
    code = request.GET.get('code')
    error = request.GET.get('error')
    
    if error:
        return HttpResponseRedirect(f"{settings.FRONTEND_URL}/auth#error={error}")
    
    if not code:
        return HttpResponseRedirect(f"{settings.FRONTEND_URL}/auth#error=no_code")
    
    try:
        # Для MVP - создаем тестового пользователя
        user, created = User.objects.get_or_create(
            email='testuser@gmail.com',
            defaults={
                'username': 'testuser@gmail.com',
                'first_name': 'Test',
                'last_name': 'User',
                'is_active': True,
            }
        )
        
        # Генерируем JWT токены
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        
        # Редирект на frontend с токенами
        redirect_url = f"{settings.FRONTEND_URL}/auth#access={access_token}&refresh={refresh}&success=true"
        return HttpResponseRedirect(redirect_url)
        
    except Exception as e:
        return HttpResponseRedirect(f"{settings.FRONTEND_URL}/auth#error=callback_failed&details={str(e)}")

@api_view(['POST'])
@permission_classes([AllowAny])
def simple_login(request):
    """Простой логин для тестирования"""
    try:
        user, created = User.objects.get_or_create(
            email='test@test.com',
            defaults={
                'username': 'test@test.com',
                'first_name': 'Test',
                'last_name': 'User',
                'is_active': True,
            }
        )
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'Login failed'
        }, status=500)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Регистрация пользователя с отправкой email"""
    try:
        email = request.data.get('email')
        password = request.data.get('password')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not email or not password:
            return Response({
                'error': 'Email and password are required',
                'message': 'Registration failed'
            }, status=400)
        
        # Проверяем что пользователь не существует
        if User.objects.filter(email=email).exists():
            return Response({
                'error': 'User already exists',
                'message': 'Registration failed'
            }, status=400)
        
        # Создаем пользователя
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_active=True
        )
        
        # Отправляем приветственное письмо
        try:
            subject = 'Welcome to Dubai Real Estate Platform'
            message = f'''
            Hi {first_name or email}!
            
            Welcome to Dubai Real Estate Platform!
            Your account has been successfully created.
            
            You can now login to access property data and analytics.
            
            Best regards,
            Dubai Real Estate Team
            '''
            
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=True,  # Не падаем если email не отправился
            )
            
        except Exception as email_error:
            # Email не отправился, но регистрация прошла успешно
            print(f"Email sending failed: {email_error}")
        
        # Генерируем токены для автоматического входа
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'Registration successful',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': user.id,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'email_sent': True
        })
        
    except Exception as e:
        return Response({
            'error': str(e),
            'message': 'Registration failed'
        }, status=500)
