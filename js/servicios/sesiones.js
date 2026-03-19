import { db } from "../firebase/firebaseConfig.js";
import { addDoc, updateDoc, doc, collection, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentSessionId = null;

function getDeviceType() {
  const userAgent = navigator.userAgent;
  if (/Mobi|Android/i.test(userAgent)) {
    return "mobile";
  }
  return "desktop";
}

export async function createSession(userId) {

  const sessionRef = await addDoc(collection(db, "users", userId, "sessions"), {
    loginAt: serverTimestamp(),
    logoutAt: null,
    deviceType: getDeviceType(),
    userAgent: navigator.userAgent
  });

  currentSessionId = sessionRef.id;
}

export async function closeSession(userId) {

  if (!currentSessionId) return;

  await updateDoc(doc(db, "users", userId, "sessions", currentSessionId), {
    logoutAt: serverTimestamp()
  });

  currentSessionId = null;
}