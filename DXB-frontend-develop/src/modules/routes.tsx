import { Routes, Route } from "react-router-dom";
import Auth from "@/pages/auth/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/NotFound";
import { Landing } from "@/pages/landing";
import Analytics from "@/pages/analytics/Analytics";
import Policy from "@/pages/Policy/Policy";
import AIAssistant from "@/pages/AIAssistant";
import ProjectMemory from "@/pages/ProjectMemory";
import ProductionMemory from "@/pages/ProductionMemory";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/dash" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/project-memory" element={<ProjectMemory />} />
            <Route path="/production-memory" element={<ProductionMemory />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
