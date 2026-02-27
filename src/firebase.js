
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDL1I3-VAYqh-8KllUh4QBikx6jP44Fgho",
  authDomain: "bookingapp-8c0c7.firebaseapp.com",
  projectId: "bookingapp-8c0c7",
  storageBucket: "bookingapp-8c0c7.firebasestorage.app",
  messagingSenderId: "1051122772225",
  appId: "1:1051122772225:web:6b6ac7c02458381854d300"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const db = getFirestore(app)