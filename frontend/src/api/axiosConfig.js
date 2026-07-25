import axios from 'axios';

// Creamos una instancia de axios configurada
const api = axios.create({
  // Vite expone las variables de entorno con import.meta.env
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
