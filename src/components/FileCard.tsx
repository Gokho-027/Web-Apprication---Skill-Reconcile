import React, { useRef, useState } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  Image as ImageIcon,
  File,
  X,
  Eye,
  CheckCircle2,
  ClipboardPaste,
  Sparkles,
} from 'lucide-react';
import { AttachedFile } from '../types';
import { formatFileSize, processUploadedFile } from '../utils/fileReader';

interface FileCardProps {
  label: string;
  sublabel: string;
  badgeNumber: number;
  file: AttachedFile | null;
  onFileSelect: (file: AttachedFile) => void;
  onFileClear: () => void;
  onPreview: (file: AttachedFile) => void;
  accentColor?: 'indigo' | 'purple' | 'cyan';
}

export const FileCard: React.FC<FileCardProps> = ({
  label,
  sublabel,
  badgeNumber,
  file,
  onFileSelect,
  onFileClear,
  onPreview,
  accentColor = 'indigo',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);
  const [pastedName, setPastedName] = useState(`Document_${badgeNumber}.txt`);
  const [pastedText, setPastedText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const processed = await processUploadedFile(e.dataTransfer.files[0]);
      onFileSelect(processed);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const processed = await processUploadedFile(e.target.files[0]);
      onFileSelect(processed);
    }
  };

  const handleSavePastedText = () => {
    if (!pastedText.trim()) return;
    const newFile: AttachedFile = {
      id: Math.random().toString(36).substring(2, 9),
      name: pastedName.trim() || `Document_${badgeNumber}.txt`,
      size: new Blob([pastedText]).size,
      type: 'text/plain',
      content: pastedText,
      isBinary: false,
      lastModified: Date.now(),
    };
    onFileSelect(newFile);
    setIsPasteModalOpen(false);
    setPastedText('');
  };

  const getFileIcon = (fileName: string, mime?: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'ts' || ext === 'js' || ext === 'py' || ext === 'html' || ext === 'css' || ext === 'json') {
      return <FileCode className="w-8 h-8 text-amber-400" />;
    }
    if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp' || ext === 'gif') {
      return <ImageIcon className="w-8 h-8 text-emerald-400" />;
    }
    return <FileText className="w-8 h-8 text-indigo-400" />;
  };

  const accentStyles = {
    indigo: {
      badge: 'bg-indigo-600 text-white',
      borderActive: 'border-indigo-500 bg-indigo-500/5',
      text: 'text-indigo-400',
    },
    purple: {
      badge: 'bg-purple-600 text-white',
      borderActive: 'border-purple-500 bg-purple-500/5',
      text: 'text-purple-400',
    },
    cyan: {
      badge: 'bg-cyan-600 text-white',
      borderActive: 'border-cyan-500 bg-cyan-500/5',
      text: 'text-cyan-400',
    },
  }[accentColor];

  return (
    <div className="flex flex-col h-full bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm transition hover:border-slate-700">
      {/* Header Info */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${accentStyles.badge} shadow-sm shrink-0`}
          >
            #{badgeNumber}
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-sm">{label}</h3>
            <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{sublabel}</p>
          </div>
        </div>

        {file && (
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              พร้อมตรวจ
            </span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 min-h-[170px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center transition cursor-pointer group ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
              : 'border-slate-700/80 hover:border-slate-600 bg-slate-950/40 hover:bg-slate-950/70'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileInputChange}
            className="hidden"
            accept=".txt,.md,.markdown,.json,.csv,.ts,.tsx,.js,.jsx,.py,.html,.css,.sql,.pdf,image/*"
          />

          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition text-slate-400 group-hover:text-indigo-400">
            <Upload className="w-6 h-6" />
          </div>

          <p className="text-sm font-medium text-slate-200">
            คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-xs">
            รองรับ .txt, .md, .pdf, .json, .csv, code files, รูปภาพเอกสาร
          </p>

          <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsPasteModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 px-2.5 py-1 rounded-md transition"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              <span>หรือวางข้อความโดยตรง</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/50">
              {getFileIcon(file.name, file.mimeType)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100 truncate" title={file.name}>
                  {file.name}
                </p>
                <button
                  type="button"
                  onClick={onFileClear}
                  className="text-slate-400 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition"
                  title="ลบไฟล์นี้"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <span className="uppercase">{file.type?.split('/')[1] || 'text'}</span>
                {file.isBinary && (
                  <>
                    <span>•</span>
                    <span className="text-amber-400">Binary/Media</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Content Preview Snippet */}
          <div className="mt-3 bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-xs font-mono text-slate-400 line-clamp-3 overflow-hidden select-none">
            {file.isBinary
              ? `[ข้อมูลไฟล์ไบนารี: ${file.mimeType || 'สื่อหรือเอกสารแนบ'}]`
              : file.content.slice(0, 200) || '(เนื้อหาว่างเปล่า)'}
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onPreview(file)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>ดูตัวอย่างเนื้อหาไฟล์</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
            >
              เปลี่ยนไฟล์
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {/* Paste Modal */}
      {isPasteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="font-semibold text-slate-100 flex items-center gap-2">
                <ClipboardPaste className="w-4 h-4 text-indigo-400" />
                วางข้อความสำหรับ ไฟล์ที่ #{badgeNumber}
              </h4>
              <button
                onClick={() => setIsPasteModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 flex-1 overflow-y-auto">
              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  ชื่อไฟล์เสมือน
                </label>
                <input
                  type="text"
                  value={pastedName}
                  onChange={(e) => setPastedName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  placeholder="เช่น Contract_Draft.txt"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-400 block mb-1">
                  เนื้อหาข้อความ / สัญญา / สเปก / โค้ด
                </label>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="พิมพ์หรือวางข้อความที่นี่..."
                  className="w-full bg-slate-950 font-mono text-xs border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPasteModalOpen(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-lg transition"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleSavePastedText}
                disabled={!pastedText.trim()}
                className="px-4 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg transition"
              >
                ใช้ข้อความนี้เป็นไฟล์ #{badgeNumber}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
