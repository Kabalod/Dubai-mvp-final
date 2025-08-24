import React, { useEffect, useState } from "react";
import { Segmented, Divider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import styles from "./Auth.module.scss";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { API_BASE_URL } from "@/config";
import CustomButton from "@/components/CustomButton/CustomButton";
import LogoImage from "@/assets/Logo.png";

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
            console.log('🔄 Attempting Google OAuth login to:', `${API_BASE_URL}/auth/google/login/`);
            
            const resp = await fetch(`${API_BASE_URL}/api/auth/google/login/`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });
            
            console.log('📡 Response status:', resp.status);
            
            if (!resp.ok) {
                const errorText = await resp.text();
                console.error('❌ Server error:', errorText);
                throw new Error(`Server error: ${resp.status} - ${errorText}`);
            }
            
            const data = await resp.json();
            console.log('📦 Response data:', data);
            
            const authUrl = data?.auth_url;
            if (!authUrl) {
                throw new Error('auth_url is missing from server response');
            }
            
            console.log('🔗 Redirecting to Google OAuth:', authUrl);
            window.location.href = authUrl;
            
        } catch (error: any) {
            console.error('❌ Google OAuth error:', error);
            setGoogleLoading(false);
            
            if (error.message.includes('Failed to fetch')) {
                message.error('❌ Cannot connect to server. Please check if backend is running.');
            } else {
                message.error(`❌ Google OAuth error: ${error.message}`);
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.leftContainer}>
                <div className={styles.logo}>
                    <img src={LogoImage} alt="Dubai MVP Logo" className={styles.logoImage} />
                </div>
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
