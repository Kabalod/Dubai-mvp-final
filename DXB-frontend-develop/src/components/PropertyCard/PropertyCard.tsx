import React from 'react';
import { Card, Tag, Button, Space, Statistic, Row, Col, Avatar, Tooltip } from 'antd';
import { 
    HomeOutlined, 
    EnvironmentOutlined, 
    DollarOutlined, 
    EyeOutlined, 
    HeartOutlined,
    ShareAltOutlined,
    PhoneOutlined
} from '@ant-design/icons';

export interface PropertyData {
    id: string | number;
    title: string;
    price: number;
    location: string;
    type: 'Villa' | 'Apartment' | 'Office' | 'Land';
    status: 'Active' | 'Sold' | 'Pending' | 'Rented';
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    areaUnit: 'sqm' | 'sqft';
    images: string[];
    views: number;
    inquiries: number;
    featured?: boolean;
    description?: string;
    amenities?: string[];
    agent?: {
        name: string;
        avatar: string;
        phone: string;
        rating: number;
    };
}

interface PropertyCardProps {
    data: PropertyData;
    onView?: (id: string | number) => void;
    onEdit?: (id: string | number) => void;
    onFavorite?: (id: string | number) => void;
    onShare?: (id: string | number) => void;
    onContact?: (id: string | number) => void;
    size?: 'small' | 'default' | 'large';
    showActions?: boolean;
    showStats?: boolean;
    showAgent?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    data,
    onView,
    onEdit,
    onFavorite,
    onShare,
    onContact,
    size = 'default',
    showActions = true,
    showStats = true,
    showAgent = true,
}) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Active': return 'green';
            case 'Sold': return 'red';
            case 'Pending': return 'orange';
            case 'Rented': return 'blue';
            default: return 'default';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Villa': return 'purple';
            case 'Apartment': return 'blue';
            case 'Office': return 'orange';
            case 'Land': return 'green';
            default: return 'default';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'Villa': return '🏠';
            case 'Apartment': return '🏢';
            case 'Office': return '🏢';
            case 'Land': return '🌍';
            default: return '🏠';
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M AED`;
        } else if (price >= 1000) {
            return `${(price / 1000).toFixed(0)}K AED`;
        }
        return `${price.toLocaleString()} AED`;
    };

    const formatArea = (area: number, unit: string) => {
        return `${area.toLocaleString()} ${unit}`;
    };

    const handleView = () => {
        onView?.(data.id);
    };

    const handleEdit = () => {
        onEdit?.(data.id);
    };

    const handleFavorite = () => {
        onFavorite?.(data.id);
    };

    const handleShare = () => {
        onShare?.(data.id);
    };

    const handleContact = () => {
        onContact?.(data.id);
    };

    const cardSize = {
        small: { width: 280, imageHeight: 160 },
        default: { width: 320, imageHeight: 200 },
        large: { width: 400, imageHeight: 250 },
    };

    const { width, imageHeight } = cardSize[size];

    return (
        <Card
            hoverable
            style={{ 
                width, 
                marginBottom: 16,
                borderRadius: 12,
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
            cover={
                <div style={{ position: 'relative' }}>
                    <img
                        alt={data.title}
                        src={data.images[0] || 'https://via.placeholder.com/400x250?text=Property+Image'}
                        style={{ 
                            height: imageHeight, 
                            width: '100%', 
                            objectFit: 'cover' 
                        }}
                    />
                    {data.featured && (
                        <Tag
                            color="gold"
                            style={{
                                position: 'absolute',
                                top: 8,
                                left: 8,
                                margin: 0,
                                fontWeight: 'bold',
                            }}
                        >
                            ⭐ Featured
                        </Tag>
                    )}
                    <Tag
                        color={getStatusColor(data.status)}
                        style={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            margin: 0,
                            fontWeight: 'bold',
                        }}
                    >
                        {data.status}
                    </Tag>
                </div>
            }
            actions={
                showActions ? [
                    <Tooltip title="View Details">
                        <Button 
                            type="text" 
                            icon={<EyeOutlined />} 
                            onClick={handleView}
                        />
                    </Tooltip>,
                    <Tooltip title="Add to Favorites">
                        <Button 
                            type="text" 
                            icon={<HeartOutlined />} 
                            onClick={handleFavorite}
                        />
                    </Tooltip>,
                    <Tooltip title="Share">
                        <Button 
                            type="text" 
                            icon={<ShareAltOutlined />} 
                            onClick={handleShare}
                        />
                    </Tooltip>,
                    <Tooltip title="Contact Agent">
                        <Button 
                            type="text" 
                            icon={<PhoneOutlined />} 
                            onClick={handleContact}
                        />
                    </Tooltip>,
                ] : undefined
            }
        >
            <div style={{ padding: '0 4px' }}>
                {/* Заголовок и тип */}
                <div style={{ marginBottom: 12 }}>
                    <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        marginBottom: 8
                    }}>
                        <Tag color={getTypeColor(data.type)} icon={<span>{getTypeIcon(data.type)}</span>}>
                            {data.type}
                        </Tag>
                        <span style={{ fontSize: '12px', color: '#666' }}>
                            ID: {data.id}
                        </span>
                    </div>
                    <h3 style={{ 
                        margin: 0, 
                        fontSize: size === 'large' ? '18px' : '16px',
                        fontWeight: 'bold',
                        lineHeight: 1.4,
                        color: '#262626'
                    }}>
                        {data.title}
                    </h3>
                </div>

                {/* Локация */}
                <div style={{ marginBottom: 12 }}>
                    <Space>
                        <EnvironmentOutlined style={{ color: '#1890ff' }} />
                        <span style={{ color: '#666', fontSize: '14px' }}>
                            {data.location}
                        </span>
                    </Space>
                </div>

                {/* Цена */}
                <div style={{ marginBottom: 16 }}>
                    <Statistic
                        value={data.price}
                        prefix={<DollarOutlined />}
                        suffix="AED"
                        valueStyle={{ 
                            color: '#1890ff', 
                            fontSize: size === 'large' ? '20px' : '18px',
                            fontWeight: 'bold'
                        }}
                    />
                </div>

                {/* Характеристики */}
                <Row gutter={16} style={{ marginBottom: 16 }}>
                    {data.bedrooms && (
                        <Col span={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                                    {data.bedrooms}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Bedrooms</div>
                            </div>
                        </Col>
                    )}
                    {data.bathrooms && (
                        <Col span={8}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {data.bathrooms}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>Bathrooms</div>
                            </div>
                        </Col>
                    )}
                    <Col span={data.bedrooms ? 8 : 12}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#faad14' }}>
                                {formatArea(data.area, data.areaUnit)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666' }}>Area</div>
                        </div>
                    </Col>
                </Row>

                {/* Статистика */}
                {showStats && (
                    <Row gutter={16} style={{ marginBottom: 16 }}>
                        <Col span={12}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {data.views}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666' }}>Views</div>
                            </div>
                        </Col>
                        <Col span={12}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#faad14' }}>
                                    {data.inquiries}
                                </div>
                                <div style={{ fontSize: '11px', color: '#666' }}>Inquiries</div>
                            </div>
                        </Col>
                    </Row>
                )}

                {/* Агент */}
                {showAgent && data.agent && (
                    <div style={{ 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                                src={data.agent.avatar} 
                                size={32}
                                style={{ marginRight: 8 }}
                            />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                                    {data.agent.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    ⭐ {data.agent.rating}/5
                                </div>
                            </div>
                        </div>
                        <Button 
                            type="primary" 
                            size="small"
                            onClick={handleContact}
                        >
                            Contact
                        </Button>
                    </div>
                )}

                {/* Действия */}
                {showActions && (
                    <div style={{ 
                        borderTop: '1px solid #f0f0f0', 
                        paddingTop: 12,
                        display: 'flex',
                        gap: 8
                    }}>
                        <Button 
                            type="primary" 
                            block 
                            onClick={handleView}
                            size={size === 'small' ? 'small' : 'middle'}
                        >
                            View Details
                        </Button>
                        {onEdit && (
                            <Button 
                                onClick={handleEdit}
                                size={size === 'small' ? 'small' : 'middle'}
                            >
                                Edit
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </Card>
    );
};

export default PropertyCard;
