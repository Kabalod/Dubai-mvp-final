# 🎯 ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ДЕМОНСТРАЦИИ MVP

Система включает команды для создания тестовых пользователей и данных для демонстрации функционала профилей и платежной системы.

## 🚀 Быстрый старт

### Локально:
```bash
cd apps/realty-main
python manage.py create_test_data
```

### На Railway (через Django shell):
```python
from django.core.management import call_command
call_command('create_test_data', '--users-count=5')
```

### Автоматический скрипт:
```bash
cd apps/realty-main
python setup_demo_data.py
```

## 👥 Созданные тестовые пользователи

| Username | Email | Роль | Пароль |
|----------|-------|------|--------|
| `investor_pro` | investor@testdubai.com | Инвестор | `testpass123` |
| `property_agent` | agent@testdubai.com | Агент | `testpass123` |
| `developer_dubai` | developer@testdubai.com | Девелопер | `testpass123` |
| `analyst_real_estate` | analyst@testdubai.com | Аналитик | `testpass123` |
| `premium_user` | premium@testdubai.com | Премиум пользователь | `testpass123` |

## 💰 Тестовые платежи

Для каждого пользователя создаются:
- **1-3 платежа** с разными суммами
- **Статусы**: succeeded, pending, failed
- **Типы услуг**: Premium Analytics, Reports, Subscriptions
- **Суммы**: от 149 AED до 1999 AED
- **Audit логи** для каждого платежа

### Примеры платежей:
- **299 AED** - Premium Analytics Plan (Monthly)
- **999 AED** - Professional Report Package  
- **149 AED** - Market Analysis Report
- **1999 AED** - Annual Premium Subscription

## 📊 История отчетов

Для каждого пользователя создается:
- **2-5 отчетов** за последние 60 дней
- **Типы отчетов**: property_analysis, market_trends, investment_report
- **Параметры**: районы Дубая, типы недвижимости, даты

## 🔗 Тестирование функционала

### 1. **Профили пользователей**
```bash
# API endpoint
GET /api/profile/me/

# Admin панель  
/admin/api/user/
```

### 2. **Система платежей**
```bash
# API endpoints
GET /api/admin/payments/
GET /api/admin/users/

# Admin панель
/admin/api/payment/
```

### 3. **История отчетов**  
```bash
# В Django admin
/admin/api/userreporthistory/
```

## ⚙️ Команды управления

### Создание данных:
```bash
# Базовое создание
python manage.py create_test_data

# С очисткой существующих данных  
python manage.py create_test_data --clean

# Указать количество пользователей
python manage.py create_test_data --users-count=10
```

### Очистка тестовых данных:
```bash
python manage.py create_test_data --clean --users-count=0
```

## 🎨 Интеграция с Frontend

### Тестовая авторизация:
```javascript
// Используйте тестовые email/пароли для входа
const testCredentials = {
  email: 'investor@testdubai.com',
  password: 'testpass123'
}
```

### API для профиля:
```javascript
// Получение профиля текущего пользователя
fetch('/api/profile/me/', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
})
```

### API для платежей (Admin):
```javascript  
// Список платежей пользователя (требует admin права)
fetch('/api/admin/payments/')
```

## 📋 Проверочный чеклист

- [ ] Тестовые пользователи созданы и могут войти
- [ ] У пользователей есть платежи с разными статусами
- [ ] История отчетов заполнена тестовыми данными  
- [ ] API endpoints отвечают корректными данными
- [ ] Admin панель показывает все тестовые объекты
- [ ] Frontend может получить и отобразить данные

## 🔧 Дополнительные настройки

### Автоматическое создание при деплое:
Добавьте в Railway environment variable:
```bash
DJANGO_AUTO_SETUP_DEMO=true
```

### Кастомизация данных:
Отредактируйте файл:
```
apps/realty-main/realty/api/management/commands/create_test_data.py
```

## 🎯 Заключение

Эти тестовые данные позволяют:
✅ **Демонстрировать** все основные функции MVP  
✅ **Тестировать** UI/UX без реальных пользователей  
✅ **Показывать** работу платежной системы  
✅ **Проверять** интеграции между frontend/backend  
✅ **Отлаживать** API endpoints

Используйте команду `create_test_data` каждый раз при развертывании новой версии для консистентной демо-среды!
