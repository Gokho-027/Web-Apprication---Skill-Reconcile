import React, { useState } from 'react';
import {
  X,
  Share2,
  Download,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Globe,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface ShareAndInstallModalProps {
  onClose: () => void;
}

export const ShareAndInstallModal: React.FC<ShareAndInstallModalProps> = ({ onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'share' | 'pwa' | 'export'>('share');

  // Shared URL from AI Studio environment or current location
  const appUrl =
    window.location.origin.includes('localhost') || window.location.origin.includes('0.0.0.0')
      ? 'https://ais-pre-zaahjon27zdtqb7qcsyg7t-899518198849.asia-southeast1.run.app'
      : window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-600 text-white shadow-md shadow-indigo-600/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                วิธีนำแอปพลิเคชันไปให้ผู้ใช้ใช้งาน (Distribution & Deployment)
              </h3>
              <p className="text-xs text-slate-400">
                คุณสามารถเลือกส่งให้ผู้ใช้ใช้งานได้ทันทีผ่าน 3 ช่องทางสะดวก
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'share'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>1. ส่งลิงก์ใช้งานทันที (Web Link)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pwa')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'pwa'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>2. ติดตั้งเป็นแอปบนมือถือ/คอม (PWA)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'export'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>3. นำโค้ดไป Deploy หรือสร้าง Native App</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs leading-relaxed">
          {/* TAB 1: Share Link */}
          {activeTab === 'share' && (
            <div className="space-y-5">
              <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-4 space-y-3">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                  🚀 แอปของคุณขึ้นเซิร์ฟเวอร์ Cloud Run พร้อมใช้งานแล้ว!
                </span>
                <p className="text-slate-300">
                  ระบบบน Google AI Studio ได้สร้าง URL สำหรับเปิดใช้งานจริงไว้ให้แล้ว ผู้ใช้ไม่ต้องดาวน์โหลดหรือติดตั้งอะไร สามารถเปิดผ่านเบราว์เซอร์ได้ทันที
                </p>

                {/* Link Box */}
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2.5">
                  <span className="font-mono text-xs text-indigo-300 truncate flex-1 select-all px-1">
                    {appUrl}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition shrink-0 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>คัดลอกแล้ว!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>คัดลอกลิงก์</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instructions on how to Share from AI Studio */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  วิธีเปิดสิทธิ์ให้ผู้อื่นเข้าใช้งานผ่านปุ่ม Share บน AI Studio:
                </h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 font-sans">
                  <li>
                    มองไปที่ <strong>แถบเครื่องมือด้านบนขวาของ Google AI Studio</strong> จะมีปุ่ม <strong>"Share"</strong>
                  </li>
                  <li>
                    คลิกปุ่ม <strong>Share</strong> แล้วเลือกสิทธิ์การเข้าถึง เช่น <em>Anyone with the link</em> (ทุกคนที่มีลิงก์เข้าใช้ได้)
                  </li>
                  <li>
                    ส่งลิงก์ดังกล่าวให้เพื่อนร่วมงาน ลูกค้า หรือผู้ใช้งานได้ทันที!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: PWA Installation */}
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      ติดตั้งเป็น Progressive Web App (PWA)
                    </h4>
                    <p className="text-slate-400 mt-1">
                      สามารถติดตั้งลงบนหน้าจอโฮมของมือถือและเดสก์ท็อป โดยจะมีไอคอนแอป เปิดเต็มหน้าจอเหมือนแอปพลิเคชันจริง (Native App) โดยไม่ต้องผ่าน App Store หรือ Play Store
                    </p>
                  </div>

                  {/* 1-click Install button if supported */}
                  {isInstallable && (
                    <button
                      type="button"
                      onClick={install}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg transition cursor-pointer shrink-0"
                    >
                      <Download className="w-4 h-4" />
                      <span>ติดตั้งแอปเดี๋ยวนี้</span>
                    </button>
                  )}
                </div>

                {isInstalled && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>แอปพลิเคชันนี้ถูกติดตั้งบนเครื่องนี้เรียบร้อยแล้ว</span>
                  </div>
                )}
              </div>

              {/* Step-by-Step for Platforms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* iOS Safari */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                    📱 สำหรับ iPhone / iPad (iOS Safari)
                  </span>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-[11px] pt-1">
                    <li>เปิดลิงก์แอปในเว็บเบราว์เซอร์ <strong>Safari</strong></li>
                    <li>แตะปุ่ม <strong>Share (ไอคอนแชร์ ด้านล่าง)</strong></li>
                    <li>เลื่อนลงแล้วเลือก <strong>"Add to Home Screen (เพิ่มไปยังหน้าจอโฮม)"</strong></li>
                    <li>จะได้ไอคอนแอปปรากฏบนหน้าจอมือถือ แตะเปิดใช้งานแบบแอปจริงได้เลย</li>
                  </ol>
                </div>

                {/* Android Chrome */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    🤖 สำหรับ Android (Chrome / Edge)
                  </span>
                  <ol className="list-decimal pl-5 space-y-1 text-slate-300 text-[11px] pt-1">
                    <li>เปิดลิงก์แอปใน <strong>Google Chrome</strong></li>
                    <li>แตะที่เมนู <strong>จุด 3 จุด (มุมขวาบน)</strong></li>
                    <li>เลือก <strong>"Install app (ติดตั้งแอป)"</strong> หรือ "Add to Home screen"</li>
                    <li>แอปจะถูกติดตั้งลงในหน้ารวมแอปของมือถือทันที</li>
                  </ol>
                </div>

                {/* Windows / Mac Desktop */}
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 md:col-span-2">
                  <span className="text-[11px] font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                    💻 สำหรับคอมพิวเตอร์ (Windows / macOS)
                  </span>
                  <p className="text-slate-300 text-[11px] pt-1">
                    เปิดใน Google Chrome หรือ Microsoft Edge แล้วคลิกไอคอน <strong>"Install / ติดตั้ง"</strong> ที่อยู่ด้านขวาสุดของช่องใส่ URL เพื่อเปิดแอปในหน้าต่างแยกเหมือนโปรแกรมบนคอมพิวเตอร์
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Export to Production / Native */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="font-bold text-sm text-slate-100">
                  ต้องการนำไปเปิดบริการเป็นผลิตภัณฑ์ หรือแปลงเป็นแอปบน App Store?
                </h4>
                <p className="text-slate-300">
                  แอปพลิเคชันนี้สร้างด้วยมาตรฐาน <strong>React + TypeScript + Express + Vite + Tailwind CSS</strong> สามารถนำ source code ไปต่อยอดได้ดังนี้:
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <h5 className="font-bold text-indigo-300 text-xs mb-1">
                    1. Deploy ด้วย Docker หรือ Cloud Run / Vercel ขององค์กร
                  </h5>
                  <p className="text-slate-400 text-[11px]">
                    สามารถโหลดโค้ดขึ้น GitHub แล้วเชื่อมต่อกับ Cloud Run, Vercel, หรือ Render โดยตั้งค่า Environment Variable <code>GEMINI_API_KEY</code> ในระบบปลายทาง
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <h5 className="font-bold text-purple-300 text-xs mb-1">
                    2. แปลงเป็น Native App (iOS .ipa / Android .apk)
                  </h5>
                  <p className="text-slate-400 text-[11px]">
                    ใช้ <strong>Capacitor</strong> (เช่น <code>npx cap init</code> และ <code>npx cap add android</code> / <code>npx cap add ios</code>) เพื่อแปลงโค้ดเว็บนี้เป็นไฟล์ APK หรือ IPA เพื่อลง Google Play Store และ Apple App Store ได้ทันที
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                  <h5 className="font-bold text-emerald-300 text-xs mb-1">
                    3. แปลงเป็น Desktop App (.exe / .dmg)
                  </h5>
                  <p className="text-slate-400 text-[11px]">
                    สามารถใช้ <strong>Tauri</strong> หรือ <strong>Electron</strong> ครอบเว็บแอปเพื่อบิลด์เป็นไฟล์ติดตั้งสำหรับ Windows และ Mac ได้อย่างง่ายดาย
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyLink}
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>คัดลอกลิงก์แอป</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition cursor-pointer"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
