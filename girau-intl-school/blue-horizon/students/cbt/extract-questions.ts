import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const SUBJECTS = ['physics', 'maths', 'english', 'economics'] as const;
type Subject = typeof SUBJECTS[number];

interface Question {
  id: number;
  year: string;
  question: string;
  options: string[];
  correctAnswer: number;
  hasImage?: boolean;
  imageFile?: string;
  explanation?: string;
}

// Initialize ZAI
let zai: Awaited<ReturnType<typeof ZAI.create>>;

async function initZAI() {
  zai = await ZAI.create();
  console.log('ZAI initialized');
}

async function analyzePage(imagePath: string, subject: string): Promise<string> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `You are an expert at extracting exam questions from educational materials.

Analyze this ${subject} exam page and extract ALL questions from it.

IMPORTANT RULES:
1. Extract EVERY question you can see on this page
2. Preserve the EXACT wording of questions as they appear in the image
3. For questions with diagrams/images, note "HAS_IMAGE: true" and describe what the diagram shows
4. Extract all options (A, B, C, D) exactly as written
5. Identify the correct answer if shown (usually indicated with an asterisk, bold, or answer key)
6. Note the year if visible on the page

OUTPUT FORMAT - Return a JSON array:
[
  {
    "year": "2023" or "Unknown",
    "question": "The exact question text as it appears",
    "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
    "correctAnswer": 0-3 (index of correct option, or -1 if unknown),
    "hasImage": true/false,
    "imageDescription": "Description of diagram if hasImage is true"
  }
]

Return ONLY valid JSON array, no other text. If no questions found on this page, return [].`;

  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: prompt },
          { 
            type: 'image_url', 
            image_url: { 
              url: `data:image/png;base64,${base64Image}` 
            } 
          }
        ]
      }
    ],
    thinking: { type: 'disabled' }
  });

  return response.choices[0]?.message?.content || '[]';
}

function parseQuestions(jsonStr: string): Question[] {
  try {
    // Clean up the response - extract JSON if wrapped in markdown
    let cleanJson = jsonStr.trim();
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    }
    
    const parsed = JSON.parse(cleanJson);
    if (!Array.isArray(parsed)) return [];
    
    return parsed.map((q, index) => ({
      id: index,
      year: q.year || 'Unknown',
      question: q.question || '',
      options: Array.isArray(q.options) ? q.options : [],
      correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : -1,
      hasImage: q.hasImage || false,
      imageDescription: q.imageDescription || undefined
    }));
  } catch (e) {
    console.error('Failed to parse JSON:', e);
    return [];
  }
}

async function processSubject(subject: Subject): Promise<Question[]> {
  const pagesDir = path.join(__dirname, 'pdf_pages', subject);
  const allQuestions: Question[] = [];
  let questionId = 1;
  
  if (!fs.existsSync(pagesDir)) {
    console.log(`No pages directory for ${subject}`);
    return [];
  }
  
  const pages = fs.readdirSync(pagesDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
  
  console.log(`\nProcessing ${subject}: ${pages.length} pages`);
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pagePath = path.join(pagesDir, page);
    
    console.log(`  Page ${i + 1}/${pages.length}: ${page}`);
    
    try {
      const result = await analyzePage(pagePath, subject);
      const questions = parseQuestions(result);
      
      for (const q of questions) {
        q.id = questionId++;
        allQuestions.push(q);
      }
      
      console.log(`    Found ${questions.length} questions`);
      
      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 500));
    } catch (e) {
      console.error(`  Error processing ${page}:`, e);
    }
  }
  
  return allQuestions;
}

function generateJSFile(questions: Question[], subject: string): string {
  const subjectCapitalized = subject.charAt(0).toUpperCase() + subject.slice(1);
  
  let js = `// ${subjectCapitalized} Questions extracted from PDF
// Total questions: ${questions.length}
// Generated on: ${new Date().toISOString()}

export const ${subject}Questions = [
`;

  for (const q of questions) {
    js += `  {
    id: ${q.id},
    year: "${q.year}",
    question: "${q.question.replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
    options: ${JSON.stringify(q.options.map(o => o.replace(/"/g, '\\"')))},
    correctAnswer: ${q.correctAnswer},${q.hasImage ? `
    hasImage: true,` : ''}
  },
`;
  }

  js += `];

export default ${subject}Questions;
`;
  
  return js;
}

async function main() {
  await initZAI();
  
  const results: Record<Subject, Question[]> = {
    physics: [],
    maths: [],
    english: [],
    economics: []
  };
  
  for (const subject of SUBJECTS) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Processing ${subject.toUpperCase()}`);
    console.log('='.repeat(50));
    
    const questions = await processSubject(subject);
    results[subject] = questions;
    
    // Generate JS file
    const jsContent = generateJSFile(questions, subject);
    const outputPath = path.join(__dirname, 'js', `${subject}-questions.js`);
    fs.writeFileSync(outputPath, jsContent);
    
    console.log(`\nGenerated ${questions.length} questions for ${subject}`);
    console.log(`Saved to: ${outputPath}`);
    
    // Save raw JSON as backup
    const jsonPath = path.join(__dirname, 'pdfs', `${subject}-questions.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(questions, null, 2));
    console.log(`JSON backup: ${jsonPath}`);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('EXTRACTION COMPLETE');
  console.log('='.repeat(50));
  
  for (const subject of SUBJECTS) {
    console.log(`${subject}: ${results[subject].length} questions`);
  }
}

main().catch(console.error);
