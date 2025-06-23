# Используем Node.js 18 Alpine для минимального размера образа
FROM node:18-alpine AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./
COPY nx.json ./
COPY tsconfig*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production && npm cache clean --force

# Копируем исходный код
COPY . .

# Сборочный этап
FROM base AS build

# Устанавливаем все зависимости (включая dev)
RUN npm ci

# Собираем все приложения
RUN npx nx run-many --target=build --all --parallel

# Продакшн этап
FROM node:18-alpine AS production

WORKDIR /app

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Копируем package.json и устанавливаем только продакшн зависимости
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Копируем собранные приложения
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/node_modules ./node_modules

# Создаем директории для uploads
RUN mkdir -p uploads tmp && chown -R nestjs:nodejs uploads tmp

USER nestjs

# Expose портов для всех сервисов
EXPOSE 3000 3001 3002 3003

# Команда по умолчанию (можно переопределить в docker-compose)
CMD ["node", "dist/apps/blog/main.js"] 