/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Lock,
  Upload,
  ExternalLink,
  FolderOpen,
  Edit3,
  FileText,
  User,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Layers,
  CheckSquare,
} from 'lucide-react';
import { PKKMIndicator, EvidenceItem, PhysicalEvidence } from '../types/pkkm';

interface AssessmentTableProps {
  indicators: PKKMIndicator[];
  currentRole: 'assessor' | 'madrasah';
  assessorName: string;
  onUpdateScore: (indicatorId: string, score: 0 | 1 | 2 | 3 | 4, notes?: string) => void;
  onUpdateEvidenceItemScore: (
    indicatorId: string,
    itemId: string,
    score: 0 | 1 | 2 | 3 | 4,
    notes?: string
  ) => void;
  onOpenEvidenceModal: (indicator: PKKMIndicator, targetItem?: EvidenceItem) => void;
  onOpenNoEvidenceAlert: (indicator: PKKMIndicator) => void;
}

export const AssessmentTable: React.FC<AssessmentTableProps> = ({
  indicators,
  currentRole,
  assessorName,
  onUpdateScore,
  onUpdateEvidenceItemScore,
  onOpenEvidenceModal,
  onOpenNoEvidenceAlert,
}) => {
  // State per-indicator expanded view for evidence items
  const [expandedIndicators, setExpandedIndicators] = useState<Record<string, boolean>>(() => {
    // Default expand all indicators
    const initial: Record<string, boolean> = {};
    indicators.forEach((ind) => {
      initial[ind.id] = true;
    });
    return initial;
  });

  const toggleExpand = (id: string) => {
    setExpandedIndicators((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleIndicatorScoreClick = (
    ind: PKKMIndicator,
    targetScore: 1 | 2 | 3 | 4
  ) => {
    // STRICT VALIDASI: Jika belum ada bukti fisik sama sekali, tolak penilaian!
    if (ind.evidences.length === 0 && !ind.evidenceItems.some((bi) => bi.isAttached)) {
      onOpenNoEvidenceAlert(ind);
      return;
    }

    onUpdateScore(ind.id, targetScore, ind.assessorNotes);
  };

  const handleItemScoreClick = (
    ind: PKKMIndicator,
    item: EvidenceItem,
    targetScore: 1 | 2 | 3 | 4
  ) => {
    if (!item.isAttached) {
      onOpenNoEvidenceAlert(ind);
      return;
    }

    onUpdateEvidenceItemScore(ind.id, item.id, targetScore, item.assessorNotes);
  };

  if (indicators.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center shadow-xs">
        <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-700">Tidak Ada Indikator yang Sesuai</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
          Tidak ditemukan indikator PKKM dengan kata kunci pencarian atau saringan yang dipilih. Coba reset filter.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {indicators.map((ind) => {
        const hasEvidence =
          ind.evidences.length > 0 || ind.evidenceItems.some((bi) => bi.isAttached);
        const isGraded = ind.score > 0;
        const isExpanded = expandedIndicators[ind.id] ?? true;

        const totalItems = ind.evidenceItems.length;
        const attachedItems = ind.evidenceItems.filter((i) => i.isAttached).length;
        const gradedItems = ind.evidenceItems.filter((i) => i.score > 0).length;

        return (
          <div
            key={ind.id}
            id={`indicator-${ind.id}`}
            className={`bg-white rounded-3xl border transition-all overflow-hidden ${
              !hasEvidence
                ? 'border-amber-300 shadow-2xs hover:border-amber-400'
                : isGraded
                ? 'border-emerald-200/90 shadow-xs hover:border-emerald-300'
                : 'border-slate-200 shadow-2xs hover:border-teal-300'
            }`}
          >
            {/* Top Indicator Header Strip */}
            <div
              onClick={() => toggleExpand(ind.id)}
              className={`px-4 sm:px-6 py-3.5 border-b flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
                !hasEvidence
                  ? 'bg-amber-50/70 border-amber-200 hover:bg-amber-50'
                  : isGraded
                  ? 'bg-emerald-50/50 border-emerald-100 hover:bg-emerald-50/70'
                  : 'bg-slate-50/80 border-slate-100 hover:bg-slate-100/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-slate-900 text-white shadow-2xs">
                    {ind.code}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {ind.componentName}
                  </span>
                </div>
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {!hasEvidence ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Belum Ada Eviden (Tidak Dilakukan Penilaian)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {attachedItems}/{totalItems} Butir Terpenuhi
                    </span>
                  </span>
                )}

                <div className="flex items-center gap-1.5 bg-white py-0.5 px-2.5 rounded-xl border border-slate-200 text-xs font-black">
                  <span className="text-slate-500 font-medium">Skor Indikator:</span>
                  <span
                    className={`font-mono ${
                      ind.score > 0 ? 'text-emerald-800 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {ind.score > 0 ? ind.score : 'Belum'}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicator Details & Evidence Items Body */}
            {isExpanded && (
              <div className="p-4 sm:p-6 space-y-5 animate-in fade-in">
                {/* Title & Criteria */}
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {ind.subComponentName}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    <strong className="text-slate-800">Kriteria Penilaian:</strong> {ind.criteria}
                  </p>
                </div>

                {/* Box Bukti Fisik yang Dipersyaratkan Juknis */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                    <FileText className="w-3.5 h-3.5 text-emerald-700" />
                    Ketentuan Eviden Fisik Standar Kemenag:
                  </span>
                  <p className="text-slate-600 italic">"{ind.requiredEvidenceDescription}"</p>
                </div>

                {/* PENILAIAN SETIAP BUTIR BUKTI DUKUNG */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Penilaian Tiap-Tiap Butir Bukti Dukung ({totalItems} Butir):
                      </h4>
                    </div>

                    <div className="flex items-center gap-2">
                      {ind.driveFolderUrl && (
                        <a
                          href={ind.driveFolderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200"
                          title="Buka Folder Google Drive Indikator Ini"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Folder Drive</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* List Butir Bukti Dukung */}
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50 shadow-2xs">
                    {ind.evidenceItems.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 sm:p-4 transition-colors ${
                          !item.isAttached
                            ? 'bg-amber-50/40 hover:bg-amber-50/70'
                            : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          {/* Info Butir */}
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {item.code}
                              </span>
                              <span className="font-bold text-xs text-slate-900">
                                {item.name}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              {item.description}
                            </p>

                            {/* Status Lampiran Berkas & Tombol Unggah / Buka Berkas */}
                            <div className="pt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                              {item.isAttached ? (
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    <span>Bukti Terlampir</span>
                                  </span>

                                  {/* Tombol Unggah / Ganti Berkas per butir */}
                                  <button
                                    type="button"
                                    onClick={() => onOpenEvidenceModal(ind, item)}
                                    className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:bg-emerald-50 bg-white px-2 py-0.5 rounded-md border border-emerald-300 shadow-2xs hover:border-emerald-400 transition-colors"
                                    title={`Unggah atau perbarui berkas untuk: ${item.name}`}
                                  >
                                    <Upload className="w-3 h-3 text-emerald-600" />
                                    <span>Unggah Berkas</span>
                                  </button>

                                  {item.evidenceFileUrl && (
                                    <a
                                      href={item.evidenceFileUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1 text-teal-800 font-semibold hover:underline bg-white px-2 py-0.5 rounded-md border border-slate-200"
                                      title="Buka berkas di tab baru"
                                    >
                                      <ExternalLink className="w-3 h-3 text-teal-600" />
                                      <span>Buka Berkas</span>
                                    </a>
                                  )}

                                  {item.evidenceUploadedBy && (
                                    <span className="text-slate-400">
                                      • Oleh: {item.evidenceUploadedBy}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-100/80 px-2.5 py-0.5 rounded-md border border-amber-300">
                                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                                    <span>Belum Ada Bukti Fisik Terlampir</span>
                                  </span>

                                  {/* Tombol Unggah Berkas jika belum ada bukti */}
                                  <button
                                    type="button"
                                    onClick={() => onOpenEvidenceModal(ind, item)}
                                    className="inline-flex items-center gap-1 text-emerald-900 font-bold bg-emerald-100 hover:bg-emerald-200 px-2.5 py-0.5 rounded-md border border-emerald-400 shadow-2xs transition-colors"
                                    title={`Unggah berkas bukti dukung untuk: ${item.name}`}
                                  >
                                    <Upload className="w-3 h-3 text-emerald-700" />
                                    <span>Unggah Berkas</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Tombol Penilaian per Butir Bukti Dukung */}
                          <div className="shrink-0 space-y-1 bg-slate-50 p-2.5 rounded-2xl border border-slate-200/80">
                            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-600 font-bold">
                              <span>Skor Butir:</span>
                              {!item.isAttached && (
                                <span className="text-amber-700 flex items-center gap-0.5">
                                  <Lock className="w-2.5 h-2.5" />
                                  Terkunci
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {([1, 2, 3, 4] as const).map((sc) => {
                                const isSelected = item.score === sc;
                                return (
                                  <button
                                    key={sc}
                                    type="button"
                                    onClick={() => handleItemScoreClick(ind, item, sc)}
                                    className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center transition-all ${
                                      !item.isAttached
                                        ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed hover:bg-amber-100 hover:text-amber-800'
                                        : isSelected
                                        ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600/40 font-black'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                                    }`}
                                    title={
                                      !item.isAttached
                                        ? 'Tidak dapat dinilai sebelum bukti dukung dilampirkan'
                                        : `Beri nilai ${sc}`
                                    }
                                  >
                                    {!item.isAttached ? <Lock className="w-3 h-3" /> : sc}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nilai Akhir Indikator & Catatan Verifikasi */}
                <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-700">
                      Skor Total Indikator [{ind.code}]:
                    </span>
                    <div className="flex items-center gap-1.5">
                      {([1, 2, 3, 4] as const).map((sc) => {
                        const isSelected = ind.score === sc;
                        const label =
                          sc === 4
                            ? '4 (Sangat Baik)'
                            : sc === 3
                            ? '3 (Baik)'
                            : sc === 2
                            ? '2 (Cukup)'
                            : '1 (Kurang)';
                        return (
                          <button
                            key={sc}
                            type="button"
                            onClick={() => handleIndicatorScoreClick(ind, sc)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              !hasEvidence
                                ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                : isSelected
                                ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30'
                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {ind.assessorNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-200 max-w-md">
                      <p className="font-bold text-slate-700 text-[11px]">Catatan Asesor:</p>
                      <p className="italic text-[11px] mt-0.5">"{ind.assessorNotes}"</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
