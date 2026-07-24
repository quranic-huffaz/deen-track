/**
 * nota-data.js
 * ------------------------------------------------------------------
 * Pangkalan data Perpustakaan Nota.
 * Fail ini SAHAJA yang perlu anda kemaskini. Tidak perlu sentuh
 * index.html langsung.
 *
 * STRUKTUR:
 *   Subjek (nama)
 *     └── Tajuk (nama)
 *           └── Siri (nombor + pautan embed Notion)
 *
 * SETIAP SIRI HANYA ADA 2 MEDAN:
 *   siri  → nombor siri (1, 2, 3, ...)
 *   embed → pautan "Embed this page" dari Notion (Share → Publish → Embed this page)
 *
 * Nak tambah subjek baharu   → tambah objek baharu dalam SUBJEK.
 * Nak tambah tajuk baharu    → tambah objek baharu dalam array `tajuk`.
 * Nak tambah siri baharu     → tambah objek baharu dalam array `siri`.
 * Nak buang mana-mana        → padam objek berkenaan sahaja.
 *
 * Jika satu siri belum ada nota lagi, biarkan `embed: ""`.
 * ------------------------------------------------------------------
 */

const SUBJEK = [
  {
    nama: "Matematik",
    tajuk: [
      {
        nama: "Nombor Bulat",
        siri: [
          { siri: 1, embed: "" },
          { siri: 2, embed: "" }
        ]
      },
      {
        nama: "Pecahan & Perpuluhan",
        siri: [
          { siri: 1, embed: "" }
        ]
      },
      {
        nama: "Peratusan",
        siri: [
          { siri: 1, embed: "" }
        ]
      }
    ]
  },
  {
    nama: "Sejarah",
    tajuk: [
      {
        nama: "Kesultanan Melayu Melaka",
        siri: [
          { siri: 1, embed: "" },
          { siri: 2, embed: "" }
        ]
      },
      {
        nama: "Kedatangan British",
        siri: [
          { siri: 1, embed: "" }
        ]
      }
    ]
  },
  {
    nama: "Pengajian Islam",
    tajuk: [
      {
        nama: "Pengajian Kitab",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/Pengajian-Kitab" },
          { siri: 2, embed: "" }
        ]
      },
      {
        nama: "Tauhid Asas",
        siri: [
          { siri: 1, embed: "" }
        ]
      }
    ]
  }
];
