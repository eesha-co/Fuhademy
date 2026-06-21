import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const PAGES_DIR = '/home/z/my-project/students/cbt/images/physics_pages';
const OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_questions';

async function main() {
  const pageFile = path.join(PAGES_DIR, 'page-76.png');
  const outFile = path.join(OUTPUT_DIR, '2018_q35.png');
  
  const image = sharp(pageFile);
  const meta = await image.metadata();
  
  if (!meta.height || !meta.width) {
    console.log('Could not get metadata');
    return;
  }
  
  // Q35: topY 53.2%, bottomY 66.8%
  const top = Math.floor((53.2 / 100) * meta.height);
  const bottom = Math.floor((66.8 / 100) * meta.height);
  const height = bottom - top;
  
  console.log(`Extracting from y=${top}px to y=${bottom}px (height: ${height}px)`);
  
  await image.extract({ left: 0, top, width: meta.width, height }).toFile(outFile);
  
  console.log(`Saved to ${outFile}`);
}

main().catch(console.error);
