# 🤖 AI Ассистент по Недвижимости Dubai

## Обзор

AI Ассистент - это интеллектуальный помощник, использующий **Java Memory LLM** для предоставления персонализированных ответов о недвижимости Dubai на основе накопленных знаний.

## 🧠 Как это работает

### 1. **Анализ запроса**
- AI анализирует ваш вопрос и определяет тип запроса
- Классифицирует по категориям: недвижимость, аналитика, рынок, рекомендации

### 2. **Поиск знаний**
- Система ищет релевантную информацию в базе знаний Memory LLM
- Использует векторные эмбеддинги для семантического поиска
- Находит наиболее похожие воспоминания

### 3. **Генерация ответа**
- AI формирует персонализированный ответ на основе найденных данных
- Показывает уровень уверенности в ответе
- Автоматически добавляет важные взаимодействия в базу знаний

## 🚀 Возможности

### **Типы запросов**
- 🏠 **Недвижимость**: Анализ свойств, районов, цен
- 📊 **Аналитика**: Рыночные тренды, статистика, метрики
- 💰 **Рынок**: Цены, инвестиции, ROI
- 💡 **Рекомендации**: Персональные советы и стратегии

### **Функции**
- 💬 Интеллектуальный чат
- 🔍 Семантический поиск по базе знаний
- 📚 Автоматическое накопление знаний
- 🎯 Контекстные ответы
- 📈 Уровень уверенности в ответах

## 🛠️ Компоненты

### 1. **AIAssistant** (`/src/components/AIAssistant/AIAssistant.tsx`)
- Полнофункциональный AI ассистент
- Поддержка истории разговоров
- Отображение источников знаний
- Настройки интерфейса

### 2. **DashboardAssistant** (`/src/components/AIAssistant/DashboardAssistant.tsx`)
- Компактная версия для Dashboard
- Сворачиваемый интерфейс
- Быстрые ответы

### 3. **Memory Service** (`/src/services/memoryService.ts`)
- API для работы с Memory LLM
- Методы поиска и добавления воспоминаний
- Специализированные функции для недвижимости

## 📱 Использование

### **Базовые команды**
```
"Какие районы Dubai лучшие для инвестиций?"
"Какие тренды рынка недвижимости Dubai?"
"ROI на недвижимость в Palm Jumeirah?"
"Сравнение вилл и апартаментов"
```

### **Расширенные запросы**
```
"Покажи аналитику цен на недвижимость в Downtown Dubai за последний год"
"Какие факторы влияют на стоимость вилл в Emirates Hills?"
"Рекомендации по инвестициям в недвижимость Dubai для начинающих"
```

## 🔧 Интеграция

### **В Dashboard**
```tsx
import DashboardAssistant from '@/components/AIAssistant/DashboardAssistant';

<DashboardAssistant 
    compact={true}
    onMemoryAdd={(memory) => {
        console.log('New memory added:', memory);
    }}
/>
```

### **На отдельной странице**
```tsx
import AIAssistant from '@/components/AIAssistant/AIAssistant';

<AIAssistant 
    onMemoryAdd={handleMemoryAdd}
    showMemories={true}
    maxHeight={700}
/>
```

## 🗄️ База знаний

### **Типы воспоминаний**
- `property` - информация о недвижимости
- `analytics` - аналитические данные
- `user` - пользовательские взаимодействия
- `agent` - системные знания
- `system` - техническая информация

### **Возраст воспоминаний**
- `day` - за день
- `week` - за неделю
- `month` - за месяц
- `year` - за год
- `permanent` - постоянные

## 🔍 API Endpoints

### **Memory LLM API**
```
GET  /actuator/health          - Проверка здоровья сервиса
POST /memory/add               - Добавление воспоминания
GET  /memory/search?query=...  - Поиск воспоминаний
GET  /memory/stats             - Статистика памяти
POST /memory/optimize          - Оптимизация памяти
```

### **Примеры запросов**
```bash
# Базовый URL настраивается через VITE_MEMORY_API_URL или по умолчанию ${VITE_FRONTEND_API_URL}/memory
MEMORY_API_URL=${VITE_MEMORY_API_URL:-http://localhost:8080}

# Добавить воспоминание
curl -X POST "$MEMORY_API_URL/memory/add" \
  -H "Content-Type: application/json" \
  -d '{"text":"Luxury villa in Palm Jumeirah costs 5M AED","type":"property","age":"month"}'

# Поиск воспоминаний
curl "$MEMORY_API_URL/memory/search?query=Palm Jumeirah&topK=5"

# Статистика
curl "$MEMORY_API_URL/memory/stats"
```

## 🚀 Запуск

### **1. Запуск Memory LLM**
```bash
cd Java_Memory_LLM-master
./start-memory-service.bat  # Windows
# или
./start-memory-service.ps1  # PowerShell
```

### **2. Запуск React приложения**
```bash
cd DXB-frontend-develop
npm run dev
```

### **3. Интегрированный запуск**
```bash
./start-all-with-memory.bat
```

## 📊 Мониторинг

### **Метрики производительности**
- Время ответа AI
- Количество найденных воспоминаний
- Уровень уверенности
- Количество новых знаний

### **Логи**
- Все взаимодействия с AI
- Ошибки и предупреждения
- Статистика использования

## 🔮 Будущие улучшения

### **Планируемые функции**
- 🌐 Многоязычная поддержка
- 🎨 Персонализация интерфейса
- 📱 Мобильная оптимизация
- 🔗 Интеграция с внешними API
- 📊 Расширенная аналитика

### **AI улучшения**
- 🤖 Более сложные алгоритмы генерации ответов
- 🧠 Машинное обучение на основе пользовательских данных
- 📈 Предсказательные модели
- 🎯 Персонализированные рекомендации

## 🐛 Устранение неполадок

### **Частые проблемы**

#### **AI не отвечает**
1. Проверьте статус Memory LLM: `${VITE_MEMORY_API_URL}/actuator/health` (или по умолчанию `http://localhost:8080/actuator/health`)
2. Убедитесь, что Docker контейнеры запущены
3. Проверьте логи в консоли браузера

#### **Медленные ответы**
1. Memory LLM генерирует эмбеддинги (может занять до 30 секунд)
2. Проверьте загрузку CPU и RAM
3. Увеличьте timeout в `memoryService.ts`

#### **Ошибки поиска**
1. Проверьте подключение к PostgreSQL
2. Убедитесь, что база данных содержит данные
3. Проверьте настройки pgvector

### **Логи и отладка**
```typescript
// Включить подробное логирование
console.log('Memory search query:', query);
console.log('Found memories:', memories);
console.log('AI response:', response);
```

## 📚 Дополнительные ресурсы

- [Java Memory LLM Documentation](../Java_Memory_LLM-master/README.md)
- [Ant Design Pro Components](https://procomponents.ant.design/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Dubai Real Estate Market Reports](https://www.dubailand.gov.ae/)

## 🤝 Поддержка

При возникновении проблем:
1. Проверьте логи в консоли браузера
2. Проверьте статус Memory LLM сервиса
3. Обратитесь к документации компонентов
4. Создайте issue в репозитории проекта

---

**AI Ассистент** - ваш интеллектуальный помощник в мире недвижимости Dubai! 🏠✨
