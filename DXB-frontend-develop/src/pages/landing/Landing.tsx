import React from "react";

const Landing = () => {
    return (
        <div style={{ 
            padding: '50px', 
            textAlign: 'center', 
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f0f2f5',
            minHeight: '100vh'
        }}>
            <h1 style={{ color: '#1890ff', fontSize: '2.5em', marginBottom: '30px' }}>
                🏠 Real Estate Analytics Platform
            </h1>
            
            <div style={{ 
                background: 'white', 
                padding: '30px', 
                borderRadius: '10px', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h2 style={{ color: '#52c41a', marginBottom: '20px' }}>
                    ✅ Система успешно запущена!
                </h2>
                
                <p style={{ fontSize: '18px', marginBottom: '30px' }}>
                    Ваша платформа для анализа недвижимости Дубая готова к работе
                </p>
                
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <div style={{ padding: '20px', background: '#f6ffed', borderRadius: '8px', border: '1px solid #b7eb8f' }}>
                        <h3>📊 Аналитика</h3>
                        <p>Глубокий анализ рынка</p>
                    </div>
                    <div style={{ padding: '20px', background: '#e6f7ff', borderRadius: '8px', border: '1px solid #91d5ff' }}>
                        <h3>🔍 Поиск</h3>
                        <p>Поиск недвижимости</p>
                    </div>
                    <div style={{ padding: '20px', background: '#fff7e6', borderRadius: '8px', border: '1px solid #ffd591' }}>
                        <h3>📈 Отчеты</h3>
                        <p>Детальные отчеты</p>
                    </div>
                </div>
                
                <div style={{ 
                    background: '#f6ffed', 
                    padding: '20px', 
                    borderRadius: '8px', 
                    border: '1px solid #b7eb8f'
                }}>
                    <h3>🚀 Архитектура запущена:</h3>
                    <ul style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto' }}>
                        <li>Backend Django: порты 8000, 8001</li>
                        <li>Frontend React: порт 5173</li>
                        <li>HTTP тест: порт 3000</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Landing;
