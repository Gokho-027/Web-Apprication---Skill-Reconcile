import React from 'react';
import { Play, Sparkles, AlertCircle, Globe, ShieldCheck } from 'lucide-react';
import { AttachedFile } from '../types';

interface InspectionControlsProps {
  file1: AttachedFile | null;
  file2: AttachedFile | null;
  skillMd: string;
  isInspecting: boolean;
  onRunInspection: () => void;
  language: 'th' | 'en';
  onChangeLanguage: (lang: 'th' | 'en') => void;
  strictness: 'normal' | 'strict' | 'lenient';
  onChangeStrictness: (val: 'normal' | 'strict' | 'lenient') => void;
}

export const InspectionControls: React.FC<InspectionControlsProps> = ({
  file1,
  file2,
  skillMd,
  isInspecting,
  onRunInspection,
  language,
  onChangeLanguage,
  strictness,
  onChangeStrictness,
}) => {
  const isReady = Boolean(file1 && file2 && skillMd.trim());

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 shadow-lg shadow-indigo-950/20">
      <div className="flex flex-col md:flex-row items-center justify-between gap-5">
        {/* Settings: Language & Strictness */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-semibold text-slate-300">ภาษาของรายงาน:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-950 border border-slate-800">
              <button
                type="button"
                onClick={() => onChangeLanguage('th')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  language === 'th'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ไทย (Thai)
              </button>
              <button
                type="button"
                onClick={() => onChangeLanguage('en')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                  language === 'en'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Strictness Selector */}
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-300">ระดับความเข้มงวด:</span>
            <select
              value={strictness}
              onChange={(e) => onChangeStrictness(e.target.value as any)}
              className="bg-slate-950 text-xs text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="normal">มาตรฐาน (Normal)</option>
              <option value="strict">เข้มงวดสูง (Strict - Zero Tolerance)</option>
              <option value="lenient">ยืดหยุ่น (Lenient)</option>
            </select>
          </div>
        </div>

        {/* Big Run Button */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          {!isReady && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                {!file1
                  ? 'ยังไม่ได้แนบไฟล์ที่ 1'
                  : !file2
                  ? 'ยังไม่ได้แนบไฟล์ที่ 2'
                  : 'กรุณากรอกข้อกำหนดใน Skill .md'}
              </span>
            </div>
          )}

          <button
            type="button"
            onClick={onRunInspection}
            disabled={!isReady || isInspecting}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm shadow-xl transition-all cursor-pointer ${
              isReady && !isInspecting
                ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-600 hover:from-indigo-400 hover:via-purple-500 hover:to-pink-500 text-white shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
            }`}
          >
            {isInspecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>กำลังวิเคราะห์และตรวจสอบ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>เริ่มตรวจสอบไฟล์ด้วย AI ผ่าน Skill .md</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
