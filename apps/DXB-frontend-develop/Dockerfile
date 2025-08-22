# 1. Билд-слой
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json yarn.lock ./
RUN corepack enable \
    && yarn install
COPY . .
RUN yarn build

# 2. Продакшн-слой (Nginx)
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
