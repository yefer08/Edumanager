import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
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

      if (searchQuery) {
        setFilteredBooks(searchResults || []);
        return;
      }

      if (selectedGenre) {
        const genreBooks = await searchBooksBySubject(selectedGenre.toLowerCase(), 20);
        const booksWithGenre = Array.isArray(genreBooks)
          ? genreBooks.map(b => ({ ...b, genero: selectedGenre }))
          : [];
        setFilteredBooks(booksWithGenre);
        return;
      }

      // carga por defecto
      const defaultBooks = await searchBooksBySubject('fiction', 20);
      setFilteredBooks(defaultBooks || []);
    };

    load();
  }, [searchResults, selectedGenre, searchBooksBySubject]);
        } catch (err) {
          console.error('Error en la búsqueda:', err);
          setFilteredBooks([]);
        } finally {
          setLoading(false);
        }
      };

      handleSearch();

      // Configurar un listener para cambios en la URL
      const handlePopState = () => handleSearch();
      window.addEventListener('popstate', handlePopState);
    
      return () => window.removeEventListener('popstate', handlePopState);
    if (loading || isSearching) return (

  const handleGenreChange = async (genre) => {
    setSelectedGenre(genre);
    setFilteredBooks([]); // Limpiar los libros antes de cargar nuevos
    
    try {
      if (!genre) {
        const genreBooks = await searchBooksBySubject('fiction', 20);
        setFilteredBooks(genreBooks);
        return;
      }
      
      // Buscar libros por género
      const genreBooks = await searchBooksBySubject(genre.toLowerCase(), 20);
      if (Array.isArray(genreBooks)) {
        // Asegurarse de que cada libro tenga el género seleccionado
    if (error || searchError) return (
          ...book,
          genero: genre
        }));
        setFilteredBooks(booksWithGenre);
      }
    } catch (error) {
      console.error('Error al cargar libros por género:', error);
      setFilteredBooks([]);
    }
            <p>Error: {error || searchError}</p>

  // Función para limpiar filtros
  const clearFilters = () => {
    setSelectedGenre('');
    handleGenreChange(''); // Esto cargará los libros de ficción por defecto
  };

  if (loading) return (
    <div className="biblioteca-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <header className="page-header">
          <h1>Biblioteca Digital - Open Library</h1>
          <p>Explora millones de libros reales de la biblioteca mundial</p>
        </header>
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando biblioteca...</p>
        </div>
      </main>
    </div>
  );
  
  const handleGenreChange = async (genre) => {
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
          <p>
            Mostrando {filteredBooks.length} libro{filteredBooks.length !== 1 ? 's' : ''}
            {selectedGenre && ` de ${selectedGenre}`}
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
            <strong>Powered by Open Library</strong> - 
            Acceso a más de 20 millones de libros catalogados
          </p>
        </div>
      </main>
    </div>
  );
};

export default BibliotecaPage;