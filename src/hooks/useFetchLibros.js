import { useState, useEffect } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

const useFetchLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Crear query para obtener libros ordenados por título
        const q = query(collection(db, 'libros'), orderBy('titulo'));
        const querySnapshot = await getDocs(q);
        
        const librosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setLibros(librosData);
      } catch (err) {
        console.error('Error fetching libros:', err);
        setError(err.message);
        
        // Datos mock para desarrollo (cuando no hay conexión a Firebase)
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
        
        setLibros(mockLibros);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  const refetch = () => {
    fetchLibros();
  };

  return { libros, loading, error, refetch };
};

export default useFetchLibros;