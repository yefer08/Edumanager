import React, { createContext, useCallback, useEffect, useState, useContext } from 'react';
import { AuthContext } from './AuthContext';

const BASE_STORAGE_KEY = 'favorites';

export const FavoritesContext = createContext({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  clearFavorites: () => {},
});

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);

  // Generar clave específica para el usuario
  const getStorageKey = useCallback(() => {
    return user ? `${BASE_STORAGE_KEY}_${user.uid}` : null;
  }, [user]);

  // Cargar favoritos cuando el usuario cambia
  useEffect(() => {
    if (!user) {
      setFavorites([]); // Limpiar favoritos si no hay usuario
      return;
    }

    try {
      const key = getStorageKey();
      if (key) {
        const raw = localStorage.getItem(key);
        if (raw) setFavorites(JSON.parse(raw));
        else setFavorites([]); // Inicializar vacío si no hay datos
      }
    } catch (e) {
      console.error('Error cargando favoritos:', e);
      setFavorites([]);
    }
  }, [user, getStorageKey]);

  // Guardar favoritos cuando cambian
  useEffect(() => {
    if (!user) return; // No guardar si no hay usuario

    try {
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(favorites));
      }
    } catch (e) {
      console.error('Error guardando favoritos:', e);
    }
  }, [favorites, user, getStorageKey]);

  const addFavorite = useCallback((book) => {
    setFavorites(prev => {
      const exists = prev.some(f => String(f.id) === String(book.id));
      if (exists) return prev;
      const entry = {
        id: book.id ?? Date.now(),
        title: book.titulo || book.title || 'Título desconocido',
        author: book.autor || book.author || 'Autor desconocido',
        cover: book.imagen || book.cover || null,
      };
      return [entry, ...prev];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites(prev => prev.filter(f => String(f.id) !== String(id)));
  }, []);

  const isFavorite = useCallback((id) => {
    return favorites.some(f => String(f.id) === String(id));
  }, [favorites]);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesProvider;
