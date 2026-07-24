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
 *   embed → PAUTAN SAHAJA dari Notion (bukan kod <iframe> penuh)
 *
 * PENTING — cara ambil pautan yang betul:
 *   Notion beri kod macam ini bila anda klik "Embed this page":
 *     <iframe src="https://xxxx.notion.site/ebd/xxxxxxxx" width="100%" height="600" ...></iframe>
 *   Ambil BAHAGIAN DALAM src="..." SAHAJA, contoh:
 *     https://xxxx.notion.site/ebd/xxxxxxxx
 *   index.html akan bina semula tag <iframe> secara automatik dengan
 *   saiz dan bingkai yang sepadan dengan reka bentuk laman.
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
    nama: "Feqah",
    tajuk: [
      {
        nama: "Tayammum",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd//1694b078389f80708d57eff338b6e11e" },
          { siri: 2, embed: "https://purring-talos-7f4.notion.site/ebd//1694b078389f80a3b186d0e71cda00eb" }
        ]
      }
    ]
  }
];
