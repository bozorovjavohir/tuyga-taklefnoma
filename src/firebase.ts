import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "SENING_API_KEY",
  authDomain: "SENING_PROJECT.firebaseapp.com",
  projectId: "SENING_PROJECT_ID",
  storageBucket: "SENING_PROJECT.firebasestorage.app",
  messagingSenderId: "SENING_MESSAGING_SENDER_ID",
  appId: "SENING_APP_ID",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
