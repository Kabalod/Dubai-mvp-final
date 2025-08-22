# 🚀 Dubai Platform - Быстрый старт

Полное руководство по запуску платформы Dubai за 5 минут.

## ⚡ Сверхбыстрый запуск

> Важно: некоторые упоминания (Project Launcher, docker-compose.all-projects.yml, monitoring) относятся к исторической конфигурации и не входят в текущий репозиторий. Используйте prod-стэк `docker-compose.prod.yml` из корня.

### 1. Клонирование и настройка
```bash
git clone <repository-url>
cd Dubai
```

### 2. Запуск Project Launcher (историческая секция — вне текущего репозитория)
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

### Запуск всех проектов одновременно (историческая секция — вне текущего репозитория)
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
| **Realty Backend** | http://localhost:8090 | Django API |
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

## API (Django Realty Backend)
# Внешний порт → внутренний 8000
API_PORT=8090
# Хосты и CORS
API_ALLOWED_HOSTS=api-service,localhost,127.0.0.1,<домен>
CORS_ORIGINS=http://localhost:3000,http://localhost,https://<домен>
# Безопасность (только пример для локалки)
API_SECRET_KEY=mvp-secret-key-change-in-production
# Для локального smoke-теста по HTTP
SECURE_SSL_REDIRECT=false

## База данных
DATABASE_URL=postgresql://launcher:launcher@localhost:5434/launcher

## Безопасность
SECRET_KEY=your-secret-key-here
```

## ✅ Чек-лист прод-развертывания API

- [ ] `DJANGO_ALLOWED_HOSTS` включает `localhost`, `127.0.0.1`, и прод-домен
- [ ] `CORS_ALLOWED_ORIGINS` включает `http://localhost:3000`, `http://localhost`, и прод-домен
- [ ] `SECRET_KEY` задан
- [ ] `DATABASE_URL` и `REDIS_URL` корректны
- [ ] Прокси-порт API выставлен: хост `8090` → контейнер `8000`

### Применение миграций и сборка статики
```bash
docker compose -f docker-compose.prod.yml exec api-service \
  python manage.py migrate --noinput

docker compose -f docker-compose.prod.yml exec api-service \
  python manage.py collectstatic --noinput
```

### Smoke-тесты
```bash
# Health endpoint
curl -i http://localhost:8090/api/health/

# Базовый API
curl -I http://localhost:8090/api/
```

Ожидание: `200` на `/api/health/`. Если получаете `301`, возможно включён `SECURE_SSL_REDIRECT`; временно отключите:
```env
SECURE_SSL_REDIRECT=false
```

### Диагностика API без curl (внутри контейнера)
```bash
docker compose -f docker-compose.prod.yml exec api-service \
  python - << 'PY'
import urllib.request as u
print(u.urlopen('http://localhost:8000/api/health/').read())
PY
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
#### 4. Smoke-тест API (health и CORS)
```bash
# Миграции и статика
docker compose -f docker-compose.prod.yml exec api-service \
  python manage.py migrate --noinput
docker compose -f docker-compose.prod.yml exec api-service \
  python manage.py collectstatic --noinput

# Health (учитывая возможный редирект)
curl -i -L http://localhost:8090/api/health/

# CORS проверка
curl -i -H "Origin: http://localhost:3000" http://localhost:8090/api/health/
```
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

## 🚀 Настройка и устранение проблем с Vercel Deploy

В этом разделе описаны шаги по настройке деплоя на Vercel и способы решения распространенных проблем, возникших в процессе.

### 1. Первоначальный деплой и авторизация CLI

1.  **Vercel CLI не распознается:**
    *   **Проблема:** Команда `vercel` не находится в PATH.
    *   **Решение:** Установить Vercel CLI глобально: `npm install -g vercel`. Если после установки команда все равно не распознается, попробуйте открыть новый терминал или использовать `npx vercel <command>`.
2.  **Неверный токен Vercel:**
    *   **Проблема:** Ошибка "The specified token is not valid. Use `vercel login` to generate a new token.".
    *   **Решение:** Войти в Vercel CLI, используя `npx vercel login`. Следуйте инструкциям в терминале (обычно это открытие ссылки в браузере для авторизации).
3.  **Неверное имя проекта:**
    *   **Проблема:** Ошибка "Project names can be up to 100 characters long and must be lowercase...".
    *   **Решение:** При первом деплое используйте `npx vercel --prod` (без флага `--yes`), чтобы Vercel CLI запросил имя проекта. Введите имя в нижнем регистре (например, `dubai-mvp`).

### 2. Проблемы с файлами и разрешениями

1.  **Ошибка доступа (EACCES) к файлу `shared-data/latest_export.json`:**
    *   **Проблема:** Vercel не может получить доступ к файлу, что приводит к ошибке деплоя.
    *   **Решение:**
        *   Временно удалить или переименовать папку `shared-data`.
        *   Создать файл `.vercelignore` в корне проекта с содержимым: `shared-data/`. Это указывает Vercel игнорировать папку при деплое.

### 3. Проблемы с конфигурацией фронтенда и бэкенда

1.  **404: NOT_FOUND после деплоя (для фронтенда):**
    *   **Проблема:** Vercel не может найти статические файлы фронтенда (`index.html`).
    *   **Решение:** Указать Vercel, где находится фронтенд-приложение (`apps/DXB-frontend-develop`), как его собирать (`npm run build`) и где находится выходная директория (`dist`). Это делается в `vercel.json` в корне проекта.

2.  **Ошибка 500 (Internal Server Error) для бэкенда (`ModuleNotFoundError: No module named 'django'`)**:
    *   **Проблема:** Django-приложение не может найти свои зависимости или модули на Vercel. Это происходит из-за того, что `requirements.txt` не находится в той же директории, что и точка входа Serverless Function, или некорректно настроен `PYTHONPATH`.
    *   **Решение:**
        *   Создать промежуточную директорию `apps/realty-main/api/`.
        *   Создать файл `apps/realty-main/api/index.py`, который будет точкой входа для Vercel и явно добавит корневую директорию Django-проекта в `PYTHONPATH`.
        *   Переместить `requirements.txt` из `apps/realty-main/` в `apps/realty-main/api/requirements-lambda.txt`.
        *   Обновить `vercel.json`, чтобы Serverless Function указывала на `apps/realty-main/api/index.py` и использовала `pip install -r apps/realty-main/api/requirements-lambda.txt`.

3.  **Превышение размера Serverless Function (250 MB):**
    *   **Проблема:** Даже с оптимизированным `requirements-lambda.txt` функция слишком велика.
    *   **Решение:** Создать дополнительный файл `.vercelignore` внутри директории `apps/realty-main/` (рядом с `requirements-lambda.txt`). В этот `.vercelignore` добавить исключения для ненужных в продакшн-окружении файлов и папок, таких как:
        ```
        __pycache__/
        *.pyc
        docs/
        tests/
        deploy/
        migrations/
        ```
        * Также удалили `whitenoise[brotli]` из `requirements-lambda.txt`, так как обслуживание статики обрабатывается фронтендом.

### 4. Проблемы с установкой зависимостей фронтенда

1.  **`Command "yarn install" exited with 1`:**
    *   **Проблема:** Конфликт между `package-lock.json` (npm) и `yarn.lock` (Yarn). Vercel пытается использовать Yarn, но наличие `package-lock.json` вызывает ошибки.
    *   **Решение:** Удалить файл `apps/DXB-frontend-develop/package-lock.json`. Это гарантирует, что Vercel/Yarn будет использовать только `yarn.lock` для установки зависимостей.

---

