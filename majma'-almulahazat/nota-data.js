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
    nama: "Muqaddimah al-Hadramiyyah",
    tajuk: [
      {
        nama: "Doa Keluar Tandas",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/Siri-1-3a74b078389f8077a436ced3d234e968" },
          { siri: 2, embed: "https://purring-talos-7f4.notion.site/Siri-2-3a74b078389f8004ab8fe330af5aa937" }
        ]
      },
      {
        nama: "Tayammum",
        siri: [
          { siri: 1, embed: "https://purring-talos-7f4.notion.site/ebd/3a74b078389f802dba93cc8e0432a6f4" }
        ]
      }
    ]
  }
];
