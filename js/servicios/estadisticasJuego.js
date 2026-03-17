import { db } from "../firebase/firebaseConfig.js";
import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveGameSession(
  userId,
  gameName,
  level,
  correct,
  incorrect,
  startedAt,
  finishedAt
) {

  const durationSeconds = Math.floor(
    (finishedAt - startedAt) / 1000
  );

  await addDoc(
    collection(db, "users", userId, "gameSessions"),
    {
      game: gameName,
      level: level,
      correct: correct,
      incorrect: incorrect,
      startedAt: startedAt,
      finishedAt: finishedAt,
      durationSeconds: durationSeconds,
      createdAt: serverTimestamp()
    }
  );
}