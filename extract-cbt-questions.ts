import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const CBT_DIR = '/home/z/my-project/students/cbt';

interface Question {
  id: number;
  year: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hasImage?: boolean;
  imageDescription?: string;
}

let zai: Awaited<ReturnType<typeof ZAI.create>>;

async function initZAI() {
  zai = await ZAI.create();
  console.log('ZAI initialized');
}

async function analyzePage(imagePath: string, subject: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Extract ALL exam questions from this ${subject} page. Preserve exact wording including math symbols.

Return ONLY JSON array:
[{"year":"2023","question":"exact text","options":["A","B","C","D"],"correctAnswer":0,"hasImage":false}]

No markdown, no explanation. Empty array [] if no questions.`;

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
    return response.choices[0]?.message?.content || '[]';
  } catch (e) {
    console.error('VLM error:', e);
    return '[]';
  }
}

function parseQuestions(jsonStr: string): Question[] {
  try {
    let cleanJson = jsonStr.trim();
    if (cleanJson.includes('```')) {
      cleanJson = cleanJson.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
    }
    const startIdx = cleanJson.indexOf('[');
    const endIdx = cleanJson.lastIndexOf(']');
    if (startIdx !== -1 && endIdx !== -1) {
      cleanJson = cleanJson.slice(startIdx, endIdx + 1);
    }
    const parsed = JSON.parse(cleanJson);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((q, i) => ({
      id: i,
      year: String(q.year || 'Unknown'),
      question: String(q.question || ''),
      options: Array.isArray(q.options) ? q.options.map((o: any) => String(o || '')) : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : -1,
      hasImage: Boolean(q.hasImage),
      imageDescription: q.imageDescription ? String(q.imageDescription) : undefined
    })).filter(q => q.question && q.options.length >= 2);
  } catch (e) {
    return [];
  }
}

function escapeJS(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t');
}

function generateJSFile(questions: Question[], subject: string): string {
  const cap = subject.charAt(0).toUpperCase() + subject.slice(1);
  let js = `// ${cap} Questions - Extracted: ${new Date().toISOString()}
// Total: ${questions.length} questions

export const ${subject}Questions = [
`;
  for (const q of questions) {
    js += `  {
    id: ${q.id},
    year: "${escapeJS(q.year)}",
    question: "${escapeJS(q.question)}",
    options: [${q.options.map(o => `"${escapeJS(o)}"`).join(', ')}],
    correctAnswer: ${q.correctAnswer}${q.hasImage ? `,
    hasImage: true` : ''}
  },
`;
  }
  js += `];

export default ${subject}Questions;
`;
  return js;
}

async function processSubject(subject: string): Promise<Question[]> {
  const pagesDir = path.join(CBT_DIR, 'pdf_pages', subject);
  const allQuestions: Question[] = [];
  let questionId = 1;
  
  if (!fs.existsSync(pagesDir)) {
    console.log(`No pages for ${subject}`);
    return [];
  }
  
  const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const nA = parseInt(a.match(/\d+/)?.[0] || '0');
      const nB = parseInt(b.match(/\d+/)?.[0] || '0');
      return nA - nB;
    });
  
  console.log(`\n${'='.repeat(50)}`);
  console.log(`${subject.toUpperCase()}: ${pages.length} pages`);
  console.log('='.repeat(50));
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pagePath = path.join(pagesDir, page);
    
    process.stdout.write(`  [${i + 1}/${pages.length}] ${page}... `);
    
    try {
      const result = await analyzePage(pagePath, subject);
      const questions = parseQuestions(result);
      
      for (const q of questions) {
        q.id = questionId++;
        allQuestions.push(q);
      }
      
      console.log(`${questions.length} questions (Total: ${allQuestions.length})`);
      await new Promise(r => setTimeout(r, 200));
    } catch (e) {
      console.error('ERROR:', e);
    }
  }
  
  // Generate JS file
  const jsContent = generateJSFile(allQuestions, subject);
  fs.writeFileSync(path.join(CBT_DIR, 'js', `${subject}-questions.js`), jsContent);
  
  // Save JSON backup
  fs.writeFileSync(path.join(CBT_DIR, 'pdfs', `${subject}-extracted.json`), JSON.stringify(allQuestions, null, 2));
  
  console.log(`\n✓ ${subject}: ${allQuestions.length} questions`);
  return allQuestions;
}

async function main() {
  await initZAI();
  const subjects = ['physics', 'maths', 'english', 'economics'];
  const results: Record<string, number> = {};
  
  for (const subject of subjects) {
    const questions = await processSubject(subject);
    results[subject] = questions.length;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('COMPLETE');
  console.log('='.repeat(50));
  for (const [s, c] of Object.entries(results)) {
    console.log(`  ${s}: ${c}`);
  }
}

main().catch(console.error);
