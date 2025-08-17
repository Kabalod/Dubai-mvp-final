# Журнал изменений (Changelog)

Все заметные изменения в этом проекте будут задокументированы в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), 
и этот проект придерживается [Семантического Версионирования](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- Удалены временные файлы (`project_structure_full.txt`).
- Удалены локальные базы данных SQLite (`db.sqlite3`) из `apps/pfimport-main` и `apps/realty-main`, так как они не должны находиться в системе контроля версий.
- Удалены устаревшие управляющие скрипты (`project-manager.ps1`, `project-manager.sh`, `reorganize-project.ps1`, `reorganize-project.sh`) из папки `scripts/` в пользу `Taskfile.yml` и `meta-manager.ps1`.

### Changed
- Упрощена структура управления проектом. Теперь для выполнения всех основных команд используется `Taskfile.yml`.
