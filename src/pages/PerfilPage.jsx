import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import PreferencesForm from '../components/PreferencesForm';

const PerfilPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { preferences, updatePreferences } = useContext(PreferencesContext);

  const defaultAvatar = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiM2NjY2NjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0yMCAyMVYxOUE0IDQgMCAwIDAgMTYgMTVIOEE0IDQgMCAwIDAgNCAyMVYyMU0xNiA3QTE2IDQgMCAxIDEgOCA3QTQgNCAwIDAgMSAxNiA3WiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+';

  const handlePreferencesSave = (newPreferences) => {
    // Merge new preferences with existing to avoid overwriting fields like librosFavoritos
    const merged = { ...preferences, ...newPreferences };
    updatePreferences(merged);
    alert('Preferencias guardadas exitosamente');
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="perfil-page">
        <Navigation />
        <Header />
        <div className="main-content">
          <div className="no-user">
            <h2>Acceso Requerido</h2>
            <p>Por favor, inicia sesión para ver tu perfil.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="perfil-page">
      <Navigation />
      <Header />
      
      <main className="main-content">
        <header className="profile-header">
          <div className="user-info">
            <div className="avatar">
              <img 
                src={user.photoURL || defaultAvatar} 
                alt="Perfil"
                onError={(e) => {
                  e.target.src = defaultAvatar;
                }}
              />
            </div>
            <div className="user-details">
              <h1>{user.displayName || user.email}</h1>
              <p>{user.email}</p>
              <p>Miembro desde: {user.metadata?.creationTime ? 
                new Date(user.metadata.creationTime).toLocaleDateString() : 
                'Fecha no disponible'
              }</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn-logout">
          Cerrar Sesión
        </button>
      </header>

      <section className="profile-content">
        <div className="stats-section">
          <h2>Estadísticas de Lectura</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Libros Leídos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{preferences?.librosFavoritos ? preferences.librosFavoritos.length : 0}</span>
              <span className="stat-label">Libros Favoritos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">0</span>
              <span className="stat-label">Reseñas Escritas</span>
            </div>
          </div>
        </div>

        <div className="preferences-section">
          <h2>Preferencias</h2>
          <PreferencesForm onSave={handlePreferencesSave} />
        </div>
      </section>
      </main>
    </div>
  );
};

export default PerfilPage;