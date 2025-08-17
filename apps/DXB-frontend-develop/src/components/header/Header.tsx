import React from "react";
import { Menu, Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: "/",
            label: "Dashboard",
        },
        {
            key: "/analytics",
            label: "Analytics",
        },
        {
            key: "/ai-assistant",
            label: "AI Assistant",
        },
        {
            key: "/project-memory",
            label: "Project Memory",
        },
        {
            key: "/production-memory",
            label: "Production Memory",
        },
        {
            key: "/auth",
            label: "Auth",
        },
        {
            key: "/policy",
            label: "Policy",
        },
    ];

    const handleMenuClick = ({ key }: { key: string }) => {
        console.log("Navigating to:", key); // Добавляем логирование
        navigate(key);
    };

    return (
        <div style={{ 
            background: '#fff', 
            borderBottom: '1px solid #f0f0f0', 
            padding: '0 20px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                height: '64px'
            }}>
                {/* Logo */}
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    Dubai Real Estate
                </div>

                {/* Navigation Menu */}
                <Menu
                    mode="horizontal"
                    selectedKeys={[location.pathname]}
                    items={menuItems}
                    onClick={handleMenuClick}
                    style={{ 
                        flex: 1, 
                        justifyContent: 'center',
                        border: 'none',
                        background: 'transparent'
                    }}
                />

                {/* Right side - Language Switcher */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Button size="small" onClick={() => navigate("/")}>Dashboard</Button>
                    <Button size="small" onClick={() => navigate("/analytics")}>Analytics</Button>
                    <Button size="small" onClick={() => navigate("/ai-assistant")}>AI</Button>
                    <Button size="small" onClick={() => navigate("/project-memory")}>Memory</Button>
                    <Button size="small" onClick={() => navigate("/production-memory")}>Prod</Button>
                    <Button size="small" onClick={() => navigate("/auth")}>Auth</Button>
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    );
};

export default Header;
