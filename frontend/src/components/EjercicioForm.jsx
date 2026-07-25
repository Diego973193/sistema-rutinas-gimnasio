import { useState, useEffect } from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Alert, MenuItem 
} from '@mui/material';
import { agregarEjercicio, actualizarEjercicio } from '../services/ejercicioService';

const diasValidos = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const EjercicioForm = ({ open, handleClose, rutinaId, onEjercicioCreado, ejercicioAEditar = null, onEjercicioEditado }) => {
  const [nombre, setNombre] = useState('');
  const [diaSemana, setDiaSemana] = useState('Lunes');
  const [series, setSeries] = useState(1);
  const [repeticiones, setRepeticiones] = useState(1);
  const [peso, setPeso] = useState('');
  const [notas, setNotas] = useState('');
  const [orden, setOrden] = useState(1);
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleIntegerChange = (e, setter) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setter(val);
  };

  const handleDecimalChange = (e, setter) => {
    let val = e.target.value.replace(/[^0-9.]/g, '');
    const parts = val.split('.');
    if (parts.length > 2) {
      val = parts[0] + '.' + parts.slice(1).join('');
    }
    setter(val);
  };

  useEffect(() => {
    if (open && ejercicioAEditar) {
      setNombre(ejercicioAEditar.nombre || '');
      setDiaSemana(ejercicioAEditar.dia_semana || 'Lunes');
      setSeries(ejercicioAEditar.series || 1);
      setRepeticiones(ejercicioAEditar.repeticiones || 1);
      setPeso(ejercicioAEditar.peso != null ? ejercicioAEditar.peso : '');
      setNotas(ejercicioAEditar.notas || '');
      setOrden(ejercicioAEditar.orden || 1);
    } else if (open && !ejercicioAEditar) {
      setNombre('');
      setDiaSemana('Lunes');
      setSeries(1);
      setRepeticiones(1);
      setPeso('');
      setNotas('');
      setOrden(1);
    }
  }, [open, ejercicioAEditar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setError('El nombre del ejercicio es obligatorio.');
      return;
    }
    if (!diasValidos.includes(diaSemana)) {
      setError('Día de la semana inválido.');
      return;
    }
    const ser = parseInt(series, 10);
    const rep = parseInt(repeticiones, 10);
    const ord = parseInt(orden, 10);
    
    if (isNaN(ser) || ser <= 0) {
      setError('Las series deben ser mayor a cero.'); return;
    }
    if (isNaN(rep) || rep <= 0) {
      setError('Las repeticiones deben ser mayor a cero.'); return;
    }
    if (isNaN(ord) || ord <= 0) {
      setError('El orden debe ser mayor a cero.'); return;
    }

    let pesoVal = null;
    if (peso.toString().trim() !== '') {
      pesoVal = parseFloat(peso);
      if (isNaN(pesoVal) || pesoVal <= 0) {
        setError('El peso debe ser mayor a cero si se indica.'); return;
      }
    }

    setError('');
    setIsSubmitting(true);
    try {
      const data = {
        nombre: nombre.trim(),
        dia_semana: diaSemana,
        series: ser,
        repeticiones: rep,
        peso: pesoVal,
        notas: notas.trim() || null,
        orden: ord
      };
      
      if (ejercicioAEditar) {
        const ejercicioActualizado = await actualizarEjercicio(ejercicioAEditar.id, data);
        onEjercicioEditado(ejercicioActualizado);
      } else {
        const nuevoEjercicio = await agregarEjercicio(rutinaId, data);
        onEjercicioCreado(nuevoEjercicio);
      }
      
      handleClose();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError(ejercicioAEditar ? 'Ocurrió un error al editar el ejercicio.' : 'Ocurrió un error de conexión al crear el ejercicio.');
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
      <DialogTitle>{ejercicioAEditar ? 'Editar Ejercicio' : 'Agregar Ejercicio'}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            autoFocus margin="dense" label="Nombre del ejercicio *"
            type="text" fullWidth variant="outlined"
            value={nombre} onChange={(e) => setNombre(e.target.value)}
          />
          
          <TextField
            select margin="dense" label="Día de la semana *"
            fullWidth variant="outlined" value={diaSemana}
            onChange={(e) => setDiaSemana(e.target.value)}
            sx={{ mt: 2 }}
          >
            {diasValidos.map((dia) => (
              <MenuItem key={dia} value={dia}>
                {dia}
              </MenuItem>
            ))}
          </TextField>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <TextField
              label="Series *" type="text" variant="outlined" fullWidth
              value={series} onChange={(e) => handleIntegerChange(e, setSeries)}
              inputProps={{ inputMode: 'numeric' }}
            />
            <TextField
              label="Repeticiones *" type="text" variant="outlined" fullWidth
              value={repeticiones} onChange={(e) => handleIntegerChange(e, setRepeticiones)}
              inputProps={{ inputMode: 'numeric' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
            <TextField
              label="Peso (kg) (opcional)" type="text" variant="outlined" fullWidth
              value={peso} onChange={(e) => handleDecimalChange(e, setPeso)}
              inputProps={{ inputMode: 'decimal' }}
            />
            <TextField
              label="Orden *" type="text" variant="outlined" fullWidth
              value={orden} onChange={(e) => handleIntegerChange(e, setOrden)}
              inputProps={{ inputMode: 'numeric' }}
            />
          </div>
          
          <TextField
            margin="dense" label="Notas (opcional)" type="text"
            fullWidth variant="outlined" multiline rows={2}
            value={notas} onChange={(e) => setNotas(e.target.value)}
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

export default EjercicioForm;
