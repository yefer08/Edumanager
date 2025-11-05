import React from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';

const TareasPage = () => {
  const { preferences } = useContext(PreferencesContext);
  const favoritos = preferences?.librosFavoritos || [];

  return (
    <div className="tareas-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1>Favoritos</h1>
          <p>Aquí verás los libros que marques como favoritos</p>
        </div>

        {favoritos.length === 0 ? (
          <div className="no-favorites">
            <p>No tienes libros favoritos aún. Ve a la Biblioteca y marca libros como favoritos.</p>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoritos.map((book, idx) => (
              <BookCard key={book.id || idx} book={book} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default TareasPage;