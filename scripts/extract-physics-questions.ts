import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// Page mapping for Physics PDF (based on PDF structure)
// Year starts on specific pages
const YEAR_PAGE_MAP: { [year: string]: { start: number; end: number; count: number } } = {
  '2010': { start: 2, end: 11, count: 50 },  // Pages 2-11 (0-indexed: 1-10)
  '2011': { start: 12, end: 21, count: 50 }, // Pages 12-21
  '2012': { start: 22, end: 31, count: 50 }, // Pages 22-31
  '2013': { start: 32, end: 41, count: 50 }, // Pages 32-41
  '2014': { start: 42, end: 51, count: 50 }, // Pages 42-51
  '2015': { start: 52, end: 57, count: 40 }, // Pages 52-57
  '2016': { start: 58, end: 63, count: 40 }, // Pages 58-63
  '2017': { start: 64, end: 69, count: 40 }, // Pages 64-69
  '2018': { start: 70, end: 75, count: 40 }, // Pages 70-75
};

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';

interface QuestionBoundary {
  questionNumber: number;
  topY: number;    // Percentage from top (0-100)
  bottomY: number; // Percentage from top (0-100)
  hasDiagram: boolean;
}

interface PageAnalysis {
  pageNumber: number;
  year: string;
  questions: QuestionBoundary[];
}

async function analyzePageWithVLM(zai: any, imagePath: string, pageNumber: number): Promise<QuestionBoundary[]> {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `You are analyzing a page from a JAMB Physics past questions PDF.

This is page ${pageNumber} of the document. 

TASK: Identify ALL exam questions visible on this page and their vertical positions.

For EACH question found, provide:
1. The question NUMBER (e.g., 1, 2, 3, etc.)
2. The TOP position - percentage from the top of the page where the question starts (0% = very top, 100% = very bottom)
3. The BOTTOM position - percentage from the top where the question ends (including any diagram but EXCLUDING the options A, B, C, D)
4. Whether the question has a DIAGRAM (true/false)

IMPORTANT RULES:
- Each question should include its text and any diagram/figure
- DO NOT include the options (A., B., C., D.) in the boundary - stop before the options
- The bottom boundary should be just before "A." starts
- If a question continues from previous page or to next page, mark only what's visible
- Look carefully for question numbers like "1.", "2.", "3.", etc.
- Diagrams are usually images/figures associated with questions

Respond ONLY with a valid JSON array, no other text:
[
  {
    "questionNumber": 1,
    "topY": 5,
    "bottomY": 25,
    "hasDiagram": true
  },
  ...
]

If no exam questions are found on this page, return: []`;

  try {
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    const content = response.choices[0]?.message?.content || '[]';
    
    // Extract JSON from response
    let jsonStr = content;
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    const questions: QuestionBoundary[] = JSON.parse(jsonStr);
    return questions;
  } catch (error) {
    console.error(`Error analyzing page ${pageNumber}:`, error);
    return [];
  }
}

async function extractQuestionFromPage(
  pageImagePath: string,
  question: QuestionBoundary,
  outputPath: string
): Promise<boolean> {
  try {
    const image = sharp(pageImagePath);
    const metadata = await image.metadata();
    
    if (!metadata.height || !metadata.width) {
      console.error('Could not get image metadata');
      return false;
    }
    
    const topPixel = Math.floor((question.topY / 100) * metadata.height);
    const bottomPixel = Math.floor((question.bottomY / 100) * metadata.height);
    const height = bottomPixel - topPixel;
    
    if (height <= 0) {
      console.error(`Invalid height for question: ${JSON.stringify(question)}`);
      return false;
    }
    
    // Extract the question region with small padding
    const padding = 5;
    const extractTop = Math.max(0, topPixel - padding);
    const extractHeight = Math.min(metadata.height - extractTop, height + padding * 2);
    
    await image
      .extract({ left: 0, top: extractTop, width: metadata.width, height: extractHeight })
      .toFile(outputPath);
    
    return true;
  } catch (error) {
    console.error(`Error extracting question:`, error);
    return false;
  }
}

async function main() {
  console.log('Starting Physics question extraction using VLM...\n');
  
  const zai = await ZAI.create();
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  const allExtractions: { [year: string]: { [num: number]: string } } = {};
  
  for (const [year, info] of Object.entries(YEAR_PAGE_MAP)) {
    console.log(`\n=== Processing ${year} (${info.count} questions) ===`);
    allExtractions[year] = {};
    
    // Process each page for this year
    for (let pageNum = info.start; pageNum <= info.end; pageNum++) {
      const pageImagePath = path.join(PAGES_DIR, `page-${String(pageNum).padStart(2, '0')}.png`);
      
      if (!fs.existsSync(pageImagePath)) {
        console.log(`Page ${pageNum} not found at ${pageImagePath}`);
        continue;
      }
      
      console.log(`Analyzing page ${pageNum}...`);
      
      const questions = await analyzePageWithVLM(zai, pageImagePath, pageNum);
      
      if (questions.length === 0) {
        console.log(`  No questions found on page ${pageNum}`);
        continue;
      }
      
      console.log(`  Found ${questions.length} questions: ${questions.map(q => q.questionNumber).join(', ')}`);
      
      // Extract each question
      for (const q of questions) {
        // Skip if question number is out of expected range
        if (q.questionNumber < 1 || q.questionNumber > info.count) {
          console.log(`  Skipping question ${q.questionNumber} (out of range)`);
          continue;
        }
        
        const outputPath = path.join(OUTPUT_DIR, `${year}_q${q.questionNumber}.png`);
        
        const success = await extractQuestionFromPage(pageImagePath, q, outputPath);
        
        if (success) {
          allExtractions[year][q.questionNumber] = outputPath;
          console.log(`  ✓ Extracted question ${q.questionNumber}${q.hasDiagram ? ' (has diagram)' : ''}`);
        } else {
          console.log(`  ✗ Failed to extract question ${q.questionNumber}`);
        }
      }
      
      // Small delay between pages
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Summary
  console.log('\n\n=== EXTRACTION SUMMARY ===');
  for (const [year, questions] of Object.entries(allExtractions)) {
    const count = Object.keys(questions).length;
    const expected = YEAR_PAGE_MAP[year].count;
    console.log(`${year}: ${count}/${expected} questions extracted`);
  }
  
  // Save extraction map
  const mapPath = path.join(OUTPUT_DIR, 'extraction_map.json');
  fs.writeFileSync(mapPath, JSON.stringify(allExtractions, null, 2));
  console.log(`\nExtraction map saved to: ${mapPath}`);
}

main().catch(console.error);
