import React, { useState } from "react";
import { Form, message } from "antd";
import styles from "./Auth.module.scss";
import CustomInput from "@/components/CustomInput/CustomInput";
import CustomButton from "@/components/CustomButton/CustomButton";
import { t } from "@lingui/macro";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext"; // ✅ ДОБАВЛЕНО: используем AuthContext
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
    const { login } = useAuth(); // ✅ ДОБАВЛЕНО: используем AuthContext  
    const [currentStep, setCurrentStep] = useState(Steps.Login);
    const [loginLoading, setLoginLoading] = useState(false);
    const [recoveryLoading, setRecoveryLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [timeToResend, setTimeToResend] = useState(45);

    const onFinish = async (values: any) => {
        try {
            console.log("🔑 Login attempt via AuthContext with:", values.email);
            setLoginLoading(true);
            
            // ✅ ИСПРАВЛЕНО: Используем AuthContext вместо прямого fetch
            await login(values.email, values.password);
            
            console.log('✅ Login successful via AuthContext!');
            navigate("/");
            
        } catch (error: any) {
            console.error('❌ Login failed:', error.message);
            // Показываем ошибку в консоли, но не блокируем UI
        } finally {
            setLoginLoading(false);
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
            setRecoveryLoading(true);
            
            // Отправляем запрос на сброс пароля
            const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/`, {
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
                // ✅ ИСПРАВЛЕНО: убрали message.success
                setCurrentStep(Steps.Confirm);
            } else {
                const errorData = await response.json();
                console.error('Password reset failed:', errorData);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (error) {
            console.error('Password reset error:', error);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        } finally {
            setRecoveryLoading(false);
        }
    };

    const handleResend = () => {
        console.log("email resent");
    };

    const handleReset = async (values: any) => {
        try {
            // Отправляем новый пароль
            setResetLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/auth/password/reset/confirm/`, {
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
                // ✅ ИСПРАВЛЕНО: убрали message.success
                setCurrentStep(Steps.Success);
            } else {
                const errorData = await response.json();
                console.error('Password reset failed:', errorData);
                // ✅ ИСПРАВЛЕНО: убрали message.error
            }
        } catch (error) {
            console.error('Password reset error:', error);
            // ✅ ИСПРАВЛЕНО: убрали message.error
        } finally {
            setResetLoading(false);
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
                            <CustomInput
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
                            <CustomInput.Password
                                size="large"
                                placeholder="Password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <CustomButton
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            loading={loginLoading}
                            disabled={loginLoading}
                            >
                                {loginLoading ? t`LOGGING IN...` : t`LOG IN`}
                            </CustomButton>
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
                            <CustomInput
                                size="large"
                                placeholder="Email"
                                className={styles.input}
                            />
                        </Form.Item>
                        <Form.Item>
                            <CustomButton
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            loading={recoveryLoading}
                            disabled={recoveryLoading}
                            >
                                {recoveryLoading ? t`SENDING...` : t`NEXT`}
                            </CustomButton>
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
                            <CustomButton
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`RESEND`}
                            </CustomButton>
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
                            <CustomInput.Password
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
                            <CustomInput.Password
                                size="large"
                                placeholder="Repeat password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <CustomButton
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            loading={resetLoading}
                            disabled={resetLoading}
                            >
                                {resetLoading ? t`UPDATING...` : t`CHANGE PASSWORD`}
                            </CustomButton>
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
                            <CustomInput
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
                            <CustomInput.Password
                                size="large"
                                placeholder="Password"
                                className={styles.input}
                            />
                        </Form.Item>

                        <Form.Item>
                            <CustomButton
                                type="primary"
                                block
                                size="large"
                                htmlType="submit"
                                className={styles.confirmButton}
                            >
                                {t`LOG IN`}
                            </CustomButton>
                        </Form.Item>
                    </Form>
                </>
            )}
        </>
    );
};

export default LoginForm;
