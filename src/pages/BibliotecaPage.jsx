import React, { useState, useEffect, useContext } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import useFetchLibros from '../hooks/useFetchLibros';
import { PreferencesContext } from '../context/PreferencesContext';
import { AuthContext } from '../context/AuthContext';

const BibliotecaPage = () => {
  const { libros, loading, error } = useFetchLibros();
  const { preferences } = useContext(PreferencesContext);
  const { user } = useContext(AuthContext);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [showingRecommended, setShowingRecommended] = useState(false);
  
  // Filtrar libros recomendados basados en las preferencias del usuario
  const getRecommendedBooks = () => {
    if (!preferences?.generosFavoritos?.length || !libros?.length) return [];
    return libros.filter(book => 
      preferences.generosFavoritos.includes(book.genero)
    );
  };

  useEffect(() => {
    if (libros) {
      let filtered = libros;
      
      // Si estamos mostrando recomendados y hay un usuario logueado
      if (showingRecommended && user) {
        filtered = getRecommendedBooks();
      } else {
        if (searchTerm) {
          filtered = filtered.filter(book =>
            book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.autor.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (selectedGenre) {
          filtered = filtered.filter(book => book.genero === selectedGenre);
        }
      }
      
      setFilteredBooks(filtered);
    }
  }, [libros, searchTerm, selectedGenre, showingRecommended, user, preferences?.generosFavoritos]);

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
          <p>
            {showingRecommended 
              ? `Mostrando libros recomendados basados en tus géneros favoritos: ${preferences?.generosFavoritos?.join(', ')}`
              : 'Explora nuestra colección completa'}
          </p>
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
          
          {user && preferences?.generosFavoritos?.length > 0 && (
            <div className="recommended-filter">
              <button
                onClick={() => setShowingRecommended(!showingRecommended)}
                className={`btn-filter ${showingRecommended ? 'active' : ''}`}
                style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  backgroundColor: showingRecommended ? '#3498db' : 'rgba(255, 255, 255, 0.9)',
                  color: showingRecommended ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {showingRecommended ? 'Mostrar todos' : 'Mostrar recomendados'}
              </button>
            </div>
          )}
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