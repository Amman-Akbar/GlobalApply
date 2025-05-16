// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9kv6fi48nyffi2zLYVUt4ml0xDgZ0G54",
  authDomain: "globalapply-b1d3a.firebaseapp.com",
  projectId: "globalapply-b1d3a",
  storageBucket: "globalapply-b1d3a.firebasestorage.app",
  messagingSenderId: "151740208401",
  appId: "1:151740208401:web:57db10b7e0df1a681ce8b0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, googleProvider, db };