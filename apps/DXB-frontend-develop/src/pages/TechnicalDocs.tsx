import React from 'react';
import { ProLayout } from '@ant-design/pro-components';
import { Row, Col, Card, Statistic, Space, Tag, Alert, Typography } from 'antd';
import { 
    CodeOutlined, 
    DatabaseOutlined, 
    FileTextOutlined,
    BookOutlined,
    ApiOutlined,
    ToolOutlined
} from '@ant-design/icons';
import TechnicalDocumentationLoader from '@/components/TechnicalDocumentationLoader';
import styles from './TechnicalDocs.module.scss';
const { Text } = Typography;

const TechnicalDocsPage: React.FC = () => {
    return (
        <ProLayout
            title="Technical Documentation"
            logo="📚"
            menuItemRender={(item, dom) => (
                <div className={styles.menuItem}>{dom}</div>
            )}
        >
            <div className={styles.root}>
                {/* Информационный блок */}
                <Alert
                    message="Technical Documentation Management"
                    description="This page allows you to load all technical documentation about the project architecture, components, services, and development patterns into the Memory LLM system. This creates an intelligent knowledge base for development assistance."
                    type="info"
                    showIcon
                    className={styles.mb24}
                />

                {/* Статистика документации */}
                <Row gutter={[16, 16]} className={styles.mb24}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Files"
                                value={45}
                                prefix={<FileTextOutlined />}
                                valueStyle={{ color: 'var(--color-success-deep)' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Components"
                                value={18}
                                prefix={<CodeOutlined />}
                                valueStyle={{ color: 'var(--color-blue)' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Services"
                                value={8}
                                prefix={<ApiOutlined />}
                                valueStyle={{ color: 'var(--color-red)' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Utilities"
                                value={12}
                                prefix={<ToolOutlined />}
                                valueStyle={{ color: 'var(--color-purple)' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Основной загрузчик документации */}
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <TechnicalDocumentationLoader />
                    </Col>
                </Row>

                {/* Информация о типах документации */}
                <Row gutter={[16, 16]} className={styles.mb24}>
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <CodeOutlined className={styles.iconBlue} />
                                    <span>Component Documentation</span>
                                </Space>
                            }
                        >
                            <Space direction="vertical" className={styles.w100}>
                                <div>
                                    <Tag color="blue">Props</Tag>
                                    <Text>Component properties and their types</Text>
                                </div>
                                <div>
                                    <Tag color="green">Methods</Tag>
                                    <Text>Internal component methods</Text>
                                </div>
                                <div>
                                    <Tag color="purple">Events</Tag>
                                    <Text>Component event handlers</Text>
                                </div>
                                <div>
                                    <Tag color="orange">Styling</Tag>
                                    <Text>CSS classes and styling patterns</Text>
                                </div>
                                <div>
                                    <Tag color="red">Dependencies</Tag>
                                    <Text>External libraries and imports</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                    
                    <Col xs={24} lg={12}>
                        <Card 
                            title={
                                <Space>
                                    <ApiOutlined className={styles.iconGreen} />
                                    <span>Service Documentation</span>
                                </Space>
                            }
                        >
                            <Space direction="vertical" className={styles.w100}>
                                <div>
                                    <Tag color="blue">API Endpoints</Tag>
                                    <Text>Backend API connections</Text>
                                </div>
                                <div>
                                    <Tag color="green">Data Models</Tag>
                                    <Text>TypeScript interfaces and types</Text>
                                </div>
                                <div>
                                    <Tag color="purple">Error Handling</Tag>
                                    <Text>Error management patterns</Text>
                                </div>
                                <div>
                                    <Tag color="orange">Methods</Tag>
                                    <Text>Service function signatures</Text>
                                </div>
                                <div>
                                    <Tag color="red">Dependencies</Tag>
                                    <Text>External service dependencies</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Архитектурная информация */}
                <Row gutter={[16, 16]} className={styles.mb24}>
                    <Col span={24}>
                        <Card title="Project Architecture Overview">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} md={8}>
                                    <div className={styles.p16}>
                                        <CodeOutlined className={styles.iconBlue} style={{ fontSize: '48px', marginBottom: '16px' }} />
                                        <h4>Frontend</h4>
                                        <p>React 18 + TypeScript + Ant Design Pro</p>
                                        <Tag color="blue">Vite</Tag>
                                        <Tag color="green">React Router</Tag>
                                        <Tag color="purple">React Query</Tag>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className={styles.p16}>
                                        <DatabaseOutlined className={styles.iconGreen} style={{ fontSize: '48px', marginBottom: '16px' }} />
                                        <h4>Backend</h4>
                                        <p>Django + PostgreSQL + Memory LLM</p>
                                        <Tag color="blue">Django REST</Tag>
                                        <Tag color="green">PostgreSQL</Tag>
                                        <Tag color="purple">pgvector</Tag>
                                    </div>
                                </Col>
                                <Col xs={24} md={8}>
                                    <div className={styles.p16}>
                                        <ToolOutlined className={styles.iconGold} style={{ fontSize: '48px', marginBottom: '16px' }} />
                                        <h4>Development</h4>
                                        <p>AI-powered development tools</p>
                                        <Tag color="blue">Cursor AI</Tag>
                                        <Tag color="green">Memory LLM</Tag>
                                        <Tag color="purple">Ant Design Pro</Tag>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Преимущества использования */}
                <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
                    <Col span={24}>
                        <Card title="Benefits of Technical Documentation in Memory LLM">
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12} lg={6}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <BookOutlined style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                                        <h5>Knowledge Base</h5>
                                        <p>Centralized technical knowledge</p>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <CodeOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                                        <h5>Development Speed</h5>
                                        <p>Faster component development</p>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <ApiOutlined style={{ fontSize: '32px', color: '#faad14', marginBottom: '8px' }} />
                                        <h5>API Understanding</h5>
                                        <p>Better service integration</p>
                                    </div>
                                </Col>
                                <Col xs={24} sm={12} lg={6}>
                                    <div style={{ textAlign: 'center', padding: '16px' }}>
                                        <ToolOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }} />
                                        <h5>AI Assistance</h5>
                                        <p>Intelligent development help</p>
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

export default TechnicalDocsPage;
