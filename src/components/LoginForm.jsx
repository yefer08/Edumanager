import React, { useState } from 'react';
import { auth } from '../config/firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log("Email", email);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("Usuario logueado:", userCredential.user);
        alert("¡Login exitoso!");
        window.location.href = '/';
      })
      .catch((error) => {
        console.log("Error:", error.message);
        alert("Error: " + error.message);
      });
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Iniciar sesión</h2>
        <p className="subtitle">Acceso para estudiantes</p>
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <input
          type="button"
          title="Iniciar sesión"
          onClick={handleLogin}
          value="Iniciar"
          className="btn-primary"
        />
        
        <div className="register-link">
          <span>¿Ya estás registrado? </span>
          <a href="/register">Registrar aquí</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;