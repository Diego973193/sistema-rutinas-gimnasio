import api from '../api/axiosConfig';

export const obtenerRutinas = async () => {
  const response = await api.get('/rutinas');
  return response.data;
};

export const obtenerRutinaPorId = async (id) => {
  const response = await api.get(`/rutinas/${id}`);
  return response.data;
};

export const buscarRutinas = async (nombre) => {
  const response = await api.get('/rutinas/buscar', {
    params: { nombre },
  });
  return response.data;
};

export const crearRutina = async (rutinaData) => {
  const response = await api.post('/rutinas', rutinaData);
  return response.data;
};

export const actualizarRutina = async (id, rutinaData) => {
  const response = await api.put(`/rutinas/${id}`, rutinaData);
  return response.data;
};

export const eliminarRutina = async (id) => {
  const response = await api.delete(`/rutinas/${id}`);
  return response.data;
};
