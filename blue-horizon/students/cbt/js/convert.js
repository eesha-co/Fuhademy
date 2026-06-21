// Script to convert questions to proper format for cbt.html
const fs = require('fs');

function parseAndConvert(inputFile, subjectName) {
  console.log(`\nProcessing ${inputFile}...`);
  
  const content = fs.readFileSync(inputFile, 'utf8');
  
  // Find the array start
  const startMarker = 'const ';
  const startIdx = content.indexOf(startMarker);
  const bracketStart = content.indexOf('[', startIdx);
  
  if (bracketStart === -1) {
    console.log('  ERROR: Could not find array start');
    return null;
  }
  
  // Find matching closing bracket
  let depth = 0;
  let bracketEnd = bracketStart;
  for (let i = bracketStart; i < content.length; i++) {
    if (content[i] === '[') depth++;
    else if (content[i] === ']') depth--;
    if (depth === 0) {
      bracketEnd = i;
      break;
    }
  }
  
  const arrayContent = content.substring(bracketStart, bracketEnd + 1);
  
  // Parse the array
  let questions;
  try {
    questions = JSON.parse(arrayContent);
  } catch (e) {
    // Try eval as fallback
    try {
      questions = eval(arrayContent);
    } catch (e2) {
      console.log(`  ERROR: Could not parse array - ${e2.message}`);
      return null;
    }
  }
  
  console.log(`  Found ${questions.length} questions`);
  
  // Filter questions with valid years
  const validQuestions = questions.filter(q => q.year);
  console.log(`  Valid questions with years: ${validQuestions.length}`);
  
  // Get unique years
  const years = [...new Set(validQuestions.map(q => q.year))].sort();
  console.log(`  Years: ${years.length} (${years[0]} - ${years[years.length-1]})`);
  
  // Group by year
  const questionsByYear = {};
  years.forEach(year => {
    questionsByYear[year] = validQuestions.filter(q => q.year === year);
  });
  
  // Format each question properly
  Object.keys(questionsByYear).forEach(year => {
    questionsByYear[year] = questionsByYear[year].map((q, idx) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer || 0,
      image: q.image || null,
      passage: q.passage || null,
      number: idx + 1
    }));
  });
  
  return {
    subject: subjectName,
    years,
    questionsByYear,
    totalQuestions: validQuestions.length
  };
}

function generateJSFile(data, outputFile) {
  const jsContent = `// JAMB ${data.subject} Past Questions
// Total: ${data.totalQuestions} questions across ${data.years.length} years
// Years: ${data.years.join(', ')}

window.jambQuestions = window.jambQuestions || {};

jambQuestions["${data.subject}"] = {
  years: ${JSON.stringify(data.years)},
  questionsByYear: ${JSON.stringify(data.questionsByYear, null, 2)}
};
`;
  
  fs.writeFileSync(outputFile, jsContent);
  console.log(`  ✓ Written to ${outputFile}`);
}

// Process each file
console.log('Converting question files to proper format...');

const files = [
  { input: 'maths-questions-new.js', output: 'maths-questions.js', subject: 'Mathematics' },
  { input: 'physics-questions-new.js', output: 'physics-questions.js', subject: 'Physics' },
  { input: 'english-questions-new.js', output: 'english-questions.js', subject: 'English' },
  { input: 'economics-questions-new.js', output: 'economics-questions.js', subject: 'Economics' }
];

const results = [];

for (const file of files) {
  if (!fs.existsSync(file.input)) {
    console.log(`\nSkipping ${file.input} - file not found`);
    continue;
  }
  
  const data = parseAndConvert(file.input, file.subject);
  if (data) {
    generateJSFile(data, file.output);
    results.push(data);
  }
}

console.log('\n\n=== CONVERSION SUMMARY ===');
results.forEach(r => {
  console.log(`${r.subject}: ${r.totalQuestions} questions, ${r.years.length} years (${r.years[0]} - ${r.years[r.years.length-1]})`);
});
