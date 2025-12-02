# Routes package
from .auth import router as auth_router
from .predict import router as predict_router
from .logs import router as logs_router

__all__ = ["auth_router", "predict_router", "logs_router"]
