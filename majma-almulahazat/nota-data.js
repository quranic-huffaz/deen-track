/**
 * nota-data.js
 * ------------------------------------------------------------------
 * Pangkalan data Perpustakaan Nota.
 * Fail ini SAHAJA yang perlu anda kemaskini. Tidak perlu sentuh
 * index.html langsung.
 *
 * STRUKTUR:
 * Subjek (nama)
 *  └── Tajuk (nama)
 *        └── Siri (nombor + pautan embed Notion)
 *
 * SETIAP SIRI HANYA ADA 2 MEDAN:
 *   siri  → nombor siri (1, 2, 3, ...)
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
 * Nak tambah tajuk baharu  → tambah objek baharu dalam array `tajuk`.
 * Nak tambah siri baharu   → tambah objek baharu dalam array `siri`.
 * Nak buang mana-mana      → padam objek berkenaan sahaja.
 *
 * Jika satu siri belum ada nota lagi, biarkan `embed: ""`.
 * ------------------------------------------------------------------
 */
const SUBJEK = [
  {
    nama: "Muqaddimah al-Hadramiyyah",
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
          // Siri 1 : 3 Faktor Tayammum
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3b34b078389f80189f8fcce4019ab093" },
          // Siri 2 : Faktor #1 - Hilang Sumber Air
          { siri: 2, embed: "https://purring-talos-7f4.notion.site/ebd/3b34b078389f8014b949eb0c98a005d3" },
          // Siri 3 : Faktor #2 - Orang Sakit
          { siri: 3, embed: "https://purring-talos-7f4.notion.site/ebd/3b44b078389f80999aa7d68aa90a2144" },
          // Siri 4 : Faktor #3 - Cuaca Sejuk
          { siri: 4, embed: "https://purring-talos-7f4.notion.site/ebd/3b44b078389f8008aa1ec9f405b5281f" },
          // Siri 5 : Keadaan Yang Mewajibkan & Tidak Mewajibkan Qada' Solat
          { siri: 5, embed: "https://purring-talos-7f4.notion.site/ebd/3b64b078389f809581e5ffaa71442f42" },
          // Siri 6 : 10 Syarat Sah Tayammum
          { siri: 6, embed: "https://purring-talos-7f4.notion.site/ebd/3b64b078389f80eeb868d0fe26b26454" }
        ]
      }
    ]
  },
  {
    nama: "Al-Jurumiyyah",
    tajuk: [
      {
        nama: "Al-Kalam",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80d1ad10c2ff42fe29f2" }
        ]
      },
      {
        nama: "Bahagian Kalam",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80b88acff51ffefe04ce" }
        ]
      },
      {
        nama: "Alamat Isim",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3bd4b078389f80e28df1c9a90d50149c" }
        ]
      }
    ]
  }
];
