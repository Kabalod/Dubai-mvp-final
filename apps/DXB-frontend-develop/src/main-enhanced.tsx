import React from "react";
import ReactDOM from "react-dom/client";
import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';
import AppEnhanced from "./AppEnhanced";

// Global styles
import 'antd/dist/reset.css';
import './styles/index.scss';

// ========================================
// Enhanced Main Entry Point for MVP
// ========================================

// Error boundary for development
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('React Error Boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-red-50">
                    <div className="text-center p-8">
                        <h1 className="text-2xl font-bold text-red-600 mb-4">
                            Something went wrong
                        </h1>
                        <p className="text-gray-600 mb-4">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// ========================================
// App Initialization
// ========================================

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

root.render(
    <React.StrictMode>
        <ErrorBoundary>
            <ConfigProvider 
                locale={enUS}
                theme={{
                    token: {
                        colorPrimary: '#1890ff',
                        borderRadius: 8,
                    },
                }}
            >
                <AppEnhanced />
            </ConfigProvider>
        </ErrorBoundary>
    </React.StrictMode>
);

// ========================================
// Development helpers
// ========================================

if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Dubai Platform MVP - Frontend Started');
    console.log('API Base URL:', process.env.REACT_APP_API_URL || 'http://localhost:8000');
    console.log('Environment:', process.env.NODE_ENV);
}

// Hot module replacement for development
if (import.meta.hot) {
    import.meta.hot.accept();
}