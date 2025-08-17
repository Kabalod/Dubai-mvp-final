import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/transports/stdio';
import axios from 'axios';

const MEMORY_BASE_URL = process.env.MEMORY_BASE_URL || 'http://localhost:8080';
const MEMORY_API_KEY = process.env.MEMORY_API_KEY || '';

// Создаем простой MCP сервер
const server = new Server({
  name: 'memory-mcp-server',
  version: '0.1.0'
});

// Простой обработчик для проверки здоровья
server.setRequestHandler('memory.health', async () => {
  try {
    const response = await axios.get(`${MEMORY_BASE_URL}/actuator/health`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// Обработчик для поиска
server.setRequestHandler('memory.search', async (params) => {
  try {
    const { query, topK = 10 } = params as any;
    const response = await axios.get(`${MEMORY_BASE_URL}/memory/search?query=${encodeURIComponent(query)}&topK=${topK}`);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

// Обработчик для добавления
server.setRequestHandler('memory.add', async (params) => {
  try {
    const payload = params as any;
    const response = await axios.post(`${MEMORY_BASE_URL}/memory/add`, payload);
    return { ok: true, data: response.data };
  } catch (error) {
    return { ok: false, error: error.message };
  }
});

console.log(`[MCP] memory-mcp-server starting on stdio, target ${MEMORY_BASE_URL}`);

// Запускаем сервер
const transport = new StdioServerTransport();
server.connect(transport);

console.log(`[MCP] memory-mcp-server started successfully!`);
