import React, { useState } from 'react';

const PreferencesForm = ({ onSave }) => {
  const [preferences, setPreferences] = useState({
    generosFavoritos: [],
    autoresFavoritos: [],
  });

  const generos = [
    'Ficción', 'No Ficción', 'Misterio', 'Romance', 'Ciencia Ficción',
    'Fantasía', 'Biografía', 'Historia', 'Autoayuda', 'Poesía'
  ];

  const handleGenreChange = (genero) => {
    setPreferences(prev => ({
      ...prev,
      generosFavoritos: prev.generosFavoritos.includes(genero)
        ? prev.generosFavoritos.filter(g => g !== genero)
        : [...prev.generosFavoritos, genero]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="preferences-form">
      <h3>Preferencias de Lectura</h3>
      
      <div className="form-section">
        <h4>Géneros Favoritos</h4>
        <div className="checkbox-group">
          {generos.map(genero => (
            <label key={genero} className="checkbox-label">
              <input
                type="checkbox"
                checked={preferences.generosFavoritos.includes(genero)}
                onChange={() => handleGenreChange(genero)}
              />
              {genero}
            </label>
          ))}
        </div>
      </div>

      {/* Notificaciones y privacidad removidos por decisión de producto */}

      <button type="submit" className="btn-primary">
        Guardar Preferencias
      </button>
    </form>
  );
};

export default PreferencesForm;