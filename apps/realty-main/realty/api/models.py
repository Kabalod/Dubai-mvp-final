import random
import string
from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


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
