/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  Building,
  Award,
  Layers,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import {
  MadrasahProfile,
  PKKMComponent,
  PKKMIndicator,
  ComponentScoreSummary,
  PKKMOverallScore,
} from '../types/pkkm';

interface PrintReportModalProps {
  isOpen: boolean;
  profile: MadrasahProfile;
  components: PKKMComponent[];
  indicators: PKKMIndicator[];
  summaries: ComponentScoreSummary[];
  overall: PKKMOverallScore;
  onClose: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export const PrintReportModal: React.FC<PrintReportModalProps> = ({
  isOpen,
  profile,
  components,
  indicators,
  summaries,
  overall,
  onClose,
  onExportPDF,
  onExportExcel,
}) => {
  if (!isOpen) return null;

  const [activeView, setActiveView] = useState<'all' | 'recap' | 'items'>('all');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Top Control Bar (Hidden on print) */}
        <div className="print:hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-2xl">
              <Printer className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Fasilitas Cetak Hasil Penilaian PKKM</h3>
              <p className="text-xs text-emerald-200">
                Format Berkas Dinas Resmi Kankemenag Kab. Kebumen • {profile.name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="bg-emerald-950/80 p-1 rounded-xl border border-emerald-700/80 text-xs font-semibold flex items-center">
              <button
                onClick={() => setActiveView('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeView === 'all' ? 'bg-emerald-700 text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Lengkap (Semua)
              </button>
              <button
                onClick={() => setActiveView('recap')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeView === 'recap' ? 'bg-emerald-700 text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Rekap & Berita Acara
              </button>
              <button
                onClick={() => setActiveView('items')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  activeView === 'items' ? 'bg-emerald-700 text-white font-bold' : 'text-emerald-300 hover:text-white'
                }`}
              >
                Butir Bukti Dukung
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:bg-white print:p-0">
          <div className="max-w-[210mm] mx-auto bg-white p-8 sm:p-12 shadow-md print:shadow-none print:p-4 rounded-xl border border-slate-200 print:border-0 font-serif text-slate-900 leading-relaxed text-xs">
            {/* 1. KOP SURAT RESMI */}
            <div className="text-center pb-4 border-b-2 border-emerald-900 mb-6 relative">
              <div className="absolute left-0 top-1 text-emerald-800 hidden sm:block">
                <div className="w-16 h-16 border-2 border-emerald-800 rounded-full flex items-center justify-center font-bold text-xs">
                  IKHLAS<br />BERAMAL
                </div>
              </div>
              <p className="font-bold tracking-wider text-xs text-slate-800">
                KEMENTERIAN AGAMA REPUBLIK INDONESIA
              </p>
              <p className="font-bold tracking-wider text-sm text-slate-900">
                KANTOR KEMENTERIAN AGAMA KABUPATEN KEBUMEN
              </p>
              <h1 className="text-lg sm:text-xl font-extrabold text-emerald-900 tracking-wide mt-0.5">
                {profile.name.toUpperCase()}
              </h1>
              <p className="text-[11px] text-slate-600 font-sans mt-0.5">
                {profile.address}, {profile.subdistrict}, {profile.regency}, {profile.province} {profile.postalCode}
              </p>
              <p className="text-[10px] text-slate-500 font-sans">
                Telp: {profile.phoneNumber} | Email: {profile.email} | Website: {profile.website}
              </p>
              <p className="text-[10px] text-slate-500 font-sans font-semibold">
                NSM: {profile.nsm} | NPSN: {profile.npsn} | Akreditasi: {profile.accreditationGrade}
              </p>

              {/* Garis Ganda Kop Surat */}
              <div className="w-full h-0.5 bg-emerald-900 mt-3" />
              <div className="w-full h-px bg-slate-400 mt-0.5" />
            </div>

            {/* 2. JUDUL DOKUMEN */}
            <div className="text-center my-6 space-y-1">
              <h2 className="text-sm sm:text-base font-extrabold underline tracking-wide uppercase text-slate-900">
                LAPORAN HASIL PENILAIAN KINERJA KEPALA MADRASAH{' '}
                {profile.assessmentYear === 4
                  ? '(PKKM 4 TAHUNAN)'
                  : `(PKKM TAHUN KE-${profile.assessmentYear || 1})`}
              </h2>
              <p className="text-xs font-semibold text-slate-700">
                Tahun Ajaran: {profile.academicYear} •{' '}
                {profile.assessmentYear === 4
                  ? 'Penilaian 4 Tahunan (5 Komponen Tugas Utama Lengkap)'
                  : `Penilaian Tahunan (Tahun ke-${profile.assessmentYear || 1} - 4 Komponen Tugas Utama)`}
              </p>
            </div>

            {/* 3. LEMBAR IDENTITAS LENGKAP */}
            {(activeView === 'all' || activeView === 'recap') && (
              <div className="mb-6 space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 border-b border-emerald-900/30 pb-1">
                  I. IDENTITAS KEPALA MADRASAH, MADRASAH & PENILAI
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
                  {/* Kolom Kiri: Madrasah & Kamad */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1">
                      A. Identitas Kepala Madrasah yang Dinilai:
                    </p>
                    <p><strong>Nama Lengkap:</strong> {profile.headmasterName}</p>
                    <p><strong>NIP:</strong> {profile.headmasterNip}</p>
                    <p><strong>Pangkat / Golongan:</strong> {profile.headmasterRank}</p>
                    <p><strong>TMT Kepala Madrasah:</strong> {profile.headmasterTMT}</p>
                    <p><strong>Masa Tugas:</strong> {profile.headmasterPeriod}</p>
                    <p><strong>Pendidikan Terakhir:</strong> {profile.headmasterEducation}</p>
                    <p className="pt-1.5 font-bold text-slate-800 border-t border-slate-200 mt-2">
                      B. Identitas Madrasah:
                    </p>
                    <p><strong>Nama Lembaga:</strong> {profile.name}</p>
                    <p><strong>NSM / NPSN:</strong> {profile.nsm} / {profile.npsn}</p>
                    <p><strong>Alamat:</strong> {profile.address}, {profile.subdistrict}</p>
                  </div>

                  {/* Kolom Kanan: Tim Penilai & Pelaksanaan */}
                  <div className="space-y-1.5 p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <p className="font-bold text-slate-800 text-xs border-b border-slate-200 pb-1">
                      C. Tim Penilai (Asesor Pengawas Kemenag):
                    </p>
                    <p><strong>Penilai 1:</strong> {profile.assessor1Name}</p>
                    <p><strong>NIP Penilai 1:</strong> {profile.assessor1Nip}</p>
                    <p><strong>Jabatan Penilai 1:</strong> {profile.assessor1Position}</p>
                    <p className="pt-1"><strong>Penilai 2:</strong> {profile.assessor2Name}</p>
                    <p><strong>NIP Penilai 2:</strong> {profile.assessor2Nip}</p>
                    <p><strong>Jabatan Penilai 2:</strong> {profile.assessor2Position}</p>
                    <p className="pt-1.5 font-bold text-slate-800 border-t border-slate-200 mt-2">
                      D. Pelaksanaan PKKM:
                    </p>
                    <p><strong>Hari / Tanggal:</strong> {profile.evaluationDate}</p>
                    <p><strong>Tempat:</strong> {profile.evaluationPlace}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. TABEL REKAPITULASI HASIL PENILAIAN */}
            {(activeView === 'all' || activeView === 'recap') && (
              <div className="mb-6 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 border-b border-emerald-900/30 pb-1">
                  II. REKAPITULASI NILAI TUGAS UTAMA KEPALA MADRASAH
                </h3>

                <table className="w-full border-collapse border border-slate-400 text-[11px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold">
                      <th className="border border-slate-400 p-2 text-center w-8">No</th>
                      <th className="border border-slate-400 p-2 text-left">Unsur Tugas Utama Kepala Madrasah</th>
                      <th className="border border-slate-400 p-2 text-center">Jml Ind</th>
                      <th className="border border-slate-400 p-2 text-center">Butir Bukti</th>
                      <th className="border border-slate-400 p-2 text-center">Skor Maks</th>
                      <th className="border border-slate-400 p-2 text-center">Skor Riil</th>
                      <th className="border border-slate-400 p-2 text-center">Capaian %</th>
                      <th className="border border-slate-400 p-2 text-center">Bobot %</th>
                      <th className="border border-slate-400 p-2 text-center bg-slate-300">Nilai Tertimbang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summaries.map((s, idx) => {
                      const comp = components.find((c) => c.id === s.componentId);
                      return (
                        <tr key={s.componentId}>
                          <td className="border border-slate-400 p-2 text-center">{idx + 1}</td>
                          <td className="border border-slate-400 p-2 font-medium">{s.componentName}</td>
                          <td className="border border-slate-400 p-2 text-center">{s.totalIndicators}</td>
                          <td className="border border-slate-400 p-2 text-center">{s.totalEvidenceItems}</td>
                          <td className="border border-slate-400 p-2 text-center">{s.maxScore}</td>
                          <td className="border border-slate-400 p-2 text-center font-bold">{s.totalScore}</td>
                          <td className="border border-slate-400 p-2 text-center">{s.scorePercentage.toFixed(2)}%</td>
                          <td className="border border-slate-400 p-2 text-center">{comp?.weight}%</td>
                          <td className="border border-slate-400 p-2 text-center font-bold bg-slate-50">
                            {s.weightedScore.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-200 font-bold">
                      <td colSpan={2} className="border border-slate-400 p-2 uppercase">
                        NILAI AKHIR KINERJA KEPALA MADRASAH
                      </td>
                      <td className="border border-slate-400 p-2 text-center">{overall.totalIndicators}</td>
                      <td className="border border-slate-400 p-2 text-center">{overall.totalEvidenceItems}</td>
                      <td className="border border-slate-400 p-2 text-center">{overall.maxPossibleScore}</td>
                      <td className="border border-slate-400 p-2 text-center">{overall.totalScore}</td>
                      <td className="border border-slate-400 p-2 text-center">{overall.percentageScore.toFixed(2)}%</td>
                      <td className="border border-slate-400 p-2 text-center">100%</td>
                      <td className="border border-slate-400 p-2 text-center text-sm font-extrabold bg-slate-300 text-emerald-950">
                        {overall.percentageScore.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Box Kesimpulan Nilai & Predikat */}
                <div className="p-3 bg-emerald-50/80 border border-emerald-400 rounded-lg flex items-center justify-between gap-4 font-sans text-xs">
                  <div>
                    <span className="font-bold text-emerald-950">
                      HASIL PENILAIAN KINERJA: SKOR = {overall.percentageScore.toFixed(2)} / 100
                    </span>
                    <p className="text-[11px] text-emerald-800">
                      Kategori Predikat: <strong className="underline">{overall.predicate.toUpperCase()} ({overall.predicateGrade})</strong> • Status: <strong>{overall.status.toUpperCase()}</strong>
                    </p>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    Standar Kemenag RI Keputusan Dirjen Pendis No. 1111/2019
                  </div>
                </div>
              </div>
            )}

            {/* 5. TABEL RINCIAN TIAP-TIAP BUTIR BUKTI DUKUNG */}
            {(activeView === 'all' || activeView === 'items') && (
              <div className="my-6 space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-900 border-b border-emerald-900/30 pb-1">
                  III. RINCIAN PENILAIAN PER BUTIR BUKTI DUKUNG
                </h3>

                <table className="w-full border-collapse border border-slate-400 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 text-slate-900 font-bold">
                      <th className="border border-slate-400 p-1.5 text-center w-12">Kode</th>
                      <th className="border border-slate-400 p-1.5 text-left">Butir Bukti Dukung yang Dinilai</th>
                      <th className="border border-slate-400 p-1.5 text-center w-24">Status Eviden</th>
                      <th className="border border-slate-400 p-1.5 text-center w-14">Skor (1-4)</th>
                      <th className="border border-slate-400 p-1.5 text-left">Catatan Verifikasi Asesor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {indicators.flatMap((ind) =>
                      ind.evidenceItems.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="border border-slate-400 p-1.5 text-center font-mono font-bold">
                            {item.code}
                          </td>
                          <td className="border border-slate-400 p-1.5">
                            <span className="font-bold text-slate-900">{item.name}</span>
                            <p className="text-[9px] text-slate-500 mt-0.5">{item.description}</p>
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center">
                            {item.isAttached ? (
                              <span className="text-emerald-700 font-bold">✅ Terlampir</span>
                            ) : (
                              <span className="text-rose-600 font-bold">⚠️ Belum Ada</span>
                            )}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-center font-bold">
                            {item.isAttached ? (item.score > 0 ? item.score : '-') : '0 (Terkunci)'}
                          </td>
                          <td className="border border-slate-400 p-1.5 text-[9px] text-slate-600">
                            {item.assessorNotes || '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* 6. LEMBAR PENGESAHAN (TANDA TANGAN RESMI) */}
            <div className="mt-8 pt-6 border-t border-slate-300">
              <div className="text-right text-xs mb-4">
                Kebumen, {profile.evaluationDate}
              </div>

              {/* 3 Tanda Tangan Utama */}
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                {/* Penilai 1 */}
                <div className="space-y-1">
                  <p>Penilai 1 (Pengawas Madrasah),</p>
                  <div className="h-16 flex items-center justify-center italic text-slate-300 text-[10px]">
                    (Tanda Tangan & Cap)
                  </div>
                  <p className="font-bold underline">{profile.assessor1Name}</p>
                  <p className="text-[10px]">NIP. {profile.assessor1Nip}</p>
                  <p className="text-[9px] text-slate-500">{profile.assessor1Rank}</p>
                </div>

                {/* Kepala Madrasah */}
                <div className="space-y-1">
                  <p>Kepala MTs Negeri 7 Kebumen,</p>
                  <div className="h-16 flex items-center justify-center italic text-slate-300 text-[10px]">
                    (Tanda Tangan & Cap)
                  </div>
                  <p className="font-bold underline">{profile.headmasterName}</p>
                  <p className="text-[10px]">NIP. {profile.headmasterNip}</p>
                  <p className="text-[9px] text-slate-500">{profile.headmasterRank}</p>
                </div>

                {/* Penilai 2 */}
                <div className="space-y-1">
                  <p>Penilai 2 (Pengawas Madrasah),</p>
                  <div className="h-16 flex items-center justify-center italic text-slate-300 text-[10px]">
                    (Tanda Tangan & Cap)
                  </div>
                  <p className="font-bold underline">{profile.assessor2Name}</p>
                  <p className="text-[10px]">NIP. {profile.assessor2Nip}</p>
                  <p className="text-[9px] text-slate-500">{profile.assessor2Rank}</p>
                </div>
              </div>

              {/* Mengetahui Kepala Kantor Kemenag Kabupaten Kebumen */}
              <div className="text-center mt-6 pt-4 text-xs">
                <p>Mengetahui,</p>
                <p className="font-bold">Kepala Kantor Kementerian Agama Kabupaten Kebumen</p>
                <div className="h-16 flex items-center justify-center italic text-slate-300 text-[10px]">
                  (Tanda Tangan & Cap Dinas)
                </div>
                <p className="font-bold underline">{profile.headOfKemenagName}</p>
                <p className="text-[10px]">NIP. {profile.headOfKemenagNip}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Bar (Hidden on print) */}
        <div className="print:hidden bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <p className="text-xs text-slate-500">
            Kertas rekomendasi: A4 / F4 (Folio), Orientasi Portrait, Margin Default 1.5 cm.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onExportExcel}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>

            <button
              onClick={onExportPDF}
              className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-500 rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Hasil Penilaian</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
