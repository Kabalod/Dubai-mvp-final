import React, { useState, useEffect } from 'react';
import { ProLayout, ProCard, ProTable } from '@ant-design/pro-components';
import { Card, Statistic, Row, Col, Button, Space, Tag, message, Spin, Alert } from 'antd';
import { 
    HomeOutlined, 
    BuildOutlined, 
    DollarOutlined, 
    UserOutlined,
    RiseOutlined,
    AreaChartOutlined,
    ReloadOutlined
} from '@ant-design/icons';
import { Line, Bar, Pie } from '@ant-design/charts';
import dv from '@/styles/dataviz.module.scss';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Analytics, Property } from '../services/apiService';

// ========================================
// Dashboard Component with Real Data
// ========================================

const DashboardEnhanced: React.FC = () => {
    const { user, logout } = useAuth();
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ========================================
    // Data Fetching
    // ========================================

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch analytics and recent properties in parallel
            const [analyticsResponse, propertiesResponse] = await Promise.all([
                apiService.getAnalytics(),
                apiService.getProperties({ limit: 20 })
            ]);

            setAnalytics(analyticsResponse);
            setProperties(propertiesResponse.results || []);

        } catch (err: any) {
            console.error('Dashboard data fetch error:', err);
            setError(err.message || 'Failed to load dashboard data');
            message.error('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // ========================================
    // Chart Configurations with Real Data
    // ========================================

    const getChartConfigs = () => {
        if (!analytics) return { lineConfig: null, barConfig: null, pieConfig: null };

        // Properties by type for bar chart
        const typeData = Object.entries(analytics.properties_by_type || {}).map(([type, count]) => ({
            type,
            value: count
        }));

        // Properties by bedrooms for pie chart
        const bedroomsData = Object.entries(analytics.properties_by_bedrooms || {}).map(([bedrooms, count]) => ({
            type: bedrooms,
            value: count
        }));

        // Mock trend data for line chart (in real app, this would come from API)
        const trendData = [
            { month: 'Jan', value: Math.floor(analytics.total_properties * 0.1) },
            { month: 'Feb', value: Math.floor(analytics.total_properties * 0.15) },
            { month: 'Mar', value: Math.floor(analytics.total_properties * 0.2) },
            { month: 'Apr', value: Math.floor(analytics.total_properties * 0.25) },
            { month: 'May', value: Math.floor(analytics.total_properties * 0.35) },
            { month: 'Jun', value: analytics.total_properties },
        ];

        return {
            lineConfig: {
                data: trendData,
                xField: 'month',
                yField: 'value',
                point: { size: 5, shape: 'diamond' },
                label: { style: { fill: '#aaa' } },
                smooth: true,
            },
            barConfig: {
                data: typeData.slice(0, 10), // Top 10 types
                xField: 'value',
                yField: 'type',
                seriesField: 'type',
                legend: { position: 'top-left' },
            },
            pieConfig: {
                data: bedroomsData.slice(0, 6), // Top 6 bedroom types
                angleField: 'value',
                colorField: 'type',
                radius: 0.8,
                label: {
                    type: 'spider',
                    labelHeight: 28,
                    content: '{name}\n{percentage}',
                },
                interactions: [{ type: 'element-active' }],
            }
        };
    };

    const { lineConfig, barConfig, pieConfig } = getChartConfigs();

    // ========================================
    // Properties Table Configuration
    // ========================================

    const propertyColumns = [
        {
            title: 'Property',
            dataIndex: 'title',
            key: 'title',
            render: (title: string, record: Property) => (
                <div>
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-gray-500">{record.display_address}</div>
                </div>
            ),
        },
        {
            title: 'Type',
            dataIndex: 'listing_type',
            key: 'listing_type',
            render: (type: string) => (
                <Tag color={type === 'sale' ? 'blue' : 'green'}>
                    {type.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number, record: Property) => (
                <div className="font-bold text-green-600">
                    {new Intl.NumberFormat('en-AE', {
                        style: 'currency',
                        currency: record.price_currency || 'AED'
                    }).format(price)}
                </div>
            ),
        },
        {
            title: 'Bedrooms',
            dataIndex: 'bedrooms',
            key: 'bedrooms',
            render: (bedrooms: string) => bedrooms || 'N/A',
        },
        {
            title: 'Property Type',
            dataIndex: 'property_type',
            key: 'property_type',
        },
        {
            title: 'Verified',
            dataIndex: 'verified',
            key: 'verified',
            render: (verified: boolean) => (
                <Tag color={verified ? 'green' : 'orange'}>
                    {verified ? 'Verified' : 'Unverified'}
                </Tag>
            ),
        },
    ];

    // ========================================
    // Error State
    // ========================================

    if (error && !loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full">
                    <Alert
                        message="Dashboard Error"
                        description={error}
                        type="error"
                        showIcon
                        action={
                            <Button size="small" onClick={fetchDashboardData}>
                                Retry
                            </Button>
                        }
                    />
                </div>
            </div>
        );
    }

    // ========================================
    // Loading State
    // ========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    // ========================================
    // Main Dashboard Render
    // ========================================

    return (
        <ProLayout
            title="Dubai Real Estate Analytics"
            logo={<HomeOutlined />}
            layout="mix"
            fixSiderbar
            navTheme="light"
            headerTheme="light"
            contentWidth="Fluid"
            rightContentRender={() => (
                <Space>
                    <span>Welcome, {user?.first_name || user?.username}</span>
                    <Button onClick={logout} type="primary" danger>
                        Logout
                    </Button>
                </Space>
            )}
            menuItemRender={(item, dom) => <div>{dom}</div>}
        >
            <div className="p-6">
                {/* Header with refresh button */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Real Estate Dashboard
                    </h1>
                    <Button 
                        icon={<ReloadOutlined />} 
                        onClick={fetchDashboardData}
                        loading={loading}
                    >
                        Refresh Data
                    </Button>
                </div>

                {/* Statistics Cards */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Total Properties"
                                value={analytics?.total_properties || 0}
                                prefix={<HomeOutlined />}
                                className={`${dv.statistic} ${dv.statGreen}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="For Sale"
                                value={analytics?.total_sale_properties || 0}
                                prefix={<DollarOutlined />}
                                className={`${dv.statistic} ${dv.statBlue}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="For Rent"
                                value={analytics?.total_rent_properties || 0}
                                prefix={<BuildOutlined />}
                                className={`${dv.statistic} ${dv.statPurple}`}
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={6}>
                        <Card>
                            <Statistic
                                title="Areas"
                                value={analytics?.total_areas || 0}
                                prefix={<AreaChartOutlined />}
                                className={`${dv.statistic} ${dv.statOrange}`}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Average Prices */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} lg={12}>
                        <Card title="Average Sale Price">
                            <Statistic
                                value={analytics?.avg_sale_price || 0}
                                precision={0}
                                valueStyle={{ color: '#3f8600' }}
                                suffix="AED"
                            />
                        </Card>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Card title="Average Rent Price">
                            <Statistic
                                value={analytics?.avg_rent_price || 0}
                                precision={0}
                                valueStyle={{ color: '#722ed1' }}
                                suffix="AED"
                            />
                        </Card>
                    </Col>
                </Row>

                {/* Charts */}
                <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={24} lg={8}>
                        <ProCard title="Property Trends" bordered className={`${dv.sectionCard} ${dv.proCard}`}>
                            {lineConfig && <Line {...lineConfig} height={250} />}
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={8}>
                        <ProCard title="Properties by Type" bordered className={`${dv.sectionCard} ${dv.proCard}`}>
                            {barConfig && <Bar {...barConfig} height={250} />}
                        </ProCard>
                    </Col>
                    <Col xs={24} lg={8}>
                        <ProCard title="Properties by Bedrooms" bordered className={`${dv.sectionCard} ${dv.proCard}`}>
                            {pieConfig && <Pie {...pieConfig} height={250} />}
                        </ProCard>
                    </Col>
                </Row>

                {/* Recent Properties Table */}
                <ProCard title="Recent Properties" bordered className={`${dv.sectionCard} ${dv.proCard}`}>
                    <ProTable
                        columns={propertyColumns}
                        dataSource={properties}
                        rowKey="id"
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: false,
                        }}
                        search={false}
                        options={{
                            reload: fetchDashboardData,
                        }}
                        toolBarRender={() => [
                            <Button key="refresh" onClick={fetchDashboardData}>
                                Refresh Properties
                            </Button>,
                        ]}
                    />
                </ProCard>
            </div>
        </ProLayout>
    );
};

export default DashboardEnhanced;