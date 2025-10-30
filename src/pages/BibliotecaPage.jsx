import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import useFetchLibros from '../hooks/useFetchLibros';

const BibliotecaPage = () => {
  const { libros, loading, error } = useFetchLibros();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    if (libros) {
      let filtered = libros;
      
      if (searchTerm) {
        filtered = filtered.filter(book =>
          book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.autor.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (selectedGenre) {
        filtered = filtered.filter(book => book.genero === selectedGenre);
      }
      
      setFilteredBooks(filtered);
    }
  }, [libros, searchTerm, selectedGenre]);

  const genres = [...new Set(libros?.map(book => book.genero) || [])];

  if (loading) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <div className="loading">Cargando biblioteca...</div>
    </div>
  );
  
  if (error) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <div className="error">Error: {error}</div>
    </div>
  );

  return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      
      <main className="main-content">
        <header className="page-header">
          <h1>Biblioteca Digital</h1>
          <p>Explora nuestra colección completa</p>
        </header>
        
        <div className="filters-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Buscar por título o autor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="genre-filter">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="genre-select"
            >
              <option value="">Todos los géneros</option>
              {genres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="books-grid">
          {filteredBooks.length > 0 ? (
            filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))
          ) : (
            <p className="no-results">No se encontraron libros con los criterios seleccionados.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default BibliotecaPage;