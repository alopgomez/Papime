import { startGame } from "../games.js"
export function renderHome(container) {
  container.innerHTML = `
    <section class="hero">
      <h1>Aprende jugando 🚀</h1>
      <p>
        Bienvenido a Papime, una plataforma de minijuegos educativos 
        diseñada para mejorar tus habilidades mientras te diviertes.
      </p>
    </section>

    <section class="games">
      <h2>Explora nuestros juegos</h2>
      <div class="game-buttons">
        <button data-game="calculoMental">🧮 Cálculo Mental</button>
        <button data-game="balloons">🧮 Balloons </button>
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