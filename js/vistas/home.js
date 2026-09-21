import { startGame } from "../games.js"
import { navigate } from "../enrutador.js"
import { getCurrentUser } from "../estado.js";

export function renderHome(container) {
  if (!container) return;

  const user = getCurrentUser();

  if (!user) {
    renderHomeInvitado(container);
  } else {
    renderHomeUsuario(container, user.username);
  }
}

function renderHomeInvitado(container) {
  container.innerHTML = `
    <section class="hero">
      <h1>
        Bienvenido a Papime, una plataforma de minijuegos educativos 
        diseñada para mejorar tus habilidades mientras te diviertes.
      </h1>
      <p>
        Aprende y refuerza tus conocimientos de lógica y matemáticas de una
        forma divertida e interactiva. Regístrate para una mejor experiencia.
      </p>
      <div class="btn-reg-home">
        <button data-route="signup">Regístrate en Papime</button>
      </div>

      <div class="scroll-indicator">
        <span></span>
      </div>
    </section>

    <section class="games">
      <h2>Explora nuestros juegos</h2>
      <div class="game-buttons">
        <button data-game="calculoMental">🧮 Cálculo Mental</button>
        <!--<button data-game="balloons">🧮 Balloons </button>-->
        <button data-game="loteria">🧮 Loteria </button>
        <!--<button data-game="wordless">🧮 Mathless </button>
        <button data-game="pokemat">🧮 Pokemat </button>-->
      </div>
    </section>
  `;

  // Activar eventos después de renderizar
  container.querySelectorAll("[data-game]").forEach(button => {
    button.addEventListener("click", () => {
      startGame(button.dataset.game);
    });
  });
  
  container.querySelectorAll("[data-route]").forEach(button => {
    button.addEventListener("click", () => {
      const route = button.getAttribute("data-route");
      navigate(route);
    });
  });

  const scrollIndicator = document.querySelector('.scroll-indicator');

  window.addEventListener('scroll', () => {
    const maxScroll = 200; // punto donde desaparece completamente
    const currentScroll = window.scrollY;

    let opacity = 1 - (currentScroll / maxScroll);

    if (opacity < 0) opacity = 0;

    scrollIndicator.style.opacity = opacity;
  });
  
}

function renderHomeUsuario(container, user) {
  container.innerHTML = `
    <section class="hero" style="min-height: 10vh">
      <h1 id="greetUser">
        ¡Hola! ${user}
      </h1>
      <p style="font-size: 22px">
        ¿Qué quieres jugar hoy?
      </p>
    </section>

    <section class="games" style="min-height: 20vh">
      <h2 style="font-size: 40px">Aquí tienes algunos de tus juegos favoritos</h2>
      <div class="game-buttons">
        <button data-game="calculoMental">🧮 Cálculo Mental</button>
        <button data-game="balloons">🧮 Balloons </button>
        <button data-game="loteria">🧮 Loteria </button>
        <!--<button data-game="wordless">🧮 Mathless </button>
        <button data-game="pokemat">🧮 Pokemat </button>-->
      </div>
    </section>
  `;

  // Activar eventos después de renderizar
  container.querySelectorAll("[data-game]").forEach(button => {
    button.addEventListener("click", () => {
      startGame(button.dataset.game);
    });
  });
}
