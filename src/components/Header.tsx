/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Building2,
  HardDrive,
  Bell,
  FileSpreadsheet,
  Download,
  FolderTree,
  User,
  ShieldAlert,
  Award,
  CheckCircle2,
  LogOut,
  Sparkles,
  Printer,
  FileText,
  UserCheck,
} from 'lucide-react';
import { MadrasahProfile, DocumentNotification } from '../types/pkkm';

interface HeaderProps {
  profile: MadrasahProfile;
  assessmentYear: 1 | 2 | 3 | 4;
  userEmail: string | null;
  userName: string | null;
  userPhoto: string | null;
  accessToken: string | null;
  currentRole: 'assessor' | 'madrasah';
  notifications: DocumentNotification[];
  rootDriveUrl: string | null;
  onChangeAssessmentYear: (year: 1 | 2 | 3 | 4) => void;
  onRoleChange: (role: 'assessor' | 'madrasah') => void;
  onLoginGoogle: () => void;
  onLogout: () => void;
  onOpenIdentity: () => void;
  onOpenPrint: () => void;
  onOpenDriveManager: () => void;
  onOpenNotifications: () => void;
  onOpenScoreRecap: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  assessmentYear,
  userEmail,
  userName,
  userPhoto,
  accessToken,
  currentRole,
  notifications,
  rootDriveUrl,
  onChangeAssessmentYear,
  onRoleChange,
  onLoginGoogle,
  onLogout,
  onOpenIdentity,
  onOpenPrint,
  onOpenDriveManager,
  onOpenNotifications,
  onOpenScoreRecap,
  onExportPDF,
  onExportExcel,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 text-white shadow-lg border-b border-emerald-800/80 print:hidden">
      {/* Top Banner Ribbon */}
      <div className="bg-emerald-950/90 py-1 px-4 text-[11px] text-emerald-200 border-b border-emerald-900/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sistem Resmi Penilaian Kinerja Kepala Madrasah (PKKM) • Kankemenag Kab. Kebumen</span>
          <span className="hidden md:inline px-2 py-0.2 rounded-md bg-emerald-800 text-amber-300 font-bold text-[10px] border border-emerald-700">
            {assessmentYear === 4
              ? 'Mode: PKKM 4 Tahunan (5 Komponen Tugas Utama)'
              : `Mode: PKKM Tahunan (Tahun ke-${assessmentYear} - 4 Komponen Tugas Utama)`}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span>NSM: <strong className="text-white">{profile.nsm}</strong></span>
          <span>NPSN: <strong className="text-white">{profile.npsn}</strong></span>
          <span className="hidden sm:inline">Kepala: <strong className="text-white">{profile.headmasterName}</strong></span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Madrasah Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onOpenIdentity} title="Klik untuk mengelola Identitas Madrasah & Penilai">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-amber-400 p-0.5 shadow-md flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-emerald-900 rounded-[14px] flex items-center justify-center text-amber-300 font-black text-lg">
              M7
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                PKKM MTsN 7 KEBUMEN
              </h1>
              <span className="hidden md:inline px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Resmi
              </span>
            </div>
            <p className="text-xs text-emerald-200 line-clamp-1">
              Kementerian Agama RI • {profile.regency}
            </p>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* PILIHAN TAHUN PENILAIAN (Tahun 1, 2, 3, 4) */}
          <div className="bg-emerald-950/90 p-0.5 rounded-xl border border-emerald-700/80 flex items-center shadow-inner">
            <span className="px-2 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider hidden xl:inline">
              Tahun:
            </span>
            {([1, 2, 3, 4] as const).map((yr) => {
              const isSelected = assessmentYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onChangeAssessmentYear(yr)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-xs font-black ring-1 ring-amber-300'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-800/60'
                  }`}
                  title={
                    yr === 4
                      ? 'Tahun ke-4: Menilai 5 Komponen Lengkap'
                      : `Tahun ke-${yr}: Menilai 4 Komponen Utama`
                  }
                >
                  <span>Th {yr}</span>
                  {yr === 4 && <span className="hidden sm:inline text-[10px] ml-1">(4 Thn)</span>}
                </button>
              );
            })}
          </div>

          {/* MENU 1: IDENTITAS (Madrasah, Kamad, Penilai) */}
          <button
            onClick={onOpenIdentity}
            className="px-3 py-1.5 bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-xl text-xs font-bold border border-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Kelola Identitas Madrasah, Kepala Madrasah, dan Tim Penilai"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Identitas</span>
          </button>

          {/* MENU 2: FASILITAS PENCETAKAN HASIL PENILAIAN */}
          <button
            onClick={onOpenPrint}
            className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md flex items-center gap-1.5 transition-all active:scale-95"
            title="Cetak Hasil Penilaian Resmi PKKM"
          >
            <Printer className="w-3.5 h-3.5 text-slate-950" />
            <span>Cetak Hasil</span>
          </button>

          {/* Role Switcher Pill */}
          <div className="bg-emerald-950/80 p-0.5 rounded-xl border border-emerald-800 flex items-center text-xs font-semibold">
            <button
              onClick={() => onRoleChange('assessor')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentRole === 'assessor'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>👨‍🏫</span>
              <span className="hidden sm:inline">Mode</span> Penilai
            </button>
            <button
              onClick={() => onRoleChange('madrasah')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                currentRole === 'madrasah'
                  ? 'bg-emerald-700 text-white shadow-xs font-bold'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span>🏫</span>
              <span className="hidden sm:inline">Mode</span> Tim MTsN 7
            </button>
          </div>

          {/* Drive Structure Manager Button */}
          <button
            onClick={onOpenDriveManager}
            className="px-3 py-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-100 hover:text-white rounded-xl text-xs font-bold border border-emerald-700 flex items-center gap-1.5 transition-colors shadow-2xs"
            title="Kelola Struktur Folder Google Drive"
          >
            <FolderTree className="w-3.5 h-3.5 text-teal-300" />
            <span className="hidden md:inline">Folder Drive</span>
          </button>

          {/* Rekap Nilai Modal Button */}
          <button
            onClick={onOpenScoreRecap}
            className="px-3 py-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Rekap Nilai</span>
          </button>

          {/* Ekspor Quick Buttons */}
          <div className="hidden lg:flex items-center gap-1">
            <button
              onClick={onExportPDF}
              className="p-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-lg border border-emerald-700 transition-colors"
              title="Unduh Laporan PDF Resmi"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onExportExcel}
              className="p-1.5 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-lg border border-emerald-700 transition-colors"
              title="Unduh Rekap Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
            </button>
          </div>

          {/* Notification Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-emerald-800/60 hover:bg-emerald-700 text-emerald-200 hover:text-white rounded-xl border border-emerald-700 transition-colors"
            title="Notifikasi Pembaruan Dokumen"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center animate-bounce shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Google Account / Drive Auth Status */}
          {accessToken ? (
            <div className="flex items-center gap-2 bg-emerald-950/80 py-1 px-2.5 rounded-xl border border-emerald-700/80 text-xs">
              {userPhoto ? (
                <img
                  src={userPhoto}
                  alt={userName || 'User'}
                  className="w-6 h-6 rounded-full border border-emerald-400"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center font-bold text-xs">
                  {userName ? userName.charAt(0).toUpperCase() : 'G'}
                </div>
              )}
              <div className="hidden sm:block text-left text-[11px] leading-tight">
                <p className="font-bold text-white max-w-[100px] truncate">{userName || 'Google Drive'}</p>
                <p className="text-emerald-300 text-[10px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Drive Terhubung</span>
                </p>
              </div>
              <button
                onClick={onLogout}
                className="p-1 text-emerald-300 hover:text-rose-300 rounded hover:bg-emerald-900 transition-colors"
                title="Putuskan Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLoginGoogle}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-xl text-xs font-bold shadow-md flex items-center gap-2 transition-all hover:shadow-lg active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span className="hidden sm:inline">Hubungkan</span> Google Drive
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
