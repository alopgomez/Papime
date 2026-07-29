import { db } from "../firebase/firebaseConfig.js";
import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

export async function saveGameSession(
  userId,
  gameName,
  level,
  startedAt,
  finishedAt,
  totalTime,
  stats
) {

  const durationSeconds = Math.floor(
    (finishedAt - startedAt) / 1000
  );

  // console.log(stats);
  
  await addDoc(
    collection(db, "users", userId, "gameSessions"),
    {
      game: gameName,
      level: level,
      startedAt: startedAt,
      finishedAt: finishedAt,
      durationSeconds: durationSeconds,
      createdAt: serverTimestamp(),
      stats,
    }
  );
}