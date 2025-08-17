import React, { useState } from 'react';
import { ProLayout, ProCard, ProTable, ProDescriptions } from '@ant-design/pro-components';
import { Card, Row, Col, Button, Space, Tag, Statistic, Select, DatePicker } from 'antd';
import { 
    BarChartOutlined, 
    LineChartOutlined, 
    PieChartOutlined,
    DownloadOutlined,
    FilterOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie, Column, DualAxes } from '@ant-design/charts';

const { RangePicker } = DatePicker;

// Моковые данные для аналитики
const mockAnalyticsData = [
    { id: 1, property: 'Luxury Villa', location: 'Palm Jumeirah', price: 2500000, views: 156, inquiries: 23, status: 'Active' },
    { id: 2, property: 'Modern Apartment', location: 'Downtown Dubai', price: 850000, views: 89, inquiries: 12, status: 'Sold' },
    { id: 3, property: 'Beach House', location: 'JBR', price: 1800000, views: 234, inquiries: 45, status: 'Active' },
    { id: 4, property: 'City View', location: 'Business Bay', price: 650000, views: 67, inquiries: 8, status: 'Pending' },
    { id: 5, property: 'Garden Villa', location: 'Emirates Hills', price: 3200000, views: 198, inquiries: 34, status: 'Active' },
];

const Analytics: React.FC = () => {
    const [selectedPeriod, setSelectedPeriod] = useState('30d');
    const [selectedLocation, setSelectedLocation] = useState('all');

    // Конфигурация для графиков
    const marketTrendsConfig = {
        data: [
            { month: 'Jan', avgPrice: 1850000, deals: 45, volume: 82.5 },
            { month: 'Feb', avgPrice: 1920000, deals: 52, volume: 98.4 },
            { month: 'Mar', avgPrice: 1880000, deals: 48, volume: 90.2 },
            { month: 'Apr', avgPrice: 1950000, deals: 58, volume: 113.1 },
            { month: 'May', avgPrice: 1980000, deals: 61, volume: 120.8 },
            { month: 'Jun', avgPrice: 2050000, deals: 67, volume: 137.4 },
        ],
        xField: 'month',
        yField: 'avgPrice',
        seriesField: 'metric',
        point: { size: 5, shape: 'diamond' },
        label: { style: { fill: '#aaa' } },
    };

    const propertyTypeDistributionConfig = {
        data: [
            { type: 'Villas', count: 38, percentage: 38 },
            { type: 'Apartments', count: 52, percentage: 52 },
            { type: 'Offices', count: 10, percentage: 10 },
        ],
        xField: 'count',
        yField: 'type',
        seriesField: 'type',
        legend: { position: 'top-left' },
        color: ['#1890ff', '#52c41a', '#faad14'],
    };

    const locationPerformanceConfig = {
        data: [
            { location: 'Palm Jumeirah', avgPrice: 2800000, deals: 23, roi: 8.5 },
            { location: 'Downtown Dubai', avgPrice: 1200000, deals: 45, roi: 6.2 },
            { location: 'JBR', avgPrice: 1800000, deals: 34, roi: 7.8 },
            { location: 'Business Bay', avgPrice: 950000, deals: 28, roi: 5.9 },
            { location: 'Emirates Hills', avgPrice: 3200000, deals: 18, roi: 9.1 },
        ],
        xField: 'location',
        yField: 'avgPrice',
        seriesField: 'location',
        legend: { position: 'top-left' },
    };

    const roiTrendsConfig = {
        data: [
            { month: 'Jan', roi: 6.8, marketGrowth: 2.1 },
            { month: 'Feb', roi: 7.2, marketGrowth: 2.3 },
            { month: 'Mar', roi: 7.1, marketGrowth: 2.0 },
            { month: 'Apr', roi: 7.8, marketGrowth: 2.8 },
            { month: 'May', roi: 8.1, marketGrowth: 3.2 },
            { month: 'Jun', roi: 8.5, marketGrowth: 3.5 },
        ],
        xField: 'month',
        yField: 'roi',
        seriesField: 'metric',
        point: { size: 4, shape: 'circle' },
        smooth: true,
    };

    // Колонки для таблицы аналитики
    const analyticsColumns = [
        {
            title: 'Property',
            dataIndex: 'property',
            key: 'property',
            render: (text: string) => <a style={{ fontWeight: 'bold' }}>{text}</a>,
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
            render: (location: string) => (
                <Tag color="blue">{location}</Tag>
            ),
        },
        {
            title: 'Price (AED)',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => (
                <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {price.toLocaleString()}
                </span>
            ),
            sorter: (a: any, b: any) => a.price - b.price,
        },
        {
            title: 'Views',
            dataIndex: 'views',
            key: 'views',
            render: (views: number) => (
                <span style={{ color: '#52c41a' }}>{views}</span>
            ),
            sorter: (a: any, b: any) => a.views - b.views,
        },
        {
            title: 'Inquiries',
            dataIndex: 'inquiries',
            key: 'inquiries',
            render: (inquiries: number) => (
                <span style={{ color: '#faad14' }}>{inquiries}</span>
            ),
            sorter: (a: any, b: any) => a.inquiries - b.inquiries,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const color = status === 'Active' ? 'green' : status === 'Sold' ? 'red' : 'orange';
                return <Tag color={color}>{status}</Tag>;
            },
            filters: [
                { text: 'Active', value: 'Active' },
                { text: 'Sold', value: 'Sold' },
                { text: 'Pending', value: 'Pending' },
            ],
        },
        {
            title: 'Actions',
            key: 'actions',
            render: () => (
                <Space size="middle">
                    <Button type="link" size="small">View Details</Button>
                    <Button type="link" size="small">Edit</Button>
                </Space>
            ),
        },
    ];

    // Фильтры и действия
    const handlePeriodChange = (value: string) => {
        setSelectedPeriod(value);
        console.log('Period changed to:', value);
    };

    const handleLocationChange = (value: string) => {
        setSelectedLocation(value);
        console.log('Location changed to:', value);
    };

    const handleExport = () => {
        console.log('Exporting analytics data...');
        // Здесь будет логика экспорта
    };

    const handleRefresh = () => {
        console.log('Refreshing analytics data...');
        // Здесь будет логика обновления данных
    };

    return (
        <ProLayout
            title="Dubai Real Estate Analytics"
            logo="📊"
            menuItemRender={(item, dom) => (
                <div style={{ color: '#1890ff' }}>{dom}</div>
            )}
        >
            <div style={{ padding: '24px', background: '#f0f2f5' }}>
                {/* Заголовок и фильтры */}
                <ProCard
                    title="Analytics Dashboard"
                    extra={
                        <Space>
                            <Select
                                defaultValue="30d"
                                style={{ width: 120 }}
                                onChange={handlePeriodChange}
                                options={[
                                    { value: '7d', label: 'Last 7 days' },
                                    { value: '30d', label: 'Last 30 days' },
                                    { value: '90d', label: 'Last 90 days' },
                                    { value: '1y', label: 'Last year' },
                                ]}
                            />
                            <Select
                                defaultValue="all"
                                style={{ width: 150 }}
                                onChange={handleLocationChange}
                                options={[
                                    { value: 'all', label: 'All Locations' },
                                    { value: 'palm', label: 'Palm Jumeirah' },
                                    { value: 'downtown', label: 'Downtown Dubai' },
                                    { value: 'jbr', label: 'JBR' },
                                    { value: 'business-bay', label: 'Business Bay' },
                                ]}
                            />
                            <Button icon={<DownloadOutlined />} onClick={handleExport}>
                                Export
                            </Button>
                            <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                                Refresh
                            </Button>
                        </Space>
                    }
                    style={{ marginBottom: '24px' }}
                >
                    <Row gutter={[16, 16]}>
                        <Col xs={24} sm={12} lg={6}>
                            <Statistic
                                title="Total Properties"
                                value={1128}
                                prefix={<BarChartOutlined />}
                                valueStyle={{ color: '#3f8600' }}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Statistic
                                title="Active Deals"
                                value={93}
                                prefix={<LineChartOutlined />}
                                valueStyle={{ color: '#1890ff' }}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Statistic
                                title="Avg. Price"
                                value={1.85}
                                suffix="M AED"
                                prefix={<PieChartOutlined />}
                                valueStyle={{ color: '#cf1322' }}
                            />
                        </Col>
                        <Col xs={24} sm={12} lg={6}>
                            <Statistic
                                title="ROI %"
                                value={7.8}
                                suffix="%"
                                valueStyle={{ color: '#722ed1' }}
                            />
                        </Col>
                    </Row>
                </ProCard>

                {/* Графики аналитики */}
                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Market Trends" headerStyle={{ background: '#fafafa' }}>
                            <Line {...marketTrendsConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="Property Type Distribution" headerStyle={{ background: '#fafafa' }}>
                            <Bar {...propertyTypeDistributionConfig} height={300} />
                        </ProCard>
                    </Col>
                </Row>

                <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                    <Col xs={24} lg={12}>
                        <ProCard title="Location Performance" headerStyle={{ background: '#fafafa' }}>
                            <Column {...locationPerformanceConfig} height={300} />
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={12}>
                        <ProCard title="ROI Trends vs Market Growth" headerStyle={{ background: '#fafafa' }}>
                            <DualAxes
                                data={[roiTrendsConfig.data, roiTrendsConfig.data]}
                                xField="month"
                                yField={['roi', 'marketGrowth']}
                                geometryOptions={[
                                    { geometry: 'line', smooth: true, point: { size: 4, shape: 'circle' } },
                                    { geometry: 'line', smooth: true, point: { size: 4, shape: 'diamond' } },
                                ]}
                                height={300}
                            />
                        </ProCard>
                    </Col>
                </Row>

                {/* Детальная аналитика */}
                <ProCard title="Property Analytics" headerStyle={{ background: '#fafafa' }}>
                    <ProTable
                        columns={analyticsColumns}
                        dataSource={mockAnalyticsData}
                        search={{
                            labelWidth: 'auto',
                            placeholder: 'Search properties...',
                        }}
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
                        rowKey="id"
                    />
                </ProCard>
            </div>
        </ProLayout>
    );
};

export default Analytics;
