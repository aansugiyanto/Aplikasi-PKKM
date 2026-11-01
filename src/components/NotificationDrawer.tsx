/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Bell,
  CheckCircle2,
  Volume2,
  Clock,
  FileCheck,
  ExternalLink,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { DocumentNotification, PKKMIndicator } from '../types/pkkm';
import { playNotificationSound, requestPushNotificationPermission } from '../services/soundNotification';

interface NotificationDrawerProps {
  isOpen: boolean;
  notifications: DocumentNotification[];
  indicators: PKKMIndicator[];
  onClose: () => void;
  onSelectIndicator: (indicatorId: string) => void;
  onClearNotifications: () => void;
  onMarkAllAsRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  notifications,
  indicators,
  onClose,
  onSelectIndicator,
  onClearNotifications,
  onMarkAllAsRead,
}) => {
  if (!isOpen) return null;

  const handleRequestPush = async () => {
    const perm = await requestPushNotificationPermission();
    if (perm === 'granted') {
      playNotificationSound();
      alert('✅ Izin Push Notifikasi Browser Berhasil Diaktifkan! Penilai akan menerima notifikasi setiap ada dokumen bukti fisik baru yang diunggah.');
    } else {
      alert('⚠️ Izin notifikasi ditolak oleh browser. Anda tetap dapat melihat pembaruan dokumen melalui pusat notifikasi di aplikasi ini.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-800 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-700/60 rounded-xl">
              <Bell className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pemberitahuan Eviden</h3>
              <p className="text-xs text-emerald-200">Pembaruan Dokumen & Bukti Fisik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRequestPush}
              className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Izin Web Push</span>
            </button>
            <button
              onClick={playNotificationSound}
              className="p-1 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded-md transition-colors"
              title="Tes Nada Notifikasi"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-slate-500">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={onMarkAllAsRead}
                  className="hover:text-emerald-700 hover:underline"
                >
                  Tandai Dibaca
                </button>
                <span>•</span>
                <button
                  onClick={onClearNotifications}
                  className="hover:text-rose-600 hover:underline"
                >
                  Hapus Semua
                </button>
              </>
            )}
          </div>
        </div>

        {/* List Notifications */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-semibold text-slate-600">Belum Ada Pembaruan Dokumen</p>
              <p className="text-[11px] text-slate-400">
                Saat tim madrasah mengunggah atau menyematkan bukti fisik, penilai akan otomatis menerima notifikasi suara dan push di sini.
              </p>
            </div>
          ) : (
            notifications.map((item) => {
              const indicator = indicators.find((ind) => ind.id === item.indicatorId);
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectIndicator(item.indicatorId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer hover:shadow-xs ${
                    item.read
                      ? 'bg-slate-50/70 border-slate-200 opacity-80'
                      : 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white">
                        {item.indicatorCode}
                      </span>
                      <span className="text-[11px] font-bold text-slate-800 truncate">
                        {indicator?.subComponentName || item.indicatorCode}
                      </span>
                    </div>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1" />
                    )}
                  </div>

                  <p className="text-xs text-slate-700 font-medium mt-1.5 line-clamp-2">
                    📄 {item.title}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-1.5 border-t border-slate-100">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      Oleh: {item.userName}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[11px] text-slate-500">
          Notifikasi Real-time Penilaian Kinerja Kepala MTsN 7 Kebumen
        </div>
      </div>
    </div>
  );
};
