import React, { useState } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { 
    Button, 
    Space, 
    Progress, 
    message, 
    List, 
    Tag, 
    Typography, 
    Alert,
    Divider,
    Tooltip
} from 'antd';
import { 
    DatabaseOutlined, 
    UploadOutlined, 
    CheckCircleOutlined,
    LoadingOutlined,
    InfoCircleOutlined,
    FileTextOutlined,
    HomeOutlined,
    BarChartOutlined,
    UserOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { memoryService, MemoryItem } from '@/services/memoryService';

const { Text, Title } = Typography;

interface ProjectData {
    category: string;
    items: Array<{
        text: string;
        type: MemoryItem['type'];
        age: MemoryItem['age'];
        description: string;
    }>;
}

const ProjectMemoryLoader: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [loadedItems, setLoadedItems] = useState<string[]>([]);
    const [totalItems, setTotalItems] = useState(0);

    // Данные проекта для загрузки в память
    const projectData: ProjectData[] = [
        {
            category: 'Проект и Архитектура',
            items: [
                {
                    text: 'Dubai Real Estate Platform - современная платформа для управления недвижимостью в Dubai',
                    type: 'system',
                    age: 'permanent',
                    description: 'Основная информация о проекте'
                },
                {
                    text: 'Технологический стек: React 18, TypeScript, Ant Design Pro, Vite, Django, PostgreSQL',
                    type: 'system',
                    age: 'permanent',
                    description: 'Технологии проекта'
                },
                {
                    text: 'Архитектура: Frontend (React), Backend (Django), Database (PostgreSQL), AI Memory (Java LLM)',
                    type: 'system',
                    age: 'permanent',
                    description: 'Архитектура системы'
                },
                {
                    text: 'Интеграция с Java Memory LLM для накопления знаний и AI ассистента',
                    type: 'system',
                    age: 'permanent',
                    description: 'AI интеграция'
                }
            ]
        },
        {
            category: 'Недвижимость Dubai',
            items: [
                {
                    text: 'Palm Jumeirah - премиум район с виллами стоимостью от 5M до 50M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о Palm Jumeirah'
                },
                {
                    text: 'Downtown Dubai - центр города с апартаментами от 800K до 8M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о Downtown Dubai'
                },
                {
                    text: 'JBR (Jumeirah Beach Residence) - пляжный район с апартаментами от 600K до 4M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о JBR'
                },
                {
                    text: 'Business Bay - деловой район с офисами и апартаментами от 500K до 6M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о Business Bay'
                },
                {
                    text: 'Emirates Hills - эксклюзивный район с виллами от 8M до 100M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о Emirates Hills'
                },
                {
                    text: 'Dubai Marina - современный район с небоскребами и апартаментами от 700K до 5M AED',
                    type: 'property',
                    age: 'month',
                    description: 'Информация о Dubai Marina'
                }
            ]
        },
        {
            category: 'Рыночная Аналитика',
            items: [
                {
                    text: 'Средние цены на недвижимость в Dubai: виллы 3-15M AED, апартаменты 500K-3M AED',
                    type: 'analytics',
                    age: 'month',
                    description: 'Ценовые диапазоны'
                },
                {
                    text: 'ROI на недвижимость Dubai: 5-8% годовых для аренды, 10-15% для продажи',
                    type: 'analytics',
                    age: 'month',
                    description: 'Показатели ROI'
                },
                {
                    text: 'Тренды рынка: рост цен на 15-20% в год, высокий спрос на премиум сегмент',
                    type: 'analytics',
                    age: 'month',
                    description: 'Рыночные тренды'
                },
                {
                    text: 'Популярные районы для инвестиций: Palm Jumeirah, Downtown Dubai, Dubai Marina',
                    type: 'analytics',
                    age: 'month',
                    description: 'Инвестиционные районы'
                },
                {
                    text: 'Факторы роста цен: инфраструктура, туризм, международные инвестиции, налоговые льготы',
                    type: 'analytics',
                    age: 'month',
                    description: 'Факторы роста'
                }
            ]
        },
        {
            category: 'Типы Недвижимости',
            items: [
                {
                    text: 'Виллы: от 3 до 10+ спален, частные бассейны, сады, пляжный доступ',
                    type: 'property',
                    age: 'month',
                    description: 'Характеристики вилл'
                },
                {
                    text: 'Апартаменты: студии, 1-4 спальни, современные удобства, виды на город или море',
                    type: 'property',
                    age: 'month',
                    description: 'Характеристики апартаментов'
                },
                {
                    text: 'Офисы: от 100 до 1000+ кв.м, современные системы, парковка, конференц-залы',
                    type: 'property',
                    age: 'month',
                    description: 'Характеристики офисов'
                },
                {
                    text: 'Земельные участки: от 1000 до 10000+ кв.м, различные зоны застройки',
                    type: 'property',
                    age: 'month',
                    description: 'Характеристики участков'
                }
            ]
        },
        {
            category: 'Инвестиционные Стратегии',
            items: [
                {
                    text: 'Долгосрочные инвестиции: покупка недвижимости на 5-10 лет с ожиданием роста цен',
                    type: 'recommendation',
                    age: 'month',
                    description: 'Долгосрочная стратегия'
                },
                {
                    text: 'Краткосрочные инвестиции: покупка на стадии строительства с продажей после завершения',
                    type: 'recommendation',
                    age: 'month',
                    description: 'Краткосрочная стратегия'
                },
                {
                    text: 'Арендный бизнес: покупка недвижимости для сдачи в аренду туристам и экспатам',
                    type: 'recommendation',
                    age: 'month',
                    description: 'Арендная стратегия'
                },
                {
                    text: 'Портфельные инвестиции: диверсификация по районам и типам недвижимости',
                    type: 'recommendation',
                    age: 'month',
                    description: 'Портфельная стратегия'
                }
            ]
        },
        {
            category: 'Правовые Аспекты',
            items: [
                {
                    text: 'Иностранцы могут покупать недвижимость в свободных зонах Dubai без ограничений',
                    type: 'system',
                    age: 'permanent',
                    description: 'Права иностранцев'
                },
                {
                    text: 'Налоги: нет подоходного налога, налога на недвижимость, НДС на первичную недвижимость',
                    type: 'system',
                    age: 'permanent',
                    description: 'Налоговая информация'
                },
                {
                    text: 'Право собственности: свободное владение (freehold) в определенных районах',
                    type: 'system',
                    age: 'permanent',
                    description: 'Право собственности'
                },
                {
                    text: 'Визы: покупка недвижимости от 1M AED дает право на резидентскую визу',
                    type: 'system',
                    age: 'permanent',
                    description: 'Визовые преимущества'
                }
            ]
        },
        {
            category: 'Компоненты Системы',
            items: [
                {
                    text: 'Dashboard: главная страница с аналитикой, статистикой и AI ассистентом',
                    type: 'system',
                    age: 'permanent',
                    description: 'Описание Dashboard'
                },
                {
                    text: 'Analytics: детальная аналитика рынка с графиками и метриками',
                    type: 'system',
                    age: 'permanent',
                    description: 'Описание Analytics'
                },
                {
                    text: 'Properties: управление недвижимостью с карточками и детальной информацией',
                    type: 'system',
                    age: 'permanent',
                    description: 'Описание Properties'
                },
                {
                    text: 'AI Assistant: интеллектуальный помощник с доступом к базе знаний',
                    type: 'system',
                    age: 'permanent',
                    description: 'Описание AI Assistant'
                },
                {
                    text: 'Memory Dashboard: управление базой знаний и оптимизация памяти',
                    type: 'system',
                    age: 'permanent',
                    description: 'Описание Memory Dashboard'
                }
            ]
        }
    ];

    // Загрузка всех данных в Memory LLM
    const loadAllProjectData = async () => {
        setIsLoading(true);
        setProgress(0);
        setLoadedItems([]);
        
        // Подсчитываем общее количество элементов
        const total = projectData.reduce((sum, category) => sum + category.items.length, 0);
        setTotalItems(total);
        
        let loadedCount = 0;
        const newLoadedItems: string[] = [];

        try {
            for (const category of projectData) {
                for (const item of category.items) {
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
                        
                        // Добавляем в список загруженных
                        newLoadedItems.push(`${category.category}: ${item.description}`);
                        setLoadedItems([...newLoadedItems]);
                        
                        // Небольшая задержка для плавности
                        await new Promise(resolve => setTimeout(resolve, 100));
                        
                    } catch (error) {
                        console.error(`Error loading item: ${item.text}`, error);
                        message.error(`Ошибка загрузки: ${item.description}`);
                    }
                }
            }
            
            message.success(`Успешно загружено ${loadedCount} элементов в базу знаний!`);
            
        } catch (error) {
            console.error('Error loading project data:', error);
            message.error('Произошла ошибка при загрузке данных проекта');
        } finally {
            setIsLoading(false);
        }
    };

    // Проверка статуса Memory LLM
    const checkMemoryService = async () => {
        try {
            const health = await memoryService.getHealth();
            message.success(`Memory LLM сервис активен: ${health.status}`);
        } catch (error) {
            message.error('Memory LLM сервис недоступен. Проверьте подключение.');
        }
    };

    // Получение статистики памяти
    const getMemoryStats = async () => {
        try {
            const stats = await memoryService.getMemoryStats();
            message.info(`Всего воспоминаний: ${stats.totalMemories}`);
        } catch (error) {
            message.error('Не удалось получить статистику памяти');
        }
    };

    return (
        <ProCard
            title={
                <Space>
                    <DatabaseOutlined style={{ color: '#1890ff' }} />
                    <span>Загрузка проекта в Memory LLM</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Проверить статус Memory LLM">
                        <Button 
                            icon={<InfoCircleOutlined />} 
                            onClick={checkMemoryService}
                        >
                            Проверить статус
                        </Button>
                    </Tooltip>
                    <Tooltip title="Получить статистику памяти">
                        <Button 
                            icon={<BarChartOutlined />} 
                            onClick={getMemoryStats}
                        >
                            Статистика
                        </Button>
                    </Tooltip>
                </Space>
            }
        >
            <div style={{ marginBottom: '24px' }}>
                <Alert
                    message="Информация о проекте"
                    description="Этот компонент загружает всю информацию о проекте Dubai Real Estate в базу знаний Memory LLM. После загрузки AI ассистент сможет отвечать на вопросы, используя полный контекст проекта."
                    type="info"
                    showIcon
                    icon={<InfoCircleOutlined />}
                />
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Title level={4}>Категории данных для загрузки:</Title>
                <List
                    size="small"
                    dataSource={projectData}
                    renderItem={(category) => (
                        <List.Item>
                            <Space>
                                <Tag color="blue" icon={<FileTextOutlined />}>
                                    {category.category}
                                </Tag>
                                <Text>{category.items.length} элементов</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>

            <Divider />

            <div style={{ marginBottom: '24px' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong>Прогресс загрузки:</Text>
                        <Text>{progress}% ({loadedItems.length}/{totalItems})</Text>
                    </div>
                    <Progress 
                        percent={progress} 
                        status={isLoading ? 'active' : 'normal'}
                        strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                        }}
                    />
                </Space>
            </div>

            <div style={{ marginBottom: '24px' }}>
                <Button
                    type="primary"
                    size="large"
                    icon={<UploadOutlined />}
                    onClick={loadAllProjectData}
                    loading={isLoading}
                    disabled={isLoading}
                    block
                >
                    {isLoading ? 'Загрузка данных...' : 'Загрузить весь проект в Memory LLM'}
                </Button>
            </div>

            {loadedItems.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <Title level={5}>Загруженные элементы:</Title>
                    <List
                        size="small"
                        dataSource={loadedItems}
                        renderItem={(item) => (
                            <List.Item>
                                <Space>
                                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                    <Text>{item}</Text>
                                </Space>
                            </List.Item>
                        )}
                        style={{ maxHeight: '200px', overflowY: 'auto' }}
                    />
                </div>
            )}

            <Divider />

            <div>
                <Title level={5}>После загрузки AI ассистент сможет:</Title>
                <List
                    size="small"
                    dataSource={[
                        'Отвечать на вопросы о проекте и его архитектуре',
                        'Предоставлять информацию о недвижимости Dubai',
                        'Давать аналитику рынка и тренды',
                        'Рекомендовать инвестиционные стратегии',
                        'Объяснять правовые аспекты покупки недвижимости',
                        'Рассказывать о компонентах системы'
                    ]}
                    renderItem={(item) => (
                        <List.Item>
                            <Space>
                                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                                <Text>{item}</Text>
                            </Space>
                        </List.Item>
                    )}
                />
            </div>
        </ProCard>
    );
};

export default ProjectMemoryLoader;
