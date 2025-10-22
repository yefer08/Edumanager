import React from 'react';
import BookCard from './BookCard';

const BookCarousel = ({ books }) => {
  return (
    <div className="book-carousel">
      <h3>Libros Recomendados</h3>
      <div className="carousel-container">
        {books && books.length > 0 ? (
          books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))
        ) : (
          <p>No hay libros disponibles</p>
        )}
      </div>
    </div>
  );
};

export default BookCarousel;