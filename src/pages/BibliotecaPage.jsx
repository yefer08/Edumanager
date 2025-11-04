import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import useOpenLibrary from '../hooks/useOpenLibrary';

const BibliotecaPage = () => {
  const { books, loading, error, searchBooks, searchBooksBySubject } = useOpenLibrary();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Géneros disponibles en Open Library
  const availableGenres = [
    'Ficción', 'Ciencia Ficción', 'Fantasía', 'Misterio', 'Romance',
    'Historia', 'Biografía', 'Poesía', 'No Ficción', 'Terror',
    'Aventura', 'Drama', 'Infantil', 'Juvenil', 'Autoayuda'
  ];

  useEffect(() => {
    setFilteredBooks(books || []);
  }, [books]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      await searchBooks(searchTerm, 20);
      setIsSearching(false);
    }
  };

  const handleGenreChange = async (genre) => {
    setSelectedGenre(genre);
    if (genre) {
      setIsSearching(true);
      await searchBooksBySubject(genre, 20);
      setIsSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    setFilteredBooks(books || []);
  };

  if (loading || isSearching) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <div className="loading">
        <div className="spinner"></div>
        <p>{isSearching ? 'Buscando en Open Library...' : 'Cargando biblioteca...'}</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <div className="error">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reintentar
        </button>
      </div>
    </div>
  );

  return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      
      <main className="main-content">
        <header className="page-header">
          <h1>📚 Biblioteca Digital - Open Library</h1>
          <p>Explora millones de libros reales de la biblioteca mundial</p>
        </header>
        
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por título o autor en Open Library..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                🔍 Buscar
              </button>
            </div>
          </form>
          
          <div className="genre-filter">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="genre-select"
            >
              <option value="">Todos los géneros</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>
          
          {(searchTerm || selectedGenre) && (
            <button onClick={clearFilters} className="clear-filters-btn">
              ✖️ Limpiar filtros
            </button>
          )}
        </div>
        
        <div className="results-info">
          <p>
            Mostrando {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''}
            {selectedGenre && ` de ${selectedGenre}`}
            {searchTerm && ` que coinciden con "${searchTerm}"`}
          </p>
        </div>
        
        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book, index) => (
              <BookCard key={book.id || index} book={book} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <h3>📖 No se encontraron libros</h3>
            <p>Intenta con otros términos de búsqueda o selecciona un género diferente</p>
            <button onClick={clearFilters} className="btn-primary">
              Ver catálogo completo
            </button>
          </div>
        )}
        
        <div className="open-library-credit">
          <p>
            📚 <strong>Powered by Open Library</strong> - 
            Acceso a más de 20 millones de libros catalogados
          </p>
        </div>
      </main>
    </div>
  );
};

export default BibliotecaPage;