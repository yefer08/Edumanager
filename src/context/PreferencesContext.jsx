import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const PreferencesContext = createContext();

export const PreferencesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [preferences, setPreferences] = useState({
    generosFavoritos: [],
    autoresFavoritos: [],
    librosFavoritos: [],
  });
  const [loading, setLoading] = useState(false);
  const isUpdatingRef = useRef(false); // Bandera para evitar recargas durante actualizaciones

  // Cargar preferencias desde Firebase cuando el usuario inicia sesión
  useEffect(() => {
    const loadPreferences = async () => {
      // No recargar si estamos en medio de una actualización
      if (isUpdatingRef.current) {
        return;
      }
      
      if (!user) {
        // Si no hay usuario, limpiar preferencias
        setPreferences({
          generosFavoritos: [],
          autoresFavoritos: [],
          librosFavoritos: [],
        });
        return;
      }

      try {
        setLoading(true);
        const userDocRef = doc(db, 'usuarios', user.uid);
        const userDoc = await getDoc(userDocRef);
        
        if (userDoc.exists()) {
          const data = userDoc.data();
          const prefs = data.preferencias || {};
          
          setPreferences({
            generosFavoritos: prefs.generos || [],
            autoresFavoritos: prefs.autores || [],
            librosFavoritos: prefs.libros || [],
          });
          console.log('Preferencias cargadas desde Firebase:', prefs);
        } else {
          console.log('No se encontró documento de usuario');
        }
      } catch (err) {
        console.error('Error cargando preferencias desde Firebase:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPreferences();
  }, [user]);

  const updatePreferences = async (newPreferences) => {
    if (!user) {
      console.warn('No hay usuario autenticado para guardar preferencias');
      return { success: false, error: 'Usuario no autenticado' };
    }

    try {
      const userDocRef = doc(db, 'usuarios', user.uid);
      
      // Mapear los datos al formato de Firebase
      const firebasePrefs = {
        generos: newPreferences.generosFavoritos || [],
        autores: newPreferences.autoresFavoritos || [],
        libros: newPreferences.librosFavoritos || [],
      };

      // Actualizar o crear el documento con las preferencias
      await setDoc(userDocRef, {
        preferencias: firebasePrefs
      }, { merge: true });

      setPreferences(newPreferences);
      console.log('Preferencias guardadas en Firebase:', firebasePrefs);
      return { success: true };
    } catch (error) {
      console.error('Error guardando preferencias en Firebase:', error);
      return { success: false, error: error.message };
    }
  };

  const addFavoriteGenre = (genre) => {
    const updatedGenres = [...preferences.generosFavoritos];
    if (!updatedGenres.includes(genre)) {
      updatedGenres.push(genre);
      const newPreferences = { ...preferences, generosFavoritos: updatedGenres };
      
      // Actualizar estado local inmediatamente
      setPreferences(newPreferences);
      
      // Guardar en Firebase en background
      if (user) {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const firebasePrefs = {
          generos: newPreferences.generosFavoritos || [],
          autores: newPreferences.autoresFavoritos || [],
          libros: newPreferences.librosFavoritos || [],
        };
        setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
          .catch(err => console.error('Error guardando género:', err));
      }
    }
  };

  const removeFavoriteGenre = (genre) => {
    const updatedGenres = preferences.generosFavoritos.filter(g => g !== genre);
    const newPreferences = { ...preferences, generosFavoritos: updatedGenres };
    
    // Actualizar estado local inmediatamente
    setPreferences(newPreferences);
    
    // Guardar en Firebase en background
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const firebasePrefs = {
        generos: newPreferences.generosFavoritos || [],
        autores: newPreferences.autoresFavoritos || [],
        libros: newPreferences.librosFavoritos || [],
      };
      setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
        .catch(err => console.error('Error removiendo género:', err));
    }
  };

  const addFavoriteAuthor = (author) => {
    const updatedAuthors = [...preferences.autoresFavoritos];
    if (!updatedAuthors.includes(author)) {
      updatedAuthors.push(author);
      const newPreferences = { ...preferences, autoresFavoritos: updatedAuthors };
      
      // Actualizar estado local inmediatamente
      setPreferences(newPreferences);
      
      // Guardar en Firebase en background
      if (user) {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const firebasePrefs = {
          generos: newPreferences.generosFavoritos || [],
          autores: newPreferences.autoresFavoritos || [],
          libros: newPreferences.librosFavoritos || [],
        };
        setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
          .catch(err => console.error('Error guardando autor:', err));
      }
    }
  };

  const removeFavoriteAuthor = (author) => {
    const updatedAuthors = preferences.autoresFavoritos.filter(a => a !== author);
    const newPreferences = { ...preferences, autoresFavoritos: updatedAuthors };
    
    // Actualizar estado local inmediatamente
    setPreferences(newPreferences);
    
    // Guardar en Firebase en background
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const firebasePrefs = {
        generos: newPreferences.generosFavoritos || [],
        autores: newPreferences.autoresFavoritos || [],
        libros: newPreferences.librosFavoritos || [],
      };
      setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
        .catch(err => console.error('Error removiendo autor:', err));
    }
  };

  // Favoritos de libros: guardar objetos de libro (con id)
  const addFavoriteBook = (book) => {
    const updated = [...(preferences.librosFavoritos || [])];
    if (!updated.find(b => b.id === book.id)) {
      updated.push(book);
      const newPreferences = { ...preferences, librosFavoritos: updated };
      
      // Marcar que estamos actualizando
      isUpdatingRef.current = true;
      
      // Actualizar estado local inmediatamente (optimistic update)
      setPreferences(newPreferences);
      
      // Guardar en Firebase en background sin bloquear la UI
      if (user) {
        const userDocRef = doc(db, 'usuarios', user.uid);
        const firebasePrefs = {
          generos: newPreferences.generosFavoritos || [],
          autores: newPreferences.autoresFavoritos || [],
          libros: newPreferences.librosFavoritos || [],
        };
        setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
          .then(() => {
            // Desmarcar después de un pequeño delay
            setTimeout(() => { isUpdatingRef.current = false; }, 100);
          })
          .catch(err => {
            console.error('Error guardando favorito:', err);
            isUpdatingRef.current = false;
          });
      } else {
        isUpdatingRef.current = false;
      }
    }
  };

  const removeFavoriteBook = (bookId) => {
    const updated = (preferences.librosFavoritos || []).filter(b => b.id !== bookId);
    const newPreferences = { ...preferences, librosFavoritos: updated };
    
    // Marcar que estamos actualizando
    isUpdatingRef.current = true;
    
    // Actualizar estado local inmediatamente (optimistic update)
    setPreferences(newPreferences);
    
    // Guardar en Firebase en background sin bloquear la UI
    if (user) {
      const userDocRef = doc(db, 'usuarios', user.uid);
      const firebasePrefs = {
        generos: newPreferences.generosFavoritos || [],
        autores: newPreferences.autoresFavoritos || [],
        libros: newPreferences.librosFavoritos || [],
      };
      setDoc(userDocRef, { preferencias: firebasePrefs }, { merge: true })
        .then(() => {
          // Desmarcar después de un pequeño delay
          setTimeout(() => { isUpdatingRef.current = false; }, 100);
        })
        .catch(err => {
          console.error('Error removiendo favorito:', err);
          isUpdatingRef.current = false;
        });
    } else {
      isUpdatingRef.current = false;
    }
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