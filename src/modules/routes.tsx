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
import AuthResult from "@/pages/auth/AuthResult";

const DebugPage = () => (
    <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🔧 Debug Page</h1>
        <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border rounded-lg">
                <h2 className="font-semibold mb-2">Environment Check</h2>
                <p><strong>DEMO_MODE:</strong> {import.meta.env.VITE_DEMO_MODE || 'undefined'}</p>
                <p><strong>Mode:</strong> {import.meta.env.MODE}</p>
                <p><strong>User Agent:</strong> {navigator.userAgent}</p>
            </div>
        </div>
    </div>
);

export default function AppRoutes() {
    return (
        <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/google" element={<GoogleRedirect />} />
            <Route path="/auth/callback" element={<AuthResult />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/policy" element={<Policy />} />

            {/* --- Protected Routes --- */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/profile" element={<Profile />} />
            </Route>
            
            {/* Conditionally render the debug route only in development */}
            {import.meta.env.DEV && <Route path="/debug" element={<DebugPage />} />}
            
            {/* --- 404 Not Found --- */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
