// Centralized runtime configuration for API endpoints
// Prefer Vite env (`VITE_*`), fallback to generic env (`FRONTEND_API_URL`) injected via Vite define

const normalizeBase = (url: string) => url.replace(/\/$/, "");

// Production/Development API base URL configuration
const isDevelopment = import.meta.env.MODE === 'development';

const frontendApiFromEnv = isDevelopment
    ? 'http://localhost:8000'  // Local development
    : 'https://backend-production-dbb4.up.railway.app';  // Railway production

export const API_BASE_URL: string = normalizeBase(String(frontendApiFromEnv));

console.log('🔧 Environment:', import.meta.env.MODE);
console.log('🔧 API_BASE_URL:', API_BASE_URL);

// GraphQL endpoint (defaults to `${API_BASE_URL}/graphql`)
export const GRAPHQL_API_URL: string =
    (import.meta.env as any).VITE_GRAPHQL_API_URL || "/graphql";

// Memory LLM API base (defaults to `${API_BASE_URL}/memory`)
export const MEMORY_API_URL: string =
    (import.meta.env as any).VITE_MEMORY_API_URL || `${API_BASE_URL}/memory`;


