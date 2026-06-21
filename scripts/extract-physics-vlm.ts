import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';
const PROGRESS_FILE = '/home/z/my-project/students/cbt/images/physics_questions/extraction_progress.json';

// Page mapping for Physics PDF
const YEAR_PAGE_MAP: { [year: string]: { start: number; end: number; count: number } } = {
  '2010': { start: 2, end: 11, count: 50 },
  '2011': { start: 12, end: 21, count: 50 },
  '2012': { start: 22, end: 31, count: 50 },
  '2013': { start: 32, end: 41, count: 50 },
  '2014': { start: 42, end: 51, count: 50 },
  '2015': { start: 52, end: 57, count: 40 },
  '2016': { start: 58, end: 63, count: 40 },
  '2017': { start: 64, end: 69, count: 40 },
  '2018': { start: 70, end: 75, count: 40 },
};

interface QuestionBoundary {
  questionNumber: number;
  topY: number;
  bottomY: number;
  hasDiagram: boolean;
}

interface Progress {
  completedPages: number[];
  extractedQuestions: { [year: string]: number[] };
}

function loadProgress(): Progress {
  if (fs.existsSync(PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  }
  return { completedPages: [], extractedQuestions: {} };
}

function saveProgress(progress: Progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

async function analyzePageWithVLM(zai: any, imagePath: string, pageNumber: number): Promise<QuestionBoundary[]> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Analyze this JAMB Physics exam page. Find ALL question numbers and their vertical positions.

For each question, provide:
- questionNumber: The number (1, 2, 3, etc.)
- topY: Where question starts (0-100% from top)
- bottomY: Where question ends BEFORE options A, B, C, D (0-100% from top)
- hasDiagram: true if there's a diagram/figure

IMPORTANT: Include question text + diagrams only, NOT the options.

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
    const questions: QuestionBoundary[] = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    
    return questions;
  } catch (error) {
    console.error(`VLM error:`, error);
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
    console.error(`Extract error:`, e);
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
  const startPage = args[0] ? parseInt(args[0]) : 2;
  const endPage = args[1] ? parseInt(args[1]) : startPage;
  
  console.log(`Processing pages ${startPage} to ${endPage}...\n`);
  
  const zai = await ZAI.create();
  const progress = loadProgress();
  
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  for (let pageNum = startPage; pageNum <= endPage; pageNum++) {
    const pageFile = path.join(PAGES_DIR, `page-${String(pageNum).padStart(2, '0')}.png`);
    
    if (!fs.existsSync(pageFile)) {
      console.log(`Page ${pageNum} not found`);
      continue;
    }
    
    const year = getYearForPage(pageNum);
    if (!year) {
      console.log(`Page ${pageNum} - not a question page`);
      continue;
    }
    
    console.log(`\nPage ${pageNum} (${year})...`);
    
    const questions = await analyzePageWithVLM(zai, pageFile, pageNum);
    
    if (questions.length === 0) {
      console.log(`  No questions found`);
      continue;
    }
    
    console.log(`  Found: ${questions.map(q => q.questionNumber).join(', ')}`);
    
    for (const q of questions) {
      if (q.questionNumber < 1 || q.questionNumber > YEAR_PAGE_MAP[year].count) continue;
      
      const outFile = path.join(OUTPUT_DIR, `${year}_q${q.questionNumber}.png`);
      const ok = await extractQuestion(pageFile, q, outFile);
      
      if (ok) {
        console.log(`  ✓ Q${q.questionNumber}${q.hasDiagram ? ' [diagram]' : ''}`);
        if (!progress.extractedQuestions[year]) progress.extractedQuestions[year] = [];
        if (!progress.extractedQuestions[year].includes(q.questionNumber)) {
          progress.extractedQuestions[year].push(q.questionNumber);
        }
      }
    }
    
    progress.completedPages.push(pageNum);
    saveProgress(progress);
  }
  
  console.log('\nDone!');
}

main().catch(console.error);
