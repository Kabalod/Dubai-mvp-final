# 🚀 Система линтинга документации Dubai Project

## Обзор

Система линтинга документации Dubai Project - это комплексное решение для автоматической проверки качества, структуры и корректности всей документации проекта. Система включает в себя PowerShell скрипты, pre-commit hooks и GitHub Actions для непрерывной интеграции.

## 🏗️ Архитектура системы

### Компоненты
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   PowerShell    │    │   Pre-commit    │    │   GitHub        │
│   Скрипты      │    │   Hooks         │    │   Actions       │
│   (Локально)   │    │   (Автоматика)  │    │   (CI/CD)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Результаты    │
                    │   проверок      │
                    └─────────────────┘
```

### Файлы системы
- **`docs/lint-docs.ps1`** - Основной скрипт линтинга
- **`.pre-commit-config.yaml`** - Конфигурация pre-commit hooks
- **`scripts/check-project-structure.ps1`** - Проверка структуры проекта
- **`scripts/check-env.ps1`** - Проверка переменных окружения
- **`.github/workflows/docs-check.yml`** - GitHub Actions workflow

## 🔧 Установка и настройка

### Предварительные требования
- **PowerShell 7+** (для Windows)
- **Python 3.8+**
- **Node.js 16+**
- **Git 2.30+**

### Установка зависимостей
```bash
# Python зависимости
pip install pre-commit

# Node.js зависимости
npm install -g markdownlint-cli
npm install -g markdown-link-check

# Установка pre-commit hooks
pre-commit install
pre-commit install --hook-type pre-push
```

### Первоначальная настройка
```bash
# Клонирование репозитория
git clone https://github.com/your-username/dubai-project.git
cd dubai-project

# Установка hooks
pre-commit install

# Первый запуск на всех файлах
pre-commit run --all-files
```

## 📝 Использование PowerShell скриптов

### Основной линтер документации
```powershell
# Базовая проверка
.\docs\lint-docs.ps1

# Подробный вывод
.\docs\lint-docs.ps1 -Verbose

# Автоматическое исправление
.\docs\lint-docs.ps1 -Fix

# Тестовый режим
.\docs\lint-docs.ps1 -Test
```

### Проверка структуры проекта
```powershell
# Базовая проверка
.\scripts\check-project-structure.ps1

# Подробный вывод
.\scripts\check-project-structure.ps1 -Verbose
```

### Проверка переменных окружения
```powershell
# Базовая проверка
.\scripts\check-env.ps1

# Подробный вывод
.\scripts\check-env.ps1 -Verbose
```

## 🔍 Что проверяет система

### 1. Структура заголовков
- ✅ Только один H1 заголовок на файл
- ✅ Правильная иерархия H1 → H2 → H3
- ✅ Отсутствие "прыжков" в уровнях

### 2. Внутренние ссылки
- ✅ Корректность относительных путей
- ✅ Существование целевых файлов
- ✅ Правильность синтаксиса Markdown

### 3. Качество документации
- ✅ Минимальная длина файлов
- ✅ Наличие описаний и обзоров
- ✅ Структурированность контента
- ✅ Примеры кода и ссылки

### 4. Структура проекта
- ✅ Наличие обязательных директорий
- ✅ Наличие ключевых файлов
- ✅ Корректность конфигурации

### 5. Переменные окружения
- ✅ Наличие .env файлов
- ✅ Корректность переменных
- ✅ Безопасность конфигурации

## 🚀 Pre-commit Hooks

### Автоматические проверки
Pre-commit hooks автоматически запускаются перед каждым коммитом и проверяют:

- **Код**: Python, JavaScript, YAML
- **Документация**: Markdown, структура, ссылки
- **Конфигурация**: Docker, переменные окружения
- **Безопасность**: Секреты, лицензии

### Настройка hooks
```yaml
# .pre-commit-config.yaml
repos:
  - repo: local
    hooks:
      - id: dubai-docs-lint
        name: Dubai Documentation Lint
        entry: powershell -ExecutionPolicy Bypass -File docs/lint-docs.ps1
        language: system
        types: [markdown]
        always_run: true
```

### Принудительный запуск
```bash
# Запуск на всех файлах
pre-commit run --all-files

# Запуск конкретного hook
pre-commit run dubai-docs-lint

# Пропуск hooks (не рекомендуется)
git commit --no-verify
```

## 🔄 GitHub Actions CI/CD

### Автоматические проверки
GitHub Actions автоматически запускаются при:

- **Push** в main/develop ветки
- **Pull Request** в main/develop ветки
- **Изменения** в документации

### Этапы проверки
1. **Documentation Linting** - Основная проверка
2. **Documentation Quality** - Качество и покрытие
3. **Documentation Build** - Сборка документации
4. **Documentation Report** - Генерация отчета

### Просмотр результатов
- **Actions** вкладка в GitHub репозитории
- **Checks** в Pull Request
- **Artifacts** для скачивания результатов

## 📊 Интерпретация результатов

### Уровни проблем
- **❌ Error** - Критические проблемы, блокируют коммит
- **⚠️ Warning** - Предупреждения, требуют внимания
- **ℹ️ Info** - Информационные сообщения
- **✅ Success** - Успешное выполнение

### Коды выхода
- **0** - Успешное выполнение
- **1** - Найдены проблемы
- **2** - Критические ошибки

### Примеры вывода
```powershell
🔍 Проверка документации Dubai Project...

ℹ️  🏷️  Проверка структуры заголовков...
⚠️  Файл examples.md: найдено 15 H1 заголовков (должен быть только один)

ℹ️  🔗 Проверка внутренних ссылок...
⚠️  Сломанная ссылка в examples.md: ./frontend/components.md

ℹ️  🎯 Проверка качества документации...
ℹ️  Качество документации: 75.2% (45/60)

🔧 Автоматическое исправление общих проблем...
✅ Исправлен файл: examples.md

==================================
✅ Проверка документации завершена!
```

## 🛠️ Устранение проблем

### Частые проблемы и решения

#### 1. Множественные H1 заголовки
**Проблема**: В файле несколько заголовков `#`
**Решение**: Оставить только один H1, остальные заменить на H2
```markdown
# Основной заголовок
## Подзаголовок 1
## Подзаголовок 2
```

#### 2. Сломанные ссылки
**Проблема**: Ссылка ведет на несуществующий файл
**Решение**: Исправить путь или создать целевой файл
```markdown
# Неправильно
[Ссылка](./несуществующий.md)

# Правильно
[Ссылка](./существующий.md)
```

#### 3. Неправильная иерархия
**Проблема**: H3 после H1 без H2
**Решение**: Добавить H2 заголовок
```markdown
# Заголовок 1
## Заголовок 2
### Заголовок 3
```

### Автоматические исправления
```powershell
# Запуск с автоматическим исправлением
.\docs\lint-docs.ps1 -Fix

# Проверка после исправления
.\docs\lint-docs.ps1
```

## 📚 Настройка для новых проектов

### 1. Копирование файлов
```bash
# Скопировать скрипты
cp -r scripts/ your-project/
cp docs/lint-docs.ps1 your-project/docs/

# Скопировать конфигурацию
cp .pre-commit-config.yaml your-project/
cp -r .github/ your-project/
```

### 2. Адаптация конфигурации
```yaml
# .pre-commit-config.yaml - изменить пути
- id: dubai-docs-lint
  entry: powershell -ExecutionPolicy Bypass -File docs/lint-docs.ps1
```

### 3. Настройка структуры
```bash
# Создать требуемые директории
mkdir -p docs scripts env

# Создать базовые файлы
touch docs/README.md
touch docs/CONTRIBUTING.md
touch .env.example
```

## 🔧 Расширение функциональности

### Добавление новых проверок
```powershell
# В lint-docs.ps1 добавить новую функцию
function Test-NewFeature {
    Write-Info "🔍 Новая проверка..."
    # Логика проверки
    return $issues
}

# Вызвать в Main
Test-NewFeature
```

### Создание новых hooks
```yaml
# В .pre-commit-config.yaml
- repo: local
  hooks:
    - id: custom-check
      name: Custom Check
      entry: your-script
      language: system
      types: [markdown]
```

### Интеграция с внешними инструментами
```yaml
# Добавить внешние репозитории
- repo: https://github.com/example/tool
  rev: v1.0.0
  hooks:
    - id: external-tool
```

## 📈 Мониторинг и отчетность

### Локальные отчеты
```powershell
# Генерация отчета
.\docs\lint-docs.ps1 -Verbose > lint-report.txt

# Анализ результатов
Get-Content lint-report.txt | Select-String "Warning|Error"
```

### GitHub Actions отчеты
- **Artifacts** содержат результаты проверок
- **Comments** в Pull Request с отчетами
- **Status checks** показывают состояние

### Метрики качества
- Процент файлов без ошибок
- Количество предупреждений
- Время выполнения проверок
- Покрытие документации

## 🚨 Troubleshooting

### Частые проблемы

#### PowerShell Execution Policy
```powershell
# Ошибка: Execution policy error
# Решение: Изменить политику выполнения
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Pre-commit не запускается
```bash
# Проверить установку
pre-commit --version

# Переустановить hooks
pre-commit uninstall
pre-commit install
```

#### GitHub Actions не запускаются
```yaml
# Проверить синтаксис YAML
# Проверить права доступа
# Проверить триггеры on:
```

### Получение помощи
1. **Проверьте логи** - Подробная информация об ошибках
2. **Запустите в verbose режиме** - `-Verbose` флаг
3. **Проверьте документацию** - Этот файл и связанные
4. **Создайте Issue** - В GitHub репозитории

## 📚 Дополнительные ресурсы

### Документация
- [Pre-commit Documentation](https://pre-commit.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [PowerShell Documentation](https://docs.microsoft.com/en-us/powershell/)

### Полезные ссылки
- [Markdown Guide](https://www.markdownguide.org/)
- [YAML Syntax](https://yaml.org/spec/)
- [Git Hooks](https://git-scm.com/docs/githooks)

---

**Статус**: Активный  
**Последнее обновление**: Август 2025  
**Версия**: 2.0.0

> 🚀 **Система линтинга Dubai Project** - автоматизация качества документации!

