# PetaMinda — Platform Kongsi Peta Minda

Platform statik untuk berkongsi peta minda dalam bentuk poster, disusun mengikut
folder/kategori, dengan carian dan penapis (filter). Dibina 100% dengan
HTML/CSS/JavaScript vanilla (ES6 modules) — tiada build step, sedia untuk
GitHub Pages.

## Struktur Fail

```
/
├── index.html                  # Entry point
├── assets/
│   ├── css/style.css           # Semua styling (dark, premium, glassmorphism)
│   ├── js/
│   │   ├── app.js              # Logic utama: render, search, filter, modal
│   │   └── router.js           # Uruskan state melalui URL query params
│   ├── posters/                # Simpan imej poster sebenar di sini
│   │   ├── pengajian/
│   │   └── teknologi/
│   └── icons/
├── data/
│   ├── poster-pengajian.js     # Data poster kategori "Pengajian"
│   ├── poster-teknologi.js     # Data poster kategori "Teknologi"
│   └── index.js                # Gabungkan semua fail data
└── README.md
```

> **Nota:** Data contoh dalam repo ini menggunakan URL imej placeholder
> (Unsplash) supaya app boleh terus di-preview. Gantikan dengan imej sebenar
> anda mengikut arahan di bawah.

## Cara Jalankan Secara Tempatan

Oleh kerana `index.html` menggunakan ES6 module (`type="module"`), ia perlu
dilayan melalui server HTTP (bukan buka fail terus di browser). Contoh:

```bash
npx serve .
# atau
python3 -m http.server 8080
```

Kemudian buka `http://localhost:8080` (atau port berkenaan).

## Cara Tambah Poster Baru

1. Letak imej poster (versi penuh + thumbnail) dalam
   `assets/posters/[kategori]/`.
2. Buka fail data kategori berkenaan, contoh `data/poster-pengajian.js`.
3. Tambah satu objek baru dalam array `posters`, ikut format:

```javascript
{
  id: "pengajian-007",                 // unik, format: [slug-kategori]-[nombor]
  tajuk: "Tajuk Poster",
  subtajuk: "Sub-tajuk / topik spesifik",
  folder: "pengajian",                 // mesti sama dengan slug kategori
  subfolder: "sains",                  // sub-kategori bebas anda tentukan
  tags: ["tag1", "tag2"],
  gambar: "assets/posters/pengajian/nama-fail.jpg",
  gambarThumbnail: "assets/posters/pengajian/thumb/nama-fail.jpg",
  penulis: "Nama Penulis",
  tarikh: "2025-05-01",                // format YYYY-MM-DD
  tahapKesukaran: "Sederhana",         // Mudah / Sederhana / Sukar
  bilanganPapar: 0,
  pautanMuatTurun: "assets/posters/pengajian/nama-fail.jpg"
}
```

4. Simpan fail. Tiada perlu ubah `app.js` — app akan kesan poster baru
   secara automatik.

## Cara Tambah Kategori/Folder Baru

1. Cipta fail baru, contoh `data/poster-perniagaan.js`, ikut format yang sama
   seperti `poster-pengajian.js`:

```javascript
export const posterPerniagaan = {
  kategori: "Perniagaan",
  slug: "perniagaan",
  ikon: "briefcase",   // nama ikon Lucide (lihat lucide.dev/icons)
  deskripsi: "Peta minda berkaitan keusahawanan dan perniagaan",
  posters: [ /* ... */ ]
};
```

2. Daftarkan fail baru dalam `data/index.js`:

```javascript
import { posterPerniagaan } from './poster-perniagaan.js';

export const semuaData = [posterPengajian, posterTeknologi, posterPerniagaan];
```

3. Buat folder imej sepadan: `assets/posters/perniagaan/`.

Selesai — kategori baru akan terus muncul di halaman utama, carian dan
penapis tanpa perlu ubah logic app.

## Ciri-ciri

- Paparan folder/kategori + grid poster responsive
- Carian global real-time merentasi semua kategori
- Penapis gabungan (subfolder, tahap kesukaran, tag popular) dengan kiraan
  facet dinamik
- Modal/lightbox poster dengan zoom & muat turun
- Breadcrumb navigasi
- State disimpan di URL (`?kategori=pengajian&cari=biologi`) — boleh kongsi
  terus pautan hasil carian/filter
- Skeleton loading & empty state
- Bottom-sheet filter di mobile, sidebar tetap di desktop
- Reka bentuk dark-mode fintech premium (glassmorphism, aksen emas + indigo)

## Deploy ke GitHub Pages

1. Push repo ini ke GitHub.
2. Settings → Pages → Source: pilih branch (contoh `main`) dan folder `/`.
3. Simpan — laman akan tersedia di `https://[username].github.io/[repo]/`.

## Idea Ciri Akan Datang

- Toggle mod terang/gelap
- Sistem "like" / bookmark (guna localStorage)
- Eksport senarai poster ke PDF
