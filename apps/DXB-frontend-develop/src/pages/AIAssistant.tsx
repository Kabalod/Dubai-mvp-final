import React, { useState } from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Space, Tag, Button, message } from 'antd';
import { 
    BulbOutlined as BrainOutlined, 
    MessageOutlined, 
    DatabaseOutlined, 
    BulbOutlined,
    RobotOutlined,
    UserOutlined,
    PropertySafetyOutlined
} from '@ant-design/icons';
import AIAssistant from '@/components/AIAssistant';
import { MemoryItem } from '@/services/memoryService';
import { Typography } from 'antd';
const { Text } = Typography;

const AIAssistantPage: React.FC = () => {
    const [totalConversations, setTotalConversations] = useState(0);
    const [totalMemories, setTotalMemories] = useState(0);
    const [aiConfidence, setAiConfidence] = useState(0.85);

    // Обработчик добавления новых воспоминаний
    const handleMemoryAdd = (memory: MemoryItem) => {
        setTotalMemories(prev => prev + 1);
        message.success('Новое воспоминание добавлено в базу знаний!');
    };

    // Обработчик новых разговоров
    const handleNewConversation = () => {
        setTotalConversations(prev => prev + 1);
    };

    return (
        <ProLayout
            title="Dubai Real Estate AI Assistant"
            logo="🤖"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <div style={{ padding: '24px', background: '#f0f2f5' }}>
                {/* Статистика AI ассистента */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Всего разговоров"
                                value={totalConversations}
                                prefix={<MessageOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="База знаний"
                                value={totalMemories}
                                prefix={<DatabaseOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Уверенность AI"
                                value={aiConfidence * 100}
                                suffix="%"
                                prefix={<BrainOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Активность"
                                value="24/7"
                                prefix={<BulbOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Основной AI ассистент */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <AIAssistant 
                            onMemoryAdd={handleMemoryAdd}
                            showMemories={true}
                            maxHeight={700}
                        />
                    </Col>
                    
                    <Col xs={24} lg={8}>
                        {/* Информация о возможностях */}
                        <Card 
                            title={
                                <Space>
                                    <RobotOutlined style={{ color: '#1890ff' }} />
                                    <span>Возможности AI</span>
                                </Space>
                            }
                            style={{ marginBottom: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Tag color="blue" icon={<PropertySafetyOutlined />}>
                                        Недвижимость
                                    </Tag>
                                    <Text>Анализ свойств, районов, цен</Text>
                                </div>
                                <div>
                                    <Tag color="green" icon={<DatabaseOutlined />}>
                                        Аналитика
                                    </Tag>
                                    <Text>Рыночные тренды, статистика</Text>
                                </div>
                                <div>
                                    <Tag color="purple" icon={<BulbOutlined />}>
                                        Рекомендации
                                    </Tag>
                                    <Text>Персональные советы</Text>
                                </div>
                                <div>
                                    <Tag color="orange" icon={<BrainOutlined />}>
                                        Память
                                    </Tag>
                                    <Text>Накопление знаний</Text>
                                </div>
                            </Space>
                        </Card>

                        {/* Примеры вопросов */}
                        <Card 
                            title="Примеры вопросов"
                            style={{ marginBottom: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button 
                                    type="dashed" 
                                    block 
                                    size="small"
                                    onClick={() => {
                                        // Здесь можно добавить логику для автоматического заполнения вопроса
                                        message.info('Скопируйте вопрос в чат');
                                    }}
                                >
                                    Какие районы Dubai лучшие для инвестиций?
                                </Button>
                                <Button 
                                    type="dashed" 
                                    block 
                                    size="small"
                                    onClick={() => {
                                        message.info('Скопируйте вопрос в чат');
                                    }}
                                >
                                    Какие тренды рынка недвижимости Dubai?
                                </Button>
                                <Button 
                                    type="dashed" 
                                    block 
                                    size="small"
                                    onClick={() => {
                                        message.info('Скопируйте вопрос в чат');
                                    }}
                                >
                                    ROI на недвижимость в Palm Jumeirah?
                                </Button>
                                <Button 
                                    type="dashed" 
                                    block 
                                    size="small"
                                    onClick={() => {
                                        message.info('Скопируйте вопрос в чат');
                                    }}
                                >
                                    Сравнение вилл и апартаментов
                                </Button>
                            </Space>
                        </Card>

                        {/* Статус системы */}
                        <Card title="Статус системы">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Memory LLM:</span>
                                    <Tag color="green">Активен</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>База знаний:</span>
                                    <Tag color="blue">Обновляется</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>AI Модель:</span>
                                    <Tag color="green">Готова</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Последнее обновление:</span>
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        {new Date().toLocaleString()}
                                    </span>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Дополнительная информация */}
                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Card title="Как работает AI ассистент">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <BrainOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                        <h4>Анализ запроса</h4>
                                        <p>AI анализирует ваш вопрос и определяет тип запроса</p>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <DatabaseOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                                        <h4>Поиск знаний</h4>
                                        <p>Система ищет релевантную информацию в базе знаний</p>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <BulbOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
                                        <h4>Генерация ответа</h4>
                                        <p>AI формирует персонализированный ответ на основе найденных данных</p>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </div>
        </ProLayout>
    );
};

export default AIAssistantPage;
