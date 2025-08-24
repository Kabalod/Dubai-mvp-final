# 🎯 ТЕСТОВЫЕ ДАННЫЕ ДЛЯ ДЕМОНСТРАЦИИ MVP

Система включает команды для создания:
- 👥 **Тестовых пользователей** с профилями и платежами  
- 🏠 **Mock недвижимости** (заглушка парсера PropertyFinder)
- 📊 **Аналитических данных** для демонстрации без реального парсинга

## 🚀 Быстрый старт

### Полная настройка демо данных:
```bash
cd apps/realty-main
python setup_demo_data.py
```

### Только пользователи:
```bash
python manage.py create_test_data --users-count=5
```

### Только недвижимость:
```bash
python manage.py create_mock_properties --count=50 --areas-count=10
```

### На Railway (через Django shell):
```python
from django.core.management import call_command
call_command('create_test_data', '--users-count=5')
call_command('create_mock_properties', '--count=50')
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

## 🏠 Mock недвижимость (заглушка парсера)

### Создаваемые данные:
- **10 районов Дубая**: Dubai Marina, Downtown Dubai, JBR, Business Bay, etc.
- **20 зданий**: Mock Building 1 Tower, Mock Building 2 Residence, etc.
- **50 объявлений**: 30 продажа (60%) + 20 аренда (40%)

### Типы недвижимости:
- **Property Types**: Apartment, Villa, Townhouse, Penthouse, Studio
- **Bedrooms**: studio, 1, 2, 3, 4, 5 BR
- **Размеры**: 450-3000 sqft (реалистичные для Дубая)

### Реалистичные цены:
**Продажа (AED):**
- Studio: 400K - 800K
- 1 BR: 700K - 1.5M  
- 2 BR: 1.2M - 2.5M
- 3 BR: 2M - 4M
- 4+ BR: 3.5M - 8M

**Аренда (AED/год):**
- Studio: 35K - 60K
- 1 BR: 55K - 95K
- 2 BR: 85K - 150K  
- 3 BR: 130K - 250K
- 4+ BR: 200K - 400K

### Дополнительные данные:
- **GPS координаты** в пределах Дубая
- **Описания** недвижимости на английском
- **Агенты** и контактные данные (mock)
- **Даты добавления** (последние 30-60 дней)
- **Верификация** и статус меблировки

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

### 3. **Mock недвижимость (новые API)**
```bash
# Список недвижимости с поиском и фильтрами
GET /api/properties/
GET /api/properties/?listing_type=sale
GET /api/properties/?bedrooms=2&area=Dubai Marina
GET /api/properties/?min_price=1000000&max_price=2000000

# Детальная информация об объявлении
GET /api/properties/mock_sale_1/

# Список районов с количеством объявлений
GET /api/areas/

# Общая статистика недвижимости  
GET /api/stats/
```

### 4. **История отчетов**  
```bash
# В Django admin
/admin/api/userreporthistory/
```

### 5. **Существующие PFImport URLs**
```bash
# Старые endpoints (все еще работают)
/pfimport/sale/   # HTML страница продажи
/pfimport/rent/   # HTML страница аренды  
/pfimport/map/    # Карта недвижимости
/pfimport/api/buildings/  # JSON данные зданий
```

## ⚙️ Команды управления

### Создание пользователей:
```bash
# Базовое создание пользователей
python manage.py create_test_data

# С очисткой существующих данных  
python manage.py create_test_data --clean

# Указать количество пользователей
python manage.py create_test_data --users-count=10
```

### Создание недвижимости:
```bash
# Базовое создание mock недвижимости
python manage.py create_mock_properties

# Указать количество объявлений и районов
python manage.py create_mock_properties --count=100 --areas-count=15 --buildings-count=30

# С очисткой существующих mock данных
python manage.py create_mock_properties --clean --count=50
```

### Полная настройка (все данные):
```bash
# Автоматический скрипт создания всех демо данных
python setup_demo_data.py
```

### Очистка тестовых данных:
```bash
# Очистить только пользователей
python manage.py create_test_data --clean --users-count=0

# Очистить только недвижимость
python manage.py create_mock_properties --clean --count=0
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

### API для недвижимости (новое!):
```javascript
// Получение списка недвижимости с фильтрами
const searchProperties = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/properties/?${params}`);
  return response.json();
};

// Примеры использования:
searchProperties({ listing_type: 'sale', bedrooms: '2' });
searchProperties({ area: 'Dubai Marina', min_price: 1000000 });

// Получение детальной информации об объявлении
const getProperty = async (listingId) => {
  const response = await fetch(`/api/properties/${listingId}/`);
  return response.json();
};

// Получение списка районов с количеством объявлений
const getAreas = async () => {
  const response = await fetch('/api/areas/');
  return response.json();
};

// Получение статистики недвижимости
const getStats = async () => {
  const response = await fetch('/api/stats/');
  return response.json();
};
```

### API для платежей (Admin):
```javascript  
// Список платежей пользователя (требует admin права)
fetch('/api/admin/payments/')
```

## 📋 Проверочный чеклист

### Пользователи и платежи:
- [ ] Тестовые пользователи созданы и могут войти
- [ ] У пользователей есть платежи с разными статусами
- [ ] История отчетов заполнена тестовыми данными
- [ ] API endpoints пользователей отвечают корректными данными
- [ ] Admin панель показывает всех тестовых пользователей

### Mock недвижимость:
- [ ] Районы Дубая созданы (Dubai Marina, Downtown, JBR, etc.)
- [ ] Здания созданы и привязаны к районам
- [ ] Объявления продажи созданы с реалистичными ценами
- [ ] Объявления аренды созданы с реалистичными ценами
- [ ] GPS координаты корректные (в пределах Дубая)
- [ ] API /api/properties/ возвращает список недвижимости
- [ ] API /api/areas/ возвращает районы с количеством объявлений
- [ ] API /api/stats/ возвращает актуальную статистику
- [ ] Поиск и фильтрация работают корректно
- [ ] Детальные страницы объявлений открываются

### Интеграция:
- [ ] Frontend может получить и отобразить данные недвижимости
- [ ] Карта недвижимости /pfimport/map/ показывает объекты
- [ ] Старые HTML страницы /pfimport/sale/ и /pfimport/rent/ работают
- [ ] Admin панель показывает все mock объекты

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

### 👥 Пользователи и платежи:
✅ **Демонстрировать** систему пользователей и аутентификации  
✅ **Тестировать** UI/UX без реальных пользователей  
✅ **Показывать** работу платежной системы  
✅ **Проверять** профили и историю действий

### 🏠 Mock недвижимость:
✅ **Заменить** реальный парсер PropertyFinder заглушкой  
✅ **Демонстрировать** поиск и фильтрацию недвижимости  
✅ **Тестировать** карты и визуализацию данных  
✅ **Показывать** аналитику и статистику рынка  
✅ **Проверять** API endpoints для фронтенда  

### 🔗 Интеграция:
✅ **Обеспечить** полноценную работу MVP без внешних зависимостей  
✅ **Ускорить** разработку фронтенда с готовыми данными  
✅ **Создать** консистентную демо-среду для презентаций  
✅ **Упростить** тестирование и отладку системы

### 🚀 Быстрая настройка:
```bash
# Один скрипт создает ВСЕ демо данные
python setup_demo_data.py
```

Используйте команды `create_test_data` и `create_mock_properties` каждый раз при развертывании новой версии для консистентной демо-среды MVP!
