import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { MEMORY_API_URL } from '@/config';

// Интерфейсы для расширенной работы с памятью
export interface MemoryItem {
    id?: string;
    text: string;
    type: 'system' | 'property' | 'analytics' | 'recommendation' | 'user' | 'agent' | 'market' | 'legal';
    age: 'day' | 'week' | 'month' | 'year' | 'permanent';
    category?: string;
    tags?: string[];
    metadata?: Record<string, any>;
    createdAt?: string;
    updatedAt?: string;
    similarity?: number;
    confidence?: number;
}

export interface MemorySearchResponse {
    memories: MemoryItem[];
    totalCount: number;
    searchTime: number;
    query: string;
    filters?: Record<string, any>;
}

export interface MemoryStats {
    totalMemories: number;
    memoriesByType: Record<string, number>;
    memoriesByAge: Record<string, number>;
    memoriesByCategory: Record<string, number>;
    averageSimilarity: number;
    lastUpdated: string;
    systemHealth: 'healthy' | 'degraded' | 'unhealthy';
}

export interface MemoryHealth {
    status: 'UP' | 'DOWN' | 'UNKNOWN';
    details: {
        database: {
            status: 'UP' | 'DOWN';
            details?: string;
        };
        memory: {
            status: 'UP' | 'DOWN';
            details?: string;
        };
        embeddings: {
            status: 'UP' | 'DOWN';
            details?: string;
        };
    };
    timestamp: string;
}

export interface MemoryOptimizationResult {
    optimizedCount: number;
    removedCount: number;
    compressedSize: number;
    originalSize: number;
    optimizationTime: number;
    recommendations: string[];
}

export interface BatchMemoryOperation {
    operation: 'add' | 'update' | 'delete' | 'optimize';
    items?: MemoryItem[];
    filters?: Record<string, any>;
    result: {
        success: boolean;
        processedCount: number;
        errors?: string[];
    };
}

// Конфигурация для разных окружений: базовый URL берется из env
const ENV_CONFIG = {
    development: {
        baseURL: MEMORY_API_URL,
        timeout: 30000,
        retries: 3,
    },
    staging: {
        baseURL: MEMORY_API_URL,
        timeout: 45000,
        retries: 5,
    },
    production: {
        baseURL: MEMORY_API_URL,
        timeout: 60000,
        retries: 7,
    }
};

class ProductionMemoryService {
    private axiosInstance: AxiosInstance;
    private currentEnv: keyof typeof ENV_CONFIG;
    private retryCount: number = 0;
    private isConnected: boolean = false;
    private lastHealthCheck: number = 0;
    private healthCheckInterval: number = 30000; // 30 секунд

    constructor(environment: keyof typeof ENV_CONFIG = 'development') {
        this.currentEnv = environment;
        this.axiosInstance = this.createAxiosInstance();
        this.setupInterceptors();
        this.startHealthMonitoring();
    }

    private createAxiosInstance(): AxiosInstance {
        const config = ENV_CONFIG[this.currentEnv];
        
        return axios.create({
            baseURL: config.baseURL,
            timeout: config.timeout,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'User-Agent': 'Dubai-RealEstate-Frontend/1.0.0',
            },
        });
    }

    private setupInterceptors(): void {
        // Request interceptor для логирования и аутентификации
        this.axiosInstance.interceptors.request.use(
            (config) => {
                // Добавляем timestamp для отслеживания
                config.metadata = { startTime: Date.now() };
                
                // Логируем запросы в продакшене
                if (this.currentEnv === 'production') {
                    console.log(`[Memory API] ${config.method?.toUpperCase()} ${config.url}`, {
                        timestamp: new Date().toISOString(),
                        environment: this.currentEnv,
                    });
                }
                
                return config;
            },
            (error) => {
                console.error('[Memory API] Request error:', error);
                return Promise.reject(error);
            }
        );

        // Response interceptor для обработки ошибок и retry логики
        this.axiosInstance.interceptors.response.use(
            (response) => {
                // Логируем успешные ответы
                const duration = Date.now() - (response.config.metadata?.startTime || 0);
                if (this.currentEnv === 'production') {
                    console.log(`[Memory API] ${response.status} ${response.config.url} (${duration}ms)`);
                }
                
                this.retryCount = 0;
                this.isConnected = true;
                return response;
            },
            async (error) => {
                const config = error.config;
                const shouldRetry = this.shouldRetryRequest(error, config);
                
                if (shouldRetry && this.retryCount < ENV_CONFIG[this.currentEnv].retries) {
                    this.retryCount++;
                    console.warn(`[Memory API] Retrying request (${this.retryCount}/${ENV_CONFIG[this.currentEnv].retries})`);
                    
                    // Экспоненциальная задержка
                    const delay = Math.pow(2, this.retryCount) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    
                    return this.axiosInstance.request(config);
                }
                
                this.isConnected = false;
                console.error('[Memory API] Request failed:', {
                    url: config?.url,
                    method: config?.method,
                    status: error.response?.status,
                    message: error.message,
                    retryCount: this.retryCount,
                });
                
                return Promise.reject(error);
            }
        );
    }

    private shouldRetryRequest(error: any, config: any): boolean {
        // Retry для сетевых ошибок и 5xx статусов
        return (
            !error.response ||
            (error.response.status >= 500 && error.response.status < 600) ||
            error.code === 'ECONNABORTED' ||
            error.code === 'NETWORK_ERROR'
        );
    }

    private startHealthMonitoring(): void {
        setInterval(() => {
            this.checkHealthSilent();
        }, this.healthCheckInterval);
    }

    // Основные методы API

    /**
     * Проверка здоровья Memory LLM сервиса
     */
    async getHealth(): Promise<MemoryHealth> {
        try {
            const response: AxiosResponse<MemoryHealth> = await this.axiosInstance.get('/actuator/health');
            this.lastHealthCheck = Date.now();
            this.isConnected = true;
            return response.data;
        } catch (error) {
            this.isConnected = false;
            throw new Error(`Memory LLM сервис недоступен: ${error}`);
        }
    }

    /**
     * Тихая проверка здоровья (без ошибок)
     */
    private async checkHealthSilent(): Promise<void> {
        try {
            await this.getHealth();
        } catch (error) {
            // Тихо логируем ошибки здоровья
            if (this.currentEnv === 'production') {
                console.warn('[Memory API] Health check failed:', error);
            }
        }
    }

    /**
     * Добавление нового воспоминания
     */
    async addMemory(memory: MemoryItem): Promise<MemoryItem> {
        try {
            const response: AxiosResponse<MemoryItem> = await this.axiosInstance.post('/memory/add', memory);
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка добавления воспоминания: ${error}`);
        }
    }

    /**
     * Пакетное добавление воспоминаний
     */
    async addMemoriesBatch(memories: MemoryItem[]): Promise<BatchMemoryOperation> {
        try {
            const response: AxiosResponse<BatchMemoryOperation> = await this.axiosInstance.post('/memory/batch/add', {
                items: memories
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка пакетного добавления: ${error}`);
        }
    }

    /**
     * Поиск воспоминаний по тексту
     */
    async searchMemories(
        query: string, 
        topK: number = 10, 
        filters?: Record<string, any>
    ): Promise<MemorySearchResponse> {
        try {
            const params = new URLSearchParams({
                query,
                topK: topK.toString(),
                ...(filters && { filters: JSON.stringify(filters) })
            });

            const response: AxiosResponse<MemorySearchResponse> = await this.axiosInstance.get(
                `/memory/search?${params.toString()}`
            );
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка поиска воспоминаний: ${error}`);
        }
    }

    /**
     * Поиск по категории
     */
    async searchByCategory(
        category: string, 
        topK: number = 20
    ): Promise<MemorySearchResponse> {
        return this.searchMemories('', topK, { category });
    }

    /**
     * Поиск по типу
     */
    async searchByType(
        type: MemoryItem['type'], 
        topK: number = 20
    ): Promise<MemorySearchResponse> {
        return this.searchMemories('', topK, { type });
    }

    /**
     * Поиск по тегам
     */
    async searchByTags(
        tags: string[], 
        topK: number = 20
    ): Promise<MemorySearchResponse> {
        return this.searchMemories('', topK, { tags });
    }

    /**
     * Получение статистики памяти
     */
    async getMemoryStats(): Promise<MemoryStats> {
        try {
            const response: AxiosResponse<MemoryStats> = await this.axiosInstance.get('/memory/stats');
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка получения статистики: ${error}`);
        }
    }

    /**
     * Обновление воспоминания
     */
    async updateMemory(id: string, updates: Partial<MemoryItem>): Promise<MemoryItem> {
        try {
            const response: AxiosResponse<MemoryItem> = await this.axiosInstance.put(`/memory/${id}`, updates);
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка обновления воспоминания: ${error}`);
        }
    }

    /**
     * Удаление воспоминания
     */
    async deleteMemory(id: string): Promise<boolean> {
        try {
            await this.axiosInstance.delete(`/memory/${id}`);
            return true;
        } catch (error) {
            throw new Error(`Ошибка удаления воспоминания: ${error}`);
        }
    }

    /**
     * Оптимизация памяти
     */
    async optimizeMemory(): Promise<MemoryOptimizationResult> {
        try {
            const response: AxiosResponse<MemoryOptimizationResult> = await this.axiosInstance.post('/memory/optimize');
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка оптимизации памяти: ${error}`);
        }
    }

    /**
     * Очистка старых воспоминаний
     */
    async cleanupOldMemories(age: MemoryItem['age']): Promise<number> {
        try {
            const response: AxiosResponse<{ deletedCount: number }> = await this.axiosInstance.post('/memory/cleanup', { age });
            return response.data.deletedCount;
        } catch (error) {
            throw new Error(`Ошибка очистки памяти: ${error}`);
        }
    }

    /**
     * Экспорт памяти в различных форматах
     */
    async exportMemory(format: 'json' | 'csv' | 'txt' = 'json'): Promise<string | Blob> {
        try {
            const response = await this.axiosInstance.get(`/memory/export?format=${format}`, {
                responseType: format === 'json' ? 'json' : 'blob'
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка экспорта памяти: ${error}`);
        }
    }

    /**
     * Импорт памяти из файла
     */
    async importMemory(file: File, format: 'json' | 'csv' | 'txt' = 'json'): Promise<BatchMemoryOperation> {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('format', format);

            const response: AxiosResponse<BatchMemoryOperation> = await this.axiosInstance.post('/memory/import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка импорта памяти: ${error}`);
        }
    }

    /**
     * Получение рекомендаций на основе памяти
     */
    async getRecommendations(
        context: string, 
        type: 'property' | 'investment' | 'market' | 'legal' = 'property',
        limit: number = 5
    ): Promise<MemoryItem[]> {
        try {
            const response: AxiosResponse<MemoryItem[]> = await this.axiosInstance.post('/memory/recommendations', {
                context,
                type,
                limit
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка получения рекомендаций: ${error}`);
        }
    }

    /**
     * Анализ трендов на основе памяти
     */
    async analyzeTrends(
        category: string, 
        timeRange: 'week' | 'month' | 'quarter' | 'year' = 'month'
    ): Promise<{
        trends: Array<{ date: string; count: number; sentiment: number }>;
        insights: string[];
        recommendations: string[];
    }> {
        try {
            const response = await this.axiosInstance.post('/memory/analyze/trends', {
                category,
                timeRange
            });
            return response.data;
        } catch (error) {
            throw new Error(`Ошибка анализа трендов: ${error}`);
        }
    }

    // Утилиты и вспомогательные методы

    /**
     * Проверка подключения к сервису
     */
    isServiceConnected(): boolean {
        return this.isConnected;
    }

    /**
     * Получение времени последней проверки здоровья
     */
    getLastHealthCheck(): number {
        return this.lastHealthCheck;
    }

    /**
     * Изменение окружения
     */
    setEnvironment(environment: keyof typeof ENV_CONFIG): void {
        this.currentEnv = environment;
        this.axiosInstance = this.createAxiosInstance();
        this.setupInterceptors();
        console.log(`[Memory API] Environment changed to: ${environment}`);
    }

    /**
     * Получение текущего окружения
     */
    getCurrentEnvironment(): keyof typeof ENV_CONFIG {
        return this.currentEnv;
    }

    /**
     * Получение конфигурации текущего окружения
     */
    getCurrentConfig() {
        return ENV_CONFIG[this.currentEnv];
    }

    /**
     * Тест производительности API
     */
    async performanceTest(iterations: number = 10): Promise<{
        averageResponseTime: number;
        minResponseTime: number;
        maxResponseTime: number;
        successRate: number;
        errors: string[];
    }> {
        const results: number[] = [];
        const errors: string[] = [];
        let successCount = 0;

        for (let i = 0; i < iterations; i++) {
            try {
                const startTime = Date.now();
                await this.getHealth();
                const responseTime = Date.now() - startTime;
                results.push(responseTime);
                successCount++;
            } catch (error) {
                errors.push(`Iteration ${i + 1}: ${error}`);
            }
        }

        const successRate = (successCount / iterations) * 100;
        const averageResponseTime = results.reduce((a, b) => a + b, 0) / results.length;
        const minResponseTime = Math.min(...results);
        const maxResponseTime = Math.max(...results);

        return {
            averageResponseTime,
            minResponseTime,
            maxResponseTime,
            successRate,
            errors
        };
    }
}

// Создаем и экспортируем экземпляр сервиса
export const productionMemoryService = new ProductionMemoryService();

// Экспортируем класс для создания дополнительных экземпляров
export { ProductionMemoryService };

// Экспортируем типы
export type {
    MemoryItem,
    MemorySearchResponse,
    MemoryStats,
    MemoryHealth,
    MemoryOptimizationResult,
    BatchMemoryOperation
};
