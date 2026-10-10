export interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  content: string; // text content or preview
  isBinary?: boolean;
  base64Data?: string; // for images / PDFs
  mimeType?: string;
  lastModified?: number;
}

export interface SkillCriterion {
  criteriaName: string;
  description: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  score: number;
  evidenceFile1?: string;
  evidenceFile2?: string;
  reasoning: string;
  recommendation?: string;
}

export interface DiscrepancyItem {
  item: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  file1Value: string;
  file2Value: string;
  explanation: string;
  solution: string;
}

export interface FileOverview {
  title: string;
  summary: string;
  keyFindings: string[];
  strengths: string[];
  concerns: string[];
}

export interface InspectionResult {
  overallVerdict: 'PASS' | 'CONDITIONAL_PASS' | 'NEEDS_REVISION' | 'FAIL';
  score: number;
  verdictReason: string;
  summaryTh: string;
  summaryEn: string;
  file1Overview: FileOverview;
  file2Overview: FileOverview;
  skillCriteriaEvaluations: SkillCriterion[];
  discrepancies: DiscrepancyItem[];
  actionableRecommendations: string[];
  markdownReport: string;
}

export interface SkillTemplate {
  id: string;
  title: string;
  titleTh: string;
  description: string;
  category: 'legal' | 'tech' | 'hr' | 'finance' | 'education' | 'general';
  file1Label: string;
  file2Label: string;
  content: string; // the markdown string
  sampleFile1?: {
    name: string;
    type: string;
    content: string;
  };
  sampleFile2?: {
    name: string;
    type: string;
    content: string;
  };
}
