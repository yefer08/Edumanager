import React, { useState, useContext } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { PreferencesContext } from "../context/PreferencesContext";

export default function RegisterForm() {
  const { updatePreferences } = useContext(PreferencesContext);
  
  // Estados básicos para Firebase Auth
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados adicionales para el formulario completo
  const [formData, setFormData] = useState({
    firstName: '',
    secondName: '',
    lastName: '',
    secondLastName: '',
    birthDate: '',
    gender: '',
    grade: ''
  });
  
  // Estado para género favorito
  const [selectedGenre, setSelectedGenre] = useState('');
  
  // Lista de géneros disponibles
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
    'Poesía'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreChange = (e) => {
    setSelectedGenre(e.target.value);
  };

  const handleSignUp = () => {
    console.log("Email", email);
    console.log("Datos adicionales:", formData);
    
    // Validación básica
    if (!email || !password) {
      alert("Email y contraseña son requeridos");
      return;
    }

    if (!formData.firstName || !formData.lastName) {
      alert("Nombre y apellido son requeridos");
      return;
    }

    if (!selectedGenre) {
      alert("Por favor, selecciona un género de interés");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        
        // Actualizar el perfil del usuario con su nombre
        const displayName = `${formData.firstName} ${formData.secondName || ''} ${formData.lastName} ${formData.secondLastName || ''}`.trim();
        
        try {
          await updateProfile(user, {
            displayName: displayName
          });
          
          // Guardar preferencias del usuario
          await updatePreferences({
            generoFavorito: selectedGenre,
            autoresFavoritos: []
          });
          
          console.log("Usuario registrado y preferencias guardadas:", {
            uid: user.uid,
            email: user.email,
            displayName: displayName,
            additionalData: formData,
            generoFavorito: selectedGenre
          });
          
          alert("¡Usuario registrado exitosamente!");
          window.location.href = '/login';
        } catch (error) {
          console.error("Error actualizando el perfil:", error);
          // Continuamos porque el usuario fue creado
          alert("Usuario creado pero hubo un error actualizando el perfil. Por favor actualiza tu perfil más tarde.");
        }
      })
      .catch((error) => {
        console.log("Error:", error.message);
        alert("Error: " + error.message);
      });
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>Regístrate</h2>
        
        <div className="form-section">
          <label className="form-label">Nombres*</label>
          <div className="name-inputs">
            <input
              type="text"
              name="firstName"
              placeholder="Primer nombre"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="secondName"
              placeholder="Segundo nombre"
              value={formData.secondName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Apellidos*</label>
          <div className="name-inputs">
            <input
              type="text"
              name="lastName"
              placeholder="Primer Apellido"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="secondLastName"
              placeholder="Segundo apellido"
              value={formData.secondLastName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <label className="form-label">Correo electrónico*</label>
          <input
            type="email"
            placeholder="jimena@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <label className="form-label">Contraseña*</label>
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-section">
          <label className="form-label">Fecha de nacimiento*</label>
          <input
            type="date"
            name="birthDate"
            placeholder="DD/MM/AAAA"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-section">
          <label className="form-label">Género de interés*</label>
          <select
            name="genre"
            value={selectedGenre}
            onChange={handleGenreChange}
            required
            className="select-dropdown"
          >
            <option value="">Selecciona un género</option>
            {availableGenres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-section">
          <label className="form-label">Grado*</label>
          <select
            name="grade"
            value={formData.grade}
            onChange={handleChange}
            required
            className="select-dropdown"
          >
            <option value="">Grado que cursas</option>
            <option value="6">6° Grado</option>
            <option value="7">7° Grado</option>
            <option value="8">8° Grado</option>
            <option value="9">9° Grado</option>
            <option value="10">10° Grado</option>
            <option value="11">11° Grado</option>
            <option value="universitario">Universitario</option>
            <option value="profesional">Profesional</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSignUp}
          className="btn-register"
        >
          Registrarse
        </button>

        <div className="login-link">
          <span>¿Ya tienes cuenta? </span>
          <a href="/login">Iniciar sesión aquí</a>
        </div>
      </div>
    </div>
  );
}