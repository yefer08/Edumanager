import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import BookCard from './BookCard';

const RecommendationsSystem = () => {
  const { user } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de géneros de usuario a categorías de Open Library
  const genreMapping = {
    'Ficción': 'fiction',
    'No Ficción': 'nonfiction',
    'Misterio': 'mystery',
    'Romance': 'romance',
    'Ciencia Ficción': 'science_fiction',
    'Fantasía': 'fantasy',
    'Biografía': 'biography',
    'Historia': 'history',
    'Autoayuda': 'self_help',
    'Poesía': 'poetry',
    'Aventura': 'adventure',
    'Terror': 'horror',
    'Drama': 'drama',
    'Infantil': 'children',
    'Juvenil': 'young_adult'
  };

  // Función para obtener libros de Open Library por tema
  const fetchBooksBySubject = async (subject, limit = 6) => {
    try {
      const openLibrarySubject = genreMapping[subject] || subject.toLowerCase().replace(' ', '_');
      const response = await fetch(
        `https://openlibrary.org/subjects/${openLibrarySubject}.json?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.works || [];
    } catch (error) {
      console.error(`Error fetching books for ${subject}:`, error);
      return [];
    }
  };

  // Función para formatear datos de Open Library
  const formatOpenLibraryBook = (work, index) => {
    const coverKey = work.cover_id || work.cover_edition_key;
    const coverUrl = coverKey 
      ? `https://covers.openlibrary.org/b/id/${coverKey}-M.jpg`
      : `https://via.placeholder.com/200x300/d4a574/ffffff?text=${encodeURIComponent(work.title || 'Sin Título')}`;

    return {
      id: work.key || `rec-${index}`,
      titulo: work.title || 'Título no disponible',
      autor: work.authors && work.authors.length > 0 
        ? work.authors.map(author => author.name).join(', ')
        : 'Autor desconocido',
      genero: work.subject && work.subject.length > 0 
        ? work.subject[0] 
        : 'General',
      imagen: coverUrl,
      disponible: Math.random() > 0.2, // 80% de probabilidad de estar disponible
      descripcion: work.first_sentence 
        ? Array.isArray(work.first_sentence) 
          ? work.first_sentence.join(' ')
          : work.first_sentence
        : 'Una interesante obra disponible en nuestra biblioteca.',
      fechaPublicacion: work.first_publish_year || 'Fecha desconocida',
      subjects: work.subject || []
    };
  };

  // Función para obtener libros de géneros por defecto
  const getDefaultRecommendations = async () => {
    const defaultGenres = ['fiction', 'science_fiction', 'fantasy', 'mystery', 'biography', 'history'];
    const allBooks = [];

    for (const genre of defaultGenres) {
      try {
        const response = await fetch(`https://openlibrary.org/subjects/${genre}.json?limit=2`);
        if (response.ok) {
          const data = await response.json();
          const formattedBooks = (data.works || []).map((work, index) => 
            formatOpenLibraryBook(work, `${genre}-${index}`)
          );
          allBooks.push(...formattedBooks);
        }
      } catch (error) {
        console.error(`Error fetching ${genre} books:`, error);
      }
    }

    return allBooks.slice(0, 6); // Limitar a 6 recomendaciones
  };

  useEffect(() => {
    generateRecommendations();
  }, [user, preferences]);

  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let recommendedBooks = [];

      if (user && preferences) {
        // Obtener géneros favoritos del usuario
        const userGenres = preferences.generosFavoritos || [];
        const userFavoriteGenre = preferences.generoFavorito || userGenres[0];
        
        if (userFavoriteGenre) {
          // Obtener libros basados en el género favorito
          const genreBooks = await fetchBooksBySubject(userFavoriteGenre, 4);
          recommendedBooks = genreBooks.map((work, index) => 
            formatOpenLibraryBook(work, `fav-${index}`)
          );
        }

        // Agregar libros de otros géneros del usuario
        for (const genre of userGenres.slice(0, 2)) {
          if (genre !== userFavoriteGenre) {
            const additionalBooks = await fetchBooksBySubject(genre, 2);
            const formattedBooks = additionalBooks.map((work, index) => 
              formatOpenLibraryBook(work, `${genre}-${index}`)
            );
            recommendedBooks.push(...formattedBooks);
          }
        }
      }

      // Si no hay suficientes recomendaciones personalizadas, agregar por defecto
      if (recommendedBooks.length < 6) {
        const defaultBooks = await getDefaultRecommendations();
        recommendedBooks.push(...defaultBooks);
      }

      // Remover duplicados y limitar a 6
      const uniqueBooks = recommendedBooks
        .filter((book, index, self) => 
          index === self.findIndex(b => b.titulo === book.titulo)
        )
        .slice(0, 6);

      setRecommendations(uniqueBooks);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Error al cargar recomendaciones');
      
      // Fallback en caso de error
      setRecommendations([
        {
          id: 'fallback-1',
          titulo: 'Cien Años de Soledad',
          autor: 'Gabriel García Márquez',
          genero: 'Ficción',
          imagen: 'https://via.placeholder.com/200x300/d4a574/ffffff?text=Cien+Años+de+Soledad',
          disponible: true,
          descripcion: 'Una obra maestra del realismo mágico latinoamericano.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2>📚 Descubre Nuestro Catálogo</h2>
          <p>Inicia sesión para recibir recomendaciones personalizadas basadas en tus intereses</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2>🎯 Cargando Recomendaciones desde Open Library...</h2>
        </div>
        <div className="loading-spinner-container">
          <div className="spinner"></div>
          <p style={{ marginTop: '1rem', color: '#7f8c8d' }}>
            Obteniendo libros reales de la biblioteca mundial
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-section">
        <div className="recommendations-header">
          <h2>⚠️ Error al Cargar Recomendaciones</h2>
          <p>{error}</p>
          <button 
            onClick={generateRecommendations}
            className="btn-primary"
            style={{ marginTop: '1rem', width: 'auto', padding: '0.5rem 1rem' }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const userFavoriteGenre = preferences?.generoFavorito || preferences?.generosFavoritos?.[0];

  return (
    <div className="recommendations-section">
      <div className="recommendations-header">
        <h2>🎯 Recomendaciones Para Ti</h2>
        {userFavoriteGenre && (
          <p>Basado en tu interés en <strong>{userFavoriteGenre}</strong> - Powered by Open Library</p>
        )}
      </div>
      
      {recommendations.length > 0 ? (
        <div className="recommendations-grid">
          {recommendations.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <p>📖 Actualiza tus preferencias en tu perfil para recibir mejores recomendaciones</p>
        </div>
      )}
      
      <div className="recommendations-footer">
        <p className="ai-note">
          💡 <strong>Sistema Inteligente:</strong> Recomendaciones basadas en Open Library con millones de libros reales
        </p>
      </div>
    </div>
  );
};

export default RecommendationsSystem;