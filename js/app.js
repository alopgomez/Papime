import { navigate } from "./enrutador.js";
import { isGameActive, cancelGame } from "./juegos/engine.js";

document.addEventListener("DOMContentLoaded", () => {
  navigate("home");

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      const route = button.getAttribute("data-route");
      navigate(route);
    });
  });
});

window.addEventListener("beforeunload", (event) => {
  if (isGameActive()) {
    cancelGame();

    // Esto muestra advertencia en algunos navegadores
    event.preventDefault();
    event.returnValue = "";
  }
});