const CACHE='tariaki-v1';
const ASSETS=['/','/index.html','/styles.css','/app.js','/animeData.js','/poster.svg','/manifest.json'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e=>{
  if(e.request.url.includes('/api/') || e.request.url.includes('supabase') || e.request.url.includes('firebase')) return;
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{ caches.open(CACHE).then(c=>c.put(e.request,res.clone())); return res; })).catch(()=>caches.match('/index.html')));
});
