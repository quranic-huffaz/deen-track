// data/index.js
// Gabungkan semua fail data kategori di sini.
// Untuk tambah kategori baru: cipta fail poster-[nama].js baharu ikut format
// yang sama seperti poster-pengajian.js, kemudian import & daftar di bawah.

import { posterPengajian } from './poster-pengajian.js';
import { posterTeknologi } from './poster-teknologi.js';

export const semuaData = [posterPengajian, posterTeknologi];
