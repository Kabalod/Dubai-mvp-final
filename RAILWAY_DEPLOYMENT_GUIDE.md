# 🚀 Railway Deployment Guide для Dubai MVP

## 📋 **Проблема**
Railway сталкивается с ошибкой `exit code: 137` при установке системных зависимостей, что указывает на превышение лимитов ресурсов.

## 🔧 **Решения**

### **Вариант 1: Основной Dockerfile (рекомендуемый)**
Используйте `Dockerfile.railway` в корне: он копирует код из `apps/realty-main`, ставит зависимости из `apps/realty-main/requirements.txt`, задаёт `DJANGO_SETTINGS_MODULE=realty.settings_railway` и healthcheck `/api/health/`.

### **Вариант 2: Простой Dockerfile (если основной не работает)**
Можно использовать `apps/realty-main/Dockerfile.simple` с `runserver` для минимального потребления ресурсов.

## 🎯 **Оптимизации для Railway**

### **Уменьшены зависимости:**
- ❌ Убран `build-essential` (тяжелый пакет)
- ❌ Убран `g++` (компилятор C++)
- ❌ Убран `django-debug-toolbar` (только для разработки)
- ❌ Убран `psycopg[pool]` (пул соединений)
- ❌ Убран `whitenoise[brotli]` (сжатие)

### **Оставлены только необходимые:**
- ✅ `gcc` - минимальный компилятор
- ✅ `libpq-dev` - для PostgreSQL
- ✅ `curl` - для health check
- ✅ `psycopg[binary]` - базовая поддержка PostgreSQL
- ✅ `gunicorn` - продакшн сервер

## 🚀 **Автоматический деплой**

### **GitHub Actions:**
- Автоматически запускается при push в ветку `prod`
- Проверяет код и запускает деплой на Railway

### **Railway:**
- Использует корневой `Dockerfile` по умолчанию
- Если не работает, можно переключиться на `Dockerfile.simple`

## 🔍 **Мониторинг**

### **GitHub Actions:**
`https://github.com/Kabalod/Workerproject/actions`

### **Railway Dashboard:**
`https://railway.app/dashboard`

### **Production URL:**
`https://workerproject-production.up.railway.app`

## ⚠️ **Если деплой не удается**

1. **Проверить логи Railway** - найти точную причину ошибки
2. **Использовать Dockerfile.simple** - более легкая версия
3. **Уменьшить requirements.txt** - убрать необязательные пакеты
4. **Обратиться в поддержку Railway** - возможно, нужен больший план

## 📊 **Текущий статус**
- ✅ Код оптимизирован для Railway
- ✅ Созданы альтернативные варианты
- ✅ Автоматический деплой настроен
- 🔄 Ожидание успешной сборки
