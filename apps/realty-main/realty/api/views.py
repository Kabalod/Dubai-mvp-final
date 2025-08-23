from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsPaidUser, IsAdminUserStrict
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Q, Avg, Count
from django.http import JsonResponse, HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.core.mail import send_mail
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from django.conf import settings
import datetime
import json
import urllib.parse
import urllib.request
import os
import base64

# Импорты только для OTP системы (MVP)
from .models import OTPCode, UserProfile, SubscriptionPlan, UserSubscription, Payment, Report, PaymentEventAudit
from .providers import get_provider
from .serializers import ProfileSerializer, SubscriptionSerializer, ReportSerializer

# Сериализаторы для MVP (только базовые)
from rest_framework import serializers
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_me(request):
    user = request.user
    profile = getattr(user, 'profile', None)
    data = {
        'id': user.id,
        'email': user.email,
        'role': getattr(profile, 'role', UserProfile.ROLE_FREE),
    }
    return Response(ProfileSerializer(data).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_plan(request):
    """Заглушка апгрейда: переводит профиль в paid без платёжного провайдера."""
    user = request.user
    profile = getattr(user, 'profile', None)
    if not profile:
        profile = UserProfile.objects.create(user=user)
    if profile.role == UserProfile.ROLE_PAID:
        return Response({'message': 'Already paid', 'role': profile.role})
    profile.role = UserProfile.ROLE_PAID
    profile.save(update_fields=['role', 'updated_at'])

    return Response({'message': 'Upgraded to paid', 'role': profile.role})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_subscription(request):
    user = request.user
    sub = getattr(user, 'subscription', None)
    plan = sub.plan if sub else None
    payload = {
        'status': getattr(sub, 'status', 'free'),
        'plan': plan.name if plan else None,
        'price_aed': str(plan.price_aed) if plan else None,
        'valid_until': getattr(sub, 'valid_until', None),
        'payment_method': getattr(sub, 'payment_method', None),
        'last_payment_at': getattr(sub, 'last_payment_at', None),
    }
    return Response(SubscriptionSerializer(payload).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def mock_pay(request):
    """Создаёт платёж (заглушка) и активирует подписку на 30 дней."""
    user = request.user
    plan_code = request.data.get('plan', 'paid-30')
    method = request.data.get('method', 'mock')

    plan, _ = SubscriptionPlan.objects.get_or_create(
        code=plan_code,
        defaults={
            'name': 'Paid 30 days',
            'price_aed': 99,
            'period_days': 30,
        }
    )

    Payment.objects.create(
        user=user,
        plan=plan,
        amount_aed=plan.price_aed,
        method=method,
        provider='mock',
        status='succeeded'
    )

    from datetime import timedelta
    now = timezone.now()
    sub, _ = UserSubscription.objects.get_or_create(user=user)
    sub.plan = plan
    sub.status = UserSubscription.STATUS_ACTIVE
    sub.started_at = now
    sub.valid_until = now + timedelta(days=plan.period_days)
    sub.payment_method = method
    sub.last_payment_at = now
    sub.save()

    # Обновим роль профиля на paid
    profile = getattr(user, 'profile', None)
    if profile:
        profile.role = UserProfile.ROLE_PAID
        profile.save(update_fields=['role', 'updated_at'])

    return Response({'message': 'Payment succeeded', 'plan': plan.name, 'valid_until': sub.valid_until})

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
    """User registration endpoint (idempotent).

    Если пользователь уже создан на этапе OTP verify, обновляем его профиль
    и задаём пароль, возвращая токены. Иначе создаём нового.
    """
    data = request.data or {}
    email = data.get('email')
    username = data.get('username') or email
    password = data.get('password')
    first_name = data.get('first_name', '')
    last_name = data.get('last_name', '')

    if not email or not username or not password:
        return Response({'error': 'email, username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    # Ищем пользователя по username (email используется как username)
    user, created = User.objects.get_or_create(
        username=username,
        defaults={
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'is_active': True,
        },
    )

    # Обновляем поля и пароль в любом случае
    user.email = email or user.email
    user.first_name = first_name
    user.last_name = last_name
    if password:
        user.set_password(password)
    user.is_active = True
    user.save()

    refresh = RefreshToken.for_user(user)
    # Embed role claim into JWT
    refresh['role'] = getattr(user.profile, 'role', UserProfile.ROLE_FREE)

    return Response({
        'message': 'User created successfully' if created else 'User updated successfully',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': getattr(user.profile, 'role', UserProfile.ROLE_FREE),
        },
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


# ========================================
# Google OAuth (MVP)
# ========================================

@api_view(['GET'])
@permission_classes([AllowAny])
def google_login(request):
    """Возвращает ссылку на OAuth авторизацию Google"""
    client_id = os.environ.get('GOOGLE_CLIENT_ID') or getattr(settings, 'GOOGLE_CLIENT_ID', None)
    if not client_id:
        return Response({'error': 'Google OAuth is not configured'}, status=500)
    redirect_uri = request.build_absolute_uri('/api/auth/google/callback/')
    scope = 'openid email profile'
    auth_url = (
        'https://accounts.google.com/o/oauth2/v2/auth?'
        + urllib.parse.urlencode({
            'client_id': client_id,
            'redirect_uri': redirect_uri,
            'response_type': 'code',
            'scope': scope,
            'access_type': 'online',
            'prompt': 'select_account',
        })
    )
    return Response({'auth_url': auth_url})


@api_view(['GET'])
@permission_classes([AllowAny])
def google_callback(request):
    """Обрабатывает callback, обменивает code на токены и создаёт/логинит пользователя"""
    code = request.query_params.get('code')
    if not code:
        return Response({'error': 'Missing code'}, status=400)

    client_id = os.environ.get('GOOGLE_CLIENT_ID') or getattr(settings, 'GOOGLE_CLIENT_ID', None)
    client_secret = os.environ.get('GOOGLE_CLIENT_SECRET') or getattr(settings, 'GOOGLE_CLIENT_SECRET', None)
    redirect_uri = request.build_absolute_uri('/api/auth/google/callback/')
    if not client_id or not client_secret:
        return Response({'error': 'Google OAuth is not configured'}, status=500)

    token_req = urllib.request.Request(
        'https://oauth2.googleapis.com/token',
        data=urllib.parse.urlencode({
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }).encode(),
        headers={'Content-Type': 'application/x-www-form-urlencoded'},
    )
    with urllib.request.urlopen(token_req) as resp:
        token_data = json.loads(resp.read().decode())

    id_token = token_data.get('id_token')
    if not id_token:
        return Response({'error': 'No id_token from Google'}, status=400)

    # Простая валидация и парсинг id_token (без внешних зависимостей — в MVP)
    payload_part = id_token.split('.')[1]
    # Добавляем паддинг для base64
    padding = '=' * (-len(payload_part) % 4)
    payload_bytes = base64.urlsafe_b64decode((payload_part + padding).encode())
    payload = json.loads(payload_bytes.decode())
    email = payload.get('email')
    given_name = payload.get('given_name', '')
    family_name = payload.get('family_name', '')
    if not email:
        return Response({'error': 'email not provided by Google'}, status=400)

    user, _ = User.objects.get_or_create(
        username=email, defaults={'email': email, 'first_name': given_name, 'last_name': family_name, 'is_active': True}
    )
    refresh = RefreshToken.for_user(user)
    refresh['role'] = getattr(user.profile, 'role', UserProfile.ROLE_FREE)
    # Если задан URL фронтенда, делаем редирект с токенами в hash-параметрах
    frontend_url = os.environ.get('FRONTEND_CALLBACK_URL') or os.environ.get('FRONTEND_URL')
    if frontend_url:
        # Передаём данные через фрагмент, чтобы не попадали в логи
        from urllib.parse import urlencode
        fragment = urlencode({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'email': user.email or user.username,
        })
        return HttpResponseRedirect(f"{frontend_url}#{fragment}")

    return Response({
        'message': 'Google login success',
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'role': getattr(user.profile, 'role', UserProfile.ROLE_FREE),
        },
        'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token)},
    })


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
            refresh['role'] = getattr(user.profile, 'role', UserProfile.ROLE_FREE)
            
            return Response({
                'message': 'Login successful',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': getattr(user.profile, 'role', UserProfile.ROLE_FREE),
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
            refresh['role'] = getattr(user.profile, 'role', UserProfile.ROLE_FREE)
            
            return Response({
                'message': 'OTP verification successful',
                'user_created': created,
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'role': getattr(user.profile, 'role', UserProfile.ROLE_FREE),
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
@permission_classes([IsPaidUser])
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
@permission_classes([IsAdminUserStrict])
def reports_list(request):
    """Admin reports list with pagination and optional filters."""
    qs = Report.objects.all().order_by('-created_at')

    # Optional filters
    user_id = request.query_params.get('user_id')
    if user_id:
        qs = qs.filter(user_id=user_id)

    status_param = request.query_params.get('status')
    if status_param:
        qs = qs.filter(status=status_param)

    created_from = request.query_params.get('created_from')
    if created_from:
        dt_from = parse_datetime(created_from)
        if dt_from:
            qs = qs.filter(created_at__gte=dt_from)

    created_to = request.query_params.get('created_to')
    if created_to:
        dt_to = parse_datetime(created_to)
        if dt_to:
            qs = qs.filter(created_at__lte=dt_to)

    limit = int(request.query_params.get('limit', 20))
    offset = int(request.query_params.get('offset', 0))
    total = qs.count()
    items = qs[offset:offset+limit]
    return Response({
        'count': total,
        'limit': limit,
        'offset': offset,
        'results': ReportSerializer(items, many=True).data,
    })


# ========================================
# Billing Webhooks (provider-agnostic)
# ========================================


@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def billing_webhook(request, provider: str):
    """Универсальный вебхук для платежных провайдеров.

    Требования к заголовкам для Mock:
    - X-Mock-Signature: hex(hmac_sha256(secret, body))
    - X-Mock-Event-Id: уникальный ID события (опционально)
    - X-Idempotency-Key: опциональный ключ идемпотентности
    """
    raw_body = request.body or b''
    headers = {k.lower(): v for k, v in request.headers.items()}

    # Секрет берём из настроек окружения (не меняем ENV формат): MOCK_WEBHOOK_SECRET
    secret_env_key = 'MOCK_WEBHOOK_SECRET'
    secret = os.environ.get(secret_env_key)
    provider_impl = get_provider(provider, secret)

    if not provider_impl.verify_signature(raw_body, headers):
        return Response({'error': 'invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

    event_type, event_id, normalized = provider_impl.parse_event(raw_body, headers)
    idempotency_key = headers.get('x-idempotency-key')

    # Аудит: получить или создать запись. Идемпотентность по (provider, event_id)
    audit, created = PaymentEventAudit.objects.get_or_create(
        provider=provider,
        event_id=event_id,
        defaults={
            'event_type': event_type,
            'idempotency_key': idempotency_key,
            'signature': headers.get('x-mock-signature'),
            'payload': normalized,
            'status': PaymentEventAudit.STATUS_RECEIVED,
            'attempt_count': 0,
        }
    )

    if not created:
        # Уже обрабатывали — безопасно вернуть 200 (идемпотентность)
        return Response({'status': 'ok', 'idempotent': True, 'event_id': event_id})

    # Обработка событий без изменения публичного API
    try:
        audit.attempt_count += 1

        # Нормализация: ожидаем data.payment.external_id, amount, status
        data = normalized.get('data') or {}
        payment_external_id = None
        if isinstance(data, dict):
            payment_external_id = data.get('payment_external_id') or data.get('external_id') or data.get('id')

        payment_obj = None
        if payment_external_id:
            payment_obj = Payment.objects.filter(external_id=payment_external_id).first()
            audit.payment = payment_obj

        # Маппинг статусов провайдера в наши
        status_map = {
            'payment.pending': 'pending',
            'payment.succeeded': 'succeeded',
            'payment.failed': 'failed',
        }
        new_status = status_map.get(event_type)

        if payment_obj and new_status:
            # Обновляем только статусы/время оплаты — API не меняем
            if new_status == 'succeeded':
                payment_obj.status = 'succeeded'
            elif new_status == 'failed':
                payment_obj.status = 'failed'
            elif new_status == 'pending':
                payment_obj.status = 'pending'
            payment_obj.save(update_fields=['status'])

            # Сопутствующая подписка
            if payment_obj.user_id:
                sub, _ = UserSubscription.objects.get_or_create(user_id=payment_obj.user_id)
                if new_status == 'succeeded':
                    from datetime import timedelta
                    now = timezone.now()
                    plan = payment_obj.plan
                    days = getattr(plan, 'period_days', 30) or 30
                    sub.plan = plan
                    sub.status = UserSubscription.STATUS_ACTIVE
                    sub.started_at = now
                    sub.valid_until = now + timedelta(days=days)
                    sub.payment_method = payment_obj.method
                    sub.last_payment_at = now
                    sub.save()
                    # Роль профиля
                    profile = getattr(payment_obj.user, 'profile', None)
                    if profile:
                        profile.role = UserProfile.ROLE_PAID
                        profile.save(update_fields=['role', 'updated_at'])
                elif new_status == 'failed':
                    # Не активируем подписку; при желании можно метить expired
                    pass

        audit.status = PaymentEventAudit.STATUS_PROCESSED
        audit.processed_at = timezone.now()
        audit.save(update_fields=['attempt_count', 'status', 'processed_at', 'payment'])
        return Response({'status': 'ok', 'event_id': event_id})

    except Exception as e:
        audit.status = PaymentEventAudit.STATUS_FAILED
        audit.error = str(e)
        audit.save(update_fields=['attempt_count', 'status', 'error'])
        return Response({'error': 'processing failed'}, status=500)