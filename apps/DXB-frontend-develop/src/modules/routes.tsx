import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/auth/Auth";
import HomePage from "@/pages/HomePage";
import MainDashboard from "@/pages/MainDashboard";
import NotFound from "@/pages/NotFound";
import Analytics from "@/pages/analytics/Analytics";
import Reports from "@/pages/Reports";
import Policy from "@/pages/Policy/Policy";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";
import PricingPage from "@/pages/PricingPage";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Публичные маршруты */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/policy" element={<Policy />} />
            
            {/* Защищенные маршруты - требуют авторизации */}
            <Route path="/" element={
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <MainDashboard />
                </ProtectedRoute>
            } />
            <Route path="/analytics" element={
                <ProtectedRoute>
                    <Analytics />
                </ProtectedRoute>
            } />
            <Route path="/reports" element={
                <ProtectedRoute>
                    <Reports />
                </ProtectedRoute>
            } />
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            <Route path="/payment" element={
                <ProtectedRoute>
                    <Payment />
                </ProtectedRoute>
            } />
            <Route path="/pricing" element={
                <ProtectedRoute>
                    <PricingPage />
                </ProtectedRoute>
            } />
            
            {/* 404 страница */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
