import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import BookCard from './BookCard';
import useOpenLibrary from '../hooks/useOpenLibrary';

const RecommendationsSystem = () => {
  const { user } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);
  const { searchBooksBySubject } = useOpenLibrary();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapeo de géneros de registro a categorías de Open Library
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
    'Thriller': 'thriller',
    'Drama': 'drama',
    'Infantil': 'children',
    'Juvenil': 'young_adult',
    'Ciencia': 'science',
    'Filosofía': 'philosophy'
  };

  // Función para obtener libros personalizados por preferencias del usuario
  const fetchPersonalizedBooks = async (userPreferences) => {
    try {
      const userGenres = userPreferences.generosFavoritos || [];
      const primaryGenre = userPreferences.generoFavorito || userGenres[0];
      
      console.log('Generando recomendaciones para:', { primaryGenre, userGenres });
      
      let allRecommendations = [];

      if (primaryGenre) {
        // Obtener más libros del género principal (50% de las recomendaciones)
        const primarySubject = genreMapping[primaryGenre] || primaryGenre.toLowerCase().replace(' ', '_');
        const primaryBooks = await searchBooksBySubject(primarySubject, 8);
        
        const formattedPrimary = primaryBooks.map((work, index) => ({
          ...formatOpenLibraryBook(work, `primary-${index}`),
          motivoRecomendacion: `Porque te gusta ${primaryGenre}`,
          prioridad: 1
        }));
        
        allRecommendations.push(...formattedPrimary);
      }

      // Obtener libros de géneros secundarios (30% de las recomendaciones)
      const secondaryGenres = userGenres.filter(genre => genre !== primaryGenre).slice(0, 2);
      
      for (const genre of secondaryGenres) {
        const subject = genreMapping[genre] || genre.toLowerCase().replace(' ', '_');
        const genreBooks = await searchBooksBySubject(subject, 4);
        
        const formattedGenre = genreBooks.map((work, index) => ({
          ...formatOpenLibraryBook(work, `${genre}-${index}`),
          motivoRecomendacion: `Basado en tu interés en ${genre}`,
          prioridad: 2
        }));
        
        allRecommendations.push(...formattedGenre);
      }

      // Obtener libros de descubrimiento (20% de las recomendaciones)
      const discoveryGenres = Object.keys(genreMapping).filter(
        genre => !userGenres.includes(genre)
      ).slice(0, 2);
      
      for (const genre of discoveryGenres) {
        const subject = genreMapping[genre] || genre.toLowerCase().replace(' ', '_');
        const discoveryBooks = await searchBooksBySubject(subject, 2);
        
        const formattedDiscovery = discoveryBooks.map((work, index) => ({
          ...formatOpenLibraryBook(work, `discovery-${index}`),
          motivoRecomendacion: `Descubre algo nuevo: ${genre}`,
          prioridad: 3
        }));
        
        allRecommendations.push(...formattedDiscovery);
      }

      // Organizar por prioridad y diversificar
      return allRecommendations
        .sort((a, b) => a.prioridad - b.prioridad)
        .filter((book, index, self) => 
          index === self.findIndex(b => b.titulo === book.titulo)
        )
        .slice(0, 12); // Mostrar 12 recomendaciones personalizadas

    } catch (error) {
      console.error('Error fetching personalized books:', error);
      return [];
    }
  };

  // Función para formatear datos de Open Library con información personalizada
  const formatOpenLibraryBook = (work, id) => {
    const coverKey = work.cover_id || work.cover_edition_key;
    
    // Usar placeholder Base64 optimizado
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gUG9ydGFkYTwvdGV4dD48L3N2Zz4=';
    
    const coverUrl = coverKey 
      ? `https://covers.openlibrary.org/b/id/${coverKey}-M.jpg`
      : placeholderImage;

    // Determinar género específico
    const genre = determineGenre(work);
    
    // Generar descripción contextual
    const description = generateDescription(work, genre);
    
    // Calcular rating inteligente
    const rating = calculateRating(work);

    return {
      id: work.key || id,
      titulo: work.title || 'Título no disponible',
      autor: work.authors && work.authors.length > 0 
        ? work.authors.map(author => author.name).join(', ')
        : 'Autor desconocido',
      genero: genre,
      imagen: coverUrl,
      disponible: Math.random() > 0.15, // 85% de probabilidad de estar disponible
      descripcion: description,
      fechaPublicacion: work.first_publish_year || 'Fecha desconocida',
      subjects: work.subject ? work.subject.slice(0, 3) : [],
      rating: rating,
      pages: work.number_of_pages || Math.floor(Math.random() * 300) + 150,
      popularidad: calculatePopularity(work)
    };
  };

  // Función para determinar género específico
  const determineGenre = (work) => {
    const subjects = work.subject ? work.subject.join(' ').toLowerCase() : '';
    const title = (work.title || '').toLowerCase();
    const combined = `${subjects} ${title}`;

    if (combined.includes('science fiction') || combined.includes('sci-fi')) return 'Ciencia Ficción';
    if (combined.includes('fantasy') || combined.includes('magic')) return 'Fantasía';
    if (combined.includes('mystery') || combined.includes('detective')) return 'Misterio';
    if (combined.includes('romance') || combined.includes('love')) return 'Romance';
    if (combined.includes('history') || combined.includes('historical')) return 'Historia';
    if (combined.includes('biography') || combined.includes('memoir')) return 'Biografía';
    if (combined.includes('science') || combined.includes('physics')) return 'Ciencia';
    if (combined.includes('philosophy')) return 'Filosofía';
    if (combined.includes('poetry') || combined.includes('poems')) return 'Poesía';
    if (combined.includes('fiction')) return 'Ficción';
    if (combined.includes('adventure')) return 'Aventura';
    if (combined.includes('horror') || combined.includes('thriller')) return 'Thriller';
    
    return work.subject && work.subject.length > 0 ? work.subject[0] : 'General';
  };

  // Función para generar descripción
  const generateDescription = (work, genre) => {
    if (work.first_sentence && work.first_sentence.length > 0) {
      const sentence = Array.isArray(work.first_sentence) 
        ? work.first_sentence.join(' ') 
        : work.first_sentence;
      return sentence.substring(0, 150) + '...';
    }

    const descriptions = {
      'Ciencia Ficción': 'Una fascinante exploración del futuro y las posibilidades tecnológicas.',
      'Fantasía': 'Un mundo mágico lleno de aventuras extraordinarias y criaturas místicas.',
      'Misterio': 'Un intrigante enigma que mantendrá al lector en suspenso.',
      'Romance': 'Una emotiva historia de amor que toca el corazón.',
      'Historia': 'Un relato cautivador que nos transporta a épocas pasadas.',
      'Biografía': 'La inspiradora vida de una persona notable.',
      'Ciencia': 'Conocimientos científicos presentados de forma accesible.',
      'Filosofía': 'Reflexiones profundas sobre la existencia y el pensamiento.',
      'Poesía': 'Expresiones artísticas del alma y las emociones.',
      'Ficción': 'Una historia que explora la condición humana.',
      'Aventura': 'Una emocionante travesía llena de acción.',
      'Thriller': 'Una historia llena de suspense y emociones intensas.'
    };

    return descriptions[genre] || 'Una obra literaria fascinante que vale la pena explorar.';
  };

  // Función para calcular rating
  const calculateRating = (work) => {
    let rating = 3.5; // Base más alta para recomendaciones
    
    if (work.cover_id) rating += 0.3;
    if (work.first_publish_year && work.first_publish_year > 1950) rating += 0.2;
    if (work.authors && work.authors.length > 0) rating += 0.2;
    if (work.subject && work.subject.length > 2) rating += 0.3;
    if (work.first_sentence) rating += 0.2;
    
    rating += (Math.random() - 0.3) * 0.4; // Sesgo hacia ratings más altos
    
    return Math.min(5.0, Math.max(3.0, Math.round(rating * 10) / 10));
  };

  // Función para calcular popularidad
  const calculatePopularity = (work) => {
    let popularity = 60; // Base más alta para recomendaciones
    
    if (work.cover_id) popularity += 10;
    if (work.first_publish_year && work.first_publish_year > 1970) popularity += 10;
    if (work.subject && work.subject.length > 2) popularity += 10;
    if (work.authors && work.authors.length > 0) popularity += 5;
    
    return Math.min(100, popularity + Math.floor(Math.random() * 15));
  };

  // Función para obtener recomendaciones por defecto para usuarios sin preferencias
  const getDefaultRecommendations = async () => {
    const popularGenres = ['fiction', 'science_fiction', 'fantasy', 'mystery', 'biography'];
    const allBooks = [];

    for (const genre of popularGenres) {
      try {
        const genreBooks = await searchBooksBySubject(genre, 3);
        const formattedBooks = genreBooks.map((work, index) => ({
          ...formatOpenLibraryBook(work, `default-${genre}-${index}`),
          motivoRecomendacion: 'Recomendación popular',
          prioridad: 4
        }));
        allBooks.push(...formattedBooks);
      } catch (error) {
        console.error(`Error fetching ${genre} books:`, error);
      }
    }

    return allBooks
      .sort(() => Math.random() - 0.5) // Mezclar aleatoriamente
      .slice(0, 8); // Limitar a 8 recomendaciones por defecto
  };

  // Función principal para generar recomendaciones
  const generateRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let recommendedBooks = [];

      console.log('Generando recomendaciones...', { user: !!user, preferences });

      if (user && preferences && (preferences.generosFavoritos?.length > 0 || preferences.generoFavorito)) {
        // Usuario con preferencias definidas - Recomendaciones personalizadas
        console.log('Usuario con preferencias encontrado');
        recommendedBooks = await fetchPersonalizedBooks(preferences);
        
        if (recommendedBooks.length === 0) {
          console.log('No se pudieron obtener recomendaciones personalizadas, usando por defecto');
          recommendedBooks = await getDefaultRecommendations();
        }
      } else {
        // Usuario sin preferencias o usuario invitado - Recomendaciones generales
        console.log('🌟 Generando recomendaciones generales');
        recommendedBooks = await getDefaultRecommendations();
      }

      // Filtrar libros únicos y asegurar calidad
      const uniqueBooks = recommendedBooks
        .filter((book, index, self) => 
          index === self.findIndex(b => b.titulo === book.titulo && b.autor === book.autor)
        )
        .filter(book => book.titulo && book.titulo !== 'Título no disponible')
        .slice(0, 12);

      console.log(`✅ ${uniqueBooks.length} recomendaciones generadas`);
      setRecommendations(uniqueBooks);

    } catch (error) {
      console.error('❌ Error generating recommendations:', error);
      setError('Error al cargar recomendaciones. Intenta recargar la página.');
      
      // Fallback básico
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // Effect para regenerar recomendaciones cuando cambien las preferencias
  useEffect(() => {
    generateRecommendations();
  }, [user, preferences]);

  // Función para refrescar recomendaciones manualmente
  const refreshRecommendations = () => {
    generateRecommendations();
  };

  // Renderizar componente
  if (loading) {
    return (
      <div className="recommendations-section">
        <div className="section-header">
          <h2>🎯 Recomendaciones Para Ti</h2>
          <p>Cargando recomendaciones personalizadas...</p>
        </div>
        <div className="loading-recommendations">
          <div className="spinner"></div>
          <p>Analizando tus preferencias...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recommendations-section">
        <div className="section-header">
          <h2>Recomendaciones Para Ti</h2>
          <p>Hubo un problema cargando las recomendaciones</p>
        </div>
        <div className="error-state">
          <p>{error}</p>
          <button onClick={refreshRecommendations} className="btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="recommendations-section">
      <div className="section-header">
        <h2>🎯 Recomendaciones Para Ti</h2>
        {user && preferences && (preferences.generosFavoritos?.length > 0 || preferences.generoFavorito) ? (
          <p>
            Basado en tus géneros favoritos: {' '}
            <strong>
              {preferences.generoFavorito || preferences.generosFavoritos?.[0]}
              {preferences.generosFavoritos?.length > 1 && ` y ${preferences.generosFavoritos.length - 1} más`}
            </strong>
          </p>
        ) : (
          <p>Descubre libros populares y altamente recomendados</p>
        )}
        
        <button onClick={refreshRecommendations} className="refresh-btn" title="Actualizar recomendaciones">
          Actualizar
        </button>
      </div>

      {recommendations.length > 0 ? (
        <div className="recommendations-grid">
          {recommendations.map((book) => (
            <div key={book.id} className="recommendation-card-wrapper">
              <BookCard libro={book} />
              {book.motivoRecomendacion && (
                <div className="recommendation-reason">
                  💡 {book.motivoRecomendacion}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="no-recommendations">
          <div className="no-recommendations-icon"></div>
          <h3>No hay recomendaciones disponibles</h3>
          <p>Intenta actualizar tus preferencias de género en tu perfil.</p>
          <button onClick={refreshRecommendations} className="btn-primary">
            Generar Recomendaciones
          </button>
        </div>
      )}
    </div>
  );
};

export default RecommendationsSystem;