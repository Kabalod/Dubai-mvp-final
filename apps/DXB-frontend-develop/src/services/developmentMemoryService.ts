import { memoryService, MemoryItem } from './memoryService';
import { MEMORY_API_URL } from '@/config';

// Интерфейсы для технической документации
export interface FileDocumentation {
    path: string;
    type: 'component' | 'page' | 'service' | 'utility' | 'config' | 'style' | 'test';
    name: string;
    description: string;
    dependencies: string[];
    exports: string[];
    props?: Record<string, any>;
    methods?: string[];
    usage?: string;
    technicalDetails: string;
    lastModified: string;
}

export interface ComponentDocumentation extends FileDocumentation {
    type: 'component';
    props: Record<string, {
        type: string;
        required: boolean;
        description: string;
        defaultValue?: any;
    }>;
    methods: string[];
    events: string[];
    styling: string[];
}

export interface ServiceDocumentation extends FileDocumentation {
    type: 'service';
    methods: string[];
    apiEndpoints?: string[];
    dataModels: string[];
    errorHandling: string[];
}

// Сервис для загрузки документации в Memory LLM
class DevelopmentMemoryService {
    /**
     * Загрузить документацию компонента в память
     */
    async addComponentDocumentation(doc: ComponentDocumentation): Promise<void> {
        const memories: MemoryItem[] = [
            {
                text: `Component: ${doc.name} - ${doc.description}. Path: ${doc.path}. Type: React component with ${Object.keys(doc.props).length} props and ${doc.methods.length} methods.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Component ${doc.name} props: ${Object.entries(doc.props).map(([name, prop]) => `${name}(${prop.type}${prop.required ? ', required' : ''})`).join(', ')}.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Component ${doc.name} methods: ${doc.methods.join(', ')}. Events: ${doc.events.join(', ')}. Styling: ${doc.styling.join(', ')}.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Component ${doc.name} technical details: ${doc.technicalDetails}. Dependencies: ${doc.dependencies.join(', ')}. Exports: ${doc.exports.join(', ')}.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of memories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added component memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add component memory:`, error);
            }
        }
    }

    /**
     * Загрузить документацию сервиса в память
     */
    async addServiceDocumentation(doc: ServiceDocumentation): Promise<void> {
        const memories: MemoryItem[] = [
            {
                text: `Service: ${doc.name} - ${doc.description}. Path: ${doc.path}. Type: ${doc.type} with ${doc.methods.length} methods.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Service ${doc.name} methods: ${doc.methods.join(', ')}. API endpoints: ${doc.apiEndpoints?.join(', ') || 'none'}.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Service ${doc.name} data models: ${doc.dataModels.join(', ')}. Error handling: ${doc.errorHandling.join(', ')}.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Service ${doc.name} technical details: ${doc.technicalDetails}. Dependencies: ${doc.dependencies.join(', ')}.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of memories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added service memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add service memory:`, error);
            }
        }
    }

    /**
     * Загрузить общую документацию файла в память
     */
    async addFileDocumentation(doc: FileDocumentation): Promise<void> {
        const memory: MemoryItem = {
            text: `File: ${doc.name} - ${doc.description}. Path: ${doc.path}. Type: ${doc.type}. Dependencies: ${doc.dependencies.join(', ')}. Exports: ${doc.exports.join(', ')}. Technical details: ${doc.technicalDetails}. Last modified: ${doc.lastModified}.`,
            type: 'system',
            age: 'permanent',
        };

        try {
            await memoryService.addMemory(memory);
            console.log(`Added file memory: ${memory.text.slice(0, 100)}...`);
        } catch (error) {
            console.error(`Failed to add file memory:`, error);
        }
    }

    /**
     * Загрузить архитектурную информацию в память
     */
    async addArchitectureMemory(): Promise<void> {
        const architectureMemories: MemoryItem[] = [
            {
                text: `Project Architecture: Dubai Real Estate Platform. Frontend: React 18 + TypeScript + Ant Design Pro. Backend: Django + PostgreSQL. Memory LLM: Java Spring Boot + pgvector. State Management: React Query + Context API. Styling: Ant Design + CSS modules.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Project Structure: src/components/ (UI components), src/pages/ (route pages), src/services/ (API services), src/utils/ (utility functions), src/types/ (TypeScript interfaces), src/styles/ (global styles).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Key Technologies: Vite (build tool), Lingui (internationalization), React Router (navigation), Axios (HTTP client), Ant Design Pro (UI components), Charts (data visualization).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Development Tools: Cursor AI (code editor), Ant Design Pro components (ready-made layouts), Memory LLM (knowledge base), Docker (containerization), ESLint + Prettier (code quality).`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of architectureMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added architecture memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add architecture memory:`, error);
            }
        }
    }

    /**
     * Загрузить информацию о компонентах Ant Design Pro в память
     */
    async addAntDesignProMemory(): Promise<void> {
        const antdMemories: MemoryItem[] = [
            {
                text: `Ant Design Pro Components: ProLayout (layout wrapper), ProCard (enhanced cards), ProTable (data tables), ProForm (advanced forms), ProDescriptions (data display), ProList (list views).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `ProLayout Usage: Provides consistent layout with navigation, breadcrumbs, and content area. Supports menu configuration, header customization, and responsive design.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `ProTable Features: Built-in search, pagination, sorting, filtering, row selection, bulk actions, toolbar customization, and export functionality.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `ProForm Capabilities: Multi-step forms, dynamic fields, validation rules, field dependencies, conditional rendering, and form state management.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of antdMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added Ant Design Pro memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add Ant Design Pro memory:`, error);
            }
        }
    }

    /**
     * Загрузить информацию о Memory LLM в память
     */
    async addMemoryLLMDocumentation(): Promise<void> {
        const memoryLLMMemories: MemoryItem[] = [
            {
                text: `Memory LLM System: Java Spring Boot application with PostgreSQL + pgvector. Uses DJL (Deep Java Library) with HuggingFace all-MiniLM-L6-v2 model for generating 384-dimensional vector embeddings.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Memory LLM API Endpoints: /memory/add (POST), /memory/search (GET), /memory/stats (GET), /memory/optimize (POST), /actuator/health (GET). Base URL: ${MEMORY_API_URL}.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Memory LLM Features: Semantic search using HNSW index, automatic memory optimization, configurable memory age (day/week/month/year/permanent), memory type classification (property/analytics/user/agent/system).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Memory LLM Integration: React frontend uses memoryService.ts to communicate with Java backend. Supports async operations, error handling, and automatic retry logic.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of memoryLLMMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added Memory LLM memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add Memory LLM memory:`, error);
            }
        }
    }

    /**
     * Загрузить информацию о роутинге и навигации в память
     */
    async addRoutingMemory(): Promise<void> {
        const routingMemories: MemoryItem[] = [
            {
                text: `Application Routes: / (Dashboard), /analytics (Analytics page), /auth (Auth page), /policy (Policy page), /landing (Landing).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Route Structure: Main layout with ProLayout, nested routes for pages, authentication guards, lazy loading for performance, and breadcrumb navigation.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Navigation Components: Header with language switcher, sidebar navigation, breadcrumbs, and mobile responsive menu. Uses React Router v6 with nested routing.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of routingMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added routing memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add routing memory:`, error);
            }
        }
    }

    /**
     * Загрузить информацию о стилизации и UI в память
     */
    async addStylingMemory(): Promise<void> {
        const stylingMemories: MemoryItem[] = [
            {
                text: `UI Design System: Ant Design v5 with custom theme, responsive grid system (24 columns), consistent spacing (8px base unit), color palette with semantic meanings, typography scale.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Styling Approach: CSS-in-JS with Ant Design theme tokens, CSS modules for component-specific styles, global SCSS variables, responsive breakpoints (xs: 0px, sm: 576px, md: 768px, lg: 992px, xl: 1200px).`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Component Styling: Inline styles for dynamic values, CSS modules for complex layouts, Ant Design theme customization, consistent border radius (6px, 8px, 12px), shadow system.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of stylingMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added styling memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add styling memory:`, error);
            }
        }
    }

    /**
     * Загрузить информацию о состоянии и управлении данными в память
     */
    async addStateManagementMemory(): Promise<void> {
        const stateMemories: MemoryItem[] = [
            {
                text: `State Management: React hooks (useState, useEffect, useContext), React Query for server state, Context API for global state, local component state for UI interactions.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Data Fetching: React Query for API calls, automatic caching, background updates, error handling, loading states, optimistic updates, and request deduplication.`,
                type: 'system',
                age: 'permanent',
            },
            {
                text: `Form Management: Ant Design Form components, react-hook-form integration, yup validation schemas, form state persistence, dynamic form fields, and custom validation rules.`,
                type: 'system',
                age: 'permanent',
            }
        ];

        for (const memory of stateMemories) {
            try {
                await memoryService.addMemory(memory);
                console.log(`Added state management memory: ${memory.text.slice(0, 100)}...`);
            } catch (error) {
                console.error(`Failed to add state management memory:`, error);
            }
        }
    }

    /**
     * Загрузить всю техническую документацию в память
     */
    async loadAllTechnicalDocumentation(): Promise<void> {
        console.log('🚀 Starting to load technical documentation into Memory LLM...');

        try {
            // Загружаем архитектурную информацию
            await this.addArchitectureMemory();
            console.log('✅ Architecture memory loaded');

            // Загружаем информацию о Ant Design Pro
            await this.addAntDesignProMemory();
            console.log('✅ Ant Design Pro memory loaded');

            // Загружаем документацию Memory LLM
            await this.addMemoryLLMDocumentation();
            console.log('✅ Memory LLM documentation loaded');

            // Загружаем информацию о роутинге
            await this.addRoutingMemory();
            console.log('✅ Routing memory loaded');

            // Загружаем информацию о стилизации
            await this.addStylingMemory();
            console.log('✅ Styling memory loaded');

            // Загружаем информацию о управлении состоянием
            await this.addStateManagementMemory();
            console.log('✅ State management memory loaded');

            console.log('🎉 All technical documentation loaded successfully!');
        } catch (error) {
            console.error('❌ Failed to load technical documentation:', error);
            throw error;
        }
    }

    /**
     * Поиск технической информации по запросу
     */
    async searchTechnicalInfo(query: string): Promise<MemoryItem[]> {
        try {
            const response = await memoryService.searchMemories(query, 10);
            return response.memories;
        } catch (error) {
            console.error('Failed to search technical info:', error);
            return [];
        }
    }

    /**
     * Получить статистику технической документации
     */
    async getTechnicalDocumentationStats(): Promise<{ total: number; byType: Record<string, number> }> {
        try {
            const stats = await memoryService.getMemoryStats();
            return {
                total: stats.totalMemories,
                byType: stats.byType
            };
        } catch (error) {
            console.error('Failed to get technical documentation stats:', error);
            return { total: 0, byType: {} };
        }
    }
}

// Создаем и экспортируем экземпляр сервиса
export const developmentMemoryService = new DevelopmentMemoryService();

// Хуки для React компонентов
export const useDevelopmentMemoryService = () => {
    return {
        loadAllTechnicalDocumentation: developmentMemoryService.loadAllTechnicalDocumentation.bind(developmentMemoryService),
        addComponentDocumentation: developmentMemoryService.addComponentDocumentation.bind(developmentMemoryService),
        addServiceDocumentation: developmentMemoryService.addServiceDocumentation.bind(developmentMemoryService),
        addFileDocumentation: developmentMemoryService.addFileDocumentation.bind(developmentMemoryService),
        searchTechnicalInfo: developmentMemoryService.searchTechnicalInfo.bind(developmentMemoryService),
        getTechnicalDocumentationStats: developmentMemoryService.getTechnicalDocumentationStats.bind(developmentMemoryService),
    };
};

export default developmentMemoryService;
