import React, { useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormCheckbox, ProCard } from '@ant-design/pro-components';
import { message, Steps, Form, Checkbox, Button, Input } from 'antd';
import CustomInput from '@/components/CustomInput/CustomInput';
import CustomButton from '@/components/CustomButton/CustomButton';
import styles from './SignUpForm.module.scss';
import { UserOutlined, MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // ✅ ДОБАВЛЕНО: используем AuthContext
import { API_BASE_URL } from '@/config';

enum FormSteps {
    Join = 'join',
    Confirm = 'confirm',
    Details = 'details',
}

interface FieldType {
    email: string;
    name: string;
    password: string;
    confirmPassword: string;
}

const SignUpForm: React.FC = () => {
    const [currentStep, setCurrentStep] = useState<FormSteps>(FormSteps.Join);
    const [email, setEmail] = useState<string>('');
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [sendingOtp, setSendingOtp] = useState<boolean>(false);
    const [verifyingOtp, setVerifyingOtp] = useState<boolean>(false);
    const [resendCooldown, setResendCooldown] = useState<number>(0);

    // Восстанавливаем email при монтировании (если страница обновлялась)
    useEffect(() => {
        const saved = localStorage.getItem('signup-email');
        if (saved && !email) {
            setEmail(saved);
        }
    }, []); // Намеренно игнорируем email в зависимостях для избежания цикла
    const [otpLength] = useState<number>(6);
    const navigate = useNavigate();

    const handleSignUp = async (values: FieldType) => {
        console.log('=== handleSignUp CALLED ===');
        console.log('Values:', values);
        console.log('Email from values:', values.email);
        
        try {
            setEmail(values.email as string);
            // Сохраняем email, чтобы не потерять на шаге Complete при обновлении страницы
            localStorage.setItem('signup-email', values.email as string);
            console.log('Email set to state:', values.email);
            
            console.log('About to send OTP request to: /api/auth/send-otp/');
            setSendingOtp(true);
            
            const response = await fetch('/api/auth/send-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
            });
            
            console.log('Response received:', response);
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Response data:', data);
            
            if (response.ok) {
                console.log('OTP sent successfully, moving to Confirm step');
                setCurrentStep(FormSteps.Confirm);
                setResendCooldown(60);
            } else {
                console.error('Failed to send OTP:', data.error);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (err) {
            console.error('Error in handleSignUp:', err);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        } finally {
            setSendingOtp(false);
        }
    };

    const handleValidation = async (values: any) => {
        try {
            // OTP код приходит как строка из компонента
            const otpCode = values.otp || "";
            
            console.log('=== handleValidation CALLED ===');
            console.log('OTP Code:', otpCode);
            console.log('Email:', email);
            
            console.log('About to verify OTP: /api/auth/verify-otp/');
            
            setVerifyingOtp(true);
            const response = await fetch('/api/auth/verify-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email,
                    code: otpCode 
                }),
            });
            
            console.log('Verification response:', response);
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('Verification data:', data);
            
            if (response.ok) {
                console.log('OTP verified successfully');
                
                // Сохраняем токены
                if (data.tokens) {
                    localStorage.setItem('accessToken', data.tokens.access);
                    localStorage.setItem('refreshToken', data.tokens.refresh);
                    console.log('Tokens saved to localStorage');
                }
                
                // Переходим к следующему шагу
                setCurrentStep(FormSteps.Details);
            } else {
                console.error('OTP verification failed:', data.error);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (err) {
            console.error('Error in handleValidation:', err);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handelFinishRegister = async (values: any) => {
        console.log('=== handelFinishRegister CALLED ===');
        console.log('Values parameter:', values);
        
        try {
            console.log("Registration data:", values);
            console.log("Email from state:", email);
            
            // Подстраховка: читаем email из localStorage
            const effectiveEmail = email || localStorage.getItem('signup-email') || '';
            if (!effectiveEmail) {
                console.log('No email in state, showing error');
                // ✅ ИСПРАВЛЕНО: убрали message.error
                return;
            }
            
            console.log('About to send fetch request...');
            setSubmitting(true);
            
            const response = await fetch('/api/auth/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: effectiveEmail,
                    password: values.password,
                    username: effectiveEmail, // Используем email как username
                    first_name: values.name.split(' ')[0] || '',
                    last_name: values.name.split(' ').slice(1).join(' ') || '',
                }),
            });

            console.log('Response received:', response);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const responseData = await response.json();
                console.log('Registration successful!', responseData);
                // ✅ ИСПРАВЛЕНО: убрали message.success
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (error) {
            console.error('Registration error:', error);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        } finally {
            setSubmitting(false);
        }
    };

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
    };

    // Тикер кулдауна
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const id = setInterval(() => setResendCooldown((v) => v - 1), 1000);
        return () => clearInterval(id);
    }, [resendCooldown]);

    const resendCode = async () => {
        try {
            if (!email) {
                message.warning('Введите email на первом шаге');
                return;
            }
            if (resendCooldown > 0) {
                return;
            }

            console.log('Resend OTP to:', email);
            const response = await fetch('/api/auth/send-otp/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json().catch(() => ({}));
            if (response.ok) {
                // ✅ ИСПРАВЛЕНО: убрали message.success
                setResendCooldown(60);
            } else {
                console.error('Failed to resend OTP:', data?.error);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (err) {
            console.error('Resend OTP error:', err);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        }
    };

    const steps = [
        {
            title: 'Email',
            icon: <MailOutlined />,
            description: 'Enter your email',
        },
        {
            title: 'Verify',
            icon: <CheckCircleOutlined />,
            description: 'Verify your email',
        },
        {
            title: 'Complete',
            icon: <UserOutlined />,
            description: 'Complete registration',
        },
    ];

    return (
        <div className={styles.pageRoot}>
            <ProCard
                className={styles.card}
                title={
                    <div className={styles.cardTitle}>
                        Welcome!
                    </div>
                }
            >
                <Steps
                    current={Object.values(FormSteps).indexOf(currentStep)}
                    items={steps}
                    className={styles.steps}
                />

                {currentStep === FormSteps.Join && (
                    <ProForm
                        onFinish={handleSignUp}
                        submitter={{
                            render: () => (
                                <CustomButton
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    block
                                    icon={<MailOutlined />}
                                    className={styles.primaryButton}
                                loading={sendingOtp}
                                disabled={sendingOtp}
                                >
                                    {sendingOtp ? 'Sending...' : 'SIGN UP'}
                                </CustomButton>
                            ),
                        }}
                    >
                        <ProFormText
                            name="email"
                            label="Email Address"
                            placeholder="Enter your email address"
                            rules={[
                                { required: true, message: 'Please enter your email!' },
                                { type: 'email', message: 'Please enter a valid email!' }
                            ]}
                            fieldProps={{
                                size: 'large',
                                prefix: <MailOutlined />,
                            }}
                        />
                    </ProForm>
                )}

                {currentStep === FormSteps.Confirm && (
                    <ProForm
                        onFinish={handleValidation}
                        submitter={{
                            render: () => (
                                <CustomButton
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    block
                                    icon={<CheckCircleOutlined />}
                                    className={styles.primaryButton}
                                loading={verifyingOtp}
                                disabled={verifyingOtp}
                                >
                                    {verifyingOtp ? 'Confirming...' : 'CONFIRM'}
                                </CustomButton>
                            ),
                        }}
                    >
                        <div className={styles.centerBlock}>
                            <CheckCircleOutlined className={styles.bigIcon} />
                            <h3>We have sent the code to {email}</h3>
                            <p className={styles.muted}>Enter the code to complete the registration</p>
                        </div>
                        
                        <ProFormText
                            name="otp"
                            label="Verification Code"
                            placeholder="Enter 6-digit code"
                            rules={[
                                { required: true, message: 'Please enter the verification code!' },
                                { len: 6, message: 'Code must be 6 digits!' },
                                { pattern: /^\d{6}$/, message: 'Code must contain only digits!' }
                            ]}
                            fieldProps={{
                                size: 'large',
                                maxLength: 6,
                                style: { textAlign: 'center', fontSize: '18px', letterSpacing: '4px' }
                            }}
                        />

                        <div className={styles.centerBlock}>
                            <CustomButton type="link" onClick={resendCode} disabled={resendCooldown > 0}>
                                {resendCooldown > 0 ? `Send the code again (${resendCooldown}s)` : 'Send the code again'}
                            </CustomButton>
                        </div>
                    </ProForm>
                )}

                {currentStep === FormSteps.Details && (
                    <ProForm
                        onFinish={handelFinishRegister}
                        submitter={{
                            render: () => (
                                <CustomButton
                                    type="primary"
                                    size="large"
                                    htmlType="submit"
                                    loading={submitting}
                                    block
                                    icon={<UserOutlined />}
                                    className={styles.primaryButton}
                                >
                                    CREATE ACCOUNT
                                </CustomButton>
                            ),
                        }}
                    >
                        <ProFormText
                            name="name"
                            label="Full Name"
                            placeholder="Enter your full name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined />,
                            }}
                        />

                        <ProFormText.Password
                            name="password"
                            label="Password"
                            placeholder="Enter your password"
                            rules={[
                                { required: true, message: 'Please enter your password!' },
                                { min: 8, message: 'Password must be at least 8 characters!' }
                            ]}
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined />,
                            }}
                        />

                        <ProFormText.Password
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="Confirm your password"
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
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined />,
                            }}
                        />

                        <ProFormCheckbox
                            name="agreement"
                            rules={[{ required: true, message: 'Please accept the terms!' }]}
                        >
                            I have read the{' '}
                            <a href="/policy" target="_blank">
                                policy agreement
                            </a>
                            {' '}and I consent to the processing of{' '}
                            <a href="/privacy" target="_blank">
                                personal data
                            </a>
                        </ProFormCheckbox>
                    </ProForm>
                )}
            </ProCard>
        </div>
    );
};

export default SignUpForm;