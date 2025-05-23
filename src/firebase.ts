import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getMessaging } from "firebase/messaging";


const firebaseConfig = {
  apiKey: "AIzaSyBXddzj_7XjZGesQBDeTBvbGsSE-7yO1s0",
  authDomain: "weekendplan-8cb1d.firebaseapp.com",
  projectId: "weekendplan-8cb1d",
  storageBucket: "weekendplan-8cb1d.firebasestorage.app",
  messagingSenderId: "131188847586",
  appId: "1:131188847586:web:797fd44bd8c2248e7f7fbb",
  measurementId: "G-3SW1PX745E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the services you’ll use
export const db = getFirestore(app);
export const auth = getAuth(app);
export const messaging = getMessaging(app);