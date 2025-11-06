import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCardSimple from '../components/BookCardSimple';
import SkeletonCard from '../components/SkeletonCard';
import useOpenLibrary from '../hooks/useOpenLibrary';
import useSearch from '../hooks/useSearch';
const BibliotecaPage = () => {
  const { loading, error, searchBooksBySubject } = useOpenLibrary();
  const { searchResults, isSearching, searchError } = useSearch();
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  // Géneros disponibles en Open Library
  const availableGenres = [
    'Ficción', 'Ciencia Ficción', 'Fantasía', 'Misterio', 'Romance',
    'Historia', 'Biografía', 'Poesía', 'No Ficción', 'Terror',
    'Aventura', 'Drama', 'Infantil', 'Juvenil', 'Autoayuda'
  ];

  // Manejar resultados de búsqueda o carga inicial
  useEffect(() => {
    const load = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');

      console.log('BibliotecaPage - Search Query:', searchQuery);
      console.log('BibliotecaPage - Search Results:', searchResults);
      console.log('BibliotecaPage - Selected Genre:', selectedGenre);

      if (searchQuery && searchResults && searchResults.length >= 0) {
        console.log('Mostrando resultados de búsqueda:', searchResults.length);
        setFilteredBooks(searchResults);
        return;
      }

      if (selectedGenre) {
        console.log('Buscando por género:', selectedGenre);
        const genreBooks = await searchBooksBySubject(selectedGenre.toLowerCase(), 20);
        const booksWithGenre = Array.isArray(genreBooks)
          ? genreBooks.map(b => ({ ...b, genero: selectedGenre }))
          : [];
        setFilteredBooks(booksWithGenre);
        return;
      }

      // carga por defecto
      console.log('Cargando libros por defecto');
      const defaultBooks = await searchBooksBySubject('fiction', 20);
      setFilteredBooks(defaultBooks || []);
    };

    load();
  }, [searchResults, selectedGenre]);

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const clearFilters = async () => {
    setSelectedGenre('');
    // quitar parámetro de búsqueda si existe
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('search')) {
      urlParams.delete('search');
      const newUrl = window.location.pathname + (urlParams.toString() ? `?${urlParams.toString()}` : '');
      window.history.replaceState({}, '', newUrl);
    }
    const defaultBooks = await searchBooksBySubject('fiction', 20);
    setFilteredBooks(defaultBooks || []);
  };

  if (loading || isSearching) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <header className="page-header">
          <h1>Biblioteca Digital BiblioEdu</h1>
          <p>Explora millones de libros reales de la biblioteca BiblioEdu</p>
        </header>
        <div className="books-grid">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </main>
    </div>
  );

  if (error || searchError) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <header className="page-header">
          <h1>Biblioteca Digital BiblioEdu</h1>
          <p>Explora millones de libros reales de la biblioteca BiblioEdu</p>
        </header>
        <div className="error">
          <p>Error: {error || searchError}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Reintentar
          </button>
        </div>
      </main>
    </div>
  );

  return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <header className="page-header">
          <h1>Biblioteca Digital BiblioEdu</h1>
          <p>Explora millones de libros reales de la biblioteca BiblioEdu</p>
        </header>

        <div className="filters-section">
          <div className="genre-filter">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="library-genre-select"
              aria-label="Filtrar por género"
              disabled={isSearching}
            >
              <option value="" className="genre-option">Todos los géneros</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre} className="genre-option">{genre}</option>
              ))}
            </select>
          </div>

          {selectedGenre && (
            <button onClick={clearFilters} className="clear-filters-btn">
              ✖️ Limpiar filtros
            </button>
          )}
        </div>

        <div className="results-info">
          <p>
            Mostrando {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''}
            {selectedGenre && ` de ${selectedGenre}`}
          </p>
        </div>

        {filteredBooks.length > 0 ? (
          <div className="books-grid">
            {filteredBooks.map((book, index) => (
              <BookCardSimple key={book.id || index} book={book} />
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
      </main>
    </div>
  );
};

export default BibliotecaPage;