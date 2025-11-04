import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import BookCard from './BookCard';

const RecommendationsSystem = () => {
  const { user } = useContext(AuthContext);
  const { preferences } = useContext(PreferencesContext);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Datos de ejemplo de libros organizados por género
  const booksByGenre = {
    'Ficción': [
      {
        id: 'fic1',
        titulo: 'Cien Años de Soledad',
        autor: 'Gabriel García Márquez',
        genero: 'Ficción',
        imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'Una obra maestra del realismo mágico.'
      },
      {
        id: 'fic2',
        titulo: 'El Amor en los Tiempos del Cólera',
        autor: 'Gabriel García Márquez',
        genero: 'Ficción',
        imagen: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'Una hermosa historia de amor que trasciende el tiempo.'
      }
    ],
    'Ciencia Ficción': [
      {
        id: 'scifi1',
        titulo: 'Dune',
        autor: 'Frank Herbert',
        genero: 'Ciencia Ficción',
        imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'Una épica saga de ciencia ficción en el desierto de Arrakis.'
      },
      {
        id: 'scifi2',
        titulo: 'Fundación',
        autor: 'Isaac Asimov',
        genero: 'Ciencia Ficción',
        imagen: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop',
        disponible: false,
        descripcion: 'La historia del Imperio Galáctico y su caída inevitable.'
      }
    ],
    'Historia': [
      {
        id: 'hist1',
        titulo: 'Sapiens',
        autor: 'Yuval Noah Harari',
        genero: 'Historia',
        imagen: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'Una fascinante exploración de la historia de la humanidad.'
      }
    ],
    'Misterio': [
      {
        id: 'myst1',
        titulo: 'El Nombre de la Rosa',
        autor: 'Umberto Eco',
        genero: 'Misterio',
        imagen: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'Un misterio medieval lleno de simbolismo y filosofía.'
      }
    ],
    'Romance': [
      {
        id: 'rom1',
        titulo: 'Orgullo y Prejuicio',
        autor: 'Jane Austen',
        genero: 'Romance',
        imagen: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'La clásica historia de amor entre Elizabeth y Darcy.'
      }
    ],
    'Fantasía': [
      {
        id: 'fant1',
        titulo: 'El Señor de los Anillos',
        autor: 'J.R.R. Tolkien',
        genero: 'Fantasía',
        imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop',
        disponible: true,
        descripcion: 'La épica aventura en la Tierra Media.'
      }
    ]
  };

  useEffect(() => {
    if (user && preferences) {
      generateRecommendations();
    }
  }, [user, preferences]);

  const generateRecommendations = () => {
    setLoading(true);
    
    // Obtener géneros favoritos del usuario
    const userGenres = preferences.generosFavoritos || [];
    const userFavoriteGenre = preferences.generoFavorito || userGenres[0];
    
    let recommendedBooks = [];

    // Si el usuario tiene géneros favoritos, recomendar basado en esos
    if (userFavoriteGenre && booksByGenre[userFavoriteGenre]) {
      recommendedBooks = [...booksByGenre[userFavoriteGenre]];
    }

    // Agregar libros de géneros similares
    userGenres.forEach(genre => {
      if (booksByGenre[genre]) {
        recommendedBooks = [...recommendedBooks, ...booksByGenre[genre]];
      }
    });

    // Si no tiene preferencias, mostrar una selección general
    if (recommendedBooks.length === 0) {
      const allGenres = Object.keys(booksByGenre);
      allGenres.forEach(genre => {
        if (booksByGenre[genre] && booksByGenre[genre].length > 0) {
          recommendedBooks.push(booksByGenre[genre][0]); // Tomar el primer libro de cada género
        }
      });
    }

    // Remover duplicados y limitar a 6 recomendaciones
    const uniqueBooks = recommendedBooks.filter((book, index, self) => 
      index === self.findIndex(b => b.id === book.id)
    ).slice(0, 6);

    setRecommendations(uniqueBooks);
    setLoading(false);
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
          <h2>🎯 Cargando Recomendaciones...</h2>
        </div>
        <div className="loading-spinner-container">
          <div className="spinner"></div>
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
          <p>Basado en tu interés en <strong>{userFavoriteGenre}</strong></p>
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
          💡 <strong>Sistema Inteligente:</strong> Nuestras recomendaciones mejoran con tus interacciones
        </p>
      </div>
    </div>
  );
};

export default RecommendationsSystem;