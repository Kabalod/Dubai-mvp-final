import React, { useState } from 'react';
import { Card, Button, Space, Progress, message, Tag, Tooltip, Typography } from 'antd';
import { 
    DatabaseOutlined, 
    UploadOutlined, 
    CheckCircleOutlined,
    InfoCircleOutlined,
    BrainOutlined
} from '@ant-design/icons';
import { memoryService, MemoryItem } from '@/services/memoryService';

const { Text } = Typography;

interface DashboardLoaderProps {
    compact?: boolean;
    onMemoryLoaded?: (count: number) => void;
}

const DashboardLoader: React.FC<DashboardLoaderProps> = ({ 
    compact = true,
    onMemoryLoaded 
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    // Основные данные проекта для быстрой загрузки
    const essentialProjectData: Array<{
        text: string;
        type: MemoryItem['type'];
        age: MemoryItem['age'];
    }> = [
        // Проект и архитектура
        {
            text: 'Dubai Real Estate Platform - современная платформа для управления недвижимостью в Dubai',
            type: 'system',
            age: 'permanent'
        },
        {
            text: 'Технологический стек: React 18, TypeScript, Ant Design Pro, Vite, Django, PostgreSQL',
            type: 'system',
            age: 'permanent'
        },
        {
            text: 'Интеграция с Java Memory LLM для накопления знаний и AI ассистента',
            type: 'system',
            age: 'permanent'
        },
        
        // Ключевые районы Dubai
        {
            text: 'Palm Jumeirah - премиум район с виллами стоимостью от 5M до 50M AED',
            type: 'property',
            age: 'month'
        },
        {
            text: 'Downtown Dubai - центр города с апартаментами от 800K до 8M AED',
            type: 'property',
            age: 'month'
        },
        {
            text: 'Dubai Marina - современный район с небоскребами и апартаментами от 700K до 5M AED',
            type: 'property',
            age: 'month'
        },
        
        // Рыночная аналитика
        {
            text: 'Средние цены на недвижимость в Dubai: виллы 3-15M AED, апартаменты 500K-3M AED',
            type: 'analytics',
            age: 'month'
        },
        {
            text: 'ROI на недвижимость Dubai: 5-8% годовых для аренды, 10-15% для продажи',
            type: 'analytics',
            age: 'month'
        },
        {
            text: 'Тренды рынка: рост цен на 15-20% в год, высокий спрос на премиум сегмент',
            type: 'analytics',
            age: 'month'
        },
        
        // Инвестиционные стратегии
        {
            text: 'Долгосрочные инвестиции: покупка недвижимости на 5-10 лет с ожиданием роста цен',
            type: 'recommendation',
            age: 'month'
        },
        {
            text: 'Арендный бизнес: покупка недвижимости для сдачи в аренду туристам и экспатам',
            type: 'recommendation',
            age: 'month'
        }
    ];

    // Быстрая загрузка основных данных
    const loadEssentialData = async () => {
        if (isLoaded) {
            message.info('Данные уже загружены в память');
            return;
        }

        setIsLoading(true);
        setProgress(0);
        
        const total = essentialProjectData.length;
        let loadedCount = 0;

        try {
            for (const item of essentialProjectData) {
                try {
                    // Создаем объект памяти
                    const memory: MemoryItem = {
                        text: item.text,
                        type: item.type,
                        age: item.age,
                    };

                    // Загружаем в Memory LLM
                    await memoryService.addMemory(memory);
                    
                    // Обновляем прогресс
                    loadedCount++;
                    const currentProgress = Math.round((loadedCount / total) * 100);
                    setProgress(currentProgress);
                    
                    // Небольшая задержка для плавности
                    await new Promise(resolve => setTimeout(resolve, 50));
                    
                } catch (error) {
                    console.error(`Error loading item: ${item.text}`, error);
                }
            }
            
            message.success(`Успешно загружено ${loadedCount} элементов в базу знаний!`);
            setIsLoaded(true);
            onMemoryLoaded?.(loadedCount);
            
        } catch (error) {
            console.error('Error loading essential data:', error);
            message.error('Произошла ошибка при загрузке данных');
        } finally {
            setIsLoading(false);
        }
    };

    // Проверка статуса Memory LLM
    const checkMemoryService = async () => {
        try {
            const health = await memoryService.getHealth();
            message.success(`Memory LLM активен: ${health.status}`);
        } catch (error) {
            message.error('Memory LLM недоступен. Проверьте подключение.');
        }
    };

    if (compact) {
        return (
            <Card
                size="small"
                title={
                    <Space>
                        <BrainOutlined style={{ color: '#1890ff' }} />
                        <span>Project Memory</span>
                    </Space>
                }
                extra={
                    <Space>
                        {!isLoaded && (
                            <Tooltip title="Загрузить основные данные проекта">
                                <Button 
                                    type="primary" 
                                    size="small" 
                                    icon={<UploadOutlined />}
                                    onClick={loadEssentialData}
                                    loading={isLoading}
                                    disabled={isLoading}
                                >
                                    Загрузить
                                </Button>
                        )}
                        {isLoaded && (
                            <Tag color="green" icon={<CheckCircleOutlined />}>
                                Загружено
                            </Tag>
                        )}
                        <Tooltip title="Проверить статус Memory LLM">
                            <Button 
                                type="text" 
                                size="small" 
                                icon={<InfoCircleOutlined />}
                                onClick={checkMemoryService}
                            />
                        </Tooltip>
                    </Space>
                }
            >
                <div style={{ marginBottom: '12px' }}>
                    <Text style={{ fontSize: '12px', color: '#666' }}>
                        {isLoaded 
                            ? 'Основные данные проекта загружены в память'
                            : 'Загрузите основные данные проекта в Memory LLM'
                        }
                    </Text>
                </div>

                {isLoading && (
                    <div style={{ marginBottom: '12px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <Text style={{ fontSize: '11px' }}>Прогресс:</Text>
                            <Text style={{ fontSize: '11px' }}>{progress}%</Text>
                        </div>
                        <Progress 
                            percent={progress} 
                            size="small"
                            strokeColor={{
                                '0%': '#108ee9',
                                '100%': '#87d068',
                            }}
                        />
                    </div>
                )}

                <div style={{ fontSize: '11px', color: '#999' }}>
                    {isLoaded 
                        ? `${essentialProjectData.length} элементов загружено`
                        : `${essentialProjectData.length} элементов готово к загрузке`
                    }
                </div>
            </Card>
        );
    }

    return (
        <Card
            title={
                <Space>
                    <BrainOutlined style={{ color: '#1890ff' }} />
                    <span>Project Memory Loader</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Проверить статус Memory LLM">
                        <Button 
                            icon={<InfoCircleOutlined />} 
                            onClick={checkMemoryService}
                        >
                            Статус
                        </Button>
                    </Tooltip>
                    {isLoaded && (
                        <Tag color="green" icon={<CheckCircleOutlined />}>
                            Данные загружены
                        </Tag>
                    )}
                </Space>
            }
        >
            <div style={{ marginBottom: '16px' }}>
                <Text style={{ fontSize: '14px' }}>
                    {isLoaded 
                        ? 'Основные данные проекта уже загружены в Memory LLM'
                        : 'Загрузите основные данные проекта для улучшения работы AI ассистента'
                    }
                </Text>
            </div>

            {!isLoaded && (
                <div style={{ marginBottom: '16px' }}>
                    <Button
                        type="primary"
                        icon={<UploadOutlined />}
                        onClick={loadEssentialData}
                        loading={isLoading}
                        disabled={isLoading}
                        block
                    >
                        {isLoading ? 'Загрузка...' : 'Загрузить основные данные проекта'}
                    </Button>
                </div>
            )}

            {isLoading && (
                <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <Text strong>Прогресс загрузки:</Text>
                        <Text>{progress}%</Text>
                    </div>
                    <Progress 
                        percent={progress} 
                        status="active"
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </div>
            )}

            <div style={{ fontSize: '12px', color: '#666' }}>
                <div>📊 {essentialProjectData.length} элементов данных</div>
                <div>🏗️ Архитектура и технологии</div>
                <div>🏠 Районы Dubai</div>
                <div>📈 Рыночная аналитика</div>
                <div>💡 Инвестиционные стратегии</div>
            </div>
        </Card>
    );
};

export default DashboardLoader;
