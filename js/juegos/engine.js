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

export function finishGame(correct, incorrect, extraData = {}) {
  if (!currentGame) return null;

  finished = true;

  const endTime = Date.now();
  const totalTime = Math.floor((endTime - startTime) / 1000);

  const result = {
    game: currentGame,
    level: currentLevel,
    correct: correct,
    incorrect: incorrect,
    time: totalTime,
    date: new Date().toISOString(),
    ...extraData
  };

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