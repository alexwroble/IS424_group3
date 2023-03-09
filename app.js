// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDOMKx-CFQUpcSjCzM248VujvTgCFhHydw",
  authDomain: "youtsephotography-542fa.firebaseapp.com",
  projectId: "youtsephotography-542fa",
  storageBucket: "youtsephotography-542fa.appspot.com",
  messagingSenderId: "804419696590",
  appId: "1:804419696590:web:bfee8cc5a8d44952e15d9f",
  measurementId: "G-PJV30F7QSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);