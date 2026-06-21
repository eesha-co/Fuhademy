import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';

interface QuestionInfo {
  questionNumber: number;
  topY: number;
  bottomY: number;
  hasDiagram: boolean;
}

interface PageAnalysis {
  year: string;
  questions: QuestionInfo[];
}

async function analyzePage(zai: any, imagePath: string): Promise<PageAnalysis> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Analyze this JAMB Physics exam page.

TASK:
1. Identify the YEAR of the exam (look for "2010 JAMB", "2011 JAMB", etc.)
2. Find ALL question numbers and their vertical positions

For each question:
- questionNumber: The number (1, 2, 3, etc.)
- topY: Where question starts (0-100% from top)
- bottomY: Where question ends BEFORE options (0-100% from top)  
- hasDiagram: true if there's a diagram/figure

Return ONLY valid JSON:
{
  "year": "2010",
  "questions": [
    {"questionNumber": 1, "topY": 5, "bottomY": 20, "hasDiagram": false},
    ...
  ]
}

If this is NOT a question page (cover page, answer key, etc.), return:
{"year": "", "questions": []}`;

  try {
    const response = await zai.chat.completions.createVision({
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
        ]
      }],
      thinking: { type: 'disabled' }
    });

    const content = response.choices[0]?.message?.content || '{"year":"","questions":[]}';
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { year: '', questions: [] };
  } catch (error) {
    console.error('VLM error:', error);
    return { year: '', questions: [] };
  }
}

async function extractQuestion(imagePath: string, q: QuestionInfo, outputPath: string): Promise<boolean> {
  try {
    const image = sharp(imagePath);
    const meta = await image.metadata();
    
    if (!meta.height || !meta.width) return false;
    
    const top = Math.max(0, Math.floor((q.topY / 100) * meta.height) - 3);
    const bottom = Math.min(meta.height, Math.floor((q.bottomY / 100) * meta.height) + 3);
    const height = bottom - top;
    
    if (height <= 10) return false;
    
    await image.extract({ left: 0, top, width: meta.width, height }).toFile(outputPath);
    return true;
  } catch (e) {
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const startPage = args[0] ? parseInt(args[0]) : 1;
  const endPage = args[1] ? parseInt(args[1]) : startPage;
  const targetYear = args[2] || null; // Optional: only extract for specific year
  
  console.log(`Processing pages ${startPage}-${endPage}${targetYear ? ` for year ${targetYear}` : ''}...\n`);
  
  const zai = await ZAI.create();
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const extracted: { [year: string]: number[] } = {};
  
  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const pageFile = path.join(PAGES_DIR, `page-${String(pageNum).padStart(2, '0')}.png`);
    
    if (!fs.existsSync(pageFile)) continue;
    
    console.log(`Page ${pageNum}...`);
    
    const analysis = await analyzePage(zai, pageFile);
    
    if (!analysis.year || analysis.year === '') {
      console.log(`  Not a question page`);
      continue;
    }
    
    if (targetYear && analysis.year !== targetYear) {
      console.log(`  Year ${analysis.year} (skipping, target: ${targetYear})`);
      continue;
    }
    
    if (analysis.questions.length === 0) {
      console.log(`  Year ${analysis.year} - no questions found`);
      continue;
    }
    
    console.log(`  Year ${analysis.year}: ${analysis.questions.map(q => q.questionNumber).join(', ')}`);
    
    for (const q of analysis.questions) {
      if (q.questionNumber < 1 || q.questionNumber > 50) continue;
      
      const outFile = path.join(OUTPUT_DIR, `${analysis.year}_q${q.questionNumber}.png`);
      const ok = await extractQuestion(pageFile, q, outFile);
      
      if (ok) {
        if (!extracted[analysis.year]) extracted[analysis.year] = [];
        if (!extracted[analysis.year].includes(q.questionNumber)) {
          extracted[analysis.year].push(q.questionNumber);
        }
        console.log(`    ✓ Q${q.questionNumber}${q.hasDiagram ? ' [diagram]' : ''}`);
      }
    }
  }
  
  console.log('\nExtracted:', JSON.stringify(extracted, null, 2));
}

main().catch(console.error);
