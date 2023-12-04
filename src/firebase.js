import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

import {getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDlqc-8jQaBm3mhQtH3A5AqUOILvXWZrKw",
  authDomain: "insta-reel-13158.firebaseapp.com",
  projectId: "insta-reel-13158",
  storageBucket: "insta-reel-13158.appspot.com",
  messagingSenderId: "700794485208",
  appId: "1:700794485208:web:0341bbc502712ebbde5aad"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const storage = getStorage();
let provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const db = getFirestore(app);

