// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-dde80.firebaseapp.com",
  projectId: "mern-estate-dde80",
  storageBucket: "mern-estate-dde80.appspot.com",
  messagingSenderId: "544075145248",
  appId: "1:544075145248:web:460b0c22913585df4cdc45"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);