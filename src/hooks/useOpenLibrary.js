import { useState, useEffect } from 'react';

const useOpenLibrary = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para buscar libros por tema/género
  const searchBooksBySubject = async (subject, limit = 12) => {
    try {
      const response = await fetch(
        `https://openlibrary.org/subjects/${subject.toLowerCase()}.json?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      return data.works || [];
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
      : `https://via.placeholder.com/200x300/f8f9fa/6c757d?text=Sin+Portada`;

    return {
      id: work.key || `book-${index}`,
      titulo: work.title || 'Título no disponible',
      autor: work.authors && work.authors.length > 0 
        ? work.authors.map(author => author.name).join(', ')
        : 'Autor desconocido',
      genero: work.subject && work.subject.length > 0 
        ? work.subject[0] 
        : 'General',
      imagen: coverUrl,
      disponible: Math.random() > 0.3, // 70% de probabilidad de estar disponible
      descripcion: work.first_sentence 
        ? work.first_sentence.join(' ') 
        : 'Descripción no disponible',
      fechaPublicacion: work.first_publish_year || 'Fecha desconocida',
      subjects: work.subject || [],
      rating: Math.floor(Math.random() * 5) + 1 // Rating aleatorio del 1-5
    };
  };

  // Función principal para cargar libros diversos
  const loadDiverseBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Diferentes géneros/temas para obtener variedad
      const subjects = [
        'fiction',
        'science_fiction', 
        'fantasy',
        'mystery',
        'romance',
        'history',
        'biography',
        'science',
        'philosophy',
        'poetry'
      ];

      // Obtener libros de diferentes géneros
      const allBooks = [];
      
      for (const subject of subjects.slice(0, 6)) { // Limitar a 6 géneros para no sobrecargar
        const subjectBooks = await searchBooksBySubject(subject, 3);
        const formattedBooks = subjectBooks.map((work, index) => 
          formatBookData(work, `${subject}-${index}`)
        );
        allBooks.push(...formattedBooks);
      }

      // Mezclar y tomar una selección
      const shuffledBooks = allBooks
        .sort(() => Math.random() - 0.5)
        .slice(0, 18); // Mantener un número manejable

      setBooks(shuffledBooks);
    } catch (error) {
      console.error('Error loading books from Open Library:', error);
      setError('Error al cargar libros de Open Library');
      
      // Fallback a libros de ejemplo si la API falla
      setBooks(getFallbackBooks());
    } finally {
      setLoading(false);
    }
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