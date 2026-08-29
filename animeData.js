/**
 * TARIAKI ANIME CATALOG DATA MATRIX
 *
 * Instructions for AI Agents / Maintainers adding a new Anime:
 * 1. Add a new object to the `catalog` array below.
 * 2. Structure requirement:
 *    - `id`: unique string slug (e.g., "naruto-shippuden")
 *    - `title`: Display title string
 *    - `poster`: Image URL or relative path (e.g., "cover.jpg" or "https://...")
 *    - `type`: Category summary string (e.g., "TV Series + OVA", "Movie", etc.)
 *    - `status`: "Completed" | "Ongoing"
 *    - `totalEp`: Total number of episodes (integer)
 *    - `synopsis`: Full synopsis description string
 *    - `categories`: Array of category objects:
 *        - `name`: Category header title (e.g., "TV Series (12 Episode)", "OVA", "Movies")
 *        - `typeKey`: Category key identifier ("TV" | "OVA" | "MOVIE")
 *        - `icon`: FontAwesome icon class (e.g., "fa-film", "fa-star")
 *        - `episodes`: Array of episode objects:
 *            - `id`: Episode number or unique integer
 *            - `title`: Episode display title string
 *            - `name`: File name identifier for view/progress tracking
 *            - `size`: Media file size string (e.g., "113.59 MB")
 *            - `url`: Direct streaming/download URL (e.g., GitHub release asset link)
 */

const catalog = [
  {
    id: "prison-school",
    title: "Prison School (Sub Indo)",
    poster: "cover.jpg",
    type: "TV Series + OVA",
    status: "Completed",
    totalEp: 13,
    synopsis: "Hachimitsu Private Academy, institusi boarding school putri berasrama paling bergengsi di Tokyo, memutuskan untuk mengizinkan murid laki-laki masuk pertama kali dalam sejarah sekolah tersebut. Lima anak laki-laki diterima, tetapi mereka tak sadar akan takdir ekstrem yang menanti mereka di bawah pengawasan ketat Dewan Siswa Bayangan (Underground Student Council).",
    categories: [
      {
        name: "TV Series (12 Episode)",
        typeKey: "TV",
        icon: "fa-film",
        episodes: [
          { id: 1, title: "Prison School - Episode 01", name: "Prison_School_01.mkv", size: "113.59 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_01.mkv" },
          { id: 2, title: "Prison School - Episode 02", name: "Prison_School_02.mkv", size: "109.94 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_02.mkv" },
          { id: 3, title: "Prison School - Episode 03", name: "Prison_School_03.mkv", size: "108.78 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_03.mkv" },
          { id: 4, title: "Prison School - Episode 04", name: "Prison_School_04.mkv", size: "110.26 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_04.mkv" },
          { id: 5, title: "Prison School - Episode 05", name: "Prison_School_05.mkv", size: "83.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_05.mkv" },
          { id: 6, title: "Prison School - Episode 06", name: "Prison_School_06.mkv", size: "97.43 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_06.mkv" },
          { id: 7, title: "Prison School - Episode 07", name: "Prison_School_07.mkv", size: "108.20 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_07.mkv" },
          { id: 8, title: "Prison School - Episode 08", name: "Prison_School_08.mkv", size: "98.18 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_08.mkv" },
          { id: 9, title: "Prison School - Episode 09", name: "Prison_School_09.mkv", size: "110.35 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_09.mkv" },
          { id: 10, title: "Prison School - Episode 10", name: "Prison_School_10.mkv", size: "104.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_10.mkv" },
          { id: 11, title: "Prison School - Episode 11", name: "Prison_School_11.mkv", size: "97.01 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_11.mkv" },
          { id: 12, title: "Prison School - Episode 12 (END)", name: "Prison_School_12_END.mkv", size: "110.16 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_12_END.mkv" }
        ]
      },
      {
        name: "OVA (Original Video Animation)",
        typeKey: "OVA",
        icon: "fa-star",
        episodes: [
          { id: 13, title: "Prison School - OVA 1", name: "Prison_School_OVA1.mkv", size: "80.33 MB", url: "https://github.com/Sdam7777/Web-streming/releases/download/v1.0.0/Prison_School_OVA1.mkv" }
        ]
      }
    ]
  }
];
