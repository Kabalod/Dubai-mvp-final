import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, message } from 'antd';
import { AuthProvider, ProtectedRoute } from "./contexts/AuthContext";

// Pages
import DashboardEnhanced from "./pages/DashboardEnhanced";
import AuthEnhanced from "./pages/auth/AuthEnhanced";
import Payment from "./pages/Payment";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

// Ant Design theme configuration
const antdTheme = {
    token: {
        colorPrimary: '#1890ff',
        borderRadius: 8,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    },
    components: {
        Layout: {
            headerBg: '#ffffff',
            siderBg: '#ffffff',
        },
        Button: {
            borderRadius: 8,
        },
        Card: {
            borderRadius: 12,
        },
    },
};

// ========================================
// Enhanced App with Auth Integration
// ========================================

function AppEnhanced() {
    return (
        <ConfigProvider theme={antdTheme}>
            <Router>
                <AuthProvider>
                    <div className="App">
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/auth" element={<AuthEnhanced />} />
                            
                            {/* Protected Routes */}
                            <Route 
                                path="/dashboard" 
                                element={
                                    <ProtectedRoute>
                                        <DashboardEnhanced />
                                    </ProtectedRoute>
                                } 
                            />
                            
                            <Route 
                                path="/analytics" 
                                element={
                                    <ProtectedRoute>
                                        <Analytics />
                                    </ProtectedRoute>
                                } 
                            />
                            
                            <Route 
                                path="/payment" 
                                element={
                                    <ProtectedRoute>
                                        <Payment />
                                    </ProtectedRoute>
                                } 
                            />

                            {/* Default redirect */}
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            
                            {/* 404 */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </Router>
        </ConfigProvider>
    );
}

export default AppEnhanced;