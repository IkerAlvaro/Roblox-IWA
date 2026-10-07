const frame = document.getElementById("frame");
const splash = document.getElementById("splash");
const statusEl = document.getElementById("status");
const urlInput = document.getElementById("url");
const HOME = "https://www.roblox.com/home";

function allowed(url) {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)roblox\.com$/.test(u.hostname);
  } catch {
    return false;
  }
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
  document.querySelectorAll(".tabs button").forEach((b) => {
    b.classList.toggle("active", b.dataset.url === url);
  });
}

document.getElementById("launch").addEventListener("click", () => load(HOME));

document.querySelectorAll(".tabs button").forEach((button) => {
  button.addEventListener("click", () => load(button.dataset.url));
});

document.getElementById("go-form").addEventListener("submit", (event) => {
  event.preventDefault();
  load(urlInput.value.trim());
});

frame.addEventListener("load", () => {
  statusEl.textContent = "Roblox cargado en el IWA";
});
