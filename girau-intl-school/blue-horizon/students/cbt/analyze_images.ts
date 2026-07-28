#!/usr/bin/env bun
/**
 * Image Analysis Script for CBT Questions
 * Uses VLM SDK to analyze images and match them to correct questions
 */

import ZAI from 'z-ai-web-dev-sdk';
import * as fs from 'fs';
import * as path from 'path';

const CBT_DIR = '/home/z/my-project/students/cbt';
const IMAGES_DIR = path.join(CBT_DIR, 'images');

interface Question {
  id: string;
  question: string;
  options: string[];
  year: string;
  image?: string | null;
}

interface SubjectData {
  [subject: string]: {
    years: string[];
    questionsByYear: {
      [year: string]: Question[];
    };
  };
}

async function analyzeImage(imagePath: string): Promise<string> {
  const zai = await ZAI.create();
  
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = imageBuffer.toString('base64');
  const mimeType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';
  
  const response = await zai.chat.completions.createVision({
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this educational diagram/figure from a JAMB mathematics or physics exam paper.
Describe in detail:
1. What type of diagram is this (geometry figure, graph, chart, circuit, etc.)
2. What mathematical/physics concepts does it illustrate
3. Any angles, measurements, or values shown
4. What question would this diagram help answer (be specific about the problem type)
5. Key elements like points labeled, shapes, functions graphed, etc.

Be specific and detailed to help match this to the correct exam question.`
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
}

async function matchImageToQuestion(
  imageDescription: string,
  questions: Question[]
): Promise<Question | null> {
  const zai = await ZAI.create();
  
  const questionTexts = questions.map((q, idx) => 
    `${idx}: ${q.question}\nOptions: ${q.options.join(', ')}`
  ).join('\n\n---\n\n');
  
  const response = await zai.chat.completions.create({
    model: 'default',
    messages: [
      {
        role: 'user',
        content: `Given this image description from an exam paper:

"${imageDescription}"

And these potential questions:

${questionTexts}

Which question number (index) does this image best match? Return ONLY the number, nothing else.
If the image doesn't clearly match any question, return -1.`
      }
    ]
  });
  
  const result = response.choices[0]?.message?.content || '-1';
  const index = parseInt(result.trim());
  
  if (index >= 0 && index < questions.length) {
    return questions[index];
  }
  return null;
}

async function processSubjectImages(
  subject: 'maths' | 'physics',
  questionsFile: string
) {
  console.log(`\n=== Processing ${subject.toUpperCase()} images ===\n`);
  
  // Load questions
  const questionsContent = fs.readFileSync(questionsFile, 'utf-8');
  const match = questionsContent.match(/window\.jambQuestions\s*=\s*(\{[\s\S]*?\});?\s*$/);
  if (!match) {
    console.log(`Could not parse questions file: ${questionsFile}`);
    return;
  }
  
  const subjectKey = subject.charAt(0).toUpperCase() + subject.slice(1);
  const questionsData: SubjectData = JSON.parse(match[1]);
  const subjectQuestions = questionsData[subjectKey];
  
  if (!subjectQuestions) {
    console.log(`Could not find ${subjectKey} in questions data`);
    return;
  }
  
  // Get all questions with images
  const questionsWithImages: Question[] = [];
  for (const year of Object.keys(subjectQuestions.questionsByYear)) {
    for (const q of subjectQuestions.questionsByYear[year]) {
      if (q.image) {
        questionsWithImages.push(q);
      }
    }
  }
  
  console.log(`Found ${questionsWithImages.length} questions with images`);
  
  // Get all images in the subject folder
  const subjectImageDir = path.join(IMAGES_DIR, subject);
  let images: string[] = [];
  
  if (fs.existsSync(subjectImageDir)) {
    images = fs.readdirSync(subjectImageDir)
      .filter(f => f.endsWith('.jpeg') || f.endsWith('.jpg') || f.endsWith('.png'))
      .map(f => path.join(subjectImageDir, f));
  }
  
  // Also check root images folder for subject images
  const rootImages = fs.readdirSync(IMAGES_DIR)
    .filter(f => {
      const lower = f.toLowerCase();
      return (lower.startsWith(subject) || lower.startsWith(subjectKey)) && 
             (lower.endsWith('.jpeg') || lower.endsWith('.jpg') || lower.endsWith('.png'));
    })
    .map(f => path.join(IMAGES_DIR, f));
  
  images = [...images, ...rootImages];
  console.log(`Found ${images.length} images for ${subject}`);
  
  // Analyze each image and try to match it
  const results: { image: string; question: Question | null; description: string }[] = [];
  
  for (const imagePath of images.slice(0, 5)) { // Limit to first 5 for testing
    console.log(`\nAnalyzing: ${path.basename(imagePath)}`);
    
    try {
      const description = await analyzeImage(imagePath);
      console.log(`Description: ${description.substring(0, 200)}...`);
      
      // Get all questions for matching
      const allQuestions: Question[] = [];
      for (const year of Object.keys(subjectQuestions.questionsByYear)) {
        allQuestions.push(...subjectQuestions.questionsByYear[year]);
      }
      
      const matchedQuestion = await matchImageToQuestion(description, allQuestions);
      
      results.push({
        image: path.basename(imagePath),
        question: matchedQuestion,
        description
      });
      
      if (matchedQuestion) {
        console.log(`Matched to question: ${matchedQuestion.id} - "${matchedQuestion.question.substring(0, 50)}..."`);
      } else {
        console.log(`No match found`);
      }
    } catch (error) {
      console.error(`Error processing ${imagePath}:`, error);
    }
  }
  
  return results;
}

async function main() {
  console.log('CBT Image Analysis Tool');
  console.log('========================\n');
  
  // Process maths
  const mathsResults = await processSubjectImages(
    'maths',
    path.join(CBT_DIR, 'js', 'maths-questions.js')
  );
  
  console.log('\n\n=== RESULTS ===\n');
  console.log('Maths:', JSON.stringify(mathsResults, null, 2));
}

main().catch(console.error);
