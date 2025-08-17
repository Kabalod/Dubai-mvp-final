import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, Avatar, Typography, Spin, message, Tag, Tooltip } from 'antd';
import { 
    SendOutlined, 
    RobotOutlined, 
    UserOutlined, 
    BrainOutlined,
    MessageOutlined
} from '@ant-design/icons';
import { memoryService, MemoryItem } from '@/services/memoryService';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface DashboardAssistantProps {
    onMemoryAdd?: (memory: MemoryItem) => void;
    showMemories?: boolean;
    compact?: boolean;
}

const DashboardAssistant: React.FC<DashboardAssistantProps> = ({ 
    onMemoryAdd, 
    showMemories = false,
    compact = true
}) => {
    const [messages, setMessages] = useState<Array<{
        id: string;
        type: 'user' | 'assistant';
        content: string;
        timestamp: Date;
    }>>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Автоскролл к последнему сообщению
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Обработка отправки сообщения
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            type: 'user' as const,
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Поиск релевантных воспоминаний
            const memoriesResponse = await memoryService.searchMemories(inputValue, 3);
            
            // Генерируем простой ответ на основе найденных воспоминаний
            let response = 'Спасибо за ваш вопрос! ';
            
            if (memoriesResponse.memories.length > 0) {
                const memory = memoriesResponse.memories[0];
                response += `На основе моих знаний: ${memory.text.slice(0, 100)}...`;
                
                // Автоматически добавляем важные воспоминания
                if (onMemoryAdd) {
                    const newMemory: MemoryItem = {
                        text: `Dashboard query: ${inputValue}`,
                        type: 'user',
                        age: 'week',
                    };
                    try {
                        await memoryService.addMemory(newMemory);
                        onMemoryAdd(newMemory);
                    } catch (error) {
                        console.error('Failed to add memory:', error);
                    }
                }
            } else {
                response += 'У меня пока нет информации по этому вопросу. Попробуйте задать вопрос о недвижимости Dubai, аналитике рынка или конкретных свойствах.';
            }

            const assistantMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant' as const,
                content: response,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error('Error generating response:', error);
            message.error('Произошла ошибка. Попробуйте еще раз.');
            
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant' as const,
                content: 'Извините, у меня возникли технические проблемы. Попробуйте позже.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработка Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Очистка истории
    const handleClearHistory = () => {
        setMessages([]);
        message.success('История очищена');
    };

    if (compact && !isExpanded) {
        return (
            <Card
                size="small"
                style={{ cursor: 'pointer' }}
                onClick={() => setIsExpanded(true)}
            >
                <Space>
                    <RobotOutlined style={{ color: '#1890ff', fontSize: '18px' }} />
                    <Text>AI Ассистент</Text>
                    <Tag color="blue" size="small">Нажмите для открытия</Tag>
                </Space>
            </Card>
        );
    }

    return (
        <Card
            title={
                <Space>
                    <RobotOutlined style={{ color: '#1890ff' }} />
                    <span>AI Ассистент</span>
                    {compact && (
                        <Button 
                            type="text" 
                            size="small" 
                            onClick={() => setIsExpanded(false)}
                        >
                            ✕
                        </Button>
                    )}
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Очистить историю">
                        <Button 
                            type="text" 
                            size="small" 
                            onClick={handleClearHistory}
                        >
                            🗑️
                        </Button>
                    </Tooltip>
                    <Tag color="green" size="small">
                        {messages.length} сообщений
                    </Tag>
                </Space>
            }
            style={{ 
                height: compact ? '400px' : '500px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%',
                overflow: 'hidden'
            }}>
                {/* Область сообщений */}
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '12px',
                    background: '#fafafa',
                    borderRadius: '6px',
                    marginBottom: '12px',
                    maxHeight: compact ? '280px' : '380px'
                }}>
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                            <RobotOutlined style={{ fontSize: '24px', marginBottom: '8px' }} />
                            <div>Задайте вопрос о недвижимости Dubai</div>
                        </div>
                    )}
                    
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                marginBottom: 12,
                                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '85%' }}>
                                {message.type === 'assistant' && (
                                    <Avatar 
                                        icon={<RobotOutlined />} 
                                        size="small"
                                        style={{ backgroundColor: '#1890ff', marginRight: 6 }}
                                    />
                                )}
                                
                                <div style={{ 
                                    background: message.type === 'user' ? '#1890ff' : '#f0f2f5',
                                    color: message.type === 'user' ? 'white' : 'inherit',
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    maxWidth: '100%',
                                    wordWrap: 'break-word',
                                    fontSize: '13px'
                                }}>
                                    <Paragraph style={{ 
                                        margin: 0, 
                                        color: message.type === 'user' ? 'white' : 'inherit',
                                        fontSize: '13px',
                                        lineHeight: '1.4'
                                    }}>
                                        {message.content}
                                    </Paragraph>
                                    
                                    <Text style={{ 
                                        fontSize: '10px', 
                                        color: message.type === 'user' ? 'rgba(255,255,255,0.6)' : '#999',
                                        display: 'block',
                                        marginTop: 4
                                    }}>
                                        {message.timestamp.toLocaleTimeString()}
                                    </Text>
                                </div>
                                
                                {message.type === 'user' && (
                                    <Avatar 
                                        icon={<UserOutlined />} 
                                        size="small"
                                        style={{ backgroundColor: '#52c41a', marginLeft: 6 }}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                    
                    {isLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
                            <Avatar 
                                icon={<RobotOutlined />} 
                                size="small"
                                style={{ backgroundColor: '#1890ff', marginRight: 6 }}
                            />
                            <div style={{ 
                                background: '#f0f2f5',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Spin size="small" style={{ marginRight: 6 }} />
                                <Text style={{ color: '#666', fontSize: '12px' }}>Думаю...</Text>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Область ввода */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    <TextArea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Вопрос о недвижимости..."
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        style={{ flex: 1, fontSize: '12px' }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        loading={isLoading}
                        disabled={!inputValue.trim()}
                        size="small"
                        style={{ height: 'auto', alignSelf: 'flex-end' }}
                    >
                        Отправить
                    </Button>
                </div>

                {/* Подсказки */}
                <div style={{ marginTop: '8px', textAlign: 'center' }}>
                    <Text style={{ fontSize: '11px', color: '#999' }}>
                        💡 Цены • Районы • Тренды • ROI
                    </Text>
                </div>
            </div>
        </Card>
    );
};

export default DashboardAssistant;
