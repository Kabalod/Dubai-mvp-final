import React, { useState, useEffect } from 'react';
import { Card, Tabs, Form, Input, Button, message, Alert, Spin } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { TabPane } = Tabs;

// ========================================
// Enhanced Auth Component with API Integration
// ========================================

const AuthEnhanced: React.FC = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [loginForm] = Form.useForm();
    const [registerForm] = Form.useForm();
    const { login, register, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // ========================================
    // Login Handler
    // ========================================

    const handleLogin = async (values: { username: string; password: string }) => {
        try {
            await login(values.username, values.password);
            message.success('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            message.error(error.message || 'Login failed');
        }
    };

    // ========================================
    // Registration Handler
    // ========================================

    const handleRegister = async (values: {
        username: string;
        email: string;
        password: string;
        password_confirm: string;
        first_name?: string;
        last_name?: string;
    }) => {
        try {
            await register(values);
            message.success('Registration successful!');
            navigate('/dashboard');
        } catch (error: any) {
            message.error(error.message || 'Registration failed');
        }
    };

    // Show loading spinner during auth check
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">
                        🏢 Dubai Platform
                    </h1>
                    <p className="text-gray-600">
                        Real Estate Analytics Platform
                    </p>
                </div>

                {/* Auth Card */}
                <Card 
                    className="shadow-xl border-0"
                    style={{ borderRadius: '12px' }}
                >
                    <Tabs 
                        activeKey={activeTab} 
                        onChange={setActiveTab}
                        centered
                        size="large"
                    >
                        {/* Login Tab */}
                        <TabPane tab="Sign In" key="login">
                            <Form
                                form={loginForm}
                                name="login"
                                onFinish={handleLogin}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Please enter your username!' }
                                    ]}
                                >
                                    <Input 
                                        prefix={<UserOutlined />} 
                                        placeholder="Username"
                                        autoComplete="username"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please enter your password!' }
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined />} 
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        className="w-full h-12"
                                        loading={isLoading}
                                    >
                                        Sign In
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="text-center">
                                <Button 
                                    type="link" 
                                    onClick={() => setActiveTab('register')}
                                >
                                    Don't have an account? Sign up
                                </Button>
                            </div>
                        </TabPane>

                        {/* Register Tab */}
                        <TabPane tab="Sign Up" key="register">
                            <Form
                                form={registerForm}
                                name="register"
                                onFinish={handleRegister}
                                layout="vertical"
                                size="large"
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        { required: true, message: 'Please enter a username!' },
                                        { min: 3, message: 'Username must be at least 3 characters!' }
                                    ]}
                                >
                                    <Input 
                                        prefix={<UserOutlined />} 
                                        placeholder="Username"
                                        autoComplete="username"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Please enter your email!' },
                                        { type: 'email', message: 'Please enter a valid email!' }
                                    ]}
                                >
                                    <Input 
                                        prefix={<MailOutlined />} 
                                        placeholder="Email"
                                        autoComplete="email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="first_name"
                                >
                                    <Input 
                                        placeholder="First Name (optional)"
                                        autoComplete="given-name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="last_name"
                                >
                                    <Input 
                                        placeholder="Last Name (optional)"
                                        autoComplete="family-name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    rules={[
                                        { required: true, message: 'Please enter a password!' },
                                        { min: 8, message: 'Password must be at least 8 characters!' }
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined />} 
                                        placeholder="Password"
                                        autoComplete="new-password"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password_confirm"
                                    dependencies={['password']}
                                    rules={[
                                        { required: true, message: 'Please confirm your password!' },
                                        ({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Passwords do not match!'));
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password 
                                        prefix={<LockOutlined />} 
                                        placeholder="Confirm Password"
                                        autoComplete="new-password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        className="w-full h-12"
                                        loading={isLoading}
                                    >
                                        Create Account
                                    </Button>
                                </Form.Item>
                            </Form>

                            <div className="text-center">
                                <Button 
                                    type="link" 
                                    onClick={() => setActiveTab('login')}
                                >
                                    Already have an account? Sign in
                                </Button>
                            </div>
                        </TabPane>
                    </Tabs>
                </Card>

                {/* Demo Notice */}
                <div className="mt-6">
                    <Alert
                        message="MVP Demo"
                        description="This is a demo version. Your data is for testing purposes only."
                        type="info"
                        showIcon
                        className="text-center"
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthEnhanced;