import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PreferencesProvider } from './context/PreferencesContext';
import HomePage from './pages/HomePage';
import BibliotecaPage from './pages/BibliotecaPage';
import PerfilPage from './pages/PerfilPage';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PreferencesProvider>
        <Router>
          <div className="App">
            <nav className="navbar">
              <div className="nav-container">
                <h1 className="nav-logo">BiblioEdu</h1>
                <ul className="nav-menu">
                  <li className="nav-item">
                    <a href="/" className="nav-link">Inicio</a>
                  </li>
                  <li className="nav-item">
                    <a href="/biblioteca" className="nav-link">Biblioteca</a>
                  </li>
                  <li className="nav-item">
                    <a href="/perfil" className="nav-link">Perfil</a>
                  </li>
                </ul>
              </div>
            </nav>

            <main className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/biblioteca" element={<BibliotecaPage />} />
                <Route path="/perfil" element={<PerfilPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>

            <footer className="footer">
              <div className="footer-content">
                <p>&copy; 2025 BiblioEdu. Todos los derechos reservados.</p>
                <div className="footer-links">
                  <a href="#" className="footer-link">Términos de Uso</a>
                  <a href="#" className="footer-link">Política de Privacidad</a>
                  <a href="#" className="footer-link">Contacto</a>
                </div>
              </div>
            </footer>
          </div>
        </Router>
      </PreferencesProvider>
    </AuthProvider>
  );
}

export default App;