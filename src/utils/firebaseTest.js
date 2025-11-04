import { auth, db } from '../config/firebaseConfig';

// Función para verificar la conexión con Firebase
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('Auth object:', auth);
    console.log('DB object:', db);
    console.log('Auth app:', auth.app);
    console.log('Project ID:', auth.app.options.projectId);
    
    // Verificar estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('✅ User is signed in:', user.email);
      } else {
        console.log('❌ No user is signed in');
      }
    });
    
    return true;
  } catch (error) {
    console.error('❌ Firebase connection error:', error);
    return false;
  }
};

// Función para verificar la configuración
export const checkFirebaseConfig = () => {
  try {
    const config = auth.app.options;
    console.log('📋 Firebase Configuration:');
    console.log('- Project ID:', config.projectId);
    console.log('- Auth Domain:', config.authDomain);
    console.log('- API Key exists:', !!config.apiKey);
    console.log('- App ID:', config.appId);
    
    return config;
  } catch (error) {
    console.error('❌ Error checking Firebase config:', error);
    return null;
  }
};