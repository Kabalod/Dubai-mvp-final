import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Space, Tag, Alert } from 'antd';
import { 
    DatabaseOutlined, 
    BrainOutlined, 
    FileTextOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined,
    InfoCircleOutlined
} from '@ant-design/icons';
import ProjectMemoryLoader from '@/components/ProjectMemoryLoader';

const ProjectMemoryPage: React.FC = () => {
    return (
        <ProLayout
            title="Dubai Real Estate - Project Memory"
            logo="🧠"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <div style={{ padding: '24px', background: '#f0f2f5' }}>
                {/* Заголовок и описание */}
                <div style={{ marginBottom: '24px' }}>
                    <Alert
                        message="Загрузка проекта в Memory LLM"
                        description="Эта страница позволяет загрузить всю информацию о проекте Dubai Real Estate в базу знаний Memory LLM. После загрузки AI ассистент получит полный контекст о проекте и сможет отвечать на любые вопросы."
                        type="success"
                        showIcon
                        icon={<BrainOutlined />}
                        style={{ fontSize: '16px' }}
                    />
                </div>

                {/* Статистика памяти */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Всего категорий"
                                value={7}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Всего элементов"
                                value={42}
                                prefix={<DatabaseOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Типы данных"
                                value={5}
                                prefix={<BrainOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Время загрузки"
                                value="~5 мин"
                                prefix={<ClockCircleOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Основной компонент загрузки */}
                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={16}>
                        <ProjectMemoryLoader />
                    </Col>
                    
                    <Col xs={24} lg={8}>
                        {/* Информация о категориях */}
                        <Card 
                            title={
                                <Space>
                                    <FileTextOutlined style={{ color: '#1890ff' }} />
                                    <span>Категории данных</span>
                                </Space>
                            }
                            style={{ marginBottom: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div>
                                    <Tag color="blue" icon={<CheckCircleOutlined />}>
                                        Проект и Архитектура
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        4 элемента - технологический стек, архитектура, интеграции
                                    </div>
                                </div>
                                <div>
                                    <Tag color="green" icon={<CheckCircleOutlined />}>
                                        Недвижимость Dubai
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        6 элементов - районы, цены, характеристики
                                    </div>
                                </div>
                                <div>
                                    <Tag color="purple" icon={<CheckCircleOutlined />}>
                                        Рыночная Аналитика
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        5 элементов - цены, ROI, тренды, факторы роста
                                    </div>
                                </div>
                                <div>
                                    <Tag color="orange" icon={<CheckCircleOutlined />}>
                                        Типы Недвижимости
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        4 элемента - виллы, апартаменты, офисы, участки
                                    </div>
                                </div>
                                <div>
                                    <Tag color="red" icon={<CheckCircleOutlined />}>
                                        Инвестиционные Стратегии
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        4 элемента - долгосрочные, краткосрочные, арендные
                                    </div>
                                </div>
                                <div>
                                    <Tag color="cyan" icon={<CheckCircleOutlined />}>
                                        Правовые Аспекты
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        4 элемента - права иностранцев, налоги, визы
                                    </div>
                                </div>
                                <div>
                                    <Tag color="magenta" icon={<CheckCircleOutlined />}>
                                        Компоненты Системы
                                    </Tag>
                                    <div style={{ marginTop: '4px', fontSize: '12px', color: '#666' }}>
                                        5 элементов - описание всех модулей системы
                                    </div>
                                </div>
                            </Space>
                        </Card>

                        {/* Типы данных */}
                        <Card 
                            title="Типы данных в памяти"
                            style={{ marginBottom: '16px' }}
                        >
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>system:</span>
                                    <Tag color="blue">Постоянные</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>property:</span>
                                    <Tag color="green">Месячные</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>analytics:</span>
                                    <Tag color="purple">Месячные</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>recommendation:</span>
                                    <Tag color="orange">Месячные</Tag>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>user:</span>
                                    <Tag color="red">Недельные</Tag>
                                </div>
                            </Space>
                        </Card>

                        {/* Инструкции */}
                        <Card title="Инструкции по загрузке">
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    1. Убедитесь, что Memory LLM сервис запущен
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    2. Нажмите "Проверить статус" для проверки подключения
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    3. Нажмите "Загрузить весь проект в Memory LLM"
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    4. Дождитесь завершения загрузки (прогресс-бар)
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    5. После загрузки AI ассистент получит полный контекст
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Дополнительная информация */}
                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Card title="Преимущества загрузки проекта в память">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <BrainOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
                                        <h4>Полный контекст</h4>
                                        <p>AI ассистент будет знать все о проекте, архитектуре и недвижимости Dubai</p>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <DatabaseOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
                                        <h4>Быстрые ответы</h4>
                                        <p>Поиск по базе знаний происходит мгновенно с высокой точностью</p>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <FileTextOutlined style={{ fontSize: '48px', color: '#faad14', marginBottom: '16px' }} />
                                        <h4>Структурированные данные</h4>
                                        <p>Информация организована по категориям для лучшего понимания</p>
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

export default ProjectMemoryPage;
