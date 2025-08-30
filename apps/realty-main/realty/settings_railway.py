"""
Simplified Django settings for Railway deployment
"""
import os
from pathlib import Path
import dj_database_url
import logging

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-railway-mvp-key')

# SECURITY WARNING: don't run with debug turned on in production!
# Временно включаем DEBUG для диагностики Railway ошибок
DEBUG = True

ALLOWED_HOSTS = ['*']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'realty.api',
    'realty.main',
    'realty.pfimport',
    'realty.building_reports',
    'realty.reports',
    'realty.core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'realty.api.middleware.MetricsMiddleware',
]

ROOT_URLCONF = 'realty.urls'

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

# Database
_db_url_raw = (os.environ.get('DATABASE_URL') or '').strip()

def _build_url_from_pg_env() -> str | None:
    host = os.environ.get('PGHOST') or os.environ.get('POSTGRES_HOST')
    user = os.environ.get('PGUSER') or os.environ.get('POSTGRES_USER')
    password = os.environ.get('PGPASSWORD') or os.environ.get('POSTGRES_PASSWORD')
    dbname = os.environ.get('PGDATABASE') or os.environ.get('POSTGRES_DB')
    port = os.environ.get('PGPORT') or os.environ.get('POSTGRES_PORT') or '5432'
    if all([host, user, password, dbname]):
        return f"postgresql://{user}:{password}@{host}:{port}/{dbname}"
    return None

try:
    url = _db_url_raw if (_db_url_raw and '://' in _db_url_raw) else _build_url_from_pg_env()
    if url:
        DATABASES = {
            'default': dj_database_url.parse(url, conn_max_age=600),
        }
        if DATABASES['default']['ENGINE'].endswith('postgresql'):
            DATABASES['default']['ATOMIC_REQUESTS'] = True
        logging.getLogger(__name__).info("Using database engine: %s", DATABASES['default']['ENGINE'])
    else:
        raise ValueError('DATABASE_URL missing and PG* env not present')
except Exception as e:  # Fallback to SQLite to avoid startup crash
    logging.warning(f"DATABASE_URL invalid or not set, falling back to SQLite: {e}")
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Whitenoise staticfiles backend
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage',
    },
}

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Google OAuth settings для Railway (без allauth - упрощенная версия)
GOOGLE_OAUTH_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID', 'test-client-id-12345')
GOOGLE_OAUTH_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET', 'test-secret-12345')

# Frontend URL for OAuth redirects (правильный актуальный URL)
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'https://workerproject-production.up.railway.app')

# OAuth redirect URI для Google - используем backend URL для callback
GOOGLE_OAUTH_REDIRECT_URI = f"https://dubai.up.railway.app/api/auth/google/callback/"

# CORS - Безопасная настройка для продакшена
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    'https://workerproject-production.up.railway.app',  # Актуальный frontend URL
    'http://localhost:3000',  # для локальной разработки
]

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}

# Basic project URLs
ADMIN_URL = os.environ.get('ADMIN_URL', 'admin/')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')

# Optional: Stripe webhook secret default (safe)
STRIPE_WEBHOOK_SECRET = os.environ.get('STRIPE_WEBHOOK_SECRET', '')

# JWT Settings (минимально необходимое)
from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
