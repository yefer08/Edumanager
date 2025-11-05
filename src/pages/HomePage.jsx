import React, { useContext } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCarousel from '../components/BookCarousel';
import RecommendationsSystem from '../components/RecommendationsSystem';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import useOpenLibrary from '../hooks/useOpenLibrary';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);
  const { books, loading, error } = useOpenLibrary();

  // Verificar si el usuario tiene preferencias configuradas
  const hasPreferences = preferences && (
    preferences.generoFavorito || 
    (preferences.generosFavoritos && preferences.generosFavoritos.length > 0)
  );

  if (loading) return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Cargando libros desde Open Library...</p>
    </div>
  );
  
  if (error) return (
    <div className="error">
      <p>Error: {error}</p>
      <p>Mostrando contenido de respaldo</p>
    </div>
  );

  return (
    <div className="home-page">
      <Navigation />
      <Header />
      
      <main className="main-content-home">
        {/* Indicador de personalización */}
        {user && hasPreferences && (
          <div className="personalization-indicator">
            <div className="personalization-content">
              <div className="indicator-text">
                <strong>Recomendaciones Personalizadas</strong>
                <p>Basadas en tu género favorito: <strong>{preferences.generoFavorito}</strong></p>
              </div>
            </div>
          </div>
        )}

        {/* Sistema de Recomendaciones Inteligente */}
        <RecommendationsSystem />
        
        <section className="catalog-section">
          <h2 className="section-title">Catálogo General</h2>
          <p className="section-subtitle">Explora nuestra colección de libros reales desde Open Library</p>
          <BookCarousel books={books?.slice(0, 8)} />
        </section>
        
        <section className="quick-stats">
          <div className="stat-card">

            <h3>{books?.length || 0}</h3>
            <p>Libros Cargados</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🌐</div>
            <h3>Open Library</h3>
            <p>Fuente de Datos</p>
          </div>
          <div className="stat-card">

            <h3>50+</h3>
            <p>Géneros</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🤖</div>
            <h3>IA</h3>
            <p>Recomendaciones</p>
          </div>
        </section>
        
        <section className="platform-info">
          <div className="info-container">
            <h2>BiblioManager - Biblioteca Virtual Inteligente</h2>
            <p>
              Nuestra plataforma utiliza la API de Open Library para ofrecerte acceso a millones 
              de libros reales. El sistema de recomendaciones se adapta a tus gustos 
              y mejora con cada interacción.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <h4>Recomendaciones Personalizadas</h4>
                <p>Algoritmos inteligentes basados en tus géneros favoritos</p>
              </div>
              <div className="feature-item">
                <h4>Open Library Integration</h4>
                <p>Acceso a millones de libros reales y verificados</p>
              </div>
              <div className="feature-item">
                <h4>Búsqueda Avanzada</h4>
                <p>Encuentra libros por género, autor o disponibilidad</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📱</span>
                <h4>Acceso Multiplataforma</h4>
                <p>Disponible en desktop y móvil con sincronización</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;