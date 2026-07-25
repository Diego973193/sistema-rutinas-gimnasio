import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Alert 
} from '@mui/material';
import { crearRutina, actualizarRutina } from '../services/rutinaService';

const RutinaForm = ({ open, handleClose, onRutinaCreada, rutinaAEditar = null, onRutinaEditada }) => {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open && rutinaAEditar) {
      setNombre(rutinaAEditar.nombre || '');
      setDescripcion(rutinaAEditar.descripcion || '');
    } else if (open && !rutinaAEditar) {
      setNombre('');
      setDescripcion('');
    }
  }, [open, rutinaAEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre de la rutina es obligatorio.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      if (rutinaAEditar) {
        const rutinaActualizada = await actualizarRutina(rutinaAEditar.id, {
          nombre: nombre.trim(),
          descripcion: descripcion.trim()
        });
        onRutinaEditada(rutinaActualizada);
      } else {
        const nuevaRutina = await crearRutina({ 
          nombre: nombre.trim(), 
          descripcion: descripcion.trim() 
        });
        onRutinaCreada(nuevaRutina);
      }
      handleClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        // Errores controlados devueltos por FastAPI (ej. nombre duplicado)
        setError(err.response.data.detail);
      } else {
        setError(rutinaAEditar ? 'Ocurrió un error al editar la rutina.' : 'Ocurrió un error de conexión al crear la rutina.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onCancel = () => {
    setError('');
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>{rutinaAEditar ? 'Editar Rutina' : 'Crear Nueva Rutina'}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Nombre de la rutina *"
            type="text"
            fullWidth
            variant="outlined"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={!!error && error.includes('nombre')}
          />
          <TextField
            margin="dense"
            label="Descripción (opcional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} disabled={isSubmitting}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RutinaForm;
