import React, { useState } from 'react';
import { Card, Button, Row, Col, message, Modal, Form, Input, Radio, Tag } from 'antd';
import { 
    CrownOutlined, 
    CheckOutlined, 
    DollarOutlined,
    CreditCardOutlined,
    StarOutlined
} from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';

// ========================================
// Payment Plans Configuration
// ========================================

const PAYMENT_PLANS = [
    {
        id: 'free',
        name: 'Free',
        price: 0,
        period: 'month',
        description: 'Basic access to property data',
        features: [
            'View up to 50 properties per day',
            'Basic search and filters',
            'Public analytics dashboard',
            'Email support',
        ],
        limitations: [
            'Limited property details',
            'No export functionality',
            'Basic support only',
        ],
        color: '#52c41a',
        popular: false,
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 299,
        period: 'month',
        description: 'Full access with advanced features',
        features: [
            'Unlimited property access',
            'Advanced search and analytics',
            'Export to CSV/Excel',
            'Real-time market insights',
            'Premium dashboard with charts',
            'Priority email & chat support',
            'API access (limited)',
        ],
        limitations: [],
        color: '#1890ff',
        popular: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 999,
        period: 'month',
        description: 'Complete solution for businesses',
        features: [
            'Everything in Premium',
            'Unlimited API access',
            'Custom integrations',
            'White-label options',
            'Dedicated account manager',
            '24/7 phone support',
            'Custom reports and analytics',
            'Multi-user team access',
        ],
        limitations: [],
        color: '#722ed1',
        popular: false,
    },
];

// ========================================
// Payment Component
// ========================================

const Payment: React.FC = () => {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [paymentModalVisible, setPaymentModalVisible] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [form] = Form.useForm();

    // ========================================
    // Payment Handler (Stub)
    // ========================================

    const handlePayment = async (paymentData: any) => {
        setProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Mock payment success
            const plan = PAYMENT_PLANS.find(p => p.id === selectedPlan);
            
            message.success(`Payment successful! Welcome to ${plan?.name} plan!`);
            setPaymentModalVisible(false);
            form.resetFields();

            // In real implementation, this would update user subscription
            console.log('Payment processed for plan:', selectedPlan, paymentData);

        } catch (error) {
            message.error('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        
        if (planId === 'free') {
            // Free plan - no payment needed
            message.success('Free plan activated!');
        } else {
            // Paid plans - show payment modal
            setPaymentModalVisible(true);
        }
    };

    // ========================================
    // Plan Card Component
    // ========================================

    const PlanCard: React.FC<{ plan: typeof PAYMENT_PLANS[0] }> = ({ plan }) => (
        <Card
            className={`h-full relative ${plan.popular ? 'border-2 border-blue-500' : ''}`}
            style={{
                borderRadius: '12px',
                transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            bodyStyle={{ padding: '24px' }}
            hoverable
        >
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Tag color="blue" className="px-3 py-1">
                        <StarOutlined /> Most Popular
                    </Tag>
                </div>
            )}

            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2" style={{ color: plan.color }}>
                    {plan.name}
                </h3>
                <div className="mb-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                </div>
                <p className="text-gray-600">{plan.description}</p>
            </div>

            <div className="mb-6">
                <h4 className="font-semibold mb-3 text-green-600">✅ Included:</h4>
                <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckOutlined className="text-green-500 mr-2 mt-1" />
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {plan.limitations.length > 0 && (
                <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-orange-600">⚠️ Limitations:</h4>
                    <ul className="space-y-2">
                        {plan.limitations.map((limitation, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-orange-500 mr-2">•</span>
                                <span className="text-sm text-gray-600">{limitation}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Button
                type={plan.popular ? 'primary' : 'default'}
                size="large"
                className="w-full h-12"
                onClick={() => handleSelectPlan(plan.id)}
                style={plan.popular ? { background: plan.color, borderColor: plan.color } : {}}
            >
                {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
            </Button>
        </Card>
    );

    // ========================================
    // Payment Modal
    // ========================================

    const PaymentModal = () => {
        const plan = PAYMENT_PLANS.find(p => p.id === selectedPlan);

        return (
            <Modal
                title={
                    <div className="text-center">
                        <CreditCardOutlined className="mr-2" />
                        Payment for {plan?.name} Plan
                    </div>
                }
                open={paymentModalVisible}
                onCancel={() => setPaymentModalVisible(false)}
                footer={null}
                width={600}
                centered
            >
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">{plan?.name} Plan</span>
                        <span className="text-2xl font-bold" style={{ color: plan?.color }}>
                            ${plan?.price}/{plan?.period}
                        </span>
                    </div>
                </div>

                <Alert
                    message="Demo Payment System"
                    description="This is a demo payment system. No real charges will be made. Enter any card details to test the flow."
                    type="info"
                    showIcon
                    className="mb-6"
                />

                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handlePayment}
                    size="large"
                >
                    <Form.Item
                        label="Cardholder Name"
                        name="cardholderName"
                        rules={[{ required: true, message: 'Please enter cardholder name!' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        label="Card Number"
                        name="cardNumber"
                        rules={[
                            { required: true, message: 'Please enter card number!' },
                            { pattern: /^\d{16}$/, message: 'Please enter a valid 16-digit card number!' }
                        ]}
                    >
                        <Input 
                            placeholder="1234 5678 9012 3456" 
                            maxLength={16}
                            onChange={(e) => {
                                // Auto-format card number
                                const value = e.target.value.replace(/\D/g, '');
                                form.setFieldsValue({ cardNumber: value });
                            }}
                        />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                label="Expiry Date"
                                name="expiryDate"
                                rules={[
                                    { required: true, message: 'Please enter expiry date!' },
                                    { pattern: /^\d{2}\/\d{2}$/, message: 'Format: MM/YY' }
                                ]}
                            >
                                <Input 
                                    placeholder="MM/YY" 
                                    maxLength={5}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                        }
                                        form.setFieldsValue({ expiryDate: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                label="CVV"
                                name="cvv"
                                rules={[
                                    { required: true, message: 'Please enter CVV!' },
                                    { pattern: /^\d{3,4}$/, message: 'Please enter valid CVV!' }
                                ]}
                            >
                                <Input 
                                    placeholder="123" 
                                    maxLength={4}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        form.setFieldsValue({ cvv: value });
                                    }}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="w-full h-12"
                            loading={processing}
                            icon={<CreditCardOutlined />}
                        >
                            {processing ? 'Processing Payment...' : `Pay $${plan?.price}`}
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    // ========================================
    // Main Render
    // ========================================

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600 mb-2">
                        Unlock the power of Dubai real estate analytics
                    </p>
                    {user && (
                        <p className="text-lg text-blue-600">
                            Welcome back, {user.first_name || user.username}!
                        </p>
                    )}
                </div>

                {/* Pricing Cards */}
                <Row gutter={[24, 24]} justify="center">
                    {PAYMENT_PLANS.map((plan) => (
                        <Col xs={24} md={8} key={plan.id}>
                            <PlanCard plan={plan} />
                        </Col>
                    ))}
                </Row>

                {/* FAQ Section */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-2xl mx-auto">
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                            <h3 className="font-semibold mb-2">Can I change my plan later?</h3>
                            <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
                            <h3 className="font-semibold mb-2">Is this a demo payment system?</h3>
                            <p className="text-gray-600">Yes, this is a demo. No real payments will be processed. Use any test card details.</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                            <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers (demo only).</p>
                        </div>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="text-center mt-12">
                    <Button 
                        type="link" 
                        size="large"
                        onClick={() => window.location.href = '/dashboard'}
                    >
                        ← Back to Dashboard
                    </Button>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal />
        </div>
    );
};

export default Payment;