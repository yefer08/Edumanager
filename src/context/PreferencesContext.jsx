import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    generosFavoritos: [],
    autoresFavoritos: [],
    librosFavoritos: [],
  });
  const [loading, setLoading] = useState(false);

  // Por ahora no cargaremos desde Firestore para evitar errores de permisos
  useEffect(() => {
    // Cargar preferencias desde localStorage, por usuario si está autenticado o como 'guest'
    const key = `preferences_${user ? user.uid : 'guest'}`;
    try {
      const savedPreferences = localStorage.getItem(key);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    } catch (err) {
      console.error('Error cargando preferencias desde localStorage:', err);
    }
  }, [user]);

  const updatePreferences = async (newPreferences) => {
    try {
      const key = `preferences_${user ? user.uid : 'guest'}`;
      localStorage.setItem(key, JSON.stringify(newPreferences));
      setPreferences(newPreferences);
      console.log('Preferencias guardadas localmente');
      return { success: true };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return { success: false, error: error.message };
    }
  };

  const addFavoriteGenre = (genre) => {
    const updatedGenres = [...preferences.generosFavoritos];
    if (!updatedGenres.includes(genre)) {
      updatedGenres.push(genre);
      updatePreferences({ ...preferences, generosFavoritos: updatedGenres });
    }
  };

  const removeFavoriteGenre = (genre) => {
    const updatedGenres = preferences.generosFavoritos.filter(g => g !== genre);
    updatePreferences({ ...preferences, generosFavoritos: updatedGenres });
  };

  const addFavoriteAuthor = (author) => {
    const updatedAuthors = [...preferences.autoresFavoritos];
    if (!updatedAuthors.includes(author)) {
      updatedAuthors.push(author);
      updatePreferences({ ...preferences, autoresFavoritos: updatedAuthors });
    }
  };

  const removeFavoriteAuthor = (author) => {
    const updatedAuthors = preferences.autoresFavoritos.filter(a => a !== author);
    updatePreferences({ ...preferences, autoresFavoritos: updatedAuthors });
  };

  // Favoritos de libros: guardar objetos de libro (con id)
  const addFavoriteBook = (book) => {
    const updated = [...(preferences.librosFavoritos || [])];
    if (!updated.find(b => b.id === book.id)) {
      updated.push(book);
      updatePreferences({ ...preferences, librosFavoritos: updated });
    }
  };

  const removeFavoriteBook = (bookId) => {
    const updated = (preferences.librosFavoritos || []).filter(b => b.id !== bookId);
    updatePreferences({ ...preferences, librosFavoritos: updated });
  };

  const isBookFavorited = (bookId) => {
    return (preferences.librosFavoritos || []).some(b => b.id === bookId);
  };

  const value = {
    preferences,
    loading,
    updatePreferences,
    addFavoriteGenre,
    removeFavoriteGenre,
    addFavoriteAuthor,
    removeFavoriteAuthor
    ,addFavoriteBook,
    removeFavoriteBook,
    isBookFavorited
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};