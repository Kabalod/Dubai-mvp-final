#!/usr/bin/env python
"""
Скрипт для настройки Google OAuth в Django allauth
"""
import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'realty.settings')
django.setup()

from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site

def setup_google_oauth():
    """Настройка Google OAuth приложения"""
    
    # Создаем или получаем сайт
    site, site_created = Site.objects.get_or_create(
        id=1,
        defaults={
            'domain': 'localhost:8000',
            'name': 'localhost'
        }
    )
    
    if site_created:
        print(f"✅ Создан новый сайт: {site.domain}")
    else:
        print(f"✅ Найден существующий сайт: {site.domain}")
    
    # Создаем или получаем Google OAuth приложение
    app, app_created = SocialApp.objects.get_or_create(
        provider='google',
        defaults={
            'name': 'Google OAuth',
            'client_id': 'test-client-id-12345',
            'secret': 'test-secret-key-12345'
        }
    )
    
    if app_created:
        print(f"✅ Создано новое Google OAuth приложение: {app.name}")
    else:
        print(f"✅ Найдено существующее Google OAuth приложение: {app.name}")
    
    # Добавляем сайт к приложению
    app.sites.add(site)
    print(f"✅ Сайт {site.domain} добавлен к приложению {app.name}")
    
    print(f"\n📋 Детали приложения:")
    print(f"   ID: {app.id}")
    print(f"   Provider: {app.provider}")
    print(f"   Name: {app.name}")
    print(f"   Client ID: {app.client_id}")
    print(f"   Sites: {[s.domain for s in app.sites.all()]}")
    
    return app

if __name__ == '__main__':
    try:
        app = setup_google_oauth()
        print("\n🎉 Google OAuth настроен успешно!")
        print("Теперь можно тестировать Google вход на http://localhost:8000/accounts/google/login/")
    except Exception as e:
        print(f"❌ Ошибка при настройке Google OAuth: {e}")
        import traceback
        traceback.print_exc()
