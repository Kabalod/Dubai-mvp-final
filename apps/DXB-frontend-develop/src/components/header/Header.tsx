import React from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "@/components/CustomButton/CustomButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import "@/styles/custom-buttons.scss";
import styles from "./Header.module.scss";

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

                {/* Right side - Auth Button */}
                <div className={styles.rightSection}>
                    <CustomButton 
                        variant="outline" 
                        size="small" 
                        onClick={() => navigate("/auth")}
                        className={styles.signInButton}
                    >
                        Sign in
                    </CustomButton>
                </div>
            </div>
        </div>
    );
};

export default Header;
