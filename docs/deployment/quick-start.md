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
## Windows
./start-all-with-memory.bat

## Linux/Mac
./start-all-with-memory.sh

## Или через Docker Compose
docker compose -f docker-compose.all-projects.yml up -d
```

### Запуск отдельных компонентов
```bash
## Memory LLM (AI память)
docker compose -f docker-compose.monitoring.yml up -d

## Realty Backend (Django)
cd realty-main
docker compose up -d

## DXB Frontend (React)
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
## Скопируйте примеры
cp services/project-launcher/env.example services/project-launcher/.env
cp global-ports.env.example global-ports.env

## Отредактируйте под ваши нужды
nano services/project-launcher/.env
nano global-ports.env
```

### Основные настройки
```env
## Project Launcher
PROJECT_LAUNCHER_PORT=8000
FRONTEND_PORT=3000

## База данных
DATABASE_URL=postgresql://launcher:launcher@localhost:5434/launcher

## Безопасность
SECRET_KEY=your-secret-key-here
```

## 📊 Мониторинг и диагностика

### Проверка статуса
```bash
## Общий статус
docker ps

## Логи Project Launcher
docker logs project-launcher

## Health checks
curl http://localhost:80/health
```

### Полезные команды
```bash
## Остановка всех сервисов
docker compose -f docker-compose.all-projects.yml down

## Перезапуск конкретного сервиса
docker restart dxb-frontend

## Просмотр логов
docker logs -f dxb-frontend
```

## 🚨 Решение проблем

### Частые проблемы

#### 1. Порт уже занят
```bash
## Проверка занятых портов
netstat -ano | findstr :3000

## Остановка процесса
taskkill /PID <PID> /F
```

#### 2. Проблемы с Docker
```bash
## Перезапуск Docker
docker system prune -a
docker volume prune
```

#### 3. Проблемы с базой данных
```bash
## Сброс базы данных
docker volume rm realty_main_postgres_data
```

## 🔗 Полезные ссылки

- [Основная документация](../README.md)
- [API документация](../api/overview.md)
- [Архитектура](../architecture/overview.md)
- [Troubleshooting](../troubleshooting/common-issues.md)

---

**Версия**: 1.0.0  
**Последнее обновление**: {{ date }}  
**Статус**: Активная разработка

