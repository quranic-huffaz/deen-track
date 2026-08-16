/**
 * nota-data.js
 * ------------------------------------------------------------------
 * Pangkalan data Perpustakaan Nota.
 * Fail ini SAHAJA yang perlu anda kemaskini. Tidak perlu sentuh
 * index.html langsung.
 *
 * STRUKTUR:
 * Subjek (nama + bidang)
 *  └── Tajuk (nama)
 *        └── Siri (nombor + pautan embed Notion)
 *
 * SETIAP SUBJEK ADA MEDAN `bidang` (OPSYENAL):
 *   bidang → kategori umum bagi subjek ini, cth: "Fiqh", "Nahu", "Aqidah".
 *            Ia akan dipaparkan sebagai label kecil pada kad subjek di
 *            Utama, dan juga akan muncul secara automatik dalam dropdown
 *            butang "Bidang" di sebelah kotak carian — TIDAK perlu
 *            didaftarkan di mana-mana tempat lain, cukup taip di sini.
 *            Jika dibiarkan kosong, ia akan dipaparkan sebagai "Umum".
 *
 * SETIAP SIRI ADA 3 MEDAN (1 opsyenal):
 *   siri  → nombor siri (1, 2, 3, ...)
 *   nama  → (OPSYENAL) nama/tajuk bab bagi siri ini, cth: "3 Faktor Tayammum".
 *           Jika diisi, interface akan papar NAMA ini sebagai tajuk utama
 *           (dengan "Siri N" sebagai sari kata kecil di bawahnya).
 *           Jika dibiarkan kosong ("" atau dibuang terus), interface akan
 *           papar "Siri N" sahaja seperti biasa.
 *   embed → PAUTAN SAHAJA dari Notion (bukan kod <iframe> penuh)
 *
 * PENTING — cara ambil pautan yang betul:
 * Notion beri kod macam ini bila anda klik "Embed this page":
 *   <iframe src="https://xxxx.notion.site/ebd/xxxxxxxx" width="100%" height="600" ...></iframe>
 * Ambil BAHAGIAN DALAM src="..." SAHAJA, contoh:
 *   https://xxxx.notion.site/ebd/xxxxxxxx
 *
 * index.html akan bina semula tag <iframe> secara automatik dengan
 * saiz dan bingkai yang sepadan dengan reka bentuk laman.
 *
 * Nak tambah subjek baharu → tambah objek baharu dalam SUBJEK.
 * Nak tambah tajuk baharu  → tambah objek baharu dalam array tajuk.
 * Nak tambah siri baharu   → tambah objek baharu dalam array siri.
 * Nak buang mana-mana      → padam objek berkenaan sahaja.
 *
 * Jika satu siri belum ada nota lagi, biarkan embed: "".
 * ------------------------------------------------------------------
 */
const SUBJEK = [
  {
    nama: "Muqaddimah al-Hadramiyyah",
    bidang: "Fiqh",
    tajuk: [
      {
        nama: "Doa Keluar Tandas",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3a74b078389f8077a436ced3d234e968" },
          { siri: 2, embed: "https://purring-talos-7f4.notion.site/ebd/3a74b078389f8004ab8fe330af5aa937" }
        ]
      },
      {
        nama: "Tayammum",
        siri: [
          { siri: 1, nama: "3 Faktor Tayammum", embed: "https://purring-talos-7f4.notion.site/ebd/3b34b078389f80189f8fcce4019ab093" },
          { siri: 2, nama: "Faktor #1 - Hilang Sumber Air", embed: "https://purring-talos-7f4.notion.site/ebd/3b34b078389f8014b949eb0c98a005d3" },
          { siri: 3, nama: "Faktor #2 - Orang Sakit", embed: "https://purring-talos-7f4.notion.site/ebd/3b44b078389f80999aa7d68aa90a2144" },
          { siri: 4, nama: "Faktor #3 - Cuaca Sejuk", embed: "https://purring-talos-7f4.notion.site/ebd/3b44b078389f8008aa1ec9f405b5281f" },
          { siri: 5, nama: "Keadaan Yang Mewajibkan & Tidak Mewajibkan Qada' Solat", embed: "https://purring-talos-7f4.notion.site/ebd/3b64b078389f809581e5ffaa71442f42" },
          { siri: 6, nama: "10 Syarat Sah Tayammum", embed: "https://purring-talos-7f4.notion.site/ebd/3b64b078389f80eeb868d0fe26b26454" }
        ]
      }
    ]
  },
  {
    nama: "Al-Jurumiyyah",
    bidang: "Nahu",
    tajuk: [
      {
        nama: "Al-Kalam",
        siri: [
          { siri: 1, nama: "Ta'rif Al-Kalam", embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80d1ad10c2ff42fe29f2" },
          { siri: 2, nama: "Bahagian Kalam", embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80b88acff51ffefe04ce" },
          { siri: 3, nama: "Alamat Isim", embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80e28df1c9a90d50149c" }
        ]
      }
    ]
  }
];
