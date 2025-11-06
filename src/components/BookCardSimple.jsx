import React, { useState, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';
import './BookCardSimple.css';

const BOOK_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNFNUU3RUIiLz4KPHA+YXRoIGQ9Ik00MCA2MEg4MFY2NEg0MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA3MEg4MFY3NEg0MFY3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA4MEg3MFY4NEg0MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00NSA0NUg3NVY1NUg0NVY0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";

const BookCardSimple = ({ book }) => {
  const [imageError, setImageError] = useState(false);
  const { preferences, addFavoriteBook, removeFavoriteBook } = useContext(PreferencesContext);

  if (!book) return null;

  const handleImageError = () => setImageError(true);
  const imageSrc = imageError || !book.imagen ? BOOK_PLACEHOLDER : book.imagen;

  const isFavorited = (preferences?.librosFavoritos || []).some(b => b.id === book.id);

  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFavoriteBook(book.id);
    } else {
      addFavoriteBook({
        id: book.id,
        titulo: book.titulo,
        autor: book.autor,
        imagen: book.imagen,
        genero: book.genero
      });
    }
  };

  const getGenreColor = (genero) => {
    const colors = {
      'Ciencia Ficción': '#4CAF50',
      'Fantasía': '#9C27B0',
      'Misterio': '#FF9800',
      'Romance': '#E91E63',
      'Historia': '#795548',
      'Biografía': '#607D8B',
      'Ciencia': '#2196F3',
      'Filosofía': '#673AB7',
      'Poesía': '#FF5722',
      'Ficción': '#3F51B5',
      'Aventura': '#FF5722',
      'Thriller': '#F44336',
      'No Ficción': '#009688',
      'Terror': '#D32F2F',
      'Drama': '#795548',
      'Infantil': '#00BCD4',
      'Juvenil': '#8BC34A',
      'Autoayuda': '#FF4081'
    };
    return colors[genero] || '#757575';
  };

  return (
    <div className="book-card-simple">
      <div className="book-image-wrapper">
        <img 
          src={imageSrc}
          alt={book.titulo}
          loading="lazy"
          onError={handleImageError}
          className="book-cover"
        />
      </div>
      
      <div className="book-simple-info">
        {book.genero && (
          <span 
            className="genre-tag"
            style={{ backgroundColor: getGenreColor(book.genero) }}
          >
            {book.genero}
          </span>
        )}
        
        <button 
          className={`favorite-btn ${isFavorited ? 'favorited' : ''}`}
          onClick={handleToggleFavorite}
          title={isFavorited ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default React.memo(BookCardSimple);
