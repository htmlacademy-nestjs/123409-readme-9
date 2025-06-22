#!/bin/bash

# Скрипт для запуска проекта через Docker
# Использование: ./start.sh [простой|полный|только-бд]

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция для вывода цветного текста
print_color() {
    echo -e "${2}${1}${NC}"
}

# Функция для проверки зависимостей
check_dependencies() {
    print_color "Проверка зависимостей..." $BLUE
    
    if ! command -v docker &> /dev/null; then
        print_color "❌ Docker не установлен" $RED
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_color "❌ Docker Compose не установлен" $RED
        exit 1
    fi
    
    print_color "✅ Все зависимости установлены" $GREEN
}

# Функция для подготовки окружения
prepare_env() {
    print_color "Подготовка окружения..." $BLUE
    
    if [ ! -f .env ]; then
        if [ -f docker.env ]; then
            print_color "Копирую docker.env в .env" $YELLOW
            cp docker.env .env
        else
            print_color "⚠️ Файл docker.env не найден, создаю базовый .env" $YELLOW
            cat > .env << EOF
POSTGRES_USER=admin
POSTGRES_PASSWORD=test123
POSTGRES_DB=readme-blog
MONGO_USER=admin
MONGO_PASSWORD=test123
MONGO_DB=readme-user
FILE_VAULT_MONGO_USER=admin
FILE_VAULT_MONGO_PASSWORD=test123
FILE_VAULT_MONGO_DB=readme-file-vault
PGADMIN_DEFAULT_EMAIL=admin@example.com
PGADMIN_DEFAULT_PASSWORD=admin123
EOF
        fi
    fi
    
    print_color "✅ Окружение подготовлено" $GREEN
}

# Функция для запуска полной версии
start_full() {
    print_color "🚀 Запуск полной версии со всеми сервисами..." $GREEN
    docker-compose up --build -d
    
    print_color "📋 Доступные сервисы:" $BLUE
    echo "  • Blog Service: http://localhost:3000"
    echo "  • User Service: http://localhost:3001"
    echo "  • File Vault Service: http://localhost:3002"
    echo "  • Notification Service: http://localhost:3003"
    echo "  • PgAdmin: http://localhost:8082"
    echo "  • User Mongo Express: http://localhost:8081"
    echo "  • File Vault Mongo Express: http://localhost:8084"
}

# Функция для запуска упрощенной версии
start_simple() {
    print_color "🚀 Запуск упрощенной версии (только основные сервисы)..." $GREEN
    docker-compose -f docker-compose.simple.yml up --build -d
    
    print_color "📋 Доступные сервисы:" $BLUE
    echo "  • Blog Service: http://localhost:3000"
    echo "  • User Service: http://localhost:3001"
    echo "  • File Vault Service: http://localhost:3002"
    echo "  • Notification Service: http://localhost:3003"
}

# Функция для запуска только баз данных
start_databases() {
    print_color "🗄️ Запуск только баз данных..." $GREEN
    docker-compose up -d blog-postgres user-mongo file-vault-mongo
    
    print_color "📋 Доступные базы данных:" $BLUE
    echo "  • PostgreSQL: localhost:5432"
    echo "  • User MongoDB: localhost:27017"
    echo "  • File Vault MongoDB: localhost:27018"
}

# Функция для показа статуса
show_status() {
    print_color "📊 Статус контейнеров:" $BLUE
    docker-compose ps
}

# Функция для показа логов
show_logs() {
    print_color "📝 Логи сервисов:" $BLUE
    docker-compose logs -f
}

# Функция для остановки сервисов
stop_services() {
    print_color "🛑 Остановка всех сервисов..." $YELLOW
    docker-compose down
    print_color "✅ Все сервисы остановлены" $GREEN
}

# Функция для показа помощи
show_help() {
    print_color "🐳 Скрипт управления Docker-контейнерами проекта" $BLUE
    echo ""
    echo "Использование: $0 [команда]"
    echo ""
    echo "Команды:"
    echo "  полный        - Запуск всех сервисов с админ-панелями (по умолчанию)"
    echo "  простой       - Запуск только основных сервисов"
    echo "  только-бд     - Запуск только баз данных"
    echo "  статус        - Показать статус контейнеров"
    echo "  логи          - Показать логи сервисов"
    echo "  стоп          - Остановить все сервисы"
    echo "  помощь        - Показать эту справку"
    echo ""
    echo "Примеры:"
    echo "  $0                    # Запуск полной версии"
    echo "  $0 простой            # Запуск упрощенной версии"
    echo "  $0 только-бд          # Запуск только БД"
    echo "  $0 статус             # Проверка статуса"
}

# Основная логика
main() {
    case "${1:-полный}" in
        "полный"|"full")
            check_dependencies
            prepare_env
            start_full
            ;;
        "простой"|"simple")
            check_dependencies
            prepare_env
            start_simple
            ;;
        "только-бд"|"db-only")
            check_dependencies
            prepare_env
            start_databases
            ;;
        "статус"|"status")
            show_status
            ;;
        "логи"|"logs")
            show_logs
            ;;
        "стоп"|"stop")
            stop_services
            ;;
        "помощь"|"help"|"-h"|"--help")
            show_help
            ;;
        *)
            print_color "❌ Неизвестная команда: $1" $RED
            show_help
            exit 1
            ;;
    esac
}

# Запуск основной функции
main "$@" 