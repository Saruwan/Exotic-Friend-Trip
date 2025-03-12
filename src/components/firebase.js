// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// ตั้งค่า Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByKZN8f8SQ5-5J3EQ9C5DRsSt7KBfN-RQ",
  authDomain: "login-5fe56.firebaseapp.com",
  projectId: "login-5fe56",
  storageBucket: "login-5fe56.firebasestorage.app",
  messagingSenderId: "937602858388",
  appId: "1:937602858388:web:de327daf5802e09b196381",
};

// เริ่มต้น Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export { auth, provider, signInWithPopup };
