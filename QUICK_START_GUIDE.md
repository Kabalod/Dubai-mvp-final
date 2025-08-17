# 🚀 Dubai Platform - Быстрый старт

Полное руководство по запуску платформы Dubai за 5 минут.

## ⚡ Сверхбыстрый запуск

### 1. Клонирование и настройка
```bash
git clone <repository-url>
cd Dubai
```

### 2. Запуск Project Launcher (новый способ)
```bash
cd services/project-launcher
cp env.example .env
docker compose up -d
```

### 3. Открытие веб-интерфейса
```
http://localhost:80
```

### 4. Управление проектами через веб-интерфейс
- Запуск всех проектов одним кликом
- Мониторинг статуса в реальном времени
- Управление конфигурациями

## 🔄 Традиционный запуск

### Запуск всех проектов одновременно
```bash
# Windows
./start-all-with-memory.bat

# Linux/Mac
./start-all-with-memory.sh

# Или через Docker Compose
docker compose -f docker-compose.all-projects.yml up -d
```

### Запуск отдельных компонентов
```bash
# Memory LLM (AI память)
docker compose -f docker-compose.monitoring.yml up -d

# Realty Backend (Django)
cd realty-main
docker compose up -d

# DXB Frontend (React)
cd DXB-frontend-develop
npm run dev
```

## 🌐 Доступ к сервисам

| Сервис | URL | Описание |
|--------|-----|----------|
| **Project Launcher** | http://localhost:80 | 🆕 Управление проектами |
| **DXB Frontend** | http://localhost:3000 | React приложение |
| **Realty Backend** | http://localhost:8000 | Django API |
| **Memory LLM** | http://localhost:8080 | AI сервис |
| **Grafana** | http://localhost:3003 | Мониторинг |
| **Prometheus** | http://localhost:9090 | Метрики |
| **Kibana** | http://localhost:5601 | Логи |

## 🔧 Настройка окружения

### Переменные окружения
```bash
# Скопируйте примеры
cp services/project-launcher/env.example services/project-launcher/.env
cp global-ports.env.example global-ports.env

# Отредактируйте под ваши нужды
nano services/project-launcher/.env
nano global-ports.env
```

### Основные настройки
```env
# Project Launcher
PROJECT_LAUNCHER_PORT=8000
FRONTEND_PORT=3000

# База данных
DATABASE_URL=postgresql://launcher:launcher@localhost:5434/launcher

# Безопасность
SECRET_KEY=your-secret-key-here
```

## 📊 Мониторинг и диагностика

### Проверка статуса
```bash
# Общий статус
curl http://localhost:80/status

# Health check
curl http://localhost:8000/health

# Статус Docker
docker ps
```

### Логи и метрики
```bash
# Логи Project Launcher
docker logs project-launcher-api

# Логи всех сервисов
docker compose logs -f

# Метрики Prometheus
curl http://localhost:9090/metrics
```

## 🚨 Решение проблем

### Порт уже занят
```bash
# Проверка занятых портов
netstat -ano | findstr ":3000\|:8000\|:8080"

# Изменение портов в .env
FRONTEND_PORT=3001
PROJECT_LAUNCHER_PORT=8001
```

### Docker не запущен
```bash
# Запуск Docker Desktop
# Или через командную строку
docker --version
docker compose --version
```

### Проблемы с базой данных
```bash
# Перезапуск базы
docker compose restart project-launcher-db

# Проверка подключения
docker exec -it project-launcher-db psql -U launcher -d launcher
```

## 🎯 Следующие шаги

### 1. Изучение документации
- [📚 Documentation Hub](./docs/README.md)
- [🚀 Project Launcher](./services/project-launcher/README.md)
- [🏠 DXB Frontend](./DXB-frontend-develop/README.md)

### 2. Настройка проектов
- Конфигурация в `services/project-launcher/configs/projects/`
- Переменные окружения в `.env` файлах
- Мониторинг через Grafana дашборды

### 3. Разработка
- API документация: http://localhost:8000/docs
- GraphQL playground: http://localhost:8000/graphql
- Swagger UI: http://localhost:8081/swagger-ui/

### 4. Production развертывание
- Изменение `ENVIRONMENT=production`
- Настройка SSL/TLS
- Конфигурация backup и мониторинга

## 🔄 Обновление системы

### Обновление Project Launcher
```bash
cd services/project-launcher
git pull origin main
docker compose down
docker compose up -d --build
```

### Обновление всех проектов
```bash
git pull origin main
docker compose -f docker-compose.all-projects.yml down
docker compose -f docker-compose.all-projects.yml up -d --build
```

## 📞 Поддержка

### Быстрая помощь
1. **Проверьте статус**: http://localhost:80/status
2. **Просмотрите логи**: Kibana dashboard
3. **Проверьте метрики**: Grafana dashboards
4. **Создайте Issue**: GitHub Issues

### Полезные команды
```bash
# Остановка всех сервисов
docker compose -f docker-compose.all-projects.yml down

# Очистка Docker
docker system prune -a

# Перезапуск Project Launcher
cd services/project-launcher && docker compose restart

# Проверка ресурсов
docker stats
```

---

## 🎉 Готово!

Ваша платформа Dubai успешно запущена! 

**Что дальше?**
- 🏠 Изучите [DXB Frontend](./DXB-frontend-develop/README.md)
- 🧠 Попробуйте [AI Ассистент](./DXB-frontend-develop/AI_ASSISTANT_README.md)
- 📊 Настройте [мониторинг](./docs/deployment/monitoring.md)
- 🚀 Автоматизируйте [развертывание](./docs/deployment/automation.md)

> 🚀 **Dubai Platform** - будущее недвижимости с искусственным интеллектом!
