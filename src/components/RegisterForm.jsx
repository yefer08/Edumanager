import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { AuthContext } from '../context/AuthContext';
import { PreferencesContext } from '../context/PreferencesContext';
import useOpenLibrary from '../hooks/useOpenLibrary';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    gender: '',
    grade: '',
    favoriteGenre: '' // Añadido género literario favorito
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useContext(AuthContext);
  const { updatePreferences, addFavoriteBook } = useContext(PreferencesContext);
  const { searchBooksBySubject, searchBooks } = useOpenLibrary();
  const navigate = useNavigate();

  // Lista de géneros literarios disponibles
  const availableGenres = [
    'Ficción',
    'No Ficción',
    'Misterio',
    'Romance',
    'Ciencia Ficción',
    'Fantasía',
    'Biografía',
    'Historia',
    'Autoayuda',
    'Poesía',
    'Aventura',
    'Terror',
    'Drama',
    'Infantil',
    'Juvenil'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    // Validar campos requeridos
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El primer nombre es requerido';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'El apellido es requerido';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Formato de correo electrónico inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es requerida';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'El género es requerido';
    }
    
    if (!formData.grade) {
      newErrors.grade = 'El grado académico es requerido';
    }
    
    if (!formData.favoriteGenre) {
      newErrors.favoriteGenre = 'Selecciona un género literario de tu interés';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error específico cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      console.log("Registrando usuario con email:", formData.email);
      
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      const user = userCredential.user;
      console.log("Usuario registrado:", user);
      
      // Actualizar perfil del usuario
      const displayName = `${formData.firstName} ${formData.secondName || ''} ${formData.lastName} ${formData.secondLastName || ''}`.trim();
      await updateProfile(user, { displayName });
      
      // Guardar preferencias literarias del usuario
      const userPreferences = {
        generoFavorito: formData.favoriteGenre,
        generosFavoritos: [formData.favoriteGenre],
        autoresFavoritos: [],
        librosFavoritos: []
      };
      
      console.log('Guardando preferencias del usuario:', userPreferences);
      
      const result = await updatePreferences(userPreferences);
      if (result.success) {
        console.log('Preferencias guardadas exitosamente');

        // Intentar añadir automáticamente algunos libros de ejemplo a favoritos
        try {
          const slugMap = {
            'Ficción': 'fiction',
            'No Ficción': 'nonfiction',
            'Misterio': 'mystery',
            'Romance': 'romance',
            'Ciencia Ficción': 'science_fiction',
            'Fantasía': 'fantasy',
            'Biografía': 'biography',
            'Historia': 'history',
            'Autoayuda': 'self_help',
            'Poesía': 'poetry',
            'Aventura': 'adventure',
            'Terror': 'horror',
            'Thriller': 'thriller',
            'Drama': 'drama',
            'Infantil': 'children',
            'Juvenil': 'young_adult',
            'Ciencia': 'science',
            'Filosofía': 'philosophy'
          };

          const slug = slugMap[formData.favoriteGenre] || formData.favoriteGenre.toLowerCase().replace(/\s+/g, '_');
          let fetched = [];
          try {
            fetched = await searchBooksBySubject(slug, 8);
          } catch (err) {
            console.warn('searchBooksBySubject falló, intentando searchBooks', err);
            fetched = await searchBooks(formData.favoriteGenre, 8);
          }

          if (fetched && fetched.length > 0) {
            const toAdd = fetched.slice(0, 6);
            toAdd.forEach(b => {
              try {
                addFavoriteBook({ id: b.id, titulo: b.titulo, autor: b.autor, imagen: b.imagen, genero: b.genero });
              } catch (err) {
                console.warn('Error añadiendo favorito:', err);
              }
            });
          }
        } catch (err) {
          console.warn('No se pudieron añadir libros automáticamente a favoritos:', err);
        }

      } else {
        console.warn('No se pudieron guardar las preferencias:', result.error);
      }
      
      console.log("Usuario registrado exitosamente:", {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        additionalData: formData,
        preferences: userPreferences
      });
      
      // Actualizar contexto de autenticación
      await login(user);
      
      // Navegar a la página principal
      navigate('/');
      
    } catch (error) {
      console.error("Error de registro:", error);
      let errorMessage = 'Error al crear la cuenta';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Ya existe una cuenta con este correo electrónico';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Formato de correo electrónico inválido';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es muy débil';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Registro de usuarios no habilitado';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Configuración de Firebase no encontrada. Verifica que Email/Password esté habilitado en Firebase Console.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <div className="form-header">
          <h2>Crear Cuenta</h2>
          <p className="subtitle">Únete a BiblioEdu</p>
        </div>
        
        <form onSubmit={handleSignUp} className="auth-form">
          {errors.general && (
            <div className="error-message general-error">
              <svg className="error-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.general}
            </div>
          )}

          {/* Nombres */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Primer Nombre *</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Juan"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? 'error' : ''}
                disabled={loading}
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="secondName">Segundo Nombre</label>
              <input
                type="text"
                id="secondName"
                name="secondName"
                placeholder="Carlos"
                value={formData.secondName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Apellidos */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="lastName">Primer Apellido *</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="García"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? 'error' : ''}
                disabled={loading}
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="secondLastName">Segundo Apellido</label>
              <input
                type="text"
                id="secondLastName"
                name="secondLastName"
                placeholder="Rodríguez"
                value={formData.secondLastName}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <div className="input-container">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                disabled={loading}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Contraseñas */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña *</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757M9.878 9.878a3 3 0 000 4.242m4.242-4.242L17.12 17.12M6.757 6.757a9.97 9.97 0 00-1.563 3.029c1.275 4.057 5.065 7 9.543 7 1.4 0 2.764-.293 3.964-.825M6.757 6.757L3 3m14.12 14.12L21 21m-4.88-4.88a9.966 9.966 0 002.343-6.12C17.268 5.057 13.478 2 9 2c-1.4 0-2.764.293-3.964.825" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
              <div className="input-container">
                <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showConfirmPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757M9.878 9.878a3 3 0 000 4.242m4.242-4.242L17.12 17.12M6.757 6.757a9.97 9.97 0 00-1.563 3.029c1.275 4.057 5.065 7 9.543 7 1.4 0 2.764-.293 3.964-.825M6.757 6.757L3 3m14.12 14.12L21 21m-4.88-4.88a9.966 9.966 0 002.343-6.12C17.268 5.057 13.478 2 9 2c-1.4 0-2.764.293-3.964.825" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    )}
                  </svg>
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Información Personal */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="birthDate">Fecha de Nacimiento *</label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleChange}
                className={errors.birthDate ? 'error' : ''}
                disabled={loading}
              />
              {errors.birthDate && <span className="error-text">{errors.birthDate}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="gender">Género *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'error' : ''}
                disabled={loading}
              >
                <option value="">Seleccionar</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </select>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>
          </div>

          {/* Grado Académico */}
          <div className="form-group">
            <label htmlFor="grade">Grado Académico *</label>
            <select
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className={errors.grade ? 'error' : ''}
              disabled={loading}
            >
              <option value="">Seleccionar grado</option>
              <option value="6to">6to Grado</option>
              <option value="7mo">7mo Grado</option>
              <option value="8vo">8vo Grado</option>
              <option value="9no">9no Grado</option>
              <option value="10mo">10mo Grado</option>
              <option value="11mo">11mo Grado</option>
              <option value="universidad">Universidad</option>
              <option value="postgrado">Postgrado</option>
            </select>
            {errors.grade && <span className="error-text">{errors.grade}</span>}
          </div>

          {/* Género Literario Favorito */}
          <div className="form-group">
            <label htmlFor="favoriteGenre">Género Literario de Interés *</label>
            <select
              id="favoriteGenre"
              name="favoriteGenre"
              value={formData.favoriteGenre}
              onChange={handleChange}
              className={errors.favoriteGenre ? 'error' : ''}
              disabled={loading}
            >
              <option value="">Selecciona un género</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
            {errors.favoriteGenre && <span className="error-text">{errors.favoriteGenre}</span>}
            <small className="help-text">Esto nos ayudará a recomendarte libros de tu interés</small>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="loading-spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="32" strokeDashoffset="32">
                    <animate attributeName="stroke-dasharray" dur="2s" values="0 32;16 16;0 32;0 32" repeatCount="indefinite"/>
                  </circle>
                </svg>
                Creando cuenta...
              </>
            ) : (
              'Crear Cuenta'
            )}
          </button>
        </form>
        
        <div className="form-footer">
          <div className="login-link">
            <span>¿Ya tienes cuenta? </span>
            <a href="/login">Iniciar sesión aquí</a>
          </div>
        </div>
      </div>
    </div>
  );
}