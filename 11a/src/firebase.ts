import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCDVJhBU6PGHcYzLrq6Q0_sEoalJOAjGl0",
    authDomain: "auth-integration-21e55.firebaseapp.com",
    projectId: "auth-integration-21e55",
    storageBucket: "auth-integration-21e55.firebasestorage.app",
    messagingSenderId: "656347439382",
    appId: "1:656347439382:web:1de1934c3ac6364ebd3037"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app; 