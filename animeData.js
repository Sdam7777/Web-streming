/**
 * TARIAKI - Efficient, MAL rating, dashboard hemat kuota
 * Dashboard cuma load anime list (tanpa episodes 1000), episodes lazy saat buka detail
 */
const SUPABASE_URL_CATALOG = "https://lwxoafywdcxaantcixcu.supabase.co";
const SUPABASE_ANON_CATALOG = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eG9hZnl3ZGN4YWFudGNpeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDMwODEsImV4cCI6MjEwMzU3OTA4MX0.gDXLbkROBOoYUCb_ZwOBscteT9-VQsg0kDYpOPHuZTk";
let catalog = [
  {
    id: "prison-school",
    title: "Prison School (Uncensored - Sub Indo)",
    poster: "cover.webp",
    mal_image: "https://cdn.myanimelist.net/images/anime/12/76064l.jpg",
    type: "TV Series + OVA [Uncensored]",
    status: "Completed",
    totalEp: 13,
    synopsis: "Hachimitsu Private Academy...",
    score: 7.57, members: 630000, rank: 1500,
    categories: []
  },
  {
    id: "mato-seihei-no-slave",
    title: "Mato Seihei no Slave (Chained Soldier)",
    poster: "https://cdn.myanimelist.net/images/anime/1114/140805l.jpg",
    mal_image: "https://cdn.myanimelist.net/images/anime/1114/140805l.jpg",
    type: "TV Series",
    status: "Completed",
    totalEp: 12,
    synopsis: "Yuuki Wakura terjebak di dimensi Mato...",
    score: 6.88, members: 279438, rank: 5485,
    categories: []
  },
  {
    id: "mato-seihei-no-slave-s2",
    title: "Mato Seihei no Slave Season 2",
    poster: "https://cdn.myanimelist.net/images/anime/1027/147564l.jpg",
    mal_image: "https://cdn.myanimelist.net/images/anime/1027/147564l.jpg",
    type: "TV Series",
    status: "Completed",
    totalEp: 12,
    synopsis: "Season 2 Mato...",
    score: 6.95, members: 80000, rank: 4000,
    categories: []
  }
];

async function loadCatalogFromDB(){
  const cached = sessionStorage.getItem('tariaki_catalog_v2');
  if(cached){
    try{ const parsed=JSON.parse(cached); if(Array.isArray(parsed) && parsed.length>=3){ catalog = parsed; if(typeof renderCatalog==='function') renderCatalog(); updateCatalogCount(); return; } }catch(e){}
  }
  try{
    const r = await fetch(`${SUPABASE_URL_CATALOG}/rest/v1/anime?select=id,title,poster,mal_image,type,status,total_ep,synopsis,score,members,rank&order=created_at.desc&limit=20`, { headers:{ apikey: SUPABASE_ANON_CATALOG, Authorization: `Bearer ${SUPABASE_ANON_CATALOG}` }});
    const animes = await r.json();
    if(!Array.isArray(animes) || animes.length===0) {
      // fallback hardcode 3 tetap
      if(typeof renderCatalog==='function') renderCatalog();
      updateCatalogCount();
      return;
    }
    catalog = animes.map(a=>({
      id:a.id, title:a.title, poster:a.mal_image||a.poster, mal_image:a.mal_image, type:a.type, status:a.status, totalEp:a.total_ep, synopsis:a.synopsis,
      score:a.score, members:a.members, rank:a.rank,
      categories: [] // lazy hemat kuota
    }));
    sessionStorage.setItem('tariaki_catalog_v2', JSON.stringify(catalog));
    if(typeof renderCatalog==='function') renderCatalog();
    updateCatalogCount();
  }catch(e){ console.log('catalog DB fail',e); if(typeof renderCatalog==='function') renderCatalog(); updateCatalogCount(); }
}
function updateCatalogCount(){ const cnt=document.querySelector('.catalog-count'); if(cnt) cnt.textContent=`${catalog.length} Anime`; }

async function loadEpisodesForAnime(animeId){
  const item = catalog.find(c=>c.id===animeId);
  if(!item) return;
  if(item.categories && item.categories.length>0) return; // already loaded
  try{
    const r = await fetch(`${SUPABASE_URL_CATALOG}/rest/v1/episodes?anime_id=eq.${animeId}&select=*&order=episode_number.asc&limit=50`, { headers:{ apikey: SUPABASE_ANON_CATALOG, Authorization: `Bearer ${SUPABASE_ANON_CATALOG}` }});
    const eps = await r.json();
    const tv=[], ova=[];
    eps.forEach(e=>{
      const obj={ id:e.episode_number, title:e.title, name:e.name, size:e.size, url:e.url, urls:e.urls||[e.url] };
      if(e.type_key==='TV') tv.push(obj); else ova.push(obj);
    });
    item.categories=[];
    if(tv.length) item.categories.push({ name:`TV Series (${tv.length} Episode)`, typeKey:'TV', icon:'fa-film', episodes: tv });
    if(ova.length) item.categories.push({ name:'Uncensored', typeKey:'OVA', icon:'fa-eye', episodes: ova });
  }catch(e){ console.log('episodes load fail',e); }
}
// jangan auto call di sini - biar app.js yang panggil setelah renderCatalog siap, cegah race
// loadCatalogFromDB() akan dipanggil dari app.js DOMContentLoaded
