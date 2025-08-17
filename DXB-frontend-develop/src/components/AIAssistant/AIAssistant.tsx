import React, { useState, useRef, useEffect } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { 
    Input, 
    Button, 
    Space, 
    Avatar, 
    Typography, 
    Spin, 
    message, 
    Tag, 
    Divider,
    Tooltip,
    Popconfirm
} from 'antd';
import { 
    SendOutlined, 
    RobotOutlined, 
    UserOutlined, 
    BrainOutlined,
    ClearOutlined,
    HistoryOutlined,
    LightbulbOutlined,
    PropertySafetyOutlined
} from '@ant-design/icons';
import { memoryService, MemoryItem } from '@/services/memoryService';

const { TextArea } = Input;
const { Text, Paragraph } = Typography;

interface ChatMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    memories?: MemoryItem[];
    confidence?: number;
}

interface AIAssistantProps {
    onMemoryAdd?: (memory: MemoryItem) => void;
    showMemories?: boolean;
    maxHeight?: number;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
    onMemoryAdd, 
    showMemories = true,
    maxHeight = 600 
}) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            type: 'assistant',
            content: 'Привет! Я ваш AI-ассистент по недвижимости Dubai. Я помогу вам найти информацию о свойствах, аналитике рынка и дам рекомендации на основе накопленных знаний. Что вас интересует?',
            timestamp: new Date(),
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [conversationContext, setConversationContext] = useState<string>('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Автоскролл к последнему сообщению
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Обработка отправки сообщения
    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            // Поиск релевантных воспоминаний
            const searchQuery = `${conversationContext} ${inputValue}`.trim();
            const memoriesResponse = await memoryService.searchMemories(searchQuery, 5);
            
            // Формируем контекст для ответа
            const context = memoriesResponse.memories
                .map(m => m.text)
                .join(' | ');
            
            // Генерируем ответ на основе найденных воспоминаний
            const response = await generateAIResponse(inputValue, memoriesResponse.memories);
            
            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: response.content,
                timestamp: new Date(),
                memories: memoriesResponse.memories,
                confidence: response.confidence,
            };

            setMessages(prev => [...prev, assistantMessage]);
            
            // Обновляем контекст разговора
            setConversationContext(prev => `${prev} ${inputValue}`.slice(-500)); // Ограничиваем длину

            // Автоматически добавляем важные воспоминания
            if (response.shouldAddMemory && onMemoryAdd) {
                const newMemory: MemoryItem = {
                    text: `User asked: ${inputValue}. AI responded: ${response.content}`,
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

        } catch (error) {
            console.error('Error generating response:', error);
            message.error('Извините, произошла ошибка. Попробуйте еще раз.');
            
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'Извините, у меня возникли технические проблемы. Попробуйте переформулировать вопрос или обратитесь позже.',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    // Генерация AI ответа
    const generateAIResponse = async (userQuery: string, memories: MemoryItem[]) => {
        // Анализируем тип запроса
        const queryType = analyzeQueryType(userQuery);
        
        let response = '';
        let confidence = 0.7;
        let shouldAddMemory = false;

        if (memories.length > 0) {
            // У нас есть релевантные воспоминания
            const relevantMemory = memories[0];
            confidence = relevantMemory.similarity || 0.8;
            
            switch (queryType) {
                case 'property':
                    response = generatePropertyResponse(userQuery, memories);
                    break;
                case 'analytics':
                    response = generateAnalyticsResponse(userQuery, memories);
                    break;
                case 'market':
                    response = generateMarketResponse(userQuery, memories);
                    break;
                case 'recommendation':
                    response = generateRecommendationResponse(userQuery, memories);
                    break;
                default:
                    response = generateGeneralResponse(userQuery, memories);
            }
            
            shouldAddMemory = true;
        } else {
            // Нет релевантных воспоминаний
            response = generateDefaultResponse(userQuery);
            confidence = 0.3;
        }

        return { content: response, confidence, shouldAddMemory };
    };

    // Анализ типа запроса
    const analyzeQueryType = (query: string): string => {
        const lowerQuery = query.toLowerCase();
        
        if (lowerQuery.includes('недвижимость') || lowerQuery.includes('собственность') || 
            lowerQuery.includes('вилла') || lowerQuery.includes('апартаменты')) {
            return 'property';
        }
        
        if (lowerQuery.includes('аналитика') || lowerQuery.includes('статистика') || 
            lowerQuery.includes('тренды') || lowerQuery.includes('рынок')) {
            return 'analytics';
        }
        
        if (lowerQuery.includes('рекомендации') || lowerQuery.includes('совет') || 
            lowerQuery.includes('что делать')) {
            return 'recommendation';
        }
        
        if (lowerQuery.includes('цены') || lowerQuery.includes('стоимость') || 
            lowerQuery.includes('инвестиции')) {
            return 'market';
        }
        
        return 'general';
    };

    // Генерация ответов по типам
    const generatePropertyResponse = (query: string, memories: MemoryItem[]): string => {
        const propertyMemories = memories.filter(m => m.type === 'property');
        
        if (propertyMemories.length > 0) {
            const memory = propertyMemories[0];
            return `На основе моих знаний о недвижимости Dubai, ${memory.text}. Это может быть полезно для вашего запроса: "${query}". Хотите узнать больше деталей?`;
        }
        
        return `Я понимаю ваш интерес к недвижимости Dubai. К сожалению, у меня пока недостаточно информации по вашему конкретному запросу. Попробуйте задать вопрос более конкретно, например, о конкретном районе или типе недвижимости.`;
    };

    const generateAnalyticsResponse = (query: string, memories: MemoryItem[]): string => {
        const analyticsMemories = memories.filter(m => m.type === 'analytics');
        
        if (analyticsMemories.length > 0) {
            const memory = analyticsMemories[0];
            return `Согласно аналитическим данным: ${memory.text}. Это показывает текущие тренды рынка Dubai. Нужна ли вам дополнительная информация по конкретным метрикам?`;
        }
        
        return `Аналитика рынка недвижимости Dubai показывает различные тренды. Для получения точных данных по вашему запросу, пожалуйста, уточните, какие именно показатели вас интересуют (цены, объемы продаж, ROI и т.д.).`;
    };

    const generateMarketResponse = (query: string, memories: MemoryItem[]): string => {
        const marketMemories = memories.filter(m => m.type === 'property' || m.type === 'analytics');
        
        if (marketMemories.length > 0) {
            const memory = marketMemories[0];
            return `Рынок Dubai показывает: ${memory.text}. Это важная информация для понимания текущей ситуации. Хотите углубиться в конкретные аспекты?`;
        }
        
        return `Рынок недвижимости Dubai динамично развивается. Для получения актуальной информации по ценам и трендам, рекомендую уточнить ваш запрос или обратиться к нашим специалистам.`;
    };

    const generateRecommendationResponse = (query: string, memories: MemoryItem[]): string => {
        const relevantMemories = memories.slice(0, 3);
        
        if (relevantMemories.length > 0) {
            const insights = relevantMemories.map(m => m.text).join(' ');
            return `На основе анализа доступной информации: ${insights}. Мои рекомендации: внимательно изучите рынок, проконсультируйтесь со специалистами и рассмотрите долгосрочные перспективы.`;
        }
        
        return `Для дачи точных рекомендаций мне нужно больше контекста. Расскажите подробнее о ваших целях, бюджете и предпочтениях, и я смогу дать более персонализированные советы.`;
    };

    const generateGeneralResponse = (query: string, memories: MemoryItem[]): string => {
        if (memories.length > 0) {
            const memory = memories[0];
            return `Интересный вопрос! У меня есть информация: ${memory.text}. Это может быть связано с вашим запросом. Могу ли я помочь вам более конкретно?`;
        }
        
        return `Спасибо за ваш вопрос! Я специализируюсь на недвижимости Dubai и могу помочь с информацией о свойствах, аналитике рынка, ценах и рекомендациях. Попробуйте задать вопрос более конкретно.`;
    };

    const generateDefaultResponse = (query: string): string => {
        return `Я понимаю ваш интерес к "${query}", но у меня пока недостаточно информации по этому вопросу. Попробуйте переформулировать запрос или задать вопрос о недвижимости Dubai, аналитике рынка или конкретных свойствах.`;
    };

    // Очистка истории
    const handleClearHistory = () => {
        setMessages([
            {
                id: '1',
                type: 'assistant',
                content: 'История очищена. Чем могу помочь?',
                timestamp: new Date(),
            }
        ]);
        setConversationContext('');
    };

    // Обработка Enter
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Форматирование сообщения
    const formatMessage = (message: ChatMessage) => {
        const isUser = message.type === 'user';
        
        return (
            <div
                key={message.id}
                style={{
                    display: 'flex',
                    marginBottom: 16,
                    justifyContent: isUser ? 'flex-end' : 'flex-start',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
                    {!isUser && (
                        <Avatar 
                            icon={<RobotOutlined />} 
                            style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                        />
                    )}
                    
                    <div style={{ 
                        background: isUser ? '#1890ff' : '#f0f2f5',
                        color: isUser ? 'white' : 'inherit',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        maxWidth: '100%',
                        wordWrap: 'break-word'
                    }}>
                        <Paragraph style={{ 
                            margin: 0, 
                            color: isUser ? 'white' : 'inherit',
                            fontSize: '14px',
                            lineHeight: '1.5'
                        }}>
                            {message.content}
                        </Paragraph>
                        
                        {message.confidence !== undefined && (
                            <div style={{ marginTop: 8 }}>
                                <Tag 
                                    color={message.confidence > 0.7 ? 'green' : message.confidence > 0.5 ? 'orange' : 'red'}
                                    size="small"
                                >
                                    Уверенность: {Math.round(message.confidence * 100)}%
                                </Tag>
                            </div>
                        )}
                        
                        {showMemories && message.memories && message.memories.length > 0 && (
                            <div style={{ marginTop: 12 }}>
                                <Divider style={{ margin: '8px 0', borderColor: isUser ? 'rgba(255,255,255,0.3)' : '#d9d9d9' }} />
                                <Text style={{ 
                                    fontSize: '12px', 
                                    color: isUser ? 'rgba(255,255,255,0.8)' : '#666',
                                    display: 'block',
                                    marginBottom: 8
                                }}>
                                    📚 Источники знаний:
                                </Text>
                                {message.memories.slice(0, 2).map((memory, index) => (
                                    <div key={index} style={{ 
                                        background: isUser ? 'rgba(255,255,255,0.1)' : '#fff',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        marginBottom: 4,
                                        fontSize: '12px'
                                    }}>
                                        <Text style={{ 
                                            color: isUser ? 'rgba(255,255,255,0.9)' : '#666',
                                            fontStyle: 'italic'
                                        }}>
                                            {memory.text.length > 100 ? `${memory.text.slice(0, 100)}...` : memory.text}
                                        </Text>
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        <Text style={{ 
                            fontSize: '11px', 
                            color: isUser ? 'rgba(255,255,255,0.6)' : '#999',
                            display: 'block',
                            marginTop: 8
                        }}>
                            {message.timestamp.toLocaleTimeString()}
                        </Text>
                    </div>
                    
                    {isUser && (
                        <Avatar 
                            icon={<UserOutlined />} 
                            style={{ backgroundColor: '#52c41a', marginLeft: 8 }}
                        />
                    )}
                </div>
            </div>
        );
    };

    return (
        <ProCard
            title={
                <Space>
                    <BrainOutlined style={{ color: '#1890ff' }} />
                    <span>AI Ассистент по Недвижимости</span>
                </Space>
            }
            extra={
                <Space>
                    <Tooltip title="Очистить историю">
                        <Popconfirm
                            title="Очистить историю разговора?"
                            onConfirm={handleClearHistory}
                            okText="Да"
                            cancelText="Нет"
                        >
                            <Button 
                                icon={<ClearOutlined />} 
                                size="small"
                                type="text"
                            />
                        </Popconfirm>
                    </Tooltip>
                    <Tooltip title="История разговора">
                        <Button 
                            icon={<HistoryOutlined />} 
                            size="small"
                            type="text"
                        />
                    </Tooltip>
                </Space>
            }
            style={{ height: maxHeight }}
        >
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: maxHeight - 120,
                overflow: 'hidden'
            }}>
                {/* Область сообщений */}
                <div style={{ 
                    flex: 1, 
                    overflowY: 'auto', 
                    padding: '16px',
                    background: '#fafafa',
                    borderRadius: '8px',
                    marginBottom: '16px'
                }}>
                    {messages.map(formatMessage)}
                    
                    {isLoading && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
                            <Avatar 
                                icon={<RobotOutlined />} 
                                style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                            />
                            <div style={{ 
                                background: '#f0f2f5',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <Spin size="small" style={{ marginRight: 8 }} />
                                <Text style={{ color: '#666' }}>Думаю...</Text>
                            </div>
                        </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                </div>

                {/* Область ввода */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    <TextArea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Задайте вопрос о недвижимости Dubai..."
                        autoSize={{ minRows: 2, maxRows: 4 }}
                        style={{ flex: 1 }}
                    />
                    <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleSendMessage}
                        loading={isLoading}
                        disabled={!inputValue.trim()}
                        style={{ height: 'auto', alignSelf: 'flex-end' }}
                    >
                        Отправить
                    </Button>
                </div>

                {/* Подсказки */}
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                    <Text style={{ fontSize: '12px', color: '#999' }}>
                        💡 Попробуйте спросить о: ценах, районах, трендах рынка, инвестициях
                    </Text>
                </div>
            </div>
        </ProCard>
    );
};

export default AIAssistant;
