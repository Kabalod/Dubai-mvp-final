import axios from 'axios';

// Интерфейсы для работы с Memory LLM
export interface MemoryItem {
    id?: string;
    text: string;
    type: 'agent' | 'user' | 'system' | 'property' | 'analytics';
    age: 'day' | 'week' | 'month' | 'year' | 'permanent';
    timestamp?: string;
    embedding?: number[];
    similarity?: number;
}

export interface SearchResponse {
    memories: MemoryItem[];
    total: number;
    query: string;
    searchTime: number;
}

export interface AddMemoryResponse {
    id: string;
    text: string;
    type: string;
    age: string;
    timestamp: string;
    success: boolean;
}

export interface MemoryStats {
    totalMemories: number;
    byType: Record<string, number>;
    byAge: Record<string, number>;
    lastOptimization: string;
}

// Конфигурация API
const MEMORY_API_BASE = 'http://localhost:8080';
const MEMORY_API_TIMEOUT = 30000; // 30 секунд для генерации эмбеддингов

// Создаем axios инстанс с настройками
const memoryApi = axios.create({
    baseURL: MEMORY_API_BASE,
    timeout: MEMORY_API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Сервис для работы с Memory LLM
class MemoryService {
    /**
     * Добавить новое воспоминание в память
     */
    async addMemory(memory: MemoryItem): Promise<AddMemoryResponse> {
        try {
            const response = await memoryApi.post('/memory/add', memory);
            console.log('Memory added successfully:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error adding memory:', error);
            throw new Error('Failed to add memory to LLM system');
        }
    }

    /**
     * Поиск похожих воспоминаний
     */
    async searchMemories(query: string, topK: number = 10): Promise<SearchResponse> {
        try {
            const response = await memoryApi.get(`/memory/search?query=${encodeURIComponent(query)}&topK=${topK}`);
            console.log('Memory search completed:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error searching memories:', error);
            throw new Error('Failed to search memories in LLM system');
        }
    }

    /**
     * Получить статистику памяти
     */
    async getMemoryStats(): Promise<MemoryStats> {
        try {
            const response = await memoryApi.get('/memory/stats');
            return response.data;
        } catch (error) {
            console.error('Error getting memory stats:', error);
            throw new Error('Failed to get memory statistics');
        }
    }

    /**
     * Оптимизировать память (запустить процесс очистки)
     */
    async optimizeMemory(): Promise<{ success: boolean; message: string }> {
        try {
            const response = await memoryApi.post('/memory/optimize');
            return response.data;
        } catch (error) {
            console.error('Error optimizing memory:', error);
            throw new Error('Failed to optimize memory');
        }
    }

    /**
     * Получить здоровье сервиса
     */
    async getHealth(): Promise<{ status: string; details: any }> {
        try {
            const response = await memoryApi.get('/actuator/health');
            return response.data;
        } catch (error) {
            console.error('Error checking memory service health:', error);
            throw new Error('Memory service is not available');
        }
    }

    /**
     * Добавить воспоминание о недвижимости
     */
    async addPropertyMemory(propertyData: {
        title: string;
        location: string;
        price: number;
        type: string;
        description?: string;
    }): Promise<AddMemoryResponse> {
        const memory: MemoryItem = {
            text: `Property: ${propertyData.title} in ${propertyData.location}. Type: ${propertyData.type}, Price: ${propertyData.price} AED. ${propertyData.description || ''}`,
            type: 'property',
            age: 'month',
        };
        return this.addMemory(memory);
    }

    /**
     * Добавить воспоминание об аналитике
     */
    async addAnalyticsMemory(analyticsData: {
        metric: string;
        value: number;
        period: string;
        insights: string;
    }): Promise<AddMemoryResponse> {
        const memory: MemoryItem = {
            text: `Analytics: ${analyticsData.metric} = ${analyticsData.value} for ${analyticsData.period}. Insights: ${analyticsData.insights}`,
            type: 'analytics',
            age: 'week',
        };
        return this.addMemory(memory);
    }

    /**
     * Добавить воспоминание о пользователе
     */
    async addUserMemory(userData: {
        action: string;
        details: string;
        context: string;
    }): Promise<AddMemoryResponse> {
        const memory: MemoryItem = {
            text: `User action: ${userData.action}. Details: ${userData.details}. Context: ${userData.context}`,
            type: 'user',
            age: 'month',
        };
        return this.addMemory(memory);
    }

    /**
     * Поиск контекста для недвижимости
     */
    async searchPropertyContext(query: string): Promise<SearchResponse> {
        const enhancedQuery = `property real estate ${query}`;
        return this.searchMemories(enhancedQuery, 5);
    }

    /**
     * Поиск контекста для аналитики
     */
    async searchAnalyticsContext(query: string): Promise<SearchResponse> {
        const enhancedQuery = `analytics market trends ${query}`;
        return this.searchMemories(enhancedQuery, 5);
    }

    /**
     * Получить рекомендации на основе памяти
     */
    async getRecommendations(context: string): Promise<SearchResponse> {
        const query = `recommendations suggestions ${context}`;
        return this.searchMemories(query, 3);
    }
}

// Создаем и экспортируем экземпляр сервиса
export const memoryService = new MemoryService();

// Хуки для React компонентов
export const useMemoryService = () => {
    return {
        addMemory: memoryService.addMemory.bind(memoryService),
        searchMemories: memoryService.searchMemories.bind(memoryService),
        getMemoryStats: memoryService.getMemoryStats.bind(memoryService),
        optimizeMemory: memoryService.optimizeMemory.bind(memoryService),
        getHealth: memoryService.getHealth.bind(memoryService),
        addPropertyMemory: memoryService.addPropertyMemory.bind(memoryService),
        addAnalyticsMemory: memoryService.addAnalyticsMemory.bind(memoryService),
        addUserMemory: memoryService.addUserMemory.bind(memoryService),
        searchPropertyContext: memoryService.searchPropertyContext.bind(memoryService),
        searchAnalyticsContext: memoryService.searchAnalyticsContext.bind(memoryService),
        getRecommendations: memoryService.getRecommendations.bind(memoryService),
    };
};

export default memoryService;
