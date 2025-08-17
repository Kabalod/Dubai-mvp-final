import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3004;

const MEMORY_BASE_URL = process.env.MEMORY_BASE_URL || 'http://localhost:8080';
const MEMORY_API_KEY = process.env.MEMORY_API_KEY || '';

app.use(cors());
app.use(express.json());

// Middleware для логирования
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Поиск воспоминаний
app.get('/memory/search', async (req, res) => {
  try {
    const { query, topK = 10 } = req.query;
    const response = await axios.get(`${MEMORY_BASE_URL}/memory/search?query=${encodeURIComponent(query as string)}&topK=${topK}`, {
      headers: MEMORY_API_KEY ? { 'x-api-key': MEMORY_API_KEY } : undefined
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Добавление воспоминания
app.post('/memory/add', async (req, res) => {
  try {
    const response = await axios.post(`${MEMORY_BASE_URL}/memory/add`, req.body, {
      headers: MEMORY_API_KEY ? { 'x-api-key': MEMORY_API_KEY } : undefined
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Статистика памяти
app.get('/memory/stats', async (req, res) => {
  try {
    const response = await axios.get(`${MEMORY_BASE_URL}/memory/stats`, {
      headers: MEMORY_API_KEY ? { 'x-api-key': MEMORY_API_KEY } : undefined
    });
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Проверка здоровья Memory Service
app.get('/memory/health', async (req, res) => {
  try {
    const response = await axios.get(`${MEMORY_BASE_URL}/actuator/health`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Информация о сервере
app.get('/info', (req, res) => {
  res.json({
    name: 'memory-mcp-server',
    version: '0.1.0',
    memoryService: MEMORY_BASE_URL,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Memory MCP Server запущен на порту ${PORT}`);
  console.log(`📡 Подключен к Memory Service: ${MEMORY_BASE_URL}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 Memory health: http://localhost:${PORT}/memory/health`);
  console.log(`🔗 Search: http://localhost:${PORT}/memory/search?query=test`);
  console.log(`🔗 Add: POST http://localhost:${PORT}/memory/add`);
});
