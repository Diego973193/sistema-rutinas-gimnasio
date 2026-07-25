import api from '../api/axiosConfig';

export const agregarEjercicio = async (rutinaId, ejercicioData) => {
  const response = await api.post(`/rutinas/${rutinaId}/ejercicios`, ejercicioData);
  return response.data;
};

export const actualizarEjercicio = async (id, ejercicioData) => {
  const response = await api.put(`/ejercicios/${id}`, ejercicioData);
  return response.data;
};

export const eliminarEjercicio = async (id) => {
  const response = await api.delete(`/ejercicios/${id}`);
  return response.data;
};
