//Importa la funcion BLA from BLABLA
import { renderCalculoMental } from "./juegos/calculoMental.js";

//Diccionario
const gameMap = {
  calculoMental: renderCalculoMental,
  //nave: nombreFuncion=BLA,
};

export function startGame(gameName) {
  const app = document.getElementById("app");

  if (gameMap[gameName]) {
    gameMap[gameName](app);
  }
}