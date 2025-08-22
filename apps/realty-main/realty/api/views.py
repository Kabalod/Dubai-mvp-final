from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Avg, Count
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
import datetime

# Импорты только для OTP системы (MVP)
from .models import OTPCode

# Сериализаторы для MVP (только базовые)
from rest_framework import serializers

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=30, required=False)
    last_name = serializers.CharField(max_length=30, required=False)
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


# ========================================
# Health Check & System Info
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Simple health check endpoint for OTP system."""
    try:
        # Check database connectivity
        from django.db import connection
        cursor = connection.cursor()
        cursor.execute("SELECT 1")
        
        # Check OTP model
        otp_count = OTPCode.objects.count()
        
        return Response({
            'status': 'ok',
            'timestamp': timezone.now().isoformat(),
            'database': 'connected',
            'service': 'otp-api',
            'otp_codes_count': otp_count,
            'message': 'OTP system is running'
        })
        
    except Exception as e:
        return Response({
            'status': 'unhealthy',
            'timestamp': datetime.datetime.now().isoformat(),
            'error': str(e),
            'service': 'realty-api'
        }, status=500)


# ========================================
# Authentication API
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """User registration endpoint."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User created successfully',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """User login endpoint."""
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """User logout endpoint."""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({'message': 'Logout successful'})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


# ========================================
# OTP Authentication API
# ========================================

@api_view(['POST'])
@permission_classes([AllowAny])
def send_otp_code(request):
    """Отправка OTP кода на email."""
    email = request.data.get('email')
    
    if not email:
        return Response({
            'error': 'Email is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Очистка старых кодов
        OTPCode.cleanup_expired()
        
        # Удаляем предыдущие неиспользованные коды для этого email
        OTPCode.objects.filter(email=email, is_used=False).delete()
        
        # Создаём новый OTP код
        otp = OTPCode.objects.create(email=email)
        
        # Отправляем email с кодом
        subject = 'Ваш код подтверждения'
        message = f'''
Добро пожаловать в Dubai Real Estate!

Ваш код подтверждения: {otp.code}

Код действителен в течение 10 минут.
Если вы не запрашивали этот код, просто проигнорируйте это письмо.

С уважением,
Команда Dubai Real Estate
        '''
        
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'OTP code sent successfully',
            'email': email,
            'expires_in_minutes': 10
        })
        
    except Exception as e:
        return Response({
            'error': f'Failed to send OTP: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp_code(request):
    """Проверка OTP кода."""
    email = request.data.get('email')
    code = request.data.get('code')
    
    if not email or not code:
        return Response({
            'error': 'Email and code are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Очистка старых кодов
        OTPCode.cleanup_expired()
        
        # Ищем активный код
        otp = OTPCode.objects.filter(
            email=email,
            code=code,
            is_used=False
        ).first()
        
        if not otp:
            return Response({
                'error': 'Invalid or expired OTP code'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем валидность
        if not otp.is_valid():
            return Response({
                'error': 'OTP code has expired or exceeded maximum attempts'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Проверяем код
        if otp.code == code:
            # Код правильный
            otp.mark_as_used()
            
            # Создаём или получаем пользователя
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'is_active': True,
                }
            )
            
            # Генерируем JWT токены
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'OTP verification successful',
                'user_created': created,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        else:
            # Код неправильный
            otp.increment_attempts()
            return Response({
                'error': 'Invalid OTP code',
                'attempts_left': max(0, 3 - otp.attempts)
            }, status=status.HTTP_400_BAD_REQUEST)
            
    except Exception as e:
        return Response({
            'error': f'Verification failed: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ========================================
# MVP API Endpoints (Placeholder)
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def properties_list(request):
    """MVP: Placeholder for properties list."""
    return Response({
        'message': 'Properties API coming soon',
        'count': 0,
        'results': []
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def areas_list(request):
    """MVP: Placeholder for areas list."""
    return Response({
        'message': 'Areas API coming soon',
        'count': 0,
        'results': []
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def buildings_list(request):
    """MVP: Placeholder for buildings list."""
    return Response({
        'message': 'Buildings API coming soon',
        'count': 0,
        'results': []
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def analytics_summary(request):
    """MVP: Basic analytics with OTP stats."""
    otp_count = OTPCode.objects.count()
    active_otp_count = OTPCode.objects.filter(is_used=False).count()
    users_count = User.objects.count()
    
    return Response({
        'total_users': users_count,
        'total_otp_codes': otp_count,
        'active_otp_codes': active_otp_count,
        'message': 'MVP Analytics - OTP System Active'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def building_reports(request):
    """MVP: Placeholder for building reports."""
    return Response({
        'message': 'Building reports coming soon',
        'count': 0,
        'results': []
    })