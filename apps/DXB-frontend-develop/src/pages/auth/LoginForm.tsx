import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styles from "./Auth.module.scss";
import { t } from "@lingui/macro";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "@/config";

type LoginFormType = {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};
enum Steps {
    Login = 0,
    Recover = 1,
    Confirm = 2,
    Reset = 3,
    Success = 4,
}

const LoginForm: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(Steps.Login);

    const [email, setEmail] = useState("");
    const [timeToResend, setTimeToResend] = useState(45);

    const onFinish = async (values: any) => {
        try {
            console.log("Login attempt with:", values);
            
            // Отправляем данные на Django бэкенд
            const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                }),
            });

            if (response.ok) {
                console.log('Login successful!');
                // Перенаправляем на Dashboard после успешного входа
                navigate("/");
            } else {
                const errorData = await response.json();
                console.error('Login failed:', errorData);
                // Показываем ошибку пользователю
                message.error('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            message.error('Login error. Please try again.');
        }
    };

    // Функция для получения CSRF токена
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
        return '';
    };

    const handleForgotPassword = () => {
        setCurrentStep(Steps.Recover);
    };

    const handleRecovery = async (values: LoginFormType) => {
        try {
            setEmail(values.email!);
            
            // Отправляем запрос на сброс пароля
            const response = await fetch(`${API_BASE_URL}/accounts/password/reset/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({
                    email: values.email,
                }),
            });

            if (response.ok) {
                console.log('Password reset email sent');
                message.success('Password reset email sent!');
                setCurrentStep(Steps.Confirm);
            } else {
                const errorData = await response.json();
                console.error('Password reset failed:', errorData);
                message.error('Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            message.error('Password reset error. Please try again.');
        }
    };

    const handleResend = () => {
        console.log("email resent");
    };

    const handleReset = async (values: any) => {
        try {
            // Отправляем новый пароль
            const response = await fetch(`${API_BASE_URL}/accounts/password/reset/confirm/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken') || '',
                },
                body: JSON.stringify({
                    email: email,
                    password1: values.password,
                    password2: values.confirmPassword,
                }),
            });

            if (response.ok) {
                console.log('Password reset successful');
                message.success('Password reset successful!');
                setCurrentStep(Steps.Success);
            } else {
                const errorData = await response.json();
                console.error('Password reset failed:', errorData);
                message.error('Password reset failed. Please try again.');
            }
        } catch (error) {
            console.error('Password reset error:', error);
            message.error('Password reset error. Please try again.');
        }
    };

    return (
        <>
            {currentStep === Steps.Login && (
                <>
                    <h2 className={styles.title}>
                        {t`Log in to your account`}
                    </h2>
                    <Form onFinish={onFinish} className={styles.form}>
                        <Form.Item<LoginFormType>
                            name="email"
                            rules={[
                                { required: true, message: "Enter your email" },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Email"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item<LoginFormType>
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`LOG IN`}
                            </Button>
                        </Form.Item>
                        <div className={styles.resendCodeWrapper}>
                            <a
                                onClick={handleForgotPassword}
                                className={styles.resendCode}
                            >
                                {t`Forgot your password?`}
                            </a>
                        </div>
                    </Form>
                </>
            )}
            {currentStep === Steps.Recover && (
                <>
                    <h2 className={styles.title}>
                        {t`Password Recovery`}
                    </h2>
                    <Form onFinish={handleRecovery} className={styles.form}>
                        <Form.Item<LoginFormType>
                            name="email"
                            rules={[
                                { required: true, message: "Enter your email" },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Email"
                                className={styles.input}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`NEXT`}
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}

            {currentStep === Steps.Confirm && (
                <>
                    <h2 className={styles.title}>
                        {t`We have sent email to ${email}`}
                    </h2>
                    <Form onFinish={handleResend} className={styles.form}>
                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`RESEND`}
                            </Button>
                        </Form.Item>
                        <div className={styles.resendCodeWrapper}>
                            <a
                                onClick={handleForgotPassword}
                                className={styles.resendCode}
                            >
                                {t`You can resend the email after`}
                                {timeToResend}
                            </a>
                        </div>
                    </Form>
                </>
            )}

            {currentStep === Steps.Reset && (
                <>
                    <h2 className={styles.title}>
                        {t`Password reset`}
                    </h2>
                    <Form onFinish={handleReset} className={styles.form}>
                        <Form.Item<LoginFormType>
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Password"
                                className={styles.input}
                            />
                        </Form.Item>
                        <Form.Item<LoginFormType>
                            name="confirmPassword"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Repeat password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`CHANGE PASSWORD`}
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
            {currentStep === Steps.Success && (
                <>
                    <h2 className={styles.title}>
                        {t`Password has been successfully updated`}
                    </h2>
                    <span className={styles.labelText}>
                        {t`Now you can log in using a new password`}
                    </span>
                    <Form onFinish={onFinish} className={styles.form}>
                        <Form.Item<LoginFormType>
                            name="email"
                            rules={[
                                { required: true, message: "Enter your email" },
                            ]}
                        >
                            <Input
                                size="large"
                                placeholder="Email"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item<LoginFormType>
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "Enter your password",
                                },
                            ]}
                        >
                            <Input.Password
                                size="large"
                                placeholder="Password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`LOG IN`}
                            </Button>
                        </Form.Item>
                    </Form>
                </>
            )}
        </>
    );
};

export default LoginForm;
