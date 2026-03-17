import { navigate } from "./enrutador.js";
import { isGameActive, cancelGame } from "./juegos/engine.js";
import { renderNavbar } from "./vistas/navbar.js";

import { listenAuthState } from "./autenticacion.js";
import { createSession, closeSession } from "./servicios/sesiones.js";
import { getCurrentUser, setCurrentUser } from "./estado.js";

// let currentUser = null;

listenAuthState(async (user) => {

  if (user && !getCurrentUser()) {
    await createSession(user.identifier);
  }

  // Usuario cerró sesión
  if (!user && getCurrentUser()) {
    const cuser = getCurrentUser();
    await closeSession(cuser.identifier);
  }

  // currentUser = user;
  setCurrentUser(user);
  renderNavbar(getCurrentUser());

  navigate("home");
});

document.addEventListener("DOMContentLoaded", () => {
  navigate("home");
  renderNavbar();

  // document.querySelectorAll("[data-route]").forEach(button => {
  //   button.addEventListener("click", () => {
  //     const route = button.getAttribute("data-route");
  //     navigate(route);
  //   });
  // });
});

window.addEventListener("beforeunload", (event) => {
  if (isGameActive()) {
    cancelGame();

    // Esto muestra advertencia en algunos navegadores
    event.preventDefault();
    event.returnValue = "";
  }
});