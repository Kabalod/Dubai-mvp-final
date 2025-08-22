import React, { useState, useEffect } from 'react';
import { Card, Form, message, Alert, Spin } from 'antd';
import CustomTabs from '@/components/CustomTabs/CustomTabs';
import CustomInput from '@/components/CustomInput/CustomInput';
import CustomButton from '@/components/CustomButton/CustomButton';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './AuthEnhanced.module.scss';

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
            <div className={styles.loading}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                {/* Header */}
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        🏢 Dubai Platform
                    </h1>
                    <p className={styles.subtitle}>
                        Real Estate Analytics Platform
                    </p>
                </div>

                {/* Auth Card */}
                <Card className={styles.card}>
                    <CustomTabs 
                        activeKey={activeTab} 
                        onChange={(key) => setActiveTab(key as string)}
                        items={[
                            {
                                key: 'login',
                                label: 'Sign In',
                                children: (
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
                                    <CustomInput 
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
                                    <CustomInput.Password 
                                        prefix={<LockOutlined />} 
                                        placeholder="Password"
                                        autoComplete="current-password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <CustomButton type="primary" htmlType="submit" block loading={isLoading}>
                                        Sign In
                                    </CustomButton>
                                </Form.Item>
                            </Form>

                            <div className={styles.linkRow}>
                                <CustomButton type="link" onClick={() => setActiveTab('register')}>
                                    Don't have an account? Sign up
                                </CustomButton>
                            </div>
                                )
                            },
                            {
                                key: 'register',
                                label: 'Sign Up',
                                children: (
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
                                    <CustomInput 
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
                                    <CustomInput 
                                        prefix={<MailOutlined />} 
                                        placeholder="Email"
                                        autoComplete="email"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="first_name"
                                >
                                    <CustomInput 
                                        placeholder="First Name (optional)"
                                        autoComplete="given-name"
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="last_name"
                                >
                                    <CustomInput 
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
                                    <CustomInput.Password 
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
                                    <CustomInput.Password 
                                        prefix={<LockOutlined />} 
                                        placeholder="Confirm Password"
                                        autoComplete="new-password"
                                    />
                                </Form.Item>

                                <Form.Item>
                                    <CustomButton type="primary" htmlType="submit" block loading={isLoading}>
                                        Create Account
                                    </CustomButton>
                                </Form.Item>
                            </Form>
                            <div className={styles.linkRow}>
                                <CustomButton type="link" onClick={() => setActiveTab('login')}>
                                    Already have an account? Sign in
                                </CustomButton>
                            </div>
                                )
                            }
                        ]}
                    />
                </Card>

                {/* Demo Notice */}
                <div className={styles.notice}>
                    <Alert
                        message="MVP Demo"
                        description="This is a demo version. Your data is for testing purposes only."
                        type="info"
                        showIcon
                        className={styles.alert}
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthEnhanced;