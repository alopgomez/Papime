import { initGame, finishGame, cancelGame } from "./engine.js";
import { navigate } from "../enrutador.js";

/** 
 * VARIABLES DE ESTADO GLOBALES AL MÓDULO
 * Se mantienen fuera para ser accesibles por todas las funciones, 
 * pero se reinician dentro de renderPokemat.
 */
let playerHPp, cpuHPp, donep, currentLevelp;
let timerp, timeTotalp = 35;
let datap = {}; 

/** 
 * FUNCIÓN AUXILIAR DE ACCESO AL DOM
 */
const getp = id => document.getElementById(id);

/** 
 * RENDERIZADO PRINCIPAL
 * @param {HTMLElement} container - El contenedor donde se inyectará el juego.
 */
export function renderPokemat(container) {  
    // TODO: Inyectar estructura base. Se mantiene el body intacto para no romper el servidor.
    container.innerHTML = `
    <div id="game-containerp">
        <div class="screen-headerp">
            <div>CPU <span id="cpu-hpp" class="heartsp">❤❤❤</span></div>
            <div id="level-indicatorp">MENU</div>
            <div>TÚ <span id="player-hpp" class="heartsp">❤❤❤</span></div>
        </div>
        
        <div id="battle-areap">
            <div id="content-boxp">
                <strong>BIENVENIDO, PROFESOR</strong><br>Seleccione el desafío:<br><br>
                <button id="btn-lvl1p">NIVEL 1: ARITMÉTICA</button>
                <button id="btn-lvl2p">NIVEL 2: OP. ELEMENTALES</button>
            </div>

            <div id="game-playp" style="display:none">
                <div id="challenge-nump">DESAFÍO: 1/3</div>
                <div class="matrix-displayp">
                    <span id="scalar-valp"></span>
                    <div id="m1p" class="matrixp"></div>
                    <span id="op-symbolp">+</span>
                    <div id="m2p" class="matrixp"></div>
                    <span id="eq-symbolp" style="font-size:1.5rem">=</span>
                    <div id="m-ansp" class="matrixp"></div>
                </div>
                <div class="timer-containerp"><div id="timer-barp"></div></div>
                <div id="input-zonep">
                    <button id="attack-btnp">¡ATACAR!</button>
                </div>
                <div id="options-zonep" class="options-gridp" style="display:none"></div>
                <button id="next-btnp" style="display:none; margin-top:15px; width:100%">SIGUIENTE</button>
            </div>
        </div>

        <div id="ui-areap">
            <div id="dialogp">Esperando órdenes...</div>
        </div>

        <button id='exitBtnPoke'>Salir</button>
    </div>
    `;

    // TODO: Reiniciar estado del juego para evitar "heredar" partidas previas al navegar.
    playerHPp = 3; 
    cpuHPp = 3; 
    donep = 0;
    if (timerp) clearInterval(timerp); // Limpiar cualquier proceso previo.

    // TODO: Sincronización con el DOM. Usamos setTimeout para asegurar que el navegador ya renderizó el HTML.
    setTimeout(() => {
        const btn1 = getp('btn-lvl1p');
        if (btn1) {
            btn1.addEventListener('click', () => startLevelp(1));
            getp('btn-lvl2p').addEventListener('click', () => startLevelp(2));
            getp('attack-btnp').addEventListener('click', checkLevel1p);
            getp('next-btnp').addEventListener('click', nextChallengep);
        }
    }, 0);

    document.getElementById('exitBtnPoke').addEventListener('click', () => {
        navigate('home');
    });
}

/** 
 * LÓGICA DE INICIO
 */
function startLevelp(lvl) {
    // TODO: Notificar al engine que el juego ha comenzado.
    initGame(); 
    currentLevelp = lvl;
    getp('level-indicatorp').innerText = `NIVEL ${lvl}`;
    getp('content-boxp').style.display = 'none';
    getp('game-playp').style.display = 'block';
    updateHeartsp();
    nextChallengep();
}

/** 
 * GESTIÓN DE RONDAS
 */
function nextChallengep() {
    if (playerHPp <= 0 || cpuHPp <= 0 || donep >= 3) return endLevelp();
    
    donep++;
    getp('challenge-nump').innerText = `DESAFÍO: ${donep}/3`;
    getp('next-btnp').style.display = 'none';
    getp('dialogp').innerText = "¡Calcula rápido!";
    
    if(currentLevelp === 1) setupLevel1p();
    else setupLevel2p();

    startTimerp();
}

/** 
 * CONFIGURACIÓN DE NIVEL 1 (Aritmética básica de matrices)
 */
function setupLevel1p() {
    const sizes = ['2x2', '3x1', '1x3'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const isScalarp = Math.random() > 0.5;
    const count = (size === '2x2') ? 4 : 3;

    datap = { type: isScalarp ? 'scalar' : 'sum', size, count, m1: genArrp(count, 10, -10) };
    
    getp('input-zonep').style.display = 'block';
    getp('options-zonep').style.display = 'none';
    getp('eq-symbolp').style.display = 'inline';
    getp('m-ansp').style.display = 'grid';

    if(isScalarp) {
        datap.scalar = Math.floor(Math.random() * 4) + 2;
        getp('scalar-valp').innerText = datap.scalar + " ·";
        getp('op-symbolp').style.display = 'none';
        getp('m2p').style.display = 'none';
    } else {
        datap.m2 = genArrp(count, 10, -10);
        getp('scalar-valp').innerText = '';
        getp('op-symbolp').style.display = 'inline';
        getp('m2p').style.display = 'grid';
        renderMatrixp(getp('m2p'), datap.m2, size);
    }

    renderMatrixp(getp('m1p'), datap.m1, size);
    
    getp('m-ansp').className = `matrixp m${size}`;
    getp('m-ansp').innerHTML = Array.from({length: count}, (_, i) => 
        `<input type="text" class="matrix-inputp" id="ans${i}p">`).join('');
}

/** 
 * CONFIGURACIÓN DE NIVEL 2 (Operaciones elementales de fila)
 */
function setupLevel2p() {
    const size = Math.random() > 0.5 ? 2 : 3;
    const totalElems = size * size;
    
    let matrixA = genArrp(totalElems, 5, -5);
    const correctOp = createRandomOpp(size);
    const matrixB = applyElementaryOp(matrixA, correctOp, size);

    datap = { correctText: correctOp.text, matrixA, matrixB };

    getp('input-zonep').style.display = 'none';
    getp('options-zonep').style.display = 'grid';
    getp('op-symbolp').innerText = '--➔';
    getp('m2p').style.display = 'grid';
    getp('m-ansp').style.display = 'none';

    renderMatrixp(getp('m1p'), matrixA, size === 2 ? '2x2' : '3x3');
    renderMatrixp(getp('m2p'), matrixB, size === 2 ? '2x2' : '3x3');

    let options = [correctOp];
    while(options.length < 4) {
        let cand = createRandomOpp(size);
        if(!options.find(o => o.text === cand.text)) options.push(cand);
    }
    shuffleArrayp(options);

    getp('options-zonep').innerHTML = '';
    options.forEach(opt => {
        let btn = document.createElement('button');
        btn.innerText = opt.text;
        // TODO: Evitar onclicks inline usando addEventListener dinámico.
        btn.addEventListener('click', () => checkLevel2p(opt.text === datap.correctText, btn));
        getp('options-zonep').appendChild(btn);
    });
}

/** 
 * FUNCIONES AUXILIARES MATEMÁTICAS
 */
function genArrp(n, max, min) { 
    return Array.from({length: n}, () => Math.floor(Math.random() * (max - min + 1)) + min); 
}

function renderMatrixp(el, arr, sizeStr) {
    el.className = `matrixp m${sizeStr}`;
    el.innerHTML = arr.map(n => `<div class="matrix-itemp">${n}</div>`).join('');
}

function createRandomOpp(size) {
    const types = ['swap', 'scale', 'add'];
    const type = types[Math.floor(Math.random() * types.length)];
    const r1 = Math.floor(Math.random() * size) + 1;
    let r2 = Math.floor(Math.random() * size) + 1;
    while(r1 === r2) r2 = Math.floor(Math.random() * size) + 1;
    let k = Math.floor(Math.random() * 5) + 2; 

    if(type === 'swap') return { type, r1, r2, text: `R${r1} ↔ R${r2}` };
    if(type === 'scale') return { type, r1, k, text: `${k}R${r1}` };
    return { type, r1, r2, k, text: `R${r1} + (${k}R${r2})` };
}

function applyElementaryOp(m, op, size) {
    let res = [...m];
    let idx = (r, c) => (r-1) * size + (c-1);
    if(op.type === 'swap') {
        for(let c=1; c<=size; c++) {
            let tmp = res[idx(op.r1, c)];
            res[idx(op.r1, c)] = res[idx(op.r2, c)];
            res[idx(op.r2, c)] = tmp;
        }
    } else if(op.type === 'scale') {
        for(let c=1; c<=size; c++) res[idx(op.r1, c)] *= op.k;
    } else {
        for(let c=1; c<=size; c++) res[idx(op.r1, c)] += op.k * res[idx(op.r2, c)];
    }
    return res;
}

/** 
 * VALIDACIÓN DE RESPUESTAS
 */
function checkLevel1p() {
    let correct = true;
    for (let i = 0; i < datap.count; i++) {
        const inputEl = getp(`ans${i}p`);
        const val = parseInt(inputEl.value);
        const target = datap.type === 'sum' ? datap.m1[i] + datap.m2[i] : datap.m1[i] * datap.scalar;
        
        if (val !== target) {
            correct = false;
            inputEl.value = target;
            inputEl.classList.add('wrong-ansp');
        }
        inputEl.disabled = true;
    }
    resolveChallengp(correct, correct ? "¡ATAQUE CORRECTO!" : "¡FALLO EN EL CÁLCULO!");
}

function checkLevel2p(isCorrect, btn) {
    const allBtns = getp('options-zonep').querySelectorAll('button');
    allBtns.forEach(b => {
        b.disabled = true;
        if(b.innerText === datap.correctText) b.classList.add('btn-correctp');
    });
    if(!isCorrect && btn) btn.classList.add('btn-wrongp');
    resolveChallengp(isCorrect, isCorrect ? "¡OPERACIÓN IDENTIFICADA!" : `ERROR. ERA: ${datap.correctText}`);
}

function resolveChallengp(win, msg) {
    clearInterval(timerp); // TODO: Detener el cronómetro inmediatamente al responder.
    getp('dialogp').innerText = msg;
    win ? cpuHPp-- : playerHPp--;
    updateHeartsp();
    getp('input-zonep').style.display = 'none';
    getp('next-btnp').style.display = 'block';
    getp('next-btnp').innerText = (playerHPp <= 0 || cpuHPp <= 0 || donep >= 3) ? "RESULTADO FINAL" : "SIGUIENTE";
}

/** 
 * TEMPORIZADOR Y UI
 */
function startTimerp() {
    let t = timeTotalp;
    clearInterval(timerp);
    timerp = setInterval(() => {
        t -= 0.1;
        const bar = getp('timer-barp');
        if (bar) bar.style.width = (t/timeTotalp*100) + "%";
        if(t <= 0) {
            clearInterval(timerp);
            if(currentLevelp === 1) checkLevel1p();
            else checkLevel2p(false, null);
        }
    }, 100);
}

function updateHeartsp() {
    getp('cpu-hpp').innerText = "❤".repeat(Math.max(0, cpuHPp));
    getp('player-hpp').innerText = "❤".repeat(Math.max(0, playerHPp));
}

/** 
 * FINALIZACIÓN DEL JUEGO
 */
function endLevelp() {
    const win = cpuHPp < playerHPp;
    // TODO: Notificar al engine los resultados finales.
    finishGame({ victory: win, score: donep });

    getp('game-playp').style.display = 'none';
    getp('content-boxp').style.display = 'block';
    getp('content-boxp').innerHTML = `
        <h2>${win ? "¡VICTORIA!" : "DERROTA"}</h2>
        <button id="btn-restartp">VOLVER AL MENÚ</button>
    `;
    
    // TODO: Usar el enrutador para volver sin recargar la página completa.
    getp('btn-restartp').addEventListener('click', () => {
        cancelGame(); // Limpieza del engine.
        renderPokemat(document.getElementById("app"));
    });
}

function shuffleArrayp(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}