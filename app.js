const episodes = [
  {
    "id": 1,
    "title": "Prison School - Episode 01",
    "name": "Prison_School_01.mkv",
    "size": "113.59 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_01.mkv",
    "isOva": false
  },
  {
    "id": 2,
    "title": "Prison School - Episode 02",
    "name": "Prison_School_02.mkv",
    "size": "109.94 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_02.mkv",
    "isOva": false
  },
  {
    "id": 3,
    "title": "Prison School - Episode 03",
    "name": "Prison_School_03.mkv",
    "size": "108.78 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_03.mkv",
    "isOva": false
  },
  {
    "id": 4,
    "title": "Prison School - Episode 04",
    "name": "Prison_School_04.mkv",
    "size": "110.26 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_04.mkv",
    "isOva": false
  },
  {
    "id": 5,
    "title": "Prison School - Episode 05",
    "name": "Prison_School_05.mkv",
    "size": "83.43 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_05.mkv",
    "isOva": false
  },
  {
    "id": 6,
    "title": "Prison School - Episode 06",
    "name": "Prison_School_06.mkv",
    "size": "97.43 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_06.mkv",
    "isOva": false
  },
  {
    "id": 7,
    "title": "Prison School - Episode 07",
    "name": "Prison_School_07.mkv",
    "size": "108.20 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_07.mkv",
    "isOva": false
  },
  {
    "id": 8,
    "title": "Prison School - Episode 08",
    "name": "Prison_School_08.mkv",
    "size": "98.18 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_08.mkv",
    "isOva": false
  },
  {
    "id": 9,
    "title": "Prison School - Episode 09",
    "name": "Prison_School_09.mkv",
    "size": "110.35 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_09.mkv",
    "isOva": false
  },
  {
    "id": 10,
    "title": "Prison School - Episode 10",
    "name": "Prison_School_10.mkv",
    "size": "104.33 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_10.mkv",
    "isOva": false
  },
  {
    "id": 11,
    "title": "Prison School - Episode 11",
    "name": "Prison_School_11.mkv",
    "size": "97.01 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_11.mkv",
    "isOva": false
  },
  {
    "id": 12,
    "title": "Prison School - Episode 12 (END)",
    "name": "Prison_School_12_END.mkv",
    "size": "110.16 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_12_END.mkv",
    "isOva": false
  },
  {
    "id": 13,
    "title": "Prison School - OVA 1",
    "name": "Prison_School_OVA1.mkv",
    "size": "80.33 MB",
    "url": "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_OVA1.mkv",
    "isOva": true
  }
];

let activeIndex = 0;
let filteredEpisodes = [...episodes];

document.addEventListener("DOMContentLoaded", () => {
    renderEpisodesList();
    loadEpisode(activeIndex);
    setupAutoResume();
});

function renderEpisodesList() {
    const listContainer = document.getElementById("episodesList");
    const epCountEl = document.getElementById("epCount");

    listContainer.innerHTML = "";
    epCountEl.textContent = `${filteredEpisodes.length} Episode`;

    if (filteredEpisodes.length === 0) {
        listContainer.innerHTML = `<div style="text-align:center; padding: 24px; color: var(--text-muted);">Episode tidak ditemukan</div>`;
        return;
    }

    filteredEpisodes.forEach((ep) => {
        const originalIndex = episodes.findIndex(e => e.id === ep.id);
        const isActive = originalIndex === activeIndex;

        const item = document.createElement("div");
        item.className = `episode-item ${isActive ? 'active' : ''}`;
        item.onclick = () => selectEpisode(originalIndex);

        item.innerHTML = `
            <div>
                <div class="episode-title">
                    ${ep.title}
                    ${ep.isOva ? '<span class="badge-ova">OVA</span>' : ''}
                </div>
                <div class="episode-meta">Size: ${ep.size}</div>
            </div>
            <i class="fa-solid ${isActive ? 'fa-circle-play' : 'fa-play'}" style="color: ${isActive ? 'var(--primary-orange)' : 'var(--text-muted)'}"></i>
        `;

        listContainer.appendChild(item);
    });
}

function selectEpisode(index) {
    activeIndex = index;
    renderEpisodesList();
    loadEpisode(index);

    if (window.innerWidth <= 992) {
        document.querySelector('.player-section').scrollIntoView({ behavior: 'smooth' });
    }
}

function loadEpisode(index) {
    const ep = episodes[index];
    const player = document.getElementById("videoPlayer");
    const source = document.getElementById("videoSource");
    const titleEl = document.getElementById("currentEpisodeTitle");
    const sizeBadge = document.getElementById("sizeBadge");
    const downloadBtn = document.getElementById("downloadBtn");

    source.src = ep.url;
    player.load();

    // Auto resume progress from LocalStorage/Supabase cache
    const savedTime = localStorage.getItem(`tariaki_progress_${ep.name}`);
    if (savedTime) {
        player.currentTime = parseFloat(savedTime);
    }

    titleEl.textContent = ep.title;
    sizeBadge.textContent = ep.size;
    downloadBtn.href = ep.url;
    downloadBtn.setAttribute("download", ep.name);

    // Fetch and increment views count using Upstash Redis
    fetchEpisodeViews(ep.name);
}

function setupAutoResume() {
    const player = document.getElementById("videoPlayer");
    player.ontimeupdate = () => {
        if (player.duration && player.currentTime > 5) {
            const ep = episodes[activeIndex];
            localStorage.setItem(`tariaki_progress_${ep.name}`, player.currentTime);
        }
    };
}

async function fetchEpisodeViews(epName) {
    const viewText = document.getElementById("viewCountText");
    try {
        // Call serverless API proxy to safely update views without exposing Redis API secrets
        const res = await fetch(`/api/views?episode=${encodeURIComponent(epName)}`);
        const data = await res.json();
        viewText.textContent = data.views || "1";
    } catch (e) {
        viewText.textContent = "1";
    }
}

function filterEpisodes() {
    const query = document.getElementById("searchInput").value.toLowerCase().trim();
    filteredEpisodes = episodes.filter(ep =>
        ep.title.toLowerCase().includes(query) ||
        ep.name.toLowerCase().includes(query)
    );
    renderEpisodesList();
}
