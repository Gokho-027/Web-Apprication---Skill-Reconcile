import React from 'react';
import { Sparkles, FileCheck2, HelpCircle, Share2, Download, Cpu, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  onOpenHowItWorks: () => void;
  onOpenShareAndInstall: () => void;
  hasApiKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHowItWorks,
  onOpenShareAndInstall,
  hasApiKey,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <FileCheck2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg text-slate-100 tracking-tight">
                AI Skill Inspector
              </h1>
              <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PWA Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              ตรวจสอบ 2 ไฟล์ด้วย AI ผ่านข้อกำหนดและเกณฑ์ใน Skill .md
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Install Button if browser supports it directly */}
          {isInstallable && !isInstalled && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition cursor-pointer"
              title="ติดตั้งลงเครื่องเป็นแอป"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ติดตั้งลงเครื่อง</span>
            </button>
          )}

          {/* Share & Deployment Guide Button */}
          <button
            onClick={onOpenShareAndInstall}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>แชร์ & วิธีนำไปใช้</span>
          </button>

          {/* How It Works Button */}
          <button
            onClick={onOpenHowItWorks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span className="hidden md:inline">Skill .md คืออะไร</span>
          </button>
        </div>
      </div>
    </header>
  );
};
