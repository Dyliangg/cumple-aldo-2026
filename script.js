/* ============================================================
   CONFIG — Edita aquí todo el contenido personalizado.
   No hace falta tocar el resto del archivo.
   ============================================================ */
const CONFIG = {

  // Código numérico de acceso. Todos deben tener la misma longitud que codeLength.
  codeLength: 4,
  accessCodes: ["0214", "1234"], // PLACEHOLDER: pon el/los código(s) numéricos válidos

  // Pistas que aparecen progresivamente tras fallar el código
  hints: [
    "Pista 1: es algo que me dices seguido... (PLACEHOLDER)",
    "Pista 2: tiene que ver con una fecha importante para nosotros (PLACEHOLDER)",
    "Pista 3: ok te lo regalo, pregúntame en persona 😏"
  ],
  attemptsPerHint: 2, // cada cuántos fallos se desbloquea una pista nueva

  // Mensajes random del gatito cuando el código es incorrecto
  petMessages: [
    "Mmm, ese no es... ¡inténtalo de nuevo!",
    "¡Casi! Bueno, no tan casi jaja",
    "Piensa con el corazón, no con la cabeza 💜",
    "Nop. Pero me caes bien igual.",
    "El código está más cerca de lo que crees..."
  ],

  // Fecha de inicio de la relación (para el contador de días) — formato YYYY-MM-DD
  anniversaryDate: "2023-02-14", // PLACEHOLDER: ajusta a su fecha real

  // Galería de fotos. Si "img" está vacío se muestra un degradado de relleno.
  gallery: [
    { img: "", caption: "Nuestra primera cita 💕" },
    { img: "", caption: "Ese viaje inolvidable ✈️" },
    { img: "", caption: "Cuando te reíste tanto 😂" },
    { img: "", caption: "Mi foto favorita de los dos 📸" },
    { img: "", caption: "Ese día random pero perfecto 🌙" },
    { img: "", caption: "PLACEHOLDER: agrega tu propia foto" }
  ],

  // Canciones (usa el ID del video de YouTube, la parte después de v=)
  songs: [
    { title: "Nuestra canción", youtubeId: "PLACEHOLDER_ID_1" },
    { title: "Esa que cantamos en el carro", youtubeId: "PLACEHOLDER_ID_2" },
    { title: "La que te dediqué", youtubeId: "PLACEHOLDER_ID_3" }
  ],

  // Texto de la carta (usa \n para saltos de línea/párrafos)
  letter: `Mi amor,

Quiero que sepas todo lo que significas para mí...
(PLACEHOLDER: escribe aquí tu carta completa)

Te amo mucho.
Feliz cumpleaños.`,

  // Opciones del minijuego "Elige el look"
  outfits: [
    { id: "casual", emoji: "👕", label: "Casual" },
    { id: "elegante", emoji: "🤵", label: "Elegante" },
    { id: "deportivo", emoji: "🏀", label: "Deportivo" },
    { id: "playero", emoji: "🩴", label: "Playero" }
  ],

  // Adornos disponibles para decorar el pastel
  decorItems: ["🍒", "🍫", "🍓", "✨", "🕯️", "🍬"],
  decorGoal: 5, // cuántos adornos hay que colocar para completar el nivel

  // Preguntas del quiz. "answers" acepta varias formas válidas (todo en minúsculas)
  quiz: [
    {
      question: "¿En qué mes nos conocimos?",
      answers: ["febrero", "PLACEHOLDER"]
    },
    {
      question: "¿Cuál es mi comida favorita?",
      answers: ["PLACEHOLDER"]
    },
    {
      question: "¿Cómo se llama nuestra canción?",
      answers: ["PLACEHOLDER"]
    }
  ],

  // Juego de atrapar corazones
  catchTarget: 10, // puntos necesarios para pasar el nivel
  catchSpeedMs: 900, // cada cuánto cae un nuevo objeto (ms)

  // Texto del "vale" final que se revela al ganar
  valeText: `VALE POR:
Una cena a tu elección 🍽️
(PLACEHOLDER: cámbialo por lo que quieras regalarle)`
};

/* ============================================================
   ESTADO
   ============================================================ */
const state = {
  failCount: 0,
  levelsDone: { outfit: false, decorar: false, quiz: false, atrapar: false },
  decorPlaced: 0,
  quizIndex: 0,
  catchScore: 0,
  catchTimer: null,
  basketX: 50, // porcentaje
  selectedOutfit: null,
  enteredCode: ""
};

/* ============================================================
   NAVEGACIÓN
   ============================================================ */
function goTo(id) {
  document.querySelectorAll(".screen").forEach((el) => {
    el.setAttribute("data-active", el.id === id ? "true" : "false");
  });
  window.scrollTo(0, 0);
  if (id === "screen-game-atrapar") startCatchGame();
  else stopCatchGame();
}

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", () => goTo(el.getAttribute("data-goto")));
});

/* ============================================================
   CANDADO (código numérico + teclado)
   ============================================================ */
const lockCard = document.querySelector(".lock-card");
const hintText = document.getElementById("hint-text");
const codeBoxesEl = document.getElementById("code-boxes");
const keypadEl = document.getElementById("keypad");
const petPopup = document.getElementById("pet-popup");
const petMessage = document.getElementById("pet-message");
const petEmoji = document.getElementById("pet-emoji");

// Gatitos recortados individualmente (ver assets/gato-0.png ... gato-5.png)
const petFrames = [
  "assets/gato-0.png", "assets/gato-1.png", "assets/gato-2.png",
  "assets/gato-3.png", "assets/gato-4.png", "assets/gato-5.png"
];

function normalize(str) {
  return str.trim().toLowerCase();
}

function renderCodeBoxes() {
  codeBoxesEl.innerHTML = "";
  for (let i = 0; i < CONFIG.codeLength; i++) {
    const box = document.createElement("div");
    box.className = "code-box";
    box.textContent = "♡";
    codeBoxesEl.appendChild(box);
  }
}

function updateCodeBoxes() {
  const boxes = codeBoxesEl.querySelectorAll(".code-box");
  boxes.forEach((box, i) => {
    const filled = i < state.enteredCode.length;
    box.classList.toggle("filled", filled);
    box.textContent = filled ? "❤" : "♡";
  });
}

function renderKeypad() {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "DEL"];
  keypadEl.innerHTML = "";
  keys.forEach((key) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "keypad-btn";
    if (key === "") {
      btn.classList.add("keypad-empty");
    } else if (key === "DEL") {
      btn.classList.add("keypad-del");
      btn.textContent = "DEL";
      btn.addEventListener("click", pressDelete);
    } else {
      btn.textContent = key;
      btn.addEventListener("click", () => pressDigit(key));
    }
    keypadEl.appendChild(btn);
  });
}

function pressDigit(digit) {
  if (state.enteredCode.length >= CONFIG.codeLength) return;
  state.enteredCode += digit;
  updateCodeBoxes();
  if (state.enteredCode.length === CONFIG.codeLength) {
    setTimeout(checkCode, 200);
  }
}

function pressDelete() {
  state.enteredCode = state.enteredCode.slice(0, -1);
  updateCodeBoxes();
}

function checkCode() {
  const isValid = CONFIG.accessCodes.some((code) => normalize(code) === state.enteredCode);

  if (isValid) {
    goTo("screen-cake");
    return;
  }

  state.failCount++;
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth;
  lockCard.classList.add("shake");
  showPetMessage();
  updateHint();
  state.enteredCode = "";
  updateCodeBoxes();
}

document.addEventListener("keydown", (e) => {
  if (document.getElementById("screen-lock").getAttribute("data-active") !== "true") return;
  if (e.key >= "0" && e.key <= "9") pressDigit(e.key);
  if (e.key === "Backspace") pressDelete();
});

function showPetMessage() {
  const msg = CONFIG.petMessages[Math.floor(Math.random() * CONFIG.petMessages.length)];
  petMessage.textContent = msg;
  petEmoji.style.backgroundImage = `url('${petFrames[Math.floor(Math.random() * petFrames.length)]}')`;
  petPopup.classList.add("visible");
  clearTimeout(showPetMessage._t);
  showPetMessage._t = setTimeout(() => petPopup.classList.remove("visible"), 2600);
}

function updateHint() {
  const hintsUnlocked = Math.floor(state.failCount / CONFIG.attemptsPerHint);
  if (hintsUnlocked > 0 && hintsUnlocked <= CONFIG.hints.length) {
    hintText.textContent = CONFIG.hints[hintsUnlocked - 1];
  }
}

/* ============================================================
   PASTEL
   ============================================================ */
const cakeBtn = document.getElementById("cake-btn");
const cakeContinue = document.getElementById("cake-continue");

cakeBtn.addEventListener("click", () => {
  cakeBtn.classList.add("popped");
  burstConfetti(90);
  cakeContinue.classList.remove("btn-hidden");
});

/* ============================================================
   MENÚ + CORAZÓN OCULTO
   ============================================================ */
const hiddenHeart = document.getElementById("hidden-heart");

hiddenHeart.addEventListener("click", () => {
  if (!allLevelsDone()) return;
  goTo("screen-final");
  renderVale();
  burstConfetti(140);
});

function allLevelsDone() {
  return Object.values(state.levelsDone).every(Boolean);
}

function refreshHeartState() {
  hiddenHeart.classList.toggle("unlocked", allLevelsDone());
}

/* ============================================================
   GALERÍA
   ============================================================ */
function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  grid.innerHTML = "";
  CONFIG.gallery.forEach((item) => {
    const card = document.createElement("div");
    card.className = "polaroid";
    card.innerHTML = `
      <div class="polaroid-inner">
        <div class="polaroid-front">
          <div class="polaroid-photo" style="${item.img ? `background-image:url('${item.img}')` : ""}"></div>
        </div>
        <div class="polaroid-back">
          <div class="polaroid-caption">${item.caption}</div>
        </div>
      </div>
    `;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    grid.appendChild(card);
  });
}

function renderDaysCounter() {
  const el = document.getElementById("days-counter");
  const start = new Date(CONFIG.anniversaryDate + "T00:00:00");
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now - start) / 86400000));
  el.textContent = `Llevamos ${diffDays} días juntos 💜`;
}

/* ============================================================
   MÚSICA
   ============================================================ */
function renderSongs() {
  const list = document.getElementById("song-list");
  const player = document.getElementById("song-player");
  list.innerHTML = "";
  CONFIG.songs.forEach((song, i) => {
    const item = document.createElement("button");
    item.className = "song-item";
    item.innerHTML = `<span>🎵</span><span>${song.title}</span>`;
    item.addEventListener("click", () => {
      document.querySelectorAll(".song-item").forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
      player.innerHTML = `<iframe src="https://www.youtube.com/embed/${song.youtubeId}?autoplay=1" title="${song.title}" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
    });
    list.appendChild(item);
  });
}

/* ============================================================
   CARTA
   ============================================================ */
const envelope = document.getElementById("envelope");
const letterEl = document.getElementById("letter");

function initLetter() {
  letterEl.textContent = CONFIG.letter;
  envelope.addEventListener("click", () => {
    envelope.classList.add("open");
    setTimeout(() => letterEl.classList.add("visible"), 350);
  });
}

/* ============================================================
   MINIJUEGO: OUTFIT
   ============================================================ */
function renderOutfitGame() {
  const grid = document.getElementById("outfit-grid");
  const feedback = document.getElementById("outfit-feedback");
  grid.innerHTML = "";
  feedback.textContent = state.levelsDone.outfit ? "¡Nivel completado! ✅" : "";

  CONFIG.outfits.forEach((outfit) => {
    const card = document.createElement("button");
    card.className = "outfit-card" + (state.selectedOutfit === outfit.id ? " selected" : "");
    card.innerHTML = `<span class="outfit-emoji">${outfit.emoji}</span><span>${outfit.label}</span>`;
    card.addEventListener("click", () => {
      document.querySelectorAll(".outfit-card").forEach((c) => c.classList.remove("selected"));
      card.classList.add("selected");
      state.selectedOutfit = outfit.id;
      state.levelsDone.outfit = true;
      feedback.textContent = `¡Elegiste ${outfit.label}! Nivel completado ✅`;
      markLevelDone("outfit");
    });
    grid.appendChild(card);
  });
}

/* ============================================================
   MINIJUEGO: DECORAR PASTEL
   ============================================================ */
function renderDecorGame() {
  const cake = document.getElementById("decor-cake");
  const itemsWrap = document.getElementById("decor-items");
  const feedback = document.getElementById("decor-feedback");
  cake.innerHTML = "";
  itemsWrap.innerHTML = "";
  state.decorPlaced = 0;
  feedback.textContent = state.levelsDone.decorar ? "Nivel ya completado ✅ (puedes seguir decorando)" : "";

  CONFIG.decorItems.forEach((emoji) => {
    const btn = document.createElement("button");
    btn.className = "decor-item-btn";
    btn.textContent = emoji;
    btn.addEventListener("click", () => {
      placeDecoration(cake, emoji);
      state.decorPlaced++;
      if (state.decorPlaced >= CONFIG.decorGoal && !state.levelsDone.decorar) {
        state.levelsDone.decorar = true;
        feedback.textContent = "¡Pastel decorado! Nivel completado ✅";
        markLevelDone("decorar");
      } else if (!state.levelsDone.decorar) {
        feedback.textContent = `Adornos colocados: ${state.decorPlaced}/${CONFIG.decorGoal}`;
      }
    });
    itemsWrap.appendChild(btn);
  });
}

function placeDecoration(cake, emoji) {
  const deco = document.createElement("span");
  deco.className = "decoration";
  deco.textContent = emoji;
  const top = 15 + Math.random() * 70;
  const left = 15 + Math.random() * 70;
  deco.style.top = `${top}%`;
  deco.style.left = `${left}%`;
  cake.appendChild(deco);
}

/* ============================================================
   MINIJUEGO: QUIZ
   ============================================================ */
function renderQuizGame() {
  document.getElementById("quiz-feedback").textContent = "";
  document.getElementById("quiz-input").value = "";
  if (state.levelsDone.quiz) {
    state.quizIndex = CONFIG.quiz.length;
  } else {
    state.quizIndex = 0;
  }
  showQuizQuestion();
}

function showQuizQuestion() {
  const progress = document.getElementById("quiz-progress");
  const questionEl = document.getElementById("quiz-question");
  const feedback = document.getElementById("quiz-feedback");

  if (state.quizIndex >= CONFIG.quiz.length) {
    progress.textContent = "";
    questionEl.textContent = "¡Completaste el quiz! 🎉";
    feedback.textContent = "Nivel completado ✅";
    document.getElementById("quiz-form").style.display = "none";
    state.levelsDone.quiz = true;
    markLevelDone("quiz");
    return;
  }

  document.getElementById("quiz-form").style.display = "flex";
  progress.textContent = `Pregunta ${state.quizIndex + 1} de ${CONFIG.quiz.length}`;
  questionEl.textContent = CONFIG.quiz[state.quizIndex].question;
  feedback.textContent = "";
}

document.getElementById("quiz-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("quiz-input");
  const feedback = document.getElementById("quiz-feedback");
  const current = CONFIG.quiz[state.quizIndex];
  const value = normalize(input.value);

  const correct = current.answers.some((ans) => value.includes(normalize(ans)) || normalize(ans).includes(value));

  if (correct && value.length > 0) {
    state.quizIndex++;
    input.value = "";
    showQuizQuestion();
  } else {
    feedback.textContent = "No es eso... ¡intenta de nuevo!";
  }
});

/* ============================================================
   MINIJUEGO: ATRAPAR CORAZONES
   ============================================================ */
const catchField = document.getElementById("catch-field");
const basket = document.getElementById("basket");
const catchLeft = document.getElementById("catch-left");
const catchRight = document.getElementById("catch-right");
const fallingItems = [];

function renderCatchGame() {
  document.getElementById("catch-target").textContent = CONFIG.catchTarget;
  document.getElementById("catch-score").textContent = state.catchScore;
  document.getElementById("catch-feedback").textContent = state.levelsDone.atrapar ? "Nivel ya completado ✅" : "";
}

function startCatchGame() {
  if (state.levelsDone.atrapar) return;
  state.catchScore = 0;
  state.basketX = 50;
  basket.style.left = "50%";
  document.getElementById("catch-score").textContent = "0";
  fallingItems.forEach((it) => it.el.remove());
  fallingItems.length = 0;
  clearInterval(state.catchTimer);
  state.catchTimer = setInterval(catchTick, CONFIG.catchSpeedMs);
}

function stopCatchGame() {
  clearInterval(state.catchTimer);
  state.catchTimer = null;
}

function catchTick() {
  spawnFallingItem();
  moveFallingItems();
}

function spawnFallingItem() {
  const el = document.createElement("div");
  el.className = "falling-item";
  el.textContent = "💗";
  const x = 5 + Math.random() * 85;
  el.style.left = `${x}%`;
  catchField.appendChild(el);
  fallingItems.push({ el, x, y: -30 });
}

function moveFallingItems() {
  const fieldHeight = catchField.clientHeight;
  for (let i = fallingItems.length - 1; i >= 0; i--) {
    const item = fallingItems[i];
    item.y += 40;
    item.el.style.top = `${item.y}px`;

    if (item.y >= fieldHeight - 50) {
      const dx = Math.abs(item.x - state.basketX);
      if (dx < 12) {
        state.catchScore++;
        document.getElementById("catch-score").textContent = state.catchScore;
        checkCatchWin();
      }
      item.el.remove();
      fallingItems.splice(i, 1);
    }
  }
}

function moveBasket(delta) {
  state.basketX = Math.min(95, Math.max(5, state.basketX + delta));
  basket.style.left = `${state.basketX}%`;
}

catchLeft.addEventListener("click", () => moveBasket(-10));
catchRight.addEventListener("click", () => moveBasket(10));

document.addEventListener("keydown", (e) => {
  if (document.getElementById("screen-game-atrapar").getAttribute("data-active") !== "true") return;
  if (e.key === "ArrowLeft") moveBasket(-10);
  if (e.key === "ArrowRight") moveBasket(10);
});

function checkCatchWin() {
  if (state.catchScore >= CONFIG.catchTarget && !state.levelsDone.atrapar) {
    state.levelsDone.atrapar = true;
    document.getElementById("catch-feedback").textContent = "¡Nivel completado! ✅";
    stopCatchGame();
    markLevelDone("atrapar");
  }
}

/* ============================================================
   PROGRESO DE NIVELES
   ============================================================ */
function markLevelDone(key) {
  const check = document.querySelector(`[data-check="${key}"]`);
  if (check) check.classList.add("done");
  refreshHeartState();
}

/* ============================================================
   FINAL / VALE
   ============================================================ */
function renderVale() {
  document.getElementById("vale-box").textContent = CONFIG.valeText;
}

/* ============================================================
   CONFETI (canvas, sin librerías)
   ============================================================ */
const canvas = document.getElementById("confetti-canvas");
const ctx = canvas.getContext("2d");
let confettiParticles = [];
let confettiRunning = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const confettiColors = ["#ff6fa5", "#b46eff", "#ffd166", "#ffffff", "#ff9ecb"];

function burstConfetti(count = 80) {
  for (let i = 0; i < count; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.3,
      size: 6 + Math.random() * 6,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      speedY: 2 + Math.random() * 3,
      speedX: -1.5 + Math.random() * 3,
      rotation: Math.random() * 360,
      rotationSpeed: -6 + Math.random() * 12,
      life: 0,
      maxLife: 260 + Math.random() * 120
    });
  }
  if (!confettiRunning) {
    confettiRunning = true;
    requestAnimationFrame(animateConfetti);
  }
}

function animateConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettiParticles.forEach((p) => {
    p.x += p.speedX;
    p.y += p.speedY;
    p.rotation += p.rotationSpeed;
    p.life++;

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });

  confettiParticles = confettiParticles.filter(
    (p) => p.life < p.maxLife && p.y < canvas.height + 40
  );

  if (confettiParticles.length > 0) {
    requestAnimationFrame(animateConfetti);
  } else {
    confettiRunning = false;
  }
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  renderCodeBoxes();
  renderKeypad();
  renderGallery();
  renderDaysCounter();
  renderSongs();
  initLetter();
  renderOutfitGame();
  renderDecorGame();
  renderQuizGame();
  renderCatchGame();

  document.getElementById("screen-arcade").querySelectorAll(".game-card").forEach((card) => {
    const level = card.getAttribute("data-level");
    card.addEventListener("click", () => {
      if (level === "outfit") renderOutfitGame();
      if (level === "decorar") renderDecorGame();
      if (level === "quiz") renderQuizGame();
      if (level === "atrapar") renderCatchGame();
    });
  });

  refreshHeartState();
}

init();
