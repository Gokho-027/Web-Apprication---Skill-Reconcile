import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Copy,
  Check,
  Download,
  Printer,
  RotateCcw,
  Scale,
  FileText,
  FileCheck2,
  ShieldCheck,
  FileSpreadsheet,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { InspectionResult, AttachedFile } from '../types';
import { renderMarkdownToHtml } from '../utils/markdownRenderer';

interface InspectionResultsProps {
  result: InspectionResult;
  file1: AttachedFile;
  file2: AttachedFile;
  onReset: () => void;
}

export const InspectionResults: React.FC<InspectionResultsProps> = ({
  result,
  file1,
  file2,
  onReset,
}) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'criteria' | 'discrepancies' | 'files' | 'markdown'>('summary');
  const [criteriaFilter, setCriteriaFilter] = useState<'all' | 'passed' | 'warning' | 'failed'>('all');
  const [copied, setCopied] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState<Record<number, boolean>>({});

  useEffect(() => {
    // Fire confetti if result is PASS or score >= 85
    if (result.overallVerdict === 'PASS' || result.score >= 85) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }
    }
  }, [result]);

  const toggleCriterionExpand = (idx: number) => {
    setExpandedCriteria((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(result.markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([result.markdownReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Report_${file1.name}_vs_${file2.name}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Audit_Result_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Verdict configs
  const verdictConfig = {
    PASS: {
      label: 'ผ่านการตรวจสอบ (PASSED)',
      sub: 'ไฟล์ทั้งสองสอดคล้องกันและผ่านเกณฑ์ใน Skill .md อย่างสมบูรณ์',
      color: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      gradient: 'from-emerald-950/50 via-slate-900 to-slate-900 border-emerald-500/40',
      icon: CheckCircle2,
    },
    CONDITIONAL_PASS: {
      label: 'ผ่านแบบมีเงื่อนไข (CONDITIONAL PASS)',
      sub: 'ผ่านเกณฑ์ส่วนใหญ่ แต่มีข้อเสนอแนะหรือประเด็นย่อยที่ควรปรับปรุง',
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
      gradient: 'from-amber-950/50 via-slate-900 to-slate-900 border-amber-500/40',
      icon: AlertTriangle,
    },
    NEEDS_REVISION: {
      label: 'ต้องแก้ไขปรับปรุง (NEEDS REVISION)',
      sub: 'พบข้อขัดแย้งหรือเกณฑ์สำคัญที่ไม่ตรงกัน ต้องแก้ไขก่อนนำไปใช้งาน',
      color: 'text-orange-400',
      badgeBg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      gradient: 'from-orange-950/50 via-slate-900 to-slate-900 border-orange-500/40',
      icon: AlertCircle,
    },
    FAIL: {
      label: 'ไม่ผ่านการตรวจสอบ (FAILED)',
      sub: 'พบข้อบกพร่องร้ายแรง ข้อขัดแย้ง หรือไม่ตรงตามข้อกำหนดใน Skill .md',
      color: 'text-rose-400',
      badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
      gradient: 'from-rose-950/50 via-slate-900 to-slate-900 border-rose-500/40',
      icon: XCircle,
    },
  }[result.overallVerdict] || {
    label: result.overallVerdict,
    sub: '',
    color: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
    gradient: 'from-indigo-950/50 via-slate-900 to-slate-900 border-indigo-500/40',
    icon: CheckCircle2,
  };

  const VerdictIcon = verdictConfig.icon;

  // Counts
  const totalCriteria = result.skillCriteriaEvaluations?.length || 0;
  const passedCriteria =
    result.skillCriteriaEvaluations?.filter((c) => c.status === 'PASSED').length || 0;
  const warningCriteria =
    result.skillCriteriaEvaluations?.filter((c) => c.status === 'WARNING').length || 0;
  const failedCriteria =
    result.skillCriteriaEvaluations?.filter((c) => c.status === 'FAILED').length || 0;
  const totalDiscrepancies = result.discrepancies?.length || 0;

  // Filtered criteria list
  const filteredCriteria = (result.skillCriteriaEvaluations || []).filter((c) => {
    if (criteriaFilter === 'passed') return c.status === 'PASSED';
    if (criteriaFilter === 'warning') return c.status === 'WARNING';
    if (criteriaFilter === 'failed') return c.status === 'FAILED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Master Verdict Card */}
      <div
        className={`bg-gradient-to-br ${verdictConfig.gradient} border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Verdict title & reason */}
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${verdictConfig.badgeBg}`}
              >
                <VerdictIcon className="w-4 h-4" />
                {verdictConfig.label}
              </span>
              <span className="text-xs text-slate-400">
                ประเมินเทียบกับ Skill .md เรียบร้อยแล้ว
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight leading-snug">
              {result.verdictReason}
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed">
              เปรียบเทียบไฟล์: <strong className="text-slate-200">"{file1.name}"</strong> กับ{' '}
              <strong className="text-slate-200">"{file2.name}"</strong>
            </p>
          </div>

          {/* Right: Score Gauge & Stats */}
          <div className="flex items-center gap-6 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 shrink-0">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-24 h-24 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-slate-800"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    className={verdictConfig.color}
                    fill="transparent"
                    strokeDasharray={251.2}
                    strokeDashoffset={251.2 - (251.2 * result.score) / 100}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-slate-100 tracking-tight">
                    {result.score}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">
                    / 100 คะแนน
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-300 mt-1">คะแนนความสอดคล้อง</span>
            </div>

            {/* Micro Stats */}
            <div className="border-l border-slate-800 pl-5 space-y-2 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> ผ่านเกณฑ์:
                </span>
                <span className="font-bold text-emerald-400">
                  {passedCriteria}/{totalCriteria}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> มีข้อสังเกต:
                </span>
                <span className="font-bold text-amber-400">{warningCriteria}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-400" /> ไม่ผ่านเกณฑ์:
                </span>
                <span className="font-bold text-rose-400">{failedCriteria}</span>
              </div>
              <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-indigo-400" /> จุดขัดแย้ง:
                </span>
                <span className="font-bold text-indigo-400">{totalDiscrepancies} จุด</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">คัดลอกรายงานแล้ว!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-indigo-400" />
                  <span>คัดลอกรายงาน Markdown</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>ดาวน์โหลด .md</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>ดาวน์โหลด JSON</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-slate-400" />
              <span>พิมพ์ / ส่งออก PDF</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-300 hover:text-white text-xs font-medium transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>เริ่มตรวจสอบไฟล์คู่ใหม่</span>
          </button>
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-800 overflow-x-auto gap-2 py-1">
        <button
          type="button"
          onClick={() => setActiveTab('summary')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'summary'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>บทสรุป & ภาพรวม (Summary)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('criteria')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'criteria'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>เกณฑ์ประเมินใน Skill .md ({totalCriteria})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('discrepancies')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'discrepancies'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Scale className="w-4 h-4" />
          <span>ข้อขัดแย้ง & จุดต่าง ({totalDiscrepancies})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'files'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>วิเคราะห์ไฟล์ที่ 1 & ไฟล์ที่ 2</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('markdown')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
            activeTab === 'markdown'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>รายงาน Markdown ฉบับเต็ม</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* Tab: Summary */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Executive Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Thai Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>🇹🇭 บทสรุปผู้บริหาร (Executive Summary - TH)</span>
                </h3>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {result.summaryTh}
              </div>
            </div>

            {/* English Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                  <span>🇬🇧 Executive Summary (EN)</span>
                </h3>
              </div>
              <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {result.summaryEn}
              </div>
            </div>
          </div>

          {/* Actionable Recommendations Checklist */}
          {result.actionableRecommendations && result.actionableRecommendations.length > 0 && (
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2 mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>ข้อเสนอแนะเชิงปฏิบัติการที่แนะนำให้ดำเนินการ (Action Plan)</span>
              </h3>
              <div className="space-y-2.5">
                {result.actionableRecommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[11px]">
                      {i + 1}
                    </span>
                    <p className="leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Criteria Checklist */}
      {activeTab === 'criteria' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400" />
              <span>กรองสถานะ:</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCriteriaFilter('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  criteriaFilter === 'all'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                ทั้งหมด ({totalCriteria})
              </button>
              <button
                type="button"
                onClick={() => setCriteriaFilter('passed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  criteriaFilter === 'passed'
                    ? 'bg-emerald-600 text-white'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                ผ่าน ({passedCriteria})
              </button>
              <button
                type="button"
                onClick={() => setCriteriaFilter('warning')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  criteriaFilter === 'warning'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-400/80 hover:text-amber-300'
                }`}
              >
                เตือน ({warningCriteria})
              </button>
              <button
                type="button"
                onClick={() => setCriteriaFilter('failed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  criteriaFilter === 'failed'
                    ? 'bg-rose-600 text-white'
                    : 'text-rose-400/80 hover:text-rose-300'
                }`}
              >
                ตก ({failedCriteria})
              </button>
            </div>
          </div>

          {/* Criteria Cards */}
          <div className="space-y-3">
            {filteredCriteria.map((criterion, idx) => {
              const isExpanded = expandedCriteria[idx] ?? true;

              const statusStyle = {
                PASSED: {
                  badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  icon: CheckCircle2,
                  label: 'ผ่านเกณฑ์',
                  border: 'border-slate-800 hover:border-emerald-500/30',
                },
                WARNING: {
                  badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  icon: AlertTriangle,
                  label: 'มีข้อสังเกต',
                  border: 'border-amber-500/30 hover:border-amber-500/50',
                },
                FAILED: {
                  badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  icon: XCircle,
                  label: 'ไม่ผ่านเกณฑ์',
                  border: 'border-rose-500/30 hover:border-rose-500/50',
                },
              }[criterion.status] || {
                badge: 'bg-slate-800 text-slate-300 border-slate-700',
                icon: AlertCircle,
                label: criterion.status,
                border: 'border-slate-800',
              };

              const StatusIcon = statusStyle.icon;

              return (
                <div
                  key={idx}
                  className={`bg-slate-900 border rounded-2xl p-5 transition shadow-sm ${statusStyle.border}`}
                >
                  {/* Criteria Header */}
                  <div
                    onClick={() => toggleCriterionExpand(idx)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-md mt-0.5">
                        <StatusIcon className="w-5 h-5 text-current" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-100">
                            {criterion.criteriaName}
                          </h4>
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${statusStyle.badge}`}
                          >
                            {statusStyle.label}
                          </span>
                          <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            คะแนน: {criterion.score}/100
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">{criterion.description}</p>
                      </div>
                    </div>

                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3.5 text-xs">
                      {/* Evidence Quotes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {criterion.evidenceFile1 && (
                          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                            <span className="text-[11px] font-semibold text-indigo-400 block mb-1">
                              📄 หลักฐานอ้างอิงจาก "{file1.name}":
                            </span>
                            <blockquote className="font-mono text-[11px] text-slate-300 italic border-l-2 border-indigo-500 pl-2 leading-relaxed">
                              "{criterion.evidenceFile1}"
                            </blockquote>
                          </div>
                        )}

                        {criterion.evidenceFile2 && (
                          <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                            <span className="text-[11px] font-semibold text-purple-400 block mb-1">
                              📄 หลักฐานอ้างอิงจาก "{file2.name}":
                            </span>
                            <blockquote className="font-mono text-[11px] text-slate-300 italic border-l-2 border-purple-500 pl-2 leading-relaxed">
                              "{criterion.evidenceFile2}"
                            </blockquote>
                          </div>
                        )}
                      </div>

                      {/* Reasoning */}
                      <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/60">
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1">
                          🧠 การวิเคราะห์และเหตุผลจาก AI:
                        </span>
                        <p className="text-slate-300 leading-relaxed font-sans">
                          {criterion.reasoning}
                        </p>
                      </div>

                      {/* Recommendation */}
                      {criterion.recommendation && (
                        <div className="flex items-start gap-2 bg-indigo-950/20 p-3 rounded-xl border border-indigo-500/20 text-indigo-200">
                          <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold block text-[11px] text-indigo-300">
                              คำแนะนำในการปรับปรุงแก้ไข:
                            </span>
                            <p className="text-[11px] leading-relaxed mt-0.5 text-indigo-100">
                              {criterion.recommendation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Discrepancies */}
      {activeTab === 'discrepancies' && (
        <div className="space-y-4">
          {totalDiscrepancies === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-100">ไม่พบข้อขัดแย้งหรือความคลาดเคลื่อน</h3>
              <p className="text-xs text-slate-400 mt-1">
                ไฟล์ทั้งสองมีความสอดคล้องกันและเป็นไปในทิศทางเดียวกันอย่างสมบูรณ์
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {result.discrepancies.map((disc, idx) => {
                const severityBadge = {
                  HIGH: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
                  MEDIUM: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  LOW: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                  INFO: 'bg-slate-800 text-slate-300 border-slate-700',
                }[disc.severity] || 'bg-slate-800 text-slate-300 border-slate-700';

                return (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-sm"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-300">
                          #{idx + 1}
                        </span>
                        <h4 className="font-bold text-sm text-slate-100">{disc.item}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${severityBadge}`}
                      >
                        ความรุนแรง: {disc.severity}
                      </span>
                    </div>

                    {/* Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[11px] font-bold text-indigo-400 mb-1">
                          ไฟล์ที่ 1 ("{file1.name}"):
                        </p>
                        <p className="font-mono text-xs text-slate-200">{disc.file1Value}</p>
                      </div>

                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                        <p className="text-[11px] font-bold text-purple-400 mb-1">
                          ไฟล์ที่ 2 ("{file2.name}"):
                        </p>
                        <p className="font-mono text-xs text-slate-200">{disc.file2Value}</p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="text-xs text-slate-300 space-y-1">
                      <span className="font-semibold text-slate-400 block text-[11px]">
                        คำอธิบายประเด็นข้อขัดแย้ง:
                      </span>
                      <p className="leading-relaxed">{disc.explanation}</p>
                    </div>

                    {/* Suggested Solution */}
                    <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-xs text-emerald-200 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[11px] text-emerald-300 block">
                          แนวทางแก้ไขที่แนะนำ:
                        </span>
                        <p className="mt-0.5 leading-relaxed">{disc.solution}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Files Overview */}
      {activeTab === 'files' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File 1 Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                #1
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{result.file1Overview?.title || file1.name}</h3>
                <span className="text-[11px] text-slate-400">{file1.name}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.file1Overview?.summary}
            </p>

            {/* Key Findings */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-2">ข้อค้นพบหลัก (Key Findings):</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.file1Overview?.keyFindings?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-indigo-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths & Concerns */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> จุดเด่น / ข้อดี:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.file1Overview?.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-rose-400 mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> จุดที่ต้องระวัง / ข้อบกพร่อง:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.file1Overview?.concerns?.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400">-</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* File 2 Overview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              <span className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
                #2
              </span>
              <div>
                <h3 className="font-bold text-sm text-slate-100">{result.file2Overview?.title || file2.name}</h3>
                <span className="text-[11px] text-slate-400">{file2.name}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {result.file2Overview?.summary}
            </p>

            {/* Key Findings */}
            <div>
              <h4 className="text-xs font-bold text-slate-200 mb-2">ข้อค้นพบหลัก (Key Findings):</h4>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.file2Overview?.keyFindings?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-purple-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Strengths & Concerns */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div>
                <h4 className="text-xs font-bold text-emerald-400 mb-1.5 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> จุดเด่น / ข้อดี:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.file2Overview?.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400">+</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-rose-400 mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> จุดที่ต้องระวัง / ข้อบกพร่อง:
                </h4>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.file2Overview?.concerns?.map((c, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400">-</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Full Markdown Report */}
      {activeTab === 'markdown' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>รายงานฉบับสมบูรณ์ในรูปแบบ Markdown (Audit Report)</span>
            </h3>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">คัดลอกแล้ว</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>คัดลอก Markdown ทั้งหมด</span>
                </>
              )}
            </button>
          </div>

          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 max-h-[600px] overflow-y-auto prose prose-invert prose-indigo prose-sm max-w-none text-slate-300">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdownToHtml(result.markdownReport),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
