import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBrdWSoKc-j_qfsElj88fOGzMSQrS1Oxow",
  authDomain: "eduquest-c4293.firebaseapp.com",
  projectId: "eduquest-c4293",
  storageBucket: "eduquest-c4293.firebasestorage.app",
  messagingSenderId: "162436197254",
  appId: "1:162436197254:web:6eee26884ff6eafbe2da07",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
