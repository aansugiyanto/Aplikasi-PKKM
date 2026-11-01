/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PKKMComponent, PKKMIndicator, MadrasahProfile } from '../types/pkkm';
import { COMPONENT_1_INDICATORS } from './component1Data';
import { COMPONENT_2_INDICATORS } from './component2Data';
import { COMPONENT_3_INDICATORS } from './component3Data';
import { COMPONENT_4_INDICATORS } from './component4Data';
import { COMPONENT_5_INDICATORS } from './component5Data';

export {
  COMPONENT_1_INDICATORS,
  COMPONENT_2_INDICATORS,
  COMPONENT_3_INDICATORS,
  COMPONENT_4_INDICATORS,
  COMPONENT_5_INDICATORS,
};

export const DEFAULT_MADRASAH_PROFILE: MadrasahProfile = {
  // Identitas Madrasah
  name: 'MTs Negeri 7 Kebumen',
  nsm: '121133050007',
  npsn: '20363238',
  address: 'Jl. Raya Prembun No. 9, Prembun',
  village: 'Prembun',
  subdistrict: 'Kec. Prembun',
  regency: 'Kabupaten Kebumen',
  province: 'Jawa Tengah',
  postalCode: '54394',
  phoneNumber: '(0287) 6651234',
  email: 'mtsn7kebumen@kemenag.go.id',
  website: 'https://mtsn7kebumen.sch.id',
  accreditationGrade: 'A (Unggul)',
  accreditationScore: 96,

  // Identitas Kepala Madrasah
  headmasterName: 'M. Mohsin, S.Ag., M.Pd.I',
  headmasterNip: '197104151998031004',
  headmasterRank: 'Pembina Tingkat I / IV.b',
  headmasterTMT: '01 Maret 2021',
  headmasterPeriod: 'Periode ke-1 (Tahun ke-4)',
  headmasterEducation: 'S-2 Manajemen Pendidikan Islam (UIN Sunan Kalijaga)',

  // Identitas Penilai 1
  assessor1Name: 'Drs. H. Sugeng Wardoyo, M.Pd.',
  assessor1Nip: '196805121994031002',
  assessor1Rank: 'Pembina Utama Muda / IV.c',
  assessor1Position: 'Pengawas Madrasah Madya Kemenag Kab. Kebumen',
  assessor1Phone: '0812-3456-7890',

  // Identitas Penilai 2
  assessor2Name: 'H. Mardiyono, M.Pd.',
  assessor2Nip: '197209181999031003',
  assessor2Rank: 'Pembina Tingkat I / IV.b',
  assessor2Position: 'Pengawas Madrasah Ahli Madya Kemenag Kab. Kebumen',
  assessor2Phone: '0813-9876-5432',

  // Pelaksanaan & Pejabat
  assessmentYear: 1,
  academicYear: '2025/2026',
  evaluationPeriod: 'Penilaian Kinerja Tahunan (Tahun ke-1)',
  evaluationDate: '30 Oktober 2026',
  evaluationPlace: 'Aula Pertemuan MTs Negeri 7 Kebumen',
  headOfKemenagName: 'Dr. H. Sukarno, M.M.',
  headOfKemenagNip: '196708151993031002',
};

/**
 * Menghasilkan komponen yang aktif berdasarkan Tahun Penilaian:
 * - Tahun 1, 2, 3: Hanya 4 Komponen Tugas Utama (Bobot 30%, 30%, 15%, 25% = 100%)
 * - Tahun 4: 5 Komponen Lengkap dengan Komponen 5 (Hasil Kinerja) (Bobot 25%, 30%, 15%, 20%, 10% = 100%)
 */
export function getActiveComponentsForYear(year: 1 | 2 | 3 | 4): PKKMComponent[] {
  if (year === 4) {
    return [
      {
        id: 1,
        code: 'KOMP-1',
        name: 'Usaha Pengembangan Madrasah',
        shortName: 'Pengembangan Madrasah',
        weight: 25,
        description: 'Kemampuan mengembangkan madrasah sesuai kebutuhan dan SNP, manajemen perubahan, kemitraan masyarakat, dan unit layanan.',
        iconName: 'Building2',
      },
      {
        id: 2,
        code: 'KOMP-2',
        name: 'Pelaksanaan Tugas Manajerial',
        shortName: 'Manajerial Madrasah',
        weight: 30,
        description: 'Pengelolaan perencanaan madrasah (RKM/RKAM), kepemimpinan, budaya madrasah, SDM pendidik/tendik, sarpras, kurikulum, dan akuntabilitas keuangan.',
        iconName: 'Briefcase',
      },
      {
        id: 3,
        code: 'KOMP-3',
        name: 'Pengembangan Kewirausahaan',
        shortName: 'Kewirausahaan',
        weight: 15,
        description: 'Penciptaan inovasi madrasah, etos kerja tinggi, jiwa pantang menyerah, unit produksi/koperasi madrasah, dan kemandirian institusi.',
        iconName: 'TrendingUp',
      },
      {
        id: 4,
        code: 'KOMP-4',
        name: 'Supervisi kepada Guru dan Tendik',
        shortName: 'Supervisi Akademik & Tendik',
        weight: 20,
        description: 'Penyusunan perencanaan program supervisi, pelaksanaan supervisi pembelajaran di kelas, serta evaluasi dan tindak lanjut supervisi.',
        iconName: 'UserCheck',
      },
      {
        id: 5,
        code: 'KOMP-5',
        name: 'Hasil Kinerja Kepala Madrasah',
        shortName: 'Prestasi & Dampak Kinerja',
        weight: 10,
        description: 'Prestasi siswa bidang akademik/non-akademik, prestasi guru/tendik, akreditasi/penghargaan madrasah, dan indeks kepuasan stakeholder.',
        iconName: 'Award',
      },
    ];
  }

  // Tahun 1, 2, 3: Hanya 4 Komponen
  return [
    {
      id: 1,
      code: 'KOMP-1',
      name: 'Usaha Pengembangan Madrasah',
      shortName: 'Pengembangan Madrasah',
      weight: 30,
      description: 'Kemampuan mengembangkan madrasah sesuai kebutuhan dan SNP, manajemen perubahan, kemitraan masyarakat, dan unit layanan.',
      iconName: 'Building2',
    },
    {
      id: 2,
      code: 'KOMP-2',
      name: 'Pelaksanaan Tugas Manajerial',
      shortName: 'Manajerial Madrasah',
      weight: 30,
      description: 'Pengelolaan perencanaan madrasah (RKM/RKAM), kepemimpinan, budaya madrasah, SDM pendidik/tendik, sarpras, kurikulum, dan akuntabilitas keuangan.',
      iconName: 'Briefcase',
    },
    {
      id: 3,
      code: 'KOMP-3',
      name: 'Pengembangan Kewirausahaan',
      shortName: 'Kewirausahaan',
      weight: 15,
      description: 'Penciptaan inovasi madrasah, etos kerja tinggi, jiwa pantang menyerah, unit produksi/koperasi madrasah, dan kemandirian institusi.',
      iconName: 'TrendingUp',
    },
    {
      id: 4,
      code: 'KOMP-4',
      name: 'Supervisi kepada Guru dan Tendik',
      shortName: 'Supervisi Akademik & Tendik',
      weight: 25,
      description: 'Penyusunan perencanaan program supervisi, pelaksanaan supervisi pembelajaran di kelas, serta evaluasi dan tindak lanjut supervisi.',
      iconName: 'UserCheck',
    },
  ];
}

export function getEvaluationPeriodTitle(year: 1 | 2 | 3 | 4): string {
  if (year === 4) {
    return 'Penilaian Kinerja 4 Tahunan (PKKM 4 Tahunan)';
  }
  return `Penilaian Kinerja Tahunan (PKKM Tahun ke-${year})`;
}

export const PKKM_COMPONENTS: PKKMComponent[] = getActiveComponentsForYear(4);

export const INITIAL_PKKM_INDICATORS: PKKMIndicator[] = [
  ...COMPONENT_1_INDICATORS,
  ...COMPONENT_2_INDICATORS,
  ...COMPONENT_3_INDICATORS,
  ...COMPONENT_4_INDICATORS,
  ...COMPONENT_5_INDICATORS,
];
