import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import '../styles/ProfileDropdown.css';

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjY2NjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMVYxOUE0IDQgMCAwIDAgMTYgMTVIOEE0IDQgMCAwIDAgNCAyMVYyMU0xNiA3QTE2IDQgMCAxIDEgOCA3QTQgNCAwIDAgMSAxNiA3WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

const Header = () => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleProfileMenu = () => setIsProfileMenuOpen(v => !v);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  const navigateToProfile = () => {
    window.location.href = '/perfil';
    setIsProfileMenuOpen(false);
  };

  const navigateToRecommendations = () => {
    window.location.href = '/recomendaciones';
    setIsProfileMenuOpen(false);
  };

  const navigateToBiblioteca = () => {
    window.location.href = '/biblioteca';
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        <div className="search-section">
          <SearchBar />
        </div>

        <div className="user-profile">
          {user ? (
            <div className="user-menu" ref={dropdownRef}>
              <button
                className="user-info-button"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
                aria-haspopup="true"
              >
                <div className="user-avatar">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Perfil" onError={(e) => e.target.src = defaultAvatar} />
                  ) : (
                    <svg className="user-avatar-svg" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" fill="#666" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#666" />
                    </svg>
                  )}
                </div>
                <span className="user-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</span>
                <svg className={`dropdown-icon ${isProfileMenuOpen ? 'open' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Perfil" className="dropdown-avatar" onError={(e) => e.target.src = defaultAvatar} />
                    ) : (
                      <svg className="dropdown-avatar" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="8" r="4" fill="#666" />
                        <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#666" />
                      </svg>
                    )}
                    <div className="dropdown-user-info">
                      <div className="dropdown-user-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</div>
                      <div className="dropdown-user-email">{user.email}</div>
                    </div>
                  </div>

                  <div className="dropdown-divider"></div>

                  <div className="dropdown-menu">
                    <button className="dropdown-item" onClick={navigateToProfile}>
                      Mi Perfil
                    </button>
                    <button className="dropdown-item" onClick={navigateToRecommendations}>
                      Recomendaciones
                    </button>
                    <button className="dropdown-item" onClick={navigateToBiblioteca}>
                      Biblioteca
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-actions">
              <button onClick={() => window.location.href = '/login'} className="btn-link">Iniciar sesión</button>
              <button onClick={() => window.location.href = '/register'} className="btn-primary">Registrarse</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;