// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.CLIENT_FIREBASE_API_KEY,
  authDomain: process.env.CLIENT_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.CLIENT_FIREBASE_PROJECT_ID,
  storageBucket: process.env.CLIENT_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.CLIENT_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.CLIENT_FIREBASE_APP_ID,
  measurementId: process.env.CLIENT_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);