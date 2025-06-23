# Запуск проекта через Docker

Этот проект представляет собой микросервисную архитектуру на базе NestJS с использованием Nx монорепозитория.

## Архитектура

Проект состоит из следующих сервисов:

- **Blog Service** (порт 3000) - сервис для работы с блогами, использует PostgreSQL
- **User Service** (порт 3001) - сервис для работы с пользователями, использует MongoDB
- **File Vault Service** (порт 3002) - сервис для работы с файлами, использует MongoDB
- **Notification Service** (порт 3003) - сервис уведомлений

## Быстрый старт

### 1. Подготовка окружения

Скопируйте файл с переменными окружения:
```bash
cp docker.env .env
```

При необходимости отредактируйте переменные в файле `.env`.

### 2. Запуск всех сервисов

```bash
# Запуск всех сервисов
docker-compose up -d

# Или с пересборкой образов
docker-compose up --build -d
```

### 3. Проверка статуса

```bash
# Проверить статус всех контейнеров
docker-compose ps

# Посмотреть логи всех сервисов
docker-compose logs -f

# Посмотреть логи конкретного сервиса
docker-compose logs -f blog-service
```

## Доступные сервисы

После запуска будут доступны следующие сервисы:

### API Сервисы
- **Blog Service**: http://localhost:3000
- **User Service**: http://localhost:3001
- **File Vault Service**: http://localhost:3002
- **Notification Service**: http://localhost:3003

### Базы данных
- **PostgreSQL** (Blog): localhost:5432
- **MongoDB** (User): localhost:27017
- **MongoDB** (File Vault): localhost:27018

### Административные интерфейсы
- **PgAdmin** (PostgreSQL): http://localhost:8082
  - Email: admin@example.com
  - Password: admin123
- **Mongo Express** (User DB): http://localhost:8081
  - Username: admin
  - Password: test123
- **Mongo Express** (File Vault DB): http://localhost:8084
  - Username: admin
  - Password: test123

## Управление сервисами

### Запуск отдельных сервисов

```bash
# Запуск только баз данных
docker-compose up -d blog-postgres user-mongo file-vault-mongo

# Запуск только одного сервиса
docker-compose up -d blog-service

# Запуск сервиса с логами
docker-compose up blog-service
```

### Остановка сервисов

```bash
# Остановка всех сервисов
docker-compose down

# Остановка с удалением volumes (ВНИМАНИЕ: удалит все данные!)
docker-compose down -v

# Остановка конкретного сервиса
docker-compose stop blog-service
```

### Пересборка образов

```bash
# Пересборка всех образов
docker-compose build

# Пересборка конкретного сервиса
docker-compose build blog-service

# Пересборка без кэша
docker-compose build --no-cache
```

## Разработка

### Режим разработки

Для разработки можно использовать отдельные docker-compose файлы для каждого сервиса:

```bash
# Запуск только БД для blog сервиса
cd apps/blog
docker-compose -f docker-compose.dev.yml up -d

# Запуск только БД для user сервиса
cd apps/user
docker-compose -f docker-compose.dev.yml up -d

# Запуск только БД для file-vault сервиса
cd apps/file-vault
docker-compose -f file-vault.compose.dev.yml up -d
```

### Подключение к базам данных

#### PostgreSQL (Blog Service)
```bash
# Подключение через psql
docker exec -it readme-blog-postgres psql -U admin -d readme-blog

# Или через PgAdmin: http://localhost:8082
```

#### MongoDB (User Service)
```bash
# Подключение через mongo shell
docker exec -it readme-user-mongo mongo -u admin -p test123

# Или через Mongo Express: http://localhost:8081
```

#### MongoDB (File Vault Service)
```bash
# Подключение через mongo shell
docker exec -it readme-file-vault-mongo mongo -u admin -p test123

# Или через Mongo Express: http://localhost:8084
```

## Миграции и инициализация

### Blog Service (PostgreSQL)

После запуска сервиса выполните миграции:

```bash
# Выполнение миграций
docker-compose exec blog-service npx prisma migrate deploy --schema libs/blog/models/prisma/schema.prisma

# Генерация Prisma клиента
docker-compose exec blog-service npx prisma generate --schema libs/blog/models/prisma/schema.prisma

# Заполнение тестовыми данными
docker-compose exec blog-service npm run db:seed
```

## Мониторинг

### Просмотр логов

```bash
# Все логи
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs -f blog-service
docker-compose logs -f user-service
docker-compose logs -f file-vault-service
docker-compose logs -f notification-service

# Логи баз данных
docker-compose logs -f blog-postgres
docker-compose logs -f user-mongo
docker-compose logs -f file-vault-mongo
```

### Мониторинг ресурсов

```bash
# Использование ресурсов
docker stats

# Информация о контейнерах
docker-compose ps -a
```

## Устранение неполадок

### Проблемы с портами

Если порты заняты, измените их в файле `.env`:

```env
BLOG_SERVICE_PORT=3010
USER_SERVICE_PORT=3011
# и т.д.
```

### Проблемы с базами данных

```bash
# Перезапуск баз данных
docker-compose restart blog-postgres user-mongo file-vault-mongo

# Проверка здоровья баз данных
docker-compose exec blog-postgres pg_isready -U admin
docker-compose exec user-mongo mongo --eval "db.adminCommand('ping')"
```

### Очистка системы

```bash
# Удаление всех контейнеров и данных
docker-compose down -v

# Очистка неиспользуемых образов
docker system prune -a

# Удаление volumes
docker volume prune
```

## Переменные окружения

Основные переменные в файле `.env`:

```env
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=test123
POSTGRES_DB=readme-blog

# MongoDB (User)
MONGO_USER=admin
MONGO_PASSWORD=test123
MONGO_DB=readme-user

# MongoDB (File Vault)
FILE_VAULT_MONGO_USER=admin
FILE_VAULT_MONGO_PASSWORD=test123
FILE_VAULT_MONGO_DB=readme-file-vault

# PgAdmin
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin123
```

## Полезные команды

```bash
# Проверка статуса всех сервисов
docker-compose ps

# Перезапуск всех сервисов
docker-compose restart

# Обновление образов
docker-compose pull

# Выполнение команды в контейнере
docker-compose exec blog-service bash

# Копирование файлов
docker cp local-file.txt readme-blog-service:/app/
``` 