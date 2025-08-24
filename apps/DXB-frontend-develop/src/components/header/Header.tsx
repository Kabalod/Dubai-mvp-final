import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import styles from "./Header.module.scss";
import apiService from "@/services/apiService";
import LogoImage from "@/assets/Logo.png";

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

    const user = apiService.isAuthenticated() ? JSON.parse(localStorage.getItem('user') || '{}') : null;
    
    return (
        <div className="border-b bg-background">
            <div className="flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
                    <img 
                        src={LogoImage} 
                        alt="Dubai MVP Logo" 
                        className="h-10 w-auto"
                        onError={(e) => {
                            console.error('Logo image failed to load:', e);
                            e.currentTarget.style.display = 'none';
                            // Show fallback text if image fails
                            const fallback = document.createElement('span');
                            fallback.textContent = 'Dubai MVP';
                            fallback.className = 'font-bold text-lg text-primary';
                            e.currentTarget.parentNode?.appendChild(fallback);
                        }}
                        onLoad={() => console.log('Logo loaded successfully')}
                    />
                </div>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                    {menuItems.map((item) => (
                        <Button
                            key={item.key}
                            variant={location.pathname === item.key ? "default" : "ghost"}
                            onClick={() => navigate(item.key)}
                            className="text-sm font-medium"
                        >
                            {item.label}
                        </Button>
                    ))}
                </nav>

                {/* Right side - Auth/Profile */}
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-3">
                            <div className="hidden sm:block text-right">
                                <div className="text-sm font-medium">{user.email}</div>
                                <Badge variant="secondary" className="text-xs">
                                    {user.role?.toUpperCase() || 'FREE'}
                                </Badge>
                            </div>
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>
                                    {(user.first_name?.[0] || user.username?.[0] || user.email?.[0] || 'U').toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm" onClick={() => navigate('/profile')}>
                                Profile
                            </Button>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={async () => { 
                                    await apiService.logout(); 
                                    navigate('/auth'); 
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate("/auth")}
                        >
                            Sign in
                        </Button>
                    )}
                </div>

                {/* Mobile menu placeholder */}
                <div className="md:hidden">
                    <Button variant="ghost" size="sm">
                        ☰
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Header;
