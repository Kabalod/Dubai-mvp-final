import { Server } from '@modelcontextprotocol/sdk/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/transports/stdio';
import { z } from 'zod';
import axios from 'axios';

const MEMORY_BASE_URL = process.env.MEMORY_BASE_URL || 'http://localhost:8080';
const MEMORY_API_KEY = process.env.MEMORY_API_KEY || '';

// Схемы входных параметров
const SearchSchema = z.object({
  query: z.string().min(1),
  topK: z.number().int().positive().max(100).optional(),
  filters: z.record(z.any()).optional()
});

const AddSchema = z.object({
  text: z.string().min(1),
  type: z.enum(['system','property','analytics','recommendation','user','agent','market','legal']).default('user'),
  age: z.enum(['day','week','month','year','permanent']).default('month'),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional()
});

const BatchAddSchema = z.object({
  items: z.array(AddSchema)
});

const ExportSchema = z.object({
  format: z.enum(['json','csv','txt']).default('json')
});

const server = new Server({
  name: 'memory-mcp-server',
  version: '0.1.0'
});

// Инструмент: поиск
server.tool(
  new Tool({
    name: 'memory.search',
    description: 'Поиск воспоминаний в Memory LLM',
    inputSchema: SearchSchema,
    execute: async (input) => {
      const { query, topK = 10, filters } = input as z.infer<typeof SearchSchema>;
      const params = new URLSearchParams({ query, topK: String(topK) });
      if (filters) params.set('filters', JSON.stringify(filters));
      const { data } = await axios.get(`${MEMORY_BASE_URL}/memory/search/advanced?${params.toString()}`, {
        headers: MEMORY_API_KEY ? { 'x-api-key': MEMORY_API_KEY } : undefined
      });
      return { ok: true, data };
    }
  })
);

// Инструмент: добавление
server.tool(
  new Tool({
    name: 'memory.add',
    description: 'Добавить новое воспоминание в Memory LLM',
    inputSchema: AddSchema,
    execute: async (input) => {
      const payload = input as z.infer<typeof AddSchema>;
      const { data } = await axios.post(`${MEMORY_BASE_URL}/memory/add`, payload, {
        headers: MEMORY_API_KEY ? { 'x-api-key': MEMORY_API_KEY } : undefined
      });
      return { ok: true, data };
    }
  })
);

// Инструмент: пакетное добавление
server.tool(
  new Tool({
    name: 'memory.batchAdd',
    description: 'Пакетное добавление воспоминаний в Memory LLM',
    inputSchema: BatchAddSchema,
    execute: async (input) => {
      const payload = input as z.infer<typeof BatchAddSchema>;
      const { data } = await axios.post(`${MEMORY_BASE_URL}/memory/batch/add`, payload);
      return { ok: true, data };
    }
  })
);

// Инструмент: статистика
server.tool(
  new Tool({
    name: 'memory.stats',
    description: 'Получить статистику памяти',
    inputSchema: z.object({}).optional(),
    execute: async () => {
      const { data } = await axios.get(`${MEMORY_BASE_URL}/memory/stats`);
      return { ok: true, data };
    }
  })
);

// Инструмент: экспорт
server.tool(
  new Tool({
    name: 'memory.export',
    description: 'Экспорт памяти в формате json/csv/txt',
    inputSchema: ExportSchema,
    execute: async (input) => {
      const { format } = input as z.infer<typeof ExportSchema>;
      const response = await axios.get(`${MEMORY_BASE_URL}/memory/export?format=${format}`, {
        responseType: format === 'json' ? 'json' : 'arraybuffer'
      });
      if (format === 'json') {
        return { ok: true, data: response.data };
      }
      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return { ok: true, data: { format, base64 } };
    }
  })
);

// Инструмент: здоровье
server.tool(
  new Tool({
    name: 'memory.health',
    description: 'Проверить здоровье Memory LLM',
    inputSchema: z.object({}).optional(),
    execute: async () => {
      const { data } = await axios.get(`${MEMORY_BASE_URL}/actuator/health`);
      return { ok: true, data };
    }
  })
);

// Запуск сервера
const transport = new StdioServerTransport();
server.connect(transport);
console.log(`[MCP] memory-mcp-server started on stdio, target ${MEMORY_BASE_URL}`);
