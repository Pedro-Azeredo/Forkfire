"use strict";

// Um Service Worker se comporta como um servidor proxy situado entre o navegador, uma aplicação web, e a rede 
// (quando esta estiver disponível). Eles servem, dentre outras coisas, para possibilitar a criação de experiências 
// OFFLINES eficientes, interceptando requisições de rede (agindo adequadamente de acordo com o status atual da conexão)  
// e atualizar os assets que residem no servidor. 


const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/manifest.json",
  "../viewer",
  "../utils",
  "../controller",
  "../config",
  "../assets"
];

//--------------------------------------------------------------------------------//

// 'self' é equivalente ao window.self (logo se refere à janela do navegador) e é usado somente em navegadores 
//
// Estamos associando um Listener ao evento 'install'. Se o evento ocorrer, o código será executado.
self.addEventListener("install", evt =>  {
  console.log("[App]Instalação");
  // 'caches' é uma variável global que retorna o CacheStorage do contexto atual.
  // 'caches.keys' retorna uma Promise que retornará um array com o nome de todos objetos armazenados no cache
  caches.keys().then(keyList => {
    return Promise.all(
      // O parâmetro passado para keyList é um array de objetos Promise. Quando todas as promises estiverem fulfilled, Promise.all retornará 
      keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log("[App] Removendo cache antigo", key);
          return caches.delete(key);
        }
      })
    );
  });

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[App] Pré-caching dos arquivos ", cache);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//--------------------------------------------------------------------------------//

self.addEventListener("activate", evt => {
  console.log("[App] Activate");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[App] Removendo cache antigo", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

//--------------------------------------------------------------------------------//

self.addEventListener('fetch', event => {
  console.log('evento fetch', event)
  //event.respondWith(
  //  caches.match(event.request) // check if the request has already been cached
  //  .then(cached => cached || fetch(event.request)) // otherwise request network
  //);
});