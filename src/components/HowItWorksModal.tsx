import React from 'react';
import { X, FileCode, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Layers } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                หลักการทำงานของระบบตรวจสอบด้วย Skill .md
              </h3>
              <p className="text-xs text-slate-400">
                สถาปัตยกรรม Autonomous Audit Agent บน Google Gemini 3.8 Flash
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Concept Explanation */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              Skill .md คืออะไร?
            </h4>
            <p>
              ในระบบ AI ยุคใหม่ <strong>Skill .md</strong> คือเอกสารมาตรฐานที่เขียนด้วย Markdown สำหรับนิยาม "ขอบเขต ทักษะ กฎเกณฑ์ และ Rubric การตรวจ" ให้กับโมเดล AI
            </p>
            <p>
              แทนที่จะเขียน prompt ยาว ๆ แบบกระจัดกระจาย Skill .md จะแบ่งออกเป็นหมวดหมู่ชัดเจน เช่น:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-400 font-mono text-[11px]">
              <li><strong>Frontmatter (YAML)</strong>: ชื่อสกิล, คำอธิบาย, เวอร์ชั่น</li>
              <li><strong>Audit Objective</strong>: เป้าหมายหลักของการตรวจสอบ</li>
              <li><strong>Criteria & Checkpoints</strong>: กฎเกณฑ์ ข้อกำหนด และน้ำหนักคะแนนแต่ละข้อ</li>
              <li><strong>Pass/Fail Matrix</strong>: เกณฑ์ชี้ขาดว่าเมื่อไหร่ถึงถือว่าผ่าน หรือต้องส่งกลับไปแก้ไข</li>
            </ul>
          </div>

          {/* Workflow Diagram */}
          <div>
            <h4 className="font-bold text-sm text-slate-100 mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              ขั้นตอนการประมวลผล 3 ขั้นตอน:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-indigo-400 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20">
                  ขั้นตอนที่ 1
                </span>
                <h5 className="font-bold text-slate-200 text-xs">แนบไฟล์ 2 ไฟล์</h5>
                <p className="text-[11px] text-slate-400">
                  อัปโหลดหรือวางข้อความของไฟล์คู่ที่ต้องการเปรียบเทียบ เช่น สัญญาหลัก vs ข้อเสนอ, โค้ด vs สเปก, หรือ PO vs Invoice
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  ขั้นตอนที่ 2
                </span>
                <h5 className="font-bold text-slate-200 text-xs">ระบุกฎใน Skill .md</h5>
                <p className="text-[11px] text-slate-400">
                  เลือกเทมเพลตสำเร็จรูป แก้ไขเพิ่มเกณฑ์เฉพาะตัว หรืออัปโหลดไฟล์ .md ของคุณเอง
                </p>
              </div>

              <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  ขั้นตอนที่ 3
                </span>
                <h5 className="font-bold text-slate-200 text-xs">AI ตรวจสอบเชิงลึก</h5>
                <p className="text-[11px] text-slate-400">
                  Gemini 3.8 Flash ทำการ Cross-Verify พร้อมอ้างอิงหลักฐานแบบ Quote บรรทัดต่อบรรทัด คำนวณคะแนน และออกผลสรุป
                </p>
              </div>
            </div>
          </div>

          {/* Quick tips */}
          <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-xl p-4 text-indigo-200">
            <h5 className="font-bold text-indigo-300 text-xs mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              เคล็ดลับการทดสอบอย่างรวดเร็ว:
            </h5>
            <p className="text-[11px] text-slate-300">
              คลิกปุ่ม <strong>"โหลดคู่ไฟล์ตัวอย่าง 1 & 2 เพื่อทดลองตรวจทันที"</strong> ด้านบนกล่อง Skill .md เพื่อจำลองสถานการณ์จริง เช่น ตรวจสอบสัญญาที่มีข้อขัดแย้งด้านลิขสิทธิ์และเงินมัดจำ เพื่อดูว่าระบบตรวจจับได้แม่นยำแค่ไหน!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition cursor-pointer"
          >
            เข้าใจแล้ว เริ่มใช้งาน
          </button>
        </div>
      </div>
    </div>
  );
};
