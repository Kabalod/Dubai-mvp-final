#!/bin/bash

# 🚀 Dubai Project Manager
# Единый скрипт управления всеми сервисами проекта

set -e

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Функции для вывода
print_header() {
    echo -e "\n${CYAN}🚀 $1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' $(seq 1 $((${#1} + 4))))${NC}"
}

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${WHITE}ℹ️  $1${NC}"
}

# Парсинг аргументов
ACTION=${1:-"status"}
SERVICE=${2:-"all"}
FORCE=${3:-""}

# Конфигурация сервисов
declare -A SERVICES
SERVICES=(
    [core]="Core Services:docker-compose.core.yml:8000,8001,8002:Основные бизнес-сервисы (недвижимость, аналитика)"
    [ai]="AI Services:docker-compose.ai.yml:8081,8082,8083:ИИ сервисы (память, агенты, ML модели)"
    [frontend]="Frontend:docker-compose.frontend.yml:3000,3001,3002:Пользовательский интерфейс"
    [infrastructure]="Infrastructure:docker-compose.infrastructure.yml:5432,6379,8080:Базы данных, кэш, API gateway"
    [monitoring]="Monitoring:docker-compose.monitoring.yml:9090,3001,5601:Мониторинг, логирование, метрики"
)

# Проверка Docker
check_docker() {
    if command -v docker &> /dev/null; then
        print_status "Docker найден"
        return 0
    else
        print_error "Docker не найден. Установите Docker"
        return 1
    fi
}

# Проверка Docker Compose
check_docker_compose() {
    if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
        print_status "Docker Compose найден"
        return 0
    else
        print_error "Docker Compose не найден"
        return 1
    fi
}

# Проверка портов
check_ports() {
    local ports=(${1//,/ })
    print_info "🔍 Проверка портов..."
    
    local conflicts=()
    for port in "${ports[@]}"; do
        if netstat -tuln 2>/dev/null | grep -q ":$port "; then
            print_warning "Порт $port занят"
            conflicts+=("$port")
        fi
    done
    
    if [ ${#conflicts[@]} -eq 0 ]; then
        print_status "Все порты свободны"
        return 0
    else
        print_warning "Найдено ${#conflicts[@]} конфликтов портов"
        return 1
    fi
}

# Запуск сервиса
start_service() {
    local service_name=$1
    local service_info=${SERVICES[$service_name]}
    
    if [ -z "$service_info" ]; then
        print_error "Неизвестный сервис: $service_name"
        return
    fi
    
    IFS=':' read -r service_display compose_file ports description <<< "$service_info"
    
    print_header "Запуск $service_display"
    print_info "$description"
    
    # Проверка портов
    if ! check_ports "$ports"; then
        print_warning "Возможны конфликты портов"
        if [ "$FORCE" != "force" ]; then
            print_error "Используйте 'force' для принудительного запуска"
            return
        fi
    fi
    
    # Проверка compose файла
    local compose_path="../infrastructure/docker/$compose_file"
    if [ ! -f "$compose_path" ]; then
        print_warning "Compose файл не найден: $compose_path"
        print_info "Создаем базовый compose файл..."
        create_docker_compose_file "$service_name" "$compose_path" "$ports"
    fi
    
    # Запуск через Docker Compose
    if command -v docker-compose &> /dev/null; then
        docker-compose -f "$compose_path" up -d
    else
        docker compose -f "$compose_path" up -d
    fi
    
    print_status "$service_display запущен"
}

# Остановка сервиса
stop_service() {
    local service_name=$1
    local service_info=${SERVICES[$service_name]}
    
    if [ -z "$service_info" ]; then
        print_error "Неизвестный сервис: $service_name"
        return
    fi
    
    IFS=':' read -r service_display compose_file ports description <<< "$service_info"
    
    print_header "Остановка $service_display"
    
    local compose_path="../infrastructure/docker/$compose_file"
    if [ -f "$compose_path" ]; then
        if command -v docker-compose &> /dev/null; then
            docker-compose -f "$compose_path" down
        else
            docker compose -f "$compose_path" down
        fi
        print_status "$service_display остановлен"
    else
        print_warning "Compose файл не найден: $compose_path"
    fi
}

# Статус сервисов
get_service_status() {
    print_header "Статус сервисов Dubai Project"
    
    for service_name in "${!SERVICES[@]}"; do
        local service_info=${SERVICES[$service_name]}
        IFS=':' read -r service_display compose_file ports description <<< "$service_info"
        
        echo -e "\n${CYAN}📊 $service_display${NC}"
        echo -e "   ${WHITE}Описание: $description${NC}"
        echo -e "   ${WHITE}Порт: $ports${NC}"
        
        # Проверка статуса Docker контейнеров
        local compose_path="../infrastructure/docker/$compose_file"
        if [ -f "$compose_path" ]; then
            if command -v docker-compose &> /dev/null; then
                local containers=$(docker-compose -f "$compose_path" ps --format json 2>/dev/null || echo "")
            else
                local containers=$(docker compose -f "$compose_path" ps --format json 2>/dev/null || echo "")
            fi
            
            if [ -n "$containers" ]; then
                echo "$containers" | while IFS= read -r container; do
                    if [ -n "$container" ]; then
                        local service=$(echo "$container" | grep -o '"Service":"[^"]*"' | cut -d'"' -f4)
                        local state=$(echo "$container" | grep -o '"State":"[^"]*"' | cut -d'"' -f4)
                        
                        if [ "$state" = "running" ]; then
                            echo -e "   🟢 $service: $state${NC}"
                        else
                            echo -e "   🔴 $service: $state${NC}"
                        fi
                    fi
                done
            else
                echo -e "   ${YELLOW}⚪ Нет запущенных контейнеров${NC}"
            fi
        else
            echo -e "   ${YELLOW}📁 Compose файл не найден${NC}"
        fi
    done
}

# Создание базового compose файла
create_docker_compose_file() {
    local service_name=$1
    local compose_path=$2
    local ports=$3
    
    local first_port=$(echo "$ports" | cut -d',' -f1)
    
    mkdir -p "$(dirname "$compose_path")"
    
    cat > "$compose_path" << EOF
version: '3.8'

services:
  ${service_name}-service:
    image: nginx:alpine
    container_name: dubai-${service_name}
    ports:
      - "$first_port:80"
    volumes:
      - ./logs:/var/log/nginx
    restart: unless-stopped

networks:
  default:
    name: dubai-${service_name}-network
EOF
    
    print_status "Создан базовый compose файл: $compose_path"
}

# Основная логика
main() {
    print_header "Dubai Project Manager"
    echo -e "${YELLOW}Действие: $ACTION${NC}"
    echo -e "${YELLOW}Сервис: $SERVICE${NC}"
    echo -e "${YELLOW}Принудительно: $FORCE${NC}"
    
    # Проверка зависимостей
    if ! check_docker; then
        exit 1
    fi
    
    if ! check_docker_compose; then
        exit 1
    fi
    
    # Выполнение действия
    case $ACTION in
        "start")
            if [ "$SERVICE" = "all" ]; then
                for service_name in "${!SERVICES[@]}"; do
                    start_service "$service_name"
                done
            else
                start_service "$SERVICE"
            fi
            ;;
        "stop")
            if [ "$SERVICE" = "all" ]; then
                for service_name in "${!SERVICES[@]}"; do
                    stop_service "$service_name"
                done
            else
                stop_service "$SERVICE"
            fi
            ;;
        "restart")
            if [ "$SERVICE" = "all" ]; then
                for service_name in "${!SERVICES[@]}"; do
                    stop_service "$service_name"
                    sleep 2
                    start_service "$service_name"
                done
            else
                stop_service "$SERVICE"
                sleep 2
                start_service "$SERVICE"
            fi
            ;;
        "status")
            get_service_status
            ;;
        "logs")
            print_info "Просмотр логов (реализовать)"
            ;;
        "cleanup")
            print_info "Очистка (реализовать)"
            ;;
        "setup")
            print_info "Настройка (реализовать)"
            ;;
        *)
            print_error "Неизвестное действие: $ACTION"
            echo "Доступные действия: start, stop, restart, status, logs, cleanup, setup"
            exit 1
            ;;
    esac
}

# Запуск
main
