# 🚀 Dubai Project - Аналитическая платформа недвижимости

Централизованная система для анализа рынка недвижимости Дубая с интеграцией ИИ и автоматизацией.

## 🎯 Цель проекта

Создать единую платформу для:
- 📊 Сбора и анализа данных о недвижимости
- 🤖 Интеграции ИИ сервисов и агентов
- 🔄 Автоматизации ETL процессов
- 📈 Генерации аналитических отчетов
- 🌐 Предоставления API для внешних систем

## 🏗️ Архитектура

### **Структура проекта**
```
dubai-project/
├── core/                    # Основная бизнес-логика
│   ├── real_estate/        # Недвижимость и аналитика
│   ├── analytics/          # Система отчетов
│   └── data_processing/    # ETL процессы
├── ai_services/            # ИИ сервисы (отдельно!)
│   ├── memory/             # Система памяти LLM
│   ├── agents/             # AI агенты
│   └── ml_models/          # ML модели
├── frontend/                # Пользовательский интерфейс
├── infrastructure/          # Инфраструктура
│   ├── docker/             # Docker конфигурации
│   ├── monitoring/         # Мониторинг
│   └── deployment/         # Развертывание
├── tools/                   # Инструменты разработки
├── docs/                   # Документация
└── scripts/                 # Скрипты автоматизации
```

## 🚀 Быстрый старт

### **1. Запуск всех сервисов**
```bash
# Windows PowerShell
.\scripts\project-manager.ps1 start all

# Linux/macOS
./scripts/project-manager.sh start all
```

### **2. Проверка статуса**
```bash
# Windows PowerShell
.\scripts\project-manager.ps1 status

# Linux/macOS
./scripts/project-manager.sh status
```

### **3. Запуск отдельных компонентов**
```bash
# Только ИИ сервисы
.\scripts\project-manager.ps1 start ai

# Только основная логика
.\scripts\project-manager.ps1 start core

# Только мониторинг
.\scripts\project-manager.ps1 start monitoring
```

## 🔧 Управление проектом

### **Основные команды**
- `start [service]` - Запуск сервиса
- `stop [service]` - Остановка сервиса
- `restart [service]` - Перезапуск сервиса
- `status` - Статус всех сервисов
- `logs` - Просмотр логов
- `cleanup` - Очистка ресурсов
- `setup` - Первоначальная настройка

### **Доступные сервисы**
- `all` - Все сервисы
- `core` - Основная бизнес-логика
- `ai` - ИИ сервисы
- `frontend` - Пользовательский интерфейс
- `infrastructure` - Базы данных, кэш
- `monitoring` - Мониторинг и логирование

## 📊 Источники данных

### **Официальные данные**
- **Dubai Land Department (DLD)** - Транзакции продаж и аренды
- **Dubai REST** - Информация о зданиях и районах

### **Коммерческие данные**
- **Property Finder (PF)** - Объявления о продаже и аренде

### **ETL процессы**
1. **Сбор данных** - Парсеры и скрипты
2. **Сопоставление** - Fuzzy logic для матчинга
3. **Загрузка** - Поэтапная загрузка в БД
4. **Аналитика** - Расчет метрик и отчетов

## 🤖 ИИ интеграция

### **Система памяти**
- Векторное хранение данных
- Семантический поиск
- Контекстная память

### **AI агенты**
- Анализ недвижимости
- Прогнозирование рынка
- Автоматические отчеты

### **ML модели**
- Классификация объектов
- Оценка стоимости
- Анализ трендов

## 🐳 Docker развертывание

### **Основные сервисы**
```yaml
# docker-compose.core.yml
services:
  real-estate-api:    # API недвижимости
  analytics-service:  # Сервис аналитики
  data-processor:     # ETL процессы

# docker-compose.ai.yml
services:
  memory-service:     # LLM память
  agent-service:      # AI агенты
  ml-service:         # ML модели
```

### **Инфраструктура**
```yaml
# docker-compose.infrastructure.yml
services:
  postgres:           # Основная БД
  redis:              # Кэш
  nginx:              # API Gateway
```

## 📈 Мониторинг

### **Метрики**
- Prometheus - Сбор метрик
- Grafana - Визуализация
- Elasticsearch - Логирование
- Kibana - Анализ логов

### **Алерты**
- Автоматические уведомления
- Мониторинг производительности
- Отслеживание ошибок

## 🔄 CI/CD

### **Автоматизация**
- GitHub Actions для тестирования
- Автоматическое развертывание
- Проверка качества кода
- Деплой в dev/prod окружения

## 📚 Документация

### **Основные разделы**
- [Обзор системы](./docs/OVERVIEW.md)
- [Архитектура](./docs/architecture/overview.md)
- [API документация](./docs/api/overview.md)
- [Развертывание](./docs/deployment/quick-start.md)
- [Система линтинга](./docs/LINTING.md)

## 🛠️ Разработка

### **Требования**
- Python 3.8+
- Node.js 16+
- Docker & Docker Compose
- PostgreSQL 13+
- Redis 6+

### **Установка зависимостей**
```bash
# Python
pip install -r requirements.txt

# Node.js
npm install

# Docker
docker-compose up -d
```

## 🤝 Вклад в проект

### **Правила**
- Следуйте [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
- Используйте [GPT_RULES.md](./docs/GPT_RULES.md) для AI
- Следуйте [CURSOR_RULES.md](./docs/CURSOR_RULES.md) для IDE

### **Процесс**
1. Создайте Issue
2. Сделайте Fork
3. Создайте Feature Branch
4. Внесите изменения
5. Создайте Pull Request

## 📞 Поддержка

### **Контакты**
- **Issues**: [GitHub Issues](https://github.com/dubai-project/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dubai-project/discussions)
- **Email**: support@dubai-project.com

### **Документация**
- [Полная документация](./docs/)
- [API Reference](./docs/api/)
- [Troubleshooting](./docs/troubleshooting/)

## 📊 Статистика проекта

- **Сервисов**: 5 основных + 3 ИИ
- **API endpoints**: 50+
- **Моделей данных**: 20+
- **ETL процессов**: 10+
- **AI агентов**: 5+
- **Документация**: 60+ страниц

---

**Статус**: Активная разработка 🚀  
**Версия**: 2.0.0  
**Последнее обновление**: Август 2025  
**Лицензия**: MIT License
