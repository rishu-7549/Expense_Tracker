// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, doc, setDoc } from "firebase/firestore";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUZ-2k4jIE4bKDrgowFrn-dSaceI4xRR4",
  authDomain: "finance-track-4d5be.firebaseapp.com",
  projectId: "finance-track-4d5be",
  storageBucket: "finance-track-4d5be.firebasestorage.app",
  messagingSenderId: "1035354948907",
  appId: "1:1035354948907:web:8190eafdc22043b23d316e",
  measurementId: "G-BC5LBS73QW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider(app);

export { db, auth, provider, doc, setDoc };