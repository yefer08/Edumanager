import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useOpenLibrary from './useOpenLibrary';

const useSearch = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { searchBooks } = useOpenLibrary();
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {
      const urlParams = new URLSearchParams(location.search);
      const searchQuery = urlParams.get('search');

      console.log('useSearch - Query:', searchQuery);

      if (searchQuery) {
        setIsSearching(true);
        setSearchError(null);
        try {
          console.log('Buscando en API:', searchQuery);
          const results = await searchBooks(searchQuery, 20);
          console.log('Resultados obtenidos:', results?.length || 0);
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
        setIsSearching(false);
      }
    };

    performSearch();
  }, [location.search, searchBooks]);

  const handleSearch = (query) => {
    if (!query?.trim()) return;

    const searchQuery = query.trim();
    console.log('Navegando a biblioteca con búsqueda:', searchQuery);
    navigate(`/biblioteca?search=${encodeURIComponent(searchQuery)}`);
  };

  return {
    searchResults,
    isSearching,
    searchError,
    handleSearch
  };
};

export default useSearch;