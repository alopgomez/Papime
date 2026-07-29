import { saveGameSession } from "../servicios/estadisticasJuego.js";
import { getCurrentUser, setCurrentUser } from "../estado.js";
import { updateDoc, doc, getDoc, increment} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { db } from "../firebase/firebaseConfig.js";

let currentGame = null;
let currentLevel = null;
let startTime = null;
let finished = false;

export async function initGame(gameName, level) {
  currentGame = gameName;
  currentLevel = level;
  startTime = Date.now();
  finished = false;

  await updateDoc(doc(db, "users", currentUser.identifier), {
    totalGames: increment(1)
  })
}

export async function finishGame(stats) {
  if (!currentGame) return null;

  finished = true;

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  
  const currentUser = getCurrentUser();

  // console.log(stats);

  if (!currentUser) return null;

  await saveGameSession(
    currentUser.identifier,
    currentGame,
    currentLevel,
    startTime,
    endTime,
    totalTime,
    stats
  );

  const result = {
    currentUser: currentUser.identifier,
    currentGame: currentGame,
    currentLevel: currentLevel,
    start: startTime,
    end: endTime,
    time: totalTime,
    stats,
  }

  resetGame();
  return result;
}

export function cancelGame() {
  resetGame();
}

function resetGame() {
  currentGame = null;
  currentLevel = null;
  startTime = null;
  finished = false;
}

export function isGameActive() {
  return currentGame !== null;
}