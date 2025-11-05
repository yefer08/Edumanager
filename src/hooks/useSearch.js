import { useState, useEffect } from 'react';
import useOpenLibrary from './useOpenLibrary';

const useSearch = () => {
  const { searchBooks } = useOpenLibrary();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const searchQuery = urlParams.get('search');

      if (searchQuery) {
        setIsSearching(true);
        setSearchError(null);
        try {
          const results = await searchBooks(searchQuery);
          setSearchResults(results || []);
        } catch (error) {
          console.error('Error en la búsqueda:', error);
          setSearchError(error.message);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    };

    performSearch();
  }, [window.location.search, searchBooks]);

  const handleSearch = (query) => {
    if (!query?.trim()) return;

    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('search', query.trim());
    
    if (window.location.pathname === '/biblioteca') {
      // Si ya estamos en la página de biblioteca, actualizamos la URL sin recargar
      window.history.pushState({}, '', `/biblioteca?${searchParams.toString()}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      // Si estamos en otra página, navegamos normalmente
      window.location.href = `/biblioteca?${searchParams.toString()}`;
    }
  };

  return {
    searchResults,
    isSearching,
    searchError,
    handleSearch
  };
};

export default useSearch;