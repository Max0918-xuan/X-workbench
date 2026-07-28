/* X工作台 · Service Worker v4 — Network-first strategy */
const CACHE='xwb-v4';

/* Only cache critical static files, network-first so updates always come through */
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll([
      './',
      './index.html',
      './styles.css',
      './app.js',
      './manifest.json',
      './icon-192.png',
      './icon-512.png'
    ]).catch(()=>{}))
  );
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  /* Network-first: always try network, fall back to cache */
  e.respondWith(
    fetch(e.request).then(res=>{
      /* Cache a fresh copy on success */
      if(res.ok&&res.type==='basic'){
        const clone=res.clone();
        caches.open(CACHE).then(c=>c.put(e.request,clone));
      }
      return res;
    }).catch(()=>{
      /* Offline: serve from cache */
      return caches.match(e.request).then(cached=>cached||caches.match('./'));
    })
  );
});
