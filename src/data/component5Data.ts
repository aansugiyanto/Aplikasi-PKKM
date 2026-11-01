/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PKKMIndicator } from '../types/pkkm';

// KOMPONEN 5: Hasil Kinerja Kepala Madrasah (Khusus Penilaian 4 Tahunan / Tahun ke-4)
export const COMPONENT_5_INDICATORS: PKKMIndicator[] = [
  // 5.1. Prestasi Peserta Didik
  {
    id: 'ind-5-1-1',
    code: '5.1.1',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.1',
    subComponentName: 'Prestasi Peserta Didik',
    criteria: 'Prestasi akademik peserta didik yang diraih madrasah selama kurun waktu 4 tahun masa jabatan kepala madrasah',
    requiredEvidenceDescription: 'Dokumen rekapitulasi kejuaraan, piagam penghargaan, piala/medali lomba KSM, OSN, Myres, dan karya ilmiah remaja (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-1-1-a', code: '5.1.1.a', name: 'Rekapitulasi Prestasi Akademik 4 Tahun Terakhir', description: 'Buku album rekap prestasi kejuaraan KSM dan lomba sains tingkat kabupaten/provinsi/nasional', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-rekap-akademik-4th', evidenceFileName: 'Rekap_Kejuaraan_Akademik_4Tahun.pdf', score: 1, assessorNotes: 'Prestasi akademik konsisten meningkat.' },
      { id: 'bi-5-1-1-b', code: '5.1.1.b', name: 'Piagam Penghargaan & Sertifikat Kejuaraan Siswa', description: 'Kumpulan sertifikat juara 1, 2, 3 kompetisi sains madrasah', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-sertifikat-ksm', evidenceFileName: 'Sertifikat_Juara_KSM_Sains.pdf', score: 1, assessorNotes: 'Piagam resmi bertanda tangan pejabat Kemenag/Kemdikbud.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Prestasi akademik siswa mengalami lompatan signifikan selama kepemimpinan beliau.',
    assessedAt: '2026-10-31 15:30',
    assessorName: 'Drs. H. Sugeng Wardoyo, M.Pd.',
  },
  {
    id: 'ind-5-1-2',
    code: '5.1.2',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.1',
    subComponentName: 'Prestasi Peserta Didik',
    criteria: 'Prestasi non-akademik peserta didik (olahraga, seni, pramuka, robotik, dan keagamaan) selama 4 tahun',
    requiredEvidenceDescription: 'Dokumen rekapitulasi trofi, medali, piagam kejuaraan olahraga, seni hadroh, pidato bahasa, tahfidz Al-Qur\'an (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-1-2-a', code: '5.1.2.a', name: 'Rekapitulasi Kejuaraan Non-Akademik 4 Tahun', description: 'Data torehan juara Popda, Aksioma, Porseni, dan Jambore Pramuka', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-rekap-non-akademik-4th', evidenceFileName: 'Rekap_Prestasi_NonAkademik_4Tahun.pdf', score: 1, assessorNotes: 'Banyak menyumbangkan medali untuk kontingen Kebumen.' },
      { id: 'bi-5-1-2-b', code: '5.1.2.b', name: 'Dokumentasi Foto Penyerahan Piala & Medali', description: 'Foto penerimaan piala di hadapan upacara bendera madrasah', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-foto-piala', evidenceFileName: 'Foto_Piala_dan_Medali_Siswa.pdf', score: 1, assessorNotes: 'Dokumentasi lengkap dan rapi.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Prestasi non-akademik dan seni islami sangat unggul.',
    assessedAt: '2026-10-31 16:00',
    assessorName: 'H. Mardiyono, M.Pd.',
  },

  // 5.2. Prestasi Pendidik dan Tenaga Kependidikan
  {
    id: 'ind-5-2-1',
    code: '5.2.1',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.2',
    subComponentName: 'Prestasi Pendidik dan Tenaga Kependidikan',
    criteria: 'Prestasi guru dalam kompetisi guru inspiratif, inovasi pembelajaran, penulisan karya ilmiah, dan HAKI',
    requiredEvidenceDescription: 'Piagam guru berprestasi, modul ajar percontohan kanwil, sertifikat kejuaraan guru (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-2-1-a', code: '5.2.1.a', name: 'Data Guru Berprestasi dan Juara Inovasi', description: 'Rekap guru penerima penghargaan Anugerah Guru Inspiratif Kemenag', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-guru-prestasi', evidenceFileName: 'Data_Guru_Inspiratif_dan_Berprestasi.pdf', score: 1, assessorNotes: 'Dua orang guru meraih juara 1 Anugerah GTK Kemenag.' },
      { id: 'bi-5-2-1-b', code: '5.2.1.b', name: 'Buku Ber-ISBN / Jurnal Publikasi Guru', description: 'Karya buku ajar dan artikel jurnal yang diterbitkan oleh pendidik MTsN 7', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-buku-guru', evidenceFileName: 'Kompilasi_Buku_dan_Jurnal_Guru.pdf', score: 1, assessorNotes: 'Budaya publikasi ilmiah guru sangat produktif.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Kualitas dan reputasi guru MTsN 7 Kebumen sangat disegani.',
    assessedAt: '2026-10-31 16:30',
    assessorName: 'Drs. H. Sugeng Wardoyo, M.Pd.',
  },
  {
    id: 'ind-5-2-2',
    code: '5.2.2',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.2',
    subComponentName: 'Prestasi Pendidik dan Tenaga Kependidikan',
    criteria: 'Prestasi dan kompetensi tenaga kependidikan dalam pengelolaan administrasi, laboratorium, dan perpustakaan',
    requiredEvidenceDescription: 'Sertifikat kompetensi tendik, piagam pustakawan/laboran teladan, apresiasi ketepatan pelaporan keuangan (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-2-2-a', code: '5.2.2.a', name: 'Piagam Penghargaan Tata Kelola Administrasi dan Kearsipan', description: 'Piagam penghargaan pengelola arsip terbaik Kemenag Kab. Kebumen', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-penghargaan-tu', evidenceFileName: 'Piagam_Pengelola_Arsip_Terbaik.pdf', score: 1, assessorNotes: 'Tata usaha meraih predikat tertib administrasi.' },
      { id: 'bi-5-2-2-b', code: '5.2.2.b', name: 'Sertifikat Pengelolaan Laboratorium & Perpustakaan', description: 'Sertifikat sertifikasi pengelola laboratorium IPA dan tenaga perpustakaan', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-sertifikasi-tendik', evidenceFileName: 'Sertifikat_Kompetensi_Tendik.pdf', score: 1, assessorNotes: 'Tendik memiliki sertifikat keahlian resmi.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Tenaga kependidikan bekerja secara terampil dan berprestasi.',
    assessedAt: '2026-10-31 17:00',
    assessorName: 'H. Mardiyono, M.Pd.',
  },

  // 5.3. Prestasi Madrasah
  {
    id: 'ind-5-3-1',
    code: '5.3.1',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.3',
    subComponentName: 'Prestasi Madrasah',
    criteria: 'Peningkatan status akreditasi dan rekognisi penghargaan lembaga madrasah di tingkat kabupaten, provinsi, maupun nasional',
    requiredEvidenceDescription: 'Sertifikat akreditasi BAN-PDM Grade A Unggul (Skor 96), piagam Sekolah Adiwiyata, Madrasah Ramah Anak, dan Madrasah Sehat (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-3-1-a', code: '5.3.1.a', name: 'Sertifikat Akreditasi BAN-PDM Nilai A (Unggul)', description: 'Sertifikat akreditasi resmi dengan skor 96 (Unggul) yang diraih', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-akreditasi-a', evidenceFileName: 'Sertifikat_Akreditasi_BAN-PDM_A.pdf', score: 1, assessorNotes: 'Nilai akreditasi 96 (A Unggul).' },
      { id: 'bi-5-3-1-b', code: '5.3.1.b', name: 'Piagam Madrasah Adiwiyata & Ramah Anak', description: 'Surat Keputusan dan piagam Madrasah Ramah Anak dan Adiwiyata Provinsi Jawa Tengah', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-piagam-adiwiyata', evidenceFileName: 'Piagam_Madrasah_Adiwiyata_dan_MRA.pdf', score: 1, assessorNotes: 'Predikat adiwiyata provinsi berhasil diraih.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Rekognisi madrasah meluas dengan nilai akreditasi unggul dan beragam penghargaan lembaga.',
    assessedAt: '2026-10-31 17:30',
    assessorName: 'Drs. H. Sugeng Wardoyo, M.Pd.',
  },

  // 5.4. Dampak Kinerja & Kepuasan Pemangku Kepentingan
  {
    id: 'ind-5-4-1',
    code: '5.4.1',
    componentId: 5,
    componentName: 'Hasil Kinerja Kepala Madrasah',
    subComponentCode: '5.4',
    subComponentName: 'Dampak Kinerja & Kepuasan Pemangku Kepentingan',
    criteria: 'Indeks kepuasan warga madrasah (guru, tendik, orang tua siswa, alumni, dan komite) terhadap kepemimpinan kepala madrasah',
    requiredEvidenceDescription: 'Laporan survei indeks kepuasan stakeholder (IKM), grafik hasil instrumen kepuasan, dan testimoni tertulis (Melalui studi dokumen)',
    evidenceItems: [
      { id: 'bi-5-4-1-a', code: '5.4.1.a', name: 'Laporan Hasil Survei Indeks Kepuasan Masyarakat (IKM)', description: 'Hasil survei persepsi layanan pendidikan MTsN 7 dengan indeks 94.8% (Sangat Puas)', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-survei-ikm', evidenceFileName: 'Laporan_Survei_Kepuasan_Stakeholder.pdf', score: 1, assessorNotes: 'Tingkat kepuasan masyarakat mencapai 94.8% (Sangat Baik).' },
      { id: 'bi-5-4-1-b', code: '5.4.1.b', name: 'Testimoni dan Rekomendasi Komite & Tokoh Masyarakat', description: 'Kompilasi surat apresiasi dan testimoni komite madrasah serta wali murid', isAttached: true, evidenceFileUrl: 'https://drive.google.com/drive/folders/mtsn7kebumen-testimoni-komite', evidenceFileName: 'Surat_Apresiasi_dan_Testimoni_Komite.pdf', score: 1, assessorNotes: 'Dukungan orang tua dan tokoh masyarakat sangat tinggi.' },
    ],
    evidences: [],
    score: 1,
    assessorNotes: 'Kepemimpinan Kepala Madrasah memperoleh dukungan penuh dan apresiasi tinggi dari seluruh warga.',
    assessedAt: '2026-10-31 18:00',
    assessorName: 'H. Mardiyono, M.Pd.',
  },
];
