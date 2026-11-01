/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PKKMComponent, PKKMIndicator } from '../types/pkkm';

export interface DriveItem {
  id: string;
  name: string;
  webViewLink?: string;
  mimeType?: string;
  parents?: string[];
}

export interface DriveFolderStructureResult {
  rootFolder: DriveItem;
  componentFolders: Record<number, DriveItem>;
  indicatorFolders: Record<string, DriveItem>;
}

/**
 * Buat folder tunggal di Google Drive
 */
export async function createDriveFolder(
  folderName: string,
  parentFolderId: string | null | undefined,
  accessToken: string
): Promise<DriveItem> {
  const metadata: Record<string, unknown> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const response = await fetch('https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink,parents', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || `Gagal membuat folder di Google Drive (Status: ${response.status})`
    );
  }

  return response.json();
}

/**
 * Atur permission agar folder / file dapat dibuka oleh tim penilai (Anyone with link can view)
 */
export async function shareFilePublicly(fileId: string, accessToken: string): Promise<void> {
  try {
    await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/permissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        role: 'reader',
        type: 'anyone',
      }),
    });
  } catch (err) {
    console.warn('Gagal mengubah permission publik (opsional):', err);
  }
}

/**
 * Upload file langsung ke Google Drive via Multipart upload
 */
export async function uploadFileToDrive(
  file: File,
  parentFolderId: string | undefined,
  accessToken: string
): Promise<DriveItem> {
  const metadata = {
    name: file.name,
    parents: parentFolderId ? [parentFolderId] : undefined,
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const fileContent = reader.result;
        const multipartRequestBody = new Blob([
          `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(
            metadata
          )}${delimiter}Content-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`,
          fileContent as ArrayBuffer,
          closeDelimiter,
        ]);

        const response = await fetch(
          'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,webContentLink,size',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': `multipart/related; boundary=${boundary}`,
            },
            body: multipartRequestBody,
          }
        );

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.error?.message || `Gagal mengunggah file (${response.status})`);
        }

        const data: DriveItem = await response.json();

        // Jadikan dokumen dapat diakses penilai
        await shareFilePublicly(data.id, accessToken);

        resolve(data);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error('Gagal membaca berkas file lokal'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Batch generate struktur folder & subfolder lengkap PKKM MTsN 7 Kebumen di Google Drive
 */
export async function generatePKKMFolderStructure(
  academicYear: string,
  components: PKKMComponent[],
  indicators: PKKMIndicator[],
  accessToken: string,
  onProgress: (statusMessage: string, percentage: number) => void
): Promise<DriveFolderStructureResult> {
  const totalTasks = 1 + components.length + indicators.length;
  let currentTask = 0;

  const updateProgress = (msg: string) => {
    currentTask++;
    const percent = Math.min(100, Math.round((currentTask / totalTasks) * 100));
    onProgress(msg, percent);
  };

  // 1. Buat Root Folder
  updateProgress(`Membuat Folder Utama: PKKM MTsN 7 Kebumen TP ${academicYear}...`);
  const rootFolderName = `PKKM MTsN 7 Kebumen - TP ${academicYear}`;
  const rootFolder = await createDriveFolder(rootFolderName, null, accessToken);
  await shareFilePublicly(rootFolder.id, accessToken);

  const componentFolders: Record<number, DriveItem> = {};
  const indicatorFolders: Record<string, DriveItem> = {};

  // 2. Buat Folder untuk masing-masing Komponen Utama (1 s.d 5)
  for (const comp of components) {
    const compFolderName = `${comp.id}. ${comp.name}`;
    updateProgress(`Membuat Subfolder: ${compFolderName}...`);
    const compFolder = await createDriveFolder(compFolderName, rootFolder.id, accessToken);
    componentFolders[comp.id] = compFolder;
    await shareFilePublicly(compFolder.id, accessToken);

    // 3. Buat Subfolder per Indikator Bukti Fisik
    const compIndicators = indicators.filter((ind) => ind.componentId === comp.id);
    for (const ind of compIndicators) {
      // Potong nama agar rapi di Drive
      const shortTitle = ind.subComponentName.length > 40
        ? ind.subComponentName.substring(0, 37) + '...'
        : ind.subComponentName;
      const indFolderName = `Bukti [${ind.code}] - ${shortTitle}`;
      
      updateProgress(`Membuat Folder Eviden: [${ind.code}]...`);
      const indFolder = await createDriveFolder(indFolderName, compFolder.id, accessToken);
      indicatorFolders[ind.id] = indFolder;
      await shareFilePublicly(indFolder.id, accessToken);
    }
  }

  onProgress('Struktur Folder PKKM berhasil dibuat lengkap di Google Drive!', 100);

  return {
    rootFolder,
    componentFolders,
    indicatorFolders,
  };
}
