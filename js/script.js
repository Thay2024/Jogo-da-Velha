let tabuleiro;
let jogador;
let aviso;

function inicia() {
  tabuleiro = Array(3).fill().map(() => Array(3).fill(0));
  jogador = 1;
  aviso = document.getElementById("aviso");
  aviso.innerText = "Vez do Jogador 1 (X)";
  exibe();
}

function exibe() {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.lin = i;
      cell.dataset.col = j;

      if (tabuleiro[i][j] === 1) { cell.innerText = "X"; cell.classList.add("x"); }
      else if (tabuleiro[i][j] === -1) { cell.innerText = "O"; cell.classList.add("o"); }

      cell.addEventListener("click", jogar);
      board.appendChild(cell);
    }
  }
}

function jogar(e) {
  const lin = e.target.dataset.lin;
  const col = e.target.dataset.col;

  if (tabuleiro[lin][col] !== 0) { aviso.innerText = "Campo já foi marcado!"; return; }

  tabuleiro[lin][col] = jogador % 2 ? 1 : -1;
  exibe();

  const vencedor = checa();
  if (vencedor) {
    aviso.innerText = "Jogador " + (jogador % 2 ? 1 : 2) + " ganhou!";
    desabilitarTabuleiro();
    return;
  }

  jogador++;
  aviso.innerText = "Vez do Jogador " + (jogador % 2 ? 1 : 2) + (jogador % 2 ? " (X)" : " (O)");
}

function checa() {
  for (let i = 0; i < 3; i++) {
    let somaLinha = tabuleiro[i][0] + tabuleiro[i][1] + tabuleiro[i][2];
    let somaCol = tabuleiro[0][i] + tabuleiro[1][i] + tabuleiro[2][i];
    if (Math.abs(somaLinha) === 3) { destacar([{l:i,c:0},{l:i,c:1},{l:i,c:2}]); return true; }
    if (Math.abs(somaCol) === 3) { destacar([{l:0,c:i},{l:1,c:i},{l:2,c:i}]); return true; }
  }

  let diag1 = tabuleiro[0][0] + tabuleiro[1][1] + tabuleiro[2][2];
  let diag2 = tabuleiro[0][2] + tabuleiro[1][1] + tabuleiro[2][0];
  if (Math.abs(diag1) === 3) { destacar([{l:0,c:0},{l:1,c:1},{l:2,c:2}]); return true; }
  if (Math.abs(diag2) === 3) { destacar([{l:0,c:2},{l:1,c:1},{l:2,c:0}]); return true; }

  return false;
}

function destacar(celulas) {
  celulas.forEach(pos => {
    const cell = document.querySelector(`.cell[data-lin='${pos.l}'][data-col='${pos.c}']`);
    if (cell) cell.classList.add("vencedora");
  });
}

function desabilitarTabuleiro() {
  document.querySelectorAll(".cell").forEach(cell => cell.removeEventListener("click", jogar));
}

function reiniciar() {
  inicia();
}



if(typeof navigator.serviceWorker !== 'undefined'){

  navigator.serviceWorker.register('pwabuilder-sw.js');

}

if ("setAppBadge" in navigator) {
  navigator.setAppBadge(1);

}

// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "pwabuilder-offline-page";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// TODO: replace the following with the correct offline fallback page i.e.: const offlineFallbackPage = "offline.html";
const offlineFallbackPage = "ToDo-replace-this-name.html";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.add(offlineFallbackPage))
  );
});

if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

workbox.routing.registerRoute(
  new RegExp('/*'),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: CACHE
  })
);

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preloadResp = await event.preloadResponse;

        if (preloadResp) {
          return preloadResp;
        }

        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {

        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
