import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { FileCard } from './components/FileCard';
import { SkillEditor } from './components/SkillEditor';
import { InspectionControls } from './components/InspectionControls';
import { InspectionProgress } from './components/InspectionProgress';
import { InspectionResults } from './components/InspectionResults';
import { FilePreviewModal } from './components/FilePreviewModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { ShareAndInstallModal } from './components/ShareAndInstallModal';
import { AttachedFile, InspectionResult, SkillTemplate } from './types';
import { SKILL_TEMPLATES } from './data/skillTemplates';
import { AlertCircle, FileCheck2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function App() {
  // Primary States
  const [file1, setFile1] = useState<AttachedFile | null>(null);
  const [file2, setFile2] = useState<AttachedFile | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(SKILL_TEMPLATES[0].id);
  const [skillMd, setSkillMd] = useState<string>(SKILL_TEMPLATES[0].content);

  // Inspection options
  const [language, setLanguage] = useState<'th' | 'en'>('th');
  const [strictness, setStrictness] = useState<'normal' | 'strict' | 'lenient'>('normal');

  // Process & Results
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectionResult, setInspectionResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [previewFile, setPreviewFile] = useState<AttachedFile | null>(null);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isShareAndInstallOpen, setIsShareAndInstallOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasApiKey !== undefined) {
          setHasApiKey(data.hasApiKey);
        }
      })
      .catch((err) => {
        console.error('API health check error:', err);
      });
  }, []);

  // When a template is selected
  const handleSelectTemplate = (template: SkillTemplate) => {
    setSelectedTemplateId(template.id);
    setSkillMd(template.content);
  };

  // Load sample files from template
  const handleLoadSampleFiles = (template: SkillTemplate) => {
    if (template.sampleFile1) {
      setFile1({
        id: 'sample-1-' + Date.now(),
        name: template.sampleFile1.name,
        size: new Blob([template.sampleFile1.content]).size,
        type: template.sampleFile1.type,
        content: template.sampleFile1.content,
        isBinary: false,
        lastModified: Date.now(),
      });
    }

    if (template.sampleFile2) {
      setFile2({
        id: 'sample-2-' + Date.now(),
        name: template.sampleFile2.name,
        size: new Blob([template.sampleFile2.content]).size,
        type: template.sampleFile2.type,
        content: template.sampleFile2.content,
        isBinary: false,
        lastModified: Date.now(),
      });
    }

    // Also update skill template if different
    setSelectedTemplateId(template.id);
    setSkillMd(template.content);
    setError(null);
  };

  // Run AI Inspection
  const handleRunInspection = async () => {
    if (!file1 || !file2) {
      setError('กรุณาแนบไฟล์ทั้ง 2 ไฟล์ก่อนเริ่มการตรวจสอบ');
      return;
    }

    if (!skillMd.trim()) {
      setError('กรุณาระบุข้อกำหนดใน Skill .md');
      return;
    }

    setIsInspecting(true);
    setError(null);
    setInspectionResult(null);

    try {
      const response = await fetch('/api/inspect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file1,
          file2,
          skillMd,
          options: {
            language,
            strictness,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'การตรวจสอบล้มเหลว กรุณาลองใหม่อีกครั้ง');
      }

      setInspectionResult(data.data);
      // Scroll to results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Inspection failed:', err);
      setError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์ AI');
    } finally {
      setIsInspecting(false);
    }
  };

  const handleReset = () => {
    setInspectionResult(null);
    setError(null);
  };

  const currentTemplate =
    SKILL_TEMPLATES.find((t) => t.id === selectedTemplateId) || SKILL_TEMPLATES[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Header
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenShareAndInstall={() => setIsShareAndInstallOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Error Notification */}
        {error && (
          <div className="bg-rose-950/40 border border-rose-500/50 rounded-2xl p-4 flex items-start justify-between gap-3 text-rose-200 text-xs animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-300">เกิดข้อผิดพลาดในการตรวจสอบ</p>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white px-2 py-1 rounded hover:bg-rose-900/50 cursor-pointer"
            >
              ปิด
            </button>
          </div>
        )}

        {/* If Inspection Result is Ready: Show Complete Audit Dashboard */}
        {inspectionResult && file1 && file2 ? (
          <InspectionResults
            result={inspectionResult}
            file1={file1}
            file2={file2}
            onReset={handleReset}
          />
        ) : isInspecting ? (
          /* While AI is auditing: High-tech progress indicator */
          <InspectionProgress
            file1Name={file1?.name || 'ไฟล์ที่ 1'}
            file2Name={file2?.name || 'ไฟล์ที่ 2'}
          />
        ) : (
          /* Input & Setup Workflow */
          <div className="space-y-8">
            {/* Hero / Quick Explainer */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="max-w-3xl space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Dual-File Inspection & Cross-Verification Agent</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
                  แนบไฟล์ 2 ไฟล์ แล้วให้ AI ตรวจสอบผ่านเกณฑ์ใน{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Skill .md
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  ระบบจะอ่านข้อกำหนด กฎเกณฑ์ และ Rubric การให้คะแนนที่เขียนอยู่ในรูปแบบ Markdown (.md) แล้วนำไปตรวจไฟล์คู่ เช่น สัญญา vs ข้อเสนอ, ซอร์สโค้ด vs สเปก, หรือใบแจ้งหนี้ vs ใบสั่งซื้อ พร้อมระบุจุดขัดแย้งและหลักฐานอ้างอิงตรงจากไฟล์
                </p>
              </div>

              {/* Sample files quick loader button */}
              <div className="mt-6 flex flex-wrap items-center gap-3 pt-5 border-t border-slate-800/80">
                <span className="text-xs font-semibold text-slate-400">
                  ทดสอบอย่างรวดเร็วด้วยชุดข้อมูลตัวอย่าง:
                </span>
                <button
                  type="button"
                  onClick={() => handleLoadSampleFiles(SKILL_TEMPLATES[0])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <span>📄 ตัวอย่าง: ตรวจสัญญา vs ใบเสนอราคา</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleFiles(SKILL_TEMPLATES[1])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <span>💻 ตัวอย่าง: ตรวจโค้ด vs ข้อกำหนด MFA Spec</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleLoadSampleFiles(SKILL_TEMPLATES[3])}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-200 transition cursor-pointer"
                >
                  <span>💰 ตัวอย่าง: ตรวจใบสั่งซื้อ PO vs Invoice</span>
                </button>
              </div>
            </div>

            {/* Section 1: Dual File Attachment Cards */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="font-bold text-slate-100 text-base">แนบไฟล์ทั้ง 2 ไฟล์ที่ต้องการตรวจสอบ</h3>
                </div>
                {(file1 || file2) && (
                  <button
                    onClick={() => {
                      setFile1(null);
                      setFile2(null);
                    }}
                    className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
                  >
                    ล้างไฟล์ทั้งคู่
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* File 1 Card */}
                <FileCard
                  label="ไฟล์ที่ 1 (File 1 / Reference File)"
                  sublabel={currentTemplate.file1Label}
                  badgeNumber={1}
                  file={file1}
                  onFileSelect={setFile1}
                  onFileClear={() => setFile1(null)}
                  onPreview={(f) => setPreviewFile(f)}
                  accentColor="indigo"
                />

                {/* File 2 Card */}
                <FileCard
                  label="ไฟล์ที่ 2 (File 2 / Target File)"
                  sublabel={currentTemplate.file2Label}
                  badgeNumber={2}
                  file={file2}
                  onFileSelect={setFile2}
                  onFileClear={() => setFile2(null)}
                  onPreview={(f) => setPreviewFile(f)}
                  accentColor="purple"
                />
              </div>
            </div>

            {/* Section 2: Skill .md Editor */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-bold text-slate-100 text-base">
                  กำหนดกฎและเกณฑ์การตรวจใน Skill .md
                </h3>
              </div>

              <SkillEditor
                currentSkillMd={skillMd}
                onChangeSkillMd={setSkillMd}
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={handleSelectTemplate}
                onLoadSampleFiles={handleLoadSampleFiles}
              />
            </div>

            {/* Section 3: Inspection Controls & Trigger */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-bold text-slate-100 text-base">
                  ตั้งค่ารายงานและสั่งให้ AI ดำเนินการตรวจ
                </h3>
              </div>

              <InspectionControls
                file1={file1}
                file2={file2}
                skillMd={skillMd}
                isInspecting={isInspecting}
                onRunInspection={handleRunInspection}
                language={language}
                onChangeLanguage={setLanguage}
                strictness={strictness}
                onChangeStrictness={setStrictness}
              />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <FilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
      />

      {isHowItWorksOpen && (
        <HowItWorksModal onClose={() => setIsHowItWorksOpen(false)} />
      )}

      {isShareAndInstallOpen && (
        <ShareAndInstallModal onClose={() => setIsShareAndInstallOpen(false)} />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>
          Dual-File AI Skill Inspector • Powered by Google Gemini 3.8 Flash & Google AI Studio
        </p>
      </footer>
    </div>
  );
}
