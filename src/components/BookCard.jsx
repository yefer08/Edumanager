import React from 'react';

const BookCard = ({ book }) => {
  if (!book) return null;

  return (
    <div className="book-card">
      <div className="book-image">
        <img 
          src={book.imagen || '/placeholder-book.jpg'} 
          alt={book.titulo}
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
          <button className="btn-secondary">Favorito</button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;