import { useEffect, useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  CircularProgress, 
  Grid,
  Alert,
  Snackbar,
  TextField
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { obtenerRutinas, buscarRutinas, eliminarRutina } from '../services/rutinaService';
import RutinaForm from '../components/RutinaForm';
import ConfirmDialog from '../components/ConfirmDialog';

const RutinasList = () => {
  const navigate = useNavigate();
  const [rutinas, setRutinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [rutinaAEditar, setRutinaAEditar] = useState(null);
  const [rutinaAEliminar, setRutinaAEliminar] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadRutinas = async (query = '') => {
    setLoading(true);
    try {
      let data;
      if (query.trim() === '') {
        data = await obtenerRutinas();
      } else {
        data = await buscarRutinas(query.trim());
      }
      setRutinas(data);
      setError(null);
    } catch (err) {
      setError('Ocurrió un error al buscar/cargar las rutinas.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadRutinas(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleRutinaCreada = (nuevaRutina) => {
    // Actualizamos el listado con la nueva rutina
    setRutinas([...rutinas, nuevaRutina]);
    setSuccessMsg('Rutina creada correctamente.');
  };

  const handleRutinaEditada = (rutinaActualizada) => {
    setRutinas(rutinas.map(r => r.id === rutinaActualizada.id ? rutinaActualizada : r));
    setSuccessMsg('Rutina actualizada correctamente.');
  };

  const handleDeleteConfirm = async () => {
    if (!rutinaAEliminar) return;
    try {
      await eliminarRutina(rutinaAEliminar.id);
      setRutinas(rutinas.filter(r => r.id !== rutinaAEliminar.id));
      setSuccessMsg('Rutina eliminada correctamente.');
    } catch (err) {
      setError('Ocurrió un error al intentar eliminar la rutina. Puede que ya no exista.');
      console.error(err);
    } finally {
      setRutinaAEliminar(null);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h2">
          Listado de Rutinas
        </Typography>
        <Button variant="contained" color="primary" onClick={() => { setRutinaAEditar(null); setOpenForm(true); }}>
          Nueva Rutina
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Buscar rutina por nombre..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : rutinas.length === 0 ? (
        <Alert severity="info">
          {searchTerm.trim() !== '' 
            ? 'No se encontraron rutinas que coincidan con la búsqueda.' 
            : 'No hay rutinas creadas actualmente. Cuando agregues rutinas, aparecerán aquí.'}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {rutinas.map((rutina) => (
            <Grid item xs={12} sm={6} md={4} key={rutina.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {rutina.nombre}
                  </Typography>
                  <Typography color="text.secondary" gutterBottom>
                    {new Date(rutina.fecha_creacion).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {rutina.descripcion || 'Sin descripción'}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" onClick={() => navigate(`/rutinas/${rutina.id}`)}>Ver detalle</Button>
                  <Button size="small" color="secondary" onClick={() => { setRutinaAEditar(rutina); setOpenForm(true); }}>Editar</Button>
                  <Button size="small" color="error" onClick={() => setRutinaAEliminar(rutina)}>Eliminar</Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <RutinaForm 
        open={openForm} 
        handleClose={() => { setOpenForm(false); setRutinaAEditar(null); }} 
        onRutinaCreada={handleRutinaCreada}
        rutinaAEditar={rutinaAEditar}
        onRutinaEditada={handleRutinaEditada}
      />

      <ConfirmDialog
        open={!!rutinaAEliminar}
        title="Eliminar rutina"
        message={`¿Estás seguro que deseas eliminar la rutina "${rutinaAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setRutinaAEliminar(null)}
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

export default RutinasList;
