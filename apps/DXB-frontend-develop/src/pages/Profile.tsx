import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Check, Star, CreditCard, Shield } from 'lucide-react';
import apiService from '@/services/apiService';

// Тарифные планы
const PRICING_PLANS = [
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
    color: 'gray',
    current: false,
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
    color: 'blue',
    current: true,
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 999,
    period: 'month', 
    description: 'Enterprise solution with full API access',
    features: [
      'Everything in Premium',
      'Full API access with high limits',
      'Custom integrations',
      'Dedicated account manager',
      'SLA guarantee',
      '24/7 phone support',
      'Custom reporting',
    ],
    color: 'purple',
    current: false,
  },
];

const Profile: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentLoading, setPaymentLoading] = useState<string>('');
  const [paymentSuccess, setPaymentSuccess] = useState<string>('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const resp = await apiService.getProfile();
        setData(resp || null);
      } catch (e) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleTestPayment = async (planId: string) => {
    setPaymentLoading(planId);
    setPaymentSuccess('');
    
    // Симуляция тестового платежа (без реального Stripe)
    setTimeout(() => {
      setPaymentLoading('');
      setPaymentSuccess(planId);
      
      // Сброс сообщения об успехе через 3 секунды
      setTimeout(() => {
        setPaymentSuccess('');
      }, 3000);
    }, 2000);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'premium': return 'default';
      case 'free': return 'secondary';
      default: return 'secondary';
    }
  };

  const getPlanColor = (color: string) => {
    switch (color) {
      case 'blue': return 'border-blue-200 bg-blue-50';
      case 'purple': return 'border-purple-200 bg-purple-50';
      case 'gray': return 'border-gray-200 bg-gray-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Alert>
          <AlertDescription>
            Unable to load profile data. Please try refreshing the page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
        
        {/* Page Title */}
        <div>
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-gray-600">Manage your account and subscription</p>
        </div>

        {/* Success Message */}
        {paymentSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              ✅ Test payment successful! Plan upgraded to {PRICING_PLANS.find(p => p.id === paymentSuccess)?.name}
            </AlertDescription>
          </Alert>
        )}
        
        {/* User Profile Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {data.email?.substring(0, 2).toUpperCase() || 'JD'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-lg font-semibold">{data.email || 'No email'}</div>
                  <Badge variant={getRoleColor(data.role) as any}>
                    {data.role?.toUpperCase() || 'FREE'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">User ID</p>
                  <p className="font-mono text-xs">{data.id || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Created</p>
                  <p className="text-xs">{data.created_at ? new Date(data.created_at).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <p className="text-xs">{data.is_active ? '✅ Active' : '❌ Inactive'}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Verified</p>
                  <p className="text-xs">{data.is_verified ? '✅ Verified' : '⏳ Pending'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-500" />
                Current Plan
              </CardTitle>
              <CardDescription>Your subscription details</CardDescription>
            </CardHeader>
            <CardContent>
              {data.role === 'free' && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600">
                    🆓 You're on the free plan
                  </p>
                  <Button className="w-full" onClick={() => handleTestPayment('premium')}>
                    {paymentLoading === 'premium' ? 'Processing...' : 'Upgrade to Premium'}
                  </Button>
                </div>
              )}
              
              {data.role === 'premium' && (
                <div className="space-y-3">
                  <p className="text-sm text-center text-green-600">
                    ✅ Premium features active
                  </p>
                  <p className="text-xs text-center text-gray-500">299 AED/month</p>
                  <Button variant="outline" className="w-full">
                    Manage Subscription
                  </Button>
                </div>
              )}
              
              {data.role === 'admin' && (
                <div className="space-y-3">
                  <p className="text-sm text-center text-blue-600">
                    🛡️ Administrator privileges
                  </p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.open('/admin', '_blank')}
                  >
                    Open Admin Panel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pricing Plans */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-purple-500" />
              Available Plans & Test Payment
            </CardTitle>
            <CardDescription>
              Choose a plan that fits your needs. <strong>Test payment mode</strong> - no real charges.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PRICING_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-lg border-2 transition-all hover:shadow-md ${
                    plan.current 
                      ? 'border-blue-500 bg-blue-50' 
                      : getPlanColor(plan.color)
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  {plan.current && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-3xl font-bold">{plan.price === 0 ? 'Free' : `$${plan.price}`}</span>
                      {plan.price > 0 && <span className="text-gray-500">/{plan.period}</span>}
                    </div>
                    <p className="text-sm text-gray-600 mb-6">{plan.description}</p>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="text-center">
                    {plan.current ? (
                      <Button variant="outline" className="w-full" disabled>
                        Current Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        variant={plan.color === 'blue' ? 'default' : 'outline'}
                        onClick={() => handleTestPayment(plan.id)}
                        disabled={paymentLoading === plan.id}
                      >
                        {paymentLoading === plan.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          `Test Upgrade - ${plan.price === 0 ? 'Free' : `$${plan.price}/${plan.period}`}`
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Test Payment Notice */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <Shield className="h-4 w-4" />
                <strong>Test Mode</strong>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                All payments are simulated for testing purposes. No real charges will be made. 
                Stripe integration is not connected in this demo version.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Navigate to other sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                🏠 Home
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/analytics'}>
                📊 Analytics
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/reports'}>
                📋 Reports
              </Button>
              <Button variant="outline" onClick={() => window.location.href = '/payment'}>
                💳 Payments
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
  );
};

export default Profile;