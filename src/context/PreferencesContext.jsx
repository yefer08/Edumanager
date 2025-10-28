import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    generosFavoritos: [],
    autoresFavoritos: [],
    notificaciones: true,
    privacidad: 'publico'
  });
  const [loading, setLoading] = useState(false);

  // Por ahora no cargaremos desde Firestore para evitar errores de permisos
  useEffect(() => {
    if (user) {
      console.log('Usuario logueado, cargando preferencias locales por ahora...');
      // Aquí podrías cargar desde localStorage o usar valores por defecto
      const savedPreferences = localStorage.getItem(`preferences_${user.uid}`);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, [user]);

  const updatePreferences = async (newPreferences) => {
    if (user) {
      try {
        // Guardar en localStorage por ahora
        localStorage.setItem(`preferences_${user.uid}`, JSON.stringify(newPreferences));
        setPreferences(newPreferences);
        console.log('Preferencias guardadas localmente');
        return { success: true };
      } catch (error) {
        console.error('Error updating preferences:', error);
        return { success: false, error: error.message };
      }
    }
    return { success: false, error: 'Usuario no autenticado' };
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

  const value = {
    preferences,
    loading,
    updatePreferences,
    addFavoriteGenre,
    removeFavoriteGenre,
    addFavoriteAuthor,
    removeFavoriteAuthor
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};