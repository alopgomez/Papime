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
            <button id="exitGame" style="background:var(--red); color:white; width:100%; margin:8px 0;">Salir</button>
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
      const stats = {
        aciertos: correct,
        fallos: incorrect,
      };

      const res = finishGame(stats);
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
let racha = 0; // <-- PONLA AQUÍ, en el espacio global

//N:por aqui ya es nelli-IA work
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
    const sym = ['+','-','*'];
    const elem = [2,3,5,7,9];

    valorObjetivo = 0;
    while(valorObjetivo <= 0) {
        numerosPermitidos = [];

        const eind = rand(0,elem.length-1);

        const indrange = createRange(0, elem[eind]-1);

        let op = '';
        // let opnum = [];

        for(let i of indrange) {
            if(i%2) {
                const rsym = sym[rand(0, sym.length-1)];
                op += rsym;
            }
            else {
                let num = rand(0,10);
                while(numerosPermitidos.includes(num)) {
                    num = rand(0,10);
                }
                numerosPermitidos.push(num);
                op += num;
            }
        }
        valorObjetivo = eval(op);
    }

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
  } else if (nivelActual === 3) { // nivel añaidido
        const grandes = [17,25,29, 35 ,62, 71, 100];
        const pequenos = [2, 3, 4, 5, 6, 7, 8, 9];

        // 1. Elegir los números de la partida
        const numGrande = grandes[rand(0, grandes.length - 1)];
        const p1 = pequenos[rand(0, pequenos.length - 1)];
        const p2 = pequenos[rand(0, pequenos.length - 1)];
        const p3 = pequenos[rand(0, pequenos.length - 1)];

        // 2. Guardarlos para mostrarlos al usuario
        numerosPermitidos = [numGrande, p1, p2, p3];

        // 3. Crear el objetivo con ingeniería inversa
        // Parte A: Multiplicamos el grande por un pequeño para acercarnos a los cientos
        let bloqueA = numGrande * p1; 
        
        // Parte B: Hacemos algo con los otros dos pequeños (sumar o multiplicar al azar)
        let operadorSecundario = rand(0, 1) === 0 ? '+' : '*';
        let bloqueB = (operadorSecundario === '+') ? (p2 + p3) : (p2 * p3);

        // Parte C: Unimos los bloques (sumando o restando al azar)
        let operadorPrincipal = rand(0, 1) === 0 ? '+' : '-';
        if (operadorPrincipal === '+') {
            valorObjetivo = bloqueA + bloqueB;
        } else {
            valorObjetivo =  bloqueB-bloqueA ; // <-- Mínimamente invasivo: quitamos los Math.abs
        }

        // 4. Mostrar instrucciones
        guia.innerHTML = "Combina los números para llegar al objetivo exacto. Usa ( )";
        inst.innerText = "¡Usa cada número solo UNA vez!";
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
  if (nivelActual === 0 || nivelActual === 3) {   
      let copiaPermitidos = [...numerosPermitidos];
      for (let num of numerosEnInput) {
          let index = copiaPermitidos.indexOf(parseFloat(num));
          if (index === -1) {
              racha = 0; // Opcional: reiniciar racha aquí si usan números no permitidos
              feedback.style.color = "var(--danger)";
              feedback.innerText = `Error: El número ${num} no está disponible o ya se usó.`;
              return;
          }
          copiaPermitidos.splice(index, 1);
      }
  } else {
      const validos = numerosEnInput.every(num => 
          numerosPermitidos.includes(parseFloat(num)) || (nivelActual === 3 && num.includes('.'))
      );
      if (!validos && nivelActual !== 3) {
          racha = 0; // Reiniciar racha
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
            
            racha++; // <-- NUEVO: Sumar acierto
            if (racha >= 3) feedback.innerText = `¡LOGRADO! ¡Wow! Vas con todo 🔥 (Racha: ${racha})`;

        } else {
            racha = 0; // <-- NUEVO: Reiniciar si falla
            feedback.style.color = "var(--danger)";
            feedback.innerText = `Da ${resultado.toFixed(2)}. ¡Intenta otra vez!`;
            incorrect++;
        }
     } catch (e) {
        racha = 0; // <-- NUEVO: Reiniciar si hay error de sintaxis
        feedback.style.color = "orange";
        feedback.innerText = "Error de sintaxis.";
        incorrect++;
    }

}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function createRange(start, end, step = 1) {
  // Calculate the length of the array
  const length = Math.ceil((end - start) / step) + 1;
  
  return Array.from({ length }, (_, index) => start + index*step);
};

function getSolution0() {
    const syms = ['+','-','*','/'];
    
    const rnum = rand(0,4);
    rnum.forEach(n)


}
