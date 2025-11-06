import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import AvatarWithInitials from './AvatarWithInitials';
import '../styles/ProfileDropdown.css';

const Header = ({ hideAuthButtons = false, hideSearch = false }) => {
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

  const navigateToFavoritos = () => {
    window.location.href = '/favoritos';
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="main-header">
      <div className="header-content">
        {!hideSearch && (
          <div className="search-section">
            <SearchBar />
          </div>
        )}

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
                  <AvatarWithInitials 
                    name={user.displayName} 
                    email={user.email} 
                    size={40} 
                  />
                </div>
                <span className="user-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</span>
                <svg className={`dropdown-icon ${isProfileMenuOpen ? 'open' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <AvatarWithInitials 
                      name={user.displayName} 
                      email={user.email} 
                      size={48} 
                    />
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
                    <button className="dropdown-item" onClick={navigateToFavoritos}>
                      Favoritos
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
            !hideAuthButtons && (
              <div className="auth-actions">
                <button onClick={() => window.location.href = '/login'} className="btn-link">Iniciar sesión</button>
                <button onClick={() => window.location.href = '/register'} className="btn-primary">Registrarse</button>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;