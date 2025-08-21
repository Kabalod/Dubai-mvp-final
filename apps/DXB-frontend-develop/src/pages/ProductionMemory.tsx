import React, { useState, useEffect } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { 
    Row, 
    Col, 
    Card, 
    Statistic, 
    Space, 
    Tag, 
    Alert, 
    Button, 
    Select, 
    Table, 
    Progress, 
    Tabs, 
    Upload, 
    message,
    Modal,
    Form,
    Input,
    DatePicker,
    Switch,
    Tooltip,
    Badge,
    Timeline,
    Descriptions,
    Divider
} from 'antd';
import { 
    DatabaseOutlined, 
    BulbOutlined as BrainOutlined, 
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined,
    SettingOutlined,
    UploadOutlined,
    DownloadOutlined,
    SyncOutlined,
    RocketOutlined,
    MonitorOutlined,
    BarChartOutlined,
    ToolOutlined,
    CloudOutlined,
    SafetyOutlined
} from '@ant-design/icons';
import { productionMemoryService, MemoryItem, MemoryStats, MemoryHealth } from '@/services/productionMemoryService';

const { TabPane } = Tabs;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

const ProductionMemoryPage: React.FC = () => {
    const [currentEnv, setCurrentEnv] = useState<'development' | 'staging' | 'production'>('development');
    const [memoryStats, setMemoryStats] = useState<MemoryStats | null>(null);
    const [systemHealth, setSystemHealth] = useState<MemoryHealth | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [memories, setMemories] = useState<MemoryItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedType, setSelectedType] = useState<string>('');
    const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

    // Загрузка данных при изменении окружения
    useEffect(() => {
        productionMemoryService.setEnvironment(currentEnv);
        loadSystemData();
    }, [currentEnv]);

    // Загрузка системных данных
    const loadSystemData = async () => {
        setIsLoading(true);
        try {
            const [health, stats] = await Promise.all([
                productionMemoryService.getHealth(),
                productionMemoryService.getMemoryStats()
            ]);
            setSystemHealth(health);
            setMemoryStats(stats);
        } catch (error) {
            console.error('Error loading system data:', error);
            message.error('Ошибка загрузки системных данных');
        } finally {
            setIsLoading(false);
        }
    };

    // Тест производительности
    const runPerformanceTest = async () => {
        setIsLoading(true);
        try {
            const metrics = await productionMemoryService.performanceTest(20);
            setPerformanceMetrics(metrics);
            message.success('Тест производительности завершен');
        } catch (error) {
            message.error('Ошибка теста производительности');
        } finally {
            setIsLoading(false);
        }
    };

    // Поиск воспоминаний
    const searchMemories = async () => {
        if (!searchQuery.trim()) return;
        
        setIsLoading(true);
        try {
            const filters: Record<string, any> = {};
            if (selectedCategory) filters.category = selectedCategory;
            if (selectedType) filters.type = selectedType;
            
            const response = await productionMemoryService.searchMemories(searchQuery, 50, filters);
            setMemories(response.memories);
        } catch (error) {
            message.error('Ошибка поиска воспоминаний');
        } finally {
            setIsLoading(false);
        }
    };

    // Оптимизация памяти
    const optimizeMemory = async () => {
        try {
            const result = await productionMemoryService.optimizeMemory();
            message.success(`Оптимизация завершена: ${result.optimizedCount} элементов оптимизировано`);
            loadSystemData(); // Перезагружаем статистику
        } catch (error) {
            message.error('Ошибка оптимизации памяти');
        }
    };

    // Экспорт памяти
    const exportMemory = async (format: 'json' | 'csv' | 'txt') => {
        try {
            const data = await productionMemoryService.exportMemory(format);
            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `memory-export-${new Date().toISOString().split('T')[0]}.${format}`;
                a.click();
                URL.revokeObjectURL(url);
            } else {
                const blob = data as Blob;
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `memory-export-${new Date().toISOString().split('T')[0]}.${format}`;
                a.click();
                URL.revokeObjectURL(url);
            }
            message.success(`Память экспортирована в формате ${format.toUpperCase()}`);
        } catch (error) {
            message.error('Ошибка экспорта памяти');
        }
    };

    // Импорт памяти
    const importMemory = async (file: File) => {
        try {
            const format = file.name.endsWith('.json') ? 'json' : 
                          file.name.endsWith('.csv') ? 'csv' : 'txt';
            
            const result = await productionMemoryService.importMemory(file, format);
            if (result.result.success) {
                message.success(`Импортировано ${result.result.processedCount} элементов`);
                loadSystemData(); // Перезагружаем статистику
            } else {
                message.error(`Ошибки импорта: ${result.result.errors?.join(', ')}`);
            }
        } catch (error) {
            message.error('Ошибка импорта памяти');
        }
    };

    // Колонки для таблицы воспоминаний
    const memoryColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            render: (id: string) => <code>{id?.slice(0, 8)}...</code>
        },
        {
            title: 'Текст',
            dataIndex: 'text',
            key: 'text',
            render: (text: string) => (
                <div style={{ maxWidth: 300 }}>
                    <div style={{ 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        whiteSpace: 'nowrap' 
                    }}>
                        {text}
                    </div>
                </div>
            )
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            render: (type: string) => {
                const colors: Record<string, string> = {
                    system: 'blue',
                    property: 'green',
                    analytics: 'purple',
                    recommendation: 'orange',
                    user: 'red',
                    agent: 'cyan',
                    market: 'magenta',
                    legal: 'volcano'
                };
                return <Tag color={colors[type] || 'default'}>{type}</Tag>;
            }
        },
        {
            title: 'Категория',
            dataIndex: 'category',
            key: 'category',
            width: 150,
            render: (category: string) => category ? <Tag>{category}</Tag> : '-'
        },
        {
            title: 'Возраст',
            dataIndex: 'age',
            key: 'age',
            width: 100,
            render: (age: string) => {
                const colors: Record<string, string> = {
                    day: 'red',
                    week: 'orange',
                    month: 'blue',
                    year: 'green',
                    permanent: 'purple'
                };
                return <Tag color={colors[age] || 'default'}>{age}</Tag>;
            }
        },
        {
            title: 'Схожесть',
            dataIndex: 'similarity',
            key: 'similarity',
            width: 100,
            render: (similarity: number) => similarity ? 
                <Progress percent={Math.round(similarity * 100)} size="small" /> : '-'
        },
        {
            title: 'Создано',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 120,
            render: (date: string) => date ? new Date(date).toLocaleDateString() : '-'
        }
    ];

    // Получение статуса здоровья
    const getHealthStatus = () => {
        if (!systemHealth) return 'unknown';
        return systemHealth.status.toLowerCase();
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'up': return 'success';
            case 'down': return 'error';
            default: return 'warning';
        }
    };

    return (
        <ProLayout
            title="Production Memory Management"
            logo="🚀"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <div style={{ padding: '24px', background: '#f0f2f5' }}>
                {/* Заголовок и выбор окружения */}
                <div style={{ marginBottom: '24px' }}>
                    <Row gutter={[16, 16]} align="middle">
                        <Col flex="auto">
                            <Alert
                                message="Production Memory LLM Management"
                                description={`Управление Memory LLM сервисом в окружении: ${currentEnv.toUpperCase()}`}
                                type="success"
                                showIcon
                                icon={<RocketOutlined />}
                                style={{ fontSize: '16px' }}
                            />
                        </Col>
                        <Col>
                            <Select
                                value={currentEnv}
                                onChange={setCurrentEnv}
                                style={{ width: 150 }}
                                size="large"
                            >
                                <Option value="development">Development</Option>
                                <Option value="staging">Staging</Option>
                                <Option value="production">Production</Option>
                            </Select>
                        </Col>
                    </Row>
                </div>

                {/* Статистика системы */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Статус системы"
                                value={getHealthStatus().toUpperCase()}
                                prefix={<SafetyOutlined />}
                                valueStyle={{ color: getHealthColor(getHealthStatus()) === 'success' ? '#3f8600' : '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Всего воспоминаний"
                                value={memoryStats?.totalMemories || 0}
                                prefix={<DatabaseOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Средняя схожесть"
                                value={memoryStats?.averageSimilarity ? Math.round(memoryStats.averageSimilarity * 100) : 0}
                                suffix="%"
                                prefix={<BrainOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Последнее обновление"
                                value={memoryStats?.lastUpdated ? new Date(memoryStats.lastUpdated).toLocaleTimeString() : 'N/A'}
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Основные вкладки */}
                <Tabs defaultActiveKey="overview" size="large">
                    {/* Обзор системы */}
                    <TabPane 
                        tab={
                            <span>
                                <MonitorOutlined />
                                Обзор системы
                            </span>
                        } 
                        key="overview"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="Детали здоровья системы" style={{ marginBottom: '16px' }}>
                                    {systemHealth && (
                                        <Descriptions column={1} size="small">
                                            <Descriptions.Item label="Общий статус">
                                                <Badge 
                                                    status={getHealthColor(getHealthStatus()) as any} 
                                                    text={systemHealth.status} 
                                                />
                                            </Descriptions.Item>
                                            <Descriptions.Item label="База данных">
                                                <Badge 
                                                    status={systemHealth.details.database.status === 'UP' ? 'success' : 'error'} 
                                                    text={systemHealth.details.database.status} 
                                                />
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Память">
                                                <Badge 
                                                    status={systemHealth.details.memory.status === 'UP' ? 'success' : 'error'} 
                                                    text={systemHealth.details.memory.status} 
                                                />
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Эмбеддинги">
                                                <Badge 
                                                    status={systemHealth.details.embeddings.status === 'UP' ? 'success' : 'error'} 
                                                    text={systemHealth.details.embeddings.status} 
                                                />
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Время проверки">
                                                {new Date(systemHealth.timestamp).toLocaleString()}
                                            </Descriptions.Item>
                                        </Descriptions>
                                    )}
                                </Card>

                                <Card title="Статистика по типам">
                                    {memoryStats && (
                                        <div>
                                            {Object.entries(memoryStats.memoriesByType).map(([type, count]) => (
                                                <div key={type} style={{ marginBottom: '8px' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                        <span>{type}:</span>
                                                        <span>{count}</span>
                                                    </div>
                                                    <Progress 
                                                        percent={Math.round((count / memoryStats.totalMemories) * 100)} 
                                                        size="small"
                                                        showInfo={false}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Card title="Производительность API" style={{ marginBottom: '16px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button 
                                            type="primary" 
                                            icon={<SyncOutlined />}
                                            onClick={runPerformanceTest}
                                            loading={isLoading}
                                            block
                                        >
                                            Запустить тест производительности
                                        </Button>
                                        
                                        {performanceMetrics && (
                                            <div>
                                                <Descriptions column={1} size="small">
                                                    <Descriptions.Item label="Среднее время ответа">
                                                        {performanceMetrics.averageResponseTime}ms
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Минимальное время">
                                                        {performanceMetrics.minResponseTime}ms
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Максимальное время">
                                                        {performanceMetrics.maxResponseTime}ms
                                                    </Descriptions.Item>
                                                    <Descriptions.Item label="Успешность">
                                                        {performanceMetrics.successRate}%
                                                    </Descriptions.Item>
                                                </Descriptions>
                                            </div>
                                        )}
                                    </Space>
                                </Card>

                                <Card title="Быстрые действия">
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button 
                                            icon={<ToolOutlined />}
                                            onClick={optimizeMemory}
                                            block
                                        >
                                            Оптимизировать память
                                        </Button>
                                        <Button 
                                            icon={<SyncOutlined />}
                                            onClick={loadSystemData}
                                            loading={isLoading}
                                            block
                                        >
                                            Обновить данные
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* Поиск и управление */}
                    <TabPane 
                        tab={
                            <span>
                                <FileTextOutlined />
                                Поиск и управление
                            </span>
                        } 
                        key="search"
                    >
                        <Card title="Поиск воспоминаний" style={{ marginBottom: '16px' }}>
                            <Row gutter={[16, 16]} align="middle">
                                <Col xs={24} md={8}>
                                    <Input
                                        placeholder="Введите поисковый запрос..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onPressEnter={searchMemories}
                                        size="large"
                                    />
                                </Col>
                                <Col xs={24} md={4}>
                                    <Select
                                        placeholder="Категория"
                                        value={selectedCategory}
                                        onChange={setSelectedCategory}
                                        allowClear
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="property">Недвижимость</Option>
                                        <Option value="market">Рынок</Option>
                                        <Option value="legal">Правовые аспекты</Option>
                                        <Option value="investment">Инвестиции</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} md={4}>
                                    <Select
                                        placeholder="Тип"
                                        value={selectedType}
                                        onChange={setSelectedType}
                                        allowClear
                                        style={{ width: '100%' }}
                                    >
                                        <Option value="system">Система</Option>
                                        <Option value="property">Недвижимость</Option>
                                        <Option value="analytics">Аналитика</Option>
                                        <Option value="recommendation">Рекомендации</Option>
                                        <Option value="user">Пользователь</Option>
                                    </Select>
                                </Col>
                                <Col xs={24} md={4}>
                                    <Button 
                                        type="primary" 
                                        icon={<SearchOutlined />}
                                        onClick={searchMemories}
                                        loading={isLoading}
                                        size="large"
                                        block
                                    >
                                        Поиск
                                    </Button>
                                </Col>
                            </Row>
                        </Card>

                        <Card title="Результаты поиска">
                            <Table
                                columns={memoryColumns}
                                dataSource={memories}
                                rowKey="id"
                                loading={isLoading}
                                pagination={{
                                    pageSize: 20,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                }}
                                scroll={{ x: 1200 }}
                            />
                        </Card>
                    </TabPane>

                    {/* Импорт/Экспорт */}
                    <TabPane 
                        tab={
                            <span>
                                <CloudOutlined />
                                Импорт/Экспорт
                            </span>
                        } 
                        key="import-export"
                    >
                        <Row gutter={[16, 16]}>
                            <Col xs={24} lg={12}>
                                <Card title="Экспорт памяти" style={{ marginBottom: '16px' }}>
                                    <Space direction="vertical" style={{ width: '100%' }}>
                                        <Button 
                                            icon={<DownloadOutlined />}
                                            onClick={() => exportMemory('json')}
                                            block
                                        >
                                            Экспорт в JSON
                                        </Button>
                                        <Button 
                                            icon={<DownloadOutlined />}
                                            onClick={() => exportMemory('csv')}
                                            block
                                        >
                                            Экспорт в CSV
                                        </Button>
                                        <Button 
                                            icon={<DownloadOutlined />}
                                            onClick={() => exportMemory('txt')}
                                            block
                                        >
                                            Экспорт в TXT
                                        </Button>
                                    </Space>
                                </Card>
                            </Col>

                            <Col xs={24} lg={12}>
                                <Card title="Импорт памяти">
                                    <Upload
                                        accept=".json,.csv,.txt"
                                        beforeUpload={(file) => {
                                            importMemory(file);
                                            return false; // Предотвращаем автоматическую загрузку
                                        }}
                                        showUploadList={false}
                                    >
                                        <Button 
                                            icon={<UploadOutlined />}
                                            block
                                            size="large"
                                        >
                                            Выберите файл для импорта
                                        </Button>
                                    </Upload>
                                    <div style={{ marginTop: '16px', fontSize: '12px', color: '#666' }}>
                                        Поддерживаемые форматы: JSON, CSV, TXT
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </TabPane>

                    {/* Настройки */}
                    <TabPane 
                        tab={
                            <span>
                                <SettingOutlined />
                                Настройки
                            </span>
                        } 
                        key="settings"
                    >
                        <Card title="Конфигурация окружения">
                            <Descriptions column={1}>
                                <Descriptions.Item label="Текущее окружение">
                                    <Tag color="blue">{currentEnv.toUpperCase()}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Base URL">
                                    {productionMemoryService.getCurrentConfig().baseURL}
                                </Descriptions.Item>
                                <Descriptions.Item label="Timeout">
                                    {productionMemoryService.getCurrentConfig().timeout}ms
                                </Descriptions.Item>
                                <Descriptions.Item label="Максимальные повторы">
                                    {productionMemoryService.getCurrentConfig().retries}
                                </Descriptions.Item>
                                <Descriptions.Item label="Статус подключения">
                                    <Badge 
                                        status={productionMemoryService.isServiceConnected() ? 'success' : 'error'} 
                                        text={productionMemoryService.isServiceConnected() ? 'Подключено' : 'Отключено'} 
                                    />
                                </Descriptions.Item>
                                <Descriptions.Item label="Последняя проверка здоровья">
                                    {productionMemoryService.getLastHealthCheck() ? 
                                        new Date(productionMemoryService.getLastHealthCheck()).toLocaleString() : 
                                        'Не проверялось'
                                    }
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </TabPane>
                </Tabs>
            </div>
        </ProLayout>
    );
};

export default ProductionMemoryPage;
