/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Synthesize pleasant chime using Web Audio API (Zero external MP3 dependency)
export function playNotificationSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // First note (E5 - 659.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now);
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.35);

    // Second note (A5 - 880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12);
    gain2.gain.setValueAtTime(0.18, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.55);
  } catch (e) {
    console.warn('AudioContext playback error (silenced):', e);
  }
}

/**
 * Minta izin Web Push Notification dari penilai
 */
export async function requestPushNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    console.info('Browser ini tidak mendukung Desktop Notification API');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch (err) {
    console.warn('Gagal meminta izin notifikasi browser:', err);
    return 'denied';
  }
}

/**
 * Kirim Push Notification browser kepada penilai saat ada eviden baru atau revisi
 */
export function sendAssessorPushNotification(
  indicatorCode: string,
  evidenceTitle: string,
  uploaderName: string
): void {
  playNotificationSound();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      const notif = new Notification('🔔 Pembaruan Bukti Fisik PKKM MTsN 7 Kebumen', {
        body: `Eviden baru/revisi diunggah oleh ${uploaderName} pada [${indicatorCode}]: "${evidenceTitle}". Silakan diverifikasi & dinilai.`,
        icon: '/favicon.ico',
        tag: `pkkm-update-${indicatorCode}`,
      });

      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (e) {
      console.warn('Error displaying native browser notification:', e);
    }
  }
}
