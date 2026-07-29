import { getCurrentUser, setCurrentUser } from "../estado.js";
import { navigate } from "../enrutador.js";
import { highlightErrors } from "./registro.js"
import { updateUserInitial } from "./navbar.js"
import { setupPasswordToggles, eyeClosedIcon } from "./registro.js"
import { db } from "../firebase/firebaseConfig.js";
import { updateDoc, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

export async function renderVistaStats(container) {

  const user = getCurrentUser();

  if (!user) {
    container.innerHTML = "<p>Debes iniciar sesión.</p>";
    return;
  }

  container.innerHTML = `
    <section class="stats">
      <h2>Estadísticas de ${user.username}</h2>

      <div class="div-stats-selectbox" id="divselectbox">
        <select class="classSelectbox" id="idselectbox">
          <option value="">Selecciona un juego...</option>
          <option value="calculoMental">Cálculo Mental</option>
          <option value="balloons">Balloons</option>
          <option value="loteria">Lotería Matemática</option>
          <option value="pokemat">Pokemat</option>
          <option value="mathless">Mathless</option>
        </select> 
      </div>

      <div class="stats-content">
        <section class="player-summary">
          <div class="summary-info">
            <div class="summary-row">
                <span>Sesiones</span>
                <span id="totalSessions">-</span>
            </div>

            <div class="summary-row">
                <span>Fecha de registro</span>
                <span id="registrationDate">-</span>
            </div>

            <div class="summary-row">
                <span>Último inicio de sesión</span>
                <span id="lastLogin">-</span>
            </div>

            <div class="summary-row">
                <span>Nº de juegos totales</span>
                <span id="totalGames">-</span>
            </div>

            <div class="summary-row">
                <span>Juego favorito</span>
                <span id="favoriteGame">-</span>
            </div>

            <div class="summary-row">
                <span>Tiempo total jugado</span>
                <span id="totalPlayTime">-</span>
            </div>
          </div>

          <div class="summary-chart">
            <h3>Proporción de juegos</h3>
            <canvas id="gamesPieChart"></canvas>
          </div>
        </section>
      </div>

      <div class="stats-content">
        <section class="player-summary hidden" id="gameStatsContainer">
        </section>
      </div>

      <button id="statsBackHomeBtn" class="btn-gold" style="margin-top: 15px">Volver</button>
    </section>
  `;

  const selbox = document.getElementById("idselectbox");

  const datosTodos = await generarDatosGenerales();

  document.getElementById("statsBackHomeBtn")
    .addEventListener("click", () => navigate("home"));
  
  selbox.addEventListener("change", () => {
    const idjuego = selbox.value;
    const nombrejuego = selbox.options[selbox.selectedIndex].text;
    generarDatosJuego(idjuego, nombrejuego, datosTodos);
    renderHistoryChart(datosTodos.ggames[idjuego]);
  });

}

async function generarDatosGenerales() {
  const user = getCurrentUser();

  const snap = await getDoc(doc(db, "users", user.identifier));
  const dat = snap.data();

  const regdate = new Date(dat.createdAt["seconds"]*1e3 + dat.createdAt["nanoseconds"]/1e6);
  const lastlogin = new Date(dat.lastLogin["seconds"]*1e3 + dat.lastLogin["nanoseconds"]/1e6);

  document.getElementById("totalSessions").textContent = dat.nsessions;
  document.getElementById("registrationDate").textContent = regdate.toLocaleDateString("es-MX");
  document.getElementById("lastLogin").textContent = lastlogin.toLocaleString("es-MX");
  document.getElementById("totalGames").textContent = dat.totalGames;

  const f = await obtenerDatos(user.identifier);

  document.getElementById("favoriteGame").textContent = f.fav;
  document.getElementById("totalPlayTime").textContent = f.totaltime;

  return f;
}

let daysg = 12; // dias de grafica de barras

async function obtenerDatos(id) {
  const dat = await getDocs(collection(db, "users", id, "gameSessions"));
  const datos = dat.docs.map(doc => doc.data());

  let totalPlayTime = 0;
  let gameCount = {};
  let gameLatest = {};
  let totalTimeGame = {};
  let gameLongest = {};
  let favLevel = {};
  let countGame = {};

  datos.forEach(session => {
    const lvl = session.level;
    const game = session.game;
    gameLatest[game] = new Date(0);
    gameLongest[game] = 0;
    favLevel[game] = {};
    favLevel[game][lvl] = 0;
    countGame[game] = Array(daysg).fill(0);
  });

  console.log(favLevel);

  datos.forEach(session => {
    const game = session.game;
    const lvl = session.level;

    gameCount[game] = (gameCount[game] || 0) + 1;
    favLevel[game][lvl] = (favLevel[game][lvl] || 0) + 1;

    const nlatest = new Date(session.createdAt["seconds"]*1e3 + session.createdAt["nanoseconds"]/1e6);
    if(nlatest.valueOf() > gameLatest[game].valueOf()) {
      gameLatest[game] = nlatest;
    }

    const greatestgame = session.durationSeconds;
    if(greatestgame > gameLongest[game]) {
      gameLongest[game] = greatestgame;
    }

    totalTimeGame[game] = (totalTimeGame[game] || 0) + session.durationSeconds;

    totalPlayTime += session.durationSeconds || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDate = session.createdAt .toDate();
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));

    if(diffDays >= 0 && diffDays < daysg){
      countGame[game][daysg - 1 - diffDays]++;
    }
  });

  let favoriteGame = "-";
  let maxPlays = 0;

  Object.entries(gameCount)
    .forEach(([game, count]) => {
      if(count > maxPlays){
        maxPlays = count;
        favoriteGame = game;
      }
    });
  
  renderPieChart(gameCount);

  return { fav: favoriteGame, totaltime: totalPlayTime, nog: gameCount,
           latest: gameLatest, tgt: totalTimeGame, longest: gameLongest, 
           flvl: favLevel, ggames:countGame,
   };
}

function getPieChartData(gameCount) {
  return {
    labels: Object.keys(gameCount),
    values: Object.values(gameCount)
  };
}

let gamesPieChart = null;

function renderPieChart(gameCount) {
  const { labels, values } = getPieChartData(gameCount);
  const canvas = document.getElementById("gamesPieChart");

  if(!canvas) {
    return;
  }

  if(gamesPieChart){
    gamesPieChart.destroy();
  }

  gamesPieChart = new Chart(canvas, {
    type: "pie",
    data: {
      labels,
      datasets: [{
          data: values
      }]
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
              color: "#FFCC00"
          }
        }
      }
    }
  });
}

function generarDatosJuego(id, nombre, datos) {
  const dat = document.getElementById("gameStatsContainer");

  if(!id) {
    dat.classList.add("hidden");
    return;
  }

  dat.classList.remove("hidden");

  dat.innerHTML = `
    <div class="summary-info">
      <div class="summary-row">
        <span>Nº de juegos:</span>
        <span id="numJuegos">-</span>
      </div>

      <div class="summary-row">
        <span>Última partida:</span>
        <span id="ultima">-</span>
      </div>

      <div class="summary-row">
        <span>Tiempo total jugado:</span>
        <span id="tiempoTotal">-</span>
      </div>

      <div class="summary-row">
        <span>Partida más larga:</span>
        <span id="masLarga">-</span>
      </div>

      <div class="summary-row">
        <span>Nivel preferido:</span>
        <span id="nivelPreferido">-</span>
      </div>
    </div>

    <div class="summary-chart">
      <h3>Distribución por tiempo</h3>
      <canvas id="gamesTimeDist"></canvas>
    </div>
  `
  colocarDatosJuego(id, datos);

  return;
}

function colocarDatosJuego(juego, datos) {
  try {
    document.getElementById("numJuegos").textContent = datos.nog[juego];

    const ultp = datos.latest[juego];
    document.getElementById("ultima").textContent = ultp.toLocaleString("es-MX");

    let ttotal = datos.tgt[juego];
    let tunit = ' s';
    if (ttotal > 60) {
      ttotal = ttotal/60.0;
      tunit = ' m';
    }
    else if (ttotal > 3600) {
      ttotal = ttotal/3600.0;
      tunit = ' h';
    }

    document.getElementById("tiempoTotal").textContent = ttotal+tunit;
    document.getElementById("masLarga").textContent = datos.longest[juego] + ' s';

    const dfav = datos.flvl[juego];
    const biggest = Object.entries(dfav)
      .reduce((biggest, current, ind) => {
        const parts = current
        return (!ind || parts[1] > biggest[1]) ? parts : biggest  
      }, null);
    document.getElementById("nivelPreferido").textContent = biggest[0];
  }
  catch (exp) {
    if (exp instanceof TypeError) {
      const dat = document.getElementById("gameStatsContainer");
      dat.classList.remove("hidden");

      dat.innerHTML = `
        <div id="divStatsGame">
          <span style="color: red;">No existen datos para ${juego}</span>
        </div>
      `
    }
    else {
      const dat = document.getElementById("gameStatsContainer");
      dat.classList.remove("hidden");

      dat.innerHTML = `
        <div id="divStatsGame">
          <span style="color: red;">Sucedió un error desconocido</span>
        </div>
      `
    }
  }

  return;
}

let gamesHistoryChart = null;

function renderHistoryChart(count){
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const labels = [];

  // Crear etiquetas
  for(let i = daysg-1; i >= 0; i--){
    const day = new Date(today);
    day.setDate(today.getDate() - i);
    labels.push(
      `${day.getDate()}/${day.getMonth() + 1}`
    );
  }
  console.log(count);

  const ctx = document.getElementById("gamesTimeDist");

  if(gamesHistoryChart){
    gamesHistoryChart.destroy();
  }

  gamesHistoryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Partidas",
        data: count,
        backgroundColor: "#003366",
        borderColor: "#FFCC00",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            color: "#FFFFFF"
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: "#FFFFFF"
          },
          grid: {
            color: "rgba(255,255,255,0.1)"
          }
        }
      }
    }
  });
}