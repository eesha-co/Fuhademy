import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';

// Corrected page mapping for Physics PDF
// Based on: 2010-2014 have 50 questions each (~10 pages), 2015-2018 have 40 questions each (~8 pages)
const YEAR_PAGE_MAP: { [year: string]: { start: number; end: number; count: number } } = {
  '2010': { start: 2, end: 11, count: 50 },
  '2011': { start: 12, end: 21, count: 50 },
  '2012': { start: 22, end: 31, count: 50 },
  '2013': { start: 32, end: 41, count: 50 },
  '2014': { start: 42, end: 51, count: 50 },
  '2015': { start: 52, end: 59, count: 40 },
  '2016': { start: 60, end: 67, count: 40 },
  '2017': { start: 68, end: 75, count: 40 },
  '2018': { start: 76, end: 83, count: 40 },
};

interface QuestionBoundary {
  questionNumber: number;
  topY: number;
  bottomY: number;
  hasDiagram: boolean;
}

async function analyzePageWithVLM(zai: any, imagePath: string, pageNumber: number): Promise<QuestionBoundary[]> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Analyze this JAMB Physics exam page. Find ALL question numbers and their vertical positions.

For each question:
- questionNumber: The number (1, 2, 3, etc.)
- topY: Where question starts (0-100% from top)
- bottomY: Where question ends BEFORE options A, B, C, D (0-100% from top)
- hasDiagram: true if there's a diagram/figure

Return ONLY a JSON array:
[{"questionNumber": 1, "topY": 5, "bottomY": 20, "hasDiagram": false}, ...]

If no questions found, return: []`;

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

    const content = response.choices[0]?.message?.content || '[]';
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch (error) {
    console.error('VLM error:', error);
    return [];
  }
}

async function extractQuestion(imagePath: string, q: QuestionBoundary, outputPath: string): Promise<boolean> {
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

function getYearForPage(pageNum: number): string | null {
  for (const [year, info] of Object.entries(YEAR_PAGE_MAP)) {
    if (pageNum >= info.start && pageNum <= info.end) {
      return year;
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const targetYear = args[0] || null;
  
  console.log(`Extracting questions${targetYear ? ` for year ${targetYear}` : ''}...\n`);
  
  const zai = await ZAI.create();
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  let extracted = 0;
  
  for (const [year, info] of Object.entries(YEAR_PAGE_MAP)) {
    if (targetYear && year !== targetYear) continue;
    
    console.log(`\n=== ${year} (pages ${info.start}-${info.end}, ${info.count} questions) ===`);
    
    // Check what questions are already extracted
    const existingFiles = fs.readdirSync(OUTPUT_DIR).filter(f => f.startsWith(`${year}_q`));
    const existingQuestions = existingFiles.map(f => parseInt(f.match(/q(\d+)/)?.[1] || '0'));
    const missingQuestions = [];
    for (let i = 1; i <= info.count; i++) {
      if (!existingQuestions.includes(i)) missingQuestions.push(i);
    }
    
    console.log(`Already have: ${existingQuestions.length}/${info.count}`);
    console.log(`Missing: ${missingQuestions.join(', ')}`);
    
    if (missingQuestions.length === 0) {
      console.log(`All questions already extracted!`);
      continue;
    }
    
    for (let pageNum = info.start; pageNum <= info.end; pageNum++) {
      const pageFile = path.join(PAGES_DIR, `page-${String(pageNum).padStart(2, '0')}.png`);
      
      if (!fs.existsSync(pageFile)) continue;
      
      const questions = await analyzePageWithVLM(zai, pageFile, pageNum);
      
      if (questions.length === 0) continue;
      
      for (const q of questions) {
        if (!missingQuestions.includes(q.questionNumber)) continue;
        if (q.questionNumber < 1 || q.questionNumber > info.count) continue;
        
        const outFile = path.join(OUTPUT_DIR, `${year}_q${q.questionNumber}.png`);
        const ok = await extractQuestion(pageFile, q, outFile);
        
        if (ok) {
          extracted++;
          console.log(`  ✓ Q${q.questionNumber}${q.hasDiagram ? ' [diagram]' : ''}`);
        }
      }
    }
  }
  
  console.log(`\n=== Done! Extracted ${extracted} new questions ===`);
}

main().catch(console.error);
