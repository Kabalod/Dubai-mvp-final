# ⚡ Быстрый чек-лист исправлений

## 🔥 Сделать ПРЯМО СЕЙЧАС (5 минут)

### Шаг 1: Исправить двойной /api/ в URL запросах
```
1. Открыть Railway Dashboard
2. Перейти к сервису "frontend"
3. Нажать на вкладку "Variables"
4. Добавить/изменить переменную:
   Имя: VITE_FRONTEND_API_URL
   Значение: https://workerproject-production.up.railway.app
   (БЕЗ /api в конце!)
5. Нажать "Save" (начнется автодеплой)
```

### Шаг 2: Настроить SendGrid (если есть аккаунт)
```
1. В Railway Dashboard перейти к сервису "Workerproject"
2. Нажать на вкладку "Variables"
3. Добавить две переменные:
   
   SENDGRID_API_KEY = SG.xxxxxxxxxxxxxx (ваш ключ)
   DEFAULT_FROM_EMAIL = noreply@yourdomain.com
   
4. Нажать "Save"
```

## ✅ Как проверить что всё работает

1. Подождать 2-3 минуты пока завершится деплой
2. Открыть https://frontend-production-5c48.up.railway.app/auth
3. Ввести тестовый номер: +971501234567
4. Нажать "Send OTP"
5. В Railway открыть HTTP Logs для frontend

**Успех если видите:**
- ✅ `POST /api/auth/send-otp/` (БЕЗ двойного /api/)
- ✅ Статус 200 или 201

**Если видите 401:**
- Нужно правильно настроить SendGrid (см. Шаг 2)

**Если видите 405:**
- Проблема с URL, проверьте VITE_FRONTEND_API_URL

## 🆘 Если не работает

Выполните в терминале:
```bash
# Проверить статус сервисов
npx @railway/cli@latest status --json

# Посмотреть логи backend
npx @railway/cli@latest logs --service=Workerproject --tail 50

# Посмотреть логи frontend
npx @railway/cli@latest logs --service=frontend --tail 50
```

И отправьте вывод для анализа.

---
⏱️ Время выполнения: 5-10 минут
