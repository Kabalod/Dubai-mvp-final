import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { API_BASE_URL } from '@/config';

// ========================================
// API Configuration (base comes from env via src/config.ts)
// ========================================

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: `${API_BASE_URL}`,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        });

        // Request interceptor to add auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('accessToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor to handle token refresh
        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const response = await this.refreshToken(refreshToken);
                            localStorage.setItem('accessToken', response.data.access);
                            
                            // Retry original request with new token
                            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
                            return this.api(originalRequest);
                        } catch (refreshError) {
                            // Refresh failed, logout user
                            this.logout();
                            window.location.href = '/auth';
                        }
                    } else {
                        // No refresh token, logout user
                        this.logout();
                        window.location.href = '/auth';
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // ========================================
    // Authentication Methods
    // ========================================

    async login(username: string, password: string) {
        const response = await this.api.post('/auth/login/', {
            username,
            password,
        });

        if (response.data.tokens) {
            localStorage.setItem('accessToken', response.data.tokens.access);
            localStorage.setItem('refreshToken', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    async register(userData: {
        username: string;
        email: string;
        password: string;
        password_confirm: string;
        first_name?: string;
        last_name?: string;
    }) {
        const response = await this.api.post('/auth/register/', userData);

        if (response.data.tokens) {
            localStorage.setItem('accessToken', response.data.tokens.access);
            localStorage.setItem('refreshToken', response.data.tokens.refresh);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    }

    async logout() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await this.api.post('/auth/logout/', {
                    refresh_token: refreshToken,
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    }

    async refreshToken(refreshToken: string) {
        return this.api.post('/auth/refresh/', {
            refresh: refreshToken,
        });
    }

    // ========================================
    // Properties API
    // ========================================

    async getProperties(params: {
        search?: string;
        property_type?: string;
        listing_type?: 'sale' | 'rent';
        min_price?: number;
        max_price?: number;
        bedrooms?: string;
        area?: string;
        limit?: number;
        offset?: number;
    } = {}) {
        const response = await this.api.get('/properties/', { params });
        return response.data;
    }

    async getAreas() {
        const response = await this.api.get('/areas/');
        return response.data;
    }

    async getBuildings(params: {
        area?: string;
        limit?: number;
        offset?: number;
    } = {}) {
        const response = await this.api.get('/buildings/', { params });
        return response.data;
    }

    // ========================================
    // Analytics API
    // ========================================

    async getAnalytics() {
        const response = await this.api.get('/analytics/');
        return response.data;
    }

    async getBuildingReports(params: {
        area?: string;
        bedrooms?: string;
        limit?: number;
        offset?: number;
    } = {}) {
        const response = await this.api.get('/reports/', { params });
        return response.data;
    }

    // ========================================
    // Health Check
    // ========================================

    async getHealthCheck() {
        const response = await this.api.get('/health/');
        return response.data;
    }

    // ========================================
    // Utility Methods
    // ========================================

    isAuthenticated(): boolean {
        return !!localStorage.getItem('accessToken');
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    setAuthToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    getAuthToken(): string | null {
        return localStorage.getItem('accessToken');
    }
}

// ========================================
// Export singleton instance
// ========================================

export const apiService = new ApiService();
export default apiService;

// ========================================
// Types for TypeScript
// ========================================

export interface Property {
    id: string;
    title: string;
    display_address: string;
    bedrooms: string;
    bathrooms: string;
    price: number;
    price_currency: string;
    property_type: string;
    listing_type: 'sale' | 'rent';
    added_on: string;
    latitude?: number;
    longitude?: number;
    numeric_area?: number;
    furnishing?: string;
    broker?: string;
    agent?: string;
    verified: boolean;
}

export interface Area {
    id: number;
    name: string;
    verified_value: string;
    numbers_of_processed_ads: number;
    sum_number_of_days_for_all_ads: number;
}

export interface Building {
    id: number;
    name: string;
    area: Area;
    latitude?: number;
    longitude?: number;
    numbers_of_processed_rent_ads: number;
    numbers_of_processed_sale_ads: number;
}

export interface Analytics {
    total_properties: number;
    total_sale_properties: number;
    total_rent_properties: number;
    total_buildings: number;
    total_areas: number;
    avg_sale_price?: number;
    avg_rent_price?: number;
    properties_by_type: Record<string, number>;
    properties_by_bedrooms: Record<string, number>;
    properties_by_area: Record<string, number>;
}

export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}