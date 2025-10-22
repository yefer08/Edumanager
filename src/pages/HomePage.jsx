import React from 'react';
import BookCarousel from '../components/BookCarousel';
import useFetchLibros from '../hooks/useFetchLibros';

const HomePage = () => {
  const { libros, loading, error } = useFetchLibros();

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Bienvenido a BiblioEdu</h1>
        <p>Descubre tu próxima lectura favorita</p>
      </header>
      
      <main>
        <section className="featured-books">
          <BookCarousel books={libros?.slice(0, 6)} />
        </section>
        
        <section className="quick-stats">
          <div className="stat-card">
            <h3>{libros?.length || 0}</h3>
            <p>Libros Disponibles</p>
          </div>
          <div className="stat-card">
            <h3>+1000</h3>
            <p>Usuarios Activos</p>
          </div>
          <div className="stat-card">
            <h3>50+</h3>
            <p>Géneros</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;