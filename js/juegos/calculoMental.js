//Como para iniciar, terminar, cancelar y el enrutador es para regresar a la principal
import { initGame, finishGame, cancelGame } from "./engine.js";
import { navigate } from "../enrutador.js";

export function renderCalculoMental(container) {  
  container.innerHTML = `
    <div class="contenedor-juego">
        <div id="menu" class="pantalla activa">
            <h2 style="color: var(--dark)">Laboratorio de Cálculo</h2>
            <p>Selecciona tu nivel de desafío:</p>
            <button data-level="nivel0" style="background:var(--gold); color:white; width:100%; margin:8px 0;">Nivel 0: Un solo uso</button>
            <button data-level="nivel1" style="background:var(--success); color:white; width:100%; margin:8px 0;">Nivel 1: Aritmética</button>
            <button data-level="nivel2" style="background:var(--primary); color:white; width:100%; margin:8px 0;">Nivel 2: Potencias</button>
            <button data-level="nivel3" style="background:var(--dark); color:white; width:100%; margin:8px 0;">Nivel Actuario: Cálculo Real</button>
            <button id="exitGame">Salir</button>
        </div>

        <div id="juego" class="pantalla">
            <h3 id="txt-nivel" style="margin:0; color:var(--primary);"></h3>
            <div id="objetivo" class="objetivo-card">?</div>
            
            <p id="instruccion-uso">Números disponibles:</p>
            <div id="numeros-container" class="grid-numeros"></div>
            
            <div id="guia-sintaxis" class="guia-sintaxis"></div>

            <input type="text" id="respuesta-usuario" placeholder="Escribe la expresión...">
            
            <div class="controles">
                <button id="btn-check" class="btn-validar">Validar</button>
                <button id="btn-next" class="btn-siguiente">Siguiente Reto</button>
                <button id="omitir" class="btn-omitir">Omitir</button>
                <button id="terminar-juego" class="btn-menu">Terminar juego</button>
            </div>
            
            <div id="mensaje-feedback" class="mensaje"></div>
        </div>
    </div>
  `;

  document.getElementById("exitGame").
    addEventListener("click", () => {
      cancelGame();
      navigate("home");
  }); 

  const levels = {
    "nivel0": 0,
    "nivel1": 1,
    "nivel2": 2,
    "nivel3": 3,
  };
  container.querySelectorAll("[data-level]").forEach(button => {
    button.addEventListener("click", () => {
      const lvl = levels[button.dataset.level];
      initGame("calculoMental", lvl);
      iniciar(lvl);
    });
  });

  document.getElementById("btn-check").
    addEventListener("click", () => {
      validar();
  }); 

  document.getElementById("btn-next").
    addEventListener("click", () => {
      proximoReto();
  }); 

  document.getElementById("omitir").
    addEventListener("click", () => {
      proximoReto();
  });

//REtonrnas los datos del jueguito
  document.getElementById("terminar-juego").
    addEventListener("click", () => {
      const res = finishGame(correct, incorrect);
      console.log(res)

      correct = 0;
      incorrect = 0;
      irAlMenu();
  });
}


let valorObjetivo = 0;
let nivelActual = 0;
let numerosPermitidos = [];

let correct = 0;
let incorrect = 0;

//por aqui ya es nelli-IA work
function irAlMenu() {
    document.getElementById('juego').classList.remove('activa');
    document.getElementById('menu').classList.add('activa');
}

function iniciar(nivel) {
    nivelActual = nivel;
    document.getElementById('menu').classList.remove('activa');
    document.getElementById('juego').classList.add('activa');
    proximoReto();
}

function proximoReto() {
  const input = document.getElementById('respuesta-usuario');
  const feedback = document.getElementById('mensaje-feedback');
  const guia = document.getElementById('guia-sintaxis');
  const inst = document.getElementById('instruccion-uso');
  
  input.value = '';
  input.disabled = false;
  feedback.innerText = '';
  document.getElementById('btn-check').style.display = 'block';
  document.getElementById('btn-next').style.display = 'none';

  // Configuración de niveles
  if(nivelActual === 0) {
      valorObjetivo = rand(5, 25);
      numerosPermitidos = [rand(1,5), rand(1,5), rand(1,10)];
      guia.innerHTML = "<b>Nivel 0:</b> Solo puedes usar cada número UNA VEZ.";
      inst.innerText = "Usa cada número una sola vez:";
  } else if(nivelActual === 1) {
      valorObjetivo = rand(10, 50);
      numerosPermitidos = [rand(2,9), rand(2,9), rand(1,5)];
      guia.innerHTML = "<b>Sintaxis:</b> +, -, *, / y paréntesis ( )";
      inst.innerText = "Puedes repetir los números:";
  } else if(nivelActual === 2) {
      valorObjetivo = rand(50, 150);
      numerosPermitidos = [rand(2,6), rand(2,5), 2];
      guia.innerHTML = "<b>Potencias:</b> Usa **. Ejemplo: 5**2 = 25";
      inst.innerText = "Puedes repetir los números:";
  } else {
      valorObjetivo = rand(1, 10);
      numerosPermitidos = [16, 9, 2, 0.5];
      guia.innerHTML = "<b>Funciones:</b> Math.sqrt(x), Math.sin(x), Math.PI, Math.exp(x)";
      inst.innerText = "Nivel Actuario - Uso de funciones:";
  }

  document.getElementById('objetivo').innerText = valorObjetivo;
  document.getElementById('txt-nivel').innerText = nivelActual === 0 ? "Nivel Cero" : `Nivel ${nivelActual}`;
  
  const container = document.getElementById('numeros-container');
  container.innerHTML = '';
  numerosPermitidos.forEach(n => {
      let card = document.createElement('div');
      card.className = 'numero-card';
      card.innerText = n;
      container.appendChild(card);
  });
}

function validar() {
  const inputStr = document.getElementById('respuesta-usuario').value;
  const feedback = document.getElementById('mensaje-feedback');
  const numerosEnInput = inputStr.match(/\d+(\.\d+)?/g) || [];

  if (numerosEnInput.length === 0) {
      feedback.innerText = "Escribe una operación.";
      return;
  }

  // Lógica de Validación de Números
  if (nivelActual === 0) {
      // Copia de los permitidos para ir "tachando"
      let copiaPermitidos = [...numerosPermitidos];
      for (let num of numerosEnInput) {
          let index = copiaPermitidos.indexOf(parseFloat(num));
          if (index === -1) {
              feedback.style.color = "var(--danger)";
              feedback.innerText = `Error: El número ${num} no está disponible o ya se usó.`;
              return;
          }
          copiaPermitidos.splice(index, 1); // Quitarlo para que no se use de nuevo
      }
  } else {
      // Validación de uso ilimitado (pero solo de los permitidos)
      const validos = numerosEnInput.every(num => 
          numerosPermitidos.includes(parseFloat(num)) || (nivelActual === 3 && num.includes('.'))
      );
      if (!validos && nivelActual !== 3) {
          feedback.style.color = "var(--danger)";
          feedback.innerText = `Solo puedes usar: ${numerosPermitidos.join(', ')}`;
          incorrect++;
          return;
      }
  }

  try {
      // Usamos Math para que funciones como Math.sqrt funcionen directamente
      const resultado = eval(inputStr.replace(/Math\./g, "Math."));
      
      // Usamos un pequeño margen de error para decimales en nivel Actuario
      if (Math.abs(resultado - valorObjetivo) < 0.1) {
          feedback.style.color = "var(--success)";
          feedback.innerText = "¡LOGRADO! Respuesta correcta.";
          document.getElementById('btn-check').style.display = 'none';
          document.getElementById('btn-next').style.display = 'block';
          document.getElementById('respuesta-usuario').disabled = true;
          correct++;
      } else {
          feedback.style.color = "var(--danger)";
          feedback.innerText = `Da ${resultado.toFixed(2)}. ¡Intenta otra vez!`;
          incorrect++;
      }
  } catch (e) {
      feedback.style.color = "orange";
      feedback.innerText = "Error de sintaxis.";
      incorrect++;
  }
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}