## DXB Frontend

### Переменные окружения

Фронтенд использует единый конфиг URL через Vite env.

- `VITE_FRONTEND_API_URL` — базовый URL REST API (включая `/api`).
  - Примеры: `/api` (через Nginx), `http://localhost:8090/api` (напрямую)
- `VITE_GRAPHQL_API_URL` — GraphQL, по умолчанию `/graphql`.
- `VITE_MEMORY_API_URL` — Memory LLM. По умолчанию `${VITE_FRONTEND_API_URL}/memory`.

Пример `.env.local`:
```
VITE_FRONTEND_API_URL=/api
VITE_MEMORY_API_URL=http://localhost:8080
# VITE_GRAPHQL_API_URL=/graphql
```

### Запуск

Dev (порт 3000):
```powershell
$env:VITE_FRONTEND_API_URL='/api'; $env:VITE_MEMORY_API_URL='http://localhost:8080'; npm run dev
```

Build/Preview:
```powershell
$env:VITE_FRONTEND_API_URL='/api'; $env:VITE_MEMORY_API_URL='http://localhost:8080'; npm run build
npm run preview
```

### Конфигурация

- `src/config.ts` централизует URL: `API_BASE_URL`, `GRAPHQL_API_URL`, `MEMORY_API_URL`.
- `vite.config.ts` читает env и задаёт порт 3000 для dev/preview.

### i18n

1. Добавлять строки через компонент <Trans> или обёртку t (alias i18n._). Обязательно добавлять id элемента по паттерну {название компонента или страницы}.{#}
2. npm run extract — выносит все i18n строки в файлы .po (src/locales/{language}/messages.po)
3. при необходимости добавить переводы в файлы .po
4. npm run compile
