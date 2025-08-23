import random
import string
from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver


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
