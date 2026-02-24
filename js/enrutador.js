import { renderHome } from "./vistas/home.js";
import { renderJuegosVP } from "./vistas/juegosVP.js";
import { renderComoJugar } from "./vistas/comojugar.js";
import { renderContacto } from "./vistas/contacto.js";

export function navigate(route) {

  const app = document.getElementById("app");

  switch(route) {
    case "juegosVP":
      renderJuegosVP(app);
      break;
    case "comoJugar":
      renderComoJugar(app);
      break;
    case "contacto":
      renderContacto(app);
      break;
    default:
      renderHome(app);
  }
}