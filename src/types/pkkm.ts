/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PhysicalEvidence {
  id: string;
  title: string;
  type: 'drive_file' | 'link' | 'upload';
  url: string;
  fileId?: string;
  fileName?: string;
  fileSize?: string;
  driveFolderId?: string;
  uploadedAt: string;
  uploadedBy: string;
  notes?: string;
}

export interface EvidenceItem {
  id: string;
  code: string; // e.g. "1.1.1.a", "1.1.1.b"
  name: string; // Nama butir bukti dukung fisik
  description: string; // Penjelasan spesifik berkas yang diminta
  isAttached: boolean; // Apakah bukti dukung sudah dilampirkan
  evidenceFileUrl?: string; // Tautan Google Drive / berkas
  evidenceFileName?: string;
  evidenceFileType?: 'link' | 'upload' | 'drive_file';
  evidenceUploadedAt?: string;
  evidenceUploadedBy?: string;
  notes?: string;
  score: 0 | 1 | 2 | 3 | 4; // Penilaian khusus per butir bukti dukung! (0 = Belum Dinilai)
  assessorNotes?: string;
  assessedAt?: string;
  assessorName?: string;
}

export interface PKKMIndicator {
  id: string;
  code: string;
  componentId: number;
  componentName: string;
  subComponentCode: string;
  subComponentName: string;
  criteria: string;
  requiredEvidenceDescription: string;
  driveFolderId?: string;
  driveFolderUrl?: string;
  evidenceItems: EvidenceItem[]; // Daftar butir bukti dukung yang dinilai satu per satu!
  evidences: PhysicalEvidence[];
  score: 0 | 1 | 2 | 3 | 4; // Skor indikator (dapat dihitung otomatis dari rata-rata butir bukti dukung)
  assessorNotes?: string;
  assessedAt?: string;
  assessorName?: string;
}

export interface PKKMComponent {
  id: number;
  code: string;
  name: string;
  shortName: string;
  weight: number; // Persentase bobot standar Kemenag (e.g. 25, 30, 15, 20, 10)
  description: string;
  iconName: string;
  driveFolderId?: string;
  driveFolderUrl?: string;
}

export interface MadrasahProfile {
  // Identitas Madrasah
  name: string;
  nsm: string;
  npsn: string;
  address: string;
  village: string;
  subdistrict: string;
  regency: string;
  province: string;
  postalCode: string;
  phoneNumber: string;
  email: string;
  website: string;
  accreditationGrade: string;
  accreditationScore: number;

  // Identitas Kepala Madrasah
  headmasterName: string;
  headmasterNip: string;
  headmasterRank: string; // Pangkat / Golongan: Pembina Tk. I / IV.b
  headmasterTMT: string; // TMT sebagai Kamad
  headmasterPeriod: string; // Periode ke-
  headmasterEducation: string; // Pendidikan Terakhir

  // Identitas Penilai 1
  assessor1Name: string;
  assessor1Nip: string;
  assessor1Rank: string;
  assessor1Position: string; // Jabatan: Pengawas Madrasah Madya Kemenag Kab. Kebumen
  assessor1Phone: string;

  // Identitas Penilai 2
  assessor2Name: string;
  assessor2Nip: string;
  assessor2Rank: string;
  assessor2Position: string; // Jabatan: Pengawas Madrasah Ahli Madya Kemenag Kab. Kebumen
  assessor2Phone: string;

  // Pelaksanaan PKKM & Pejabat Kemenag
  assessmentYear: 1 | 2 | 3 | 4; // Tahun 1, Tahun 2, Tahun 3 (4 Komponen), Tahun 4 (5 Komponen)
  academicYear: string;
  evaluationPeriod: string;
  evaluationDate: string;
  evaluationPlace: string;
  headOfKemenagName: string;
  headOfKemenagNip: string;
}

export interface DocumentNotification {
  id: string;
  indicatorId: string;
  indicatorCode: string;
  title: string;
  action: 'added' | 'updated';
  timestamp: string;
  userName: string;
  read: boolean;
}

export interface ComponentScoreSummary {
  componentId: number;
  componentName: string;
  totalIndicators: number;
  assessedIndicators: number;
  evidenceCompleteCount: number;
  totalScore: number;
  maxScore: number;
  scorePercentage: number;
  weightedScore: number;
  progressPercentage: number;
  totalEvidenceItems: number;
  completedEvidenceItems: number;
}

export interface PKKMOverallScore {
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  predicate: 'Amat Baik' | 'Baik' | 'Cukup' | 'Sedang' | 'Kurang';
  predicateGrade: 'A' | 'B' | 'C' | 'D' | 'E';
  status: 'Memenuhi Syarat' | 'Dalam Proses' | 'Perlu Perbaikan';
  totalIndicators: number;
  completedIndicators: number;
  indicatorsWithEvidence: number;
  indicatorsWithoutEvidence: number;
  totalEvidenceItems: number;
  completedEvidenceItems: number;
}
