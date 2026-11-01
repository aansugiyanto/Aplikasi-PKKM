/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  FileSpreadsheet,
  Download,
  Printer,
  CheckCircle2,
  Award,
  Building,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import {
  MadrasahProfile,
  PKKMComponent,
  ComponentScoreSummary,
  PKKMOverallScore,
  PKKMIndicator,
} from '../types/pkkm';
import { exportPKKMToPDF, exportPKKMToExcel } from '../services/exportService';

interface ScoreRecapModalProps {
  isOpen: boolean;
  profile: MadrasahProfile;
  components: PKKMComponent[];
  indicators: PKKMIndicator[];
  summaries: ComponentScoreSummary[];
  overall: PKKMOverallScore;
  onClose: () => void;
}

export const ScoreRecapModal: React.FC<ScoreRecapModalProps> = ({
  isOpen,
  profile,
  components,
  indicators,
  summaries,
  overall,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <Award className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Rekapitulasi Nilai {profile.assessmentYear === 4 ? 'PKKM 4 Tahunan' : `PKKM Tahun ke-${profile.assessmentYear || 1}`}
              </h3>
              <p className="text-xs text-emerald-200">
                {profile.name} • TP {profile.academicYear} •{' '}
                {components.length} Komponen Tugas Utama
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Identity Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <Building className="w-4 h-4 text-emerald-700" />
                Data Madrasah:
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Nama Lembaga:</span> {profile.name}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">NSM / NPSN:</span> {profile.nsm} / {profile.npsn}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Kepala Madrasah:</span> {profile.headmasterName}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">NIP Kepala Madrasah:</span> {profile.headmasterNip}
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-slate-800 flex items-center gap-1.5 text-sm">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                Tim Penilai (Pengawas Kemenag Kebumen):
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Asesor 1:</span> {profile.assessor1Name} (NIP: {profile.assessor1Nip})
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Asesor 2:</span> {profile.assessor2Name} (NIP: {profile.assessor2Nip})
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Periode Penilaian:</span> {profile.evaluationPeriod}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-700">Status Kelengkapan:</span>{' '}
                <span className="font-bold text-emerald-700">
                  {overall.completedIndicators}/{overall.totalIndicators} Indikator Selesai ({((overall.completedIndicators / overall.totalIndicators) * 100).toFixed(0)}%)
                </span>
              </p>
            </div>
          </div>

          {/* Tabel Rekapitulasi 5 Unsur Komponen */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-emerald-800 text-white font-bold">
                <tr>
                  <th className="py-2.5 px-3 text-center">No</th>
                  <th className="py-2.5 px-3">Unsur Tugas Utama Kepala Madrasah</th>
                  <th className="py-2.5 px-3 text-center">Jml Indikator</th>
                  <th className="py-2.5 px-3 text-center">Eviden Lengkap</th>
                  <th className="py-2.5 px-3 text-center">Skor Maks</th>
                  <th className="py-2.5 px-3 text-center">Skor Perolehan</th>
                  <th className="py-2.5 px-3 text-center">Nilai Komponen</th>
                  <th className="py-2.5 px-3 text-center">Bobot</th>
                  <th className="py-2.5 px-3 text-center bg-emerald-900">Skor Tertimbang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {summaries.map((s, idx) => {
                  const comp = components.find((c) => c.id === s.componentId);
                  return (
                    <tr key={s.componentId} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {s.componentName}
                        <p className="text-[11px] font-normal text-slate-500 mt-0.5 line-clamp-1">
                          {comp?.description}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-700">{s.totalIndicators}</td>
                      <td className="py-3 px-3 text-center font-semibold text-emerald-700">
                        {s.evidenceCompleteCount}/{s.totalIndicators}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">{s.maxScore}</td>
                      <td className="py-3 px-3 text-center font-bold text-slate-900">{s.totalScore}</td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-800">
                        {s.scorePercentage.toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">{comp?.weight}%</td>
                      <td className="py-3 px-3 text-center font-bold text-emerald-800 bg-emerald-50/50 text-sm">
                        {s.weightedScore.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-3 px-4 text-slate-900 uppercase">
                    Nilai Akhir Kinerja Kepala Madrasah
                  </td>
                  <td className="py-3 px-3 text-center">{overall.totalIndicators}</td>
                  <td className="py-3 px-3 text-center text-emerald-800">{overall.indicatorsWithEvidence}</td>
                  <td className="py-3 px-3 text-center">{overall.maxPossibleScore}</td>
                  <td className="py-3 px-3 text-center text-slate-900">{overall.totalScore}</td>
                  <td className="py-3 px-3 text-center">{overall.percentageScore.toFixed(2)}%</td>
                  <td className="py-3 px-3 text-center">100%</td>
                  <td className="py-3 px-3 text-center text-base font-extrabold text-emerald-900 bg-emerald-100">
                    {overall.percentageScore.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Predikat & Status Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border border-emerald-300 flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                Hasil Penilaian Akhir (Dirjen Pendis Kemenag No. 1111/2019)
              </span>
              <div className="flex items-center gap-3">
                <span className="text-3xl font-black text-emerald-950">
                  {overall.percentageScore.toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-emerald-600 text-white font-black text-sm rounded-xl shadow-xs">
                  Predikat: {overall.predicate} ({overall.predicateGrade})
                </span>
              </div>
            </div>

            <div className="text-right text-xs text-slate-600 space-y-0.5">
              <p>
                <span className="font-semibold text-slate-800">Keterangan:</span> {overall.status}
              </p>
              <p className="text-[11px] text-slate-500">
                Skor 91-100 (Amat Baik), 76-90 (Baik), 61-75 (Cukup), 51-60 (Sedang), ≤50 (Kurang)
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => exportPKKMToExcel(profile, components, indicators, summaries, overall)}
              className="px-3.5 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-300 rounded-xl shadow-xs flex items-center gap-2 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              <span>Ekspor Excel (.xlsx)</span>
            </button>
            <button
              onClick={() => exportPKKMToPDF(profile, components, indicators, summaries, overall)}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Cetak / Ekspor PDF Resmi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
