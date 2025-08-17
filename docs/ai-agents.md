# AI агенты

## Обзор

Подробное описание AI агентов и их интеграции в проект Dubai.

## Архитектура AI системы

### Компоненты AI
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AI Gateway   │    │  Memory LLM     │    │   AI Agents     │
│   (FastAPI)    │    │   Service       │    │   (Python)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   PostgreSQL    │
                    │   + pgvector    │
                    └─────────────────┘
```

### Основные агенты
- **Market Analyst Agent** - Анализ рынка недвижимости
- **Property Recommender Agent** - Рекомендации по объектам
- **Price Prediction Agent** - Прогнозирование цен
- **Customer Support Agent** - Поддержка клиентов
- **Data Processing Agent** - Обработка и анализ данных

## Memory LLM Service

### Описание
Сервис для хранения и поиска контекстной информации с использованием векторных эмбеддингов.

### Технологии
- **Java Spring Boot** - Основной фреймворк
- **PostgreSQL + pgvector** - Векторная база данных
- **Redis** - Кэширование и сессии
- **OpenAI API** - Генерация эмбеддингов

### API endpoints
```http
POST /api/memory/store          # Сохранение информации
GET  /api/memory/search         # Поиск по смыслу
GET  /api/memory/context        # Получение контекста
DELETE /api/memory/{id}         # Удаление информации
```

## AI агенты

### Market Analyst Agent
```python
from crewai import Agent, Task, Crew
from langchain.tools import Tool

class MarketAnalystAgent:
    def __init__(self):
        self.agent = Agent(
            role='Market Analyst',
            goal='Analyze real estate market trends and provide insights',
            backstory='Expert analyst with 10+ years in Dubai real estate',
            tools=[
                Tool(
                    name='market_data_tool',
                    func=self.get_market_data,
                    description='Get current market data for specific areas'
                ),
                Tool(
                    name='trend_analysis_tool',
                    func=self.analyze_trends,
                    description='Analyze price and volume trends'
                )
            ]
        )
    
    def analyze_market(self, area: str, property_type: str):
        task = Task(
            description=f'Analyze market conditions for {property_type} in {area}',
            agent=self.agent
        )
        
        crew = Crew(
            agents=[self.agent],
            tasks=[task]
        )
        
        result = crew.kickoff()
        return result
```

### Property Recommender Agent
```python
class PropertyRecommenderAgent:
    def __init__(self):
        self.agent = Agent(
            role='Property Recommender',
            goal='Recommend properties based on user preferences and market data',
            backstory='AI specialist in property matching and recommendations',
            tools=[
                Tool(
                    name='user_preferences_tool',
                    func=self.get_user_preferences,
                    description='Get user preferences and requirements'
                ),
                Tool(
                    name='property_search_tool',
                    func=self.search_properties,
                    description='Search for properties matching criteria'
                ),
                Tool(
                    name='similarity_calculator',
                    func=self.calculate_similarity,
                    description='Calculate property similarity scores'
                )
            ]
        )
    
    def recommend_properties(self, user_id: int, budget: float, area: str):
        task = Task(
            description=f'Find properties in {area} within budget {budget} for user {user_id}',
            agent=self.agent
        )
        
        crew = Crew(
            agents=[self.agent],
            tasks=[task]
        )
        
        result = crew.kickoff()
        return result
```

### Price Prediction Agent
```python
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler

class PricePredictionAgent:
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def train_model(self, training_data):
        """Обучение модели на исторических данных"""
        X = training_data[['area_sqft', 'bedrooms', 'bathrooms', 'location_score']]
        y = training_data['price']
        
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        self.is_trained = True
    
    def predict_price(self, property_features):
        """Прогнозирование цены объекта"""
        if not self.is_trained:
            raise ValueError("Model must be trained before making predictions")
        
        X = np.array([[
            property_features['area_sqft'],
            property_features['bedrooms'],
            property_features['bathrooms'],
            property_features['location_score']
        ]])
        
        X_scaled = self.scaler.transform(X)
        prediction = self.model.predict(X_scaled)[0]
        
        return {
            'predicted_price': prediction,
            'confidence': self.calculate_confidence(X_scaled),
            'factors': self.analyze_factors(X_scaled)
        }
    
    def calculate_confidence(self, X_scaled):
        """Расчет уверенности в прогнозе"""
        predictions = []
        for _ in range(10):
            pred = self.model.predict(X_scaled)[0]
            predictions.append(pred)
        
        std = np.std(predictions)
        mean = np.mean(predictions)
        confidence = max(0, 1 - (std / mean))
        
        return confidence
    
    def analyze_factors(self, X_scaled):
        """Анализ важности факторов"""
        feature_importance = self.model.feature_importances_
        features = ['area_sqft', 'bedrooms', 'bathrooms', 'location_score']
        
        factor_analysis = {}
        for feature, importance in zip(features, feature_importance):
            factor_analysis[feature] = importance
        
        return factor_analysis
```

## Интеграция с системой

### API интеграция
```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

class AIQuery(BaseModel):
    query: str
    context: dict = {}
    agent_type: str = "general"

@app.post("/api/ai/query")
async def process_ai_query(ai_query: AIQuery):
    try:
        # Выбор подходящего агента
        agent = select_agent(ai_query.agent_type)
        
        # Обработка запроса
        result = await agent.process(ai_query.query, ai_query.context)
        
        # Сохранение в память
        await store_in_memory(ai_query.query, result)
        
        return {
            "response": result,
            "agent_used": ai_query.agent_type,
            "confidence": result.get("confidence", 0.8)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/ai/agents")
async def list_available_agents():
    return {
        "agents": [
            {
                "name": "market_analyst",
                "description": "Analyzes real estate market trends",
                "capabilities": ["trend_analysis", "market_insights"]
            },
            {
                "name": "property_recommender",
                "description": "Recommends properties based on preferences",
                "capabilities": ["property_matching", "preference_analysis"]
            },
            {
                "name": "price_predictor",
                "description": "Predicts property prices",
                "capabilities": ["price_forecasting", "market_analysis"]
            }
        ]
    }
```

### Интеграция с базой данных
```python
import asyncpg
from typing import List, Dict

class AIDatabaseService:
    def __init__(self, database_url: str):
        self.database_url = database_url
    
    async def store_memory(self, content: str, embedding: List[float], metadata: Dict):
        """Сохранение информации в AI память"""
        async with asyncpg.create_pool(self.database_url) as pool:
            async with pool.acquire() as conn:
                await conn.execute("""
                    INSERT INTO ai_memory (content, embedding, metadata)
                    VALUES ($1, $2, $3)
                """, content, embedding, metadata)
    
    async def search_memory(self, query_embedding: List[float], limit: int = 5):
        """Поиск похожей информации в памяти"""
        async with asyncpg.create_pool(self.database_url) as pool:
            async with pool.acquire() as conn:
                rows = await conn.fetch("""
                    SELECT content, metadata, 
                           1 - (embedding <=> $1) as similarity
                    FROM ai_memory
                    WHERE 1 - (embedding <=> $1) > 0.7
                    ORDER BY embedding <=> $1
                    LIMIT $2
                """, query_embedding, limit)
                
                return [dict(row) for row in rows]
    
    async def get_market_data(self, area: str, property_type: str):
        """Получение рыночных данных"""
        async with asyncpg.create_pool(self.database_url) as pool:
            async with pool.acquire() as conn:
                rows = await conn.fetch("""
                    SELECT date, avg_price, volume, days_on_market
                    FROM market_data
                    WHERE area = $1 AND property_type = $2
                    ORDER BY date DESC
                    LIMIT 30
                """, area, property_type)
                
                return [dict(row) for row in rows]
```

## Мониторинг и метрики

### Метрики производительности
```python
from prometheus_client import Counter, Histogram, Gauge

## Метрики для AI агентов
ai_queries_total = Counter('ai_queries_total', 'Total AI queries', ['agent_type', 'status'])
ai_response_time = Histogram('ai_response_time_seconds', 'AI response time', ['agent_type'])
ai_memory_usage = Gauge('ai_memory_usage_bytes', 'AI memory usage in bytes')
ai_accuracy = Gauge('ai_accuracy_percentage', 'AI prediction accuracy')

## Использование в коде
import time

async def process_with_metrics(agent_type: str, query: str):
    start_time = time.time()
    
    try:
        result = await process_ai_query(query)
        ai_queries_total.labels(agent_type=agent_type, status='success').inc()
        ai_accuracy.set(result.get('accuracy', 0.8))
        return result
    except Exception as e:
        ai_queries_total.labels(agent_type=agent_type, status='error').inc()
        raise
    finally:
        duration = time.time() - start_time
        ai_response_time.labels(agent_type=agent_type).observe(duration)
```

### Логирование
```python
import logging
import json
from datetime import datetime

ai_logger = logging.getLogger('ai_agents')

def log_ai_interaction(agent_type: str, query: str, response: dict, duration: float):
    """Логирование взаимодействий с AI агентами"""
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'agent_type': agent_type,
        'query': query,
        'response_summary': str(response)[:200],
        'duration_seconds': duration,
        'user_id': response.get('user_id'),
        'confidence': response.get('confidence')
    }
    
    ai_logger.info(json.dumps(log_entry))
```

## Конфигурация

### Environment variables
```bash
## AI Service Configuration
AI_SERVICE_HOST=0.0.0.0
AI_SERVICE_PORT=8003
AI_SERVICE_DEBUG=false

## OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000

## Memory Service Configuration
MEMORY_SERVICE_URL=http://localhost:8080
MEMORY_SERVICE_TIMEOUT=30

## Database Configuration
AI_DATABASE_URL=postgresql://user:pass@localhost:5432/dubai_ai
AI_REDIS_URL=redis://localhost:6379

## Monitoring Configuration
PROMETHEUS_ENABLED=true
PROMETHEUS_PORT=9090
```

### Docker Compose
```yaml
version: '3.8'
services:
  ai-service:
    image: dubai/ai-service:latest
    ports:
      - "8003:8003"
    environment:
      - AI_SERVICE_HOST=0.0.0.0
      - AI_SERVICE_PORT=8003
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - MEMORY_SERVICE_URL=http://memory-service:8080
    depends_on:
      - memory-service
      - postgres
      - redis

  memory-service:
    image: dubai/memory-service:latest
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=docker
      - DATABASE_URL=jdbc:postgresql://postgres:5432/dubai_ai
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
```

## Связанные документы

- [Обзор системы](./OVERVIEW.md)
- [Backend сервисы](./backend-services.md)
- [Frontend API](./frontend-api.md)
- [База данных](./database-schema.md)
- [Аутентификация](./authentication.md)

---

**Статус**: Активный  
**Последнее обновление**: Август 2025

