"""
Project Launcher API Service
Централизованный API для управления запусками всех проектов Dubai
"""

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import uvicorn
import logging
from typing import Dict, Any
from datetime import datetime

from .core.docker import DockerManager
from .core.config import ConfigManager
from .core.monitoring import MonitoringManager
from .api import projects, monitoring, config, auth
from .models.schemas import HealthCheck, SystemInfo
from .utils.logger import setup_logging

# Настройка логирования
setup_logging()
logger = logging.getLogger(__name__)

# Глобальные менеджеры
docker_manager: DockerManager = None
config_manager: ConfigManager = None
monitoring_manager: MonitoringManager = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Управление жизненным циклом приложения"""
    global docker_manager, config_manager, monitoring_manager
    
    # Инициализация при запуске
    logger.info("🚀 Starting Project Launcher API Service...")
    
    try:
        # Инициализация менеджеров
        docker_manager = DockerManager()
        config_manager = ConfigManager()
        monitoring_manager = MonitoringManager()
        
        # Проверка подключения к Docker
        await docker_manager.health_check()
        logger.info("✅ Docker connection established")
        
        # Загрузка конфигураций проектов
        await config_manager.load_projects()
        logger.info("✅ Project configurations loaded")
        
        # Запуск мониторинга
        await monitoring_manager.start()
        logger.info("✅ Monitoring started")
        
        yield
        
    except Exception as e:
        logger.error(f"❌ Failed to initialize services: {e}")
        raise
    finally:
        # Очистка при остановке
        logger.info("🛑 Shutting down Project Launcher...")
        if monitoring_manager:
            await monitoring_manager.stop()
        logger.info("✅ Shutdown complete")


# Создание FastAPI приложения
app = FastAPI(
    title="Dubai Project Launcher API",
    description="Централизованный API для управления запусками всех проектов платформы Dubai",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В production настроить конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключение API роутеров
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(monitoring.router, prefix="/api/v1/monitoring", tags=["Monitoring"])
app.include_router(config.router, prefix="/api/v1/config", tags=["Configuration"])

# Статические файлы для Swagger UI
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_model=Dict[str, Any])
async def root():
    """Корневой endpoint с информацией о сервисе"""
    return {
        "service": "Dubai Project Launcher API",
        "version": "1.0.0",
        "description": "Централизованный API для управления проектами",
        "endpoints": {
            "docs": "/docs",
            "redoc": "/redoc",
            "health": "/health",
            "projects": "/api/v1/projects",
            "monitoring": "/api/v1/monitoring",
            "config": "/api/v1/config"
        },
        "status": "running"
    }


@app.get("/health", response_model=HealthCheck)
async def health_check():
    """Проверка здоровья сервиса"""
    try:
        # Проверка Docker
        docker_healthy = await docker_manager.health_check() if docker_manager else False
        
        # Проверка базы данных
        db_healthy = await config_manager.health_check() if config_manager else False
        
        # Проверка мониторинга
        monitoring_healthy = await monitoring_manager.health_check() if monitoring_manager else False
        
        overall_healthy = all([docker_healthy, db_healthy, monitoring_healthy])
        
        return HealthCheck(
            status="healthy" if overall_healthy else "unhealthy",
            timestamp=datetime.utcnow().isoformat(),
            services={
                "docker": "healthy" if docker_healthy else "unhealthy",
                "database": "healthy" if db_healthy else "unhealthy",
                "monitoring": "healthy" if monitoring_healthy else "unhealthy"
            },
            version="1.0.0"
        )
        
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/system/info", response_model=SystemInfo)
async def system_info():
    """Информация о системе"""
    try:
        return await monitoring_manager.get_system_info()
    except Exception as e:
        logger.error(f"Failed to get system info: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/v1/status")
async def api_status():
    """Статус API и всех сервисов"""
    try:
        projects_status = await projects.get_all_projects_status()
        system_status = await monitoring_manager.get_overview()
        
        return {
            "api": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "projects": projects_status,
            "system": system_status
        }
        
    except Exception as e:
        logger.error(f"API status check failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# Обработчики ошибок
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return {
        "error": "Not Found",
        "message": "The requested resource was not found",
        "path": request.url.path
    }


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    logger.error(f"Internal server error: {exc}")
    return {
        "error": "Internal Server Error",
        "message": "An unexpected error occurred",
        "path": request.url.path
    }


if __name__ == "__main__":
    # Запуск в режиме разработки
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
