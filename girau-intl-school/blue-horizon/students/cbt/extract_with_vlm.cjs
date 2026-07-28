const fs = require('fs');
const path = require('path');
const ZAI = require('z-ai-web-dev-sdk').default;

const IMAGES_DIR = '/home/z/my-project/students/cbt/images/physics_new';
const OUTPUT_FILE = '/home/z/my-project/students/cbt/js/physics-questions-vlm.js';

async function extractQuestionsFromImage(zai, imagePath, pageNum) {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `Analyze this JAMB Physics exam page and extract ALL questions in JSON format.

For each question, extract:
1. question_number: The question number (1, 2, 3, etc.)
2. question: The full question text
3. options: Array of 4 options (A, B, C, D) - each option should be the full text without the letter prefix
4. has_diagram: true if there's a diagram/figure/graph for this specific question, false otherwise

IMPORTANT: 
- Extract questions in order from top to bottom
- Each option should be complete text, not cut off
- Mark has_diagram as true ONLY if the question explicitly references a diagram/figure or if there's a visual element clearly associated with that question

Return ONLY a JSON array of questions, no other text:
[
  {
    "question_number": 1,
    "question": "full question text here",
    "options": ["option A text", "option B text", "option C text", "option D text"],
    "has_diagram": false
  }
]`;

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
        
        // Try to extract JSON from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        console.log(`  Could not parse JSON from page ${pageNum}`);
        return [];
    } catch (error) {
        console.error(`  Error processing page ${pageNum}:`, error.message);
        return [];
    }
}

async function main() {
    console.log('='.repeat(60));
    console.log('JAMB Physics VLM Extraction');
    console.log('='.repeat(60));
    
    // Initialize ZAI
    const zai = await ZAI.create();
    console.log('ZAI initialized');
    
    // Get all page images sorted
    const files = fs.readdirSync(IMAGES_DIR)
        .filter(f => f.endsWith('.png') && f.startsWith('physics_page_'))
        .sort();
    
    console.log(`Found ${files.length} page images`);
    
    // Track current year based on page numbers
    const yearPages = {
        1: null,  // Cover
        2: '2010', 12: '2011', 22: '2012', 33: '2013',
        43: '2014', 53: '2015', 62: '2016', 71: '2017', 80: '2018'
    };
    
    let currentYear = '2010';
    const questionsByYear = {};
    let totalQuestions = 0;
    let qCounter = 0;
    
    // Process pages with questions (skip first page which is cover)
    for (let i = 1; i < files.length; i++) {
        const file = files[i];
        const pageNum = parseInt(file.match(/(\d+)/)[1]);
        const imagePath = path.join(IMAGES_DIR, file);
        
        // Update year if needed
        for (const [startPage, year] of Object.entries(yearPages)) {
            if (pageNum >= parseInt(startPage) && year) {
                currentYear = year;
                break;
            }
        }
        
        console.log(`\nProcessing page ${pageNum} (Year: ${currentYear})...`);
        
        const questions = await extractQuestionsFromImage(zai, imagePath, pageNum);
        
        if (questions.length > 0) {
            if (!questionsByYear[currentYear]) {
                questionsByYear[currentYear] = [];
            }
            
            for (const q of questions) {
                qCounter++;
                questionsByYear[currentYear].push({
                    id: `phy_${qCounter}`,
                    question: q.question,
                    options: q.options,
                    correctAnswer: 0,
                    year: currentYear,
                    subject: 'physics',
                    image: q.has_diagram ? `images/physics_new/${file}` : null,
                    page: pageNum,
                    question_number: q.question_number
                });
            }
            
            totalQuestions += questions.length;
            console.log(`  Extracted ${questions.length} questions`);
        }
        
        // Small delay between requests
        await new Promise(r => setTimeout(r, 500));
    }
    
    // Generate JS file
    const years = Object.keys(questionsByYear).sort();
    
    const jsContent = `// JAMB Physics Past Questions - VLM Extracted
// Total: ${totalQuestions} questions across ${years.length} years
// Years: ${years.join(', ')}
// Each question has its image linked if it contains a diagram

window.jambQuestions = window.jambQuestions || {};

jambQuestions["Physics"] = {
  years: ${JSON.stringify(years)},
  questionsByYear: ${JSON.stringify(questionsByYear, null, 2)}
};
`;
    
    fs.writeFileSync(OUTPUT_FILE, jsContent);
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Extraction Complete!`);
    console.log(`Total questions: ${totalQuestions}`);
    console.log(`Years: ${years.join(', ')}`);
    console.log(`Output: ${OUTPUT_FILE}`);
}

main().catch(console.error);
