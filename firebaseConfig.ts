import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQQT7PMLSIQTvJf0kQuclzVxdwfEXDTRw",
  authDomain: "pilvi-react-8f475.firebaseapp.com",
  projectId: "pilvi-react-8f475",
  storageBucket: "pilvi-react-8f475.appspot.com",
  messagingSenderId: "603472879408",
  appId: "1:603472879408:web:ddb8ab3b9cd296aab8b2f5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app)

export {firestore, auth, firebaseConfig}