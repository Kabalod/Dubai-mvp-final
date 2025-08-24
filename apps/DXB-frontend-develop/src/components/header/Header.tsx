import React from "react";
import { SimpleHeader } from "../simple-header";
import { useLocation } from "react-router-dom";

const Header: React.FC = () => {
    const location = useLocation();
    
    // Map current route to header navigation
    const getActiveRoute = () => {
        switch (location.pathname) {
            case '/':
                return 'Main';
            case '/analytics':
                return 'Analytics';
            case '/reports':
                return 'Reports';
            case '/payment':
            case '/payments':
                return 'Payments';
            case '/pricing':
                return 'Pricing';
            case '/profile':
                return 'Profile';
            case '/dashboard':
                return 'Analytics'; // Dashboard считается как Analytics
            default:
                return 'Main';
        }
    };

    return <SimpleHeader activeRoute={getActiveRoute()} />;
};

export default Header;