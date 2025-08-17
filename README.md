
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
- **[Онлайн-документация](https://kabalod.github.io/Workerproject/)**: Сгенерированный сайт (GitHub Pages).

## 🤝 Вклад в проект

Пожалуйста, следуйте правилам, описанным в [CONTRIBUTING.md](./docs/CONTRIBUTING.md).

## 📞 Поддержка

- **Issues**: [GitHub Issues](https://github.com/Kabalod/Workerproject/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Kabalod/Workerproject/discussions)
- **Email**: kbalodk@gmail.com
