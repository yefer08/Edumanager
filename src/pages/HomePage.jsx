import React, { useContext, useEffect, useState, useMemo } from 'react';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import BookCarousel from '../components/BookCarousel';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import useOpenLibrary from '../hooks/useOpenLibrary';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { user } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);
  const { searchBooks, searchBooksBySubject } = useOpenLibrary();

  const [carouselBooks, setCarouselBooks] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeout;

    const load = async () => {
      try {
        const favorites = (preferences?.librosFavoritos || []);

        // Mostrar favoritos si existen
        if (favorites && favorites.length > 0) {
          if (mounted) {
            setCarouselBooks(favorites.slice(0, 12));
            setLoadingCarousel(false);
          }
          return;
        }

        // Si no hay favoritos, completar con búsquedas por género favorito
        const genre = preferences?.generoFavorito || (preferences?.generosFavoritos && preferences.generosFavoritos[0]);
        if (genre) {
          setLoadingCarousel(true);
          const slugMap = {
            'Ficción': 'fiction', 'No Ficción': 'nonfiction', 'Misterio': 'mystery',
            'Romance': 'romance', 'Ciencia Ficción': 'science_fiction', 'Fantasía': 'fantasy',
            'Biografía': 'biography', 'Historia': 'history', 'Autoayuda': 'self_help',
            'Poesía': 'poetry', 'Aventura': 'adventure', 'Terror': 'horror',
            'Thriller': 'thriller', 'Drama': 'drama', 'Infantil': 'children',
            'Juvenil': 'young_adult', 'Ciencia': 'science', 'Filosofía': 'philosophy'
          };

          const slug = slugMap[genre] || genre.toLowerCase().replace(/\s+/g, '_');
          let results = [];
          try {
            results = await searchBooksBySubject(slug, 12);
          } catch (e) {
            console.warn('Subject search failed, trying generic search', e);
            results = await searchBooks(genre, 12);
          }

          const combined = [];
          const added = new Set();
          (results || []).forEach(r => { if (r && r.id && !added.has(r.id)) { combined.push(r); added.add(r.id); } });

          if (mounted) setCarouselBooks(combined.slice(0, 12));
        } else {
          if (mounted) setCarouselBooks([]);
        }
      } catch (err) {
        console.error('Error loading carousel books:', err);
        if (mounted) setCarouselBooks([]);
      } finally {
        if (mounted) setLoadingCarousel(false);
      }
    };

    timeout = setTimeout(() => { if (mounted) load(); }, 100);

    return () => { mounted = false; if (timeout) clearTimeout(timeout); };
  }, [preferences]);

  const carouselSection = useMemo(() => {
    if (loadingCarousel) {
      return (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando recomendaciones...</p>
        </div>
      );
    }

    if (!carouselBooks || carouselBooks.length === 0) {
      return (
        <div className="no-recommendations">
          <p>No hay recomendaciones disponibles en este momento.</p>
        </div>
      );
    }

    return <BookCarousel books={carouselBooks} />;
  }, [carouselBooks, loadingCarousel]);

  return (
    <div className="home-page">
      <Navigation />
      <Header />

      <main className="main-content-home">
        <section className="recommended-section">
          <h1 style={{textAlign: 'center', fontSize: '2rem', margin: '1.5rem 0'}}>RECOMENDADOS PARA TI</h1>
          {loadingCarousel ? (
            <div className="loading">Cargando recomendaciones...</div>
          ) : (
            <BookCarousel books={carouselBooks} />
          )}
          {(!carouselBooks || carouselBooks.length === 0) && (
            <p className="no-recommendations">No hay recomendaciones disponibles. Añade libros a tus favoritos o configura tus preferencias.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;