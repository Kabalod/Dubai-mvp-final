import { API_BASE_URL } from '../config';

// API сервис для работы с backend
class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    // Базовый метод для API запросов
    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
        
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        console.log(`📡 API Response: ${response.status} ${response.statusText}`);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response.json();
    }

    // Аутентификация
    async sendOTP(email: string) {
        return this.request('/api/auth/send-otp/', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    }

    async verifyOTP(email: string, code: string) {
        return this.request('/api/auth/verify-otp/', {
            method: 'POST',
            body: JSON.stringify({ email, code }),
        });
    }

    async register(userData: any) {
        return this.request('/api/auth/register/', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: any) {
        return this.request('/api/auth/login/', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    // Профиль пользователя
    async getUserProfile(token: string) {
        return this.request('/api/profile/me/', {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    }

    // Health check
    async healthCheck() {
        return this.request('/api/health/');
    }
}

export const apiService = new ApiService();
export default apiService;
