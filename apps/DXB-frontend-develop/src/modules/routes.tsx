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

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
