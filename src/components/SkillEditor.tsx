import React, { useState } from 'react';
import {
  FileCode2,
  Eye,
  Edit3,
  Upload,
  Download,
  RotateCcw,
  Sparkles,
  BookOpen,
  CheckCircle,
  FileSpreadsheet,
  FileCheck,
  Code,
  Briefcase,
  GraduationCap,
} from 'lucide-react';
import { SkillTemplate } from '../types';
import { SKILL_TEMPLATES } from '../data/skillTemplates';
import { renderMarkdownToHtml } from '../utils/markdownRenderer';

interface SkillEditorProps {
  currentSkillMd: string;
  onChangeSkillMd: (val: string) => void;
  selectedTemplateId: string;
  onSelectTemplate: (template: SkillTemplate) => void;
  onLoadSampleFiles: (template: SkillTemplate) => void;
}

export const SkillEditor: React.FC<SkillEditorProps> = ({
  currentSkillMd,
  onChangeSkillMd,
  selectedTemplateId,
  onSelectTemplate,
  onLoadSampleFiles,
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const selectedTemplate =
    SKILL_TEMPLATES.find((t) => t.id === selectedTemplateId) || SKILL_TEMPLATES[0];

  const handleUploadCustomMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        onChangeSkillMd(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleDownloadMd = () => {
    const blob = new Blob([currentSkillMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.id || 'custom'}_skill.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToTemplate = () => {
    onChangeSkillMd(selectedTemplate.content);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'legal':
        return <FileCheck className="w-4 h-4 text-emerald-400" />;
      case 'tech':
        return <Code className="w-4 h-4 text-cyan-400" />;
      case 'hr':
        return <Briefcase className="w-4 h-4 text-amber-400" />;
      case 'finance':
        return <FileSpreadsheet className="w-4 h-4 text-purple-400" />;
      case 'education':
        return <GraduationCap className="w-4 h-4 text-rose-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm">
      {/* Header & Concept */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <FileCode2 className="w-5 h-5" />
            </span>
            <h2 className="text-base font-bold text-slate-100">
              ข้อกำหนดและเกณฑ์ตรวจสอบ (Skill .md Specification)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            ไฟล์ Skill .md ทำหน้าที่เป็น "คัมภีร์กฎการตรวจ (Rulebook & Rubric)" กำหนดให้ AI ตรวจสอบไฟล์ 1 และ 2 ตามเกณฑ์ที่เขียนไว้
          </p>
        </div>

        {/* Quick Sample Action */}
        {selectedTemplate.sampleFile1 && selectedTemplate.sampleFile2 && (
          <button
            type="button"
            onClick={() => onLoadSampleFiles(selectedTemplate)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>โหลดคู่ไฟล์ตัวอย่าง 1 & 2 เพื่อทดลองตรวจทันที</span>
          </button>
        )}
      </div>

      {/* Preset Templates Selector */}
      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-300 block mb-2">
          เลือกเทมเพลต Skill .md สำเร็จรูป:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {SKILL_TEMPLATES.map((tpl) => {
            const isSelected = tpl.id === selectedTemplateId;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => {
                  onSelectTemplate(tpl);
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1 rounded-md bg-slate-800 mt-0.5 shrink-0">
                    {getCategoryIcon(tpl.category)}
                  </div>
                  <div>
                    <h4
                      className={`text-xs font-bold leading-snug ${
                        isSelected ? 'text-indigo-300' : 'text-slate-200'
                      }`}
                    >
                      {tpl.titleTh}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Markdown Editor Controls & Tabs */}
      <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Edit / Preview Tabs */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>แก้ไข Markdown</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>พรีวิวผลลัพธ์</span>
          </button>
        </div>

        {/* Toolbar Tools */}
        <div className="flex items-center gap-2">
          {/* Upload Custom .md */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.markdown,.txt"
            onChange={handleUploadCustomMd}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="อัปโหลดไฟล์ .md จากเครื่องของคุณ"
          >
            <Upload className="w-3.5 h-3.5 text-indigo-400" />
            <span>อัปโหลด .md</span>
          </button>

          {/* Download Current .md */}
          <button
            type="button"
            onClick={handleDownloadMd}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            title="ดาวน์โหลด Skill .md นี้เก็บไว้"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>บันทึก .md</span>
          </button>

          {/* Reset Template */}
          <button
            type="button"
            onClick={handleResetToTemplate}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 text-xs font-medium transition cursor-pointer"
            title="รีเซ็ตเนื้อหากลับเป็นค่าเริ่มต้นของเทมเพลต"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>รีเซ็ต</span>
          </button>
        </div>
      </div>

      {/* Editor & Preview Area */}
      <div className="mt-3">
        {activeTab === 'edit' ? (
          <div className="relative">
            <textarea
              rows={14}
              value={currentSkillMd}
              onChange={(e) => onChangeSkillMd(e.target.value)}
              className="w-full bg-slate-950 font-mono text-xs text-slate-200 p-4 rounded-xl border border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed resize-y selection:bg-indigo-600/30"
              placeholder="# ใส่ข้อกำหนด Skill .md ที่นี่..."
            />
            <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono pointer-events-none bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
              {currentSkillMd.split('\n').length} lines • {currentSkillMd.length} chars
            </div>
          </div>
        ) : (
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 min-h-[300px] max-h-[480px] overflow-y-auto prose prose-invert prose-indigo prose-sm max-w-none text-slate-300">
            <div
              dangerouslySetInnerHTML={{
                __html: renderMarkdownToHtml(currentSkillMd),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
