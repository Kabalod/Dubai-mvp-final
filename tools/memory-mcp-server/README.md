# 🚀 Memory LLM MCP Server для Cursor

## 📋 Описание

MCP (Model Context Protocol) сервер для интеграции Memory LLM с Cursor AI. Позволяет Cursor использовать нашу память для контекстной разработки.

## 🏗️ Архитектура

```
Cursor AI ←→ MCP Server ←→ Memory LLM Service ←→ PostgreSQL + Redis
```

## 🚀 Быстрый старт

### 1. Запуск MCP сервера

#### PowerShell (Windows):
```powershell
.\start-mcp.ps1
```

#### Batch (Windows):
```cmd
start-mcp.bat
```

#### Docker Compose:
```bash
docker compose up -d
```

### 2. Настройка Cursor

1. Откройте Cursor
2. Перейдите в **Settings > AI > MCP Servers**
3. Добавьте новый сервер:
   - **Name**: `memory-llm`
   - **Command**: `docker`
   - **Args**: `run --rm -i -p 3004:3004 memory-mcp-server:latest`
4. Перезапустите Cursor

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `NODE_ENV` | Режим работы | `production` |
| `PORT` | Порт MCP сервера | `3004` |
| `MEMORY_BASE_URL` | URL Memory LLM сервиса | `http://localhost:8081` |
| `MEMORY_API_KEY` | API ключ для Memory LLM | `your-api-key-here` |
| `LOG_LEVEL` | Уровень логирования | `info` |

### Файлы конфигурации

- `env.example` - пример переменных окружения
- `cursor-mcp.json` - конфигурация для Cursor
- `docker-compose.yml` - Docker Compose конфигурация

## 📊 API Endpoints

### MCP Protocol

- `memory.search` - поиск в памяти
- `memory.add` - добавление в память
- `memory.health` - проверка здоровья
- `memory.batchAdd` - пакетное добавление
- `memory.stats` - статистика памяти
- `memory.export` - экспорт данных

### HTTP Endpoints

- `GET /health` - проверка здоровья сервера
- `GET /status` - статус подключения к Memory LLM

## 🐳 Docker

### Сборка образа
```bash
docker build -t memory-mcp-server .
```

### Запуск контейнера
```bash
docker run -d --name memory-mcp-server \
  -p 3004:3004 \
  -e MEMORY_BASE_URL=http://localhost:8081 \
  -e MEMORY_API_KEY=your-key \
  memory-mcp-server
```

### Docker Compose
```bash
docker compose up -d
```

## 🔍 Отладка

### Логи контейнера
```bash
docker logs memory-mcp-server
```

### Проверка статуса
```bash
docker ps --filter "name=memory-mcp-server"
```

### Тест подключения
```bash
curl http://localhost:3004/health
```

## 🚨 Решение проблем

### MCP сервер не запускается
1. Проверьте, что Docker запущен
2. Убедитесь, что порт 3004 свободен
3. Проверьте логи: `docker logs memory-mcp-server`

### Cursor не подключается
1. Убедитесь, что MCP сервер запущен
2. Проверьте конфигурацию в Cursor
3. Перезапустите Cursor после настройки

### Ошибки подключения к Memory LLM
1. Проверьте, что Memory LLM сервис запущен
2. Убедитесь в правильности `MEMORY_BASE_URL`
3. Проверьте API ключ

## 📚 Дополнительные ресурсы

- [MCP Protocol Documentation](https://modelcontextprotocol.io/)
- [Cursor AI Documentation](https://cursor.sh/docs)
- [Memory LLM Documentation](../README.md)

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи Docker
2. Убедитесь в правильности конфигурации
3. Проверьте статус всех сервисов
