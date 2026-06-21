const fs = require('fs');
const path = require('path');

const JS_DIR = path.join(__dirname, 'js');

// Keywords that indicate a question HAS a diagram
const DIAGRAM_INDICATORS = [
  "diagram above",
  "diagram shows",
  "diagram represents",
  "diagram illustrates",
  "figure above",
  "figure shows",
  "the figure",
  "graph above",
  "graph shows",
  "the graph",
  "chart above",
  "chart shows",
  "the chart",
  "table above",
  "table shows",
  "the table",
  "as shown in",
  "shown in the",
  "in the diagram",
  "from the diagram",
  "the sketch",
  "circuit diagram",
  "ray diagram",
  "velocity-time graph",
  "v-t graph",
  "the following diagram",
  "see diagram",
  "refer to the",
  "the illustration",
  "the schematic",
  "the plot shows",
  "the curve shows",
  "the histogram",
  "pie chart",
  "bar graph",
  "the bar chart",
];

function questionNeedsDiagram(questionText) {
  if (!questionText) return false;
  const textLower = questionText.toLowerCase();
  return DIAGRAM_INDICATORS.some(indicator => textLower.includes(indicator));
}

function fixQuestionsFile(filename) {
  const filepath = path.join(JS_DIR, filename);
  
  if (!fs.existsSync(filepath)) {
    console.log(`\n⚠️ File not found: ${filename}`);
    return null;
  }
  
  console.log(`\n📄 Processing: ${filename}`);
  
  // Read and parse the file
  let content = fs.readFileSync(filepath, 'utf8');
  
  // The file defines jambQuestions, we need to parse it
  // Create a sandbox to evaluate the JS
  const vm = require('vm');
  const sandbox = { 
    window: {}, 
    jambQuestions: {},
    console: console
  };
  
  try {
    // Make sandbox global-like
    sandbox.self = sandbox;
    sandbox.global = sandbox;
    
    // Run the script in the sandbox
    vm.createContext(sandbox);
    vm.runInContext(content, sandbox);
    
    const questions = sandbox.jambQuestions;
    if (!questions) {
      console.log(`   ❌ No jambQuestions found`);
      return null;
    }
    
    const stats = {
      subjects: 0,
      total: 0,
      hadImage: 0,
      needsDiagram: 0,
      kept: 0,
      nullified: 0
    };
    
    // Process each subject
    for (const [subject, data] of Object.entries(questions)) {
      stats.subjects++;
      
      if (data.questionsByYear) {
        for (const [year, yearQuestions] of Object.entries(data.questionsByYear)) {
          for (const q of yearQuestions) {
            stats.total++;
            
            if (q.image && q.image !== null) {
              stats.hadImage++;
              
              if (questionNeedsDiagram(q.question)) {
                stats.needsDiagram++;
                stats.kept++;
                // Keep the image
              } else {
                // Remove image - question doesn't reference diagram
                q.image = null;
                stats.nullified++;
              }
            }
          }
        }
      }
    }
    
    // Generate new JS content
    const outputContent = `// JAMB Past Questions - Fixed Image Associations
// This file was automatically fixed to properly associate images with questions
// Only questions that reference diagrams/figures now have images

window.jambQuestions = ${JSON.stringify(questions, null, 2)};
`;
    
    // Write the fixed file
    const outputPath = path.join(JS_DIR, filename + '.fixed');
    fs.writeFileSync(outputPath, outputContent, 'utf8');
    
    console.log(`   ✅ Total questions: ${stats.total}`);
    console.log(`   📷 Originally had images: ${stats.hadImage}`);
    console.log(`   🖼️ Questions with diagram refs: ${stats.needsDiagram}`);
    console.log(`   ✅ Kept images: ${stats.kept}`);
    console.log(`   🗑️ Removed images: ${stats.nullified}`);
    console.log(`   💾 Saved to: ${filename}.fixed`);
    
    return stats;
    
  } catch (err) {
    console.log(`   ❌ Error: ${err.message}`);
    return null;
  }
}

// Main
const files = [
  'physics-questions.js',
  'maths-questions.js',
  'english-questions.js',
  'economics-questions.js',
  'chem-questions.js',
  'biology-questions.js',
];

const totalStats = {
  subjects: 0,
  total: 0,
  hadImage: 0,
  needsDiagram: 0,
  kept: 0,
  nullified: 0
};

for (const file of files) {
  const stats = fixQuestionsFile(file);
  if (stats) {
    for (const key of Object.keys(totalStats)) {
      totalStats[key] += stats[key] || 0;
    }
  }
}

console.log('\n' + '='.repeat(50));
console.log('📊 TOTALS:');
console.log(`   Subjects: ${totalStats.subjects}`);
console.log(`   Total questions: ${totalStats.total}`);
console.log(`   Originally had images: ${totalStats.hadImage}`);
console.log(`   Questions with diagram refs: ${totalStats.needsDiagram}`);
console.log(`   Kept images: ${totalStats.kept}`);
console.log(`   Removed images: ${totalStats.nullified}`);
console.log('='.repeat(50));

console.log('\n📝 To apply fixes, run:');
console.log('   cd /home/z/my-project/students/cbt/js');
for (const file of files) {
  if (fs.existsSync(path.join(JS_DIR, file + '.fixed'))) {
    console.log(`   mv ${file}.fixed ${file}`);
  }
}
