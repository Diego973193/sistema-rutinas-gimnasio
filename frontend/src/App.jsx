import { Container, Typography, Box } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RutinasList from './pages/RutinasList';
import RutinaDetail from './pages/RutinaDetail';

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom>
            Sistema de Gestión de Rutinas de Gimnasio
          </Typography>
        </Box>
        <Routes>
          <Route path="/" element={<RutinasList />} />
          <Route path="/rutinas/:id" element={<RutinaDetail />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
