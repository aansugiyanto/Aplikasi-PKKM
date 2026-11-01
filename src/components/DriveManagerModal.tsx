/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  FolderPlus,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Sparkles,
  Layers,
  ArrowRight,
  FolderTree,
} from 'lucide-react';
import { PKKMComponent, PKKMIndicator } from '../types/pkkm';
import { generatePKKMFolderStructure, DriveFolderStructureResult } from '../services/googleDrive';

interface DriveManagerModalProps {
  isOpen: boolean;
  academicYear: string;
  components: PKKMComponent[];
  indicators: PKKMIndicator[];
  accessToken: string | null;
  rootDriveUrl: string | null;
  onClose: () => void;
  onConnectDrive: () => void;
  onStructureGenerated: (result: DriveFolderStructureResult) => void;
}

export const DriveManagerModal: React.FC<DriveManagerModalProps> = ({
  isOpen,
  academicYear,
  components,
  indicators,
  accessToken,
  rootDriveUrl,
  onClose,
  onConnectDrive,
  onStructureGenerated,
}) => {
  if (!isOpen) return null;

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<DriveFolderStructureResult | null>(null);

  const handleGenerate = async () => {
    if (!accessToken) {
      onConnectDrive();
      return;
    }

    const confirmed = window.confirm(
      `Sistem akan membuat struktur folder PKKM di Google Drive Anda:\n- 1 Folder Utama (PKKM MTsN 7 Kebumen TP ${academicYear})\n- 5 Folder Komponen Tugas Utama\n- ${indicators.length} Subfolder Indikator Eviden.\n\nLanjutkan pembuatan folder di Google Drive?`
    );
    if (!confirmed) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setProgressMsg('Memulai koneksi ke Google Drive API...');
    setProgressPercent(5);

    try {
      const result = await generatePKKMFolderStructure(
        academicYear,
        components,
        indicators,
        accessToken,
        (msg, percent) => {
          setProgressMsg(msg);
          setProgressPercent(percent);
        }
      );

      setSuccessResult(result);
      onStructureGenerated(result);
    } catch (err: unknown) {
      console.error('Error generating Drive structure:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Gagal membuat struktur folder di Google Drive');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <FolderTree className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Struktur Google Drive PKKM</h3>
              <p className="text-xs text-emerald-200">Otomatisasi Folder & Subfolder Bukti Fisik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {!accessToken ? (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950">Google Drive Belum Terhubung</p>
                  <p className="text-amber-800 mt-1 leading-relaxed">
                    Untuk membuat folder dan subfolder secara otomatis di Google Drive Anda, silakan hubungkan akun Google Drive dengan tombol di bawah.
                  </p>
                </div>
              </div>
              <div className="pt-1 flex justify-end">
                <button
                  onClick={onConnectDrive}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                >
                  <HardDrive className="w-4 h-4" />
                  <span>Hubungkan Google Drive Sekarang</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Google Drive API Terhubung dan Siap Digunakan</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-200 text-emerald-800 font-bold rounded text-[10px]">
                OAuth Aktif
              </span>
            </div>
          )}

          {/* Penjelasan Hirarki Folder */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hirarki Folder yang Akan Dihasilkan
            </h4>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-800 font-bold">
                <FolderPlus className="w-4 h-4" />
                <span>PKKM MTsN 7 Kebumen - TP {academicYear} (Folder Utama)</span>
              </div>
              <div className="pl-6 space-y-1 text-slate-600">
                <p>├── 📁 1. Usaha Pengembangan Madrasah</p>
                <p className="pl-4 text-[11px] text-slate-500">├── 📁 Bukti [1.1.1] - Struktur Organisasi</p>
                <p className="pl-4 text-[11px] text-slate-500">├── 📁 Bukti [1.1.2] - Kualifikasi Personalia</p>
                <p>├── 📁 2. Pelaksanaan Tugas Manajerial</p>
                <p>├── 📁 3. Pengembangan Kewirausahaan</p>
                <p>├── 📁 4. Supervisi kepada Guru dan Tendik</p>
                <p>└── 📁 5. Hasil Kinerja Kepala Madrasah</p>
              </div>
            </div>
          </div>

          {/* Status Pembuatan Folder */}
          {isGenerating && (
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-900">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  {progressMsg}
                </span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Berhasil / Sudah Ada */}
          {(successResult || rootDriveUrl) && (
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 text-teal-900 text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold text-teal-950">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Folder PKKM MTs Negeri 7 Kebumen Aktif di Google Drive</span>
              </div>
              <p className="text-teal-800">
                Tiap indikator telah disematkan tautan langsung ke foldernya masing-masing sehingga tim madrasah dapat merapikan berkas bukti fisik dengan efisien.
              </p>
              <div className="pt-1">
                <a
                  href={successResult?.rootFolder.webViewLink || rootDriveUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Folder Utama di Google Drive</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            Tutup
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !accessToken}
            className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>{rootDriveUrl ? 'Buat Ulang / Sinkronkan Struktur Folder' : 'Generate Struktur Folder Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
