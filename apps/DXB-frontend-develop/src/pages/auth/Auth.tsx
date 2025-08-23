import React, { useEffect, useState } from "react";
import { Segmented, Divider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import styles from "./Auth.module.scss";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { API_BASE_URL } from "@/config";
import CustomButton from "@/components/CustomButton/CustomButton";

const Auth: React.FC = () => {
    const [authType, setAuthType] = useState<string>("login");
    const [googleLoading, setGoogleLoading] = useState<boolean>(false);

    // Handle redirect back from backend with tokens in hash
    useEffect(() => {
        try {
            const hash = window.location.hash || "";
            if (hash.startsWith("#")) {
                const params = new URLSearchParams(hash.slice(1));
                const access = params.get("access");
                const refresh = params.get("refresh");
                if (access && refresh) {
                    localStorage.setItem('accessToken', access);
                    localStorage.setItem('refreshToken', refresh);
                    message.success('Logged in with Google');
                    // Clean hash and navigate
                    window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
                    window.location.href = "/";
                }
            }
        } catch {
            // no-op
        }
    }, []);

    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            console.log('Attempting Google OAuth login...');
            const resp = await fetch(`${API_BASE_URL}/api/auth/google/login/`);
            if (!resp.ok) {
                throw new Error(`Failed to get auth_url: ${resp.status}`);
            }
            const data = await resp.json();
            const authUrl = data?.auth_url;
            if (!authUrl) {
                throw new Error('auth_url is missing');
            }
            console.log('Redirecting to:', authUrl);
            window.location.href = authUrl;
        } catch (error) {
            console.error('Google OAuth error:', error);
            message.error('Google OAuth error. Please try again.');
            setGoogleLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.logo}>LOGO</div>
            </div>
            <div className={styles.rightContainer}>
                <div className={styles.wrapper}>
                    <Segmented
                        options={[
                            { label: "Sign In", value: "login" },
                            { label: "Sign Up", value: "signup" },
                        ]}
                        value={authType}
                        onChange={(value) => setAuthType(value as string)}
                        className={styles.authSegmented}
                    />

                    <h1 className={styles.title}>
                        {authType === 'login' ? 'Join us for free!' : 'Join us for free!'}
                    </h1>

                    <div className={styles.googleWrapper}>
                        <CustomButton
                            type="default"
                            size="large"
                            icon={<GoogleOutlined />}
                            onClick={handleGoogleLogin}
                            className={styles.googleButton}
                            loading={googleLoading}
                            disabled={googleLoading}
                        >
                            Continue with Google
                        </CustomButton>
                    </div>

                    <Divider>or</Divider>

                    {authType === "login" ? <LoginForm /> : <SignUpForm />}
                </div>
            </div>
        </div>
    );
};

export default Auth;
