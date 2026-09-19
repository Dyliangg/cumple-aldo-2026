// ============================================================
// CONFIGURACIÓN — edita aquí los datos personales
// ============================================================
const CONFIG = {
  // Código de acceso (4 dígitos): fecha de la primera salida (28 de febrero)
  accessCode: "2802",

  // Fotos de tu gatito para el popup de código incorrecto (archivos en assets/).
  catPhotos: [
    "assets/gato-0.png",
    "assets/gato-1.png",
    "assets/gato-2.png",
    "assets/gato-3.png",
    "assets/gato-4.png",
    "assets/gato-5.png"
  ],

  // Fecha en que empezaron a ser novios, para el contador
  anniversaryDate: new Date(2026, 2, 29), // meses en JS empiezan en 0 -> marzo = 2

  // Frases/captions de las fotos de la galería (edita con tus recuerdos reales)
  photos: [
    { caption: "El día que salimos por primera vez", date: "28 feb 2026" },
    { caption: "El día que me pediste ser tu novia", date: "29 mar 2026" },
    { caption: "[agrega tu recuerdo aquí]", date: "[fecha]" },
    { caption: "[agrega tu recuerdo aquí]", date: "[fecha]" },
    { caption: "[agrega tu recuerdo aquí]", date: "[fecha]" },
    { caption: "[agrega tu recuerdo aquí]", date: "[fecha]" },
  ],

  // Canciones: pon el videoId de YouTube (lo que va después de "v=" en la URL)
  songs: [
    {
      title: "Lenny Kravitz — I Belong to You",
      videoId: "ucvLuGgsGS8",
      quote: "Esta sonaba el día que me pediste ser tu novia. Desde ese momento es nuestra."
    },
    {
      title: "Damiano David — The First Time",
      videoId: "DwIoUsBas-o",
      quote: "Esta te la dediqué yo. Cada palabra decía justo lo que sentía por ti."
    },
    {
      title: "Kevin Kaarl — San Lucas",
      videoId: "7-Ikexq03O0",
      quote: "Me la dedicaste tú, y desde entonces no la puedo escuchar sin pensar en ti."
    },
    {
      title: "Los Amigos Invisibles — La Que Me Gusta",
      videoId: "kt5q-Qqatns",
      quote: "“Encontré a la que me gusta”... y sí, así fue. Te encontré a ti."
    },
  ],

  // Outfit: emojis de opciones por categoría
  outfit: {
    top:    ["👕", "👔", "🧥"],
    bottom: ["👖", "🩳", "👗"],
    shoes:  ["👟", "🥾", "🩴"],
  },

  // Toppings del pastel
  toppings: ["🍓", "🍫", "🍒", "🌟", "🍩", "🧁"],

  // Preguntas del nivel 3 (pistas y respuestas — edítalas)
  quiz: [
    { clue: "Lugar de nuestra primera cita", answer: "" },
    { clue: "Mi apodo cariñoso para ti", answer: "mi vida" },
    { clue: "Lo que siempre pides de comer", answer: "" },
    { clue: "El mes en que empezamos a salir", answer: "febrero" },
  ],

  // Frases que caen en el juego de besos
  kissPhrases: ["💋", "💋", "Te amo", "💋", "Eres mi favorito", "💋", "Contigo siempre", "💋"],

  // Texto del vale sorpresa final
  valeText: "[escribe aquí el vale sorpresa: una cita, un día libre de quehaceres, etc.]",
};

// ============================================================
// NAVEGACIÓN ENTRE PANTALLAS
// ============================================================
function goTo(id){
  document.querySelectorAll(".screen").forEach(s => s.dataset.active = "false");
  const target = document.getElementById(id);
  target.dataset.active = "true";
  window.scrollTo({ top: 0, behavior: "instant" });

  if (id === "screen-cake") startMicBlowDetection();
  if (id === "screen-galeria") renderGallery();
  if (id === "screen-musica") renderSongs();
  if (id === "screen-game-outfit") renderOutfit();
  if (id === "screen-game-cake") renderCakeDecor();
  if (id === "screen-game-quiz") renderQuiz();
}

document.querySelectorAll("[data-target]:not(.menu-card)").forEach(el => {
  el.addEventListener("click", () => goTo(el.dataset.target));
});

// Las tarjetas del menú principal son "regalos": se abren con una animación
// antes de llevarte a la sección.
document.querySelectorAll(".menu-card").forEach(card => {
  card.addEventListener("click", () => {
    if (card.classList.contains("opening")) return;
    card.classList.add("opening");
    setTimeout(() => {
      goTo(card.dataset.target);
      card.classList.remove("opening");
    }, 420);
  });
});

// ============================================================
// PANTALLA 1: CANDADO
// ============================================================
const pinDots = document.querySelectorAll(".pin-dot");
const keypad = document.getElementById("keypad");
const lockCard = document.querySelector("#screen-lock .lock-card");
const lockHint = document.getElementById("lock-hint");
const mascotOverlay = document.getElementById("mascot-overlay");
const mascotFace = document.getElementById("mascot-face");
const mascotMsg = document.getElementById("mascot-msg");
const mascotRetry = document.getElementById("mascot-retry");
const countdownOverlay = document.getElementById("countdown-overlay");
const countdownNumber = document.getElementById("countdown-number");

const CODE_LENGTH = CONFIG.accessCode.length;
let enteredCode = "";
let failCount = 0;

function updatePinDots(){
  pinDots.forEach((dot, i) => {
    const filled = i < enteredCode.length;
    dot.textContent = filled ? "♥" : "♡";
    dot.classList.toggle("filled", filled);
  });
}

function showMascot(){
  if (CONFIG.catPhotos.length){
    const src = CONFIG.catPhotos[Math.floor(Math.random() * CONFIG.catPhotos.length)];
    mascotFace.innerHTML = `<img src="${src}" alt="gatito" class="mascot-photo">`;
  } else {
    mascotFace.textContent = "🐱";
  }
}

function startCountdown(){
  countdownOverlay.classList.remove("hidden");
  let n = 3;
  countdownNumber.textContent = n;

  const tick = () => {
    n--;
    if (n > 0){
      countdownNumber.textContent = n;
      countdownNumber.classList.remove("pop");
      void countdownNumber.offsetWidth; // reflow para reiniciar animación
      countdownNumber.classList.add("pop");
      setTimeout(tick, 1000);
    } else {
      countdownOverlay.classList.add("hidden");
      goTo("screen-cake");
    }
  };
  setTimeout(tick, 1000);
}

function checkCode(){
  if (enteredCode === CONFIG.accessCode){
    startCountdown();
    return;
  }

  failCount++;
  lockCard.classList.remove("shake");
  void lockCard.offsetWidth; // reflow para reiniciar animación
  lockCard.classList.add("shake");

  const messages = [
    "Inténtalo de nuevo, mi vida.",
    "El sistema no te reconoce... ¿o sí, mi vida?",
    "Nop. Intenta de nuevo, mi amor.",
    "Ese no era, mi amor.",
  ];
  showMascot();
  mascotMsg.textContent = messages[Math.floor(Math.random() * messages.length)];
  mascotOverlay.classList.remove("hidden");

  if (failCount >= 3){
    lockHint.textContent = "💡 Pista: piensa en el día que salimos por primera vez";
  }

  enteredCode = "";
  updatePinDots();
}

keypad.addEventListener("click", (e) => {
  const btn = e.target.closest(".key");
  if (!btn || btn.disabled) return;

  if (btn.id === "key-del"){
    enteredCode = enteredCode.slice(0, -1);
    updatePinDots();
    return;
  }

  if (enteredCode.length >= CODE_LENGTH) return;
  enteredCode += btn.dataset.key;
  updatePinDots();

  if (enteredCode.length === CODE_LENGTH){
    setTimeout(checkCode, 150);
  }
});

document.addEventListener("keydown", (e) => {
  if (document.getElementById("screen-lock").dataset.active !== "true") return;
  if (e.key >= "0" && e.key <= "9"){
    if (enteredCode.length >= CODE_LENGTH) return;
    enteredCode += e.key;
    updatePinDots();
    if (enteredCode.length === CODE_LENGTH){
      setTimeout(checkCode, 150);
    }
  } else if (e.key === "Backspace"){
    enteredCode = enteredCode.slice(0, -1);
    updatePinDots();
  }
});

mascotRetry.addEventListener("click", () => {
  mascotOverlay.classList.add("hidden");
});

// ============================================================
// PANTALLA 2: PASTEL + REGALOS
// ============================================================
const cakeButton = document.getElementById("cake-button");
const cakeInstruction = document.getElementById("cake-instruction");
const cakeCopy = document.getElementById("cake-copy");
const giftMenu = document.getElementById("gift-menu");
let cakeBlown = false;

function blowOutCake(){
  if (cakeBlown) return;
  cakeBlown = true;
  cakeButton.classList.add("blown");
  cakeInstruction.classList.add("hidden");
  cakeCopy.classList.add("hidden");
  giftMenu.classList.remove("hidden");
  launchConfetti("confetti-cake", 1200);
  stopMicBlowDetection();
}

cakeButton.addEventListener("click", blowOutCake);

// ===== Detección de soplido por micrófono =====
let micStream = null;
let micAudioCtx = null;
let micRafId = null;

function stopMicBlowDetection(){
  if (micRafId) cancelAnimationFrame(micRafId);
  micRafId = null;
  if (micStream){
    micStream.getTracks().forEach(t => t.stop());
    micStream = null;
  }
  if (micAudioCtx){
    micAudioCtx.close();
    micAudioCtx = null;
  }
}

function startMicBlowDetection(){
  if (cakeBlown || micStream || !navigator.mediaDevices?.getUserMedia) return;

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
      if (cakeBlown){
        stream.getTracks().forEach(t => t.stop());
        return;
      }
      micStream = stream;
      micAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (micAudioCtx.state === "suspended") micAudioCtx.resume();

      const source = micAudioCtx.createMediaStreamSource(stream);
      const analyser = micAudioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const data = new Uint8Array(analyser.fftSize);
      const THRESHOLD = 0.12;   // volumen que consideramos "soplido"
      const FRAMES_NEEDED = 20; // sostenido ~1/3 de segundo
      let loudFrames = 0;

      function tick(){
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++){
          const v = (data[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);

        if (rms > THRESHOLD){
          loudFrames++;
          if (loudFrames >= FRAMES_NEEDED){
            blowOutCake();
            return;
          }
        } else {
          loudFrames = 0;
        }
        micRafId = requestAnimationFrame(tick);
      }
      tick();
    })
    .catch(() => {
      // Sin permiso de micrófono o sin soporte: tocar el pastel sigue funcionando.
    });
}

// ============================================================
// GALERÍA
// ============================================================
function renderGallery(){
  const grid = document.getElementById("polaroid-grid");
  if (grid.dataset.rendered) return;
  grid.dataset.rendered = "true";

  CONFIG.photos.forEach((photo, i) => {
    const wrap = document.createElement("div");
    wrap.className = "polaroid";
    wrap.innerHTML = `
      <div class="polaroid-inner">
        <div class="polaroid-face polaroid-front">
          <div class="polaroid-photo">foto ${i + 1}</div>
          <div class="polaroid-num">toca para voltear</div>
        </div>
        <div class="polaroid-face polaroid-back">
          <p class="polaroid-caption">${photo.caption}</p>
          <p class="polaroid-date">${photo.date}</p>
        </div>
      </div>
    `;
    wrap.addEventListener("click", () => wrap.classList.toggle("flipped"));
    grid.appendChild(wrap);
  });

  updateDaysCounter();
}

function updateDaysCounter(){
  const now = new Date();
  const diff = Math.floor((now - CONFIG.anniversaryDate) / (1000 * 60 * 60 * 24));
  document.getElementById("days-counter").textContent = diff >= 0 ? diff : "—";
}

// ============================================================
// BANDA SONORA
// ============================================================
function renderSongs(){
  const list = document.getElementById("song-list");
  if (list.dataset.rendered) return;
  list.dataset.rendered = "true";

  CONFIG.songs.forEach(song => {
    const item = document.createElement("div");
    item.className = "song-item";
    const embed = song.videoId
      ? `<iframe src="https://www.youtube.com/embed/${song.videoId}" title="${song.title}" allowfullscreen></iframe>`
      : `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:rgba(247,241,228,0.4);font-size:13px;">pega el link de YouTube en script.js</div>`;
    item.innerHTML = `
      <div class="song-embed">${embed}</div>
      <p class="song-title">${song.title}</p>
      <p class="song-quote">&ldquo;${song.quote}&rdquo;</p>
    `;
    list.appendChild(item);
  });
}

// ============================================================
// CARTA
// ============================================================
const seal = document.getElementById("seal");
const envelopeWrap = document.getElementById("envelope-wrap");
const letter = document.getElementById("letter");

seal.addEventListener("click", () => {
  envelopeWrap.classList.add("hidden");
  letter.classList.remove("hidden");
});

// ============================================================
// ARCADE — progreso general
// ============================================================
let levelsDone = { 1: false, 2: false, 3: false, 4: false };

function markLevelDone(n){
  levelsDone[n] = true;
  document.getElementById(`check-${n}`).textContent = "✅";
  const total = Object.values(levelsDone).filter(Boolean).length;
  document.getElementById("progress-label").textContent = `⭐ ${total}/4 niveles completados`;
}

// ===== Nivel 1: Outfit =====
let outfitState = { top: null, bottom: null, shoes: null };

function renderOutfit(){
  const rows = { top: "row-top", bottom: "row-bottom", shoes: "row-shoes" };
  Object.entries(rows).forEach(([cat, rowId]) => {
    const row = document.getElementById(rowId);
    if (row.dataset.rendered) return;
    row.dataset.rendered = "true";
    CONFIG.outfit[cat].forEach(emoji => {
      const btn = document.createElement("button");
      btn.className = "outfit-option";
      btn.textContent = emoji;
      btn.addEventListener("click", () => {
        row.querySelectorAll(".outfit-option").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        outfitState[cat] = emoji;
        updateOutfitPreview();
      });
      row.appendChild(btn);
    });
  });
}

function updateOutfitPreview(){
  const parts = [outfitState.top, outfitState.bottom, outfitState.shoes].filter(Boolean);
  document.getElementById("outfit-preview").textContent = parts.length ? parts.join(" ") : "🧍";
}

document.getElementById("outfit-done").addEventListener("click", () => {
  markLevelDone(1);
  goTo("screen-arcade");
});

// ===== Nivel 2: Decora el pastel =====
function renderCakeDecor(){
  const picker = document.getElementById("toppings-picker");
  if (picker.dataset.rendered) return;
  picker.dataset.rendered = "true";

  CONFIG.toppings.forEach(topping => {
    const btn = document.createElement("button");
    btn.className = "topping-btn";
    btn.textContent = topping;
    btn.addEventListener("click", () => addTopping(topping));
    picker.appendChild(btn);
  });
}

function addTopping(emoji){
  const layer = document.getElementById("toppings-layer");
  const el = document.createElement("span");
  el.className = "topping-placed";
  el.textContent = emoji;
  el.style.left = `${20 + Math.random() * 60}%`;
  el.style.top = `${10 + Math.random() * 50}%`;
  layer.appendChild(el);
}

document.getElementById("cake-decor-done").addEventListener("click", () => {
  markLevelDone(2);
  goTo("screen-arcade");
});

// ===== Nivel 3: Quiz =====
function renderQuiz(){
  const box = document.getElementById("quiz-box");
  if (box.dataset.rendered) return;
  box.dataset.rendered = "true";

  CONFIG.quiz.forEach((q, i) => {
    const div = document.createElement("div");
    div.className = "quiz-question";
    div.innerHTML = `
      <p class="quiz-clue">${i + 1}. ${q.clue}</p>
      <div class="quiz-input-row">
        <input type="text" placeholder="Tu respuesta..." id="quiz-input-${i}">
        <button data-i="${i}">Ver</button>
      </div>
      <p class="quiz-status" id="quiz-status-${i}"></p>
    `;
    box.appendChild(div);
  });

  box.querySelectorAll("button[data-i]").forEach(btn => {
    btn.addEventListener("click", () => checkQuiz(Number(btn.dataset.i)));
  });
}

let quizCorrectCount = 0;
function checkQuiz(i){
  const input = document.getElementById(`quiz-input-${i}`);
  const status = document.getElementById(`quiz-status-${i}`);
  const answer = CONFIG.quiz[i].answer.trim().toLowerCase();
  const value = input.value.trim().toLowerCase();

  if (!answer){
    status.textContent = "⚠️ Falta poner la respuesta correcta en script.js";
    status.className = "quiz-status";
    return;
  }

  if (value === answer){
    status.textContent = "✅ ¡Correcto!";
    status.className = "quiz-status correct";
    quizCorrectCount++;
    if (quizCorrectCount >= Math.ceil(CONFIG.quiz.length * 0.75)){
      markLevelDone(3);
    }
  } else {
    status.textContent = "❌ No es esa... intenta otra vez";
    status.className = "quiz-status wrong";
  }
}

// ===== Nivel 4: Atrapa los besos =====
const kissGame = document.getElementById("kiss-game");
const kissPlayer = document.getElementById("kiss-player");
const kissStart = document.getElementById("kiss-start");
const kissScoreEl = document.getElementById("kiss-score");
const kissTimeEl = document.getElementById("kiss-time");

let kissPlaying = false;
let kissScore = 0;
let kissTimeLeft = 20;
let kissPlayerX = 50; // porcentaje
let kissInterval, kissSpawnInterval, kissTimerInterval;

function startKissGame(){
  if (kissPlaying) return;
  kissPlaying = true;
  kissScore = 0;
  kissTimeLeft = 20;
  kissPlayerX = 50;
  kissScoreEl.textContent = "Puntos: 0";
  kissTimeEl.textContent = "Tiempo: 20";
  kissGame.querySelectorAll(".kiss-item").forEach(el => el.remove());
  kissStart.classList.add("hidden");

  kissSpawnInterval = setInterval(spawnKissItem, 700);
  kissInterval = setInterval(moveKissItems, 50);
  kissTimerInterval = setInterval(() => {
    kissTimeLeft--;
    kissTimeEl.textContent = `Tiempo: ${kissTimeLeft}`;
    if (kissTimeLeft <= 0) endKissGame();
  }, 1000);
}

function spawnKissItem(){
  const el = document.createElement("div");
  el.className = "kiss-item";
  el.textContent = CONFIG.kissPhrases[Math.floor(Math.random() * CONFIG.kissPhrases.length)];
  el.style.left = `${Math.random() * 85}%`;
  el.style.top = "0px";
  el.dataset.y = "0";
  kissGame.appendChild(el);
}

function moveKissItems(){
  const items = kissGame.querySelectorAll(".kiss-item");
  const gameHeight = kissGame.clientHeight;
  items.forEach(el => {
    let y = parseFloat(el.dataset.y) + 5;
    el.dataset.y = y;
    el.style.top = `${y}px`;

    if (y > gameHeight - 50){
      const itemLeft = parseFloat(el.style.left);
      if (Math.abs(itemLeft - kissPlayerX) < 12){
        kissScore++;
        kissScoreEl.textContent = `Puntos: ${kissScore}`;
      }
      el.remove();
    }
  });
}

function endKissGame(){
  clearInterval(kissSpawnInterval);
  clearInterval(kissInterval);
  clearInterval(kissTimerInterval);
  kissPlaying = false;
  kissGame.querySelectorAll(".kiss-item").forEach(el => el.remove());
  kissStart.textContent = `¡${kissScore} atrapados! Jugar de nuevo`;
  kissStart.classList.remove("hidden");
  if (kissScore >= 5) markLevelDone(4);
}

kissStart.addEventListener("click", startKissGame);

document.addEventListener("keydown", (e) => {
  if (!kissPlaying) return;
  if (e.key === "ArrowLeft") kissPlayerX = Math.max(5, kissPlayerX - 8);
  if (e.key === "ArrowRight") kissPlayerX = Math.min(90, kissPlayerX + 8);
  kissPlayer.style.left = `${kissPlayerX}%`;
});

// soporte táctil: deslizar sobre el juego mueve al monito
kissGame.addEventListener("touchmove", (e) => {
  if (!kissPlaying) return;
  const rect = kissGame.getBoundingClientRect();
  const touchX = e.touches[0].clientX - rect.left;
  kissPlayerX = Math.min(90, Math.max(5, (touchX / rect.width) * 100));
  kissPlayer.style.left = `${kissPlayerX}%`;
  e.preventDefault();
}, { passive: false });

// ============================================================
// FINAL
// ============================================================
document.getElementById("btn-to-final").addEventListener("click", () => {
  goTo("screen-final");
  launchConfetti("confetti-final", 2200);
});

const finalHeart = document.getElementById("final-heart");
const finalHint = document.getElementById("final-hint");
const vale = document.getElementById("vale");

finalHeart.addEventListener("click", () => {
  vale.classList.remove("hidden");
  finalHint.classList.add("hidden");
  document.getElementById("vale-text").textContent = CONFIG.valeText;
});

// ============================================================
// CONFETI (canvas simple, sin librerías)
// ============================================================
function launchConfetti(canvasId, duration){
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  const colors = ["#FF7A93", "#F2B84B", "#F7F1E4", "#7CD9A8"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height,
    r: 4 + Math.random() * 4,
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: 2 + Math.random() * 3,
    drift: (Math.random() - 0.5) * 2,
    rotation: Math.random() * 360,
  }));

  const start = performance.now();

  function frame(now){
    const elapsed = now - start;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += 4;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 1.6);
      ctx.restore();
    });
    if (elapsed < duration){
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  requestAnimationFrame(frame);
}
