import { logout } from "../autenticacion.js";
import { navigate } from "../enrutador.js";

export function renderNavbar(user) {

  const nav = document.getElementById("navbar");
  if (!nav) return;

  if (!user) {
    renderNavbarInvitado(nav);
  } else {
    renderNavbarUsuario(nav, user);
    menuUsuario();
  }
}

function renderNavbarInvitado(nav) {
  nav.innerHTML = `
    <nav class="navbar">
      <div class="nav-left" style="padding: 0px 10px">
        <img src="../assets/logo.png" class="logo" style="height: 40px; width: 50px" />
        <a href="#" data-route="home"><span class="site-title">Papime</span></a>
      </div>
      <div class="nav-center">
        <ul class="nav-links">
          <li><a href="#" data-route="home">Inicio</a></li>
          <li><a href="#" data-route="juegosVP">Juegos</a></li>
          <li><a href="#" data-route="comoJugar">Cómo jugar</a></li>
        </ul>
      </div>
      <div class="auth-buttons nav-right" style="padding: 0px 10px">
        <button data-route="signin" class="btn-outline">Iniciar sesión</button>
        <button data-route="signup" class="btn-gold">Registrarse</button>
      </div>
    </nav>
  `;

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      const route = button.getAttribute("data-route");
      navigate(route);
    });
  });
}

function renderNavbarUsuario(nav, user) {
  nav.innerHTML = `
    <nav class="navbar">
      <div class="nav-left" style="padding: 0px 10px">
        <img src="../assets/logo.png" class="logo" style="height: 40px; width: 50px" />
        <a href="#" data-route="home"><span class="site-title">Papime</span></a>
      </div>
      <div class="nav-center">
        <ul class="nav-links">
          <li><a href="#" data-route="home">Inicio</a></li>
          <li><a href="#" data-route="juegosVP">Juegos</a></li>
          <li><a href="#" data-route="comoJugar">Cómo jugar</a></li>
          <li><a href="#" data-route="contacto">Contacto</a></li>
        </ul>
      </div>

      <div class="nav-right">
        <div class="user-menu">
          <div class="user-avatar">
            <svg class="avatar-triangle" viewBox="0 0 50 46">
              <polygon points="0,0 50,0 25,46"></polygon>
              <text id="usernameDisplay" x="25" y="20"></text>
            </svg>
          </div>

          <div id="dropdownMenu" class="dropdown-menu">
            <button id="profileSectionBtn">Perfil</button>
            <button id="statsSectionBtn">Estadísticas</button>
            <div class="dropdown-divider"></div>
            <div class="cs-link" style="text-align: left;">
              <a href="#" id="logoutBtn">Cerrar sesión</a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `;

  updateUserInitial(user);

  document.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      const route = button.getAttribute("data-route");
      navigate(route);
    });
  });
}

export function updateUserInitial(user) {
  const initial = user.username.charAt(0).toUpperCase();

  const initialElement = document.getElementById("usernameDisplay");

  if(initialElement){
    initialElement.textContent = initial;
  }
}

function menuUsuario() {

  const usernameDisplay = document.querySelector(".user-menu");

  usernameDisplay.addEventListener("click", () => {
    usernameDisplay.classList.toggle("active");
  });

  document.getElementById("profileSectionBtn")
    .addEventListener("click", () => navigate("perfil"));

  document.getElementById("statsSectionBtn")
    .addEventListener("click", () => navigate("stats"));

  document.getElementById("logoutBtn")
    .addEventListener("click", () => {
      logout();
      navigate("home");
  });

  // Cerrar si hace click fuera
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".user-menu")) {
      usernameDisplay.classList.remove("active");
    }
  });
}