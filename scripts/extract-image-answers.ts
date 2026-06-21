import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const IMAGES_DIR = '/home/z/my-project/students/cbt/images/physics';
const OUTPUT_FILE = '/home/z/my-project/students/cbt/js/physics-image-answers.json';

async function analyzeImage(zai: any, imagePath: string): Promise<{ questionNum: number | null; answer: string | null }> {
  try {
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
              text: `Analyze this exam question image. Extract:
1. The question number (look for "1.", "2.", "3.", etc. at the beginning)
2. The correct answer if it's shown or indicated (A, B, C, D, or E)

Look for:
- Question numbers like "1.", "2.", "23.", etc.
- Answer indicators like circled letters, bold letters, or "(A)", "(B)" answers
- Any marking that shows which option is correct

If you can determine the correct answer, return it. If not, return null.

Return ONLY a JSON object like: {"questionNum": 1, "answer": "A"} or {"questionNum": null, "answer": null}`
            },
            {
              type: 'image_url',
              image_url: { url: `data:${mimeType};base64,${base64Image}` }
            }
          ]
        }
      ],
      thinking: { type: 'disabled' }
    });

    const content = response.choices[0]?.message?.content || '';
    
    // Try to parse JSON from response
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.log(`  Failed to parse JSON: ${content}`);
      }
    }
    
    return { questionNum: null, answer: null };
  } catch (error) {
    console.error(`  Error analyzing ${imagePath}: ${error}`);
    return { questionNum: null, answer: null };
  }
}

async function main() {
  console.log('Initializing Z-AI SDK...');
  const zai = await ZAI.create();

  // Get all unique image files (excluding _0 duplicates)
  const files = fs.readdirSync(IMAGES_DIR)
    .filter(f => (f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png')) && !f.includes('_0.'))
    .sort();

  console.log(`Found ${files.length} images to analyze`);

  const results: Record<string, { questionNum: number | null; answer: string | null }> = {};

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(IMAGES_DIR, file);
    console.log(`[${i + 1}/${files.length}] Analyzing ${file}...`);

    const result = await analyzeImage(zai, filePath);
    results[file] = result;
    
    if (result.questionNum || result.answer) {
      console.log(`  Question: ${result.questionNum}, Answer: ${result.answer}`);
    }

    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`\nResults saved to ${OUTPUT_FILE}`);

  // Summary
  const withAnswers = Object.values(results).filter(r => r.answer).length;
  const withQuestionNum = Object.values(results).filter(r => r.questionNum).length;
  console.log(`Summary: ${withAnswers} images with answers, ${withQuestionNum} with question numbers`);
}

main().catch(console.error);
