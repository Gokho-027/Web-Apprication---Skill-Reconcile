import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Body parsing with 50mb limit for file uploads (PDFs, images, docs, text)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// File inspection endpoint
app.post('/api/inspect', async (req, res) => {
  try {
    const { file1, file2, skillMd, options } = req.body;

    if (!file1 || !file2) {
      return res.status(400).json({
        error: 'กรุณาแนบไฟล์ทั้ง 2 ไฟล์ให้ครบถ้วน (Both File 1 and File 2 are required)',
      });
    }

    if (!skillMd || typeof skillMd !== 'string' || !skillMd.trim()) {
      return res.status(400).json({
        error: 'กรุณาระบุกฎและเกณฑ์ประเมินใน Skill .md (Skill .md content is required)',
      });
    }

    const language = options?.language === 'en' ? 'English' : 'Thai';
    const strictness = options?.strictness || 'normal';

    // Build model prompt and parts
    const parts: any[] = [];

    // Introduction instruction
    const promptIntro = `
You are an advanced Autonomous Audit & Verification AI Agent.
Your mission is to perform a rigorous, objective inspection and cross-verification of TWO provided files strictly evaluated against the provided "SKILL .md" specification.

=== SKILL .md SPECIFICATION (RULES & RUBRICS) ===
${skillMd}
=== END OF SKILL .md ===

AUDIT PARAMETERS:
- Primary Output Language: ${language} (Provide clear, highly professional analysis in ${language})
- Verification Strictness: ${strictness}
- File 1 Name: "${file1.name || 'File_1'}" (Type: ${file1.type || 'unknown'}, Size: ${file1.size || 0} bytes)
- File 2 Name: "${file2.name || 'File_2'}" (Type: ${file2.type || 'unknown'}, Size: ${file2.size || 0} bytes)

YOUR MANDATORY TASKS:
1. Read the Skill .md specification thoroughly and extract every evaluation rule, criteria, checklist item, and pass/fail condition.
2. Examine File 1 and File 2. Understand their contents, structure, intent, and relationships.
3. Cross-verify both files against each other (e.g. consistency, discrepancies, conflicts, missing elements).
4. Evaluate compliance of both files against the Skill .md criteria.
5. Provide a deterministic verdict: "PASS", "CONDITIONAL_PASS", "NEEDS_REVISION", or "FAIL".
6. Calculate an accurate compliance score from 0 to 100 based on how well the files satisfy the Skill .md requirements.
7. List specific criteria with direct evidence quotes from the files, exact discrepancy items with severity levels, and clear actionable recommendations.
8. Output a complete, beautifully structured JSON conforming strictly to the requested schema.
`;

    parts.push({ text: promptIntro });

    // Helper to add file content (handles text, base64 images/PDFs)
    const attachFilePart = (file: any, label: string) => {
      if (file.isBinary && file.base64Data && file.mimeType) {
        // inline data part for images or application/pdf
        parts.push({
          inlineData: {
            mimeType: file.mimeType,
            data: file.base64Data,
          },
        });
        parts.push({
          text: `[The above attached data is ${label}: "${file.name}"]`,
        });
      } else {
        // Text / Code / Markdown / CSV / JSON
        parts.push({
          text: `
=== ${label}: "${file.name}" ===
${file.content || '(Empty content)'}
=== END OF ${label} ===
`,
        });
      }
    };

    attachFilePart(file1, 'FILE 1');
    attachFilePart(file2, 'FILE 2');

    // Call Gemini 3.8 Flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        systemInstruction: `You are a certified senior auditor, code reviewer, and compliance inspector. You follow the provided Skill .md guidelines with extreme diligence, cite direct evidence from the attached files, and return structured JSON.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallVerdict: {
              type: Type.STRING,
              description: 'One of: PASS, CONDITIONAL_PASS, NEEDS_REVISION, FAIL',
            },
            score: {
              type: Type.INTEGER,
              description: 'Overall score from 0 to 100',
            },
            verdictReason: {
              type: Type.STRING,
              description: 'Short 1-2 sentence decisive summary reason for the verdict',
            },
            summaryTh: {
              type: Type.STRING,
              description: 'Comprehensive executive summary in Thai (2-3 paragraphs with markdown bullets)',
            },
            summaryEn: {
              type: Type.STRING,
              description: 'Comprehensive executive summary in English (2-3 paragraphs with markdown bullets)',
            },
            file1Overview: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyFindings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                concerns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'summary', 'keyFindings', 'strengths', 'concerns'],
            },
            file2Overview: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                summary: { type: Type.STRING },
                keyFindings: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                concerns: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ['title', 'summary', 'keyFindings', 'strengths', 'concerns'],
            },
            skillCriteriaEvaluations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  criteriaName: { type: Type.STRING },
                  description: { type: Type.STRING },
                  status: {
                    type: Type.STRING,
                    description: 'One of: PASSED, WARNING, FAILED',
                  },
                  score: {
                    type: Type.INTEGER,
                    description: 'Score for this specific criteria (0-100)',
                  },
                  evidenceFile1: {
                    type: Type.STRING,
                    description: 'Direct quote or observation from File 1',
                  },
                  evidenceFile2: {
                    type: Type.STRING,
                    description: 'Direct quote or observation from File 2',
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: 'Detailed analysis explaining why this status was given',
                  },
                  recommendation: {
                    type: Type.STRING,
                    description: 'How to fix or improve this criterion',
                  },
                },
                required: ['criteriaName', 'description', 'status', 'score', 'reasoning'],
              },
            },
            discrepancies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  severity: {
                    type: Type.STRING,
                    description: 'One of: HIGH, MEDIUM, LOW, INFO',
                  },
                  file1Value: { type: Type.STRING },
                  file2Value: { type: Type.STRING },
                  explanation: { type: Type.STRING },
                  solution: { type: Type.STRING },
                },
                required: ['item', 'severity', 'file1Value', 'file2Value', 'explanation', 'solution'],
              },
            },
            actionableRecommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            markdownReport: {
              type: Type.STRING,
              description: 'Full audit report formatted in rich Markdown with headings, tables, and quotes for export',
            },
          },
          required: [
            'overallVerdict',
            'score',
            'verdictReason',
            'summaryTh',
            'summaryEn',
            'file1Overview',
            'file2Overview',
            'skillCriteriaEvaluations',
            'discrepancies',
            'actionableRecommendations',
            'markdownReport',
          ],
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error('Gemini did not return any text response');
    }

    const parsed = JSON.parse(textOutput);
    res.json({
      success: true,
      data: parsed,
      meta: {
        timestamp: new Date().toISOString(),
        file1Name: file1.name,
        file2Name: file2.name,
      },
    });
  } catch (error: any) {
    console.error('Inspection error:', error);
    res.status(500).json({
      error: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบไฟล์ด้วย AI',
    });
  }
});

// Start server with Vite dev middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Skill Verifier server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
