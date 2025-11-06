import React, { useState, useMemo, useCallback } from 'react';
import BookCardSimple from './BookCardSimple';

const BookCarousel = ({ books }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const booksPerPage = 5;

  // Memoizar libros actuales para evitar recálculos innecesarios
  const currentBooks = useMemo(() => {
    if (!books || books.length === 0) return [];
    return books.slice(currentIndex, currentIndex + booksPerPage);
  }, [books, currentIndex, booksPerPage]);

  const totalPages = useMemo(() => {
    if (!books || books.length === 0) return 0;
    return Math.ceil(books.length / booksPerPage);
  }, [books, booksPerPage]);

  // Memoizar funciones de navegación
  const goToNext = useCallback(() => {
    if (books && currentIndex + booksPerPage < books.length) {
      setCurrentIndex(currentIndex + booksPerPage);
    }
  }, [books, currentIndex, booksPerPage]);

  const goToPrev = useCallback(() => {
    if (currentIndex - booksPerPage >= 0) {
      setCurrentIndex(currentIndex - booksPerPage);
    }
  }, [currentIndex, booksPerPage]);

  if (!books || books.length === 0) {
    return (
      <div className="book-carousel">
        <p className="no-books">No hay libros disponibles</p>
      </div>
    );
  }

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex * booksPerPage);
  };

  return (
    <div className="book-carousel">
      <div className="carousel-wrapper">
        {currentIndex > 0 && (
          <button className="carousel-arrows arrow-left" onClick={goToPrev}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        
        <div className="carousel-container">
          {currentBooks.map((book) => (
            <BookCardSimple key={book.id} book={book} />
          ))}
        </div>
        
        {currentIndex + booksPerPage < books.length && (
          <button className="carousel-arrows arrow-right" onClick={goToNext}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="carousel-navigation">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`nav-dot ${Math.floor(currentIndex / booksPerPage) === index ? 'active' : ''}`}
              onClick={() => goToPage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookCarousel;