import React, { useState, useEffect } from 'react';
import { ProCard, ProTable } from '@ant-design/pro-components';
import { Card, Row, Col, Button, Space, Tag, Statistic, Input, message, Modal, Form, Select, Tooltip } from 'antd';
import { 
    BrainOutlined, 
    SearchOutlined, 
    PlusOutlined, 
    DeleteOutlined,
    ReloadOutlined,
    DatabaseOutlined,
    ClockCircleOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import { memoryService, MemoryItem, MemoryStats, SearchResponse } from '@/services/memoryService';

const { Search } = Input;
const { TextArea } = Input;

interface MemoryDashboardProps {
    onMemorySelect?: (memory: MemoryItem) => void;
    showActions?: boolean;
}

const MemoryDashboard: React.FC<MemoryDashboardProps> = ({ 
    onMemorySelect, 
    showActions = true 
}) => {
    const [memories, setMemories] = useState<MemoryItem[]>([]);
    const [stats, setStats] = useState<MemoryStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
    const [form] = Form.useForm();

    // Загрузка статистики памяти
    useEffect(() => {
        loadMemoryStats();
    }, []);

    const loadMemoryStats = async () => {
        try {
            setLoading(true);
            const memoryStats = await memoryService.getMemoryStats();
            setStats(memoryStats);
        } catch (error) {
            console.error('Failed to load memory stats:', error);
            message.error('Failed to load memory statistics');
        } finally {
            setLoading(false);
        }
    };

    // Добавление нового воспоминания
    const handleAddMemory = async (values: any) => {
        try {
            setLoading(true);
            const newMemory: MemoryItem = {
                text: values.text,
                type: values.type,
                age: values.age,
            };
            
            const response = await memoryService.addMemory(newMemory);
            message.success('Memory added successfully!');
            setIsAddModalVisible(false);
            form.resetFields();
            loadMemoryStats(); // Обновляем статистику
        } catch (error) {
            console.error('Failed to add memory:', error);
            message.error('Failed to add memory');
        } finally {
            setLoading(false);
        }
    };

    // Поиск воспоминаний
    const handleSearchMemories = async (query: string) => {
        if (!query.trim()) {
            message.warning('Please enter a search query');
            return;
        }

        try {
            setLoading(true);
            const searchResponse: SearchResponse = await memoryService.searchMemories(query, 20);
            setMemories(searchResponse.memories);
            setSearchQuery(query);
            message.success(`Found ${searchResponse.memories.length} memories`);
        } catch (error) {
            console.error('Failed to search memories:', error);
            message.error('Failed to search memories');
        } finally {
            setLoading(false);
        }
    };

    // Оптимизация памяти
    const handleOptimizeMemory = async () => {
        try {
            setLoading(true);
            const result = await memoryService.optimizeMemory();
            message.success(result.message || 'Memory optimization completed');
            loadMemoryStats(); // Обновляем статистику
        } catch (error) {
            console.error('Failed to optimize memory:', error);
            message.error('Failed to optimize memory');
        } finally {
            setLoading(false);
        }
    };

    // Проверка здоровья сервиса
    const handleCheckHealth = async () => {
        try {
            const health = await memoryService.getHealth();
            message.success(`Memory service is healthy: ${health.status}`);
        } catch (error) {
            message.error('Memory service is not available');
        }
    };

    // Колонки для таблицы воспоминаний
    const memoryColumns = [
        {
            title: 'Text',
            dataIndex: 'text',
            key: 'text',
            render: (text: string) => (
                <div style={{ maxWidth: 300 }}>
                    <Tooltip title={text}>
                        <span style={{ 
                            display: 'block', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis', 
                            whiteSpace: 'nowrap' 
                        }}>
                            {text}
                        </span>
                    </Tooltip>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => {
                const colorMap: Record<string, string> = {
                    'property': 'blue',
                    'analytics': 'green',
                    'user': 'purple',
                    'agent': 'orange',
                    'system': 'red',
                };
                return <Tag color={colorMap[type] || 'default'}>{type}</Tag>;
            },
            filters: [
                { text: 'Property', value: 'property' },
                { text: 'Analytics', value: 'analytics' },
                { text: 'User', value: 'user' },
                { text: 'Agent', value: 'agent' },
                { text: 'System', value: 'system' },
            ],
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
            render: (age: string) => {
                const colorMap: Record<string, string> = {
                    'day': 'green',
                    'week': 'blue',
                    'month': 'orange',
                    'year': 'red',
                    'permanent': 'purple',
                };
                return <Tag color={colorMap[age] || 'default'}>{age}</Tag>;
            },
        },
        {
            title: 'Similarity',
            dataIndex: 'similarity',
            key: 'similarity',
            render: (similarity: number) => {
                if (similarity === undefined) return '-';
                const percentage = (similarity * 100).toFixed(1);
                return (
                    <span style={{ 
                        color: similarity > 0.8 ? '#52c41a' : similarity > 0.6 ? '#faad14' : '#f5222d',
                        fontWeight: 'bold'
                    }}>
                        {percentage}%
                    </span>
                );
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record: MemoryItem) => (
                <Space size="small">
                    <Button 
                        type="link" 
                        size="small" 
                        onClick={() => onMemorySelect?.(record)}
                    >
                        View
                    </Button>
                    {showActions && (
                        <Button 
                            type="link" 
                            size="small" 
                            danger
                            icon={<DeleteOutlined />}
                        >
                            Delete
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#f0f2f5' }}>
            {/* Заголовок и статистика */}
            <ProCard
                title={
                    <Space>
                        <BrainOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                        <span>Memory LLM Dashboard</span>
                    </Space>
                }
                extra={
                    <Space>
                        <Button 
                            icon={<ReloadOutlined />} 
                            onClick={loadMemoryStats}
                            loading={loading}
                        >
                            Refresh
                        </Button>
                        <Button 
                            icon={<DatabaseOutlined />} 
                            onClick={handleCheckHealth}
                        >
                            Health Check
                        </Button>
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />} 
                            onClick={() => setIsAddModalVisible(true)}
                        >
                            Add Memory
                        </Button>
                    </Space>
                }
                style={{ marginBottom: '24px' }}
            >
                <Row gutter={[16, 16]}>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Total Memories"
                            value={stats?.totalMemories || 0}
                            prefix={<DatabaseOutlined />}
                            valueStyle={{ color: '#3f8600' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Property Memories"
                            value={stats?.byType?.property || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#1890ff' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Analytics Memories"
                            value={stats?.byType?.analytics || 0}
                            prefix={<FileTextOutlined />}
                            valueStyle={{ color: '#52c41a' }}
                        />
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Statistic
                            title="Last Optimization"
                            value={stats?.lastOptimization ? new Date(stats.lastOptimization).toLocaleDateString() : 'Never'}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#faad14' }}
                        />
                    </Col>
                </Row>
            </ProCard>

            {/* Поиск и управление */}
            <ProCard
                title="Memory Search & Management"
                extra={
                    <Button 
                        type="primary" 
                        icon={<SearchOutlined />} 
                        onClick={() => setIsSearchModalVisible(true)}
                    >
                        Advanced Search
                    </Button>
                }
                style={{ marginBottom: '24px' }}
            >
                <Space.Compact style={{ width: '100%' }}>
                    <Search
                        placeholder="Search memories..."
                        enterButton="Search"
                        size="large"
                        onSearch={handleSearchMemories}
                        loading={loading}
                    />
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={handleOptimizeMemory}
                        loading={loading}
                        size="large"
                    >
                        Optimize Memory
                    </Button>
                </Space.Compact>
            </ProCard>

            {/* Таблица воспоминаний */}
            <ProCard title="Recent Memories">
                <ProTable
                    columns={memoryColumns}
                    dataSource={memories}
                    loading={loading}
                    search={false}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showQuickJumper: true,
                    }}
                    toolBarRender={() => [
                        <Button 
                            key="add" 
                            type="primary" 
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddModalVisible(true)}
                        >
                            Add Memory
                        </Button>,
                    ]}
                    rowKey="id"
                />
            </ProCard>

            {/* Модальное окно добавления воспоминания */}
            <Modal
                title="Add New Memory"
                open={isAddModalVisible}
                onCancel={() => setIsAddModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleAddMemory}
                >
                    <Form.Item
                        name="text"
                        label="Memory Text"
                        rules={[{ required: true, message: 'Please enter memory text!' }]}
                    >
                        <TextArea 
                            rows={4} 
                            placeholder="Enter the memory content..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Memory Type"
                        rules={[{ required: true, message: 'Please select memory type!' }]}
                    >
                        <Select placeholder="Select memory type">
                            <Select.Option value="property">Property</Select.Option>
                            <Select.Option value="analytics">Analytics</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="agent">Agent</Select.Option>
                            <Select.Option value="system">System</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="age"
                        label="Memory Age"
                        rules={[{ required: true, message: 'Please select memory age!' }]}
                    >
                        <Select placeholder="Select memory age">
                            <Select.Option value="day">Day</Select.Option>
                            <Select.Option value="week">Week</Select.Option>
                            <Select.Option value="month">Month</Select.Option>
                            <Select.Option value="year">Year</Select.Option>
                            <Select.Option value="permanent">Permanent</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit" loading={loading}>
                                Add Memory
                            </Button>
                            <Button onClick={() => setIsAddModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>

            {/* Модальное окно расширенного поиска */}
            <Modal
                title="Advanced Memory Search"
                open={isSearchModalVisible}
                onCancel={() => setIsSearchModalVisible(false)}
                footer={null}
                width={600}
            >
                <Form layout="vertical">
                    <Form.Item
                        name="query"
                        label="Search Query"
                        rules={[{ required: true, message: 'Please enter search query!' }]}
                    >
                        <TextArea 
                            rows={3} 
                            placeholder="Enter detailed search query..."
                        />
                    </Form.Item>

                    <Form.Item
                        name="type"
                        label="Filter by Type"
                    >
                        <Select placeholder="Select memory type (optional)" allowClear>
                            <Select.Option value="property">Property</Select.Option>
                            <Select.Option value="analytics">Analytics</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                            <Select.Option value="agent">Agent</Select.Option>
                            <Select.Option value="system">System</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="age"
                        label="Filter by Age"
                    >
                        <Select placeholder="Select memory age (optional)" allowClear>
                            <Select.Option value="day">Day</Select.Option>
                            <Select.Option value="week">Week</Select.Option>
                            <Select.Option value="month">Month</Select.Option>
                            <Select.Option value="year">Year</Select.Option>
                            <Select.Option value="permanent">Permanent</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Space>
                            <Button 
                                type="primary" 
                                onClick={() => {
                                    const values = form.getFieldsValue();
                                    if (values.query) {
                                        handleSearchMemories(values.query);
                                        setIsSearchModalVisible(false);
                                    }
                                }}
                            >
                                Search
                            </Button>
                            <Button onClick={() => setIsSearchModalVisible(false)}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MemoryDashboard;
