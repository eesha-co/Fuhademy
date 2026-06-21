import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';

async function extractMissing(year: string, questionNum: number, pageFile: string) {
  const zai = await ZAI.create();
  
  const imageBuffer = fs.readFileSync(pageFile);
  const base64Image = imageBuffer.toString('base64');
  
  const prompt = `Find question ${questionNum} on this page. Give me its topY and bottomY percentages (0-100).
Return JSON: {"topY": 5, "bottomY": 25, "hasDiagram": false}`;

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

    const content = response.choices[0]?.message?.content || '{}';
    const jsonMatch = content.match(/\{[\s\S]*?\}/);
    const boundary = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    
    if (!boundary || boundary.topY === undefined || boundary.bottomY === undefined) {
      console.log(`Could not find Q${questionNum}`);
      return false;
    }
    
    const image = sharp(pageFile);
    const meta = await image.metadata();
    
    if (!meta.height || !meta.width) return false;
    
    const top = Math.max(0, Math.floor((boundary.topY / 100) * meta.height) - 3);
    const bottom = Math.min(meta.height, Math.floor((boundary.bottomY / 100) * meta.height) + 3);
    const height = bottom - top;
    
    if (height <= 10) return false;
    
    const outFile = path.join(OUTPUT_DIR, `${year}_q${questionNum}.png`);
    await image.extract({ left: 0, top, width: meta.width, height }).toFile(outFile);
    
    console.log(`✓ Extracted ${year} Q${questionNum}`);
    return true;
  } catch (e) {
    console.error('Error:', e);
    return false;
  }
}

// Extract specific missing questions
const missing = [
  { year: '2012', q: 50, page: '/home/z/my-project/students/cbt/images/physics_pages/page-31.png' },
  { year: '2014', q: 9, page: '/home/z/my-project/students/cbt/images/physics_pages/page-44.png' },
  { year: '2014', q: 10, page: '/home/z/my-project/students/cbt/images/physics_pages/page-44.png' },
  { year: '2016', q: 31, page: '/home/z/my-project/students/cbt/images/physics_pages/page-62.png' },
  { year: '2016', q: 32, page: '/home/z/my-project/students/cbt/images/physics_pages/page-62.png' },
  { year: '2016', q: 33, page: '/home/z/my-project/students/cbt/images/physics_pages/page-62.png' },
  { year: '2016', q: 34, page: '/home/z/my-project/students/cbt/images/physics_pages/page-62.png' },
  { year: '2016', q: 35, page: '/home/z/my-project/students/cbt/images/physics_pages/page-62.png' },
  { year: '2018', q: 30, page: '/home/z/my-project/students/cbt/images/physics_pages/page-75.png' },
  { year: '2018', q: 34, page: '/home/z/my-project/students/cbt/images/physics_pages/page-76.png' },
  { year: '2018', q: 35, page: '/home/z/my-project/students/cbt/images/physics_pages/page-76.png' },
];

async function main() {
  for (const item of missing) {
    if (!fs.existsSync(item.page)) {
      console.log(`Page not found: ${item.page}`);
      continue;
    }
    await extractMissing(item.year, item.q, item.page);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('Done!');
}

main();
