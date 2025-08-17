# Быстрый старт

## Обзор

Быстрое руководство по запуску проекта Dubai за 5 минут.

## ⚡ Экспресс-запуск

### 1. Клонирование и запуск
```bash
## Клонирование
git clone https://github.com/your-username/dubai-project.git
cd dubai-project

## Запуск всех сервисов
docker-compose up -d
```

### 2. Проверка работоспособности
```bash
## API готов
curl http://localhost:8000/api/health

## Фронтенд готов
open http://localhost:3000
```

**Готово!** 🎉

## 🚀 Пошаговый запуск

### Шаг 1: Подготовка окружения
```bash
## Проверка Docker
docker --version
docker-compose --version

## Проверка Git
git --version
```

### Шаг 2: Получение кода
```bash
git clone https://github.com/your-username/dubai-project.git
cd dubai-project
```

### Шаг 3: Настройка переменных
```bash
## Копирование примера
cp env/.env.example env/.env.local

## Редактирование (опционально)
nano env/.env.local
```

### Шаг 4: Запуск сервисов
```bash
## Запуск в фоне
docker-compose up -d

## Проверка статуса
docker-compose ps
```

### Шаг 5: Проверка
```bash
## API
curl http://localhost:8000/api/health

## Фронтенд
open http://localhost:3000

## Админ панель
open http://localhost:3000/admin
```

## 🔧 Первая настройка

### Создание администратора
```bash
## Создание суперпользователя
docker-compose exec real-estate-api python manage.py createsuperuser

## Или через Django shell
docker-compose exec real-estate-api python manage.py shell
```

### Настройка AI сервисов
```bash
## Проверка Memory LLM Service
curl http://localhost:8080/api/memory/health

## Проверка AI Gateway
curl http://localhost:8003/api/ai/health
```

### Импорт тестовых данных
```bash
## Загрузка фикстур
docker-compose exec real-estate-api python manage.py loaddata fixtures/sample_data.json
```

## 📱 Первое использование

### Веб-интерфейс
1. Откройте http://localhost:3000
2. Зарегистрируйтесь или войдите
3. Изучите каталог недвижимости
4. Попробуйте AI ассистента

### API
1. Откройте http://localhost:8000/docs
2. Изучите доступные endpoints
3. Попробуйте простые запросы
4. Проверьте аутентификацию

### Админ панель
1. Откройте http://localhost:3000/admin
2. Войдите с созданными учетными данными
3. Изучите структуру данных
4. Попробуйте создать тестовый объект

## 🧪 Тестирование функциональности

### Проверка API endpoints
```bash
## Список объектов недвижимости
curl http://localhost:8000/api/real-estate/

## Поиск по параметрам
curl "http://localhost:8000/api/real-estate/?location=dubai&max_price=1000000"

## Детали объекта
curl http://localhost:8000/api/real-estate/1/
```

### Проверка AI функций
```bash
## Запрос к AI ассистенту
curl -X POST http://localhost:8003/api/ai/query \
  -H "Content-Type: application/json" \
  -d '{"query": "Какие районы Dubai самые популярные для покупки недвижимости?"}'

## Список доступных AI агентов
curl http://localhost:8003/api/ai/agents
```

### Проверка аналитики
```bash
## Рыночные данные
curl http://localhost:8001/api/analytics/market/

## Тренды цен
curl http://localhost:8001/api/analytics/trends/
```

## 🚨 Быстрое решение проблем

### Сервис не запускается
```bash
## Проверка логов
docker-compose logs <service_name>

## Перезапуск
docker-compose restart <service_name>
```

### Порт занят
```bash
## Поиск процесса
netstat -ano | findstr :8000

## Остановка
taskkill /PID <process_id> /F
```

### Проблемы с базой данных
```bash
## Сброс
docker-compose down -v
docker-compose up -d
```

## 📊 Мониторинг

### Проверка метрик
```bash
## Prometheus
open http://localhost:9090

## Grafana
open http://localhost:3001
## Логин: admin, Пароль: admin
```

### Проверка логов
```bash
## Все сервисы
docker-compose logs -f

## Конкретный сервис
docker-compose logs -f real-estate-api
```

## 🔄 Обновление

### Обновление кода
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

### Обновление данных
```bash
## Применение миграций
docker-compose exec real-estate-api python manage.py migrate

## Обновление статических файлов
docker-compose exec real-estate-api python manage.py collectstatic
```

## 📚 Следующие шаги

### Изучение документации
- [Полное руководство по установке](./setup.md)
- [API документация](./api/overview.md)
- [Структура проекта](./PROJECT_STRUCTURE.md)

### Разработка
- [Руководство разработчика](./development/contributing.md)
- [Правила для AI моделей](./GPT_RULES.md)
- [Правила для Cursor](./CURSOR_RULES.md)

### Развертывание
- [Мониторинг и алерты](./monitoring/overview.md)
- [Система логирования](./logging/overview.md)

---

**Статус**: Активный  
**Последнее обновление**: Август 2025

