import React from 'react';
import useSearch from '../hooks/useSearch';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const { handleSearch, isSearching } = useSearch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      handleSearch(searchTerm);
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-input-container">
        <svg 
          className="search-icon" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <input
          type="text"
          placeholder="Buscar libros, autores, géneros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
          disabled={isSearching}
        />
      </div>
      <button 
        type="submit" 
        className="search-button"
        disabled={isSearching}
      >
        {isSearching ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
};

export default SearchBar;