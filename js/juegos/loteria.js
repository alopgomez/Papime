import { initGame, finishGame, cancelGame } from "./engine.js";
import { navigate } from "../enrutador.js";



export function renderLoteria(container) {  
  // 1. Aseguramos que el contenedor sea el ancla para el menú (crucial para el CSS absolute)
  container.style.position = 'relative';
  container.style.minHeight = '650px'; // Puedes ajustar este alto según el tamaño de tu tablero
  container.style.overflow = 'hidden';

  // 2. Inyectamos el HTML estructurado
  container.innerHTML = `
    <!-- PANTALLA DE INICIO (MENÚ) -->
    <div id="start-screenL">
        <div class="menu-box">
            <h1>Lotería Matemática</h1>
            <div class="instruccionesL">
                <ul style="list-style-type: none; padding-left: 0; text-align: left;">
                    <li>✅ <b>?Caza la carta:</b> Identifica el símbolo matemático que corresponde a la definición.</li>
                    <li>⏳ <b>¡Rápido!:</b> Tienes pocos segundos antes de que la carta cambie.</li>
                    <li>🎯 <b>Decisión única:</b> Solo puedes elegir un símbolo por carta cantada.</li>
                    <li>🃏 <b>Cuidado:</b> ¡No selecciones la carta de trampa!</li>
                </ul>
            </div>

            <p>1. Elige Dificultad</p>
            <div class="button-group">
                <button class="btn diff-btn" id="diff-easy" data-time="7000">Fácil (7s)</button>
                <button class="btn diff-btn active" id="diff-medium" data-time="5000">Medio (5s)</button>
                <button class="btn diff-btn" id="diff-hard" data-time="3000">Difícil (3s)</button>
            </div>

            <p style="margin-top:20px;">2. Elige el Nivel para Empezar</p>
            <button class="btn level-btn" data-level="1">Lógica</button>
            <button class="btn level-btn" data-level="2">Conjuntos</button>
            <button class="btn level-btn" data-level="3">Cálculo</button>
            <button class="btn level-btn" data-level="5">Geometría</button>
            <button class="btn level-btn" data-level="6">Cónicas</button>
        </div>

        <button id="exitGameL" class="btn" style="margin-top: 20px; background: var(--error); color: white;">Salir</button>
    </div>

    <!-- PANTALLA DE JUEGO (Oculta por defecto) -->
    <div id="game-uiL">

        <div id="display-card">
            <div id="card-text">¡Prepárate!</div>
            <div id="timer-bar"><div id="timer-fill"></div></div>
        </div>

        <div id="game-board"></div>
        <div id="score"></div>

        <button id="reset-game" class="btn" style="margin-bottom: 15px;">✖ Regresar al Menú</button>
    </div>
  `;

    // 3. Lógica de selección de dificultad
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            gameTime = parseInt(this.dataset.time);
        });
    });

    // 4. Lógica para empezar a jugar
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('start-screenL').style.display = 'none'; // Ocultar menú
            document.getElementById('game-uiL').style.display = 'flex';      // Mostrar interfaz del juego
            startGame(this.dataset.level);
        });
    });

    // 5. Lógica para resetear/regresar al menú
    document.getElementById('reset-game').addEventListener('click', () => {
        clearTimeout(gameTimeout); // Detener el ciclo del juego
        document.getElementById('game-uiL').style.display = 'none';      // Ocultar juego
        document.getElementById('start-screenL').style.display = 'flex'; // Volver a mostrar menú
    });

    // 6. Lógica para salir del juego por completo
    document.getElementById("exitGameL").addEventListener("click", () => {
        cancelGame();
        navigate("home");
    });
}



const levels = {

    1: [
        {s:'\\forall', t:'Para todo'}, {s:'\\exists', t:'Existe'},
        {s:'\\exists !', t:'Existe único'}, {s:'\\nexists', t:'No existe'},
        {s:'>', t:'Mayor que'}, {s:'<', t:'Menor que'},
        {s:'\\in', t:'Pertenece'}, {s:'\\implies', t:'Entonces'},
        {s:'\\neq ', t:'Diferente'}, {s:'\\Longleftrightarrow ', t:'si y solo si'}
    ],

    2: [
        {s:'x \\in A \\cup B', t:'Unión de conjuntos'}, {s:'x \\in A \\cap B', t:'Intersección'},
        {s:'A \\subseteq B', t:'Subconjunto'}, {s:'\\emptyset', t:'Conjunto vacío'},
        {s:'x \\in \\mathbb{Z}', t:'Número Entero'}, {s:'x \\in \\mathbb{R}^+', t:'Real Positivo'},
        {s:'n \\in \\mathbb{N}', t:'Número Natural'}, {s:'\\mathbb{R} \\setminus \\mathbb{Q}', t:'Irracionales'}
    ],

    3: [
        {s:'x \\to a^+', t:'Tiende por la derecha'},
        {s:'x \\to -\\infty', t:'Tiende a menos infinito'},
        {s:'f \\circ g', t:'Composición'},
        {s:'f^{-1}', t:'Inversa'},
        {s:'|f(x)| \\leq M', t:'Función acotada'},
        //{s:'D_f', t:'Dominio'},
        //{s:'C_f', t:'Codominio'},
        {s:'x \\neq a', t:'Punto excluido'},
        {s:'[a, b]', t:'Intervalo cerrado'},
        {s:'(a, b)', t:'Intervalo abierto'},
        {s:'x^2 \\geq 0', t:'Siempre es no negativo'},
        {s:'a < x < b', t:'x entre a y b'},
        {s:'x \\in (-\\infty, a)', t:'x menor que a'},
        {s:'|x| < a', t:'x entre a y -a'}

   

    ],

    5: [ // Geometría y Vectores

        {s:'\\pi', t:'180°'}, {s:'\\frac{\\pi}{2}', t:'90°'},
        {s:'\\frac{3\\pi}{4}', t:'135°'}, {s:'2\\pi', t:'360°'},
        {s:'\\vec{u} \\cdot \\vec{v}', t:'Producto punto'},
        {s:'\\vec{u} \\cdot \\vec{v} = 0', t:'Ortogonales'},
        {s:'\\|\\vec{v}\\|', t:'Norma / Magnitud'},
        {s:'\\vec{u} = k\\vec{v}', t:'Vectores paralelos'},
        //{s:'\\theta = \\cos^{-1}(\dots)', t:'Ángulo entre vectores'},
        {s:'\\vec{0}', t:'Vector Nulo'},
        {s:'\\frac{\\vec{v}}{\\|\\vec{v}\\|}', t:'Vector Unitario'}

    ],

    6: [ // Cónicas
        {s:'x^2 + y^2 = r^2', t:'Circunferencia'},
        {s:'\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1', t:'Elipse'},
        {s:'\\frac{x^2}{a^2} - \\frac{y^2}{b^2} = 1', t:'Hipérbola'},
        {s:'y = ax^2 + bx + c', t:'Parábola'},
        {s:'Ax + By + C = 0', t:'Recta (General)'},
        {s:'y - y_0 = m(x - x_0)', t:'Recta (Punto-Pendiente)'}

    ]

};



let currentBoard = [], cardsToSing = [], choices = [], currentCardIndex = -1;
let gameTimeout, canSelectInThisTurn = false, gameTime = 5000;


function startGame(lvl) {
    clearTimeout(gameTimeout);

    const boardEl = document.getElementById('game-board');
    boardEl.innerHTML = '';
    document.getElementById('score').innerText = '';
    choices = [];
    currentCardIndex = -1;



    let pool = [...levels[lvl]].sort(() => Math.random() - 0.5);
    currentBoard = pool.slice(0, 6);
    let trampa = pool.length > 6 ? pool[6] : {t: "Unicidad", s: "???"};
    cardsToSing = [...currentBoard, trampa].sort(() => Math.random() - 0.5);



    currentBoard.sort(() => Math.random() - 0.5).forEach(item => {
        const div = document.createElement('div');
        div.className = 'slot';
        div.dataset.symbol = item.s;

        div.addEventListener('click', function() { selectSlot(this); });

        katex.render(item.s, div);

        boardEl.appendChild(div);

    });

    nextCard();

}



function selectSlot(el) {

    if (!canSelectInThisTurn || el.classList.contains('locked')) return;

    el.classList.add('locked');

    canSelectInThisTurn = false;

    choices.push({ targetSymbol: cardsToSing[currentCardIndex].s, selectedSymbol: el.dataset.symbol });

}



function nextCard() {

    currentCardIndex++;

    if (currentCardIndex >= cardsToSing.length) { endGame(); return; }

    canSelectInThisTurn = true;
    const cardText = document.getElementById('card-text');
    const fill = document.getElementById('timer-fill');
    cardText.innerText = cardsToSing[currentCardIndex].t;
    fill.style.transition = 'none';
    fill.style.width = '100%';

    setTimeout(() => {
        fill.style.transition = `width ${gameTime}ms linear`;
        fill.style.width = '0%';
    }, 50);
    gameTimeout = setTimeout(nextCard, gameTime);

}



function endGame() {

    canSelectInThisTurn = false;

    document.getElementById('card-text').innerText = "¡Fin de Partida!";

    let aciertos = 0;

    document.querySelectorAll('.slot').forEach(slot => {
        const choice = choices.find(c => c.selectedSymbol === slot.dataset.symbol);
        const wasCalled = cardsToSing.some(c => c.s === slot.dataset.symbol && currentBoard.some(b => b.s === c.s));
        if (choice) {

            if (choice.selectedSymbol === choice.targetSymbol) { slot.className = 'slot correct'; aciertos++; }

            else slot.className = 'slot wrong';

        } else if (wasCalled) slot.classList.add('missed');

    });

    document.getElementById('score').innerText = `Puntaje: ${aciertos} de 6`;

}