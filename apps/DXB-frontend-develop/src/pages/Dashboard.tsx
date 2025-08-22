import React from 'react';
import { ProLayout, ProTable, ProCard } from '@ant-design/pro-components';
import { Card, Statistic, Row, Col, Space, Tag } from 'antd';
import { 
    HomeOutlined, 
    BuildOutlined, 
    DollarOutlined, 
    UserOutlined,
    RiseOutlined,
    AreaChartOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/charts';
import dv from '@/styles/dataviz.module.scss';
import CustomButton from '@/components/CustomButton/CustomButton';
import '@/styles/custom-buttons.scss';
import styles from '@/components/Dashboard/Dashboard.module.scss';

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
                <span className={`${dv.bold} ${dv.textBlue}`}>
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
                    <CustomButton variant="link" size="small">View</CustomButton>
                    <CustomButton variant="link" size="small">Edit</CustomButton>
                </Space>
            ),
        },
    ];

    return (
        <ProLayout title="Dubai Real Estate" logo="🏠">
            <div className={styles.container}>
                {/* Статистика */}
                <Row gutter={[16, 16]} className={styles.dashRow}>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className={styles.card}>
                            <Statistic
                                title="Total Properties"
                                value={1128}
                                prefix={<HomeOutlined />}
                                className={`${dv.statistic} ${dv.statGreen}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className={styles.card}>
                            <Statistic
                                title="Active Deals"
                                value={93}
                                prefix={<BuildOutlined />}
                                className={`${dv.statistic} ${dv.statBlue}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className={styles.card}>
                            <Statistic
                                title="Total Value"
                                value={2.8}
                                prefix={<DollarOutlined />}
                                suffix="B AED"
                                className={`${dv.statistic} ${dv.statRed}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card className={styles.card}>
                            <Statistic
                                title="Active Users"
                                value={156}
                                prefix={<UserOutlined />}
                                className={`${dv.statistic} ${dv.statPurple}`}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Графики и AI ассистент */}
                <Row gutter={[16, 16]} className={styles.dashRow}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Market Trends" className={`${dv.sectionCard} ${dv.proCard}`}>
                            <Line {...lineConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="Property Distribution" className={`${dv.sectionCard} ${dv.proCard}`}>
                            <Bar {...barConfig} height={300} />
                        </ProCard>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} className={styles.dashRow}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Deal Status" className={`${dv.sectionCard} ${dv.proCard}`}>
                            <Pie {...pieConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="Quick Actions" className={`${dv.sectionCard} ${dv.proCard}`}>
                            <Space direction="vertical" className={dv.fullWidth}>
                                <CustomButton variant="primary" icon={<RiseOutlined />} block>
                                    Add New Property
                                </CustomButton>
                                <CustomButton variant="secondary" icon={<AreaChartOutlined />} block>
                                    Generate Report
                                </CustomButton>
                                <CustomButton variant="outline" icon={<UserOutlined />} block>
                                    Manage Users
                                </CustomButton>
                            </Space>
                        </ProCard>
                    </Col>
                </Row>

                {/* Recent Properties */}
                <Row gutter={[16, 16]} className={styles.dashRow}>
                    <Col xs={24}>
                        <ProCard title="Recent Properties">
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
                                    <CustomButton key="add" variant="primary">
                                        Add Property
                                    </CustomButton>,
                                ]}
                            />
                        </ProCard>
                    </Col>
                </Row>
            </div>
        </ProLayout>
    );
};

export default Dashboard;
