import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

# Obtener DATABASE_URL, si no existe usa un valor por defecto para evitar errores de tipo
DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql://usuario:password@localhost:5432/gym_routines_db"
)

# Crear el engine de SQLModel
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    """Crea las tablas en la base de datos basándose en los modelos registrados."""
    SQLModel.metadata.create_all(engine)

def get_session():
    """Generador de sesiones para inyección de dependencias en los endpoints."""
    with Session(engine) as session:
        yield session
