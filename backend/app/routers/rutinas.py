from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List

from app.database import get_session
from app.models.models import Rutina
from app.schemas.schemas import (
    RutinaCreate,
    RutinaRead,
    RutinaUpdate,
    RutinaDetailRead
)

router = APIRouter(prefix="/api/rutinas", tags=["Rutinas"])

@router.get("", response_model=List[RutinaRead])
def read_rutinas(session: Session = Depends(get_session)):
    """Devuelve el listado de todas las rutinas existentes."""
    rutinas = session.exec(select(Rutina)).all()
    return rutinas

@router.get("/buscar", response_model=List[RutinaRead])
def search_rutinas(nombre: str, session: Session = Depends(get_session)):
    """Busca rutinas cuyo nombre contenga el texto enviado (parcial y case-insensitive)."""
    if not nombre or not nombre.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Debe ingresar un texto de búsqueda")
    
    # ilike permite búsqueda insensible a mayúsculas/minúsculas y parcial
    rutinas = session.exec(
        select(Rutina).where(Rutina.nombre.ilike(f"%{nombre}%"))
    ).all()
    return rutinas

@router.get("/{id}", response_model=RutinaDetailRead)
def read_rutina(id: int, session: Session = Depends(get_session)):
    """Devuelve el detalle completo de una rutina específica, incluyendo sus ejercicios."""
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    
    # Ordenar los ejercicios en memoria por día y por orden, sin modificar el ORM base
    dias_orden = {
        "Lunes": 1, "Martes": 2, "Miércoles": 3, 
        "Jueves": 4, "Viernes": 5, "Sábado": 6, "Domingo": 7
    }
    
    if rutina.ejercicios:
        rutina.ejercicios.sort(key=lambda e: (dias_orden.get(e.dia_semana, 99), e.orden))
        
    return rutina

@router.post("", response_model=RutinaRead, status_code=status.HTTP_201_CREATED)
def create_rutina(rutina_in: RutinaCreate, session: Session = Depends(get_session)):
    """Crea una nueva rutina, verificando que el nombre sea único."""
    existing = session.exec(select(Rutina).where(Rutina.nombre == rutina_in.nombre)).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ya existe una rutina con ese nombre")
    
    # Pydantic a SQLModel
    rutina = Rutina.model_validate(rutina_in)
    session.add(rutina)
    session.commit()
    session.refresh(rutina)
    return rutina

@router.put("/{id}", response_model=RutinaRead)
def update_rutina(id: int, rutina_in: RutinaUpdate, session: Session = Depends(get_session)):
    """Actualiza los datos principales de una rutina (nombre y descripción)."""
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    
    # Si el usuario quiere cambiar el nombre, validar que no choque con otra rutina
    if rutina_in.nombre != rutina.nombre:
        existing = session.exec(select(Rutina).where(Rutina.nombre == rutina_in.nombre)).first()
        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Ya existe una rutina con ese nombre")
    
    # Aplicar actualización (PUT implica reemplazo completo de datos editables)
    rutina.nombre = rutina_in.nombre
    rutina.descripcion = rutina_in.descripcion
    
    session.add(rutina)
    session.commit()
    session.refresh(rutina)
    return rutina

@router.delete("/{id}")
def delete_rutina(id: int, session: Session = Depends(get_session)):
    """Elimina una rutina y todos sus ejercicios asociados (por cascada)."""
    rutina = session.get(Rutina, id)
    if not rutina:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Rutina no encontrada")
    
    session.delete(rutina)
    session.commit()
    return {"message": "Rutina eliminada correctamente"}
