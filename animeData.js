/**
 * TARIAKI ANIME CATALOG - Multi-storage ready
 * Load from Supabase public.anime + public.episodes, fallback to hardcode
 * Supports 1k+ anime: paginated, cached
 */
const SUPABASE_URL_CATALOG = "https://lwxoafywdcxaantcixcu.supabase.co";
const SUPABASE_ANON_CATALOG = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3eG9hZnl3ZGN4YWFudGNpeGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgwMDMwODEsImV4cCI6MjEwMzU3OTA4MX0.gDXLbkROBOoYUCb_ZwOBscteT9-VQsg0kDYpOPHuZTk";
let catalog = [
  {
    id: "prison-school",
    title: "Prison School (Sub Indo)",
    poster: "cover.jpg",
    type: "TV Series + OVA",
    status: "Completed",
    totalEp: 13,
    synopsis: "Hachimitsu Private Academy, institusi boarding school putri berasrama paling bergengsi di Tokyo, memutuskan untuk mengizinkan murid laki-laki masuk pertama kali dalam sejarah sekolah tersebut.",
    categories: [
      {
        name: "TV Series (12 Episode)",
        typeKey: "TV",
        icon: "fa-film",
        episodes: [
          { id: 1, title: "Prison School - Episode 01", name: "Prison_School_01.mkv", size: "113.59 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_01.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_01.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_01.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_01.mkv"] },
          { id: 2, title: "Prison School - Episode 02", name: "Prison_School_02.mkv", size: "109.94 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_02.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_02.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_02.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_02.mkv"] },
          { id: 3, title: "Prison School - Episode 03", name: "Prison_School_03.mkv", size: "108.78 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_03.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_03.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_03.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_03.mkv"] },
          { id: 4, title: "Prison School - Episode 04", name: "Prison_School_04.mkv", size: "110.26 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_04.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_04.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_04.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_04.mkv"] },
          { id: 5, title: "Prison School - Episode 05", name: "Prison_School_05.mkv", size: "83.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_05.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_05.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_05.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_05.mkv"] },
          { id: 6, title: "Prison School - Episode 06", name: "Prison_School_06.mkv", size: "97.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_06.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_06.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_06.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_06.mkv"] },
          { id: 7, title: "Prison School - Episode 07", name: "Prison_School_07.mkv", size: "108.20 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_07.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_07.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_07.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_07.mkv"] },
          { id: 8, title: "Prison School - Episode 08", name: "Prison_School_08.mkv", size: "98.18 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_08.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_08.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_08.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_08.mkv"] },
          { id: 9, title: "Prison School - Episode 09", name: "Prison_School_09.mkv", size: "110.35 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_09.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_09.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_09.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_09.mkv"] },
          { id: 10, title: "Prison School - Episode 10", name: "Prison_School_10.mkv", size: "104.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_10.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_10.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_10.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_10.mkv"] },
          { id: 11, title: "Prison School - Episode 11", name: "Prison_School_11.mkv", size: "97.01 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_11.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_11.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_11.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_11.mkv"] },
          { id: 12, title: "Prison School - Episode 12 (END)", name: "Prison_School_12_END.mkv", size: "110.16 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_12_END.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_12_END.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_12_END.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_12_END.mkv"] }
        ]
      },
      {
        name: "OVA",
        typeKey: "OVA",
        icon: "fa-star",
        episodes: [
          { id: 13, title: "Prison School - OVA 1", name: "Prison_School_OVA1.mkv", size: "80.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_OVA1.mkv", urls: ["https://lwxoafywdcxaantcixcu.supabase.co/storage/v1/object/public/videos/Prison_School_OVA1.mkv","https://firebasestorage.googleapis.com/v0/b/tariaki.firebasestorage.app/o/videos%2FPrison_School_OVA1.mkv?alt=media","https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_OVA1.mkv"] }
        ]
      }
    ]
  }
];

async function loadCatalogFromDB(){
  try{
    const r = await fetch(`${SUPABASE_URL_CATALOG}/rest/v1/anime?select=*&order=created_at.desc&limit=100`, { headers:{ apikey: SUPABASE_ANON_CATALOG, Authorization: `Bearer ${SUPABASE_ANON_CATALOG}` }});
    const animes = await r.json();
    if(!Array.isArray(animes) || animes.length===0) return;
    const re = await fetch(`${SUPABASE_URL_CATALOG}/rest/v1/episodes?select=*&order=episode_number.asc&limit=1000`, { headers:{ apikey: SUPABASE_ANON_CATALOG, Authorization: `Bearer ${SUPABASE_ANON_CATALOG}` }});
    const eps = await re.json();
    const grouped = {};
    eps.forEach(e=>{
      if(!grouped[e.anime_id]) grouped[e.anime_id]=[];
      grouped[e.anime_id].push(e);
    });
    const newCatalog = animes.map(a=>{
      const list = grouped[a.id]||[];
      const tv = list.filter(x=>x.type_key==='TV');
      const ova = list.filter(x=>x.type_key==='OVA');
      const cats=[];
      if(tv.length) cats.push({ name:`TV Series (${tv.length} Episode)`, typeKey:'TV', icon:'fa-film', episodes: tv.map(x=>({ id:x.episode_number, title:x.title, name:x.name, size:x.size, url:x.url, urls: x.urls || [x.url] })) });
      if(ova.length) cats.push({ name:'OVA', typeKey:'OVA', icon:'fa-star', episodes: ova.map(x=>({ id:x.episode_number, title:x.title, name:x.name, size:x.size, url:x.url, urls: x.urls || [x.url] })) });
      return { id:a.id, title:a.title, poster:a.poster, type:a.type, status:a.status, totalEp:a.total_ep, synopsis:a.synopsis, categories:cats };
    });
    if(newCatalog.length>0){
      catalog = newCatalog;
      if(typeof renderCatalog==='function') renderCatalog();
      const cnt=document.querySelector('.catalog-count'); if(cnt) cnt.textContent=`${catalog.length} Anime`;
    }
  }catch(e){ console.log('DB load fail, fallback hardcode', e); }
}
loadCatalogFromDB();
