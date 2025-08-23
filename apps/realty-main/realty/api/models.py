import random
import string
from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db.models import JSONField


class OTPCode(models.Model):
    """Модель для хранения OTP кодов"""
    
    email = models.EmailField()
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_used = models.BooleanField(default=False)
    attempts = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'api_otp_codes'
        ordering = ['-created_at']
    
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_code()
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(minutes=10)  # 10 минут
        super().save(*args, **kwargs)
    
    @staticmethod
    def generate_code():
        """Генерация 6-значного цифрового кода"""
        return ''.join(random.choices(string.digits, k=6))
    
    def is_valid(self):
        """Проверка действительности кода"""
        return (
            not self.is_used and 
            timezone.now() < self.expires_at and 
            self.attempts < 3
        )
    
    def mark_as_used(self):
        """Отметить код как использованный"""
        self.is_used = True
        self.save()
    
    def increment_attempts(self):
        """Увеличить счётчик попыток"""
        self.attempts += 1
        self.save()
    
    @classmethod
    def cleanup_expired(cls):
        """Удалить истёкшие коды"""
        cls.objects.filter(expires_at__lt=timezone.now()).delete()
    
    def __str__(self):
        return f"OTP {self.code} for {self.email}"


# ========================================
# User Profile & Roles
# ========================================


class UserProfile(models.Model):
    ROLE_FREE = 'free'
    ROLE_PAID = 'paid'
    ROLE_ADMIN = 'admin'

    ROLE_CHOICES = [
        (ROLE_FREE, 'Free'),
        (ROLE_PAID, 'Paid'),
        (ROLE_ADMIN, 'Admin'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=16, choices=ROLE_CHOICES, default=ROLE_FREE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_user_profile'

    def __str__(self) -> str:
        return f"Profile<{self.user_id}:{self.role}>"


@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance: User, created: bool, **kwargs):
    """Ensure every user has a profile with a default role."""
    profile, _ = UserProfile.objects.get_or_create(user=instance)
    # Admin role follows Django flags
    if instance.is_superuser:
        if profile.role != UserProfile.ROLE_ADMIN:
            profile.role = UserProfile.ROLE_ADMIN
            profile.save(update_fields=["role", "updated_at"])


# ========================================
# Billing models (plans, subscriptions, payments)
# ========================================


class SubscriptionPlan(models.Model):
    code = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=100)
    price_aed = models.DecimalField(max_digits=10, decimal_places=2)
    period_days = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'api_subscription_plan'

    def __str__(self) -> str:
        return f"{self.name} ({self.price_aed} AED/{self.period_days}d)"


class UserSubscription(models.Model):
    STATUS_FREE = 'free'
    STATUS_ACTIVE = 'active'
    STATUS_EXPIRED = 'expired'

    STATUS_CHOICES = [
        (STATUS_FREE, 'Free'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_EXPIRED, 'Expired'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_FREE)
    started_at = models.DateTimeField(null=True, blank=True)
    valid_until = models.DateTimeField(null=True, blank=True)
    payment_method = models.CharField(max_length=32, null=True, blank=True)
    last_payment_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'api_user_subscription'


class Payment(models.Model):
    METHOD_CHOICES = [
        ('mock', 'Mock'),
        ('card', 'Card'),
        ('paypal', 'PayPal'),
        ('crypto', 'Crypto'),
    ]
    STATUS_CHOICES = [
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('pending', 'Pending'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan = models.ForeignKey(SubscriptionPlan, on_delete=models.SET_NULL, null=True, blank=True)
    amount_aed = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=16, choices=METHOD_CHOICES, default='mock')
    provider = models.CharField(max_length=32, default='mock')
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='succeeded')
    paid_at = models.DateTimeField(auto_now_add=True)
    external_id = models.CharField(max_length=128, null=True, blank=True)

    class Meta:
        db_table = 'api_payment'


@receiver(post_save, sender=User)
def ensure_subscription(sender, instance: User, created: bool, **kwargs):
    if created:
        UserSubscription.objects.get_or_create(user=instance)


# ========================================
# Billing audit (webhooks, provider events)
# ========================================


class PaymentEventAudit(models.Model):
    """Аудит получения и обработки событий провайдера оплат.

    Используется для идемпотентности и безопасных ретраев: уникальность (provider, event_id)
    гарантирует, что одно и то же событие не будет обработано дважды.
    """

    STATUS_RECEIVED = 'received'
    STATUS_PROCESSED = 'processed'
    STATUS_SKIPPED = 'skipped'
    STATUS_FAILED = 'failed'

    STATUS_CHOICES = [
        (STATUS_RECEIVED, 'Received'),
        (STATUS_PROCESSED, 'Processed'),
        (STATUS_SKIPPED, 'Skipped'),
        (STATUS_FAILED, 'Failed'),
    ]

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    provider = models.CharField(max_length=32)
    event_type = models.CharField(max_length=64)
    event_id = models.CharField(max_length=128)
    idempotency_key = models.CharField(max_length=128, null=True, blank=True)
    signature = models.CharField(max_length=256, null=True, blank=True)
    payload = JSONField(null=True, blank=True)

    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_RECEIVED)
    processed_at = models.DateTimeField(null=True, blank=True)
    attempt_count = models.PositiveIntegerField(default=0)
    error = models.TextField(null=True, blank=True)

    # Ссылка на платёж, если удалось идентифицировать
    payment = models.ForeignKey('Payment', null=True, blank=True, on_delete=models.SET_NULL)

    class Meta:
        db_table = 'api_payment_event_audit'
        indexes = [
            models.Index(fields=['provider', 'event_id'], name='idx_provider_event'),
            models.Index(fields=['idempotency_key'], name='idx_idem_key'),
        ]
        constraints = [
            models.UniqueConstraint(fields=['provider', 'event_id'], name='uniq_provider_event'),
        ]

    def __str__(self) -> str:
        return f"Audit<{self.provider}:{self.event_id}:{self.status}>"


# ========================================
# Reports (user-generated reports registry)
# ========================================


class Report(models.Model):
    STATUS_QUEUED = 'queued'
    STATUS_PROCESSING = 'processing'
    STATUS_READY = 'ready'
    STATUS_FAILED = 'failed'

    STATUS_CHOICES = [
        (STATUS_QUEUED, 'Queued'),
        (STATUS_PROCESSING, 'Processing'),
        (STATUS_READY, 'Ready'),
        (STATUS_FAILED, 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    title = models.CharField(max_length=255)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_QUEUED)
    payload = JSONField(null=True, blank=True)
    result = JSONField(null=True, blank=True)
    error = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'api_report'
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"Report<{self.id}:{self.status}>"
