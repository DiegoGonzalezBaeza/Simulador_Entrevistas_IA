// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAIpY7vPMNLIKu2kLxYJSgD60RNQFBi0uo",
  authDomain: "interviewai-f105d.firebaseapp.com",
  projectId: "interviewai-f105d",
  storageBucket: "interviewai-f105d.firebasestorage.app",
  messagingSenderId: "166707470631",
  appId: "1:166707470631:web:55df2bb906504b71594902",
  measurementId: "G-K93NHHQ6PM"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);