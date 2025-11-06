import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import PreferencesForm from '../components/PreferencesForm';
import AvatarWithInitials from '../components/AvatarWithInitials';
import BookCardSimple from '../components/BookCardSimple';

const PerfilPage = () => {
  const { user, logout } = useContext(AuthContext);
  const { preferences, updatePreferences } = useContext(PreferencesContext);

  const handlePreferencesSave = (newPreferences) => {
    // Merge new preferences with existing to avoid overwriting fields like librosFavoritos
    const merged = { ...preferences, ...newPreferences };
    updatePreferences(merged);
    alert('Preferencias guardadas exitosamente');
  };

  const handleLogout = () => {
    logout();
  };

  // Calcular días como miembro
  const getDaysSinceMember = () => {
    if (!user?.metadata?.creationTime) return 0;
    const creationDate = new Date(user.metadata.creationTime);
    const today = new Date();
    const diffTime = Math.abs(today - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtener género favorito (el que más aparece en sus preferencias)
  const getFavoriteGenre = () => {
    if (!preferences?.generosFavoritos || preferences.generosFavoritos.length === 0) {
      return 'No definido';
    }
    return preferences.generosFavoritos[0];
  };

  // Obtener últimos libros favoritos (máximo 6)
  const getRecentFavorites = () => {
    if (!preferences?.librosFavoritos) return [];
    return preferences.librosFavoritos.slice(-6).reverse();
  };

  if (!user) {
    return (
      <div className="perfil-page">
        <Navigation />
        <Header hideSearch={true} />
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
      <Header hideSearch={true} />
      
      <main className="main-content">
        <header className="profile-header-new">
          <div className="profile-card">
            <AvatarWithInitials 
              name={user.displayName} 
              email={user.email} 
              size={120} 
            />
            <h1 className="profile-name">{user.displayName || user.email?.split('@')[0] || 'Usuario'}</h1>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member-date">🎯 Miembro hace {getDaysSinceMember()} días</p>
          </div>
        </header>

        <section className="stats-section-new">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <span className="stat-number">{preferences?.librosFavoritos?.length || 0}</span>
              <span className="stat-label">Libros Favoritos</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">❤️</div>
            <div className="stat-content">
              <span className="stat-number">{getFavoriteGenre()}</span>
              <span className="stat-label">Género Favorito</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎉</div>
            <div className="stat-content">
              <span className="stat-number">{getDaysSinceMember()}</span>
              <span className="stat-label">Días Activo</span>
            </div>
          </div>
        </section>

        {getRecentFavorites().length > 0 && (
          <section className="favorites-preview-section">
            <div className="section-header">
              <h2>❤️ Tus Libros Favoritos Recientes</h2>
              <a href="/favoritos" className="view-all-link">Ver todos →</a>
            </div>
            <div className="favorites-preview-grid">
              {getRecentFavorites().map(book => (
                <BookCardSimple key={book.id} book={book} />
              ))}
            </div>
          </section>
        )}

        {(!preferences?.librosFavoritos || preferences.librosFavoritos.length === 0) && (
          <section className="no-favorites-section">
            <div className="no-favorites-card">
              <span className="no-favorites-icon">📖</span>
              <h3>Aún no tienes libros favoritos</h3>
              <p>Explora nuestra biblioteca y agrega tus primeros favoritos</p>
              <a href="/biblioteca" className="btn-explore">Explorar Biblioteca</a>
            </div>
          </section>
        )}

        <section className="preferences-section">
          <h2>⚙️ Preferencias de Lectura</h2>
          <PreferencesForm onSave={handlePreferencesSave} />
        </section>
      </main>
    </div>
  );
};

export default PerfilPage;