import { $ } from 'bun';
import fs from 'fs';
import path from 'path';

const CBT_DIR = '/home/z/my-project/students/cbt';
const OUTPUT_DIR = path.join(CBT_DIR, 'extracted');

const PROMPT = `Extract ALL exam questions from this page. Return ONLY JSON array (no markdown, no explanation):
[{"year":"2023","question":"exact text with symbols","options":["A. option","B. option","C. option","D. option"],"correctAnswer":0,"hasImage":false}]

If no questions, return []`;

interface Question {
  year: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hasImage: boolean;
}

async function extractFromPage(imagePath: string): Promise<Question[]> {
  try {
    const result = await $`z-ai vision -p ${PROMPT} -i ${imagePath}`.quiet();
    const output = result.stdout.toString();
    
    // Parse the response
    const match = output.match(/"content":\s*"([^"]+)"/);
    if (!match) return [];
    
    // Decode the content
    let content = match[1];
    // Handle unicode escapes
    content = content.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
    content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"');
    
    // Parse JSON
    const questions = JSON.parse(content);
    return Array.isArray(questions) ? questions : [];
  } catch (e) {
    console.error('Error:', e);
    return [];
  }
}

async function processSubject(subject: string) {
  const pagesDir = path.join(CBT_DIR, 'pdf_pages', subject);
  const outputFile = path.join(OUTPUT_DIR, `${subject}_questions.json`);
  const progressFile = path.join(OUTPUT_DIR, `${subject}_progress.txt`);
  
  console.log('\n' + '='.repeat(60));
  console.log(`Processing: ${subject.toUpperCase()}`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(pagesDir)) {
    console.log(`No pages for ${subject}`);
    return 0;
  }
  
  // Get sorted pages
  const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const nA = parseInt(a.match(/\d+/)?.[0] || '0');
      const nB = parseInt(b.match(/\d+/)?.[0] || '0');
      return nA - nB;
    });
  
  console.log(`Total pages: ${pages.length}`);
  
  // Check progress
  let startIdx = 0;
  if (fs.existsSync(progressFile)) {
    startIdx = parseInt(fs.readFileSync(progressFile, 'utf-8')) || 0;
    console.log(`Resuming from page ${startIdx + 1}`);
  }
  
  // Load existing questions
  let allQuestions: Question[] = [];
  if (startIdx > 0 && fs.existsSync(outputFile)) {
    try {
      allQuestions = JSON.parse(fs.readFileSync(outputFile, 'utf-8'));
    } catch (e) {
      allQuestions = [];
    }
  }
  
  let id = allQuestions.length;
  
  for (let i = startIdx; i < pages.length; i++) {
    const page = pages[i];
    const pagePath = path.join(pagesDir, page);
    
    process.stdout.write(`  [${i + 1}/${pages.length}] ${page}... `);
    
    const questions = await extractFromPage(pagePath);
    
    if (questions.length > 0) {
      for (const q of questions) {
        (q as any).id = ++id;
        allQuestions.push(q);
      }
      console.log(`Found ${questions.length} (Total: ${allQuestions.length})`);
    } else {
      console.log('No questions');
    }
    
    // Save progress
    fs.writeFileSync(outputFile, JSON.stringify(allQuestions, null, 2));
    fs.writeFileSync(progressFile, String(i + 1));
    
    // Delay
    await new Promise(r => setTimeout(r, 200));
  }
  
  // Clean up
  fs.unlinkSync(progressFile);
  
  console.log(`\n✓ ${subject}: ${allQuestions.length} questions`);
  return allQuestions.length;
}

function generateJSFile(questions: Question[], subject: string): string {
  const cap = subject.charAt(0).toUpperCase() + subject.slice(1);
  
  const escape = (str: string) => str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '');
  
  let js = `// ${cap} Questions - Extracted from PDF
// Total: ${questions.length} questions
// Generated: ${new Date().toISOString()}

export const ${subject}Questions = [
`;
  
  for (const q of questions) {
    js += `  {
    id: ${(q as any).id},
    year: "${escape(q.year)}",
    question: "${escape(q.question)}",
    options: [${q.options.map(o => `"${escape(o)}"`).join(', ')}],
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

async function main() {
  console.log('CBT Question Extraction');
  console.log('========================');
  
  // Ensure output dir
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const subjects = ['physics', 'maths', 'english', 'economics'];
  const results: Record<string, number> = {};
  
  for (const subject of subjects) {
    const count = await processSubject(subject);
    results[subject] = count;
    
    // Generate JS file
    const jsonFile = path.join(OUTPUT_DIR, `${subject}_questions.json`);
    if (fs.existsSync(jsonFile)) {
      const questions = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
      const js = generateJSFile(questions, subject);
      fs.writeFileSync(path.join(CBT_DIR, 'js', `${subject}-questions.js`), js);
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('EXTRACTION COMPLETE');
  console.log('='.repeat(60));
  
  let total = 0;
  for (const [subject, count] of Object.entries(results)) {
    console.log(`  ${subject}: ${count} questions`);
    total += count;
  }
  console.log(`  TOTAL: ${total} questions`);
}

main().catch(console.error);
