import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import SearchBar from './SearchBar';
import useSearch from '../hooks/useSearch';
import '../styles/ProfileDropdown.css';

const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjY2NjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMVYxOUE0IDQgMCAwIDAgMTYgMTVIOEE0IDQgMCAwIDAgNCAyMVYyMU0xNiA3QTE2IDQgMCAxIDEgOCA3QTQgNCAwIDAgMSAxNiA3WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

const Header = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const dropdownRef = useRef(null);

  // Cerrar menú cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

    const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchParams.set('search', searchTerm.trim());
      window.location.href = `/biblioteca?${searchParams.toString()}`;
    }
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileMenuOpen(false);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const navigateToProfile = () => {

  const navigateToBiblioteca = () => {
    window.location.href = '/biblioteca';
    setIsProfileMenuOpen(false);
  };
              <SearchBar />
            </div>
            <button type="submit" className="search-button">
              Buscar
            </button>
          </form>
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
                    <img
                      src={user.photoURL}
                      alt="Perfil"
                      onError={(e) => { e.target.src = defaultAvatar; }}
                    />
                  ) : (
                    <svg className="user-avatar-svg" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="4" fill="#666" />
                      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" fill="#666" />
                    </svg>
                  )}
                </div>
                <span className="user-name">
                  {user.displayName || user.email?.split('@')[0] || 'Usuario'}
                </span>
                <svg 
                  className={`dropdown-icon ${isProfileMenuOpen ? 'open' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isProfileMenuOpen && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt="Perfil"
                        className="dropdown-avatar"
                        onError={(e) => { e.target.src = defaultAvatar; }}
                      />
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
                    <button 
                      className="dropdown-item"
                      onClick={navigateToProfile}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21M16 7A4 4 0 1 1 8 7A4 4 0 0 1 16 7Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      Mi Perfil
                    </button>
                    
                    <button 
                      className="dropdown-item"
                      onClick={navigateToRecommendations}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M11.049 2.927C11.3 2.006 12.7 2.006 12.951 2.927L14.4 8.602A1 1 0 0 0 15.32 9.397L21.18 9.397C22.14 9.397 22.55 10.717 21.8 11.302L16.965 14.852A1 1 0 0 0 16.43 15.927L17.88 21.602C18.13 22.523 17.04 23.27 16.29 22.685L11.455 19.135A1 1 0 0 0 10.545 19.135L5.71 22.685C4.96 23.27 3.87 22.523 4.12 21.602L5.57 15.927A1 1 0 0 0 5.035 14.852L0.2 11.302C-0.55 10.717 -0.14 9.397 0.82 9.397L6.68 9.397A1 1 0 0 0 7.6 8.602L9.049 2.927Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      Recomendaciones
                    </button>
                    
                    <button 
                      className="dropdown-item"
                      onClick={navigateToBiblioteca}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                        <path 
                          d="M6.5 2H20V22H6.5A2.5 2.5 0 0 1 4 19.5V4.5A2.5 2.5 0 0 1 6.5 2Z" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      Biblioteca
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item logout-item"
                      onClick={handleLogout}
                        const { handleSearch: performSearch } = useSearch();
                        const { handleSearch } = useSearch();
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path 
                          d="M9 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H9M16 17L21 12L16 7M21 12H9" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                        const handleSearch = async (e) => {
              )}
                        const onSubmitSearch = (e) => {
                            await performSearch(searchTerm.trim());
                            setSearchTerm('');
                            setSearchTerm('');
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;