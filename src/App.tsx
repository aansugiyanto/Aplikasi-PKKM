/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  DEFAULT_MADRASAH_PROFILE,
  PKKM_COMPONENTS,
  INITIAL_PKKM_INDICATORS,
  getActiveComponentsForYear,
} from './data/pkkmInstruments';
import {
  PKKMIndicator,
  EvidenceItem,
  PhysicalEvidence,
  ComponentScoreSummary,
  PKKMOverallScore,
  DocumentNotification,
  MadrasahProfile,
} from './types/pkkm';
import { initAuth, googleSignIn, logout } from './services/firebaseAuth';
import { DriveFolderStructureResult } from './services/googleDrive';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { AssessmentTable } from './components/AssessmentTable';
import { EvidenceModal } from './components/EvidenceModal';
import { DriveManagerModal } from './components/DriveManagerModal';
import { ScoreRecapModal } from './components/ScoreRecapModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { NoEvidenceAlertModal } from './components/NoEvidenceAlertModal';
import { IdentityModal } from './components/IdentityModal';
import { PrintReportModal } from './components/PrintReportModal';
import { exportPKKMToPDF, exportPKKMToExcel } from './services/exportService';

const STORAGE_KEY = 'pkkm_mtsn7_data_v5';
const PROFILE_STORAGE_KEY = 'pkkm_mtsn7_profile_v2';
const DRIVE_URL_KEY = 'pkkm_mtsn7_drive_root_v2';

export default function App() {
  // 1. Core Profile & Indicators State
  const [profile, setProfile] = useState<MadrasahProfile>(() => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_MADRASAH_PROFILE, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Gagal membaca profil dari localStorage:', e);
    }
    return DEFAULT_MADRASAH_PROFILE;
  });

  const [indicators, setIndicators] = useState<PKKMIndicator[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: PKKMIndicator[] = JSON.parse(saved);
        // Ensure evidenceItems exists on all indicators
        return parsed.map((ind) => {
          const defaultInd = INITIAL_PKKM_INDICATORS.find((i) => i.id === ind.id);
          return {
            ...ind,
            evidenceItems: ind.evidenceItems && ind.evidenceItems.length > 0
              ? ind.evidenceItems
              : defaultInd?.evidenceItems || [],
          };
        });
      }
    } catch (e) {
      console.warn('Gagal membaca data dari localStorage:', e);
    }
    return INITIAL_PKKM_INDICATORS;
  });

  const [rootDriveUrl, setRootDriveUrl] = useState<string | null>(() => {
    return localStorage.getItem(DRIVE_URL_KEY) || 'https://drive.google.com';
  });

  const [currentRole, setCurrentRole] = useState<'assessor' | 'madrasah'>('assessor');
  const [selectedComponentId, setSelectedComponentId] = useState<number | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'need_evidence' | 'ready_to_grade' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 2. Authentication & Google Drive State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 3. Modals State
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [isRecapModalOpen, setIsRecapModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [evidenceModalIndicator, setEvidenceModalIndicator] = useState<PKKMIndicator | null>(null);
  const [evidenceModalTargetItem, setEvidenceModalTargetItem] = useState<EvidenceItem | null>(null);
  const [noEvidenceAlertIndicator, setNoEvidenceAlertIndicator] = useState<PKKMIndicator | null>(null);

  // 4. Notifications State
  const [notifications, setNotifications] = useState<DocumentNotification[]>([
    {
      id: 'notif-1',
      indicatorId: 'ind-2-7-1',
      indicatorCode: '2.7.1',
      title: 'Dokumen Kurikulum Operasional Madrasah (KOM) Buku 1, 2, 3',
      action: 'added',
      timestamp: '2 jam yang lalu',
      userName: 'Waka Kurikulum',
      read: false,
    },
    {
      id: 'notif-2',
      indicatorId: 'ind-2-8-1',
      indicatorCode: '2.8.1',
      title: 'LPJ BOS & Rekonsiliasi Keuangan Madrasah 2025',
      action: 'updated',
      timestamp: '4 jam yang lalu',
      userName: 'Bendahara BOS',
      read: true,
    },
  ]);

  // Simpan data indikator & profil ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(indicators));
    } catch (e) {
      console.warn('Gagal menyimpan indikator ke localStorage:', e);
    }
  }, [indicators]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Gagal menyimpan profil ke localStorage:', e);
    }
  }, [profile]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setUserEmail(user.email);
        setUserName(user.displayName);
        setUserPhoto(user.photoURL);
        setAccessToken(token);
      },
      () => {
        setUserEmail(null);
        setUserName(null);
        setUserPhoto(null);
        setAccessToken(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleLoginGoogle = async () => {
    try {
      const res = await googleSignIn();
      if (res) {
        setUserEmail(res.user.email);
        setUserName(res.user.displayName);
        setUserPhoto(res.user.photoURL);
        setAccessToken(res.accessToken);
      }
    } catch (err: unknown) {
      console.error('Login failed:', err);
      alert('Gagal menghubungkan Google Drive. Pastikan izin popup browser aktif.');
    }
  };

  const handleLogout = async () => {
    await logout();
    setUserEmail(null);
    setUserName(null);
    setUserPhoto(null);
    setAccessToken(null);
  };

  // 5. Penentuan Komponen & Indikator Aktif berdasarkan Tahun Penilaian (Tahun 1, 2, 3 = 4 Komponen, Tahun 4 = 5 Komponen)
  const assessmentYear = profile.assessmentYear || 1;

  const activeComponents = useMemo(() => {
    return getActiveComponentsForYear(assessmentYear);
  }, [assessmentYear]);

  const activeIndicators = useMemo(() => {
    if (assessmentYear === 4) {
      return indicators;
    }
    // Tahun 1, 2, 3: Hanya Komponen 1 s.d 4 (Komponen 5 disembunyikan)
    return indicators.filter((ind) => ind.componentId <= 4);
  }, [indicators, assessmentYear]);

  // Handler Ganti Tahun Penilaian
  const handleYearChange = (year: 1 | 2 | 3 | 4) => {
    setProfile((prev) => ({
      ...prev,
      assessmentYear: year,
      evaluationPeriod:
        year === 4
          ? 'Penilaian Kinerja 4 Tahunan (PKKM 4 Tahunan)'
          : `Penilaian Kinerja Tahunan (PKKM Tahun ke-${year})`,
    }));
    // Jika sedang memilih filter komponen 5 dan berganti ke Tahun 1-3, reset filter ke 'all'
    if (selectedComponentId === 5 && year !== 4) {
      setSelectedComponentId('all');
    }
  };

  // 6. Perhitungan Rekapitulasi Nilai Otomatis Real-time
  const summaries: ComponentScoreSummary[] = useMemo(() => {
    return activeComponents.map((comp) => {
      const compIndicators = activeIndicators.filter((ind) => ind.componentId === comp.id);
      const totalIndicators = compIndicators.length;
      const assessedIndicators = compIndicators.filter((ind) => ind.score > 0).length;
      const evidenceCompleteCount = compIndicators.filter(
        (ind) => ind.evidences.length > 0 || ind.evidenceItems.some((bi) => bi.isAttached)
      ).length;

      const totalEvidenceItems = compIndicators.reduce(
        (acc, ind) => acc + ind.evidenceItems.length,
        0
      );
      const completedEvidenceItems = compIndicators.reduce(
        (acc, ind) => acc + ind.evidenceItems.filter((bi) => bi.score > 0).length,
        0
      );

      const totalScore = compIndicators.reduce((acc, curr) => acc + curr.score, 0);
      const maxScore = totalIndicators * 4;
      const scorePercentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
      const weightedScore = (scorePercentage * comp.weight) / 100;
      const progressPercentage =
        totalIndicators > 0 ? (assessedIndicators / totalIndicators) * 100 : 0;

      return {
        componentId: comp.id,
        componentName: comp.name,
        totalIndicators,
        assessedIndicators,
        evidenceCompleteCount,
        totalScore,
        maxScore,
        scorePercentage,
        weightedScore,
        progressPercentage,
        totalEvidenceItems,
        completedEvidenceItems,
      };
    });
  }, [activeComponents, activeIndicators]);

  const overall: PKKMOverallScore = useMemo(() => {
    const totalScore = activeIndicators.reduce((acc, curr) => acc + curr.score, 0);
    const maxPossibleScore = activeIndicators.length * 4;
    const completedIndicators = activeIndicators.filter((ind) => ind.score > 0).length;
    const indicatorsWithEvidence = activeIndicators.filter(
      (ind) => ind.evidences.length > 0 || ind.evidenceItems.some((bi) => bi.isAttached)
    ).length;
    const indicatorsWithoutEvidence = activeIndicators.length - indicatorsWithEvidence;

    const totalEvidenceItems = activeIndicators.reduce(
      (acc, ind) => acc + ind.evidenceItems.length,
      0
    );
    const completedEvidenceItems = activeIndicators.reduce(
      (acc, ind) => acc + ind.evidenceItems.filter((bi) => bi.score > 0).length,
      0
    );

    // Nilai akhir dihitung dari total akumulasi skor tertimbang komponen aktif
    const percentageScore = summaries.reduce((acc, curr) => acc + curr.weightedScore, 0);

    let predicate: PKKMOverallScore['predicate'] = 'Kurang';
    let predicateGrade: PKKMOverallScore['predicateGrade'] = 'E';

    if (percentageScore >= 91) {
      predicate = 'Amat Baik';
      predicateGrade = 'A';
    } else if (percentageScore >= 76) {
      predicate = 'Baik';
      predicateGrade = 'B';
    } else if (percentageScore >= 61) {
      predicate = 'Cukup';
      predicateGrade = 'C';
    } else if (percentageScore >= 51) {
      predicate = 'Sedang';
      predicateGrade = 'D';
    } else {
      predicate = 'Kurang';
      predicateGrade = 'E';
    }

    const status = percentageScore >= 76 ? 'Memenuhi Syarat' : 'Perlu Perbaikan';

    return {
      totalScore,
      maxPossibleScore,
      percentageScore,
      predicate,
      predicateGrade,
      status,
      totalIndicators: activeIndicators.length,
      completedIndicators,
      indicatorsWithEvidence,
      indicatorsWithoutEvidence,
      totalEvidenceItems,
      completedEvidenceItems,
    };
  }, [activeIndicators, summaries]);

  // Filter & Search Logic
  const filteredIndicators = useMemo(() => {
    return activeIndicators.filter((ind) => {
      // 1. Filter Komponen
      if (selectedComponentId !== 'all' && ind.componentId !== selectedComponentId) {
        return false;
      }

      // 2. Filter Status
      const hasEv = ind.evidences.length > 0 || ind.evidenceItems.some((bi) => bi.isAttached);
      const isGraded = ind.score > 0;

      if (activeFilter === 'need_evidence' && hasEv) return false;
      if (activeFilter === 'ready_to_grade' && (!hasEv || isGraded)) return false;
      if (activeFilter === 'graded' && !isGraded) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchCode = ind.code.toLowerCase().includes(q);
        const matchName = ind.subComponentName.toLowerCase().includes(q);
        const matchCriteria = ind.criteria.toLowerCase().includes(q);
        const matchEvDesc = ind.requiredEvidenceDescription.toLowerCase().includes(q);
        const matchEvFiles = ind.evidences.some((ev) => ev.title.toLowerCase().includes(q));
        const matchItems = ind.evidenceItems.some(
          (bi) => bi.name.toLowerCase().includes(q) || bi.code.toLowerCase().includes(q)
        );

        if (!matchCode && !matchName && !matchCriteria && !matchEvDesc && !matchEvFiles && !matchItems) {
          return false;
        }
      }

      return true;
    });
  }, [indicators, selectedComponentId, activeFilter, searchQuery]);

  // Handler: Update Skor Indikator Langsung
  const handleUpdateScore = (
    indicatorId: string,
    score: 0 | 1 | 2 | 3 | 4,
    notes?: string
  ) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id === indicatorId) {
          return {
            ...ind,
            score,
            assessorNotes: notes !== undefined ? notes : ind.assessorNotes,
            assessedAt: new Date().toLocaleString('id-ID', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
            assessorName: profile.assessor1Name,
          };
        }
        return ind;
      })
    );
  };

  // Handler: Penilaian Khusus per Butir Bukti Dukung
  const handleUpdateEvidenceItemScore = (
    indicatorId: string,
    itemId: string,
    score: 0 | 1 | 2 | 3 | 4,
    notes?: string
  ) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id === indicatorId) {
          const updatedItems = ind.evidenceItems.map((item) => {
            if (item.id === itemId) {
              return {
                ...item,
                score,
                assessorNotes: notes !== undefined ? notes : item.assessorNotes,
                assessedAt: new Date().toLocaleString('id-ID', {
                  dateStyle: 'short',
                  timeStyle: 'short',
                }),
                assessorName: profile.assessor1Name,
              };
            }
            return item;
          });

          // Otomatis hitung skor keseluruhan indikator dari rata-rata butir yang dinilai
          const scoredItems = updatedItems.filter((i) => i.score > 0);
          let newIndScore: 0 | 1 | 2 | 3 | 4 = 0;
          if (scoredItems.length > 0) {
            const avg =
              scoredItems.reduce((acc, curr) => acc + curr.score, 0) / updatedItems.length;
            newIndScore = Math.max(1, Math.min(4, Math.round(avg))) as 1 | 2 | 3 | 4;
          }

          return {
            ...ind,
            evidenceItems: updatedItems,
            score: newIndScore,
            assessedAt: new Date().toLocaleString('id-ID', {
              dateStyle: 'short',
              timeStyle: 'short',
            }),
            assessorName: profile.assessor1Name,
          };
        }
        return ind;
      })
    );
  };

  // Handler: Tambah Berkas Eviden
  const handleSaveEvidence = (
    indicatorId: string,
    newEvidence: PhysicalEvidence,
    targetItemId?: string
  ) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id === indicatorId) {
          // Tandai butir bukti dukung spesifik atau butir pertama yang belum terlampir
          const updatedEvidenceItems = ind.evidenceItems.map((bi, idx) => {
            if (targetItemId && bi.id === targetItemId) {
              return {
                ...bi,
                isAttached: true,
                evidenceFileUrl: newEvidence.url,
                evidenceFileName: newEvidence.fileName || newEvidence.title,
                evidenceFileType: newEvidence.type,
                evidenceUploadedAt: newEvidence.uploadedAt,
                evidenceUploadedBy: newEvidence.uploadedBy,
              };
            }
            if (!targetItemId && !bi.isAttached && idx === 0) {
              return {
                ...bi,
                isAttached: true,
                evidenceFileUrl: newEvidence.url,
                evidenceFileName: newEvidence.fileName || newEvidence.title,
                evidenceFileType: newEvidence.type,
                evidenceUploadedAt: newEvidence.uploadedAt,
                evidenceUploadedBy: newEvidence.uploadedBy,
              };
            }
            return bi;
          });

          return {
            ...ind,
            evidences: [newEvidence, ...ind.evidences],
            evidenceItems: updatedEvidenceItems,
          };
        }
        return ind;
      })
    );

    // Tambah entri ke notification feed
    const targetInd = indicators.find((i) => i.id === indicatorId);
    if (targetInd) {
      const newNotif: DocumentNotification = {
        id: `notif-${Date.now()}`,
        indicatorId,
        indicatorCode: targetInd.code,
        title: newEvidence.title,
        action: 'added',
        timestamp: 'Baru saja',
        userName: newEvidence.uploadedBy,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);
    }
  };

  // Handler: Hapus Berkas Eviden
  const handleDeleteEvidence = (indicatorId: string, evidenceId: string) => {
    setIndicators((prev) =>
      prev.map((ind) => {
        if (ind.id === indicatorId) {
          const updatedEvidences = ind.evidences.filter((e) => e.id !== evidenceId);
          return {
            ...ind,
            evidences: updatedEvidences,
            score: updatedEvidences.length === 0 ? 0 : ind.score,
          };
        }
        return ind;
      })
    );
  };

  // Handler: Google Drive Structure Generated
  const handleStructureGenerated = (result: DriveFolderStructureResult) => {
    if (result.rootFolder.webViewLink) {
      setRootDriveUrl(result.rootFolder.webViewLink);
      localStorage.setItem(DRIVE_URL_KEY, result.rootFolder.webViewLink);
    }

    setIndicators((prev) =>
      prev.map((ind) => {
        const indFolder = result.indicatorFolders[ind.id];
        if (indFolder) {
          return {
            ...ind,
            driveFolderId: indFolder.id,
            driveFolderUrl:
              indFolder.webViewLink || `https://drive.google.com/drive/folders/${indFolder.id}`,
          };
        }
        return ind;
      })
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // ignore
    }
  };

  // Reset sample data
  const handleResetData = () => {
    const confirmed = window.confirm(
      'Apakah Anda ingin mereset seluruh instrumen penilaian ke data awal standar MTsN 7 Kebumen?'
    );
    if (confirmed) {
      setIndicators(INITIAL_PKKM_INDICATORS);
      setProfile(DEFAULT_MADRASAH_PROFILE);
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(PROFILE_STORAGE_KEY);
    }
  };

  // Target indicator from evidence modal
  const activeModalIndicator = useMemo(() => {
    if (!evidenceModalIndicator) return null;
    return indicators.find((i) => i.id === evidenceModalIndicator.id) || evidenceModalIndicator;
  }, [indicators, evidenceModalIndicator]);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* 1. Header Navigation */}
      <Header
        profile={profile}
        assessmentYear={assessmentYear}
        userEmail={userEmail}
        userName={userName}
        userPhoto={userPhoto}
        accessToken={accessToken}
        currentRole={currentRole}
        notifications={notifications}
        rootDriveUrl={rootDriveUrl}
        onChangeAssessmentYear={handleYearChange}
        onRoleChange={setCurrentRole}
        onLoginGoogle={handleLoginGoogle}
        onLogout={handleLogout}
        onOpenIdentity={() => setIsIdentityModalOpen(true)}
        onOpenPrint={() => setIsPrintModalOpen(true)}
        onOpenDriveManager={() => setIsDriveModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        onOpenScoreRecap={() => setIsRecapModalOpen(true)}
        onExportPDF={() =>
          exportPKKMToPDF(profile, activeComponents, activeIndicators, summaries, overall)
        }
        onExportExcel={() =>
          exportPKKMToExcel(profile, activeComponents, activeIndicators, summaries, overall)
        }
      />

      {/* 2. Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Visual Progress Dashboard & Metric Summaries */}
        <DashboardOverview
          components={activeComponents}
          summaries={summaries}
          overall={overall}
          selectedComponentId={selectedComponentId}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onSelectComponent={setSelectedComponentId}
          onFilterChange={setActiveFilter}
          onSearchChange={setSearchQuery}
          onOpenDriveModal={() => setIsDriveModalOpen(true)}
        />

        {/* Section Heading & Table */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <span>Daftar Butir Bukti Fisik & Penilaian PKKM</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {filteredIndicators.length} Indikator • {overall.totalEvidenceItems} Butir Bukti Dukung
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentRole === 'assessor'
                  ? 'Mode Penilai (Asesor): Berikan penilaian (Skor 1-4) pada masing-masing butir bukti dukung yang terlampir.'
                  : 'Mode Madrasah: Unggah atau sematkan tautan Google Drive pada tiap butir bukti fisik sebelum dinilai.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>🖨️ Cetak Laporan</span>
              </button>
              <button
                onClick={handleResetData}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                title="Reset ke data contoh standar"
              >
                Reset Data Contoh
              </button>
            </div>
          </div>

          {/* Assessment Table with Per-Evidence-Item Scoring */}
          <AssessmentTable
            indicators={filteredIndicators}
            currentRole={currentRole}
            assessorName={profile.assessor1Name}
            onUpdateScore={handleUpdateScore}
            onUpdateEvidenceItemScore={handleUpdateEvidenceItemScore}
            onOpenEvidenceModal={(ind, item) => {
              setEvidenceModalIndicator(ind);
              setEvidenceModalTargetItem(item || null);
            }}
            onOpenNoEvidenceAlert={(ind) => setNoEvidenceAlertIndicator(ind)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto space-y-2">
          <p className="font-bold text-slate-700">
            Aplikasi Penilaian Kinerja Kepala Madrasah (PKKM) MTs Negeri 7 Kebumen
          </p>
          <p className="text-slate-500 text-[11px]">
            {profile.address}, {profile.subdistrict}, {profile.regency}, {profile.province} • Terintegrasi Google Drive API & Standar Dirjen Pendis Kemenag RI
          </p>
        </div>
      </footer>

      {/* 3. MODALS */}
      {/* Menu Identitas: Madrasah, Kamad, Penilai */}
      <IdentityModal
        isOpen={isIdentityModalOpen}
        profile={profile}
        onClose={() => setIsIdentityModalOpen(false)}
        onSaveProfile={(updated) => setProfile(updated)}
      />

      {/* Fasilitas Pencetakan Hasil Penilaian */}
      <PrintReportModal
        isOpen={isPrintModalOpen}
        profile={profile}
        components={activeComponents}
        indicators={activeIndicators}
        summaries={summaries}
        overall={overall}
        onClose={() => setIsPrintModalOpen(false)}
        onExportPDF={() =>
          exportPKKMToPDF(profile, activeComponents, activeIndicators, summaries, overall)
        }
        onExportExcel={() =>
          exportPKKMToExcel(profile, activeComponents, activeIndicators, summaries, overall)
        }
      />

      {/* Evidence Upload / Link Modal */}
      <EvidenceModal
        isOpen={Boolean(activeModalIndicator)}
        indicator={activeModalIndicator}
        targetItem={evidenceModalTargetItem}
        accessToken={accessToken}
        onClose={() => {
          setEvidenceModalIndicator(null);
          setEvidenceModalTargetItem(null);
        }}
        onSaveEvidence={handleSaveEvidence}
        onDeleteEvidence={handleDeleteEvidence}
        onConnectDrive={handleLoginGoogle}
      />

      {/* Strict No-Evidence Warning Modal */}
      <NoEvidenceAlertModal
        isOpen={Boolean(noEvidenceAlertIndicator)}
        indicator={noEvidenceAlertIndicator}
        onClose={() => setNoEvidenceAlertIndicator(null)}
        onOpenEvidenceUpload={(ind) => {
          setEvidenceModalIndicator(ind);
          setEvidenceModalTargetItem(null);
        }}
      />

      {/* Google Drive Automatic Structure Generator Modal */}
      <DriveManagerModal
        isOpen={isDriveModalOpen}
        academicYear={profile.academicYear}
        components={activeComponents}
        indicators={activeIndicators}
        accessToken={accessToken}
        rootDriveUrl={rootDriveUrl}
        onClose={() => setIsDriveModalOpen(false)}
        onConnectDrive={handleLoginGoogle}
        onStructureGenerated={handleStructureGenerated}
      />

      {/* Score Recapitulation Modal */}
      <ScoreRecapModal
        isOpen={isRecapModalOpen}
        profile={profile}
        components={activeComponents}
        indicators={activeIndicators}
        summaries={summaries}
        overall={overall}
        onClose={() => setIsRecapModalOpen(false)}
      />

      {/* Real-time Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        notifications={notifications}
        indicators={indicators}
        onClose={() => setIsNotificationDrawerOpen(false)}
        onSelectIndicator={(indicatorId) => {
          const el = document.getElementById(`indicator-${indicatorId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('ring-4', 'ring-emerald-400');
            setTimeout(() => el.classList.remove('ring-4', 'ring-emerald-400'), 2500);
          }
        }}
        onClearNotifications={() => setNotifications([])}
        onMarkAllAsRead={() =>
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
        }
      />
    </div>
  );
}
