import { auth, db } from "./firebase/firebaseConfig.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// Registro
export async function signup(username, identifier, password) {

  const unamEmail = `${identifier}@pcpuma.acatlan.unam.mx`;

  try {

    await createUserWithEmailAndPassword(auth, unamEmail, password);

    // Guardar datos adicionales
    await setDoc(doc(db, "users", identifier), {
      username: username,
      identifier: identifier,
      createdAt: new Date(),
      stats: {}
    });

    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
}


// Login
export async function login(identifier, password) {

  const unamEmail = `${identifier}@pcpuma.acatlan.unam.mx`;

  try {
    await signInWithEmailAndPassword(auth, unamEmail, password);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}


// Logout
export async function logout() {
  await signOut(auth);
}


// Escuchar estado de sesión
export function listenAuthState(callback) {

  onAuthStateChanged(auth, async (user) => {

    if (user) {
      const identifier = user.email.split("@")[0];
      const userDoc = await getDoc(doc(db, "users", identifier));

      // const userRef = doc(db, "users", identifier);
      // const changedUser = onSnapshot(userRef, (docSnap) => {
      //   if(docSnap.exists()){
      //     const data = docSnap.data();
      //     updateUserHome(data);
      //   }
      // });

      callback({
        id: identifier,
        ...userDoc.data()
      });

    } else {
      callback(null);
    }
  });
}