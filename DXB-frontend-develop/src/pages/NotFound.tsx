import React from "react";

function NotFound() {
    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            <h1>❌ 404 - Страница не найдена</h1>
            <h2>Запрашиваемая страница не существует</h2>
            
            <div style={{ margin: '40px 0' }}>
                <p style={{ fontSize: '18px', color: '#666' }}>
                    Возможно, вы перешли по неверной ссылке или страница была удалена.
                </p>
            </div>
            
            <div style={{ margin: '40px 0' }}>
                <h3>🔗 Доступные страницы:</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
                    <a href="/" style={{ 
                        padding: '10px 20px', 
                        background: '#1890ff', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Главная
                    </a>
                    <a href="/dash" style={{ 
                        padding: '10px 20px', 
                        background: '#52c41a', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Dashboard
                    </a>
                    <a href="/analytics" style={{ 
                        padding: '10px 20px', 
                        background: '#722ed1', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Аналитика
                    </a>
                    <a href="/auth" style={{ 
                        padding: '10px 20px', 
                        background: '#fa8c16', 
                        color: 'white', 
                        textDecoration: 'none', 
                        borderRadius: '4px' 
                    }}>
                        Авторизация
                    </a>
                </div>
            </div>
            
            <div style={{ margin: '20px 0' }}>
                <p>Или вернитесь на <a href="/" style={{ color: '#1890ff' }}>главную страницу</a></p>
            </div>
        </div>
    );
}

export default NotFound;
