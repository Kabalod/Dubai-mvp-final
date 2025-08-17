# Структура проекта Dubai

## Обзор

Подробное описание архитектуры и структуры проекта Dubai.

## 🏗️ Архитектура системы

### Основные компоненты
```
┌─────────────────────────────────────────────────────────────┐
│                    Dubai Project                           │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)  │  Backend (Django/FastAPI)  │  AI     │
│                     │                              │  Services │
├─────────────────────┼──────────────────────────────┼─────────┤
│  - Web App         │  - Real Estate API           │  - LLM  │
│  - Mobile App      │  - Analytics Service         │  - AI   │
│  - Admin Panel     │  - Data Processing           │  Agents │
└─────────────────────┴──────────────────────────────┴─────────┘
                              │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   + pgvector    │
                    └─────────────────┘
```

## 📁 Структура директорий

### Корневая папка
```
Dubai/
├── core/                    # Основные компоненты
├── ai_services/            # AI сервисы и агенты
├── frontend/               # Фронтенд приложения
├── infrastructure/         # Инфраструктура и DevOps
├── tools/                  # Инструменты разработки
├── docs/                   # Документация
├── scripts/                # Скрипты автоматизации
├── env/                    # Переменные окружения
└── logs/                   # Логи системы
```

### Core (Основные компоненты)
```
core/
├── real_estate/           # Модуль недвижимости
├── analytics/             # Аналитические модули
├── data_processing/       # ETL и обработка данных
├── authentication/         # Система аутентификации
└── common/                # Общие утилиты
```

### AI Services
```
ai_services/
├── memory_llm/            # Memory LLM Service (Java)
├── ai_agents/             # Python AI агенты
├── embeddings/            # Генерация эмбеддингов
└── ml_models/             # ML модели
```

### Frontend
```
frontend/
├── web-app/               # Веб-приложение (React)
├── mobile-app/            # Мобильное приложение
├── admin-panel/           # Админ панель
└── shared/                # Общие компоненты
```

### Infrastructure
```
infrastructure/
├── docker/                # Docker конфигурации
├── kubernetes/            # K8s манифесты
├── monitoring/            # Prometheus, Grafana
├── logging/               # ELK Stack
└── backup/                # Система резервного копирования
```

## 🔧 Технологический стек

### Backend
- **Django** - Основной веб-фреймворк
- **FastAPI** - API для аналитики
- **Celery** - Асинхронные задачи
- **PostgreSQL** - Основная БД
- **Redis** - Кэш и очереди

### Frontend
- **React** - Веб-интерфейс
- **TypeScript** - Типизация
- **Material-UI** - UI компоненты
- **Redux Toolkit** - Управление состоянием

### AI & ML
- **Python** - Основной язык AI
- **Java Spring Boot** - Memory LLM Service
- **OpenAI API** - Генерация эмбеддингов
- **pgvector** - Векторная БД
- **LangChain** - AI агенты

### DevOps & Monitoring
- **Docker** - Контейнеризация
- **Nginx** - Reverse proxy
- **Prometheus** - Метрики
- **Grafana** - Визуализация
- **ELK Stack** - Логирование

## 🚀 Процесс развертывания

### Локальная разработка
```bash
## Запуск всех сервисов
./scripts/project-manager.ps1 start

## Запуск только core
./scripts/project-manager.ps1 start core

## Проверка статуса
./scripts/project-manager.ps1 status
```

### Продакшн развертывание
```bash
## Развертывание через Docker Compose
docker-compose -f docker-compose.production.yml up -d

## Проверка логов
docker-compose -f docker-compose.production.yml logs -f
```

## 📊 Мониторинг и логирование

### Метрики
- Response time для API
- Throughput запросов
- Error rate
- Database performance
- AI service metrics

### Логирование
- Structured logging (JSON)
- Centralized log collection
- Log rotation и архивирование
- Alerting на критические ошибки

## 🔒 Безопасность

### Аутентификация
- JWT токены
- Role-based access control
- Rate limiting
- Brute force protection

### Данные
- Шифрование в rest
- Secure API endpoints
- Database access control
- Audit logging

## 📈 Масштабирование

### Горизонтальное масштабирование
- Load balancing через Nginx
- Database read replicas
- Redis clustering
- Microservices architecture

### Вертикальное масштабирование
- Resource optimization
- Database tuning
- Caching strategies
- Code optimization

## 🧪 Тестирование

### Unit тесты
- Python: pytest
- JavaScript: Jest
- Java: JUnit

### Integration тесты
- API testing
- Database testing
- End-to-end testing

### Performance тесты
- Load testing
- Stress testing
- Database performance

## 📚 Документация

### Техническая документация
- API reference
- Database schema
- Deployment guides
- Troubleshooting

### Пользовательская документация
- User guides
- Admin guides
- FAQ
- Video tutorials

## 🔄 CI/CD Pipeline

### Автоматизация
- GitHub Actions
- Automated testing
- Code quality checks
- Automated deployment

### Quality Gates
- Code coverage > 80%
- Security scanning
- Performance benchmarks
- Documentation completeness

---

**Статус**: Активный  
**Последнее обновление**: Август 2025

