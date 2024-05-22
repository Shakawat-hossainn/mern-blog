// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "mern-blog-64e34.firebaseapp.com",
  projectId: "mern-blog-64e34",
  storageBucket: "mern-blog-64e34.appspot.com",
  messagingSenderId: "5102980334",
  appId: "1:5102980334:web:33c0da6a0debbb44b5b7ff"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);