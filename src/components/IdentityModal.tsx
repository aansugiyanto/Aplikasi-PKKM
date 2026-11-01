/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  UserCheck,
  Calendar,
  Save,
  CheckCircle2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { MadrasahProfile } from '../types/pkkm';

interface IdentityModalProps {
  isOpen: boolean;
  profile: MadrasahProfile;
  onClose: () => void;
  onSaveProfile: (updatedProfile: MadrasahProfile) => void;
}

export const IdentityModal: React.FC<IdentityModalProps> = ({
  isOpen,
  profile,
  onClose,
  onSaveProfile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'madrasah' | 'headmaster' | 'assessors' | 'period'>('madrasah');
  const [formData, setFormData] = useState<MadrasahProfile>({ ...profile });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof MadrasahProfile, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-900 px-6 py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-700/60 rounded-2xl shadow-inner">
              <Building className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold">Menu Identitas PKKM</h3>
              <p className="text-xs text-emerald-200">
                Identitas Madrasah, Kepala Madrasah, Tim Penilai & Periode Penilaian
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 pt-3 flex flex-wrap gap-2 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('madrasah')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'madrasah'
                ? 'border-emerald-700 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Identitas Madrasah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('headmaster')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'headmaster'
                ? 'border-emerald-700 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Kepala Madrasah</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('assessors')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'assessors'
                ? 'border-emerald-700 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Tim Penilai (Asesor)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('period')}
            className={`pb-3 px-3 border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'period'
                ? 'border-emerald-700 text-emerald-800 font-extrabold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Waktu & Pengesahan</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* TAB 1: IDENTITAS MADRASAH */}
          {activeTab === 'madrasah' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Resmi Madrasah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Statistik Madrasah (NSM) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nsm}
                    onChange={(e) => handleChange('nsm', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Pokok Sekolah Nasional (NPSN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.npsn}
                    onChange={(e) => handleChange('npsn', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Alamat Lengkap Jalan / No.
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kecamatan</label>
                  <input
                    type="text"
                    value={formData.subdistrict}
                    onChange={(e) => handleChange('subdistrict', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kabupaten / Kota</label>
                  <input
                    type="text"
                    value={formData.regency}
                    onChange={(e) => handleChange('regency', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => handleChange('province', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kode Pos</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor Telepon Madrasah</label>
                  <input
                    type="text"
                    value={formData.phoneNumber}
                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alamat Email Resmi</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Website Madrasah</label>
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status & Nilai Akreditasi</label>
                  <input
                    type="text"
                    value={`${formData.accreditationGrade} (Nilai: ${formData.accreditationScore})`}
                    onChange={(e) => handleChange('accreditationGrade', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: IDENTITAS KEPALA MADRASAH */}
          {activeTab === 'headmaster' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-700 text-white font-bold text-xl flex items-center justify-center shrink-0">
                  KM
                </div>
                <div>
                  <h4 className="font-bold text-emerald-950 text-sm">{formData.headmasterName}</h4>
                  <p className="text-emerald-800 text-[11px]">Kepala Madrasah yang Dinilai • NIP: {formData.headmasterNip}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">
                    Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headmasterName}
                    onChange={(e) => handleChange('headmasterName', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nomor Induk Pegawai (NIP) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.headmasterNip}
                    onChange={(e) => handleChange('headmasterNip', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pangkat / Golongan Ruang</label>
                  <input
                    type="text"
                    value={formData.headmasterRank}
                    onChange={(e) => handleChange('headmasterRank', e.target.value)}
                    placeholder="Contoh: Pembina Tingkat I / IV.b"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">TMT sebagai Kepala Madrasah</label>
                  <input
                    type="text"
                    value={formData.headmasterTMT}
                    onChange={(e) => handleChange('headmasterTMT', e.target.value)}
                    placeholder="Contoh: 01 Maret 2021"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masa Tugas / Periode</label>
                  <input
                    type="text"
                    value={formData.headmasterPeriod}
                    onChange={(e) => handleChange('headmasterPeriod', e.target.value)}
                    placeholder="Contoh: Periode ke-1 (Tahun ke-4)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Pendidikan Terakhir & Jurusan</label>
                  <input
                    type="text"
                    value={formData.headmasterEducation}
                    onChange={(e) => handleChange('headmasterEducation', e.target.value)}
                    placeholder="Contoh: S-2 Manajemen Pendidikan Islam (UIN Sunan Kalijaga)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TIM PENILAI (ASESOR) */}
          {activeTab === 'assessors' && (
            <div className="space-y-6">
              {/* Penilai 1 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Penilai 1 (Pengawas Madrasah Pertama)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Penilai 1 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.assessor1Name}
                      onChange={(e) => handleChange('assessor1Name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIP Penilai 1</label>
                    <input
                      type="text"
                      required
                      value={formData.assessor1Nip}
                      onChange={(e) => handleChange('assessor1Nip', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pangkat / Golongan</label>
                    <input
                      type="text"
                      value={formData.assessor1Rank}
                      onChange={(e) => handleChange('assessor1Rank', e.target.value)}
                      placeholder="Pembina Utama Muda / IV.c"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jabatan / Instansi</label>
                    <input
                      type="text"
                      value={formData.assessor1Position}
                      onChange={(e) => handleChange('assessor1Position', e.target.value)}
                      placeholder="Pengawas Madrasah Madya Kemenag Kebumen"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Penilai 2 */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Penilai 2 (Pengawas Madrasah Kedua)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Nama Lengkap & Gelar Penilai 2 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.assessor2Name}
                      onChange={(e) => handleChange('assessor2Name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">NIP Penilai 2</label>
                    <input
                      type="text"
                      required
                      value={formData.assessor2Nip}
                      onChange={(e) => handleChange('assessor2Nip', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pangkat / Golongan</label>
                    <input
                      type="text"
                      value={formData.assessor2Rank}
                      onChange={(e) => handleChange('assessor2Rank', e.target.value)}
                      placeholder="Pembina Tingkat I / IV.b"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Jabatan / Instansi</label>
                    <input
                      type="text"
                      value={formData.assessor2Position}
                      onChange={(e) => handleChange('assessor2Position', e.target.value)}
                      placeholder="Pengawas Madrasah Ahli Madya Kemenag Kebumen"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: WAKTU & PENGESAHAN */}
          {activeTab === 'period' && (
            <div className="space-y-4">
              {/* Pilihan Tahun Penilaian (Tahun 1, 2, 3, 4) */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <label className="block font-bold text-emerald-950 text-xs">
                  Pilihan Tahun Penilaian PKKM:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {([1, 2, 3, 4] as const).map((yr) => {
                    const isSelected = formData.assessmentYear === yr;
                    return (
                      <button
                        key={yr}
                        type="button"
                        onClick={() => {
                          handleChange('assessmentYear', yr);
                          handleChange(
                            'evaluationPeriod',
                            yr === 4
                              ? 'Penilaian Kinerja 4 Tahunan (PKKM 4 Tahunan)'
                              : `Penilaian Kinerja Tahunan (PKKM Tahun ke-${yr})`
                          );
                        }}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          isSelected
                            ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm font-bold ring-2 ring-emerald-500/40'
                            : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 font-semibold'
                        }`}
                      >
                        <div className="text-xs font-black">Tahun {yr}</div>
                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                          {yr === 4 ? '5 Komponen' : '4 Komponen'}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-emerald-900 leading-relaxed pt-1">
                  {formData.assessmentYear === 4 ? (
                    <strong className="text-emerald-950">
                      ℹ️ Tahun ke-4 (PKKM 4 Tahunan): Menilai 5 Komponen Tugas Utama (termasuk Komponen 5: Hasil Kinerja Kepala Madrasah).
                    </strong>
                  ) : (
                    <span>
                      ℹ️ Tahun ke-{formData.assessmentYear} (PKKM Tahunan): Hanya menilai <strong>4 Komponen Tugas Utama</strong>. Komponen ke-5 otomatis disembunyikan sesuai Juknis Kemenag.
                    </span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tahun Ajaran</label>
                  <input
                    type="text"
                    value={formData.academicYear}
                    onChange={(e) => handleChange('academicYear', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Deskripsi Periode Penilaian</label>
                  <input
                    type="text"
                    value={formData.evaluationPeriod}
                    onChange={(e) => handleChange('evaluationPeriod', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Pelaksanaan PKKM</label>
                  <input
                    type="text"
                    value={formData.evaluationDate}
                    onChange={(e) => handleChange('evaluationDate', e.target.value)}
                    placeholder="Contoh: 30 Oktober 2026"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tempat Pelaksanaan</label>
                  <input
                    type="text"
                    value={formData.evaluationPlace}
                    onChange={(e) => handleChange('evaluationPlace', e.target.value)}
                    placeholder="Contoh: Aula MTs Negeri 7 Kebumen"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                  />
                </div>

                <div className="sm:col-span-2 pt-2 border-t border-slate-100">
                  <p className="font-bold text-slate-800 mb-3">Mengetahui Kepala Kantor Kemenag:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Nama Kepala Kantor Kemenag Kab. Kebumen
                      </label>
                      <input
                        type="text"
                        value={formData.headOfKemenagName}
                        onChange={(e) => handleChange('headOfKemenagName', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">NIP Kepala Kantor</label>
                      <input
                        type="text"
                        value={formData.headOfKemenagNip}
                        onChange={(e) => handleChange('headOfKemenagNip', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-emerald-600"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Modal Footer Inside Form */}
          <div className="bg-slate-50 -mx-6 -mb-6 px-6 py-4 border-t border-slate-200 flex items-center justify-between shrink-0">
            <p className="text-slate-500 text-[11px]">
              Data tersimpan otomatis dan memperbarui seluruh berkas cetak serta laporan PKKM.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 font-semibold text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-md flex items-center gap-2 transition-all hover:shadow-lg"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Tersimpan!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Identitas</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
