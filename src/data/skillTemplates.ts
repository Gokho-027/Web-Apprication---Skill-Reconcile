import { SkillTemplate } from '../types';

export const SKILL_TEMPLATES: SkillTemplate[] = [
  {
    id: 'contract_compliance',
    title: 'Contract & Vendor Proposal Auditor',
    titleTh: 'ตรวจสอบสัญญาและข้อเสนอราคา (Contract vs Proposal)',
    description: 'ตรวจสอบความสอดคล้องระหว่างสัญญาแม่บท (MSA/NDA) กับใบเสนอราคาหรือส่วนต่อท้ายสัญญา เพื่อหาข้อขัดแย้ง ความเสี่ยง และข้อตกลงที่ตกหล่น',
    category: 'legal',
    file1Label: 'ไฟล์ที่ 1: สัญญาหลัก / ข้อกำหนดมาตรฐาน (Master Agreement / Terms)',
    file2Label: 'ไฟล์ที่ 2: ใบเสนอราคา / ข้อเสนอคู่ค้า (Vendor Proposal / SOW)',
    content: `---
name: "contract-and-proposal-auditor"
description: >
  Audits a vendor proposal or statement of work against the master service agreement or procurement guidelines.
  Detects liability leaks, SLA mismatches, unaligned payment terms, and intellectual property discrepancies.
version: "1.2.0"
---

# Contract & Proposal Audit Skill Specification

## 1. Audit Objective
Verify that the terms specified in File 2 (Vendor Proposal / SOW) strictly adhere to the legal, financial, and operational standards laid out in File 1 (Master Service Agreement / Terms). Identify any unauthorized deviations, hidden costs, or legal exposures.

## 2. Evaluation Criteria & Checkpoints

### 2.1 Scope & Deliverables Alignment (Weight: 20%)
- **Rule**: Every deliverable in File 2 must have clear acceptance criteria consistent with File 1 standards.
- **Pass Condition**: Deliverables match specification without unapproved reduction in deliverables.

### 2.2 Payment & Milestone Terms (Weight: 20%)
- **Rule**: Net payment terms (e.g., Net 30, Net 45) in File 2 must not be shorter than required by File 1.
- **Rule**: Milestone percentages must not demand > 30% upfront deposit unless explicitly allowed.

### 2.3 SLA, Uptime & Performance Guarantees (Weight: 15%)
- **Rule**: Uptime commitments (e.g. 99.9%) and support response time SLAs must meet or exceed File 1 thresholds.

### 2.4 Intellectual Property (IP) Ownership (Weight: 20%)
- **Rule**: All custom work product, documentation, and created code must transfer full ownership to the Client.
- **Fail Condition**: Any clause retaining vendor IP on custom work without explicit carve-outs.

### 2.5 Confidentiality & Non-Disclosure (Weight: 15%)
- **Rule**: Confidential information handling must comply with standard non-disclosure duration (minimum 3 years).

### 2.6 Liability & Indemnification Limits (Weight: 10%)
- **Rule**: Liability caps must not unproportionally cap vendor damages below contract total value.

## 3. Verdict Matrix
- **PASS**: Score >= 85, no HIGH severity legal contradictions.
- **CONDITIONAL_PASS**: Score 70-84, minor commercial adjustments required.
- **NEEDS_REVISION**: Score 50-69, multiple SLA or milestone discrepancies detected.
- **FAIL**: Score < 50 or any severe breach of IP ownership or excessive liability limitation.
`,
    sampleFile1: {
      name: 'Master_Service_Agreement_Standard.txt',
      type: 'text/plain',
      content: `MASTER SERVICE AGREEMENT (STANDARD TERMS)
Company: Apex Enterprises Co., Ltd.
Document Version: 2026-v2

SECTION 1: PAYMENT TERMS
1.1 Standard Payment Terms: Apex Enterprises operates on Net 45 days payment terms following receipt of valid tax invoice.
1.2 Upfront Deposit: Maximum advance payment for vendor engagement is strictly capped at 20% of total contract value. Remaining payments must be tied to milestone deliverables.

SECTION 2: SERVICE LEVEL AGREEMENT (SLA)
2.1 Uptime Guarantee: Cloud platform services must maintain 99.95% monthly uptime.
2.2 Incident Response Time: Critical (Severity 1) issues must be acknowledged within 15 minutes, with resolution or workaround provided within 2 hours.

SECTION 3: INTELLECTUAL PROPERTY RIGHTS
3.1 Work for Hire: All custom deliverables, source code, designs, and proprietary algorithms created under this agreement shall be the exclusive property of Apex Enterprises upon creation.

SECTION 4: CONFIDENTIALITY
4.1 Term of Non-Disclosure: Confidentiality obligations shall survive termination of this agreement for a minimum duration of 3 (three) years.

SECTION 5: LIMITATION OF LIABILITY
5.1 Vendor liability for breach of confidentiality, data security, or gross negligence shall NOT be subject to any financial cap. General liability cap must equal at least 200% of total fees paid.`,
    },
    sampleFile2: {
      name: 'Vendor_TechCorp_Proposal_SOW.txt',
      type: 'text/plain',
      content: `VENDOR PROPOSAL & STATEMENT OF WORK (SOW)
Vendor: TechCorp Global Solutions
Client: Apex Enterprises Co., Ltd.
Project: Enterprise Cloud Integration

PRICING & PAYMENT SCHEDULE:
Total Project Fee: $85,000 USD
- Milestone 1: 35% advance deposit upon contract signing.
- Milestone 2: 40% upon beta deployment.
- Milestone 3: 25% upon final sign-off.
- Payment Terms: Net 15 days from date of electronic invoice.

SERVICE LEVEL AGREEMENT (SLA):
- Target Platform Uptime: 99.5% uptime during standard business hours.
- Severity 1 Critical Incidents: 1-hour response time; resolution within 8 business hours.

INTELLECTUAL PROPERTY:
- TechCorp grants Apex Enterprises a non-exclusive, perpetual license to use the custom software. TechCorp retains core copyright and underlying IP rights for all bespoke components developed.

CONFIDENTIALITY & LIABILITY:
- Confidentiality period: 1 year post-contract completion.
- Total Vendor aggregate liability shall be capped at $10,000 USD or fees received in the preceding 30 days, whichever is lower.`,
    },
  },
  {
    id: 'code_review_spec',
    title: 'Code Implementation vs Specification',
    titleTh: 'ตรวจสอบ Source Code เทียบกับข้อกำหนด Requirement',
    description: 'ตรวจสอบว่าไฟล์โค้ด (Source Code / PR Diff) ปฏิบัติตามฟังก์ชัน กฎความปลอดภัย การจัดการข้อผิดพลาด และ Edge Case ที่ระบุไว้ใน Requirement Specification ครบถ้วนหรือไม่',
    category: 'tech',
    file1Label: 'ไฟล์ที่ 1: ข้อกำหนดฟีเจอร์ / Requirement Spec (Markdown / Text)',
    file2Label: 'ไฟล์ที่ 2: โค้ดที่พัฒนา / Implementation Source Code (TS / JS / Python / Py)',
    content: `---
name: "code-and-spec-compliance-auditor"
description: >
  Audits an implementation source code file against a functional requirement specification.
  Evaluates functional coverage, edge-case resilience, input sanitization, error propagation, and code cleanliness.
version: "2.1.0"
---

# Code vs Specification Verification Skill

## 1. Audit Objective
Perform automated static and logic verification comparing File 2 (Implementation Code) against File 1 (Functional Requirement Spec). Determine if all business rules, input validations, security boundaries, and edge cases are implemented correctly.

## 2. Evaluation Criteria

### 2.1 Functional Requirement Coverage (Weight: 30%)
- **Rule**: Every required method/function/endpoint described in File 1 must be present in File 2.
- **Rule**: The return types and data models must strictly follow the specified payload schema.

### 2.2 Input Validation & Sanitization (Weight: 20%)
- **Rule**: All external inputs must be validated against null, undefined, empty strings, negative numbers, or out-of-range boundaries.
- **Security Check**: Look for potential injection, regex denial of service (ReDoS), or missing bounds checks.

### 2.3 Error Handling & Edge Cases (Weight: 25%)
- **Rule**: Network timeouts, missing records, or unexpected API responses must have graceful try/catch or typed errors.
- **Rule**: Do not swallow exceptions silently (e.g. empty catch blocks).

### 2.4 Code Quality & Maintainability (Weight: 15%)
- **Rule**: Clean modular structure, meaningful variable naming, and appropriate typing (no abuse of 'any').
- **Rule**: Concurrency safeguards if asynchronous operations are executed.

### 2.5 Performance & Resource Management (Weight: 10%)
- **Rule**: Avoid accidental O(n^2) loops where avoidable; prevent unclosed streams or memory leaks.

## 3. Scoring & Thresholds
- **PASS**: Score >= 85, 100% of core spec endpoints implemented with robust validation.
- **CONDITIONAL_PASS**: Score 70-84, minor edge case or validation gap that can be resolved quickly.
- **FAIL**: Score < 60, core functions missing, silent error swallowing, or severe security vulnerability.
`,
    sampleFile1: {
      name: 'Auth_Feature_Specification.md',
      type: 'text/markdown',
      content: `# Feature Specification: Multi-Factor Authentication (MFA) Verification Service

## 1. Overview
This module handles verifying 6-digit one-time passcodes (OTP) for user logins.

## 2. Requirements & Business Rules
1. **Endpoint/Method**: \`verifyOtp(userId: string, code: string, ipAddress: string)\`
2. **Validation**:
   - \`userId\` must be a non-empty UUIDv4 string.
   - \`code\` must be exactly 6 numeric digits (0-9). Reject alphanumeric codes.
3. **Rate Limiting & Anti-Brute-Force**:
   - Max 3 failed attempts per 10-minute window.
   - Lock account temporarily if failed attempts exceed 3.
4. **Expiry**:
   - OTP codes expire after exactly 300 seconds (5 minutes).
5. **Security Requirements**:
   - Use constant-time string comparison (\`crypto.timingSafeEqual\`) to prevent timing attacks.
   - Invalidate the OTP immediately once successfully verified to prevent replay attacks.
6. **Audit Logging**:
   - Log timestamp, userId, masked IP address, and outcome (SUCCESS / FAILED / LOCKED).`,
    },
    sampleFile2: {
      name: 'authService.ts',
      type: 'text/typescript',
      content: `// Implementation: authService.ts
import { db } from './database';

export class AuthService {
  async verifyOtp(userId: any, code: any, ipAddress: string) {
    // Basic check
    if (!userId || !code) {
      return { success: false, message: 'Missing parameters' };
    }

    // Query active token from database
    const tokenRecord = await db.otpTokens.findOne({ userId });
    if (!tokenRecord) {
      return { success: false, message: 'No OTP generated for user' };
    }

    // Standard string equality check
    if (tokenRecord.code === code) {
      console.log('Login success for ' + userId);
      return { success: true };
    } else {
      // Direct failure return without tracking attempts or rate limiting
      return { success: false, message: 'Invalid OTP code' };
    }
  }
}`,
    },
  },
  {
    id: 'resume_job_match',
    title: 'Resume vs Job Description Matcher',
    titleTh: 'ตรวจสอบเรซูเม่เทียบกับประกาศรับสมัครงาน',
    description: 'ประเมินความสอดคล้องระหว่างประวัติผู้สมัคร (Resume/CV) กับคุณสมบัติที่ตำแหน่งงานต้องการ คัดกรองทักษะจำเป็น ประสบการณ์ และแนะนำคำถามสัมภาษณ์',
    category: 'hr',
    file1Label: 'ไฟล์ที่ 1: รายละเอียดตำแหน่งงาน (Job Description & Qualifications)',
    file2Label: 'ไฟล์ที่ 2: ประวัติผู้สมัครงาน (Candidate Resume / CV)',
    content: `---
name: "resume-vs-job-matching-auditor"
description: >
  Evaluates a candidate resume against a detailed Job Description (JD).
  Scores skill alignment, experience level, educational background, tool competency, and flags potential gaps.
version: "1.5.0"
---

# Resume & Job Fit Audit Skill

## 1. Audit Objective
Assess how thoroughly File 2 (Candidate Resume) satisfies the requirements of File 1 (Job Description). Provide objective scoring, skill match percentage, strengths, missing prerequisites, and customized interview probe questions.

## 2. Evaluation Criteria

### 2.1 Must-Have Technical Skills (Weight: 30%)
- **Rule**: Candidate must possess practical, demonstrated experience in core mandatory languages/frameworks.
- **Check**: Are claimed skills supported by actual projects, achievements, and quantified metrics?

### 2.2 Seniority & Years of Experience (Weight: 25%)
- **Rule**: Candidate's overall relevant domain experience must match or exceed the target seniority bracket.

### 2.3 System Architecture & Problem Solving (Weight: 20%)
- **Rule**: Look for evidence of handling scalability, performance optimization, and architectural decisions.

### 2.4 Collaboration & Leadership (Weight: 15%)
- **Rule**: Communication, mentoring juniors, agile participation, cross-functional delivery.

### 2.5 Cultural & Educational Alignment (Weight: 10%)
- **Rule**: Alignment with company values, educational baseline, and continuous learning mindset.

## 3. Verdict Guidelines
- **PASS**: Score >= 80, candidate meets all mandatory criteria, strong hire recommendation.
- **CONDITIONAL_PASS**: Score 65-79, good candidate with 1-2 minor skill gaps that can be learned on the job.
- **NEEDS_REVISION**: Score 50-64, underqualified for seniority or missing critical mandatory stack.
- **FAIL**: Score < 50, clear mismatch with job prerequisites.
`,
    sampleFile1: {
      name: 'Senior_Fullstack_Engineer_JD.md',
      type: 'text/markdown',
      content: `# Job Description: Senior Full-Stack Cloud Engineer
Location: Bangkok / Hybrid
Experience Required: 5+ years

## Mandatory Requirements:
1. 5+ years of production experience in TypeScript, React, and Node.js.
2. Hands-on experience architecting microservices with PostgreSQL and Redis.
3. Proven experience with Google Cloud Platform (GCP) or AWS (Docker, Kubernetes, Cloud Run).
4. Experience leading sprint ceremonies and mentoring 2+ junior developers.
5. Strong understanding of CI/CD pipelines (GitHub Actions) and automated unit testing (Jest/Vitest).

## Nice-to-Have:
- Experience with AI / LLM APIs (e.g. Gemini, OpenAI).
- Certified Cloud Architect (GCP / AWS).`,
    },
    sampleFile2: {
      name: 'Candidate_Resume_Piti.txt',
      type: 'text/plain',
      content: `PITI RATANASIRI
Full-Stack Web Developer | 4 Years Experience
Bangkok, Thailand | github.com/pitidev

SUMMARY:
Passionate developer with 4 years building scalable web applications. Specialist in TypeScript, React, and Node.js ecosystems. Experienced with Docker and automated testing.

TECHNICAL SKILLS:
- Frontend: React 18, Next.js, Tailwind CSS, TypeScript, Zustand.
- Backend: Node.js, Express, NestJS, REST APIs, GraphQL.
- Databases: PostgreSQL, Prisma ORM, MongoDB.
- Cloud & DevOps: Docker, Docker Compose, GitHub Actions, AWS EC2, S3.
- AI Integration: Built internal chatbot using Gemini API and vector embeddings.

EXPERIENCE:
Software Engineer | InnovaTech Ltd. (2023 - Present)
- Architected customer dashboard in React and TypeScript serving 80k monthly active users.
- Migrated legacy Express API to NestJS with PostgreSQL, reducing response time by 32%.
- Created CI/CD automated test workflows reducing deployment bugs by 40%.
- Mentored 1 junior intern developer on code reviews.

Junior Developer | ByteSolutions (2022 - 2023)
- Built responsive UI components in React and CSS.
- Maintained backend endpoints and wrote unit tests with Jest (85% coverage).`,
    },
  },
  {
    id: 'invoice_po_reconciliation',
    title: 'Purchase Order vs Invoice Financial Audit',
    titleTh: 'ตรวจสอบใบสั่งซื้อ (PO) เทียบกับใบแจ้งหนี้ (Invoice)',
    description: 'ตรวจสอบความถูกต้องทางบัญชีและการเงินระหว่าง Purchase Order กับ Vendor Invoice ตรวจสอบรายการสินค้า ราคาต่อหน่วย ภาษี VAT และค่าใช้จ่ายแอบแฝง',
    category: 'finance',
    file1Label: 'ไฟล์ที่ 1: ใบสั่งซื้อ / ข้อตกลงสั่งซื้อ (Purchase Order / PO)',
    file2Label: 'ไฟล์ที่ 2: ใบแจ้งหนี้ / ใบเสร็จรับเงิน (Vendor Invoice)',
    content: `---
name: "po-invoice-reconciliation-auditor"
description: >
  Performs strict 3-way line item audit between a Purchase Order (File 1) and a Vendor Invoice (File 2).
  Detects price creep, quantity variances, unauthorized line items, tax miscalculations, and billing mismatches.
version: "1.1.0"
---

# PO vs Invoice Financial Audit Skill

## 1. Audit Objective
Ensure total financial integrity between authorized Purchase Order (File 1) and billing Invoice (File 2). Prevent duplicate billing, overcharges, unapproved freight/handling fees, and math discrepancies.

## 2. Mandatory Verification Rules

### 2.1 PO Reference & Entity Matching
- **Rule**: The invoice must explicitly quote the exact Purchase Order Number.
- **Rule**: The Billing To and Vendor Name/Tax ID must match registered records exactly.

### 2.2 Line Item Quantity & Description
- **Rule**: Quantities invoiced must not exceed the quantities approved on the PO.
- **Rule**: Descriptions and SKU codes must correspond.

### 2.3 Unit Price Integrity (Zero Tolerance)
- **Rule**: Unit prices on the invoice must match PO agreed rates. Any price increase requires an approved change order.

### 2.4 Extra Fees & Freight Charges
- **Rule**: Invoices must NOT contain unapproved shipping, handling, or administrative fees unless explicitly allowed in the PO.

### 2.5 Tax & Subtotal Math Verification
- **Rule**: Verify mathematical accuracy of subtotal, VAT / sales tax percentage (e.g. 7%), and final grand total.

## 3. Verdict Criteria
- **PASS**: 100% price and quantity match, math verified, zero unauthorized fees.
- **FAIL**: Any unit price inflation, quantity overcharge, or math error exceeding $0.05.
`,
    sampleFile1: {
      name: 'Approved_Purchase_Order_PO-2026-881.txt',
      type: 'text/plain',
      content: `PURCHASE ORDER: PO-2026-881
Date: October 01, 2026
Buyer: Siam Enterprise Logistics PCL (Tax ID: 0105558019283)
Vendor: Prime Hardware & Solutions Co., Ltd. (Tax ID: 0105559048172)
Payment Terms: Net 30 Days

ITEMS APPROVED:
1. ITEM-A101: Enterprise Server Rack 42U
   Qty: 2 Units | Unit Price: 35,000 THB | Amount: 70,000 THB
2. ITEM-B205: Managed Gigabit Switch 48-Port
   Qty: 4 Units | Unit Price: 18,500 THB | Amount: 74,000 THB
3. ITEM-C309: Cat6A Patch Cable (Bundle 24pcs)
   Qty: 10 Bundles | Unit Price: 1,200 THB | Amount: 12,000 THB

Subtotal: 156,000 THB
VAT 7%: 10,920 THB
Shipping & Handling: 0 THB (Free Delivery included in agreement)
TOTAL AMOUNT: 166,920 THB`,
    },
    sampleFile2: {
      name: 'Vendor_Billing_Invoice_INV-9941.txt',
      type: 'text/plain',
      content: `TAX INVOICE / RECEIPT: INV-9941
Date: October 08, 2026
Reference PO: PO-2026-881
Bill To: Siam Enterprise Logistics PCL (Tax ID: 0105558019283)
Vendor: Prime Hardware & Solutions Co., Ltd. (Tax ID: 0105559048172)

BILLED ITEMS:
1. ITEM-A101: Enterprise Server Rack 42U
   Qty: 2 Units | Unit Price: 37,500 THB | Amount: 75,000 THB  (Price adjusted due to steel cost)
2. ITEM-B205: Managed Gigabit Switch 48-Port
   Qty: 4 Units | Unit Price: 18,500 THB | Amount: 74,000 THB
3. ITEM-C309: Cat6A Patch Cable (Bundle 24pcs)
   Qty: 10 Bundles | Unit Price: 1,200 THB | Amount: 12,000 THB
4. EXTRA-FEE: Express Weekend Delivery & Onsite Staging
   Qty: 1 Job | Unit Price: 6,500 THB | Amount: 6,500 THB

Subtotal: 167,500 THB
VAT 7%: 11,725 THB
TOTAL DUE: 179,225 THB
Payment Due: Immediate upon delivery (Net 7 days)`,
    },
  },
  {
    id: 'academic_rubric_grader',
    title: 'Academic Assignment vs Grading Rubric',
    titleTh: 'ตรวจรายงาน/การบ้านเทียบกับเกณฑ์ Rubric',
    description: 'ตรวจการบ้าน รายงานวิจัย หรือบทความทางวิชาการเทียบกับเกณฑ์การให้คะแนน (Rubric Score) ให้คะแนนแต่ละด้าน ชี้ข้อบกพร่อง และให้ข้อเสนอแนะเพื่อการปรับปรุง',
    category: 'education',
    file1Label: 'ไฟล์ที่ 1: เกณฑ์การให้คะแนน / โจทย์การบ้าน (Grading Rubric & Instructions)',
    file2Label: 'ไฟล์ที่ 2: งานที่ส่ง / รายงานของนักศึกษา (Student Submission / Essay)',
    content: `---
name: "academic-grading-rubric-evaluator"
description: >
  Evaluates student academic essays or reports against a standardized rubric.
  Assesses thesis clarity, evidence & citation quality, methodology, critical analysis, and academic writing mechanics.
version: "1.0.0"
---

# Academic Essay Evaluation Rubric Skill

## 1. Audit Objective
Objectively evaluate File 2 (Student Submission) according to the multi-criteria rubric specified in File 1 (Grading Rubric). Provide detailed developmental feedback with cited strengths and weaknesses.

## 2. Evaluation Criteria

### 2.1 Thesis Statement & Logical Structure (Weight: 25%)
- Clear central claim in the introduction.
- Logical transition between paragraphs and arguments.

### 2.2 Depth of Evidence & Academic Literature (Weight: 30%)
- Adequate peer-reviewed or reliable references cited (APA 7th edition).
- Counter-arguments acknowledged and synthesized.

### 2.3 Critical Analysis & Original Thought (Weight: 25%)
- Goes beyond mere descriptive summary into analytic evaluation.

### 2.4 Writing Mechanics, Tone & Formatting (Weight: 20%)
- Formal academic tone, correct grammar, no colloquialisms.
- Word count meets specified boundary (+/- 10%).

## 3. Grade Scale
- **PASS (A / B)**: Score >= 80, exemplary analysis, rigorous evidence.
- **CONDITIONAL_PASS (C)**: Score 65-79, acceptable but lacks depth or minor citation issues.
- **NEEDS_REVISION (D / F)**: Score < 65, missing required sections, inadequate citations, or weak argumentation.
`,
  },
];
