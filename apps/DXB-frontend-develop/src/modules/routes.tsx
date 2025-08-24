import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/auth/Auth";
import MainDashboard from "@/pages/MainDashboard";
import NotFound from "@/pages/NotFound";
import { Landing } from "@/pages/landing";
import Analytics from "@/pages/analytics/Analytics";
import Policy from "@/pages/Policy/Policy";
import Profile from "@/pages/Profile";
import Payment from "@/pages/Payment";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
