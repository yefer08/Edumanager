import React from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCarousel from '../components/BookCarousel';
import RecommendationsSystem from '../components/RecommendationsSystem';
import useFetchLibros from '../hooks/useFetchLibros';

const HomePage = () => {
  const { libros, loading, error } = useFetchLibros();

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-page">
      <Navigation />
      <Header />
      
      <main className="main-content-home">
        {/* Sistema de Recomendaciones Inteligente */}
        <RecommendationsSystem />
        
        <section className="catalog-section">
          <h2 className="section-title">📚 Catálogo General</h2>
          <p className="section-subtitle">Explora nuestra colección completa de libros</p>
          <BookCarousel books={libros?.slice(0, 8)} />
        </section>
        
        <section className="quick-stats">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <h3>{libros?.length || 0}</h3>
            <p>Libros Disponibles</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <h3>+1000</h3>
            <p>Usuarios Activos</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
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
            <h2>🧠 BiblioManager - Biblioteca Virtual Inteligente</h2>
            <p>
              Nuestra plataforma utiliza tecnología avanzada para ofrecerte una experiencia 
              personalizada de lectura. El sistema de recomendaciones se adapta a tus gustos 
              y mejora con cada interacción.
            </p>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <h4>Recomendaciones Personalizadas</h4>
                <p>Algoritmos inteligentes basados en tus géneros favoritos</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <h4>Seguimiento de Lectura</h4>
                <p>Historial completo de tus préstamos y favoritos</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🔍</span>
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