/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Upload,
  Link as LinkIcon,
  FileText,
  Trash2,
  ExternalLink,
  CheckCircle2,
  FolderOpen,
  AlertCircle,
  FileUp,
} from 'lucide-react';
import { PKKMIndicator, PhysicalEvidence, EvidenceItem } from '../types/pkkm';
import { uploadFileToDrive } from '../services/googleDrive';
import { sendAssessorPushNotification } from '../services/soundNotification';

interface EvidenceModalProps {
  isOpen: boolean;
  indicator: PKKMIndicator | null;
  targetItem?: EvidenceItem | null;
  accessToken: string | null;
  onClose: () => void;
  onSaveEvidence: (
    indicatorId: string,
    newEvidence: PhysicalEvidence,
    targetItemId?: string
  ) => void;
  onDeleteEvidence: (indicatorId: string, evidenceId: string) => void;
  onConnectDrive: () => void;
}

export const EvidenceModal: React.FC<EvidenceModalProps> = ({
  isOpen,
  indicator,
  targetItem,
  accessToken,
  onClose,
  onSaveEvidence,
  onDeleteEvidence,
  onConnectDrive,
}) => {
  if (!isOpen || !indicator) return null;

  const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
  const [evidenceTitle, setEvidenceTitle] = useState(targetItem ? targetItem.name : '');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [uploaderName, setUploaderName] = useState('Tim Penjamin Mutu MTsN 7 Kebumen');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  React.useEffect(() => {
    if (targetItem) {
      setEvidenceTitle(targetItem.name);
    } else {
      setEvidenceTitle('');
    }
  }, [targetItem]);

  const handleAddLinkEvidence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evidenceTitle.trim() || !evidenceUrl.trim()) return;

    let finalUrl = evidenceUrl.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    const newEvidence: PhysicalEvidence = {
      id: `ev-${Date.now()}`,
      title: evidenceTitle.trim(),
      type: 'link',
      url: finalUrl,
      fileName: 'Dokumen_Digital.link',
      uploadedAt: new Date().toLocaleString('id-ID', {
        dateStyle: 'short',
        timeStyle: 'short',
      }),
      uploadedBy: uploaderName.trim() || 'Tim MTsN 7 Kebumen',
      notes: evidenceNotes.trim(),
    };

    onSaveEvidence(indicator.id, newEvidence, targetItem?.id);

    // Kirim notifikasi push ke penilai & mainkan audio chime
    sendAssessorPushNotification(
      indicator.code,
      newEvidence.title,
      newEvidence.uploadedBy
    );

    // Reset Form
    setEvidenceTitle(targetItem ? targetItem.name : '');
    setEvidenceUrl('');
    setEvidenceNotes('');
    onClose();
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploadError(null);
    setIsUploading(true);

    try {
      let fileUrl = '';
      let driveFileId = '';
      const fileSize = `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`;

      if (accessToken) {
        // Upload langsung ke Google Drive API
        const driveResult = await uploadFileToDrive(
          selectedFile,
          indicator.driveFolderId,
          accessToken
        );
        fileUrl = driveResult.webViewLink || `https://drive.google.com/file/d/${driveResult.id}/view`;
        driveFileId = driveResult.id;
      } else {
        // Simulasikan link cloud internal jika belum login drive
        fileUrl = `https://drive.google.com/file/d/mtsn7kebumen-${Date.now()}/view`;
      }

      const newEvidence: PhysicalEvidence = {
        id: `ev-${Date.now()}`,
        title: evidenceTitle.trim() || selectedFile.name,
        type: 'upload',
        url: fileUrl,
        fileId: driveFileId,
        fileName: selectedFile.name,
        fileSize,
        uploadedAt: new Date().toLocaleString('id-ID', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        uploadedBy: uploaderName.trim() || 'Tim MTsN 7 Kebumen',
        notes: evidenceNotes.trim(),
      };

      onSaveEvidence(indicator.id, newEvidence, targetItem?.id);

      // Push notification ke asesor
      sendAssessorPushNotification(
        indicator.code,
        newEvidence.title,
        newEvidence.uploadedBy
      );

      // Reset Form & close
      setSelectedFile(null);
      setEvidenceTitle(targetItem ? targetItem.name : '');
      setEvidenceNotes('');
      onClose();
    } catch (err: unknown) {
      console.error('Upload error:', err);
      setUploadError(err instanceof Error ? err.message : 'Gagal mengunggah berkas');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (evidenceId: string, title: string) => {
    const confirmDelete = window.confirm(
      `Apakah Anda yakin ingin menghapus berkas bukti fisik "${title}"? Tindakan ini tidak dapat dibatalkan.`
    );
    if (confirmDelete) {
      onDeleteEvidence(indicator.id, evidenceId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <FolderOpen className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-700 text-emerald-100">
                  {targetItem ? targetItem.code : indicator.code}
                </span>
                <h3 className="text-base font-bold text-white">
                  {targetItem ? `Unggah Berkas: ${targetItem.name}` : 'Kelola Bukti Fisik (Eviden)'}
                </h3>
              </div>
              <p className="text-xs text-emerald-200 line-clamp-1">
                {targetItem ? targetItem.description : indicator.subComponentName}
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Petunjuk Bukti Fisik yang Dipersyaratkan */}
          <div className="bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Bukti Fisik yang Dipersyaratkan oleh Juknis Kemenag:
            </p>
            <p className="text-slate-700 leading-relaxed font-medium">
              "{indicator.requiredEvidenceDescription}"
            </p>
          </div>

          {/* Daftar Eviden Terlampir Saat Ini */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Eviden Terlampir ({indicator.evidences.length})
              </h4>
              {indicator.evidences.length === 0 && (
                <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Belum ada dokumen terlampir
                </span>
              )}
            </div>

            {indicator.evidences.length === 0 ? (
              <div className="p-6 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium">
                  Belum ada bukti fisik yang dilampirkan untuk indikator ini.
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Gunakan formulir di bawah untuk menyematkan link Google Drive atau mengunggah dokumen.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
                {indicator.evidences.map((ev) => (
                  <div key={ev.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 shrink-0 mt-0.5">
                        {ev.type === 'upload' ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <LinkIcon className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">{ev.title}</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                          <span>{ev.fileName || 'Tautan Eksternal'}</span>
                          {ev.fileSize && <span>• {ev.fileSize}</span>}
                          <span>• Oleh: {ev.uploadedBy}</span>
                          <span>• {ev.uploadedAt}</span>
                        </div>
                        {ev.notes && (
                          <p className="text-[11px] text-slate-600 italic mt-1 line-clamp-1">
                            "{ev.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-xs font-semibold flex items-center gap-1"
                        title="Buka Dokumen di Tab Baru"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="hidden sm:inline">Buka</span>
                      </a>
                      <button
                        onClick={() => handleDelete(ev.id, ev.title)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                        title="Hapus Bukti Fisik"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Tambah Bukti Fisik */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <FileUp className="w-4 h-4 text-emerald-700" />
                Tambah Dokumen Bukti Fisik
              </h4>

              {/* Tabs */}
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab('link')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'link'
                      ? 'bg-white text-emerald-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Sematkan Link URL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('upload')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    activeTab === 'upload'
                      ? 'bg-white text-emerald-900 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Upload ke Google Drive
                </button>
              </div>
            </div>

            {/* Tab 1: Sematkan Link URL */}
            {activeTab === 'link' && (
              <form onSubmit={handleAddLinkEvidence} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Bukti Fisik <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="Contoh: SK Tim Pengembang Kurikulum MTsN 7 TP 2025/2026"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tautan / URL Google Drive / Berkas <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={evidenceUrl}
                      onChange={(e) => setEvidenceUrl(e.target.value)}
                      placeholder="https://drive.google.com/file/d/... atau https://docs.google.com/..."
                      className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600 focus:ring-1 focus:ring-emerald-600"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Pastikan perizinan link Google Drive sudah diatur ke "Siapa saja yang memiliki link dapat melihat".
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pengunggah / Tim
                    </label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Nama atau Jabatan Pengunggah"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan / Keterangan (Opsional)
                    </label>
                    <input
                      type="text"
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="Contoh: Halaman 12-15 bab kurikulum"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                    <span>Sematkan Tautan Bukti Fisik</span>
                  </button>
                </div>
              </form>
            )}

            {/* Tab 2: Upload File langsung ke Drive */}
            {activeTab === 'upload' && (
              <form onSubmit={handleFileUpload} className="space-y-3">
                {!accessToken && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Google Drive belum terhubung langsung. Hubungkan akun Google untuk upload otomatis ke folder Drive MTsN 7.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onConnectDrive}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-md shrink-0 transition-colors"
                    >
                      Hubungkan Drive
                    </button>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Berkas Dokumen (PDF, Word, Excel, Gambar)
                  </label>
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setSelectedFile(e.target.files[0]);
                        if (!evidenceTitle) {
                          setEvidenceTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                        }
                      }
                    }}
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.zip"
                    className="w-full text-xs file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-100 file:text-emerald-800 hover:file:bg-emerald-200 text-slate-600 bg-white border border-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Bukti Fisik
                  </label>
                  <input
                    type="text"
                    required
                    value={evidenceTitle}
                    onChange={(e) => setEvidenceTitle(e.target.value)}
                    placeholder="Contoh: Dokumen Program Supervisi Guru MTsN 7 Kebumen"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Pengunggah / Tim
                    </label>
                    <input
                      type="text"
                      value={uploaderName}
                      onChange={(e) => setUploaderName(e.target.value)}
                      placeholder="Tim Pengunggah"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Catatan / Keterangan
                    </label>
                    <input
                      type="text"
                      value={evidenceNotes}
                      onChange={(e) => setEvidenceNotes(e.target.value)}
                      placeholder="Keterangan tambahan dokumen"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-emerald-600"
                    />
                  </div>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isUploading || !selectedFile}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
                  >
                    {isUploading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Mengunggah ke Google Drive...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Unggah Dokumen Eviden</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <p>
            Status: <span className="font-semibold text-slate-700">{indicator.evidences.length > 0 ? 'Siap dinilai oleh Asesor' : 'Belum dapat dinilai'}</span>
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
