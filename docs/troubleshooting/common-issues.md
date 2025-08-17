# 🚨 Решение общих проблем - Dubai Platform

## Частые проблемы и их решения

### 🔴 Проблемы с Docker

#### 1. Порт уже занят
**Симптомы**: Ошибка "port already in use" при запуске сервиса

**Решение**:
```bash
## Windows - проверка занятых портов
netstat -ano | findstr :3000

## Linux/Mac - проверка занятых портов
lsof -i :3000

## Остановка процесса
## Windows
taskkill /PID <PID> /F

## Linux/Mac
kill -9 <PID>
```

#### 2. Docker не запускается
**Симптомы**: Ошибка "Cannot connect to the Docker daemon"

**Решение**:
```bash
## Перезапуск Docker Desktop
## Windows: Restart Docker Desktop
## Linux: sudo systemctl restart docker

## Проверка статуса
docker info

## Очистка системы
docker system prune -a
docker volume prune
```

#### 3. Проблемы с образами
**Симптомы**: Ошибка "image not found" или поврежденные образы

**Решение**:
```bash
## Удаление поврежденных образов
docker rmi $(docker images -q)

## Пересборка образов
docker compose build --no-cache

## Очистка неиспользуемых образов
docker image prune -a
```

### 🔴 Проблемы с базами данных

#### 1. PostgreSQL не подключается
**Симптомы**: Ошибка "connection refused" или "authentication failed"

**Решение**:
```bash
## Проверка статуса контейнера
docker ps | grep postgres

## Просмотр логов
docker logs realty-main-db

## Перезапуск базы данных
docker restart realty-main-db

## Сброс базы данных (осторожно!)
docker volume rm realty_main_postgres_data
```

#### 2. Memory LLM база данных недоступна
**Симптомы**: Ошибка "pgvector extension not found"

**Решение**:
```bash
## Проверка правильного образа
docker images | grep pgvector

## Пересоздание контейнера
docker compose -f docker-compose.monitoring.yml down
docker compose -f docker-compose.monitoring.yml up -d

## Проверка расширений
docker exec -it memory-postgres-production psql -U memoryuser -d memory_llm -c "\dx"
```

### 🔴 Проблемы с сервисами

#### 1. Project Launcher не запускается
**Симптомы**: Ошибка "port 80 already in use" или сервис недоступен

**Решение**:
```bash
## Проверка порта 80
netstat -ano | findstr :80

## Запуск с другим портом
cd services/project-launcher
## Измените порт в docker-compose.yml
docker compose up -d

## Проверка логов
docker logs project-launcher
```

#### 2. DXB Frontend не отвечает
**Симптомы**: Белый экран или ошибки в консоли браузера

**Решение**:
```bash
## Проверка статуса
docker ps | grep dxb-frontend

## Перезапуск
docker restart dxb-frontend

## Просмотр логов
docker logs -f dxb-frontend

## Проверка переменных окружения
docker exec -it dxb-frontend env | grep NODE_ENV
```

#### 3. Realty Backend API недоступен
**Симптомы**: Ошибка "connection refused" или "timeout"

**Решение**:
```bash
## Проверка статуса
docker ps | grep realty-main

## Проверка health check
curl http://localhost:8000/health/

## Просмотр логов
docker logs realty-main-web

## Перезапуск
docker restart realty-main-web
```

### 🔴 Проблемы с AI агентами

#### 1. AI агенты не работают
**Симптомы**: Ошибки "model not found" или "API key invalid"

**Решение**:
```bash
## Проверка переменных окружения
cd compose-for-agents/adk
cat .env

## Проверка API ключей
echo $OPENAI_API_KEY
echo $ANTHROPIC_API_KEY

## Перезапуск агентов
docker compose down
docker compose up -d
```

#### 2. Memory LLM не отвечает
**Симптомы**: Ошибка "vector search failed" или "embedding error"

**Решение**:
```bash
## Проверка статуса
docker ps | grep memory

## Проверка логов
docker logs memory-postgres-production

## Проверка подключения к базе
docker exec -it memory-postgres-production psql -U memoryuser -d memory_llm -c "SELECT 1;"

## Перезапуск
docker compose -f docker-compose.monitoring.yml restart
```

### 🔴 Проблемы с мониторингом

#### 1. Grafana недоступен
**Симптомы**: Ошибка "connection refused" или "login failed"

**Решение**:
```bash
## Проверка статуса
docker ps | grep grafana

## Проверка порта
netstat -ano | findstr :3003

## Перезапуск
docker restart grafana

## Проверка логов
docker logs grafana

## Сброс пароля (если нужно)
## По умолчанию: admin/admin
```

#### 2. Prometheus не собирает метрики
**Симптомы**: Нет данных в Grafana или ошибки "target down"

**Решение**:
```bash
## Проверка статуса
docker ps | grep prometheus

## Проверка конфигурации
docker exec -it prometheus cat /etc/prometheus/prometheus.yml

## Перезапуск
docker restart prometheus

## Проверка targets
curl http://localhost:9090/api/v1/targets
```

### 🔴 Проблемы с сетью

#### 1. Сервисы не видят друг друга
**Симптомы**: Ошибки "connection refused" между контейнерами

**Решение**:
```bash
## Проверка Docker сетей
docker network ls

## Проверка подключения контейнеров к сети
docker network inspect bridge

## Создание custom сети
docker network create dubai-network

## Подключение сервисов к сети
docker network connect dubai-network dxb-frontend
```

#### 2. Проблемы с DNS
**Симптомы**: Ошибки "name resolution failed"

**Решение**:
```bash
## Проверка DNS в контейнере
docker exec -it dxb-frontend nslookup google.com

## Настройка DNS в docker-compose
services:
  dxb-frontend:
    dns:
      - 8.8.8.8
      - 8.8.4.4
```

### 🔴 Проблемы с производительностью

#### 1. Высокое потребление CPU/RAM
**Симптомы**: Медленная работа системы или зависания

**Решение**:
```bash
## Проверка ресурсов
docker stats

## Ограничение ресурсов в docker-compose
services:
  dxb-frontend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G

## Очистка неиспользуемых ресурсов
docker system prune -a
```

#### 2. Медленная работа базы данных
**Симптомы**: Долгие запросы или таймауты

**Решение**:
```bash
## Проверка размера базы
docker exec -it realty-main-db psql -U postgres -d realty -c "SELECT pg_size_pretty(pg_database_size('realty'));"

## Очистка старых данных
docker exec -it realty-main-db psql -U postgres -d realty -c "VACUUM ANALYZE;"

## Проверка индексов
docker exec -it realty-main-db psql -U postgres -d realty -c "\di"
```

## 🆘 Получение дополнительной помощи

### 1. Логи и диагностика
```bash
## Сбор всех логов
docker logs --tail 100 dxb-frontend > frontend.log
docker logs --tail 100 realty-main-web > backend.log
docker logs --tail 100 project-launcher > launcher.log

## Проверка системных ресурсов
docker system df
docker stats --no-stream
```

### 2. Health checks
```bash
## Проверка всех health endpoints
curl http://localhost:80/health
curl http://localhost:3000/health
curl http://localhost:8000/health/
curl http://localhost:8080/health
```

### 3. Полезные команды
```bash
## Полная перезагрузка системы
docker compose -f docker-compose.all-projects.yml down
docker system prune -a
docker compose -f docker-compose.all-projects.yml up -d

## Проверка версий
docker --version
docker compose version
docker version
```

## 🔗 Полезные ссылки

- [Основная документация](../README.md)
- [Quick Start Guide](../deployment/quick-start.md)
- [Архитектура](../architecture/overview.md)
- [API документация](../api/overview.md)

---

**Версия**: 1.0.0  
**Последнее обновление**: {{ date }}  
**Статус**: Активная разработка

