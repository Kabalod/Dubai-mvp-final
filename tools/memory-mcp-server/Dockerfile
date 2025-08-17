FROM node:18-alpine

WORKDIR /app

# Копируем package файлы
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Собираем проект
RUN npm run build

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S mcp -u 1001

# Меняем владельца файлов
RUN chown -R mcp:nodejs /app
USER mcp

# Открываем порт для MCP
EXPOSE 3004

# Запускаем MCP сервер
CMD ["npm", "start"]
