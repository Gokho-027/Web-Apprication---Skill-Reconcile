import React from 'react';
import { X, FileText, Download, Copy, Check } from 'lucide-react';
import { AttachedFile } from '../types';
import { formatFileSize } from '../utils/fileReader';

interface FilePreviewModalProps {
  file: AttachedFile | null;
  onClose: () => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ file, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!file) return null;

  const handleCopy = () => {
    if (!file.isBinary) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (file.isBinary && file.base64Data) {
      const a = document.createElement('a');
      a.href = `data:${file.mimeType};base64,${file.base64Data}`;
      a.download = file.name;
      a.click();
    } else {
      const blob = new Blob([file.content], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm text-slate-100 truncate">{file.name}</h3>
              <p className="text-xs text-slate-400">
                {formatFileSize(file.size)} • {file.type || 'text/plain'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!file.isBinary && (
              <button
                type="button"
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1 px-2.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition flex items-center gap-1 px-2.5"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>ดาวน์โหลด</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
          {file.isBinary ? (
            file.mimeType?.startsWith('image/') ? (
              <div className="flex flex-col items-center justify-center p-4">
                <img
                  src={`data:${file.mimeType};base64,${file.base64Data}`}
                  alt={file.name}
                  className="max-h-[60vh] max-w-full rounded-lg border border-slate-800 object-contain shadow-lg"
                />
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <p className="text-sm font-semibold text-slate-200">ไฟล์เอกสารไบนารี / PDF</p>
                <p className="text-xs">
                  ระบบได้เตรียมข้อมูลไบนารีเข้ารหัส base64 สำหรับส่งเข้าประมวลผลกับโมเดล Gemini แล้ว
                </p>
              </div>
            )
          ) : (
            <pre className="whitespace-pre-wrap select-text">{file.content}</pre>
          )}
        </div>
      </div>
    </div>
  );
};
