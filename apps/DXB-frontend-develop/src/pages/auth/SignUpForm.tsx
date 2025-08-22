import React, { useState } from 'react';
import { ProForm, ProFormText, ProFormCheckbox, ProCard } from '@ant-design/pro-components';
import { message, Steps, Form, Checkbox, Button } from 'antd';
import CustomInput from '@/components/CustomInput/CustomInput';
import CustomButton from '@/components/CustomButton/CustomButton';
import styles from './SignUpForm.module.scss';
import { UserOutlined, MailOutlined, LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
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
    const [otpLength] = useState<number>(6);
    const navigate = useNavigate();

    const handleSignUp = async (values: FieldType) => {
        console.log('=== handleSignUp CALLED ===');
        console.log('Values:', values);
        console.log('Email from values:', values.email);
        
        try {
            setEmail(values.email as string);
            console.log('Email set to state:', values.email);
            
            console.log('About to send request to:', `${API_BASE_URL}/accounts/login/`);
            
            const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({ email: values.email }),
            });
            
            console.log('Response received:', response);
            console.log('Response status:', response.status);
            
            const token = response.headers.get('Authorization')?.split(' ')[1];
            if (token) {
                localStorage.setItem("auth-token", token);
                console.log('Token saved to localStorage');
            }
            
            console.log('Moving to Confirm step');
            setCurrentStep(FormSteps.Confirm);
        } catch (err) {
            console.error('Error in handleSignUp:', err);
        }
    };

    const handleValidation = async (values: FieldType) => {
        try {
            let otpCode = "";
            for (let index = 0; index < otpLength; index++) {
                const key = `otp${index}` as keyof FieldType;
                otpCode += values[key];
            }
            setCurrentStep(FormSteps.Details);
        } catch (err) {
            console.error(err);
        }
    };

    const handelFinishRegister = async (values: any) => {
        console.log('=== handelFinishRegister CALLED ===');
        console.log('Values parameter:', values);
        
        try {
            console.log("Registration data:", values);
            console.log("Email from state:", email);
            
            if (!email) {
                console.log('No email in state, showing error');
                message.error('Email is required. Please go back to email step.');
                return;
            }
            
            console.log('About to send fetch request...');
            
            const response = await fetch(`${API_BASE_URL}/accounts/signup/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({
                    email: email,
                    password1: values.password,
                    password2: values.confirmPassword,
                    name: values.name,
                }),
            });

            console.log('Response received:', response);
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const responseData = await response.json();
                console.log('Registration successful!', responseData);
                message.success('Registration successful!');
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error('Registration failed:', errorData);
                message.error(`Registration failed: ${errorData.error || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Registration error:', error);
            message.error('Registration error. Please try again.');
        }
    };

    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
    };

    const resendCode = () => {
        console.log("resend code");
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
                                >
                                    SIGN UP
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
                                >
                                    CONFIRM
                                </CustomButton>
                            ),
                        }}
                    >
                        <div className={styles.centerBlock}>
                            <CheckCircleOutlined className={styles.bigIcon} />
                            <h3>We have sent the code to {email}</h3>
                            <p className={styles.muted}>Enter the code to complete the registration</p>
                        </div>
                        
                        <Form.Item
                            name="otp"
                            rules={[{ required: true, message: 'Please enter the verification code!' }]}
                        >
                            <CustomInput.OTP 
                                length={otpLength} 
                                size="large"
                                className={styles.otp}
                            />
                        </Form.Item>

                        <div className={styles.centerBlock}>
                            <CustomButton type="link" onClick={resendCode}>
                                Send the code again
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