from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import init_db
from .routes import auth_router, predict_router, logs_router

# Initialize FastAPI app
app = FastAPI(
    title="Nutricam API",
    description="AI-powered nutrition tracking application",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
async def startup_event():
    init_db()

# Include routers
app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(logs_router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to Nutricam API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}
