import React, { memo } from 'react';
import { useImageLoader, BOOK_PLACEHOLDER } from '../hooks/useImageLoader';

const BookCard = memo(({ book }) => {
  const { imageSrc, loading, error } = useImageLoader(book?.imagen, BOOK_PLACEHOLDER);

  if (!book) return null;

  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={imageSrc}
          alt={book.titulo}
          loading="lazy"
          style={{
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        {loading && (
          <div className="image-loader">
            <div className="spinner"></div>
          </div>
        )}
      </div>
      <div className="book-info">
        <h4 className="book-title">{book.titulo}</h4>
        <p className="book-author">{book.autor}</p>
        <p className="book-genre">{book.genero}</p>
        <div className="book-actions">
          <button className="btn-primary">Ver Detalles</button>
          <button className="btn-secondary">Favorito</button>
        </div>
      </div>
    </div>
  );
});

// Nombre para debugging
BookCard.displayName = 'BookCard';

export default BookCard;