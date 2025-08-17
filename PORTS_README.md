# 🚀 Система управления портами для всех проектов

## 📋 Обзор

Эта система обеспечивает **централизованное управление портами** для всех проектов, исключая конфликты и упрощая развертывание.

## 🏗️ Архитектура портов

### DXB Frontend (React)
- **Порт**: 3000
- **Сервис**: estate_front
- **Назначение**: Основной React фронтенд

### Realty Main (Django Backend)
- **Web порт**: 8000
- **DB порт**: 5432
- **Назначение**: Django API и PostgreSQL

### PfImport Service
- **Порт**: 8082
- **Назначение**: Сервис импорта данных

### Memory LLM Production Stack
- **PostgreSQL**: 5433
- **Redis**: 6379
- **Memory Service**: 8081
- **Nginx**: 8080
- **Prometheus**: 9090
- **Grafana**: 3003

## 📁 Файлы конфигурации

### 1. `global-ports.env`
Центральный файл с портами для всех проектов.

### 2. `docker-compose.all-projects.yml`
Главный файл для запуска всех проектов одновременно.

### 3. Индивидуальные файлы для каждого проекта:
- `../realty-main/docker-compose.ports.yml`
- `../DXB-frontend-develop/docker-compose.ports.yml`
- `../pfimport-main/docker-compose.ports.yml`

## 🧹 Очистка проекта (2025-08-16)

В рамках оптимизации проекта были удалены:
- Устаревшие файлы (old_README.md, old_docker-compose.yml)
- Дублированные конфигурации (docker-compose.simple.yml)
- Резервные копии (models_backup.py)
- Python кэш файлы (__pycache__, *.pyc)
- IDE конфигурации (.vscode, .cursor)
- Тестовые файлы (интегрированы в dashboard.html)

**Результат**: Уменьшение размера на 24.15 MB, удаление 5,312 файлов

## 🚀 Запуск

### Запуск всех проектов
```bash
docker compose -f docker-compose.all-projects.yml up -d
```

### Запуск отдельных проектов
```bash
# Memory LLM
docker compose -f docker-compose.monitoring.yml up -d

# Realty Main
cd ../realty-main
docker compose -f docker-compose.ports.yml up -d

# DXB Frontend
cd ../DXB-frontend-develop
docker compose -f docker-compose.ports.yml up -d

# PfImport
cd ../pfimport-main
docker compose -f docker-compose.ports.yml up -d
```

## 🔧 Изменение портов

### 1. Отредактируйте `global-ports.env`
```bash
# Пример изменения порта Grafana
MEMORY_GRAFANA_PORT=3004
```

### 2. Перезапустите сервисы
```bash
docker compose -f docker-compose.all-projects.yml down
docker compose -f docker-compose.all-projects.yml up -d
```

## 📊 Проверка портов

### Автоматическая проверка
```bash
powershell -ExecutionPolicy Bypass -File check-all-ports.ps1
```

### Ручная проверка
```bash
netstat -ano | findstr ":3000\|:8000\|:5432\|:5433\|:6379\|:8080\|:8081\|:8082\|:9090\|:3003"
```

## 🎯 Преимущества системы

- ✅ **Нет конфликтов портов**
- ✅ **Централизованное управление**
- ✅ **Легко изменить любой порт**
- ✅ **Автоматическая проверка**
- ✅ **Масштабируемость**
- ✅ **Простота развертывания**

## 🚨 Решение проблем

### Порт уже занят
1. Проверьте, какой процесс использует порт
2. Измените порт в `global-ports.env`
3. Перезапустите сервисы

### Переменные не загружаются
1. Убедитесь, что файл `global-ports.env` существует
2. Проверьте синтаксис файла
3. Используйте `--env-file global-ports.env`

## 📞 Поддержка

При возникновении проблем:
1. Запустите `check-all-ports.ps1`
2. Проверьте логи Docker
3. Убедитесь, что все файлы конфигурации существуют
