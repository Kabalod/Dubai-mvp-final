import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Alert, AlertDescription } from '../components/ui/alert';
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
    // Removed Ant Design form

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
            
            // Show success message (replacing Ant Design message)
            alert(`Payment successful! Welcome to ${plan?.name} plan!`);
            setPaymentModalVisible(false);
            setPaymentData({ cardholderName: '', cardNumber: '', expiryDate: '', cvv: '' });

            // In real implementation, this would update user subscription
            console.log('Payment processed for plan:', selectedPlan, paymentData);

        } catch (error) {
            alert('Payment failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        
        if (planId === 'free') {
            // Free plan - no payment needed
            alert('Free plan activated!');
        } else {
            // Paid plans - show payment modal
            setPaymentModalVisible(true);
        }
    };

    // Payment form state
    const [paymentData, setPaymentData] = useState({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const handleInputChange = (field: string, value: string) => {
        setPaymentData(prev => ({ ...prev, [field]: value }));
    };

    // ========================================
    // Plan Card Component
    // ========================================

    const PlanCard: React.FC<{ plan: typeof PAYMENT_PLANS[0] }> = ({ plan }) => (
        <Card className={`h-full relative rounded-[var(--radius-lg)] transition-all duration-200 hover:shadow-lg ${
            plan.popular ? 'border-2 border-blue-500 shadow-blue-100' : ''
        }`}>
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-3 py-1 bg-blue-500 text-white">
                        ⭐ Most Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-bold" style={{ color: plan.color }}>
                    {plan.name}
                </CardTitle>
                <div className="mb-2">
                    <span className="text-4xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.period}</span>
                </div>
                <CardDescription className="text-center">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <h4 className="font-semibold mb-3 text-green-600">✅ Included:</h4>
                    <ul className="space-y-2">
                        {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <span className="text-green-500 mr-2 mt-1">✓</span>
                                <span className="text-sm">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {plan.limitations.length > 0 && (
                    <div>
                        <h4 className="font-semibold mb-3 text-orange-600">⚠️ Limitations:</h4>
                        <ul className="space-y-2">
                            {plan.limitations.map((limitation, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-orange-500 mr-2">•</span>
                                    <span className="text-sm text-muted-foreground">{limitation}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Button
                    variant={plan.popular ? 'default' : 'outline'}
                    size="lg"
                    className="w-full h-12"
                    onClick={() => handleSelectPlan(plan.id)}
                    style={plan.popular ? { backgroundColor: plan.color, borderColor: plan.color } : {}}
                >
                    {plan.price === 0 ? 'Get Started Free' : 'Choose Plan'}
                </Button>
            </CardContent>
        </Card>
    );

    // ========================================
    // Payment Modal
    // ========================================

    const PaymentModal = () => {
        const plan = PAYMENT_PLANS.find(p => p.id === selectedPlan);

        const handleSubmit = (e: React.FormEvent) => {
            e.preventDefault();
            
            // Basic validation
            if (!paymentData.cardholderName || !paymentData.cardNumber || !paymentData.expiryDate || !paymentData.cvv) {
                alert('Please fill in all fields');
                return;
            }
            
            if (paymentData.cardNumber.length !== 16) {
                alert('Please enter a valid 16-digit card number');
                return;
            }
            
            if (!/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
                alert('Please enter expiry date in MM/YY format');
                return;
            }
            
            if (!/^\d{3,4}$/.test(paymentData.cvv)) {
                alert('Please enter a valid CVV');
                return;
            }
            
            handlePayment(paymentData);
        };

        return (
            <Dialog open={paymentModalVisible} onOpenChange={setPaymentModalVisible}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center">
                            💳 Payment for {plan?.name} Plan
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Complete your subscription
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mb-6 p-4 bg-muted rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold">{plan?.name} Plan</span>
                            <span className="text-2xl font-bold" style={{ color: plan?.color }}>
                                ${plan?.price}/{plan?.period}
                            </span>
                        </div>
                    </div>

                    <Alert className="mb-6">
                        <AlertDescription>
                            <strong>Demo Payment System</strong><br />
                            This is a demo payment system. No real charges will be made. Enter any card details to test the flow.
                        </AlertDescription>
                    </Alert>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Cardholder Name</label>
                            <Input
                                placeholder="John Doe"
                                value={paymentData.cardholderName}
                                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Card Number</label>
                            <Input
                                placeholder="1234 5678 9012 3456"
                                maxLength={16}
                                value={paymentData.cardNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    handleInputChange('cardNumber', value);
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">Expiry Date</label>
                                <Input
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    value={paymentData.expiryDate}
                                    onChange={(e) => {
                                        let value = e.target.value.replace(/\D/g, '');
                                        if (value.length >= 2) {
                                            value = value.substring(0, 2) + '/' + value.substring(2, 4);
                                        }
                                        handleInputChange('expiryDate', value);
                                    }}
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">CVV</label>
                                <Input
                                    placeholder="123"
                                    maxLength={4}
                                    value={paymentData.cvv}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        handleInputChange('cvv', value);
                                    }}
                                />
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full h-12"
                            disabled={processing}
                        >
                            {processing ? 'Processing Payment...' : `💳 Pay $${plan?.price}`}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
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
                    <h1 className="text-5xl font-bold text-foreground mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-muted-foreground mb-2">
                        Unlock the power of Dubai real estate analytics
                    </p>
                    {user && (
                        <p className="text-lg text-blue-600">
                            Welcome back, {user.first_name || user.username}!
                        </p>
                    )}
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mb-16">
                    {PAYMENT_PLANS.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-6">
                        Frequently Asked Questions
                    </h2>
                    <div className="max-w-2xl mx-auto space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-left">Can I change my plan later?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-left">Yes, you can upgrade or downgrade your plan at any time from your account settings.</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-left">Is this a demo payment system?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-left">Yes, this is a demo. No real payments will be processed. Use any test card details.</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-left">What payment methods do you accept?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-left">We accept all major credit cards, PayPal, and bank transfers (demo only).</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Back to Dashboard */}
                <div className="text-center mt-12">
                    <Button 
                        variant="link" 
                        size="lg"
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