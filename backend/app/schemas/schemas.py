from typing import List, Optional, Literal
from datetime import datetime
from pydantic import BaseModel, Field, field_validator

# Tipo literal para restringir los días válidos
DiaSemana = Literal["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

# ==========================================
# SCHEMAS PARA EJERCICIO
# ==========================================

class EjercicioBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="El nombre del ejercicio es obligatorio.")
    dia_semana: DiaSemana = Field(..., description="Día de la semana válido.")
    series: int = Field(..., gt=0, description="Las series deben ser mayores a cero.")
    repeticiones: int = Field(..., gt=0, description="Las repeticiones deben ser mayores a cero.")
    peso: Optional[float] = Field(default=None, gt=0.0, description="El peso es opcional, pero si se informa debe ser mayor a cero.")
    notas: Optional[str] = Field(default=None, description="Observaciones adicionales opcionales.")
    orden: int = Field(..., gt=0, description="El orden dentro del día debe ser mayor a cero.")

    @field_validator('nombre')
    @classmethod
    def nombre_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre no puede estar vacío ni contener solo espacios.')
        return v.strip()

class EjercicioCreate(EjercicioBase):
    pass

class EjercicioUpdate(EjercicioBase):
    pass

class EjercicioRead(EjercicioBase):
    id: int
    rutina_id: int

    class Config:
        from_attributes = True


# ==========================================
# SCHEMAS PARA RUTINA
# ==========================================

class RutinaBase(BaseModel):
    nombre: str = Field(..., min_length=1, description="El nombre de la rutina es obligatorio.")
    descripcion: Optional[str] = Field(default=None, description="Descripción opcional de la rutina.")

    @field_validator('nombre')
    @classmethod
    def nombre_not_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('El nombre no puede estar vacío ni contener solo espacios.')
        return v.strip()

class RutinaCreate(RutinaBase):
    pass

class RutinaUpdate(RutinaBase):
    pass

class RutinaRead(RutinaBase):
    id: int
    fecha_creacion: datetime

    class Config:
        from_attributes = True

class RutinaDetailRead(RutinaRead):
    ejercicios: List[EjercicioRead] = []
    
    class Config:
        from_attributes = True
