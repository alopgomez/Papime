import { navigate } from "../enrutador.js"
import { getCurrentUser } from "../estado.js";

export function renderComoJugar(container) {
  if (!container) return;

  const user = getCurrentUser();

  if (!user) {
    renderComoJugarInvitado(container);
  } else {
    renderComoJugarUsuario(container);
  }
}

function renderComoJugarInvitado(container) {
  container.innerHTML = `
    <div class="comojugar">
      <h2>Como aprender a jugar</h2>
      <div>
        ¡Es muy sencillo! Puedes:
        <ul class="comojugar-links">
          <li>Ir a <a href="#" id="home">Inicio</a> y explorar 
          los juegos que tenemos disponibles para ti.</li>
          <li><a href="#" id="signup">Registrarte</a> con nosotros 
          para obtener recompensas y seguir tu progreso.</li>
        </ul>
      </div>

      <div>
        Una vez hayas seleccionado alguno de nuestros juegos, debes escoger 
        el nivel de dificultad que quieres jugar. La dificultad dependerá
        del tipo de juego y de tu nivel de conocimientos.
      </div>
      <div style="margin-top: 20px">
        Hay juegos para todo tipo de edades y gustos, así que prepárate para
        divertirte y aprender sin límite.
      </div>
    </div>
  `;

  document.getElementById("signup").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("signup");
  });

  document.getElementById("home").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("home");
  });
}

function renderComoJugarUsuario(container) {
  container.innerHTML = `
    <div class="comojugar">
      <h2>Como aprender a jugar</h2>
      <div>
        Puedes acceder a lo juegos en tu página de 
        <a href="#" id="home" class="solo-links" style="font-size: 24px">Inicio</a>.

        <div style="margin-top: 20px">
          Una vez hayas seleccionado alguno de nuestros juegos, debes escoger 
          el nivel de dificultad que quieres jugar. La dificultad dependerá
          del tipo de juego y de tu nivel de conocimientos.
        </div>
      </div>

      <div style="margin-top: 20px">
        También puedes visitar tu menú de usuario que se encuentra en la parte superior
        derecha del sitio. Aquí puedes:

        <ul>
          <li>Ver y personalizar tu perfil.</li>
          <li>Cambiar tu contraseña.</li>
          <li>Ver estadísticas de progreso en tus juegos favoritos.</li>
        </ul>
      </div>
      <div style="margin-top: 20px">
        Hay juegos para todo tipo de edades y gustos, así que prepárate para
        divertirte y aprender sin límite.
      </div>
    </div>
  `;

  document.getElementById("home").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("home");
  });
}