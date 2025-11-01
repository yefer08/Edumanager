import React, { useState, useContext } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import useFetchLibros from '../hooks/useFetchLibros';

// Esta página reemplaza la antigua 'Tareas' por 'Favoritos'.
// Al no estar implementada la API de libros aún, guardamos favoritos en localStorage
// y ofrecemos un formulario simple para añadir/Eliminar favoritos manualmente.

const TareasPage = () => {
  const { favorites, addFavorite: addCtxFavorite, removeFavorite: removeCtxFavorite, clearFavorites } = useContext(FavoritesContext);
  const { user } = useContext(AuthContext);
  const { libros } = useFetchLibros();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');

  // verify book exists in library before adding
  const validateBookExists = (title, author) => {
    const normalizedTitle = title.toLowerCase().trim();
    const normalizedAuthor = author.toLowerCase().trim();
    return libros.find(book => 
      book.titulo.toLowerCase().includes(normalizedTitle) &&
      (!normalizedAuthor || book.autor.toLowerCase().includes(normalizedAuthor))
    );
  };

  // manual add (keeps the previous convenience form) - uses context
  const addFavorite = (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para añadir libros a favoritos');
      return;
    }
    if (!title.trim()) return;
    
    setError('');
    const existingBook = validateBookExists(title, author);
    
    if (!existingBook) {
      setError('Libro no encontrado en la biblioteca. Por favor verifica el título y autor.');
      return;
    }
    
    addCtxFavorite(existingBook);
    setTitle('');
    setAuthor('');
  };

  const removeFavorite = (id) => {
    if (!user) {
      alert('Debes iniciar sesión para eliminar favoritos');
      return;
    }
    removeCtxFavorite(id);
  };

  const clearAll = () => {
    if (!user) {
      alert('Debes iniciar sesión para limpiar favoritos');
      return;
    }
    if (window.confirm('¿Eliminar todos los favoritos?')) clearFavorites();
  };

  return (
    <div className="favoritos-page">
      <Navigation />
      <Header />
      <main className="main-content">
        <div className="page-header">
          <h1>Favoritos</h1>
          <p>Aquí verás los libros que marques como favoritos (placeholder hasta la integración con la API).</p>
        </div>

        <section className="favorites-controls" style={{marginBottom: '1.5rem'}}>
          <form onSubmit={addFavorite} style={{display:'flex',gap:'0.5rem',flexWrap:'wrap',alignItems:'center'}}>
            <input
              type="text"
              placeholder="Título del libro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="search-input"
              style={{minWidth: '220px'}}
            />
            <input
              type="text"
              placeholder="Autor"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="search-input"
              style={{minWidth: '180px'}}
            />
            {error && <div className="error-message" style={{color: 'red', width: '100%'}}>{error}</div>}
            <button type="submit" className="btn-primary">Añadir favorito</button>
            <button type="button" className="btn-secondary" onClick={clearAll}>Limpiar todo</button>
          </form>
        </section>

        <section className="books-grid">
          {favorites.length === 0 ? (
            <div className="no-results">Aún no hay favoritos. Añade algunos usando el formulario de arriba.</div>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} className="book-card">
                <div className="book-image" style={{height: '220px'}}>
                  {fav.cover ? (
                    // safe image
                    <img src={fav.cover} alt={fav.title} loading="lazy" onError={(e)=>{e.target.style.display='none'}} />
                  ) : (
                    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',background:'#f0f0f0',color:'#7f8c8d'}}>Sin imagen</div>
                  )}
                </div>
                <div className="book-info">
                  <div className="book-title">{fav.title}</div>
                  <div className="book-author">{fav.author}</div>
                  <div className="book-actions" style={{marginTop:'0.5rem'}}>
                    <button className="btn-secondary" onClick={() => removeFavorite(fav.id)}>Quitar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
};

export default TareasPage;