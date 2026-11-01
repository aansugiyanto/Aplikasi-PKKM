/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AlertTriangle, X, UploadCloud, Link as LinkIcon, ShieldAlert } from 'lucide-react';
import { PKKMIndicator } from '../types/pkkm';

interface NoEvidenceAlertModalProps {
  isOpen: boolean;
  indicator: PKKMIndicator | null;
  onClose: () => void;
  onOpenEvidenceUpload: (indicator: PKKMIndicator) => void;
}

export const NoEvidenceAlertModal: React.FC<NoEvidenceAlertModalProps> = ({
  isOpen,
  indicator,
  onClose,
  onOpenEvidenceUpload,
}) => {
  if (!isOpen || !indicator) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-amber-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-700/50 rounded-xl">
              <ShieldAlert className="w-6 h-6 text-amber-100" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Penilaian Tidak Dapat Dilakukan</h3>
              <p className="text-xs text-amber-100">SOP Standar PKKM Kementerian Agama RI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-100 hover:text-white hover:bg-amber-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1 text-sm">
              <p className="font-semibold text-amber-950">
                Belum Ada Bukti Fisik (Eviden) Terlampir!
              </p>
              <p className="text-amber-800 leading-relaxed text-xs">
                Sistem mendeteksi bahwa indikator{' '}
                <span className="font-bold underline">[{indicator.code}] {indicator.subComponentName}</span> belum memiliki dokumen bukti fisik yang diunggah atau disematkan tautan Google Drive-nya.
              </p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>📋</span> Ketentuan Penilaian Bukti Fisik:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600">
              <li>Penilai (Asesor) dilarang memberikan skor tanpa adanya dokumen bukti fisik riil.</li>
              <li>Madrasah wajib melampirkan minimal 1 (satu) bukti fisik valid berupa link Google Drive atau unggahan dokumen.</li>
              <li>Bukti fisik yang dipersyaratkan:</li>
            </ul>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-slate-800 font-medium italic">
              "{indicator.requiredEvidenceDescription}"
            </div>
          </div>

          <div className="text-xs text-slate-500 text-center">
            Silakan unggah dokumen atau sematkan link Google Drive terlebih dahulu untuk membuka formulir penilaian.
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenEvidenceUpload(indicator);
            }}
            className="px-4 py-2 text-sm font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Lampirkan Bukti Fisik Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
