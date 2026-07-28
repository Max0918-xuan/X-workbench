/* X工作台 · Service Worker v3 */
const CACHE='xwb-v3';
const ASSETS=[
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS).catch(err=>{
      console.warn('SW: some assets failed to cache, continuing...',err);
    }))
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
  /* Only handle same-origin navigation and static assets */
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(cached=>{
      if(cached) return cached;
      return fetch(e.request).then(res=>{
        if(res.ok&&res.type==='basic'){
          const clone=res.clone();
          caches.open(CACHE).then(c=>c.put(e.request,clone));
        }
        return res;
      }).catch(()=>{
        /* Offline fallback: return cached index for navigation */
        if(e.request.mode==='navigate'){
          return caches.match('./index.html');
        }
      });
    })
  );
});
