const catalog = [
  {
    id: "prison-school",
    title: "Prison School (Sub Indo)",
    poster: "cover.jpg",
    type: "TV Series + OVA",
    status: "Completed",
    totalEp: 13,
    synopsis: "Hachimitsu Private Academy, institusi boarding school putri berasrama paling bergengsi di Tokyo, memutuskan untuk mengizinkan murid laki-laki masuk pertama kali dalam sejarah sekolah tersebut. Lima anak laki-laki diterima, tetapi mereka tak sadar akan takdir ekstrem yang menanti mereka di bawah pengawasan ketat Dewan Siswa Bayangan (Underground Student Council).",
    episodes: [
      { id: 1, title: "Prison School - Episode 01", name: "Prison_School_01.mkv", size: "113.59 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_01.mkv", isOva: false },
      { id: 2, title: "Prison School - Episode 02", name: "Prison_School_02.mkv", size: "109.94 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_02.mkv", isOva: false },
      { id: 3, title: "Prison School - Episode 03", name: "Prison_School_03.mkv", size: "108.78 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_03.mkv", isOva: false },
      { id: 4, title: "Prison School - Episode 04", name: "Prison_School_04.mkv", size: "110.26 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_04.mkv", isOva: false },
      { id: 5, title: "Prison School - Episode 05", name: "Prison_School_05.mkv", size: "83.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_05.mkv", isOva: false },
      { id: 6, title: "Prison School - Episode 06", name: "Prison_School_06.mkv", size: "97.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_06.mkv", isOva: false },
      { id: 7, title: "Prison School - Episode 07", name: "Prison_School_07.mkv", size: "108.20 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_07.mkv", isOva: false },
      { id: 8, title: "Prison School - Episode 08", name: "Prison_School_08.mkv", size: "98.18 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_08.mkv", isOva: false },
      { id: 9, title: "Prison School - Episode 09", name: "Prison_School_09.mkv", size: "110.35 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_09.mkv", isOva: false },
      { id: 10, title: "Prison School - Episode 10", name: "Prison_School_10.mkv", size: "104.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_10.mkv", isOva: false },
      { id: 11, title: "Prison School - Episode 11", name: "Prison_School_11.mkv", size: "97.01 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_11.mkv", isOva: false },
      { id: 12, title: "Prison School - Episode 12 (END)", name: "Prison_School_12_END.mkv", size: "110.16 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_12_END.mkv", isOva: false },
      { id: 13, title: "Prison School - OVA 1", name: "Prison_School_OVA1.mkv", size: "80.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_OVA1.mkv", isOva: true }
    ]
  }
];

let selectedAnime = null;
let selectedEpisode = null;

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  document.getElementById("logoBtn").onclick = () => showCatalog();
  setupAutoResume();
});

function renderCatalog() {
  const grid = document.getElementById("animeGrid");
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

  const posterImg = document.getElementById("animePoster");
  posterImg.src = selectedAnime.poster;
  posterImg.onerror = () => { posterImg.src = "poster.svg"; };

  document.getElementById("animeTitle").textContent = selectedAnime.title;
  document.getElementById("animeType").textContent = selectedAnime.type;
  document.getElementById("animeStatus").textContent = selectedAnime.status;
  document.getElementById("animeEpCount").textContent = `${selectedAnime.totalEp} Episode`;
  document.getElementById("animeSynopsis").textContent = selectedAnime.synopsis;

  const epGrid = document.getElementById("episodesGrid");
  epGrid.innerHTML = "";

  selectedAnime.episodes.forEach(ep => {
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

  // Saved time resume
  const savedTime = localStorage.getItem(`tariaki_progress_${ep.name}`);
  if (savedTime) {
    player.currentTime = parseFloat(savedTime);
  }

  titleEl.textContent = ep.title;
  sizeBadge.textContent = ep.size;
  downloadBtn.href = ep.url;
  downloadBtn.setAttribute("download", ep.name);

  fetchEpisodeViews(ep.name);
  switchView("playerView");
}

function switchView(viewId) {
  document.querySelectorAll(".view-section").forEach(sec => {
    sec.classList.remove("active");
    sec.classList.add("hidden");
  });
  const activeSec = document.getElementById(viewId);
  activeSec.classList.remove("hidden");
  activeSec.classList.add("active");
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

function setupAutoResume() {
  const player = document.getElementById("videoPlayer");
  player.ontimeupdate = () => {
    if (selectedEpisode && player.duration && player.currentTime > 5) {
      localStorage.setItem(`tariaki_progress_${selectedEpisode.name}`, player.currentTime);
    }
  };
}

async function fetchEpisodeViews(epName) {
  const viewText = document.getElementById("viewCountText");
  try {
    const res = await fetch(`/api/views?episode=${encodeURIComponent(epName)}`);
    const data = await res.json();
    viewText.textContent = data.views || "1";
  } catch (e) {
    viewText.textContent = "1";
  }
}
