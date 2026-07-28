// Script to convert question files to the correct format for cbt.html
const fs = require('fs');
const path = require('path');

// Subject name mappings
const subjectMappings = {
  'maths': 'Mathematics',
  'mathematics': 'Mathematics',
  'physics': 'Physics',
  'english': 'English',
  'economics': 'Economics',
  'chemistry': 'Chemistry',
  'chem': 'Chemistry',
  'biology': 'Biology'
};

function convertQuestions(inputFile, outputFile, subjectName) {
  try {
    const content = fs.readFileSync(inputFile, 'utf8');
    
    // Extract the array from the file
    const match = content.match(/const\s+\w+Questions\s*=\s*(\[[\s\S]*\]);?\s*$/);
    if (!match) {
      console.log(`Could not parse ${inputFile}`);
      return null;
    }
    
    const questions = eval(match[1]);
    const properSubjectName = subjectMappings[subjectName.toLowerCase()] || subjectName;
    
    // Group by year
    const years = [...new Set(questions.map(q => q.year).filter(y => y))];
    years.sort();
    
    const questionsByYear = {};
    years.forEach(year => {
      questionsByYear[year] = questions.filter(q => q.year === year);
    });
    
    // Create the output structure
    const output = `// JAMB ${properSubjectName} Past Questions
// Total: ${questions.length} questions across ${years.length} years

window.jambQuestions = window.jambQuestions || {};

jambQuestions["${properSubjectName}"] = {
  years: ${JSON.stringify(years)},
  questionsByYear: ${JSON.stringify(questionsByYear, null, 2)}
};
`;
    
    fs.writeFileSync(outputFile, output);
    console.log(`✓ Converted ${inputFile} -> ${outputFile}`);
    console.log(`  Subject: ${properSubjectName}, Years: ${years.length}, Questions: ${questions.length}`);
    
    return { subject: properSubjectName, years, questionCount: questions.length };
  } catch (error) {
    console.error(`Error converting ${inputFile}:`, error.message);
    return null;
  }
}

// Convert all question files
const files = [
  { input: 'maths-questions-new.js', output: 'maths-questions.js', subject: 'Mathematics' },
  { input: 'physics-questions-new.js', output: 'physics-questions.js', subject: 'Physics' },
  { input: 'english-questions-new.js', output: 'english-questions.js', subject: 'English' },
  { input: 'economics-questions-new.js', output: 'economics-questions.js', subject: 'Economics' },
];

console.log('Converting question files...\n');

let results = [];
files.forEach(f => {
  if (fs.existsSync(f.input)) {
    const result = convertQuestions(f.input, f.output, f.subject);
    if (result) results.push(result);
  } else {
    console.log(`File not found: ${f.input}`);
  }
});

console.log('\n=== Conversion Summary ===');
results.forEach(r => {
  console.log(`${r.subject}: ${r.questionCount} questions, ${r.years.length} years (${r.years[0]} - ${r.years[r.years.length-1]})`);
});
