"""
Минимальные Django settings ТОЛЬКО для авторизации
Версия: Railway MVP Auth Only - С УЛУЧШЕННОЙ БЕЗОПАСНОСТЬЮ
"""
import os
from pathlib import Path

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent

# ==============================================================================
# 🔒 SECURITY SETTINGS (ВАЖНО!)
# ==============================================================================

# ⚠️ ПРЕДУПРЕЖДЕНИЕ: Не используйте предсказуемый ключ в продакшене.
# Этот ключ должен быть установлен через переменные окружения Railway.
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-auth-only-key-12345')

# 🚫 DEBUG должен быть False в продакшене
DEBUG = os.environ.get('DEBUG', 'False').lower() == 'true'

# 🌐 Явно указываем разрешенные хосты
# Добавлены домены для фронтенда и бэкенда на Railway.
ALLOWED_HOSTS = [
    'workerproject-production.up.railway.app', # Основной домен приложения
    'dubai.up.railway.app',                    # Домен бэкенда
    '.railway.app',                            # Разрешаем все поддомены railway.app
    'localhost',
    '127.0.0.1',
]

# ==============================================================================
# CORE DJANGO SETTINGS
# ==============================================================================

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles', # Необходим для whitenoise
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'whitenoise.runserver_nostatic',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware', # Важно для безопасности
    'whitenoise.middleware.WhiteNoiseMiddleware',    # Для раздачи статики в продакшене
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]

ROOT_URLCONF = 'realty.urls_simple'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'realty.wsgi.application'

# ==============================================================================
# DATABASE
# ==============================================================================
import dj_database_url

_db_url = os.environ.get('DATABASE_URL')
if _db_url:
    DATABASES = {
        'default': dj_database_url.parse(_db_url, conn_max_age=600),
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'auth.sqlite3',
        }
    }

# ==============================================================================
# API, JWT & CORS
# ==============================================================================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
}

# 🔒 Ограничиваем CORS только для вашего фронтенда
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'https://workerproject-production.up.railway.app',
]
CORS_ALLOW_CREDENTIALS = True

# ==============================================================================
# EXTERNAL SERVICES (Google, Email)
# ==============================================================================

GOOGLE_OAUTH_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'test-client-id')
GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', 'test-secret')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://workerproject-production.up.railway.app')

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'mail.kabalod.online')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', 'True').lower() == 'true'
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL', 'False').lower() == 'true'
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', 'noreply@kabalod.online')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL', 'Dubai Real Estate <noreply@kabalod.online>')

if not EMAIL_HOST_PASSWORD:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# ==============================================================================
# STATIC FILES & I18N
# ==============================================================================

STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
