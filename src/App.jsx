import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import Footer from './components/Footer';
import './App.css';

// Lazy loading de componentes
const HomePage = lazy(() => import('./pages/HomePage'));
const BibliotecaPage = lazy(() => import('./pages/BibliotecaPage'));
const PerfilPage = lazy(() => import('./pages/PerfilPage'));
const TareasPage = lazy(() => import('./pages/TareasPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <Router>
          <div className="App">
            <Suspense fallback={<div className="loading-page">Cargando...</div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/biblioteca" element={<BibliotecaPage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="/favoritos" element={<TareasPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </Suspense>
            <Footer />
          </div>
        </Router>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;