#!/bin/bash

# MaskService Docker Management Utility
# Helps avoid port conflicts and manage containers

set -e

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
PAGES=("login" "dashboard" "tests" "system")
BACKEND_PORTS=(8001 8002 8003 8004)
FRONTEND_PORTS=(8081 8082 8083 8084)

show_help() {
    echo -e "${BLUE}MaskService Docker Manager${NC}"
    echo "=========================="
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  status           Show status of all containers and ports"
    echo "  stop-all         Stop all MaskService containers"
    echo "  clean-all        Stop and remove all MaskService containers"
    echo "  check-ports      Check which ports are in use"
    echo "  start PAGE       Start specific page containers"
    echo "  stop PAGE        Stop specific page containers"
    echo "  restart PAGE     Restart specific page containers"
    echo "  logs PAGE        Show logs for specific page"
    echo ""
    echo "Pages: ${PAGES[*]}"
    echo ""
    echo "Examples:"
    echo "  $0 status"
    echo "  $0 stop-all"
    echo "  $0 start login"
    echo "  $0 check-ports"
}

check_ports() {
    echo -e "${BLUE}[INFO]${NC} Checking port usage..."
    echo ""
    
    for i in "${!PAGES[@]}"; do
        page="${PAGES[$i]}"
        backend_port="${BACKEND_PORTS[$i]}"
        frontend_port="${FRONTEND_PORTS[$i]}"
        
        echo -e "${YELLOW}${page} page:${NC}"
        
        # Check backend port
        if lsof -i :${backend_port} >/dev/null 2>&1; then
            process=$(lsof -i :${backend_port} | tail -n1 | awk '{print $1" "$2}')
            echo -e "  Backend (${backend_port}): ${RED}OCCUPIED${NC} by $process"
        else
            echo -e "  Backend (${backend_port}): ${GREEN}FREE${NC}"
        fi
        
        # Check frontend port
        if lsof -i :${frontend_port} >/dev/null 2>&1; then
            process=$(lsof -i :${frontend_port} | tail -n1 | awk '{print $1" "$2}')
            echo -e "  Frontend (${frontend_port}): ${RED}OCCUPIED${NC} by $process"
        else
            echo -e "  Frontend (${frontend_port}): ${GREEN}FREE${NC}"
        fi
        echo ""
    done
}

show_status() {
    echo -e "${BLUE}[INFO]${NC} MaskService Container Status:"
    echo ""
    
    # Show running containers
    running_containers=$(docker ps --filter "name=maskservice" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" 2>/dev/null || echo "")
    
    if [ -n "$running_containers" ] && [ "$running_containers" != "NAMES	STATUS	PORTS" ]; then
        echo -e "${GREEN}Running Containers:${NC}"
        echo "$running_containers"
        echo ""
    else
        echo -e "${YELLOW}No MaskService containers running.${NC}"
        echo ""
    fi
    
    # Check ports
    check_ports
}

stop_all() {
    echo -e "${YELLOW}[STOP]${NC} Stopping all MaskService containers..."
    
    # Stop containers by name pattern
    containers=$(docker ps -q --filter "name=maskservice" 2>/dev/null || echo "")
    
    if [ -n "$containers" ]; then
        docker stop $containers
        echo -e "${GREEN}[STOP]${NC} All MaskService containers stopped."
    else
        echo -e "${YELLOW}[STOP]${NC} No MaskService containers running."
    fi
}

clean_all() {
    echo -e "${YELLOW}[CLEAN]${NC} Stopping and removing all MaskService containers..."
    
    # Stop and remove containers
    containers=$(docker ps -aq --filter "name=maskservice" 2>/dev/null || echo "")
    
    if [ -n "$containers" ]; then
        docker stop $containers 2>/dev/null || true
        docker rm $containers 2>/dev/null || true
        echo -e "${GREEN}[CLEAN]${NC} All MaskService containers removed."
    else
        echo -e "${YELLOW}[CLEAN]${NC} No MaskService containers found."
    fi
    
    # Clean up networks
    networks=$(docker network ls --filter "name=maskservice" -q 2>/dev/null || echo "")
    if [ -n "$networks" ]; then
        docker network rm $networks 2>/dev/null || true
        echo -e "${GREEN}[CLEAN]${NC} MaskService networks cleaned."
    fi
}

manage_page() {
    local action=$1
    local page=$2
    
    if [[ ! " ${PAGES[@]} " =~ " ${page} " ]]; then
        echo -e "${RED}[ERROR]${NC} Unknown page: $page"
        echo "Available pages: ${PAGES[*]}"
        exit 1
    fi
    
    local page_dir="page/$page/docker/0.1.0"
    
    if [ ! -d "$page_dir" ]; then
        echo -e "${RED}[ERROR]${NC} Docker directory not found: $page_dir"
        exit 1
    fi
    
    cd "$page_dir"
    
    case $action in
        start)
            echo -e "${GREEN}[START]${NC} Starting $page containers..."
            docker-compose up -d
            ;;
        stop)
            echo -e "${YELLOW}[STOP]${NC} Stopping $page containers..."
            docker-compose down
            ;;
        restart)
            echo -e "${BLUE}[RESTART]${NC} Restarting $page containers..."
            docker-compose down
            docker-compose up -d
            ;;
        logs)
            echo -e "${BLUE}[LOGS]${NC} Showing logs for $page..."
            docker-compose logs -f
            ;;
        *)
            echo -e "${RED}[ERROR]${NC} Unknown action: $action"
            exit 1
            ;;
    esac
}

# Main command handling
case "${1:-help}" in
    help|--help|-h)
        show_help
        ;;
    status)
        show_status
        ;;
    stop-all)
        stop_all
        ;;
    clean-all)
        clean_all
        ;;
    check-ports)
        check_ports
        ;;
    start|stop|restart|logs)
        if [ -z "$2" ]; then
            echo -e "${RED}[ERROR]${NC} Page name required for $1 command"
            echo "Usage: $0 $1 <page>"
            echo "Available pages: ${PAGES[*]}"
            exit 1
        fi
        manage_page "$1" "$2"
        ;;
    *)
        echo -e "${RED}[ERROR]${NC} Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac
