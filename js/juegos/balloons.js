import { initGame, finishGame, cancelGame } from "./engine.js";
import { navigate } from "../enrutador.js";


export function renderBalloons(container) {
    container.innerHTML = `
        <div id="start-screen">
            <h1>VECTLE: DESAFÍO DE NORMAS</h1>
            <div class="instrucciones">
            <p>🔵 <b>Vectores:</b> Caza 2 correctos para avanzar.<br>
            🟢 <b>Verde:</b> +5 segundos o -5 segundos.<br>
            🟣 <b>Morada:</b> Cambia el número objetivo.</p>
            <p><small>¡Cuidado! Un error te quita 3 segundos.</small></p>
                <p id="desc-inst">Selecciona tu nivel de dificultad:</p>
                <p> <b>Nivel 1:</b> Objetivo es (x² + y²).<br>
                    <b>Nivel 2:</b> Objetivo es la Norma .</p>
            </div>
            <div class="btn-group">
                <button id="btn-lvl1" class="game-button">NIVEL 1</button>
                <button id="btn-lvl2" class="game-button">NIVEL 2</button>
            </div>
        </div>

        <div id="end-screen" style="display: none; opacity: 0;">
            <h1>MISIÓN TERMINADA</h1>
            <h2 id="final-score">Puntuación: 0</h2>
            <div class="btn-group">
                <button onclick="location.reload()" class="game-button" style="background: #34495e;">MENÚ PRINCIPAL</button>
                <button id="btn-retry" class="game-button" style="background: #27ae60;">REINTENTAR</button>
            </div>
        </div>

        <div id="ui">
            <div id="mode-label">Objetivo:</div>
            <div id="target-display">--</div>
        </div>

        <div id="balls"></div>

        <div id="stats-bar">
            <div>Tiempo: <span id="timer">45</span>s</div>
            <div>Aciertos: <span id="hits">0</span>/2</div>
            <div>Total: <span id="total">0</span></div>
        </div>
    `; 

    const startScreen = document.getElementById('start-screen');
    const endScreen = document.getElementById('end-screen');
    const timerEl = document.getElementById('timer');

    // Botones de Inicio
    document.getElementById('btn-lvl1').onclick = () => startLevel(1);
    document.getElementById('btn-lvl2').onclick = () => startLevel(2);
    document.getElementById('btn-retry').onclick = () => {
        document.getElementById('end-screen').style.display = 'none';
        timeLeft = 45;
        totalScore = 0;
        document.getElementById('total').innerText = "0";
        startLevel(gameMode);
    };


}


let timeLeft = 45;
let hitsInLevel = 0;
let totalScore = 0;
let targetSq = 0;
let gameActive = false;
let gameMode = 1; // 1: Cuadrados, 2: Normas

// const startScreen = document.getElementById('start-screen');
// const endScreen = document.getElementById('end-screen');
// const timerEl = document.getElementById('timer');

// // Botones de Inicio
// document.getElementById('btn-lvl1').onclick = () => startLevel(1);
// document.getElementById('btn-lvl2').onclick = () => startLevel(2);
// document.getElementById('btn-retry').onclick = () => {
//     endScreen.style.display = 'none';
//     timeLeft = 45;
//     totalScore = 0;
//     document.getElementById('total').innerText = "0";
//     startLevel(gameMode);
// };

function startLevel(mode) {
    gameMode = mode;
    document.getElementById('mode-label').innerText = mode === 1 ? "Objetivo (x² + y²):" : "Objetivo √(x² + y²):";
    document.getElementById('start-screen').style.opacity = '0';
    setTimeout(() => {
        document.getElementById('start-screen').style.display = 'none';
        gameActive = true;
        nextTarget();
        runGame();
    }, 500);
}

function runGame() {
    const countdown = setInterval(() => {
        if (!gameActive) { clearInterval(countdown); return; }
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
            gameActive = false;
            showResults();
        }
    }, 1000);

    const generator = setInterval(() => {
        if (gameActive) createGota();
        else clearInterval(generator);
    }, 1800);
}

function showResults() {
    document.getElementById('final-score').innerText = "Puntuación Final: " + totalScore;
    document.getElementById('end-screen').style.display = 'flex';
    setTimeout(() => document.getElementById('end-screen').style.opacity = '1', 50);
}

function nextTarget() {
    let x = Math.floor(Math.random() * 8);
    let y = Math.floor(Math.random() * 8);
    targetSq = (x * x) + (y * y);
    if (targetSq === 0) return nextTarget();
    
    // Lógica de visualización para Nivel 2
    if (gameMode === 2) {
        let root = Math.sqrt(targetSq);
        // Si es raíz exacta (terna), mostrar el número, si no, mostrar la raíz
        document.getElementById('target-display').innerText = Number.isInteger(root) ? root : `√${targetSq}`;
    } else {
        document.getElementById('target-display').innerText = targetSq;
    }
    
    hitsInLevel = 0;
    document.getElementById('hits').innerText = "0";
}

function createGota() {
    const gota = document.createElement('div');
    gota.className = 'gota';
    let type = 'normal', vx, vy, content;
    const rand = Math.random();

    if (rand < 0.12) { type = 'tiempo-plus'; content = "+5s"; }
    else if (rand < 0.20) { type = 'tiempo-minus'; content = "-5s"; }
    else if (rand < 0.25) { type = 'reset'; content = "🔃"; }
    else {
        const isCorrect = Math.random() > 0.65;
        if (isCorrect) {
            let solutions = [];
            for(let x=0; x<=10; x++) for(let y=0; y<=10; y++) if(x*x+y*y===targetSq) solutions.push([x,y]);
            let sol = solutions[Math.floor(Math.random()*solutions.length)];
            vx = sol[0] * (Math.random()>0.5?1:-1);
            vy = sol[1] * (Math.random()>0.5?1:-1);
            if(Math.random()>0.5) [vx, vy] = [vy, vx];
        } else {
            vx = Math.floor(Math.random()*13)-6; vy = Math.floor(Math.random()*13)-6;
            if(vx*vx+vy*vy===targetSq) vx++;
        }
        content = `(${vx}, ${vy})`;
    }

    gota.classList.add(type);
    gota.innerHTML = `<span>${content}</span>`;
    gota.style.left = Math.random() * (window.innerWidth - 120) + 'px';
    gota.style.top = '-120px';

    let pos = -120;
    let speed = 0.9 + Math.random() * 1.3;
    let move = setInterval(() => {
        if (!gameActive) { clearInterval(move); gota.remove(); return; }
        pos += speed;
        gota.style.top = pos + 'px';
        if(pos > window.innerHeight) { clearInterval(move); gota.remove(); }
    }, 20);

    gota.onclick = () => {
        if (type === 'normal') {
            const esCorrecto = (vx * vx + vy * vy === targetSq);
            if (esCorrecto) {
                gota.classList.add('acierto');
                totalScore++; hitsInLevel++;
                document.getElementById('total').innerText = totalScore;
                document.getElementById('hits').innerText = hitsInLevel;
                if (hitsInLevel >= 2) setTimeout(nextTarget, 200);
            } else {
                gota.classList.add('error');
                timeLeft -= 3;
            }
        } else {
            if (type === 'tiempo-plus') { gota.classList.add('acierto'); timeLeft += 5; }
            if (type === 'tiempo-minus') { gota.classList.add('error'); timeLeft -= 5; }
            if (type === 'reset') { gota.classList.add('acierto'); nextTarget(); }
        }
        setTimeout(() => { clearInterval(move); gota.remove(); }, 250);
    };
    document.getElementById("balls").appendChild(gota);
}
