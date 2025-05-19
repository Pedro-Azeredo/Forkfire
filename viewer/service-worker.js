"use strict";

const CACHE_NAME = "static-cache-v3";
const DATA_CACHE_NAME = "data-cache-v2";

// Lista EXPLÍCITA de todos os arquivos estáticos para cache
const FILES_TO_CACHE = [
  // HTML
  "home.html",
  "index.html",
  
  // CSS
  "forkfire/viewer/static/nav.css",
  "forkfire/viewer/static/card.css",
  "forkfire/viewer/static/categoria.css",
  "forkfire/viewer/static/style.css",
  "forkfire/viewer/static/receita_detalhada.css",
  "forkfire/viewer/static/avaliacao.css",
  
  // JavaScript
  "firebase-init.js",
  "../controller/authController.js",
  "../controller/receitasController.js",
  "../controller/usuarioController.js",
  "../utils/authVerification.js",
  "../utils/utils.js",
  
  // Imagens e ícones
  "../forkfire/assets/images/favicon.ico",
  "../forkfire/assets/images/gif1440.gif",
  "../forkfire/assets/images/logo_branca_forkfire.png",
  
  // Imagens de categorias (adicione TODAS que você usa)
  "/forkfire/assets/images/categorias/todos-min.png",
  "/forkfire/assets/images/categorias/aperitivo-min.png",
  "/forkfire/assets/images/categorias/bebidas-min.png",
  "/forkfire/assets/images/categorias/bolos-min.png",
  "/forkfire/assets/images/categorias/carnes-min.png",
  "/forkfire/assets/images/categorias/comida_arabe-min.png",
  "/forkfire/assets/images/categorias/comida_asiatica-min.png",
  "/forkfire/assets/images/categorias/comida_mexicana-min.png",
  "/forkfire/assets/images/categorias/doces-min.png",
  "/forkfire/assets/images/categorias/gluten_free-min.png",
  "/forkfire/assets/images/categorias/lanches-min.png",
  "/forkfire/assets/images/categorias/low_carb-min.png",
  "/forkfire/assets/images/categorias/massas-min.png",
  "/forkfire/assets/images/categorias/paes-min.png",
  "/forkfire/assets/images/categorias/saladas-min.png",
  "/forkfire/assets/images/categorias/salgados-min.png",
  "/forkfire/assets/images/categorias/sobremesas-min.png",
  "/forkfire/assets/images/categorias/sopas-min.png",
  "/forkfire/assets/images/categorias/vegano-min.png",
  "/forkfire/assets/images/categorias/vegetariano-min.png"
];


self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' && 
      event.request.url.endsWith('/forkfire/')) {
    event.respondWith(
      Response.redirect('/forkfire/viewer/index.html')
    );
    return;
  }
});

self.addEventListener("install", evt => {
  console.log("[Service Worker] Instalando");
  
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("[Service Worker] Pré-cache de arquivos estáticos");
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", evt => {
  console.log("[Service Worker] Ativando");
  
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[Service Worker] Removendo cache antigo", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

self.addEventListener("fetch", evt => {
  // Cache-first para arquivos estáticos
  if (evt.request.url.includes('/static/') || 
      evt.request.url.includes('/assets/')) {
    evt.respondWith(
      caches.match(evt.request)
        .then(cachedResponse => {
          return cachedResponse || fetch(evt.request);
        })
    );
    return;
  }
  
  // Network-first para dados dinâmicos (API, Firebase)
  if (evt.request.url.includes('/api/') || 
      evt.request.url.includes('firebaseio.com')) {
    evt.respondWith(
      fetch(evt.request)
        .then(response => {
          // Clona a resposta para armazenar no cache
          const responseClone = response.clone();
          caches.open(DATA_CACHE_NAME)
            .then(cache => cache.put(evt.request, responseClone));
          return response;
        })
        .catch(() => {
          return caches.match(evt.request);
        })
    );
    return;
  }
  
  // Fallback genérico
  evt.respondWith(
    fetch(evt.request)
      .catch(() => caches.match('/home.html')) // Fallback offline
  );
});