#!/usr/bin/env python3
"""
Скрипт для создания демо данных на production/staging
"""
import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realty.settings')
django.setup()

from django.core.management import call_command
from django.contrib.auth import get_user_model

User = get_user_model()

def setup_demo_data():
    """Настройка демо данных для тестирования MVP"""
    
    print("🚀 Настройка демо данных для MVP...")
    
    try:
        # Создаем тестовых пользователей и платежи
        print("📋 Создание тестовых данных...")
        call_command('create_test_data', '--users-count=5')
        
        print("\n✅ Демо данные успешно созданы!")
        print("\n🔗 Доступные тестовые аккаунты:")
        
        # Показываем созданных пользователей
        test_users = User.objects.filter(email__contains='testdubai.com')
        for user in test_users:
            print(f"  👤 {user.username} - {user.email} (пароль: testpass123)")
        
        print("\n🌐 Для тестирования MVP:")
        print("  1. Войдите через любого тестового пользователя")
        print("  2. Проверьте профиль: /api/profile/me/") 
        print("  3. Проверьте платежи: /api/admin/payments/")
        print("  4. Admin панель: /admin/")
        
    except Exception as e:
        print(f"❌ Ошибка при создании демо данных: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    setup_demo_data()
