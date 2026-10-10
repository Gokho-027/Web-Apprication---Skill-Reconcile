import { AttachedFile } from '../types';

export async function processUploadedFile(file: File): Promise<AttachedFile> {
  const isImage = file.type.startsWith('image/');
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isBinary = isImage || isPdf;

  if (isBinary) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Data URL format: "data:image/png;base64,iVBORw..."
        const base64Data = result.split(',')[1] || '';
        resolve({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type || (isPdf ? 'application/pdf' : 'application/octet-stream'),
          content: `[Attached Binary File: ${file.name} (${(file.size / 1024).toFixed(1)} KB)]`,
          isBinary: true,
          base64Data,
          mimeType: file.type || (isPdf ? 'application/pdf' : 'image/png'),
          lastModified: file.lastModified,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  } else {
    // Read text-based files (txt, md, js, ts, py, json, csv, html, etc.)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = (reader.result as string) || '';
        resolve({
          id: Math.random().toString(36).substring(2, 9),
          name: file.name,
          size: file.size,
          type: file.type || 'text/plain',
          content: text,
          isBinary: false,
          lastModified: file.lastModified,
        });
      };
      reader.onerror = (err) => reject(err);
      reader.readAsText(file);
    });
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
