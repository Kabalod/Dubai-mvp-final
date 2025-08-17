import React from 'react';
import { ProLayout, ProTable, ProCard, ProDescriptions } from '@ant-design/pro-components';
import { Card, Statistic, Row, Col, Button, Space, Tag } from 'antd';
import { 
    HomeOutlined, 
    BuildOutlined, 
    DollarOutlined, 
    UserOutlined,
    RiseOutlined,
    AreaChartOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/charts';
import DashboardAssistant from '@/components/AIAssistant/DashboardAssistant';
import { DashboardLoader } from '@/components/ProjectMemoryLoader';

// Моковые данные для демонстрации
const mockProperties = [
    { id: 1, name: 'Luxury Villa', price: 2500000, location: 'Palm Jumeirah', status: 'Active', type: 'Villa' },
    { id: 2, name: 'Modern Apartment', price: 850000, location: 'Downtown Dubai', status: 'Sold', type: 'Apartment' },
    { id: 3, name: 'Beach House', price: 1800000, location: 'JBR', status: 'Active', type: 'Villa' },
    { id: 4, name: 'City View', price: 650000, location: 'Business Bay', status: 'Pending', type: 'Apartment' },
];

const Dashboard: React.FC = () => {
    // Конфигурация для графиков
    const lineConfig = {
        data: [
            { month: 'Jan', value: 3 },
            { month: 'Feb', value: 4 },
            { month: 'Mar', value: 3.5 },
            { month: 'Apr', value: 5 },
            { month: 'May', value: 4.9 },
            { month: 'Jun', value: 6 },
        ],
        xField: 'month',
        yField: 'value',
        point: { size: 5, shape: 'diamond' },
        label: { style: { fill: '#aaa' } },
    };

    const barConfig = {
        data: [
            { type: 'Villas', value: 38 },
            { type: 'Apartments', value: 52 },
            { type: 'Offices', value: 10 },
        ],
        xField: 'value',
        yField: 'type',
        seriesField: 'type',
        legend: { position: 'top-left' },
    };

    const pieConfig = {
        data: [
            { type: 'Active', value: 27 },
            { type: 'Sold', value: 25 },
            { type: 'Pending', value: 18 },
        ],
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: { type: 'outer' },
    };

    // Колонки для таблицы
    const columns = [
        {
            title: 'Property Name',
            dataIndex: 'name',
            key: 'name',
            render: (dom: any, entity: any) => <a>{entity.name}</a>,
        },
        {
            title: 'Price (AED)',
            dataIndex: 'price',
            key: 'price',
            render: (dom: any, entity: any) => (
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {entity.price.toLocaleString()}
                </span>
            ),
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            render: (dom: any, entity: any) => (
                <Tag color={entity.type === 'Villa' ? 'green' : 'blue'}>{entity.type}</Tag>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (dom: any, entity: any) => {
                const color = entity.status === 'Active' ? 'green' : entity.status === 'Sold' ? 'red' : 'orange';
                return <Tag color={color}>{entity.status}</Tag>;
            },
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space size="middle">
                    <Button type="link" size="small">View</Button>
                    <Button type="link" size="small">Edit</Button>
                </Space>
            ),
        },
    ];

    return (
        <ProLayout
            title="Dubai Real Estate"
            logo="🏠"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <div style={{ padding: '24px', background: '#f0f2f5' }}>
                {/* Статистика */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Properties"
                                value={1128}
                                prefix={<HomeOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Active Deals"
                                value={93}
                                prefix={<BuildOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Value"
                                value={2.8}
                                prefix={<DollarOutlined />}
                                suffix="B AED"
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Active Users"
                                value={156}
                                prefix={<UserOutlined />}
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Графики и AI ассистент */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Market Trends" headStyle={{ background: '#fafafa' }}>
                            <Line {...lineConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="Property Distribution" headStyle={{ background: '#fafafa' }}>
                            <Bar {...barConfig} height={300} />
                        </ProCard>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Deal Status" headStyle={{ background: '#fafafa' }}>
                            <Pie {...pieConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="Quick Actions" headStyle={{ background: '#fafafa' }}>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button type="primary" icon={<RiseOutlined />} block>
                                    Add New Property
                                </Button>
                                <Button icon={<AreaChartOutlined />} block>
                                    Generate Report
                                </Button>
                                <Button icon={<UserOutlined />} block>
                                    Manage Users
                                </Button>
                            </Space>
                        </ProCard>
                    </Col>
                </Row>

                {/* Project Memory и AI ассистент */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Recent Properties" headStyle={{ background: '#fafafa' }}>
                            <ProTable
                                columns={columns}
                                dataSource={mockProperties}
                                search={false}
                                pagination={{
                                    pageSize: 10,
                                    showSizeChanger: true,
                                    showQuickJumper: true,
                                }}
                                toolBarRender={() => [
                                    <Button key="add" type="primary">
                                        Add Property
                                    </Button>,
                                ]}
                            />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={6}>
                        <DashboardLoader 
                            compact={true}
                            onMemoryLoaded={(count) => {
                                console.log(`Project memory loaded: ${count} items`);
                            }}
                        />
                    </Col>
                    <Col xs={24} lg={6}>
                        <DashboardAssistant 
                            compact={true}
                            onMemoryAdd={(memory) => {
                                console.log('New memory added:', memory);
                            }}
                        />
                    </Col>
                </Row>
            </div>
        </ProLayout>
    );
};

export default Dashboard;
