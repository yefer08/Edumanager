import { useState, useEffect } from 'react';

// Cache para almacenar los libros entre renders
let librosCache = null;

const useFetchLibros = () => {
  const [libros, setLibros] = useState(() => librosCache || []);
  const [loading, setLoading] = useState(!librosCache);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Si ya tenemos los datos en cache, no hacemos nada
    if (librosCache) {
      return;
    }

    const fetchLibros = async () => {
      try {
        setLoading(true);
        setError(null);

      const mockLibros = [
          {
            id: '1',
            titulo: 'Cien años de soledad',
            autor: 'Gabriel García Márquez',
            genero: 'Realismo Mágico',
            imagen: '/books/cien-anos-soledad.jpg',
            descripcion: 'Una obra maestra de la literatura latinoamericana.',
            fechaPublicacion: '1967',
            isbn: '978-0-06-088328-7'
          },
          {
            id: '2',
            titulo: '1984',
            autor: 'George Orwell',
            genero: 'Distopía',
            imagen: '/books/1984.jpg',
            descripcion: 'Una novela distópica sobre un futuro totalitario.',
            fechaPublicacion: '1949',
            isbn: '978-0-452-28423-4'
          },
          {
            id: '3',
            titulo: 'El Quijote',
            autor: 'Miguel de Cervantes',
            genero: 'Clásico',
            imagen: '/books/quijote.jpg',
            descripcion: 'La obra cumbre de la literatura española.',
            fechaPublicacion: '1605',
            isbn: '978-84-376-0494-7'
          },
          {
            id: '4',
            titulo: 'Orgullo y Prejuicio',
            autor: 'Jane Austen',
            genero: 'Romance',
            imagen: '/books/orgullo-prejuicio.jpg',
            descripcion: 'Una novela romántica sobre Elizabeth Bennet y Mr. Darcy.',
            fechaPublicacion: '1813',
            isbn: '978-0-14-143951-8'
          },
          {
            id: '5',
            titulo: 'Harry Potter y la Piedra Filosofal',
            autor: 'J.K. Rowling',
            genero: 'Fantasía',
            imagen: '/books/harry-potter-1.jpg',
            descripcion: 'El inicio de la saga mágica más famosa del mundo.',
            fechaPublicacion: '1997',
            isbn: '978-0-439-70818-8'
          },
          {
            id: '6',
            titulo: 'El Código Da Vinci',
            autor: 'Dan Brown',
            genero: 'Misterio',
            imagen: '/books/codigo-davinci.jpg',
            descripcion: 'Un thriller que combina arte, historia y misterio.',
            fechaPublicacion: '2003',
            isbn: '978-0-307-47427-5'
          }
        ];

        // Guardamos en cache y estado
        librosCache = mockLibros;
        setLibros(mockLibros);
        console.log('Libros cargados exitosamente:', mockLibros.length);

      } catch (err) {
        console.error('Error loading libros:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []); // Solo se ejecuta una vez al montar el componente si no hay cache

  const refetch = () => {
    // Limpiar cache y volver a cargar
    librosCache = null;
    setLoading(true);
    setLibros([]);
  };

  return { libros, loading, error, refetch };
};

export default useFetchLibros;