"""
Минимальные Django settings ТОЛЬКО для авторизации
Версия: Railway MVP Auth Only
"""
import os
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# Security
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-auth-only-key-12345')
DEBUG = True
ALLOWED_HOSTS = ['*']

# Минимальные приложения ТОЛЬКО для авторизации
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
]

# Минимальный middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'realty.urls_simple'

# Database - восстанавливаем связь с PostgreSQL
import dj_database_url

_db_url = os.environ.get('DATABASE_URL')
if _db_url:
    DATABASES = {
        'default': dj_database_url.parse(_db_url, conn_max_age=600),
    }
else:
    # Fallback к SQLite если PostgreSQL недоступен
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'auth.sqlite3',
        }
    }

# REST Framework для JWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

# JWT settings
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# CORS для frontend
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# Google OAuth (простая версия)
GOOGLE_OAUTH_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'test-client-id')
GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', 'test-secret')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://workerproject-production.up.railway.app')

# Статические файлы (минимум)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Интернационализация
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'