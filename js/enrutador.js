import { renderHome } from "./vistas/home.js";
import { renderJuegosVP } from "./vistas/juegosVP.js";
import { renderComoJugar } from "./vistas/comojugar.js";
import { renderContacto } from "./vistas/contacto.js";
import { renderIniciarSesion } from "./vistas/iniciarSesion.js";
import { renderRegistro } from "./vistas/registro.js";
import { renderVistaPerfil } from "./vistas/perfil.js";
import { renderVistaStats } from "./vistas/stats.js";

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
    case "signin":
      renderIniciarSesion(app);
      break;
    case "signup":
      renderRegistro(app);
      break;
    case "perfil":
      renderVistaPerfil(app);
      break;
    case "stats":
      renderVistaStats(app);
      break;
    default:
      renderHome(app);
  }
}