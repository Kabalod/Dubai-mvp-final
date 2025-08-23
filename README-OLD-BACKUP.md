
# 🚀 Dubai Project - Аналитическая платформа недвижимости

Централизованная система для анализа рынка недвижимости Дубая.

## 🎯 Цель проекта

Создать единую платформу для сбора, анализа данных о недвижимости и автоматизации отчетов.

## 🏗️ Архитектура

Проект построен на основе **монорепозитория**, управляемого с помощью **Nx**. Все основные сервисы находятся в папке `apps/`.

> 💡 **Подробное описание каждого файла и папки доступно в [Структуре Проекта](./docs/PROJECT_STRUCTURE.md).**

AI-компоненты вынесены в отдельный репозиторий: [Kabalod/MemoryProjectDubai](https://github.com/Kabalod/MemoryProjectDubai).

## 🚀 Быстрый старт

Для управления проектом используется **Taskfile**.

1.  **Установите Taskfile:** [Инструкции](https://taskfile.dev/installation/)
2.  **Запустите все сервисы:**
    ```bash
    task docker:up
    ```
3.  **Проверьте статус:**
    ```bash
    task docker:ps
    ```

## 📚 Документация

- **[Структура Проекта](./docs/PROJECT_STRUCTURE.md)**: Главный документ по архитектуре.
- **[Обзор Платформы](./docs/OVERVIEW.md)**: Высокоуровневое описание.
- **[Навигация по Документации](./docs/NAVIGATION.md)**: Путеводитель.
- **[Парсер → Экспорт → Интеграция с API](./docs/parser-api-integration.md)**: Практическое руководство по проверке здоровья парсера, пробному сбору/экспорту и импорту в основной бэкенд.
- **[Онлайн-документация](https://kabalod.github.io/Workerproject/)**: Сгенерированный сайт (GitHub Pages).

## 🛠️ Troubleshooting и отчёты

- **[Troubleshooting: Общие проблемы](./docs/troubleshooting/common-issues.md)**
- **[Implementation Report](./docs/IMPLEMENTATION_REPORT.md)** — сводный отчёт и логи проверок

## 🩺 Health и CORS

- **Health (API)**: `GET http://localhost:8090/api/health/` — ожидается `200` с JSON.
  - Если получаете `301`, возможно включён `SECURE_SSL_REDIRECT`; для локали можно выставить `SECURE_SSL_REDIRECT=false`.
- **CORS**:
  - ENV `DJANGO_ALLOWED_HOSTS` должен включать `localhost`, `127.0.0.1`, и ваш прод-домен.
  - ENV `CORS_ALLOWED_ORIGINS` должен включать `http://localhost:3000`, `http://localhost`, и прод-домен.
- **Smoke**:
  - `curl -i -L http://localhost:8090/api/health/`
  - `curl -i -H "Origin: http://localhost:3000" http://localhost:8090/api/health/`

## 🤝 Вклад в проект

Пожалуйста, следуйте правилам, описанным в [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/Kabalod/Workerproject/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kabalod/Workerproject/discussions)
- **Email**: kbalodk@gmail.com
