let selectedAnime = null;
let selectedEpisode = null;
const SUPABASE_URL = "https://lwxoafywdcxaantcixcu.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eG9hZnl3ZGN4YWFudGNpeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDMwODEsImV4cCI6MjEwMzU3OTA4MX0.gDXLbkROBOoYUCb_ZwOBscteT9-VQsg0kDYpOPHuZTk";
function getUser(){ try{ return JSON.parse(localStorage.getItem('tariaki_user')||'null'); }catch(e){return null;} }

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  document.getElementById("logoBtn").onclick = () => showCatalog();
  setupAutoResumeAndAutoNext();
  setupPlayerEnhancements();
  loadContinueWatching();
  loadFavorites();
  setupSearch();
  if('serviceWorker' in navigator){ navigator.serviceWorker.register('/sw.js').catch(()=>{}); }
});

function renderCatalog() {
  const grid = document.getElementById("animeGrid");
  if (!grid) return;
  grid.innerHTML = "";
  catalog.forEach(item => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.dataset.animeId = item.id;
    card.dataset.status = item.status;
    card.dataset.type = item.type;
    card.innerHTML = `
      <div class="card-poster">
        <img src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='poster.svg';">
        <button class="fav-btn" onclick="event.stopPropagation(); toggleFavorite('${item.id}')" title="Favorit"><i class="fa-solid fa-heart"></i></button>
      </div>
      <div class="card-content">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span>${item.type}</span>
          <span>${item.totalEp} Ep</span>
        </div>
      </div>
    `;
    card.onclick = () => openAnimeDetail(item.id);
    grid.appendChild(card);
  });
  updateFavUI();
}

function openAnimeDetail(id) {
  selectedAnime = catalog.find(a => a.id === id);
  if (!selectedAnime) return;
  const posterImg = document.getElementById("animePoster");
  posterImg.src = selectedAnime.poster;
  posterImg.onerror = () => { posterImg.src = "poster.svg"; };
  document.getElementById("animeTitle").textContent = selectedAnime.title;
  document.getElementById("animeType").textContent = selectedAnime.type;
  document.getElementById("animeStatus").textContent = selectedAnime.status;
  document.getElementById("animeEpCount").textContent = `${selectedAnime.totalEp} Episode`;
  document.getElementById("animeSynopsis").textContent = selectedAnime.synopsis;
  const favDetail = document.getElementById('detailFavBtn');
  if(favDetail) favDetail.innerHTML = `<i class="fa-solid fa-heart"></i> ${(JSON.parse(localStorage.getItem('tariaki_favs')||'[]').includes(id)?'Hapus Favorit':'Favorit')}`;
  const container = document.getElementById("episodesCategoryContainer");
  container.innerHTML = "";
  selectedAnime.categories.forEach((cat) => {
    const sec = document.createElement("div");
    sec.className = "episodes-category-group collapsed";
    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `<span><i class="fa-solid ${cat.icon} text-orange" style="margin-right: 8px;"></i> ${cat.name}</span><i class="fa-solid fa-chevron-down chevron-icon"></i>`;
    header.onclick = () => { sec.classList.toggle("collapsed"); };
    sec.appendChild(header);
    const epGrid = document.createElement("div");
    epGrid.className = "episodes-grid";
    cat.episodes.forEach(ep => {
      const btn = document.createElement("div");
      btn.className = "ep-button";
      btn.onclick = () => playEpisode(ep);
      const prog = localStorage.getItem(`tariaki_progress_${ep.name}`);
      const pct = prog ? Math.min(100, Math.round((parseFloat(prog)/600)*100)) : 0;
      btn.innerHTML = `<div class="ep-name"><i class="fa-solid fa-play text-orange" style="margin-right: 8px;"></i> ${ep.title}</div><div class="ep-size">${ep.size}${pct>5?` • ${pct}%`:''}</div>`;
      epGrid.appendChild(btn);
    });
    sec.appendChild(epGrid);
    container.appendChild(sec);
  });
  switchView("detailView");
}

let hlsInstance=null;
function getEpisodeUrls(ep){ return ep.urls && Array.isArray(ep.urls) && ep.urls.length ? ep.urls : [ep.url]; }
function getQualityUrls(ep){
  // multi-quality: 1080p feel even on slow internet - upscale 480p to 1080p container
  const base = getEpisodeUrls(ep);
  // For now all qualities point to same file (mock), but logic ready for real HLS m3u8
  return { auto: base[0], '1080': base[0], '720': base[0], '480': base[0], hls: base[0].replace('.mkv','.m3u8') };
}
function playEpisode(ep) {
  selectedEpisode = ep;
  const player = document.getElementById("videoPlayer");
  const source = document.getElementById("videoSource");
  const titleEl = document.getElementById("currentEpisodeTitle");
  const sizeBadge = document.getElementById("sizeBadge");
  const downloadBtn = document.getElementById("downloadBtn");
  const urls = getEpisodeUrls(ep);
  let urlIdx = 0;
  // HLS adaptive if hls.js and m3u8 exists
  const qUrls = getQualityUrls(ep);
  const qualitySel = document.getElementById('qualitySelect')?.value || 'auto';
  let targetUrl = qualitySel==='auto' ? qUrls.auto : (qUrls[qualitySel]||qUrls.auto);
  // slow internet tetap 1080p feel: auto pilih 480p tapi upscale
  const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const effective = conn?.effectiveType || '4g';
  const isSlow = effective.includes('2g') || effective==='slow-2g' || conn?.downlink < 1.5;
  if(qualitySel==='auto' && isSlow){
    targetUrl = qUrls['480'];
    document.getElementById('networkInfo').textContent = `Jaringan ${effective} • hemat tapi tetap 1080p feel`;
    player.style.filter = 'contrast(1.07) saturate(1.1) brightness(1.02)';
  } else {
    document.getElementById('networkInfo').textContent = isSlow ? `Jaringan ${effective}` : '';
    player.style.filter = 'contrast(1.05) saturate(1.08)';
  }
  document.getElementById('qualityBadge').textContent = (qualitySel==='auto' ? '1080p • Auto' : qualitySel+'p') + (isSlow && qualitySel==='auto' ? ' (hemat)' : '');
  // Use HLS if available and url is m3u8
  if(window.Hls && window.Hls.isSupported() && targetUrl.endsWith('.m3u8')){
    if(hlsInstance){ try{ hlsInstance.destroy(); }catch(e){} }
    hlsInstance = new Hls({ capLevelToPlayerSize:true, maxBufferLength:30 });
    hlsInstance.loadSource(targetUrl);
    hlsInstance.attachMedia(player);
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, ()=> player.play().catch(()=>{}));
    hlsInstance.on(Hls.Events.ERROR, (e, data)=>{
      if(data.fatal){
        if(urlIdx < urls.length-1){ urlIdx++; source.src = urls[urlIdx]; player.load(); }
      }
    });
  } else {
    if(hlsInstance){ try{ hlsInstance.destroy(); }catch(e){} hlsInstance=null; }
    source.src = targetUrl;
    player.load();
    player.onerror = () => {
      if(urlIdx < urls.length-1){ urlIdx++; source.src = urls[urlIdx]; player.load(); player.play().catch(()=>{}); }
    };
  }
  const savedTime = localStorage.getItem(`tariaki_progress_${ep.name}`);
  if (savedTime) {
    player.addEventListener('loadedmetadata', () => { player.currentTime = parseFloat(savedTime); }, { once: true });
  }
  titleEl.textContent = ep.title;
  sizeBadge.textContent = ep.size;
  downloadBtn.href = ep.url;
  downloadBtn.setAttribute("download", ep.name);
  updatePlayerEpisodeControls();
  fetchEpisodeViews(ep.name);
  loadComments(ep.name);
  loadLikes(ep.name);
  switchView("playerView");
}

function getAllEpisodesFlat() {
  if (!selectedAnime) return [];
  const flat = [];
  selectedAnime.categories.forEach(cat => { cat.episodes.forEach(ep => { flat.push({ ...ep, categoryType: cat.typeKey }); }); });
  return flat;
}

function updatePlayerEpisodeControls() {
  const select = document.getElementById("playerEpisodeSelect");
  const prevBtn = document.getElementById("prevEpBtn");
  const nextBtn = document.getElementById("nextEpBtn");
  if (!select) return;
  const episodes = getAllEpisodesFlat();
  select.innerHTML = "";
  let currentIndex = -1;
  episodes.forEach((ep, idx) => {
    const opt = document.createElement("option");
    opt.value = ep.name;
    opt.textContent = ep.title;
    if (selectedEpisode && selectedEpisode.name === ep.name) { opt.selected = true; currentIndex = idx; }
    select.appendChild(opt);
  });
  if (prevBtn) prevBtn.disabled = currentIndex <= 0;
  if (nextBtn) nextBtn.disabled = currentIndex === -1 || currentIndex >= episodes.length - 1;
}

function onPlayerSelectChange(selectEl) {
  const selectedName = selectEl.value;
  const episodes = getAllEpisodesFlat();
  const targetEp = episodes.find(e => e.name === selectedName);
  if (targetEp) playEpisode(targetEp);
}
function playPrevEpisode() {
  const episodes = getAllEpisodesFlat();
  if (!selectedEpisode) return;
  const idx = episodes.findIndex(e => e.name === selectedEpisode.name);
  if (idx > 0) playEpisode(episodes[idx - 1]);
}
function playNextEpisode() {
  const episodes = getAllEpisodesFlat();
  if (!selectedEpisode) return;
  const idx = episodes.findIndex(e => e.name === selectedEpisode.name);
  if (idx >= 0 && idx < episodes.length - 1) {
    const currentEp = episodes[idx];
    const nextEp = episodes[idx + 1];
    if (currentEp.categoryType === "TV" && nextEp.categoryType === "OVA") { openOvaModal(); } else { playEpisode(nextEp); }
  }
}
function openOvaModal() { const m=document.getElementById("ovaPromptModal"); if(m) m.classList.remove("hidden"); }
function closeOvaModal() { const m=document.getElementById("ovaPromptModal"); if(m) m.classList.add("hidden"); }
function confirmPlayOva() { closeOvaModal(); const eps=getAllEpisodesFlat(); const ova=eps.find(e=>e.categoryType==="OVA"); if(ova) playEpisode(ova); }
function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(sec => { sec.classList.remove("active"); sec.classList.add("hidden"); });
  const a=document.getElementById(viewId); if(a){ a.classList.remove("hidden"); a.classList.add("active"); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showCatalog() { switchView("catalogView"); loadContinueWatching(); }
function showDetail() { if (selectedAnime) switchView("detailView"); else switchView("catalogView"); }

// Search + filter real with debounce
let searchTimer=null;
function setupSearch(){
  const inp=document.getElementById('searchInput');
  if(!inp) return;
  inp.addEventListener('input', ()=>{
    clearTimeout(searchTimer);
    searchTimer=setTimeout(()=>filterCatalog(), 250);
  });
}
function filterCatalog() {
  const q=document.getElementById("searchInput").value.toLowerCase().trim();
  const statusFilter=document.getElementById('statusFilter')?.value || '';
  document.querySelectorAll(".anime-card").forEach(card => {
    const title=card.querySelector(".card-title").textContent.toLowerCase();
    const status=card.dataset.status || '';
    const okTitle=title.includes(q);
    const okStatus=!statusFilter || status===statusFilter;
    card.style.display=(okTitle&&okStatus)?"flex":"none";
  });
}

// Continue Watching
async function loadContinueWatching(){
  const u=getUser(); const box=document.getElementById('continueBox');
  if(!box) return;
  if(!u){ box.style.display='none'; return; }
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/watch_history?uid=eq.${u.uid}&order=updated_at.desc&limit=6`, {headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`}});
    const data=await r.json();
    if(!Array.isArray(data) || data.length===0){ box.style.display='none'; return; }
    box.style.display='block';
    const grid=document.getElementById('continueGrid');
    grid.innerHTML='';
    data.forEach(h=>{
      const ep=getAllEpisFromCatalog(h.episode_name);
      const pct=h.duration? Math.round((h.progress/h.duration)*100):0;
      const div=document.createElement('div');
      div.className='continue-card';
      div.onclick=()=>{ const target=ep; if(target) { selectedAnime=catalog.find(c=>c.id===h.anime_id)||catalog[0]; playEpisode(target); } };
      div.innerHTML=`<div class="continue-title">${h.episode_name}</div><div class="continue-bar"><div style="width:${pct}%"></div></div><div class="continue-pct">${pct}%</div>`;
      grid.appendChild(div);
    });
  }catch(e){ box.style.display='none'; }
}
function getAllEpisFromCatalog(name){
  for(const a of catalog){ for(const c of a.categories){ for(const e of c.episodes){ if(e.name===name) return {...e, animeId:a.id}; }}}
  return null;
}
async function syncWatchHistory(uid, animeId, epName, progress, duration){
  try{
    await fetch(`${SUPABASE_URL}/rest/v1/watch_history`, {method:'POST', headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`, 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates'}, body: JSON.stringify({uid, anime_id:animeId, episode_name:epName, progress, duration})});
  }catch(e){}
}

// Favorites
function toggleFavorite(animeId){
  const u=getUser();
  if(!u){ alert('Login dulu cuy'); return; }
  let favs=JSON.parse(localStorage.getItem('tariaki_favs')||'[]');
  const isFav=favs.includes(animeId);
  if(isFav) favs=favs.filter(x=>x!==animeId); else favs.push(animeId);
  localStorage.setItem('tariaki_favs', JSON.stringify(favs));
  updateFavUI();
  // sync supabase
  const method=isFav?'DELETE':'POST';
  const url=isFav?`${SUPABASE_URL}/rest/v1/favorites?uid=eq.${u.uid}&anime_id=eq.${animeId}`:`${SUPABASE_URL}/rest/v1/favorites`;
  fetch(url, {method, headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`, 'Content-Type':'application/json'}, body: method==='POST'?JSON.stringify({uid:u.uid, anime_id:animeId}):undefined}).catch(()=>{});
}
function updateFavUI(){
  const favs=JSON.parse(localStorage.getItem('tariaki_favs')||'[]');
  document.querySelectorAll('.fav-btn').forEach(btn=>{
    const card=btn.closest('.anime-card');
    const id=card?.dataset.animeId;
    if(id && favs.includes(id)) btn.classList.add('active'); else btn.classList.remove('active');
  });
}
async function loadFavorites(){
  const u=getUser(); if(!u) return;
  try{ const r=await fetch(`${SUPABASE_URL}/rest/v1/favorites?uid=eq.${u.uid}&select=anime_id`, {headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`}}); const data=await r.json(); if(Array.isArray(data)) localStorage.setItem('tariaki_favs', JSON.stringify(data.map(x=>x.anime_id))); updateFavUI(); }catch(e){}
}

// Comments
async function loadComments(epName){
  const list=document.getElementById('commentList'); if(!list) return;
  list.innerHTML='<div style="color:var(--text-muted);font-size:13px">Memuat komen...</div>';
  try{
    const r=await fetch(`${SUPABASE_URL}/rest/v1/comments?episode_name=eq.${encodeURIComponent(epName)}&order=created_at.desc&limit=20`, {headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`}});
    const data=await r.json();
    if(!Array.isArray(data) || data.length===0){ list.innerHTML='<div style="color:var(--text-muted);font-size:13px">Belum ada komen. Jadi yang pertama!</div>'; return; }
    list.innerHTML='';
    // fetch profiles for uids
    const uids=[...new Set(data.map(c=>c.uid))];
    let profiles={};
    try{ const rp=await fetch(`${SUPABASE_URL}/rest/v1/profiles?uid=in.(${uids.join(',')})&select=uid,display_name,avatar_url,avatar_type`, {headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`}}); const pdata=await rp.json(); pdata.forEach(p=>profiles[p.uid]=p); }catch(e){}
    data.forEach(c=>{
      const p=profiles[c.uid]||{display_name:'Wibu', avatar_url:'poster.svg'};
      const div=document.createElement('div'); div.className='comment-item';
      const isVideo=p.avatar_type==='video';
      div.innerHTML=`<div class="comment-head">${isVideo?`<video src="${p.avatar_url}" autoplay muted loop playsinline style="width:28px;height:28px;border-radius:50%;object-fit:cover"></video>`:`<img src="${p.avatar_url}" style="width:28px;height:28px;border-radius:50%">`} <b style="font-size:13px">${p.display_name}</b> <span style="color:var(--text-muted);font-size:11px">${new Date(c.created_at).toLocaleString('id-ID')}</span></div><div style="font-size:13px;margin-top:4px">${c.text}</div>`;
      list.appendChild(div);
    });
  }catch(e){ list.innerHTML='<div> Gagal load komen</div>'; }
}
async function postComment(){
  const u=getUser(); if(!u){ alert('Login dulu'); return; }
  const inp=document.getElementById('commentInput'); const text=inp.value.trim(); if(!text) return;
  if(!selectedEpisode){ alert('Pilih episode dulu'); return; }
  const animeId=selectedAnime?.id||'prison-school';
  await fetch(`${SUPABASE_URL}/rest/v1/comments`, {method:'POST', headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`, 'Content-Type':'application/json'}, body: JSON.stringify({uid:u.uid, anime_id:animeId, episode_name:selectedEpisode.name, text})});
  inp.value=''; loadComments(selectedEpisode.name);
}
window.postComment=postComment;

// Likes
async function loadLikes(epName){
  const el=document.getElementById('likeCount'); if(!el) return;
  try{ const r=await fetch(`${SUPABASE_URL}/rest/v1/ratings?episode_name=eq.${encodeURIComponent(epName)}&liked=eq.true&select=uid`, {headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`}}); const d=await r.json(); el.textContent=d.length; }catch(e){ el.textContent='0'; }
}
async function toggleLike(){
  const u=getUser(); if(!u){ alert('Login dulu'); return; }
  if(!selectedEpisode) return;
  const animeId=selectedAnime?.id||'prison-school';
  await fetch(`${SUPABASE_URL}/rest/v1/ratings`, {method:'POST', headers:{apikey:SUPABASE_ANON, Authorization:`Bearer ${SUPABASE_ANON}`, 'Content-Type':'application/json', Prefer:'resolution=merge-duplicates'}, body: JSON.stringify({uid:u.uid, anime_id:animeId, episode_name:selectedEpisode.name, liked:true})});
  loadLikes(selectedEpisode.name);
}
window.toggleLike=toggleLike;

// Player enhancements - double tap, PIP, overlay
function setupPlayerEnhancements(){
  const player=document.getElementById('videoPlayer');
  const wrapper=document.querySelector('.video-wrapper');
  if(!player||!wrapper) return;
  let lastTap=0;
  wrapper.addEventListener('click', (e)=>{
    const now=Date.now();
    if(now-lastTap<300){
      const rect=wrapper.getBoundingClientRect();
      const x=e.clientX-rect.left;
      if(x<rect.width/3) player.currentTime=Math.max(0, player.currentTime-10);
      else if(x>rect.width*2/3) player.currentTime=Math.min(player.duration, player.currentTime+10);
    }
    lastTap=now;
  });
  const pipBtn=document.getElementById('pipBtn');
  if(pipBtn){
    pipBtn.onclick=async()=>{ try{ if(document.pictureInPictureElement) await document.exitPictureInPicture(); else await player.requestPictureInPicture(); }catch(e){} };
  }
}

let lastSyncTime=0;
function setupAutoResumeAndAutoNext() {
  const player = document.getElementById("videoPlayer");
  if (!player) return;
  player.ontimeupdate = () => {
    if (selectedEpisode && player.duration && player.currentTime > 5) {
      localStorage.setItem(`tariaki_progress_${selectedEpisode.name}`, player.currentTime);
      const now=Date.now();
      if(now-lastSyncTime>15000){
        lastSyncTime=now;
        const u=getUser();
        if(u && selectedAnime) syncWatchHistory(u.uid, selectedAnime.id, selectedEpisode.name, player.currentTime, player.duration);
      }
    }
  };
  player.onended = () => { playNextEpisode(); };
}

async function fetchEpisodeViews(epName) {
  const viewText = document.getElementById("viewCountText");
  if (!viewText) return;
  const cacheKey = `tariaki_view_${epName}`;
  const cachedViews = sessionStorage.getItem(cacheKey);
  if (cachedViews) { viewText.textContent = cachedViews; return; }
  try {
    const res = await fetch(`/api/views?episode=${encodeURIComponent(epName)}`);
    const data = await res.json();
    const count = data.views || "1";
    viewText.textContent = count;
    sessionStorage.setItem(cacheKey, count);
  } catch (e) { viewText.textContent = "1"; }
}
function showProfilePage(){
  const p=JSON.parse(localStorage.getItem('tariaki_profile')||'null');
  const u=getUser();
  if(!u){ alert('Login dulu'); return; }
  document.getElementById('profilePageName').textContent=p?.display_name||u.name||u.email;
  document.getElementById('profilePageBio').textContent=p?.bio||'Belum ada bio';
  const av=document.getElementById('profilePageAvatar');
  av.innerHTML='';
  if(p?.avatar_type==='video' && p.avatar_url) av.innerHTML=`<video src="${p.avatar_url}" autoplay muted loop playsinline style="width:100%;height:100%;object-fit:cover"></video>`;
  else av.innerHTML=`<img src="${p?.avatar_url||'poster.svg'}" style="width:100%;height:100%;object-fit:cover">`;
  switchView('profileView');
}
window.showProfilePage=showProfilePage;
function onQualityChange(val){
  document.getElementById('qualityBadge').textContent = val==='auto' ? '1080p • Auto' : val+'p';
  if(selectedEpisode) playEpisode(selectedEpisode);
}
window.onQualityChange=onQualityChange;
