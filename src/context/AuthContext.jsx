import React, { createContext, useState, useEffect } from 'react';
import { auth } from '../config/firebaseConfig';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario logueado:", result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.log("Error en login:", error.message);
      return { success: false, error: error.message };
    }
  };

  // Función de registro basada en el código del profesor
  const register = async (email, password) => {
    try {
      console.log("Email", email);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario registrado:", result.user);
      return { success: true, user: result.user };
    } catch (error) {
      console.log("Error:", error.message);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};