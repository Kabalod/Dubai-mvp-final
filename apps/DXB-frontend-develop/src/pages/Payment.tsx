import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

import { Badge } from '../components/ui/badge';

import { Alert, AlertDescription } from '../components/ui/alert';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

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
    const { user, getToken } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    const [userProfile, setUserProfile] = useState<any>(null);

    // Load user profile on component mount
    useEffect(() => {
        const loadUserProfile = async () => {
            if (user) {
                try {
                    const token = getToken();
                    if (token) {
                        const profile = await api.getUserProfile(token);
                        setUserProfile(profile);
                    }
                } catch (error) {
                    console.error('Failed to load user profile:', error);
                }
            }
        };

        loadUserProfile();
    }, [user, getToken]);



    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        const plan = PAYMENT_PLANS.find(p => p.id === planId);
        
        // Mock plan selection - no real payment
        alert(`📋 Demo Mode: "${plan?.name}" plan selected!\n\nThis is a demonstration of the payment flow.\nNo real payment will be processed.`);
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
                    {plan.price === 0 ? '📋 Demo: Select Free' : `📋 Demo: Select ${plan.name}`}
                </Button>
            </CardContent>
        </Card>
    );



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
                        <div className="space-y-2">
                            <p className="text-lg text-blue-600">
                                Welcome back, {user.first_name || user.username}!
                            </p>
                            {userProfile?.subscription && (
                                <Badge className="bg-green-100 text-green-700">
                                    Current Plan: {userProfile.subscription.plan_name || 'Free'}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Demo Notice */}
                <div className="mb-8">
                    <Alert className="max-w-2xl mx-auto">
                        <AlertDescription className="text-center">
                            <strong>🎯 Demo Payment System</strong><br />
                            This is a demonstration of our pricing plans. No real payments will be processed. 
                            Click any plan to see the demo selection flow.
                        </AlertDescription>
                    </Alert>
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
                                <p className="text-muted-foreground text-left">Yes, this is a demonstration only. No payment processing is implemented. Plan selection shows a demo message.</p>
                            </CardContent>
                        </Card>
                        
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-left">How does the demo work?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground text-left">Simply click any plan to see a demo selection message. This showcases the pricing structure without real payment processing.</p>
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


        </div>
    );
};

export default Payment;