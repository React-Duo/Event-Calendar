// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIbRfHOBZ8Sc54Qacjlo4l8N90jP1vnGc",
  authDomain: "event-calendar-c74a9.firebaseapp.com",
  databaseURL: "https://event-calendar-c74a9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "event-calendar-c74a9",
  storageBucket: "event-calendar-c74a9.appspot.com",
  messagingSenderId: "350521750646",
  appId: "1:350521750646:web:8a39fd34ce5d8f64139b57",
  measurementId: "G-R67KSXWD80"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Obtain reference to the realtime database itself
export const database = getDatabase(app);


