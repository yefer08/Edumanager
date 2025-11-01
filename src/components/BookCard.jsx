import React, { useContext, useEffect, useState } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';

const BookCard = ({ book }) => {
  const { addFavorite, removeFavorite, isFavorite: checkFavorite } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (!book) return;
    try {
      setIsFavorite(checkFavorite(book.id));
    } catch (e) {
      console.error('Error comprobando favorito:', e);
    }
  }, [book, checkFavorite]);

  const toggleFavorite = () => {
    if (!book) return;
    
    if (!user) {
      alert('Por favor inicia sesión para agregar libros a favoritos');
      return;
    }

    try {
      if (isFavorite) {
        removeFavorite(book.id);
        setIsFavorite(false);
      } else {
        addFavorite(book);
        setIsFavorite(true);
      }
    } catch (e) {
      console.error('Error actualizando favorito desde contexto:', e);
    }
  };

  if (!book) return null;

  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={book.imagen || '/placeholder-book.jpg'} 
          alt={book.titulo}
          loading="lazy"
          onError={(e) => {
            e.target.src = '/placeholder-book.jpg';
          }}
        />
      </div>
      <div className="book-info">
        <h4 className="book-title">{book.titulo}</h4>
        <p className="book-author">{book.autor}</p>
        <p className="book-genre">{book.genero}</p>
        <div className="book-actions">
          <button className="btn-primary">Ver Detalles</button>
          <button
            onClick={toggleFavorite}
            className="btn-secondary"
            aria-pressed={user && isFavorite}
            title={!user ? 'Inicia sesión para agregar a favoritos' : (isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: user && isFavorite ? '#e74c3c' : undefined,
              borderColor: user && isFavorite ? '#e74c3c' : undefined,
              color: user && isFavorite ? 'white' : undefined,
              opacity: !user ? '0.7' : '1',
              cursor: !user ? 'not-allowed' : 'pointer'
            }}
          >
            <span style={{fontSize: '1.1rem'}}>{user && isFavorite ? '♥' : '♡'}</span>
            <span>{!user ? 'Inicia sesión' : (isFavorite ? 'Favorito' : 'Agregar')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(BookCard);