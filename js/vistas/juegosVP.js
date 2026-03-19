export function renderJuegosVP(container) {
  container.innerHTML = `
    <div class="slideshow-container">

      <div class="slide active">
        <h2 class="set-title">Cálculo Mental</h2>
        <img src="assets/cal_mental.png" alt="Imagen 1">
        <p class="caption">Encuentra la expresión que resulta en el número deseado. La reglas
        cambia dependiendo de la dificultad que escojas.</p>
      </div>

      <div class="slide">
        <h2 class="set-title">Memorama</h2>
        <img src="assets/memorama.png" alt="Imagen 2">
        <p class="caption">Usa tus conocimientos de lógica y conjuntos para 
        encontrar los pares correctos.</p>
      </div>

      <div class="slide">
        <img src="assets/nave.png" alt="Imagen 3">
        <p class="caption">Descripción de la imagen 3</p>
      </div>

      <div class="slide">
        <img src="assets/vectores.png" alt="Imagen 3">
        <p class="caption">Descripción de la imagen 3</p>
      </div>

      <div class="progress-bar">
        <div class="progress"></div>
      </div>

      <button class="prev">❮</button>
      <button class="next">❯</button>

    </div>
  `;

  initSlideshow(container);
}

function initSlideshow(container) {

  const slides = container.querySelectorAll(".slide");
  const nextBtn = container.querySelector(".next");
  const prevBtn = container.querySelector(".prev");
  const progress = container.querySelector(".progress");

  let currentIndex = 0;
  let interval;
  const duration = 10000; // 5 segundos

  function startTimer() {
    progress.style.transition = "none";
    progress.style.width = "0%";

    // Forzar reflow para reiniciar animación
    void progress.offsetWidth;

    progress.style.transition = `width ${duration}ms linear`;
    progress.style.width = "100%";
  }

  function resetInterval() {
    clearInterval(interval);
    interval = setInterval(() => {
      showSlide(currentIndex + 1);
    }, duration);
  }

  function showSlide(index) {

    slides.forEach(slide => slide.classList.remove("active"));

    if (index >= slides.length) currentIndex = 0;
    else if (index < 0) currentIndex = slides.length - 1;
    else currentIndex = index;

    slides[currentIndex].classList.add("active");

    startTimer();
    resetInterval();
  }

  nextBtn.addEventListener("click", () => {
    showSlide(currentIndex + 1);
  });

  prevBtn.addEventListener("click", () => {
    showSlide(currentIndex - 1);
  });

  startTimer();
  resetInterval();
}