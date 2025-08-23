import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "@/components/CustomButton/CustomButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "@/styles/custom-buttons.scss";
import styles from "./Header.module.scss";
import apiService from "@/services/apiService";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: "/",
            label: "Main",
        },
        {
            key: "/analytics",
            label: "Analytics",
        },
        {
            key: "/reports",
            label: "Reports",
        },
        {
            key: "/payments",
            label: "Payments",
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                {/* Logo */}
                <div className={styles.logo}>
                    LOGO
                </div>

                {/* Navigation Menu */}
                <div className={styles.nav}>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[location.pathname]}
                        items={menuItems}
                        onClick={handleMenuClick}
                        className={styles.menu}
                    />
                </div>

                {/* Right side - Auth/Profile */}
                <div className={styles.rightSection}>
                    {apiService.isAuthenticated() ? (
                        <div className={styles.userMenu}>
                            <span className={styles.userEmail}>{JSON.parse(localStorage.getItem('user') || '{}')?.email || 'User'}</span>
                            <span className={styles.userRole}>{JSON.parse(localStorage.getItem('user') || '{}')?.role || 'free'}</span>
                            <CustomButton variant="outline" size="small" onClick={() => navigate('/profile')}>Profile</CustomButton>
                            <CustomButton variant="primary" size="small" onClick={async()=>{ await apiService.logout(); navigate('/auth'); }}>Logout</CustomButton>
                        </div>
                    ) : (
                        <CustomButton 
                            variant="outline" 
                            size="small" 
                            onClick={() => navigate("/auth")}
                            className={styles.signInButton}
                        >
                            Sign in
                        </CustomButton>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
