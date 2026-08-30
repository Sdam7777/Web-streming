let selectedAnime = null;
let selectedEpisode = null;

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  document.getElementById("logoBtn").onclick = () => showCatalog();
  setupAutoResumeAndAutoNext();
  registerServiceWorker();
});

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        console.log('Tariaki Service Worker registered successfully with scope:', reg.scope);
      }).catch((err) => {
        console.warn('Service Worker registration failed:', err);
      });
    });
  }
}

function renderCatalog() {
  const grid = document.getElementById("animeGrid");
  const countBadge = document.getElementById("catalogCountText");
  if (!grid) return;
  grid.innerHTML = "";

  if (countBadge) {
    countBadge.textContent = `${catalog.length} Anime`;
  }

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

  const posterImg = document.getElementById("animePoster");
  posterImg.src = selectedAnime.poster;
  posterImg.onerror = () => { posterImg.src = "poster.svg"; };

  document.getElementById("animeTitle").textContent = selectedAnime.title;
  document.getElementById("animeType").textContent = selectedAnime.type;
  document.getElementById("animeStatus").textContent = selectedAnime.status;
  document.getElementById("animeEpCount").textContent = `${selectedAnime.totalEp} Episode`;
  document.getElementById("animeSynopsis").textContent = selectedAnime.synopsis;

  const container = document.getElementById("episodesCategoryContainer");
  container.innerHTML = "";

  selectedAnime.categories.forEach((cat) => {
    const sec = document.createElement("div");
    // Collapse all episode categories by default as requested by user
    sec.className = "episodes-category-group collapsed";

    const header = document.createElement("div");
    header.className = "category-header";
    header.innerHTML = `
      <span><i class="fa-solid ${cat.icon} text-orange" style="margin-right: 8px;"></i> ${cat.name}</span>
      <i class="fa-solid fa-chevron-down chevron-icon"></i>
    `;

    // Collapsible toggle handler
    header.onclick = () => {
      sec.classList.toggle("collapsed");
    };

    sec.appendChild(header);

    const epGrid = document.createElement("div");
    epGrid.className = "episodes-grid";

    cat.episodes.forEach(ep => {
      const btn = document.createElement("div");
      btn.className = "ep-button";
      btn.onclick = () => playEpisode(ep);
      btn.innerHTML = `
        <div class="ep-name">
          <i class="fa-solid fa-play text-orange" style="margin-right: 8px;"></i> ${ep.title}
        </div>
        <div class="ep-size">${ep.size}</div>
      `;
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
  const titleEl = document.getElementById("currentEpisodeTitle");
  const sizeBadge = document.getElementById("sizeBadge");
  const downloadBtn = document.getElementById("downloadBtn");

  source.src = ep.url;
  player.load();

  // Saved progress resume via CacheManager (TTL 7 days = 604800s)
  const savedTime = appCache.get(`progress_${ep.name}`);
  if (savedTime) {
    player.addEventListener('loadedmetadata', () => {
      player.currentTime = parseFloat(savedTime);
    }, { once: true });
  }

  titleEl.textContent = ep.title;
  sizeBadge.textContent = ep.size;
  downloadBtn.href = ep.url;
  downloadBtn.setAttribute("download", ep.name);

  // Sync player episode dropdown & nav buttons
  updatePlayerEpisodeControls();

  fetchEpisodeViews(ep.name);
  switchView("playerView");
}

function getAllEpisodesFlat() {
  if (!selectedAnime) return [];
  const flat = [];
  selectedAnime.categories.forEach(cat => {
    cat.episodes.forEach(ep => {
      flat.push({ ...ep, categoryType: cat.typeKey });
    });
  });
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
    if (selectedEpisode && selectedEpisode.name === ep.name) {
      opt.selected = true;
      currentIndex = idx;
    }
    select.appendChild(opt);
  });

  if (prevBtn) {
    prevBtn.disabled = currentIndex <= 0;
  }
  if (nextBtn) {
    nextBtn.disabled = currentIndex === -1 || currentIndex >= episodes.length - 1;
  }
}

function onPlayerSelectChange(selectEl) {
  const selectedName = selectEl.value;
  const episodes = getAllEpisodesFlat();
  const targetEp = episodes.find(e => e.name === selectedName);
  if (targetEp) {
    playEpisode(targetEp);
  }
}

function playPrevEpisode() {
  const episodes = getAllEpisodesFlat();
  if (!selectedEpisode) return;
  const idx = episodes.findIndex(e => e.name === selectedEpisode.name);
  if (idx > 0) {
    playEpisode(episodes[idx - 1]);
  }
}

function playNextEpisode() {
  const episodes = getAllEpisodesFlat();
  if (!selectedEpisode) return;
  const idx = episodes.findIndex(e => e.name === selectedEpisode.name);

  if (idx >= 0 && idx < episodes.length - 1) {
    const currentEp = episodes[idx];
    const nextEp = episodes[idx + 1];

    // Check if transitioning from TV Series END to OVA
    if (currentEp.categoryType === "TV" && nextEp.categoryType === "OVA") {
      openOvaModal();
    } else {
      playEpisode(nextEp);
    }
  }
}

function openOvaModal() {
  const modal = document.getElementById("ovaPromptModal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeOvaModal() {
  const modal = document.getElementById("ovaPromptModal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

function confirmPlayOva() {
  closeOvaModal();
  const episodes = getAllEpisodesFlat();
  const ovaEp = episodes.find(e => e.categoryType === "OVA");
  if (ovaEp) {
    playEpisode(ovaEp);
  }
}

function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
    sec.classList.add("hidden");
  });
  const activeSec = document.getElementById(viewId);
  if (activeSec) {
    activeSec.classList.remove("hidden");
    activeSec.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showCatalog() {
  switchView("catalogView");
}

function showDetail() {
  if (selectedAnime) {
    switchView("detailView");
  } else {
    switchView("catalogView");
  }
}

function filterCatalog() {
  const query = document.getElementById("searchInput").value.toLowerCase().trim();
  const cards = document.querySelectorAll(".anime-card");
  cards.forEach(card => {
    const title = card.querySelector(".card-title").textContent.toLowerCase();
    if (title.includes(query)) {
      card.style.display = "flex";
    } else {
      card.style.display = "none";
    }
  });
}

function setupAutoResumeAndAutoNext() {
  const player = document.getElementById("videoPlayer");
  if (!player) return;

  player.ontimeupdate = () => {
    if (selectedEpisode && player.duration && player.currentTime > 5) {
      // Save progress with 7-day TTL (604800s) using CacheManager
      appCache.set(`progress_${selectedEpisode.name}`, player.currentTime, 604800);
    }
  };

  // Auto-next playback handler
  player.onended = () => {
    playNextEpisode();
  };
}

async function fetchEpisodeViews(epName) {
  const viewText = document.getElementById("viewCountText");
  if (!viewText) return;

  const cacheKey = `view_${epName}`;
  const cachedViews = appCache.get(cacheKey);

  if (cachedViews !== null) {
    viewText.textContent = cachedViews;
    return;
  }

  try {
    const res = await fetch(`/api/views?episode=${encodeURIComponent(epName)}`);
    const data = await res.json();
    const count = data.views || "1";
    viewText.textContent = count;
    // Cache for 30 minutes (1800s)
    appCache.set(cacheKey, count, 1800);
  } catch (e) {
    viewText.textContent = "1";
  }
}
