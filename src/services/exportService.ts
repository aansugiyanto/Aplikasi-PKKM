/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import {
  MadrasahProfile,
  PKKMComponent,
  PKKMIndicator,
  ComponentScoreSummary,
  PKKMOverallScore,
} from '../types/pkkm';

/**
 * Ekspor Laporan Resmi PKKM MTs Negeri 7 Kebumen ke PDF
 */
export function exportPKKMToPDF(
  profile: MadrasahProfile,
  components: PKKMComponent[],
  indicators: PKKMIndicator[],
  summaries: ComponentScoreSummary[],
  overall: PKKMOverallScore
): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Kop Surat Kementerian Agama & MTs Negeri 7 Kebumen
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text('KEMENTERIAN AGAMA REPUBLIK INDONESIA', pageWidth / 2, 14, { align: 'center' });
  doc.text('KANTOR KEMENTERIAN AGAMA KABUPATEN KEBUMEN', pageWidth / 2, 19, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setTextColor(6, 95, 70); // Emerald Kemenag
  doc.text('MADRASAH TSANAWIYAH NEGERI 7 KEBUMEN', pageWidth / 2, 25, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Jl. Raya Prembun No. 9, Kec. Prembun, Kabupaten Kebumen, Jawa Tengah 54394', pageWidth / 2, 30, { align: 'center' });
  doc.text('Website: mtsn7kebumen.sch.id | NPSN: 20363238 | NSM: 121133050007', pageWidth / 2, 34, { align: 'center' });

  // Garis Kop Surat Ganda
  doc.setLineWidth(0.8);
  doc.setDrawColor(6, 95, 70);
  doc.line(14, 37, pageWidth - 14, 37);
  doc.setLineWidth(0.2);
  doc.setDrawColor(100, 116, 139);
  doc.line(14, 38.2, pageWidth - 14, 38.2);

  // 2. Judul Laporan
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  const pdfTitle = profile.assessmentYear === 4
    ? 'LAPORAN HASIL PENILAIAN KINERJA KEPALA MADRASAH (PKKM 4 TAHUNAN)'
    : `LAPORAN HASIL PENILAIAN KINERJA KEPALA MADRASAH (PKKM TAHUN KE-${profile.assessmentYear || 1})`;
  doc.text(pdfTitle, pageWidth / 2, 45, { align: 'center' });
  doc.setFontSize(9.5);
  doc.setFont('times', 'normal');
  const pdfSub = profile.assessmentYear === 4
    ? `Tahun Ajaran: ${profile.academicYear} | Periode 4 Tahunan (5 Komponen Lengkap)`
    : `Tahun Ajaran: ${profile.academicYear} | Periode Tahunan (Tahun ke-${profile.assessmentYear || 1} - 4 Komponen Utama)`;
  doc.text(pdfSub, pageWidth / 2, 50, { align: 'center' });

  // 3. Identitas Singkat
  autoTable(doc, {
    startY: 54,
    theme: 'plain',
    styles: { font: 'times', fontSize: 9, cellPadding: 1.2 },
    body: [
      ['Madrasah', `: ${profile.name} (NPSN: ${profile.npsn} / NSM: ${profile.nsm})`, 'Asesor 1', `: ${profile.assessor1Name}`],
      ['Kepala Madrasah', `: ${profile.headmasterName}`, 'NIP Asesor 1', `: ${profile.assessor1Nip}`],
      ['NIP Kamad', `: ${profile.headmasterNip}`, 'Asesor 2', `: ${profile.assessor2Name}`],
      ['Kec. / Kab.', `: ${profile.subdistrict}, ${profile.regency}`, 'NIP Asesor 2', `: ${profile.assessor2Nip}`],
    ],
    margin: { left: 14, right: 14 },
  });

  // 4. Tabel Rekapitulasi 5 Komponen Utama
  const finalY1 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;

  doc.setFont('times', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('A. REKAPITULASI NILAI TUGAS UTAMA KEPALA MADRASAH', 14, finalY1);

  const tableBody = summaries.map((s, idx) => [
    (idx + 1).toString(),
    s.componentName,
    s.totalIndicators.toString(),
    s.assessedIndicators.toString(),
    s.evidenceCompleteCount.toString(),
    s.maxScore.toString(),
    s.totalScore.toString(),
    `${s.scorePercentage.toFixed(1)}%`,
    `${components.find((c: PKKMComponent) => c.id === s.componentId)?.weight || 0}%`,
    s.weightedScore.toFixed(2),
  ]);

  // Tambahkan baris Total
  tableBody.push([
    '',
    'NILAI AKHIR KINERJA (TERTIMBANG)',
    overall.totalIndicators.toString(),
    overall.completedIndicators.toString(),
    overall.indicatorsWithEvidence.toString(),
    overall.maxPossibleScore.toString(),
    overall.totalScore.toString(),
    `${overall.percentageScore.toFixed(1)}%`,
    '100%',
    overall.percentageScore.toFixed(2),
  ]);

  autoTable(doc, {
    startY: finalY1 + 2,
    head: [
      [
        'No',
        'Komponen Penilaian',
        'Jml Ind',
        'Dinilai',
        'Ada Eviden',
        'Skor Maks',
        'Perolehan',
        'Nilai %',
        'Bobot',
        'Tertimbang',
      ],
    ],
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      font: 'times',
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'center',
    },
    styles: {
      font: 'times',
      fontSize: 8,
      cellPadding: 1.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 8 },
      1: { cellWidth: 52 },
      2: { halign: 'center', cellWidth: 12 },
      3: { halign: 'center', cellWidth: 12 },
      4: { halign: 'center', cellWidth: 14 },
      5: { halign: 'center', cellWidth: 14 },
      6: { halign: 'center', cellWidth: 14 },
      7: { halign: 'center', cellWidth: 14 },
      8: { halign: 'center', cellWidth: 12 },
      9: { halign: 'center', cellWidth: 16 },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 4;

  // Box Kesimpulan Nilai Akhir & Predikat
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(22, 163, 74);
  doc.rect(14, finalY2, pageWidth - 28, 16, 'FD');

  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(20, 83, 45);
  doc.text(`HASIL AKHIR: SKOR = ${overall.percentageScore.toFixed(2)} / 100`, 18, finalY2 + 6);
  doc.text(`PREDIKAT: ${overall.predicate.toUpperCase()} (${overall.predicateGrade}) - STATUS: ${overall.status.toUpperCase()}`, 18, finalY2 + 11.5);

  // Lembar Pengesahan (Tanda Tangan 3 Kolom)
  const finalY3 = finalY2 + 22;
  const colWidth = (pageWidth - 28) / 3;

  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);

  const signDate = `Kebumen, ${new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })}`;

  doc.text(signDate, 14 + colWidth * 2, finalY3 - 4);

  // Kolom 1: Penilai 1
  doc.text('Penilai 1 (Pengawas Madrasah),', 14, finalY3);
  doc.setFont('times', 'bold');
  doc.text(profile.assessor1Name, 14, finalY3 + 20);
  doc.setFont('times', 'normal');
  doc.text(`NIP. ${profile.assessor1Nip}`, 14, finalY3 + 24);

  // Kolom 2: Kepala Madrasah
  doc.text('Kepala MTs Negeri 7 Kebumen,', 14 + colWidth, finalY3);
  doc.setFont('times', 'bold');
  doc.text(profile.headmasterName, 14 + colWidth, finalY3 + 20);
  doc.setFont('times', 'normal');
  doc.text(`NIP. ${profile.headmasterNip}`, 14 + colWidth, finalY3 + 24);

  // Kolom 3: Penilai 2
  doc.text('Penilai 2 (Pengawas Madrasah),', 14 + colWidth * 2, finalY3);
  doc.setFont('times', 'bold');
  doc.text(profile.assessor2Name, 14 + colWidth * 2, finalY3 + 20);
  doc.setFont('times', 'normal');
  doc.text(`NIP. ${profile.assessor2Nip}`, 14 + colWidth * 2, finalY3 + 24);

  // Halaman 2: Lampiran Rincian Bukti Fisik & Eviden
  doc.addPage();
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(6, 95, 70);
  doc.text('B. RINCIAN BUKTI FISIK DAN EVIDEN DIGITAL GOOGLE DRIVE', 14, 15);
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text('Daftar berkas eviden fisik yang telah diunggah dan diverifikasi oleh tim penilai.', 14, 20);

  const detailRows = indicators.map((ind) => {
    const evidenceTitles = ind.evidences.length > 0
      ? ind.evidences.map((e) => `• ${e.title} (${e.fileName || 'Link'})`).join('\n')
      : '⚠️ Belum Ada Eviden (Tidak Dilakukan Penilaian)';
    
    return [
      ind.code,
      ind.subComponentName,
      evidenceTitles,
      ind.evidences.length > 0 ? (ind.score > 0 ? ind.score.toString() : 'Belum') : 'KOSONG',
      ind.assessorNotes || '-',
    ];
  });

  autoTable(doc, {
    startY: 24,
    head: [['Kode', 'Indikator / Sub-Unsur', 'Bukti Fisik / Eviden Terlampir', 'Skor', 'Catatan Asesor']],
    body: detailRows,
    theme: 'grid',
    headStyles: {
      fillColor: [6, 95, 70],
      textColor: [255, 255, 255],
      font: 'times',
      fontStyle: 'bold',
      fontSize: 8,
    },
    styles: {
      font: 'times',
      fontSize: 7.5,
      cellPadding: 1.5,
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 14 },
      1: { cellWidth: 46 },
      2: { cellWidth: 72 },
      3: { halign: 'center', cellWidth: 14 },
      4: { cellWidth: 36 },
    },
    margin: { left: 14, right: 14 },
  });

  // Simpan File
  doc.save(`Laporan_PKKM_MTsN7Kebumen_${profile.academicYear.replace('/', '-')}.pdf`);
}

/**
 * Ekspor Data Lengkap PKKM ke format Excel (.xlsx)
 */
export function exportPKKMToExcel(
  profile: MadrasahProfile,
  components: PKKMComponent[],
  indicators: PKKMIndicator[],
  summaries: ComponentScoreSummary[],
  overall: PKKMOverallScore
): void {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Rekapitulasi
  const excelTitle = profile.assessmentYear === 4
    ? 'LAPORAN HASIL PENILAIAN KINERJA KEPALA MADRASAH (PKKM 4 TAHUNAN)'
    : `LAPORAN HASIL PENILAIAN KINERJA KEPALA MADRASAH (PKKM TAHUN KE-${profile.assessmentYear || 1})`;
  const excelPeriod = profile.assessmentYear === 4
    ? 'Periode 4 Tahunan (5 Komponen Tugas Utama)'
    : `Periode Tahunan (Tahun ke-${profile.assessmentYear || 1} - 4 Komponen Utama)`;

  const recapData = [
    [excelTitle],
    ['MADRASAH TSANAWIYAH NEGERI 7 KEBUMEN'],
    [`Tahun Ajaran: ${profile.academicYear}`, `Periode: ${excelPeriod}`],
    [`Kepala Madrasah: ${profile.headmasterName} (NIP: ${profile.headmasterNip})`],
    [`Tim Asesor: ${profile.assessor1Name} & ${profile.assessor2Name}`],
    [],
    [
      'No',
      'Komponen Penilaian',
      'Total Indikator',
      'Indikator Dinilai',
      'Ada Eviden',
      'Skor Maksimal',
      'Skor Perolehan',
      'Capaian (%)',
      'Bobot Kemenag (%)',
      'Nilai Tertimbang',
    ],
  ];

  summaries.forEach((s, idx) => {
    recapData.push([
      (idx + 1).toString(),
      s.componentName,
      s.totalIndicators.toString(),
      s.assessedIndicators.toString(),
      s.evidenceCompleteCount.toString(),
      s.maxScore.toString(),
      s.totalScore.toString(),
      s.scorePercentage.toFixed(2),
      (components.find((c: PKKMComponent) => c.id === s.componentId)?.weight || 0).toString(),
      s.weightedScore.toFixed(2),
    ]);
  });

  recapData.push([
    '',
    'TOTAL / NILAI AKHIR KINERJA',
    overall.totalIndicators.toString(),
    overall.completedIndicators.toString(),
    overall.indicatorsWithEvidence.toString(),
    overall.maxPossibleScore.toString(),
    overall.totalScore.toString(),
    overall.percentageScore.toFixed(2),
    '100',
    overall.percentageScore.toFixed(2),
  ]);

  recapData.push([]);
  recapData.push(['PREDIKAT KINERJA', `${overall.predicate} (${overall.predicateGrade})`]);
  recapData.push(['STATUS HASIL', overall.status]);

  const wsRecap = XLSX.utils.aoa_to_sheet(recapData);
  XLSX.utils.book_append_sheet(wb, wsRecap, 'Rekapitulasi Nilai');

  // Sheet 2: Data Rincian Bukti Fisik & Eviden
  const detailData = [
    [
      'Kode',
      'Komponen',
      'Sub-Unsur',
      'Kriteria Indikator',
      'Bukti Fisik yang Dipersyaratkan',
      'Status Eviden',
      'Jumlah Berkas',
      'Daftar Berkas Eviden',
      'Tautan Google Drive / Dokumen',
      'Skor (1-4)',
      'Catatan Tim Asesor',
      'Nama Penilai',
      'Waktu Penilaian',
    ],
  ];

  indicators.forEach((ind) => {
    const hasEv = ind.evidences.length > 0;
    const fileTitles = hasEv ? ind.evidences.map((e) => e.title).join(' | ') : 'Belum Ada Eviden';
    const urls = hasEv ? ind.evidences.map((e) => e.url).join(' | ') : '-';

    detailData.push([
      ind.code,
      ind.componentName,
      ind.subComponentName,
      ind.criteria,
      ind.requiredEvidenceDescription,
      hasEv ? 'Lengkap Terlampir' : 'KOSONG (TIDAK DINILAI)',
      ind.evidences.length.toString(),
      fileTitles,
      urls,
      hasEv ? (ind.score > 0 ? ind.score.toString() : 'Belum Dinilai') : '0 (Terkunci)',
      ind.assessorNotes || '-',
      ind.assessorName || '-',
      ind.assessedAt || '-',
    ]);
  });

  const wsDetail = XLSX.utils.aoa_to_sheet(detailData);
  XLSX.utils.book_append_sheet(wb, wsDetail, 'Instrumen & Bukti Fisik');

  XLSX.writeFile(wb, `Rekap_PKKM_MTsN7Kebumen_${profile.academicYear.replace('/', '-')}.xlsx`);
}
