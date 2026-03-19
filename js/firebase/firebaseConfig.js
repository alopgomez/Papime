import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDYpPRIeOvMuNYLjGOknLy_TJQiMWTN678",
  authDomain: "papime-ab87b.firebaseapp.com",
  projectId: "papime-ab87b",
  storageBucket: "papime-ab87b.appspot.com",
  messagingSenderId: "353413495346",
  appId: "1:353413495346:web:72160024b526600f235a2b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);