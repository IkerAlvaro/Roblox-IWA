/**
 * Roblox IWA - Murcia WISP Client
 * Legacy app.js - ahora usa WispMurcia
 */
const frame = document.getElementById("frame");
const frameWrap = document.getElementById("frameWrap");
const splash = document.getElementById("splash");
const statusEl = document.getElementById("status");
const urlInput = document.getElementById("url");
const HOME = "https://www.roblox.com/home";

function tick() {
  const now = new Date();
  const clock = document.getElementById("clock");
  if (clock) {
    clock.textContent = now.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
tick();
setInterval(tick, 10000);

function allowed(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)roblox\.com$/.test(u.hostname);
  } catch {
    return false;
  }
}

function searchOrUrl(value) {
  const q = value.trim();
  if (!q) return HOME;
  if (/^https?:/i.test(q)) return q;
  return "https://www.roblox.com/discover/?Keyword=" + encodeURIComponent(q);
}

function setActive(url) {
  document.querySelectorAll(".rail nav button, .rail button[data-url]").forEach((b) => {
    b.classList.toggle("active", b.dataset.url === url);
  });
}

function load(url) {
  if (!allowed(url)) {
    if (statusEl) statusEl.textContent = "Solo se permite https://*.roblox.com";
    return;
  }
  
  // Usar WISP Murcia proxy si está disponible
  let finalUrl = url;
  if (window.WispMurcia) {
    const mode = localStorage.getItem('roblox-mode') || 'turbo';
    if (mode === 'turbo' || mode === 'proxy' || mode === 'wisp') {
      finalUrl = `/proxy/roblox/?url=${encodeURIComponent(url)}`;
    }
  }
  
  if (splash) splash.hidden = true;
  if (splash) splash.style.display = 'none';
  if (frameWrap) frameWrap.classList.add('active');
  if (frame) {
    frame.hidden = false;
    frame.src = finalUrl;
  }
  if (urlInput) urlInput.value = url;
  if (statusEl) statusEl.textContent = "Cargando " + url + " ⚡ Murcia";
  setActive(url);
}

const launchBtn = document.getElementById("launch");
if (launchBtn) launchBtn.addEventListener("click", () => load(HOME));

const homeBtn = document.getElementById("home-btn");
if (homeBtn) homeBtn.addEventListener("click", () => {
  if (frame) {
    frame.hidden = true;
    frame.removeAttribute("src");
  }
  if (frameWrap) frameWrap.classList.remove('active');
  if (splash) {
    splash.hidden = false;
    splash.style.display = 'block';
  }
  if (statusEl) statusEl.textContent = "Inicio - Murcia Turbo ⚡";
});

document.querySelectorAll("[data-url]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    load(el.dataset.url);
  });
});

const discoverLink = document.getElementById("discover-link");
if (discoverLink) discoverLink.addEventListener("click", (event) => {
  event.preventDefault();
  load("https://www.roblox.com/discover");
});

const goForm = document.getElementById("go-form");
if (goForm) goForm.addEventListener("submit", (event) => {
  event.preventDefault();
  load(searchOrUrl(urlInput.value));
});

const fsBtn = document.getElementById("fullscreen");
if (fsBtn) fsBtn.addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    if (statusEl) statusEl.textContent = "Pantalla completa no disponible aquí";
  }
});

if (frame) frame.addEventListener("load", () => {
  if (!frame.hidden && statusEl) statusEl.textContent = "Sesión abierta en el IWA Murcia ⚡";
});
