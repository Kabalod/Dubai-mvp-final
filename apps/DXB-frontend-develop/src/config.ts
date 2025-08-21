// Centralized runtime configuration for API endpoints
// Prefer Vite env (`VITE_*`), fallback to generic env (`FRONTEND_API_URL`) injected via Vite define

const normalizeBase = (url: string) => url.replace(/\/$/, "");

// Frontend API base, expected to include "/api" (e.g., "/api" via Nginx, or "http://localhost:8090/api")
const frontendApiFromEnv =
    (import.meta.env as any).VITE_FRONTEND_API_URL ||
    (import.meta.env as any).FRONTEND_API_URL ||
    "/api";

export const API_BASE_URL: string = normalizeBase(String(frontendApiFromEnv));

// GraphQL endpoint (defaults to `${API_BASE_URL}/graphql`)
export const GRAPHQL_API_URL: string =
    (import.meta.env as any).VITE_GRAPHQL_API_URL || "/graphql";

// Memory LLM API base (defaults to `${API_BASE_URL}/memory`)
export const MEMORY_API_URL: string =
    (import.meta.env as any).VITE_MEMORY_API_URL || `${API_BASE_URL}/memory`;


