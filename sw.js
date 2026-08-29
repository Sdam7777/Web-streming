const CACHE='tariaki-v4-20250830d';
const ASSETS=['/','/index.html?v=20250830d','/styles.css?v=20250830d','/app.js?v=20250830d','/animeData.js?v=20250830d','/poster.svg','/manifest.json?v=20250830d'];
self.addEventListener('install', e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', e=>{
  if(e.request.url.includes('/api/') || e.request.url.includes('supabase') || e.request.url.includes('firebase')) return;
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request).then(res=>{ caches.open(CACHE).then(c=>c.put(e.request,res.clone())); return res; })).catch(()=>caches.match('/index.html')));
});
