import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxzlGrTf2ywahugOCI320SHwpyCRVI8l8",
  authDomain: "yu-gi-oh-35fd9.firebaseapp.com",
  projectId: "yu-gi-oh-35fd9",
  storageBucket: "yu-gi-oh-35fd9.firebasestorage.app",
  messagingSenderId: "640207987920",
  appId: "1:640207987920:web:8f6c4e5a04e5adb1e26ad5",
  measurementId: "G-H9BB6G1QER"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };