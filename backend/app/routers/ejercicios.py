from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.database import get_session
from app.models.models import Rutina, Ejercicio
from app.schemas.schemas import EjercicioCreate, EjercicioRead, EjercicioUpdate

router = APIRouter(prefix="/api", tags=["Ejercicios"])

@router.post("/rutinas/{id}/ejercicios", response_model=EjercicioRead, status_code=status.HTTP_201_CREATED)
def create_ejercicio(id: int, ejercicio_in: EjercicioCreate, session: Session = Depends(get_session)):
    """Agrega un ejercicio a una rutina existente."""
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    
    # Asignamos el rutina_id obtenido desde la URL (path parameter)
    ejercicio = Ejercicio.model_validate(ejercicio_in, update={"rutina_id": id})
    session.add(ejercicio)
    session.commit()
    session.refresh(ejercicio)
    return ejercicio


@router.put("/ejercicios/{id}", response_model=EjercicioRead)
def update_ejercicio(id: int, ejercicio_in: EjercicioUpdate, session: Session = Depends(get_session)):
    """Actualiza de forma completa los campos de un ejercicio existente."""
    ejercicio = session.get(Ejercicio, id)
    if not ejercicio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")
    
    # Actualización estricta como PUT
    ejercicio.nombre = ejercicio_in.nombre
    ejercicio.dia_semana = ejercicio_in.dia_semana
    ejercicio.series = ejercicio_in.series
    ejercicio.repeticiones = ejercicio_in.repeticiones
    ejercicio.peso = ejercicio_in.peso
    ejercicio.notas = ejercicio_in.notas
    ejercicio.orden = ejercicio_in.orden
    
    session.add(ejercicio)
    session.commit()
    session.refresh(ejercicio)
    return ejercicio


@router.delete("/ejercicios/{id}")
def delete_ejercicio(id: int, session: Session = Depends(get_session)):
    """Elimina un ejercicio existente por su ID."""
    ejercicio = session.get(Ejercicio, id)
    if not ejercicio:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ejercicio no encontrado")
    
    session.delete(ejercicio)
    session.commit()
    return {"message": "Ejercicio eliminado correctamente"}
