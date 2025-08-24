import React from "react";
import { ApplicationHeader } from "../application-header";
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
                return 'Payments';
            default:
                return 'Main';
        }
    };

    return <ApplicationHeader activeRoute={getActiveRoute()} />;
};

export default Header;