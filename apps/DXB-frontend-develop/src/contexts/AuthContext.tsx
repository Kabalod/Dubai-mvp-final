import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '../services/apiService';

// ========================================
// Auth Context Types
// ========================================

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<void>;
    logout: () => void;
    checkAuth: () => void;
}

interface RegisterData {
    username: string;
    email: string;
    password: string;
    password_confirm: string;
    first_name?: string;
    last_name?: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

// ========================================
// Create Context
// ========================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ========================================
// Auth Provider Component
// ========================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check authentication status on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = () => {
        setIsLoading(true);
        
        try {
            const isAuth = apiService.isAuthenticated();
            if (isAuth) {
                const userData = apiService.getCurrentUser();
                setUser(userData);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Auth check error:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (username: string, password: string): Promise<void> => {
        setIsLoading(true);
        
        try {
            const response = await apiService.login(username, password);
            setUser(response.user);
            
            // Show success message
            console.log('Login successful:', response.message);
            
        } catch (error: any) {
            console.error('Login error:', error);
            
            // Extract error message
            let errorMessage = 'Login failed';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.response?.data?.detail) {
                errorMessage = error.response.data.detail;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (userData: RegisterData): Promise<void> => {
        setIsLoading(true);
        
        try {
            const response = await apiService.register(userData);
            setUser(response.user);
            
            console.log('Registration successful:', response.message);
            
        } catch (error: any) {
            console.error('Registration error:', error);
            
            // Extract error message
            let errorMessage = 'Registration failed';
            if (error.response?.data) {
                const errors = error.response.data;
                
                // Handle field-specific errors
                if (typeof errors === 'object') {
                    const errorMessages = [];
                    for (const [field, messages] of Object.entries(errors)) {
                        if (Array.isArray(messages)) {
                            errorMessages.push(`${field}: ${messages.join(', ')}`);
                        } else {
                            errorMessages.push(`${field}: ${messages}`);
                        }
                    }
                    errorMessage = errorMessages.join('; ');
                } else if (typeof errors === 'string') {
                    errorMessage = errors;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsLoading(true);
        
        try {
            apiService.logout();
            setUser(null);
            
            // Redirect to login page
            window.location.href = '/auth';
            
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isAuthenticated = !!user;

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        checkAuth,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ========================================
// Custom Hook
// ========================================

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

// ========================================
// Higher-Order Component for Protected Routes
// ========================================

interface ProtectedRouteProps {
    children: ReactNode;
    fallback?: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    fallback 
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback || (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
                    <p className="text-gray-600 mb-6">Please log in to access this page.</p>
                    <a 
                        href="/auth" 
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Go to Login
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};