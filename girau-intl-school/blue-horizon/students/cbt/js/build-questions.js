// Build proper question files for cbt.html
const fs = require('fs');

// Subject name mappings
const subjectMappings = {
  'maths': 'Mathematics',
  'physics': 'Physics',
  'english': 'English',
  'economics': 'Economics',
  'chemistry': 'Chemistry',
  'biology': 'Biology'
};

// Read and parse question files
function parseQuestions(filename) {
  console.log(`Parsing ${filename}...`);
  const content = fs.readFileSync(filename, 'utf8');
  
  // Try different patterns
  let match;
  
  // Pattern 1: const xxxQuestions = [...]
  match = content.match(/const\s+\w+Questions\s*=\s*(\[[\s\S]*?\]);?\s*(?:\/\/|$)/);
  
  if (!match) {
    // Pattern 2: Look for the array directly
    const startIdx = content.indexOf('const ');
    if (startIdx !== -1) {
      const startBracket = content.indexOf('[', startIdx);
      if (startBracket !== -1) {
        // Find matching bracket
        let count = 0;
        let endBracket = startBracket;
        for (let i = startBracket; i < content.length; i++) {
          if (content[i] === '[') count++;
          if (content[i] === ']') count--;
          if (count === 0) {
            endBracket = i;
            break;
          }
        }
        const arrayStr = content.substring(startBracket, endBracket + 1);
        try {
          const questions = eval(arrayStr);
          console.log(`  Found ${questions.length} questions`);
          return questions;
        } catch (e) {
          console.log(`  Error parsing: ${e.message}`);
          return null;
        }
      }
    }
    console.log('  Could not find question array');
    return null;
  }
  
  try {
    const questions = eval(match[1]);
    console.log(`  Parsed ${questions.length} questions`);
    return questions;
  } catch (e) {
    console.log(`  Error evaluating: ${e.message}`);
    return null;
  }
}

function buildQuestionFile(questions, subjectName, outputFile) {
  const properSubjectName = subjectMappings[subjectName.toLowerCase()] || subjectName;
  
  // Get all years
  const years = [...new Set(questions.map(q => q.year).filter(y => y))];
  years.sort();
  
  // Group questions by year
  const questionsByYear = {};
  years.forEach(year => {
    questionsByYear[year] = questions.filter(q => q.year === year);
  });
  
  const output = `// JAMB ${properSubjectName} Past Questions
// Total: ${questions.length} questions across ${years.length} years
// Years: ${years.join(', ')}

window.jambQuestions = window.jambQuestions || {};

jambQuestions["${properSubjectName}"] = {
  years: ${JSON.stringify(years)},
  questionsByYear: ${JSON.stringify(questionsByYear, null, 2)}
};
`;
  
  fs.writeFileSync(outputFile, output);
  console.log(`✓ Built ${outputFile}`);
  console.log(`  Subject: ${properSubjectName}`);
  console.log(`  Years: ${years.length} (${years[0] || 'unknown'} - ${years[years.length-1] || 'unknown'})`);
  console.log(`  Questions: ${questions.length}`);
  
  return { subject: properSubjectName, years, questionCount: questions.length };
}

console.log('Building question files...\n');

const files = [
  { input: 'maths-questions-new.js', output: 'maths-questions.js', subject: 'maths' },
  { input: 'physics-questions-new.js', output: 'physics-questions.js', subject: 'physics' },
  { input: 'english-questions-new.js', output: 'english-questions.js', subject: 'english' },
  { input: 'economics-questions-new.js', output: 'economics-questions.js', subject: 'economics' },
];

const results = [];

files.forEach(f => {
  if (fs.existsSync(f.input)) {
    const questions = parseQuestions(f.input);
    if (questions && questions.length > 0) {
      const result = buildQuestionFile(questions, f.subject, f.output);
      if (result) results.push(result);
    }
  } else {
    console.log(`File not found: ${f.input}`);
  }
});

console.log('\n=== Build Summary ===');
results.forEach(r => {
  console.log(`${r.subject}: ${r.questionCount} questions, ${r.years.length} years`);
});
