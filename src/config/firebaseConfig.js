// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_wr0MDWXGjSwghkma-gf6z1j2m3QankE",
  authDomain: "biblioedu-1e659.firebaseapp.com",
  projectId: "biblioedu-1e659",
  storageBucket: "biblioedu-1e659.firebasestorage.app",
  messagingSenderId: "981609356833",
  appId: "1:981609356833:web:b3746ec65836362e080d60",
  measurementId: "G-4Z68EZ13K0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;