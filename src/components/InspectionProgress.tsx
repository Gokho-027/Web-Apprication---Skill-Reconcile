import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Search, FileSpreadsheet, Scale, Sparkles } from 'lucide-react';

interface InspectionProgressProps {
  file1Name: string;
  file2Name: string;
}

export const InspectionProgress: React.FC<InspectionProgressProps> = ({
  file1Name,
  file2Name,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'กำลังอ่านและประมวลผลไฟล์ทั้งสอง',
      sub: `อ่านข้อมูลจาก ${file1Name} และ ${file2Name}`,
      icon: Search,
    },
    {
      title: 'แยกย่อยกฎและ Rubric จาก Skill .md',
      sub: 'ตีความข้อกำหนด เกณฑ์การประเมิน กฎความปลอดภัย และเงื่อนไขผ่าน/ตก',
      icon: FileSpreadsheet,
    },
    {
      title: 'เปรียบเทียบและค้นหาข้อขัดแย้ง (Cross-Verification)',
      sub: 'Gemini 3.8 Flash กำลังตรวจสอบหาจุดแตกต่าง ความเสี่ยง และความคลาดเคลื่อน',
      icon: Scale,
    },
    {
      title: 'คำนวณคะแนนและสรุปรายงานผลการตรวจสอบ',
      sub: 'จัดทำ Checklist หลักฐานอ้างอิง และข้อเสนอแนะเชิงปฏิบัติการ',
      icon: Sparkles,
    },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1800);
    const timer2 = setTimeout(() => setCurrentStep(2), 3800);
    const timer3 = setTimeout(() => setCurrentStep(3), 6200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Animated icon */}
        <div className="inline-flex relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Cpu className="w-8 h-8 animate-pulse text-indigo-400" />
          </div>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-indigo-500"></span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-slate-100 tracking-tight">
          AI กำลังตรวจสอบและประเมินผลไฟล์ผ่าน Skill .md
        </h3>
        <p className="text-xs text-slate-400 mt-2">
          ระบบกำลังวิเคราะห์เนื้อหาเชิงลึก เทียบกับกฎและเกณฑ์คะแนนที่ระบุไว้ใน Markdown
        </p>

        {/* Dynamic Steps */}
        <div className="mt-8 space-y-3 text-left">
          {steps.map((step, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            const Icon = step.icon;

            return (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border transition-all flex items-center gap-3.5 ${
                  isDone
                    ? 'bg-slate-950/40 border-emerald-500/30 text-slate-300'
                    : isCurrent
                    ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm text-slate-100 ring-1 ring-indigo-500/20'
                    : 'bg-slate-950/20 border-slate-800/40 text-slate-500 opacity-50'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isDone
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : isCurrent
                      ? 'bg-indigo-500/20 text-indigo-400'
                      : 'bg-slate-800 text-slate-600'
                  }`}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : isCurrent ? (
                    <div className="w-3.5 h-3.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold leading-tight">{step.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">{step.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
