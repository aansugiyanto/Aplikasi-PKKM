/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Award,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Building2,
  Briefcase,
  UserCheck,
  CheckCircle2,
  FolderTree,
} from 'lucide-react';
import {
  PKKMComponent,
  ComponentScoreSummary,
  PKKMOverallScore,
  PKKMIndicator,
} from '../types/pkkm';

interface DashboardOverviewProps {
  components: PKKMComponent[];
  summaries: ComponentScoreSummary[];
  overall: PKKMOverallScore;
  selectedComponentId: number | 'all';
  activeFilter: 'all' | 'need_evidence' | 'ready_to_grade' | 'graded';
  searchQuery: string;
  onSelectComponent: (id: number | 'all') => void;
  onFilterChange: (filter: 'all' | 'need_evidence' | 'ready_to_grade' | 'graded') => void;
  onSearchChange: (query: string) => void;
  onOpenDriveModal: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  components,
  summaries,
  overall,
  selectedComponentId,
  activeFilter,
  searchQuery,
  onSelectComponent,
  onFilterChange,
  onSearchChange,
  onOpenDriveModal,
}) => {
  // Hitung persentase keterisian eviden & penilaian
  const evidencePercent = overall.totalIndicators > 0
    ? Math.round((overall.indicatorsWithEvidence / overall.totalIndicators) * 100)
    : 0;
  
  const assessmentPercent = overall.totalIndicators > 0
    ? Math.round((overall.completedIndicators / overall.totalIndicators) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Visual KPI Hero Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-emerald-700/50">
        {/* Subtle decorative background Islamic pattern */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-72 h-72 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Nilai Akhir & Predikat Radial Card */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left bg-emerald-950/60 p-6 rounded-2xl border border-emerald-700/60 backdrop-blur-xs">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Nilai Kinerja Terhitung Otomatis</span>
            </div>

            <div className="flex items-baseline gap-3 my-1">
              <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                {overall.percentageScore.toFixed(2)}
              </span>
              <span className="text-emerald-300 font-bold text-sm">/ 100</span>
            </div>

            {/* Predikat Badge */}
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-md">
                PREDIKAT: {overall.predicate.toUpperCase()} ({overall.predicateGrade})
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-emerald-800/80 text-emerald-200 font-bold text-xs border border-emerald-600/50">
                {overall.status}
              </span>
            </div>

            <p className="text-[11px] text-emerald-300/80 mt-3 leading-relaxed">
              Dihitung otomatis berdasarkan bobot standar Dirjen Pendis Kemenag No. 1111/2019.
            </p>
          </div>

          {/* Quick Metrics Columns */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Metrik 1: Progres Penilaian Asesor */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Progres Penilaian Asesor
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {assessmentPercent}%
                  </span>
                  <span className="text-xs text-emerald-200">
                    {overall.completedIndicators} dari {overall.totalIndicators} Dinilai
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full h-2 bg-emerald-950/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${assessmentPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metrik 2: Pemenuhan Eviden Fisik */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">
                  Kelengkapan Eviden Fisik
                </span>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">
                    {evidencePercent}%
                  </span>
                  <span className="text-xs text-emerald-200">
                    {overall.indicatorsWithEvidence} dari {overall.totalIndicators} Ada Eviden
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full h-2 bg-emerald-950/70 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${evidencePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Metrik 3: Deteksi Indikator Belum Ada Eviden */}
            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-rose-300 text-[11px] font-bold uppercase tracking-wider">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Belum Ada Eviden</span>
                </div>
                <div className="flex items-baseline justify-between mt-2">
                  <span className="text-2xl sm:text-3xl font-extrabold text-rose-200">
                    {overall.indicatorsWithoutEvidence}
                  </span>
                  <span className="text-[11px] text-rose-200/90 font-medium">
                    Terkunci dari Penilaian
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-emerald-200/80 mt-2 line-clamp-2">
                {overall.indicatorsWithoutEvidence > 0
                  ? 'Perlu segera diunggah berkasnya sebelum tim penilai dapat memberikan skor.'
                  : 'Seluruh indikator telah memiliki bukti fisik terlampir.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Component Visual Cards (5 Komponen Tugas Utama) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <h2 className="text-sm sm:text-base font-bold text-slate-800">
              Progres Per Komponen Tugas Utama (Standar Kemenag)
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            Klik komponen untuk menyaring indikator
          </span>
        </div>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            components.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-5'
          } gap-3.5`}
        >
          {summaries.map((s) => {
            const isSelected = selectedComponentId === s.componentId;
            const comp = components.find((c) => c.id === s.componentId);

            return (
              <button
                key={s.componentId}
                onClick={() => onSelectComponent(isSelected ? 'all' : s.componentId)}
                className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 shadow-md'
                    : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                    Komp {s.componentId} ({comp?.weight}%)
                  </span>
                  <span className="text-xs font-bold text-emerald-800 font-mono">
                    {s.scorePercentage.toFixed(0)}%
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 line-clamp-2 h-8 leading-snug">
                  {s.componentName}
                </h3>

                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Tertimbang:</span>
                    <strong className="text-emerald-800 font-bold">{s.weightedScore.toFixed(2)}</strong>
                  </div>

                  {/* Mini Progress */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${s.progressPercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5">
                    <span>Dinilai: {s.assessedIndicators}/{s.totalIndicators}</span>
                    <span className={s.evidenceCompleteCount < s.totalIndicators ? 'text-amber-600 font-semibold' : 'text-emerald-600 font-semibold'}>
                      {s.evidenceCompleteCount}/{s.totalIndicators} Eviden
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari indikator, kriteria, kode, atau berkas bukti fisik..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              activeFilter === 'all'
                ? 'bg-emerald-800 text-white font-bold shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({overall.totalIndicators})
          </button>

          <button
            onClick={() => onFilterChange('need_evidence')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeFilter === 'need_evidence'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Belum Ada Eviden ({overall.indicatorsWithoutEvidence})</span>
          </button>

          <button
            onClick={() => onFilterChange('ready_to_grade')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeFilter === 'ready_to_grade'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Siap Dinilai ({overall.indicatorsWithEvidence - overall.completedIndicators})</span>
          </button>

          <button
            onClick={() => onFilterChange('graded')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeFilter === 'graded'
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Selesai Dinilai ({overall.completedIndicators})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
