import React, { memo, useState } from 'react';

// Imagen placeholder optimizada como SVG en Base64
const BOOK_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgdmlld0JveD0iMCAwIDEyMCAxNjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjAiIGhlaWdodD0iMTYwIiBmaWxsPSIjRjNGNEY2IiBzdHJva2U9IiNFNUU3RUIiLz4KPHA+YXRoIGQ9Ik00MCA2MEg4MFY2NEg0MFY2MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA3MEg4MFY3NEg0MFY3MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00MCA4MEg3MFY4NEg0MFY4MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+YXRoIGQ9Ik00NSA0NUg3NVY1NUg0NVY0NVoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";

const BookCard = memo(({ book }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  if (!book) return null;

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const imageSrc = imageError || !book.imagen ? BOOK_PLACEHOLDER : book.imagen;

  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={imageSrc}
          alt={book.titulo}
          loading="lazy"
          onError={handleImageError}
          onLoad={handleImageLoad}
          style={{
            opacity: imageLoading ? 0.7 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
        {imageLoading && !imageError && book.imagen && (
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