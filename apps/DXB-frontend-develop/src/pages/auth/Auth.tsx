import React, { useState } from "react";
import { Segmented, Button, Divider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import styles from "./Auth.module.scss";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { API_BASE_URL } from "@/config";

const Auth: React.FC = () => {
    const [authType, setAuthType] = useState<string>("login");

    const handleGoogleLogin = () => {
        try {
            console.log('Attempting Google OAuth login...');
            const googleUrl = `${API_BASE_URL}/accounts/google/login/`;
            console.log('Redirecting to:', googleUrl);
            window.location.href = googleUrl;
        } catch (error) {
            console.error('Google OAuth error:', error);
            message.error('Google OAuth error. Please try again.');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.authHeader}>
                    <h1 className={styles.authTitle}>Welcome!</h1>
                    <Segmented
                        options={[
                            { label: "Sign In", value: "login" },
                            { label: "Sign Up", value: "signup" },
                        ]}
                        value={authType}
                        onChange={(value) => setAuthType(value as string)}
                        className={styles.authSegmented}
                    />
                </div>

                {/* Google Login Button */}
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                    <Button 
                        type="default" 
                        size="large" 
                        icon={<GoogleOutlined />}
                        onClick={handleGoogleLogin}
                        style={{ 
                            width: '100%', 
                            height: '40px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px'
                        }}
                    >
                        Continue with Google
                    </Button>
                </div>

                <Divider>or</Divider>

                <div className={styles.authContent}>
                    {authType === "login" ? <LoginForm /> : <SignUpForm />}
                </div>
            </div>
        </div>
    );
};

export default Auth;
