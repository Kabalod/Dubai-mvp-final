// Centralized runtime configuration for API endpoints
// Prefer Vite env (`VITE_*`), fallback to generic env (`FRONTEND_API_URL`) injected via Vite define

const normalizeBase = (url: string) => url.replace(/\/$/, "");

// Production/Development API base URL configuration
// Берём из Vite env, иначе используем относительный путь (через Caddy прокси)
const envBase = (import.meta.env.VITE_FRONTEND_API_URL as string) || '';
export const API_BASE_URL: string = normalizeBase(String(envBase || ''));

console.log('🔧 Environment:', import.meta.env.MODE);
console.log('🔧 API_BASE_URL:', API_BASE_URL);



// Memory LLM removed from project - keeping URL for backwards compatibility but unused
// export const MEMORY_API_URL: string =
//     (import.meta.env.VITE_MEMORY_API_URL as string) || `${API_BASE_URL}/memory`;


