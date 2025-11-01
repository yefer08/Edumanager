import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useContext(AuthContext);

  const handleSearch = (e) => {
    e.preventDefault();
    // Lógica de búsqueda aquí
    console.log('Searching for:', searchTerm);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-container">
              <svg 
                className="search-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Nombre: Libro que deseas"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button type="submit" className="search-button">
              Buscar
            </button>
          </form>
        </div>
        
        <div className="user-profile">
          {user ? (
            <div className="user-info">
              <div className="user-avatar">
                <img 
                  src={user.photoURL || '/default-avatar.png'} 
                  alt={user.displayName || 'Usuario'}
                  onError={(e) => {
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <span className="user-name">
                {user.displayName || user.email.split('@')[0]}
              </span>
              <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="/login" className="btn-login">Iniciar Sesión</a>
              <a href="/register" className="btn-register-header">Registrarse</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;