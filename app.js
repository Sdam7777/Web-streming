let selectedAnime = null;
let selectedEpisode = null;
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  updateCatalogCount();
  document.getElementById("logoBtn").onclick = () => showCatalog();
  setupAutoResumeAndAutoNext();
});
function updateCatalogCount(){ const c=document.querySelector('.catalog-count'); if(c) c.textContent = `${catalog.length} Anime`; }
function renderCatalog() {
  const grid = document.getElementById("animeGrid");
  if (!grid) return;
  grid.innerHTML = "";
  catalog.forEach(item => {
    const card = document.createElement("div");
    card.className = "anime-card";
    card.onclick = () => openAnimeDetail(item.id);
    card.innerHTML = `
      <div class="card-poster">
        <img src="${item.poster}" alt="${item.title}" loading="lazy" onerror="this.onerror=null; this.src='poster.svg';">
      </div>
      <div class="card-content">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span>${item.type}</span>
          <span>${item.totalEp} Ep</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}
function openAnimeDetail(id) {
  selectedAnime = catalog.find(a => a.id === id);
  if (!selectedAnime) return;
  document.getElementById("animePoster").src = selectedAnime.poster;
  document.getElementById("animeTitle").textContent = selectedAnime.title;
  document.getElementById("animeType").textContent = selectedAnime.type;
  document.getElementById("animeStatus").textContent = selectedAnime.status;
  document.getElementById("animeEpCount").textContent = `${selectedAnime.totalEp} Episode`;
  document.getElementById("animeSynopsis").textContent = selectedAnime.synopsis;
  const container = document.getElementById("episodesCategoryContainer");
  container.innerHTML = "";
  (selectedAnime.categories||[]).forEach((cat) => {
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
      btn.innerHTML = `<div class="ep-name"><i class="fa-solid fa-play text-orange" style="margin-right: 8px;"></i> ${ep.title}</div><div class="ep-size">${ep.size}</div>`;
      epGrid.appendChild(btn);
    });
    sec.appendChild(epGrid);
    container.appendChild(sec);
  });
  switchView("detailView");
}
function playEpisode(ep) {
  selectedEpisode = ep;
  const player = document.getElementById("videoPlayer");
  const source = document.getElementById("videoSource");
  source.src = ep.url || (ep.urls&&ep.urls[0]);
  player.load();
  document.getElementById("currentEpisodeTitle").textContent = ep.title;
  document.getElementById("sizeBadge").textContent = ep.size;
  document.getElementById("downloadBtn").href = ep.url || (ep.urls&&ep.urls[0]);
  switchView("playerView");
}
function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(sec => { sec.classList.remove("active"); sec.classList.add("hidden"); });
  const a=document.getElementById(viewId); if(a){ a.classList.remove("hidden"); a.classList.add("active"); }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function showCatalog() { switchView("catalogView"); }
function showDetail() { if (selectedAnime) switchView("detailView"); else switchView("catalogView"); }
function filterCatalog() {
  const q=document.getElementById("searchInput").value.toLowerCase().trim();
  document.querySelectorAll(".anime-card").forEach(card => {
    const title=card.querySelector(".card-title").textContent.toLowerCase();
    card.style.display= title.includes(q) ? "flex" : "none";
  });
}
function setupAutoResumeAndAutoNext(){}
