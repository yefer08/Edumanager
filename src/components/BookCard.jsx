import React, { memo, useState, useContext } from 'react';
import { PreferencesContext } from '../context/PreferencesContext';

// Imagen placeholder optimizada como SVG en Base64
const BOOK_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNFNUU3RUIiLz4KPHA+YXRoIGQ9Ik00MCA2MEg4MFY2NEg0MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA3MEg4MFY3NEg0MFY3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA4MEg3MFY4NEg0MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00NSA0NUg3NVY1NUg0NVY0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";

const BookCard = memo(({ book, libro }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Compatibilidad con ambos formatos de props
  const bookData = book || libro;
  
  if (!bookData) return null;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const imageSrc = imageError || !bookData.imagen ? BOOK_PLACEHOLDER : bookData.imagen;

  // Función para obtener color del género
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
      'Thriller': '#F44336'
    };
    return colors[genero] || '#757575';
  };

  // Función para renderizar estrellas de rating
  const renderStars = (rating) => {
    if (!rating) return null;
    
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">★</span>);
    }

    if (hasHalfStar) {
      stars.push(<span key="half" className="star half">★</span>);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty">☆</span>);
    }

    return (
      <div className="book-rating">
        <div className="stars">{stars}</div>
        <span className="rating-value">({rating})</span>
      </div>
    );
  };

  const { preferences, addFavoriteBook, removeFavoriteBook, isBookFavorited } = useContext(PreferencesContext);

  const isFav = isBookFavorited ? isBookFavorited(bookData.id) : (preferences?.librosFavoritos || []).some(b => b.id === bookData.id);

  const handleToggleFavorite = () => {
    if (isFav) {
      removeFavoriteBook(bookData.id);
    } else {
      // Guardar los datos mínimos necesarios
      addFavoriteBook({ id: bookData.id, titulo: bookData.titulo, autor: bookData.autor, imagen: bookData.imagen, genero: bookData.genero });
    }
  };

  return (
    <div className="book-card">
      <div className="book-image-container">
        <img 
          src={imageSrc}
          alt={bookData.titulo}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          className="book-image"
          style={{
            opacity: imageLoading ? 0.7 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        {imageLoading && !imageError && bookData.imagen && (
          <div className="image-loader">
            <div className="spinner"></div>
          </div>
        )}
        
        {/* Badge de género */}
        <div 
          className="genre-badge"
          style={{ backgroundColor: getGenreColor(bookData.genero) }}
        >
          {bookData.genero}
        </div>
      </div>
      
      <div className="book-info">
        <h4 className="book-title" title={bookData.titulo}>
          {bookData.titulo.length > 45 ? `${bookData.titulo.substring(0, 45)}...` : bookData.titulo}
        </h4>
        
        <p className="book-author" title={bookData.autor}>
          {bookData.autor.length > 35 ? `${bookData.autor.substring(0, 35)}...` : bookData.autor}
        </p>

        <div className="book-meta">
          <span className="book-year">{bookData.fechaPublicacion}</span>
          {bookData.pages && <span className="book-pages">• {bookData.pages}p</span>}
        </div>

        {/* Rating */}
        {bookData.rating && renderStars(bookData.rating)}

        {/* Descripción */}
        {bookData.descripcion && (
          <p className="book-description">
            {bookData.descripcion.length > 80 
              ? `${bookData.descripcion.substring(0, 80)}...` 
              : bookData.descripcion}
          </p>
        )}

        {/* Estado de disponibilidad */}
        <div className="book-footer">
          <span className={`availability ${bookData.disponible ? 'available' : 'unavailable'}`}>
            {bookData.disponible ? 'Disponible' : 'No disponible'}
          </span>
          
          {/* Popularidad */}
          {bookData.popularidad && (
            <div className="popularity-indicator">
              <div 
                className="popularity-bar"
                style={{ width: `${Math.min(100, bookData.popularidad)}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Subjects/Temas */}
        {bookData.subjects && bookData.subjects.length > 0 && (
          <div className="book-subjects">
            {bookData.subjects.slice(0, 2).map((subject, index) => (
              <span key={index} className="subject-tag">
                {subject}
              </span>
            ))}
          </div>
        )}
        
        <div className="book-actions">
          <button className="btn-primary">Ver Detalles</button>
          <button onClick={handleToggleFavorite} className={`btn-secondary ${isFav ? 'favorited' : ''}`} aria-pressed={isFav}>
            {isFav ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
          </button>
        </div>
      </div>
    </div>
  );
});

// Nombre para debugging
BookCard.displayName = 'BookCard';

export default BookCard;