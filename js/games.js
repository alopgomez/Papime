//Importa la funcion BLA from BLABLA
import { renderCalculoMental } from "./juegos/calculoMental.js";
import { renderBalloons } from "./juegos/balloons.js";
import { renderLoteria } from "./juegos/loteria.js";
import { renderWordless } from "./juegos/wordless.js";

//N:Diccionario de juegos IMORTANTE añadir cada jueego
const gameMap = {
  calculoMental: renderCalculoMental,
  balloons: renderBalloons,
  loteria: renderLoteria,
  wordless: renderWordless,
  //nave: nombreFuncion=BLA,
};

export function startGame(gameName) {
  const app = document.getElementById("app");

  if (gameMap[gameName]) {
    gameMap[gameName](app);
  }
}