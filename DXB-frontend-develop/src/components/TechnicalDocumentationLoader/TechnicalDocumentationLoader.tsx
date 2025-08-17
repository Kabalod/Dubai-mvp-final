import React, { useState, useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { 
    Button, 
    Space, 
    Progress, 
    Alert, 
    List, 
    Tag, 
    Typography, 
    message,
    Divider,
    Collapse,
    Statistic,
    Row,
    Col
} from 'antd';
import { 
    DatabaseOutlined, 
    CodeOutlined, 
    FileTextOutlined,
    ReloadOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import { developmentMemoryService, FileDocumentation } from '@/services/developmentMemoryService';

const { Text, Title } = Typography;
const { Panel } = Collapse;

interface LoadingStatus {
    step: string;
    progress: number;
    status: 'pending' | 'loading' | 'completed' | 'error';
    message: string;
}

const TechnicalDocumentationLoader: React.FC = () => {
    const [loadingStatuses, setLoadingStatuses] = useState<LoadingStatus[]>([
        { step: 'Architecture', progress: 0, status: 'pending', message: 'Waiting to start...' },
        { step: 'Ant Design Pro', progress: 0, status: 'pending', message: 'Waiting to start...' },
        { step: 'Memory LLM', progress: 0, status: 'pending', message: 'Waiting to start...' },
        { step: 'Routing', progress: 0, status: 'pending', message: 'Waiting to start...' },
        { step: 'Styling', progress: 0, status: 'pending', message: 'Waiting to start...' },
        { step: 'State Management', progress: 0, status: 'pending', message: 'Waiting to start...' },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState<{ total: number; byType: Record<string, number> }>({ total: 0, byType: {} });
    const [recentMemories, setRecentMemories] = useState<any[]>([]);

    // Загрузка статистики при монтировании
    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const statsData = await developmentMemoryService.getTechnicalDocumentationStats();
            setStats(statsData);
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    };

    // Загрузка всей технической документации
    const handleLoadAllDocumentation = async () => {
        setIsLoading(true);
        setLoadingStatuses(prev => prev.map(status => ({ ...status, status: 'loading', progress: 0, message: 'Starting...' })));

        try {
            // Симулируем прогресс для каждого шага
            const steps = ['Architecture', 'Ant Design Pro', 'Memory LLM', 'Routing', 'Styling', 'State Management'];
            
            for (let i = 0; i < steps.length; i++) {
                const step = steps[i];
                
                // Обновляем статус текущего шага
                setLoadingStatuses(prev => prev.map(status => 
                    status.step === step 
                        ? { ...status, status: 'loading', message: 'Loading...' }
                        : status
                ));

                // Симулируем прогресс
                for (let progress = 0; progress <= 100; progress += 10) {
                    setLoadingStatuses(prev => prev.map(status => 
                        status.step === step 
                            ? { ...status, progress, message: `Loading ${step}... ${progress}%` }
                            : status
                    ));
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Помечаем шаг как завершенный
                setLoadingStatuses(prev => prev.map(status => 
                    status.step === step 
                        ? { ...status, status: 'completed', progress: 100, message: `${step} loaded successfully!` }
                        : status
                ));

                // Небольшая пауза между шагами
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            // Загружаем реальную документацию
            await developmentMemoryService.loadAllTechnicalDocumentation();
            
            message.success('All technical documentation loaded successfully!');
            
            // Обновляем статистику
            await loadStats();
            
        } catch (error) {
            console.error('Failed to load documentation:', error);
            message.error('Failed to load technical documentation');
            
            // Помечаем все шаги как ошибки
            setLoadingStatuses(prev => prev.map(status => ({
                ...status,
                status: 'error',
                message: 'Failed to load'
            })));
        } finally {
            setIsLoading(false);
        }
    };

    // Поиск технической информации
    const handleSearchTechnicalInfo = async (query: string) => {
        try {
            const memories = await developmentMemoryService.searchTechnicalInfo(query);
            setRecentMemories(memories);
            message.success(`Found ${memories.length} relevant memories`);
        } catch (error) {
            console.error('Failed to search technical info:', error);
            message.error('Failed to search technical information');
        }
    };

    // Получение цвета для статуса
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'success';
            case 'loading': return 'processing';
            case 'error': return 'exception';
            default: return 'default';
        }
    };

    // Получение иконки для статуса
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircleOutlined />;
            case 'loading': return <ReloadOutlined spin />;
            case 'error': return <ExclamationCircleOutlined />;
            default: return <InfoCircleOutlined />;
        }
    };

    return (
        <ProCard
            title={
                <Space>
                    <CodeOutlined style={{ color: '#1890ff' }} />
                    <span>Technical Documentation Loader</span>
                </Space>
            }
            extra={
                <Space>
                    <Button
                        type="primary"
                        icon={<DatabaseOutlined />}
                        onClick={handleLoadAllDocumentation}
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        Load All Documentation
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={loadStats}
                    >
                        Refresh Stats
                    </Button>
                </Space>
            }
        >
            {/* Статистика */}
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col xs={24} sm={12} lg={8}>
                    <Statistic
                        title="Total Memories"
                        value={stats.total}
                        prefix={<DatabaseOutlined />}
                        valueStyle={{ color: '#3f8600' }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Statistic
                        title="System Memories"
                        value={stats.byType?.system || 0}
                        prefix={<CodeOutlined />}
                        valueStyle={{ color: '#1890ff' }}
                    />
                </Col>
                <Col xs={24} sm={12} lg={8}>
                    <Statistic
                        title="Technical Docs"
                        value={stats.byType?.system || 0}
                        prefix={<FileTextOutlined />}
                        valueStyle={{ color: '#722ed1' }}
                    />
                </Col>
            </Row>

            {/* Статус загрузки */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Loading Status</Title>
                <List
                    dataSource={loadingStatuses}
                    renderItem={(status) => (
                        <List.Item>
                            <div style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <Space>
                                        {getStatusIcon(status.status)}
                                        <Text strong>{status.step}</Text>
                                        <Tag color={getStatusColor(status.status)}>
                                            {status.status.toUpperCase()}
                                        </Tag>
                                    </Space>
                                    <Text type="secondary">{status.message}</Text>
                                </div>
                                <Progress
                                    percent={status.progress}
                                    status={status.status === 'error' ? 'exception' : status.status === 'completed' ? 'success' : 'active'}
                                    size="small"
                                />
                            </div>
                        </List.Item>
                    )}
                />
            </div>

            <Divider />

            {/* Поиск технической информации */}
            <div style={{ marginBottom: '24px' }}>
                <Title level={5}>Search Technical Information</Title>
                <Space.Compact style={{ width: '100%' }}>
                    <Button
                        onClick={() => handleSearchTechnicalInfo('ProLayout')}
                        size="large"
                    >
                        Search ProLayout
                    </Button>
                    <Button
                        onClick={() => handleSearchTechnicalInfo('Memory LLM')}
                        size="large"
                    >
                        Search Memory LLM
                    </Button>
                    <Button
                        onClick={() => handleSearchTechnicalInfo('React Query')}
                        size="large"
                    >
                        Search React Query
                    </Button>
                    <Button
                        onClick={() => handleSearchTechnicalInfo('Ant Design')}
                        size="large"
                    >
                        Search Ant Design
                    </Button>
                </Space.Compact>
            </div>

            {/* Недавние воспоминания */}
            {recentMemories.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <Title level={5}>Recent Technical Memories</Title>
                    <List
                        dataSource={recentMemories}
                        renderItem={(memory) => (
                            <List.Item>
                                <div style={{ width: '100%' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                        <Text strong style={{ flex: 1 }}>
                                            {memory.text.slice(0, 100)}...
                                        </Text>
                                        <Tag color="blue" style={{ marginLeft: '8px' }}>
                                            {memory.type}
                                        </Tag>
                                    </div>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Similarity: {memory.similarity ? `${(memory.similarity * 100).toFixed(1)}%` : 'N/A'}
                                    </Text>
                                </div>
                            </List.Item>
                        )}
                    />
                </div>
            )}

            {/* Информация о компоненте */}
            <Collapse style={{ marginTop: '16px' }}>
                <Panel header="Component Information" key="1">
                    <div style={{ padding: '16px 0' }}>
                        <Text>
                            This component automatically loads technical documentation about the project architecture, 
                            components, services, and development patterns into the Memory LLM system. 
                            This creates an intelligent knowledge base that can be used for development assistance.
                        </Text>
                    </div>
                </Panel>
                <Panel header="What Gets Loaded" key="2">
                    <List
                        size="small"
                        dataSource={[
                            'Project architecture and technology stack',
                            'Ant Design Pro component usage patterns',
                            'Memory LLM system documentation',
                            'Routing and navigation structure',
                            'Styling and UI design system',
                            'State management patterns',
                            'Component props and methods',
                            'Service API endpoints',
                            'Development tools and workflows'
                        ]}
                        renderItem={(item) => (
                            <List.Item>
                                <Text>• {item}</Text>
                            </List.Item>
                        )}
                    />
                </Panel>
                <Panel header="Usage Examples" key="3">
                    <div style={{ padding: '16px 0' }}>
                        <Text>
                            After loading documentation, you can ask the AI Assistant questions like:
                        </Text>
                        <List
                            size="small"
                            style={{ marginTop: '8px' }}
                            dataSource={[
                                '"How do I use ProLayout in my component?"',
                                '"What are the available Memory LLM API endpoints?"',
                                '"How should I structure my React components?"',
                                '"What styling patterns should I follow?"'
                            ]}
                            renderItem={(item) => (
                                <List.Item>
                                    <Text code>{item}</Text>
                                </List.Item>
                            )}
                        />
                    </div>
                </Panel>
            </Collapse>
        </ProCard>
    );
};

export default TechnicalDocumentationLoader;
