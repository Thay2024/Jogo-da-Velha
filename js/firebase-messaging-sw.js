// This is the service worker with the combined offline experience (Offline page + Offline copy of pages)

const CACHE = "pwabuilder-offline-page";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAX3v0UTgBvmNSAJ7quOSsOkt_x2KLJprc",
  authDomain: "notifq-pwa.firebaseapp.com",
  projectId: "notifq-pwa",
  storageBucket: "notifq-pwa.firebasestorage.app",
  messagingSenderId: "1059584773060",
  appId: "1:1059584773060:web:0361e047071511fef2f291",
  measurementId: "G-W1JG5F4RV0"
};

const app = initializeApp(firebaseConfig);
const messaging = firebaseConfig.messaging();

messaging.onBackgroundMessage((ms) => {
  console.log("[firebase-messaging-sw.js] Mensagem recebida ", ms);
  const notificacaoTitulo = ms.notification.title;
  const notificacaoOpcao = {
    body: ms.notification.body,
    icon: "/velha.png"
   
  }
  self.registration.showNotification(notificacaoTitulo, notificacaoOpcao);

});


self.addEventListener("push", (event) => {
  event.waitUntil(self.registration.showNotification("Acesse agora as promoções", {
body: "Corpo da notificação",
icon: "icon.png",})
);
});


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