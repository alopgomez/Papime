import { saveGameSession } from "../servicios/estadisticasJuego.js";
import { getCurrentUser, setCurrentUser } from "../estado.js";

let currentGame = null;
let currentLevel = null;
let startTime = null;
let finished = false;

export function initGame(gameName, level) {
  currentGame = gameName;
  currentLevel = level;
  startTime = Date.now();
  finished = false;
}

export async function finishGame(correct, incorrect) {
  if (!currentGame) return null;

  finished = true;

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);
  
  const currentUser = getCurrentUser();
  if (!currentUser) return null;

  await saveGameSession(
    currentUser.identifier,
    currentGame,
    currentLevel,
    correct,
    incorrect,
    startTime,
    endTime,
    totalTime
  );

  const result = {
    currentUser: currentUser.identifier,
    currentGame: currentGame,
    currentLevel: currentLevel,
    correct: correct,
    incorrect: incorrect,
    start: startTime,
    end: endTime,
    time: totalTime
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