import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Button, CircularProgress, Alert, 
  Card, CardContent, Divider, Snackbar 
} from '@mui/material';
import { obtenerRutinaPorId } from '../services/rutinaService';
import { eliminarEjercicio } from '../services/ejercicioService';
import EjercicioForm from '../components/EjercicioForm';
import ConfirmDialog from '../components/ConfirmDialog';

const RutinaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [ejercicioAEditar, setEjercicioAEditar] = useState(null);
  const [ejercicioAEliminar, setEjercicioAEliminar] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const handleEjercicioCreado = (nuevoEj) => {
    setRutina(prev => ({
      ...prev,
      ejercicios: [...(prev.ejercicios || []), nuevoEj]
    }));
    setSuccessMsg('Ejercicio agregado exitosamente.');
  };

  const handleEjercicioEditado = (ejActualizado) => {
    setRutina(prev => ({
      ...prev,
      ejercicios: prev.ejercicios.map(ej => ej.id === ejActualizado.id ? ejActualizado : ej)
    }));
    setSuccessMsg('Ejercicio actualizado exitosamente.');
  };

  const handleDeleteConfirm = async () => {
    if (!ejercicioAEliminar) return;
    try {
      await eliminarEjercicio(ejercicioAEliminar.id);
      setRutina(prev => ({
        ...prev,
        ejercicios: prev.ejercicios.filter(ej => ej.id !== ejercicioAEliminar.id)
      }));
      setSuccessMsg('Ejercicio eliminado exitosamente.');
    } catch (err) {
      setError('Ocurrió un error al eliminar el ejercicio.');
      console.error(err);
    } finally {
      setEjercicioAEliminar(null);
    }
  };

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const data = await obtenerRutinaPorId(id);
        setRutina(data);
      } catch (err) {
        setError('No se pudo cargar la rutina o no existe.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRutina();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !rutina) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Rutina no encontrada.'}</Alert>
        <Button sx={{ mt: 2 }} variant="outlined" onClick={() => navigate('/')}>
          Volver al listado
        </Button>
      </Box>
    );
  }

  // Lógica de agrupamiento de ejercicios por día de la semana
  const diasOrden = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const grouped = {};
  
  if (rutina.ejercicios) {
    rutina.ejercicios.forEach(ex => {
      if (!grouped[ex.dia_semana]) {
        grouped[ex.dia_semana] = [];
      }
      grouped[ex.dia_semana].push(ex);
    });

    // Ordenar ejercicios por campo "orden" dentro de cada día
    Object.keys(grouped).forEach(day => {
      grouped[day].sort((a, b) => a.orden - b.orden);
    });
  }

  // Filtrar solo los días que tienen ejercicios y ordenarlos cronológicamente
  const sortedDays = Object.keys(grouped).sort((a, b) => diasOrden.indexOf(a) - diasOrden.indexOf(b));

  return (
    <Box sx={{ mt: 4, mb: 6, textAlign: 'left' }}>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate('/')}>
        Volver al listado
      </Button>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" gutterBottom>
            {rutina.nombre}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            Creada el: {new Date(rutina.fecha_creacion).toLocaleDateString()}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {rutina.descripcion || 'Sin descripción.'}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h3">
          Ejercicios
        </Typography>
        <Button variant="contained" color="primary" onClick={() => { setEjercicioAEditar(null); setOpenForm(true); }}>
          Agregar ejercicio
        </Button>
      </Box>

      {sortedDays.length === 0 ? (
        <Alert severity="info">Esta rutina aún no tiene ejercicios cargados.</Alert>
      ) : (
        sortedDays.map(day => (
          <Box key={day} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              {day}
            </Typography>
            {grouped[day].map(ex => (
              <Card key={ex.id} sx={{ mb: 2, backgroundColor: '#f9f9f9' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {ex.orden}. {ex.nombre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Series: {ex.series} | Repeticiones: {ex.repeticiones} 
                        {ex.peso != null ? ` | Peso: ${ex.peso} kg` : ''}
                      </Typography>
                      {ex.notas && (
                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                          Notas: {ex.notas}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" color="secondary" onClick={() => { setEjercicioAEditar(ex); setOpenForm(true); }}>
                        Editar
                      </Button>
                      <Button size="small" color="error" onClick={() => setEjercicioAEliminar(ex)}>
                        Eliminar
                      </Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))
      )}

      <EjercicioForm
        open={openForm}
        handleClose={() => { setOpenForm(false); setEjercicioAEditar(null); }}
        rutinaId={id}
        onEjercicioCreado={handleEjercicioCreado}
        ejercicioAEditar={ejercicioAEditar}
        onEjercicioEditado={handleEjercicioEditado}
      />

      <ConfirmDialog
        open={!!ejercicioAEliminar}
        title="Eliminar ejercicio"
        message={`¿Estás seguro que deseas eliminar el ejercicio "${ejercicioAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setEjercicioAEliminar(null)}
      />

      <Snackbar
        open={!!successMsg}
        autoHideDuration={4000}
        onClose={() => setSuccessMsg('')}
        message={successMsg}
      />
    </Box>
  );
};

export default RutinaDetail;
