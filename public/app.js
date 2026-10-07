const frame = document.getElementById("frame");
const splash = document.getElementById("splash");
const statusEl = document.getElementById("status");
const urlInput = document.getElementById("url");
const HOME = "https://www.roblox.com/home";

function tick() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
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
  document.querySelectorAll(".rail nav button").forEach((b) => {
    b.classList.toggle("active", b.dataset.url === url);
  });
}

function load(url) {
  if (!allowed(url)) {
    statusEl.textContent = "Solo se permite https://*.roblox.com";
    return;
  }
  splash.hidden = true;
  frame.hidden = false;
  frame.src = url;
  urlInput.value = url;
  statusEl.textContent = "Cargando " + url;
  setActive(url);
}

document.getElementById("launch").addEventListener("click", () => load(HOME));
document.getElementById("home-btn").addEventListener("click", () => {
  frame.hidden = true;
  splash.hidden = false;
  statusEl.textContent = "Inicio";
});

document.querySelectorAll("[data-url]").forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    load(el.dataset.url);
  });
});

document.getElementById("discover-link").addEventListener("click", (event) => {
  event.preventDefault();
  load("https://www.roblox.com/discover");
});

document.getElementById("go-form").addEventListener("submit", (event) => {
  event.preventDefault();
  load(searchOrUrl(urlInput.value));
});

document.getElementById("fullscreen").addEventListener("click", async () => {
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  } catch {
    statusEl.textContent = "Pantalla completa no disponible aquí";
  }
});

frame.addEventListener("load", () => {
  if (!frame.hidden) statusEl.textContent = "Sesión abierta en el IWA";
});
