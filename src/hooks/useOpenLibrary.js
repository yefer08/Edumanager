import { useState, useEffect, useCallback } from 'react';

// Cache compartido entre todas las instancias del hook
const searchCache = new Map();
const subjectCache = new Map();
const CACHE_TIME = 5 * 60 * 1000; // 5 minutos en memoria
const LOCALSTORAGE_CACHE_TIME = 60 * 60 * 1000; // 1 hora en localStorage

// Funciones de caché en localStorage
const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(`openlibrary_${key}`);
    if (!item) return null;
    
    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp < LOCALSTORAGE_CACHE_TIME) {
      return data;
    } else {
      localStorage.removeItem(`openlibrary_${key}`);
      return null;
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

const saveToLocalStorage = (key, data) => {
  try {
    const item = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`openlibrary_${key}`, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const useOpenLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para limpiar entradas viejas del caché
  const cleanCache = useCallback(() => {
    const now = Date.now();
    for (const [key, value] of searchCache.entries()) {
      if (now - value.timestamp > CACHE_TIME) {
        searchCache.delete(key);
      }
    }
    for (const [key, value] of subjectCache.entries()) {
      if (now - value.timestamp > CACHE_TIME) {
        subjectCache.delete(key);
      }
    }
  }, []);
  // Función para buscar libros
  const searchBooks = useCallback(async (query) => {
    if (!query?.trim()) {
      setBooks([]);
      setLoading(false);
      return [];
    }

    setLoading(true);
    setError(null);

    const cacheKey = query.toLowerCase().trim();
    
    // 1. Verificar caché en memoria (más rápido)
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TIME) {
        setBooks(cached.books);
        setLoading(false);
        return cached.books;
      } else {
        searchCache.delete(cacheKey);
      }
    }

    // 2. Verificar caché en localStorage (rápido)
    const cachedData = getFromLocalStorage(`search_${cacheKey}`);
    if (cachedData) {
      setBooks(cachedData);
      setLoading(false);
      // También guardar en memoria para próximas búsquedas
      searchCache.set(cacheKey, {
        books: cachedData,
        timestamp: Date.now()
      });
      return cachedData;
    }

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,cover_i,first_publish_year,subject,first_sentence`
      );
      if (!response.ok) {
        throw new Error('Error en la búsqueda de libros');
      }
      const data = await response.json();
      
      if (!data.docs || data.docs.length === 0) {
        setBooks([]);
        setLoading(false);
        return [];
      }
      
      const formattedBooks = data.docs
        .map((book, index) => ({
          id: book.key || `search-${index}`,
          titulo: book.title || 'Título no disponible',
          autor: book.author_name && book.author_name.length > 0 
            ? book.author_name.join(', ')
            : 'Autor desconocido',
          genero: book.subject && book.subject.length > 0 
            ? book.subject[0] 
            : 'General',
          imagen: book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : `https://via.placeholder.com/200x300/f8f9fa/6c757d?text=Sin+Portada`,
          disponible: true,
          descripcion: book.first_sentence 
            ? Array.isArray(book.first_sentence) 
              ? book.first_sentence[0]
              : book.first_sentence
            : 'Descripción no disponible',
          fechaPublicacion: book.first_publish_year || 'Fecha desconocida',
          rating: (Math.random() * 2 + 3).toFixed(1) // Rating entre 3 y 5
        }))
        .slice(0, 20); // Limitar a 20 resultados
      
      // Guardar en caché de memoria
      searchCache.set(cacheKey, {
        books: formattedBooks,
        timestamp: Date.now()
      });
      
      // Guardar en localStorage para persistencia
      saveToLocalStorage(`search_${cacheKey}`, formattedBooks);
      
      setBooks(formattedBooks);
      
      // Limpiar entradas viejas del caché
      cleanCache();
      
      return formattedBooks;
    } catch (err) {
      console.error('Error buscando libros:', err);
      setError(err.message);
      setBooks([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [cleanCache]);

  // Función para buscar libros por tema con filtros mejorados
  const searchBooksBySubject = async (subject, limit = 20) => {
    if (!subject?.trim()) {
      return [];
    }

    const cacheKey = `${subject.toLowerCase().trim()}:${limit}`;
    
    // 1. Verificar caché en memoria
    if (subjectCache.has(cacheKey)) {
      const cached = subjectCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TIME) {
        return cached.books;
      } else {
        subjectCache.delete(cacheKey);
      }
    }

    // 2. Verificar caché en localStorage
    const cachedData = getFromLocalStorage(`subject_${cacheKey}`);
    if (cachedData) {
      // Guardar en memoria para próximas búsquedas
      subjectCache.set(cacheKey, {
        books: cachedData,
        timestamp: Date.now()
      });
      return cachedData;
    }

    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/${encodeURIComponent(subject)}.json?limit=${limit}&sort=rating&details=true`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      const works = data.works || [];

      // Filtrar y convertir a nuestro formato usando formatBookData
      const formatted = works
        .filter(work => work && work.title && work.authors && work.authors.length > 0)
        .slice(0, limit)
        .map((work, idx) => formatBookData(work, `${subject}-${idx}`));

      // Guardar en caché de memoria
      subjectCache.set(cacheKey, {
        books: formatted,
        timestamp: Date.now()
      });

      // Guardar en caché de localStorage
      saveToLocalStorage(`subject_${cacheKey}`, formatted);
      
      // Limpiar entradas viejas del caché
      cleanCache();
      
      return formatted;
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
    // Determinar la mejor portada disponible
    const coverId = work.cover_i || work.cover_id;
    const editionKey = work.cover_edition_key || (work.edition_key && work.edition_key[0]);
    const isbnKey = work.isbn && work.isbn[0];

    let coverUrl = '';
    if (coverId) {
      // cover_i / cover_id (numérico)
      coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
    } else if (editionKey) {
      // edition key (OL...M) -> use olid path
      coverUrl = `https://covers.openlibrary.org/b/olid/${editionKey}-M.jpg`;
    } else if (isbnKey) {
      coverUrl = `https://covers.openlibrary.org/b/isbn/${isbnKey}-M.jpg`;
    } else {
      coverUrl = 'https://via.placeholder.com/200x300/f8f9fa/6c757d?text=Sin+Portada';
    }

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

  // Función para búsqueda personalizada
  const searchCustomBooks = async (query, limit = 10) => {
    const cacheKey = `custom:${query}:${limit}`;
    
    // Verificar caché
    if (searchCache.has(cacheKey)) {
      const cached = searchCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TIME) {
        return cached.books;
      }
      searchCache.delete(cacheKey);
    }

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
      
      // Guardar en caché
      searchCache.set(cacheKey, {
        books: formattedBooks,
        timestamp: Date.now()
      });

      // Limpiar caché viejo
      cleanCache();
      
      return formattedBooks;
    } catch (error) {
      console.error('Error searching books:', error);
      setError('Error al buscar libros');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Libros de fallback en caso de error con la API
  const getFallbackBooks = () => {
    // No fallback books by default - prefer empty array so Home shows only API results
    return [];
  };

  useEffect(() => {
    loadDiverseBooks();
  }, []);

  return {
    books,
    loading,
    error,
    searchBooks,
    searchCustomBooks,
    loadDiverseBooks,
    searchBooksBySubject,
    getFallbackBooks
  };
};

export default useOpenLibrary;