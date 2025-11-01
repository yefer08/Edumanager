import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { FavoritesProvider } from './context/FavoritesContext';
import HomePage from './pages/HomePage';
import BibliotecaPage from './pages/BibliotecaPage';
import PerfilPage from './pages/PerfilPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TareasPage from './pages/TareasPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <FavoritesProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/biblioteca" element={<BibliotecaPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
              <Route path="/favoritos" element={<TareasPage />} />
              {/* kept compat route: redirect /tareas to /favoritos */}
              <Route path="/tareas" element={<Navigate to="/favoritos" />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
          </Router>
        </FavoritesProvider>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;