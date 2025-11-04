import { useState, useEffect } from 'react';

const useOpenLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para buscar libros por tema con filtros mejorados
  const searchBooksBySubject = async (subject, limit = 20) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/${subject}.json?limit=${limit}&sort=rating&details=true`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Filtrar y seleccionar los mejores libros
      return data.works
        .filter(work => {
          // Solo libros con información completa y de calidad
          return work.title && 
                 work.authors && 
                 work.authors.length > 0 &&
                 work.title.length > 2 &&
                 work.title.length < 100 && // Títulos razonables
                 !work.title.toLowerCase().includes('collection') && // Evitar colecciones
                 !work.title.toLowerCase().includes('anthology'); // Evitar antologías
        })
        .slice(0, limit);
    } catch (error) {
      console.error(`Error fetching ${subject} books:`, error);
      return [];
    }
  };

  // Función para obtener detalles adicionales de un libro
  const getBookDetails = async (workKey) => {
    try {
      const response = await fetch(`https://openlibrary.org${workKey}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
    return null;
  };

  // Función para formatear los datos de Open Library a nuestro formato
  const formatBookData = (work, index) => {
    const coverKey = work.cover_id || work.cover_edition_key;
    const coverUrl = coverKey 
      ? `https://covers.openlibrary.org/b/id/${coverKey}-M.jpg`
      : 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzMzMzMzMyIvPjx0ZXh0IHg9IjEwMCIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TaW4gUG9ydGFkYTwvdGV4dD48L3N2Zz4=';

    // Determinar género mejorado
    const genero = determineGenre(work);
    
    // Crear descripción más rica
    const descripcion = createDescription(work, genero);
    
    // Rating más realista
    const rating = calculateRating(work);

    return {
      id: work.key || `book-${index}`,
      titulo: work.title || 'Título no disponible',
      autor: work.authors && work.authors.length > 0 
        ? work.authors.map(author => author.name).join(', ')
        : 'Autor desconocido',
      genero: genero,
      imagen: coverUrl,
      disponible: Math.random() > 0.2, // 80% disponible
      descripcion: descripcion,
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

  // Función para crear descripción
  const createDescription = (work, genero) => {
    if (work.first_sentence && work.first_sentence.length > 0) {
      return work.first_sentence.join(' ').substring(0, 200) + '...';
    }

    const descriptions = {
      'Ciencia Ficción': 'Una fascinante exploración del futuro y la tecnología.',
      'Fantasía': 'Un mundo mágico lleno de aventuras extraordinarias.',
      'Misterio': 'Un intrigante caso que mantendrá al lector en suspenso.',
      'Romance': 'Una emotiva historia de amor y relaciones humanas.',
      'Historia': 'Un relato que nos transporta a épocas pasadas.',
      'Biografía': 'La inspiradora vida de una persona notable.',
      'Ciencia': 'Conocimientos científicos presentados de forma accesible.',
      'Filosofía': 'Reflexiones profundas sobre la existencia.',
      'Poesía': 'Expresiones artísticas del alma y las emociones.',
      'Ficción': 'Una historia cautivadora que explora la condición humana.',
      'Aventura': 'Una emocionante travesía llena de acción.',
      'Thriller': 'Una historia llena de suspense.'
    };

    return descriptions[genero] || 'Una interesante obra literaria que vale la pena explorar.';
  };

  // Función para calcular rating
  const calculateRating = (work) => {
    let rating = 3.0;
    
    if (work.cover_id) rating += 0.3;
    if (work.first_publish_year && work.first_publish_year > 1950) rating += 0.2;
    if (work.authors && work.authors.length > 0) rating += 0.2;
    if (work.subject && work.subject.length > 0) rating += 0.3;
    
    rating += (Math.random() - 0.5) * 0.4;
    
    return Math.min(5.0, Math.max(2.5, Math.round(rating * 10) / 10));
  };

  // Función para calcular popularidad
  const calculatePopularity = (work) => {
    let popularity = 50;
    
    if (work.cover_id) popularity += 10;
    if (work.first_publish_year && work.first_publish_year > 1950) popularity += 15;
    if (work.subject && work.subject.length > 2) popularity += 10;
    
    return Math.min(100, popularity + Math.floor(Math.random() * 20));
  };

  // Función principal para cargar libros diversos
  const loadDiverseBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Géneros organizados por popularidad y diversidad
      const subjects = [
        { name: 'fiction', priority: 4, category: 'Literatura' },
        { name: 'science_fiction', priority: 3, category: 'Género' }, 
        { name: 'fantasy', priority: 3, category: 'Género' },
        { name: 'mystery', priority: 2, category: 'Género' },
        { name: 'romance', priority: 2, category: 'Género' },
        { name: 'history', priority: 3, category: 'Educativo' },
        { name: 'biography', priority: 2, category: 'Educativo' },
        { name: 'science', priority: 2, category: 'Educativo' },
        { name: 'philosophy', priority: 1, category: 'Académico' },
        { name: 'poetry', priority: 1, category: 'Literatura' }
      ];

      const allBooks = [];
      
      // Obtener libros priorizando diversidad y calidad
      for (const subject of subjects) {
        const limit = subject.priority; // Libros por categoría según prioridad
        const subjectBooks = await searchBooksBySubject(subject.name, limit);
        
        const formattedBooks = subjectBooks
          .filter(work => work.title && work.authors) // Solo libros con datos completos
          .map((work, index) => {
            const book = formatBookData(work, `${subject.name}-${index}`);
            book.categoria = subject.category; // Agregar categoría organizacional
            return book;
          });
        
        allBooks.push(...formattedBooks);
      }

      // Organizar libros por categorías y mezclar para variedad
      const organizedBooks = organizeBooksByCategory(allBooks);
      
      setBooks(organizedBooks);
    } catch (error) {
      console.error('Error loading books from Open Library:', error);
      setError('Error al cargar libros de Open Library');
      
      // Fallback a libros de ejemplo si la API falla
      setBooks(getFallbackBooks());
    } finally {
      setLoading(false);
    }
  };

  // Función para organizar libros por categorías
  const organizeBooksByCategory = (books) => {
    const categories = ['Literatura', 'Género', 'Educativo', 'Académico'];
    const organized = [];
    
    categories.forEach(category => {
      const categoryBooks = books
        .filter(book => book.categoria === category)
        .slice(0, 5); // Máximo 5 libros por categoría
      
      organized.push(...categoryBooks);
    });
    
    // Mezclar para evitar agrupaciones obvias
    return organized.sort(() => Math.random() - 0.5).slice(0, 18);
  };

  // Función para buscar libros específicos por título o autor
  const searchBooks = async (query, limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=key,title,author_name,cover_i,first_publish_year,subject,first_sentence`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      const formattedBooks = (data.docs || []).map((doc, index) => ({
        id: doc.key || `search-${index}`,
        titulo: doc.title || 'Título no disponible',
        autor: doc.author_name && doc.author_name.length > 0 
          ? doc.author_name.join(', ')
          : 'Autor desconocido',
        genero: doc.subject && doc.subject.length > 0 
          ? doc.subject[0] 
          : 'General',
        imagen: doc.cover_i 
          ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
          : `https://via.placeholder.com/200x300/f8f9fa/6c757d?text=Sin+Portada`,
        disponible: Math.random() > 0.3,
        descripcion: doc.first_sentence 
          ? doc.first_sentence.join(' ') 
          : 'Descripción no disponible',
        fechaPublicacion: doc.first_publish_year || 'Fecha desconocida',
        subjects: doc.subject || [],
        rating: Math.floor(Math.random() * 5) + 1
      }));
      
      setBooks(formattedBooks);
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Error al buscar libros');
    } finally {
      setLoading(false);
    }
  };

  // Libros de fallback en caso de error con la API
  const getFallbackBooks = () => [
    {
      id: 'fallback-1',
      titulo: 'Cien Años de Soledad',
      autor: 'Gabriel García Márquez',
      genero: 'Ficción',
      imagen: 'https://via.placeholder.com/200x300/d4a574/ffffff?text=Cien+A%C3%B1os+de+Soledad',
      disponible: true,
      descripcion: 'Una obra maestra del realismo mágico.',
      fechaPublicacion: '1967',
      rating: 5
    },
    {
      id: 'fallback-2',
      titulo: 'Don Quijote de la Mancha',
      autor: 'Miguel de Cervantes',
      genero: 'Clásicos',
      imagen: 'https://via.placeholder.com/200x300/2c3e50/ffffff?text=Don+Quijote',
      disponible: true,
      descripcion: 'La obra cumbre de la literatura española.',
      fechaPublicacion: '1605',
      rating: 5
    }
  ];

  useEffect(() => {
    loadDiverseBooks();
  }, []);

  return {
    books,
    loading,
    error,
    searchBooks,
    loadDiverseBooks,
    searchBooksBySubject
  };
};

export default useOpenLibrary;