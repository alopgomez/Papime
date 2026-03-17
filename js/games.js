//Importa la funcion BLA from BLABLA
import { renderCalculoMental } from "./juegos/calculoMental.js";
import { renderBalloons } from "./juegos/balloons.js";

//N:Diccionario de juegos IMORTANTE añadir cada jueego
const gameMap = {
  calculoMental: renderCalculoMental,
  balloons: renderBalloons,
  //nave: nombreFuncion=BLA,
};

export function startGame(gameName) {
  const app = document.getElementById("app");

  if (gameMap[gameName]) {
    gameMap[gameName](app);
  }
}