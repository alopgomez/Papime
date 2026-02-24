export function renderJuegosVP(container) {
  container.innerHTML = `
    <section class="games-section">
      <h2>Nuestros Minijuegos</h2>
      <p class="games-intro">
        Para acceder a los juegos y guardar tus estadísticas,
        debes iniciar sesión o crear una cuenta.
      </p>

      <div class="games-grid">

        <div class="game-card">
          <img src="assets/cal_mental.png" alt="Calculo Mental">
          <h3>🧮 Cálculo Mental</h3>
          <p>
            Resuelve operaciones matemáticas en el menor tiempo posible 
            y mejora tu velocidad mental.
          </p>
        </div>

        <div class="game-card">
          <img src="assets/nave.png" alt="Nave">
          <h3>🧠 Nave</h3>
          <p>
            Encuentra las parejas correctas antes de que el tiempo se agote 
            y entrena tu memoria visual.
          </p>
        </div>

        <div class="game-card">
          <img src="assets/memorama.png" alt="Memorama">
          <h3>📖 Math Match</h3>
          <p>
            Encuentra las parejas correctas antes de que el tiempo se agote 
            y entrena tu memoria visual.
          </p>
        </div>

        <div class="game-card">
          <img src="assets/vectores.png" alt="Vectores">
          <h3>📖 Vectores</h3>
          <p>
            Encuentra la magnitud de los vectores dando click en los globos correctos.
          </p>
        </div>

      </div>

    </section>
  `;

  // document.getElementById("go-signin").addEventListener("click", () => {
  //   alert("Aquí irá la vista de Sign In");
  // });

  // document.getElementById("go-signup").addEventListener("click", () => {
  //   alert("Aquí irá la vista de Sign Up");
  // });
}