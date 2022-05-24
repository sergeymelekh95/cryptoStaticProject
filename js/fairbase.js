import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";
import { getDatabase, set, ref, update, onValue } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDfMFCaBUJZzS0IzQhytp-1LKqw82dYmcc",
    authDomain: "crypto-stat-app.firebaseapp.com",
    projectId: "crypto-stat-app",
    storageBucket: "crypto-stat-app.appspot.com",
    messagingSenderId: "526056261105",
    appId: "1:526056261105:web:83ed95af9d8cfbf854b050"
};

export default createUserWithEmailAndPassword;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export {createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, set, ref, update, onValue, auth, database};