import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// ========================================
// Enhanced Auth Component with API Integration
// ========================================

const AuthEnhanced: React.FC = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ 
        username: '', 
        email: '', 
        password: '', 
        password_confirm: '',
        first_name: '',
        last_name: ''
    });
    const [errors, setErrors] = useState<string[]>([]);
    const { login, register, isAuthenticated, isLoading } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    // ========================================
    // Login Handler
    // ========================================

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        
        if (!loginData.username || !loginData.password) {
            setErrors(['Please fill in all fields']);
            return;
        }
        
        try {
            await login(loginData.username, loginData.password);
            alert('Login successful!');
            navigate('/dashboard');
        } catch (error: any) {
            setErrors([error.message || 'Login failed']);
        }
    };

    // ========================================
    // Registration Handler
    // ========================================

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        
        if (!registerData.username || !registerData.email || !registerData.password || !registerData.password_confirm) {
            setErrors(['Please fill in all required fields']);
            return;
        }
        
        if (registerData.password !== registerData.password_confirm) {
            setErrors(['Passwords do not match']);
            return;
        }
        
        if (registerData.password.length < 6) {
            setErrors(['Password must be at least 6 characters']);
            return;
        }
        
        try {
            await register(registerData);
            alert('Registration successful!');
            navigate('/dashboard');
        } catch (error: any) {
            setErrors([error.message || 'Registration failed']);
        }
    };

    const updateLoginData = (field: string, value: string) => {
        setLoginData(prev => ({ ...prev, [field]: value }));
    };
    
    const updateRegisterData = (field: string, value: string) => {
        setRegisterData(prev => ({ ...prev, [field]: value }));
    };

    // Show loading spinner during auth check
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                        🏢 Dubai Platform
                    </h1>
                    <p className="text-muted-foreground">
                        Real Estate Analytics Platform
                    </p>
                </div>

                {/* Auth Card */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-center">Welcome</CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your account or create a new one
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {errors.length > 0 && (
                            <Alert className="mb-4">
                                <AlertDescription>
                                    {errors.map((error, index) => (
                                        <div key={index}>{error}</div>
                                    ))}
                                </AlertDescription>
                            </Alert>
                        )}

                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="login">Sign In</TabsTrigger>
                                <TabsTrigger value="register">Sign Up</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="login" className="space-y-4">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div>
                                        <Input
                                            placeholder="Username"
                                            value={loginData.username}
                                            onChange={(e) => updateLoginData('username', e.target.value)}
                                            autoComplete="username"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={loginData.password}
                                            onChange={(e) => updateLoginData('password', e.target.value)}
                                            autoComplete="current-password"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Signing in...' : 'Sign In'}
                                    </Button>
                                </form>
                            </TabsContent>
                            
                            <TabsContent value="register" className="space-y-4">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <Input
                                            placeholder="Username"
                                            value={registerData.username}
                                            onChange={(e) => updateRegisterData('username', e.target.value)}
                                            autoComplete="username"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="Email"
                                            value={registerData.email}
                                            onChange={(e) => updateRegisterData('email', e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Input
                                            placeholder="First Name (optional)"
                                            value={registerData.first_name}
                                            onChange={(e) => updateRegisterData('first_name', e.target.value)}
                                            autoComplete="given-name"
                                        />
                                        <Input
                                            placeholder="Last Name (optional)"
                                            value={registerData.last_name}
                                            onChange={(e) => updateRegisterData('last_name', e.target.value)}
                                            autoComplete="family-name"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            value={registerData.password}
                                            onChange={(e) => updateRegisterData('password', e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="password"
                                            placeholder="Confirm Password"
                                            value={registerData.password_confirm}
                                            onChange={(e) => updateRegisterData('password_confirm', e.target.value)}
                                            autoComplete="new-password"
                                        />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? 'Creating account...' : 'Sign Up'}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-muted-foreground">
                        © 2024 Dubai MVP Platform. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthEnhanced;