from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import create_db_and_tables

# Importar modelos para que SQLModel los registre antes de crear las tablas
import app.models.models

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        create_db_and_tables()
        print("Conexión a la base de datos exitosa. Tablas verificadas.")
    except Exception as e:
        print(f"ERROR CRÍTICO: No se pudo conectar a la base de datos o crear las tablas. Detalle: {e}")
        # Relanzamos la excepción para detener el inicio del backend
        raise
    yield

from app.routers import rutinas, ejercicios

app = FastAPI(
    title="Sistema de Gestión de Rutinas de Gimnasio API",
    description="API para la gestión de rutinas de entrenamiento.",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rutinas.router)
app.include_router(ejercicios.router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "message": "API is healthy"}
