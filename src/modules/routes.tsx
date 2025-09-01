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
import GoogleRedirect from "@/pages/auth/GoogleRedirect";

export default function AppRoutes() {
    return (
        <Routes>
            {/* Публичные маршруты - доступны всем */}
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/google" element={<GoogleRedirect />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/policy" element={<Policy />} />
            
            {/* Защищенные маршруты - только для авторизованных */}
            <Route path="/profile" element={
                <ProtectedRoute>
                    <Profile />
                </ProtectedRoute>
            } />
            
            {/* 404 страница */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
