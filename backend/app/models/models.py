from typing import List, Optional
from datetime import datetime, timezone
from sqlmodel import Field, SQLModel, Relationship

class Ejercicio(SQLModel, table=True):
    __tablename__ = "ejercicios"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    rutina_id: int = Field(foreign_key="rutinas.id", ondelete="CASCADE")
    nombre: str
    dia_semana: str
    series: int
    repeticiones: int
    peso: Optional[float] = Field(default=None)
    notas: Optional[str] = Field(default=None)
    orden: int
    
    # Relación hacia Rutina (propiedad ORM)
    rutina: Optional["Rutina"] = Relationship(back_populates="ejercicios")


class Rutina(SQLModel, table=True):
    __tablename__ = "rutinas"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    nombre: str = Field(unique=True, index=True)
    descripcion: Optional[str] = Field(default=None)
    fecha_creacion: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Relación ORM hacia Ejercicios (No es un campo en la base de datos)
    ejercicios: List[Ejercicio] = Relationship(
        back_populates="rutina", 
        sa_relationship_kwargs={"cascade": "all, delete-orphan"}
    )
