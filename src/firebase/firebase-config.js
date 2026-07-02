import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";



const firebaseConfig = {
  apiKey: "AIzaSyAxbpQSnK5dgZnsySoqg_PFdSka4eFylck",
  authDomain: "darkcity-a3b54.firebaseapp.com",
  projectId: "darkcity-a3b54",
  storageBucket: "darkcity-a3b54.firebasestorage.app",
  messagingSenderId: "270116452581",
  appId: "1:270116452581:web:f55ad985f65dd69c91fc0c",
  measurementId: "G-WLEER5BLZM"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const functions = getFunctions(app);

export const messaging = getMessaging(app);