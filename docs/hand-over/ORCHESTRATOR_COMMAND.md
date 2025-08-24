# 🎯 Команда для Агента-Оркестратора

## 📋 КРИТИЧНАЯ ЗАДАЧА

Необходимо немедленно диагностировать и восстановить работоспособность Dubai MVP в production на Railway.

### 🚨 ТЕКУЩАЯ СИТУАЦИЯ
- Проект развернут на Railway: `workerproject-production.up.railway.app`
- Все изменения в ветке `prod` и отправлены на Railway
- Обнаружена ошибка в PowerShell скрипте `quick-check.ps1`
- Статус health check endpoints неизвестен

### 🎯 КОМАНДА ДЛЯ ОРКЕСТРАТОРА

```
ПРИОРИТЕТ: КРИТИЧНЫЙ
ЗАДАЧА: Восстановление production Dubai MVP

ПОШАГОВЫЙ ПЛАН:

1. ДИАГНОСТИКА [5 мин]
   - Проверить https://workerproject-production.up.railway.app/api/health/
   - Если 502/504 - проверить Railway logs
   - Зафиксировать все неработающие endpoints

2. ИСПРАВЛЕНИЕ СКРИПТА [10 мин] 
   - Файл: quick-check.ps1 строка 47
   - Проблема: UTF-8 encoding + syntax error
   - Исправить и закоммитить

3. ФУНКЦИОНАЛЬНОЕ ТЕСТИРОВАНИЕ [15 мин]
   - Аутентификация: /api/auth/register, /api/auth/login  
   - Профиль: /api/profile/me
   - Mock Payment: /payment UI
   - Логирование: проверить JSON logs

4. DEPLOYMENT ПРОВЕРКА [10 мин]
   - Убедиться что GitHub Actions работают
   - Проверить что изменения попадают на Railway
   - НЕ использовать локальные сборки

5. ОТЧЕТ [5 мин]
   - Статус всех компонентов
   - Список исправленных проблем
   - Рекомендации для следующих шагов

ОГРАНИЧЕНИЯ:
- Только Railway + CI/CD deployment
- Никаких локальных сборок
- Использовать git push в prod для deployment

РЕСУРСЫ:
- docs/hand-over/AGENT_HANDOVER_PLAN.md - полная инструкция
- Все необходимые компоненты уже реализованы
- UserReportHistory, Profile, Payment, Logging - готовы к тестированию

ОЖИДАЕМЫЙ РЕЗУЛЬТАТ:
✅ Работающий health check
✅ Функционирующая аутентификация  
✅ Рабочий UI (профиль + оплата)
✅ Активное логирование
✅ Исправленные скрипты

ВРЕМЯ: 45 минут максимум
```

### 🔧 ТЕХНИЧЕСКАЯ СПРАВКА

**Стек**: Django + React + Railway + PostgreSQL
**Ветка**: prod (актуальная)  
**Endpoint**: https://workerproject-production.up.railway.app
**Документация**: docs/hand-over/AGENT_HANDOVER_PLAN.md

**Критичные файлы**:
- apps/realty-main/realty/settings.py
- apps/realty-main/realty/api/models.py  
- quick-check.ps1 (требует исправления)
- apps/DXB-frontend-develop/src/pages/Profile.tsx
- apps/DXB-frontend-develop/src/pages/Payment.tsx

---
**Срочность**: МАКСИМАЛЬНАЯ  
**Статус**: Готово к выполнению  
**Контекст**: Полностью подготовлен
