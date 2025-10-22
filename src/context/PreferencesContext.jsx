import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import { db } from '../config/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

  // Cargar preferencias del usuario desde Firestore
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const docRef = doc(db, 'userPreferences', user.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setPreferences(docSnap.data());
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPreferences) => {
    if (user) {
      try {
        const docRef = doc(db, 'userPreferences', user.uid);
        await setDoc(docRef, newPreferences, { merge: true });
        setPreferences(newPreferences);
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