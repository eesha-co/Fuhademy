/**
 * Script to fix image-to-question mappings using VLM analysis
 * This creates a proper mapping by analyzing image content and matching to questions
 */

import ZAI from 'z-ai-web-dev-sdk';
import * as fs from 'fs';
import * as path from 'path';

const CBT_DIR = '/home/z/my-project/students/cbt';
const JS_DIR = path.join(CBT_DIR, 'js');

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  year: string;
  subject: string;
  image: string | null;
}

interface SubjectQuestions {
  [subject: string]: {
    years: string[];
    questionsByYear: {
      [year: string]: Question[];
    };
  };
}

// Initialize ZAI
let zaiInstance: Awaited<ReturnType<typeof ZAI.create>> | null = null;

async function getZAI() {
  if (!zaiInstance) {
    zaiInstance = await ZAI.create();
  }
  return zaiInstance;
}

async function analyzeImage(imagePath: string): Promise<string> {
  const zai = await getZAI();
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const ext = path.extname(imagePath).toLowerCase();
  const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
  
  try {
    const response = await zai.chat.completions.createVision({
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this educational diagram/figure from a JAMB exam paper.

Describe in detail:
1. What type of diagram is this (geometry figure, graph, chart, circuit, vector diagram, etc.)
2. Any angles, measurements, coordinates, or values shown
3. Key elements: points labeled (A, B, C, etc.), shapes, functions graphed
4. What kind of math/physics problem would use this diagram

Be specific and detailed.`
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });
    
    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error(`Error analyzing image ${imagePath}:`, error);
    return '';
  }
}

async function findMatchingQuestion(
  imageDescription: string,
  questions: Question[],
  imagePath: string
): Promise<Question | null> {
  const zai = await getZAI();
  
  // Extract page number from image path if possible
  const pageMatch = imagePath.match(/p(\d+)_i(\d+)/);
  const pageNum = pageMatch ? parseInt(pageMatch[1]) : null;
  
  // Format questions for comparison
  const formattedQuestions = questions.map((q, idx) => ({
    index: idx,
    id: q.id,
    question: q.question,
    options: q.options.join(', '),
    hasImageRef: /diagram|figure|graph|chart|table|above|below|shown/i.test(q.question)
  }));
  
  // Filter to questions that might have diagrams
  const diagramQuestions = formattedQuestions.filter(q => q.hasImageRef);
  
  if (diagramQuestions.length === 0) {
    return null;
  }
  
  const response = await zai.chat.completions.create({
    model: 'default',
    messages: [
      {
        role: 'user',
        content: `Given this image description from a JAMB exam paper:

IMAGE DESCRIPTION:
${imageDescription}

And these questions that reference diagrams/figures:

${diagramQuestions.map((q, i) => `
[${i}] ID: ${q.id}
Question: ${q.question}
Options: ${q.options}
`).join('\n---\n')}

Which question number [index] does this image BEST match?
Consider:
1. Does the diagram type match what the question asks about?
2. Are there specific angles/measurements that match the question?
3. Would this diagram help solve this specific question?

Return ONLY the index number, or -1 if no clear match.`
      }
    ]
  });
  
  const result = response.choices[0]?.message?.content || '-1';
  const index = parseInt(result.trim());
  
  if (index >= 0 && index < diagramQuestions.length) {
    const matchedId = diagramQuestions[index].id;
    return questions.find(q => q.id === matchedId) || null;
  }
  
  return null;
}

async function processSubject(
  subject: string,
  imageDir: string,
  outputFile: string
) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Processing: ${subject.toUpperCase()}`);
  console.log('='.repeat(60));
  
  // Read the questions file
  let content = fs.readFileSync(outputFile, 'utf-8');
  
  // Extract the questions object
  const match = content.match(/window\.jambQuestions\s*=\s*(\{[\s\S]*?\});?\s*$/);
  if (!match) {
    console.log(`Could not parse questions file: ${outputFile}`);
    return;
  }
  
  const questionsData: SubjectQuestions = JSON.parse(match[1]);
  const subjectKey = subject.charAt(0).toUpperCase() + subject.slice(1);
  const subjectData = questionsData[subjectKey];
  
  if (!subjectData) {
    console.log(`Could not find ${subjectKey} in questions data`);
    return;
  }
  
  // Collect all questions
  const allQuestions: Question[] = [];
  for (const year of Object.keys(subjectData.questionsByYear)) {
    allQuestions.push(...subjectData.questionsByYear[year]);
  }
  
  console.log(`Total questions: ${allQuestions.length}`);
  
  // Get all images
  const imageFiles = fs.readdirSync(imageDir)
    .filter(f => /\.(jpeg|jpg|png)$/i.test(f) && /^maths_p\d+_i\d+\.jpeg$|^physics_p\d+_i\d+\.jpeg$/.test(f))
    .map(f => path.join(imageDir, f));
  
  console.log(`Found ${imageFiles.length} diagram images to analyze`);
  
  // Current image assignments
  const currentAssignments = new Map<string, string[]>();
  for (const q of allQuestions) {
    if (q.image) {
      if (!currentAssignments.has(q.image)) {
        currentAssignments.set(q.image, []);
      }
      currentAssignments.get(q.image)!.push(q.id);
    }
  }
  
  console.log(`\nCurrent image assignments:`);
  for (const [img, ids] of currentAssignments) {
    if (ids.length > 1) {
      console.log(`  ${img}: ${ids.length} questions (${ids.slice(0, 3).join(', ')}...)`);
    }
  }
  
  // Track new mappings
  const newMappings: { image: string; oldQuestions: string[]; newQuestion: string | null }[] = [];
  
  // Process each unique image
  const processedImages = new Set<string>();
  
  for (const [imagePath, questionIds] of currentAssignments) {
    if (questionIds.length <= 1) continue; // Already unique
    
    const fullImagePath = path.join(CBT_DIR, 'images', imagePath.replace('images/', ''));
    if (!fs.existsSync(fullImagePath)) {
      console.log(`Image not found: ${fullImagePath}`);
      continue;
    }
    
    if (processedImages.has(imagePath)) continue;
    processedImages.add(imagePath);
    
    console.log(`\n--- Analyzing: ${imagePath} ---`);
    console.log(`Currently assigned to ${questionIds.length} questions`);
    
    const description = await analyzeImage(fullImagePath);
    if (!description) {
      console.log(`Could not analyze image`);
      continue;
    }
    
    console.log(`Description: ${description.substring(0, 150)}...`);
    
    // Find the correct question
    const matchingQuestion = await findMatchingQuestion(description, allQuestions, imagePath);
    
    if (matchingQuestion) {
      console.log(`✓ Matched to: ${matchingQuestion.id}`);
      newMappings.push({
        image: imagePath,
        oldQuestions: questionIds,
        newQuestion: matchingQuestion.id
      });
    } else {
      console.log(`✗ No clear match found`);
      newMappings.push({
        image: imagePath,
        oldQuestions: questionIds,
        newQuestion: null
      });
    }
  }
  
  // Apply the mappings
  console.log(`\n\nApplying mappings...`);
  
  for (const mapping of newMappings) {
    // Remove image from all old questions
    for (const qId of mapping.oldQuestions) {
      for (const year of Object.keys(subjectData.questionsByYear)) {
        const question = subjectData.questionsByYear[year].find(q => q.id === qId);
        if (question) {
          question.image = null;
        }
      }
    }
    
    // Assign to new question
    if (mapping.newQuestion) {
      for (const year of Object.keys(subjectData.questionsByYear)) {
        const question = subjectData.questionsByYear[year].find(q => q.id === mapping.newQuestion);
        if (question) {
          question.image = mapping.image;
          console.log(`  ${mapping.image} -> ${mapping.newQuestion}`);
        }
      }
    }
  }
  
  // Write the updated file
  const newContent = `// JAMB Past Questions - Fixed Image Associations
// Images are now properly mapped to the correct questions

window.jambQuestions = ${JSON.stringify(questionsData, null, 2)};
`;
  
  fs.writeFileSync(outputFile, newContent);
  console.log(`\nUpdated: ${outputFile}`);
}

async function main() {
  console.log('CBT Image Mapping Fix Tool');
  console.log('==========================\n');
  
  // Process Mathematics
  await processSubject(
    'mathematics',
    path.join(CBT_DIR, 'images/maths'),
    path.join(JS_DIR, 'maths-questions.js')
  );
  
  // Process Physics  
  await processSubject(
    'physics',
    path.join(CBT_DIR, 'images/physics'),
    path.join(JS_DIR, 'physics-questions.js')
  );
  
  console.log('\n\nDone!');
}

main().catch(console.error);
