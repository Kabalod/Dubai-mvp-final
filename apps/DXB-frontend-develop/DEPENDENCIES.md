# Frontend Dependencies

Как проверять зависимости:
- Локально: `yarn install --immutable` (падает при дрейфе lockfile)
- CI: шаги `deps:check` и `yarn build` (см. .github/workflows/deps-verify.yml)

Как задавать API URL:
- `.env`: `VITE_FRONTEND_API_URL=http://localhost:8000`
- В проде: использовать переменные сборки Vite или общий прокси `/api/`

Примечание:
- Скрипты AI (`mcp:*`, `memsync:*`) помечены как deprecated и ничего не делают

