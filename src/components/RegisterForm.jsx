import React, { useState } from "react";
import { auth } from "../config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterForm() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario registrado:", userCredential.user);
        // Aquí podrías guardar los datos adicionales en Firestore
        console.log("Datos adicionales para guardar:", {
          firstName: formData.firstName,
          secondName: formData.secondName,
          lastName: formData.lastName,
          secondLastName: formData.secondLastName,
          birthDate: formData.birthDate,
          gender: formData.gender,
          grade: formData.grade,
          email: email
        });
        alert("¡Usuario registrado exitosamente!");
        window.location.href = '/login';
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
          <label className="form-label">Género interés*</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="select-dropdown"
          >
            <option value="">Seleccionar</option>
            <option value="ficcion">Ficción</option>
            <option value="no-ficcion">No Ficción</option>
            <option value="misterio">Misterio</option>
            <option value="romance">Romance</option>
            <option value="ciencia-ficcion">Ciencia Ficción</option>
            <option value="fantasia">Fantasía</option>
            <option value="biografia">Biografía</option>
            <option value="historia">Historia</option>
            <option value="autoayuda">Autoayuda</option>
            <option value="poesia">Poesía</option>
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

        <input
          type="button"
          title="Registrarse"
          onClick={handleSignUp}
          value="Registrar"
          className="btn-register"
        />

        <div className="login-link">
          <span>¿Ya tienes cuenta? </span>
          <a href="/login">Iniciar sesión aquí</a>
        </div>
      </div>
    </div>
  );
}