import { initGame, finishGame, cancelGame } from "./engine.js";
import { navigate } from "../enrutador.js";

export function renderWordless(container) {  
  // Envolvemos todo en .wordless-wrapper
  container.innerHTML = `
    <div class="wordless-wrapper">
        <div id="menu-screen" class="screen active">
        
            <h1>Mathless</h1>
            <div class="instructions">
                <p><b>Reglas:</b> Resuelve el desafío matemático. Escribe la respuesta usando exactamente el número de casillas blancas.</p>
                <p>🟩 Correcto | 🟨 Lugar equivocado | ⬜ No existe</p>
            </div>
            <button id="btn-lvl-1" class="btn-lvl">Nivel 1: Álgebra Inversa (ax+b=c)</button>
            <button id="btn-lvl-2" class="btn-lvl">Nivel 2: Factorización (TCP y Productos)</button>
            <button id="btn-lvl-3" class="btn-lvl">Nivel 3: Logaritmos & Exp</button>
            <button id="exitGameW">Salir</button>
            </div>

        <div id="game-screen" class="screen">
            <h2 id="level-title-w">Nivel</h2>
            <h3 id="question-text-w" style="font-size: 1.5rem; color: #aaa;"></h3>
            
            <div id="board_w"></div> 
            
            <div id="active-controls-w" class="controls">
                <input type="text" id="user-input-w" autocomplete="off" placeholder="Tu respuesta...">
                <button id="btn-send-w" class="btn-lvl" style="background: var(--correct_w); margin-top:10px;">Enviar</button>
            </div>

            <div id="final-controls-w" class="controls hidden">
                <div id="solution-box-w">
                    <p id="status-msg-w"></p>
                    <p>Respuesta: <b id="reveal-ans-w" style="font-size: 1.3rem;"></b></p>
                </div>
                <button id="btn-restart-w" class="btn-lvl" style="background: var(--correct_w);">Nuevo Desafío</button>
                <button id="btn-menu-w" class="btn-lvl">Menú Principal</button>
            </div>
        </div>
    </div>
  `;

    // Botones del Menú
    document.getElementById('btn-lvl-1').addEventListener('click', () => startGameW(1));
    document.getElementById('btn-lvl-2').addEventListener('click', () => startGameW(2));
    document.getElementById('btn-lvl-3').addEventListener('click', () => startGameW(3));

    // Botones del Juego
    document.getElementById('btn-send-w').addEventListener('click', checkGuessW);
    document.getElementById('btn-restart-w').addEventListener('click', restartLevelW);
    document.getElementById('btn-menu-w').addEventListener('click', () => showScreenW('menu-screen'));

    // Tecla Enter en el input
    document.getElementById('user-input-w').addEventListener('keypress', (eW) => {
        if (eW.key === 'Enter') checkGuessW();
    });

    document.getElementById("exitGameW").
    addEventListener("click", () => {
      cancelGame();
      navigate("home");
    }); 
}

// Banco de datos estático para el Nivel 3 (Logaritmos y Exponenciales)
const nivelesW = {
    3: [
        // Estilo (Base^x)(Base)=Resultado 
        { q: "(10^x)(10) = 1000", a: "x=2" },
        { q: "(2^x)(4) = 32", a: "x=3" },
        { q: "(e^x)(e) = e^5", a: "x=4" },
        { q: "(3^x)/3 = 9", a: "x=3" },
        { q: "(5^x)(5) = 25", a: "x=1" },
        { q: "(2^x)(2) = 16", a: "x=3" },
        { q: "(4^x)/4 = 16", a: "x=3" },
        { q: "(10^x)/100 = 10", a: "x=3" },
        { q: "(e^x)/(e^2) = e", a: "x=3" },
        { q: "(3^x)(9) = 81", a: "x=2" },

        // Logaritmos y Exponenciales
        { q: "ln(e^2)", a: "2" }, { q: "e^0", a: "1" },
        { q: "2^3", a: "8" }, { q: "ln(1)", a: "0" },
        { q: "e^x = e", a: "x=1" }, { q: "5^2", a: "25" },
        { q: "ln(e^5)", a: "5" }, { q: "e^ln(3)", a: "3" },
        { q: "10^x = 100", a: "x=2" }, { q: "4^1/2", a: "2" },
        { q: "x^2 = 25", a: "x=5" }, { q: "e^ln(x) = 4", a: "x=4" },
        { q: "2^4", a: "16" }, { q: "ln(e^9)", a: "9" },
        { q: "3^2", a: "9" }, { q: "e^ln(9)", a: "9" },
        { q: "ln(e)", a: "1" }, { q: "10^2", a: "100" },
        { q: "sqrt(16)", a: "4" }, { q: "x^2 = 9", a: "x=3" },
        { q: "2^x = 4", a: "x=2" }, { q: "x^3 = 8", a: "x=2" },
        { q: "ln(e^x) = 7", a: "x=7" }, { q: "e^x = 1", a: "x=0" },
        { q: "3^x = 27", a: "x=3" },

        //  (Logaritmos, Raíces y Bases)
        { q: "ln(e^10)", a: "10" },
        { q: "e^ln(x) = 5", a: "x=5" },
        { q: "sqrt(81)", a: "9" },
        { q: "x^2 = 49", a: "x=7" },
        { q: "ln(e^0)", a: "0" },
        { q: "10^x = 0.1", a: "x=-1" },
        { q: "2^5", a: "32" },
        { q: "sqrt(100)", a: "10" },
        { q: "ln(e^-1)", a: "-1" },
        { q: "e^x = e^2", a: "x=2" },
        { q: "x^3 = 27", a: "x=3" },
        { q: "4^2", a: "16" },
        { q: "10^x = 1", a: "x=0" },
        { q: "(1)^n", a: "1" },
        { q: "ln(e^x) = 12", a: "x=12" },
        { q: "e^ln(2)", a: "2" },
        { q: "2^x = 1/2", a: "x=-1" },
        { q: "x^2 = 144", a: "x=12" },
        { q: "ln(e^1/2)", a: "1/2" },
        { q: "5^x = 125", a: "x=3" },
        { q: "e^x = 1/e", a: "x=-1" },
        { q: "10^3", a: "1000" },
        { q: "sqrt(4)", a: "2" },
        { q: "x^4 = 16", a: "x=2" },
        { q: "ln(e^8)", a: "8" }
    ]
};


// Variables de estado del juego
let currentLevelW = 1;
let currentExerciseW = null; // Almacena el objeto {q: pregunta, a: respuesta} actual
let attemptsW = 0;           // Contador de intentos realizados
const maxAttemptsW = 3;      // Límite de intentos permitidos


// Cambia la visibilidad entre las pantallas del juego (menú vs juego)
function showScreenW(idW) {
    document.querySelectorAll('.screen').forEach(sW => sW.classList.remove('active'));
    document.getElementById(idW).classList.add('active');
}

//Genera un ejercicio de Álgebra de primer grado: ax + b = c
function generarNivel1W() {
    const aW = (Math.floor(Math.random() * 9) + 2) * (Math.random() > 0.5 ? 1 : -1);
    const xW = Math.floor(Math.random() * 41) - 20;
    const bW = Math.floor(Math.random() * 101) - 50;
    const cW = (aW * xW) + bW;
    let bSignoW = bW >= 0 ? "+ " : "- ";
    let preguntaW = `${aW}x ${bSignoW}${Math.abs(bW)} = ${cW}`;
    return { q: preguntaW, a: `x=${xW}`.toLowerCase() };
}

//Genera un ejercicio de Factorización (TCP o Productos de binomios)
function generarNivel2W() {
    let aW = 0, bW = 0;
    while (aW === 0) aW = Math.floor(Math.random() * 19) - 9; // Evitar ceros
    while (bW === 0) bW = Math.floor(Math.random() * 19) - 9;

    if (Math.random() > 0.5) {
        // CASO 1: Trinomio Cuadrado Perfecto (x + a)^2
        const linealW = 2 * aW;
        const indepW = aW * aW;
        const qW = `x² ${linealW >= 0 ? '+' : '-'}${Math.abs(linealW)}x + ${indepW}`;
        return { q: qW, a: `(x${aW > 0 ? '+' : '-'}${Math.abs(aW)})^2`.toLowerCase() };
    } else {
        // CASO 2: Producto de binomios (x + a)(x + b)
        const sumaW = aW + bW;
        const prodW = aW * bW;
        let medW = sumaW === 0 ? "" : (sumaW === 1 ? "+x" : (sumaW === -1 ? "-x" : `${sumaW > 0 ? '+' : '-'}${Math.abs(sumaW)}x`));
        const qW = `x² ${medW} ${prodW >= 0 ? '+' : '-'}${Math.abs(prodW)}`.replace(/\s+/g, ' ');
        const resW = `(x${aW > 0 ? '+' : '-'}${Math.abs(aW)})(x${bW > 0 ? '+' : '-'}${Math.abs(bW)})`;
        const altW = `(x${bW > 0 ? '+' : '-'}${Math.abs(bW)})(x${aW > 0 ? '+' : '-'}${Math.abs(aW)})`; // Respuesta alterna (orden de factores)
        return { q: qW, a: resW.toLowerCase(), alt: altW.toLowerCase() };
    }
}

//Inicializa un nivel específico
function startGameW(levelW) {
    currentLevelW = levelW;
    restartLevelW();
}

//Prepara el estado para un nuevo ejercicio dentro del mismo nivel
function restartLevelW() {
    attemptsW = 0;
    document.getElementById('active-controls-w').classList.remove('hidden');
    document.getElementById('final-controls-w').classList.add('hidden');
    document.getElementById('user-input-w').value = '';
    
    // Selección de generador según nivel
    if (currentLevelW === 1) currentExerciseW = generarNivel1W();
    else if (currentLevelW === 2) currentExerciseW = generarNivel2W();
    else currentExerciseW = nivelesW[3][Math.floor(Math.random() * nivelesW[3].length)];
    
    document.getElementById('level-title-w').innerText = `Nivel ${currentLevelW}`;
    document.getElementById('question-text-w').innerText = currentExerciseW.q;
    
    setupBoardW(); // cuenta cuántos caracteres tiene la respuesta (por ejemplo, (x+3)^2) tiene 7
    showScreenW('game-screen');
}

//Crea las celdas vacías en el HTML según la longitud de la respuesta esperada
function setupBoardW() {
    const boardW = document.getElementById('board_w');
    const colsW = currentExerciseW.a.length;
    boardW.style.gridTemplateColumns = `repeat(${colsW}, 40px)`; // Ajuste dinámico de columnas
    boardW.innerHTML = '';
    
    // Crea celdas (intentos máximos x número de caracteres)
    for (let iW = 0; iW < maxAttemptsW * colsW; iW++) {
        const cellW = document.createElement('div');
        cellW.classList.add('cell');
        cellW.id = `cell-${iW}`;
        boardW.appendChild(cellW);
    }
}

//Lógica principal de comparación (Algoritmo estilo Wordle)
function checkGuessW() {
    const inputW = document.getElementById('user-input-w');
    const guessW = inputW.value.replace(/\s+/g, '').toLowerCase(); // Limpieza de espacios
    const solutionW = currentExerciseW.a.toLowerCase();
    
    // Validación de longitud
    if (guessW.length !== solutionW.length) {
        alert(`La respuesta requiere exactamente ${solutionW.length} caracteres.`);
        return;
    }

    let solMapW = solutionW.split('');
    let resultsW = new Array(guessW.length).fill('absent');// Por defecto: no existe

    // Primera pasada: Detectar caracteres correctos en posición correcta (Verde)
    for (let iW = 0; iW < guessW.length; iW++) {
        if (guessW[iW] === solutionW[iW]) {
            resultsW[iW] = 'correct';
            solMapW[iW] = null;
        }
    }

    // Segunda pasada: Detectar caracteres existentes en posición incorrecta (Amarillo) 
    for (let iW = 0; iW < guessW.length; iW++) {
        if (resultsW[iW] !== 'correct' && solMapW.includes(guessW[iW])) {
            resultsW[iW] = 'present';
            solMapW[solMapW.indexOf(guessW[iW])] = null;
        }
    }

    // Actualización visual de las celdas en la fila actual
    for (let iW = 0; iW < guessW.length; iW++) {
        const cellW = document.getElementById(`cell-${(attemptsW * solutionW.length) + iW}`);
        cellW.innerText = guessW[iW];
        cellW.classList.add(resultsW[iW]);
        cellW.style.transform = "scale(1.1)";
        setTimeout(() => cellW.style.transform = "scale(1)", 100);
    }

    attemptsW++;
    inputW.value = '';

    // Verificación de victoria (soporta respuesta alternativa para el Nivel 2)
    const wonW = (guessW === solutionW || (currentExerciseW.alt && guessW === currentExerciseW.alt));
    if (wonW) {
        endGameW(true);
    } else if (attemptsW >= maxAttemptsW) {
        endGameW(false);
    }
}

//Finaliza la partida y muestra resultados
function endGameW(wonW) {
    document.getElementById('active-controls-w').classList.add('hidden');
    document.getElementById('final-controls-w').classList.remove('hidden');
    const msgW = document.getElementById('status-msg-w');
    msgW.innerText = wonW ? "¡Logrado! Excelente razonamiento." : "No te rindas, el álgebra requiere práctica.";
    msgW.style.color = wonW ? "var(--correct_w)" : "#ff4b4b";
    document.getElementById('reveal-ans-w').innerText = currentExerciseW.a;
}

// --- GESTIÓN DE EVENTOS (Sustituye a onclick) ---

// document.addEventListener('DOMContentLoaded', () => {
//     // Botones del Menú
//     document.getElementById('btn-lvl-1').addEventListener('click', () => startGameW(1));
//     document.getElementById('btn-lvl-2').addEventListener('click', () => startGameW(2));
//     document.getElementById('btn-lvl-3').addEventListener('click', () => startGameW(3));

//     // Botones del Juego
//     document.getElementById('btn-send-w').addEventListener('click', checkGuessW);
//     document.getElementById('btn-restart-w').addEventListener('click', restartLevelW);
//     document.getElementById('btn-menu-w').addEventListener('click', () => showScreenW('menu-screen'));

//     // Tecla Enter en el input
//     document.getElementById('user-input-w').addEventListener('keypress', (eW) => {
//         if (eW.key === 'Enter') checkGuessW();
//     });
// });
