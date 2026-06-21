#!/usr/bin/env python3
"""
Parse Physics and English questions from extracted text files.
- Physics: Extract question text, show images only for questions with diagrams
- English: Extract passages and questions, show passages in questions
"""

import json
import re
from pathlib import Path

BASE_DIR = Path("/home/z/my-project/students/cbt")

# Answer keys for Physics
PHYSICS_ANSWERS = {
    '2010': {1:'B',2:'D',3:'D',4:'A',5:'D',6:'C',7:'C',8:'B',9:'A',10:'C',11:'D',12:'D',13:'D',14:'A',15:'D',16:'C',17:'A',18:'C',19:'B',20:'A',21:'D',22:'C',23:'A',24:'B',25:'D',26:'B',27:'D',28:'D',29:'D',30:'A',31:'A',32:'A',33:'C',34:'C',35:'B',36:'C',37:'A',38:'A',39:'B',40:'C',41:'A',42:'A',43:'A',44:'A',45:'B',46:'A',47:'NO',48:'C',49:'C',50:'A'},
    '2011': {1:'C',2:'A',3:'B',4:'A',5:'D',6:'A',7:'A',8:'C',9:'A',10:'A',11:'C',12:'D',13:'D',14:'A',15:'A',16:'C',17:'D',18:'B',19:'B',20:'D',21:'C',22:'D',23:'NO',24:'B',25:'D',26:'C',27:'C',28:'B',29:'A',30:'C',31:'B',32:'C',33:'A',34:'D',35:'NO',36:'B',37:'D',38:'A',39:'NO',40:'A',41:'A',42:'A',43:'C',44:'A',45:'A',46:'D',47:'B',48:'C',49:'D',50:'B'},
    '2012': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
    '2013': {1:'B',2:'C',3:'D',4:'C',5:'D',6:'B',7:'A',8:'A',9:'A',10:'C',11:'B',12:'B',13:'D',14:'C',15:'B',16:'B',17:'A',18:'C',19:'D',20:'A',21:'C',22:'C',23:'A',24:'B',25:'D',26:'C',27:'A',28:'C',29:'D',30:'C',31:'D',32:'B',33:'B',34:'A',35:'C',36:'C',37:'A',38:'A',39:'A',40:'C',41:'A',42:'B',43:'A',44:'A',45:'A',46:'B',47:'A',48:'C',49:'C',50:'A'},
    '2014': {1:'A',2:'A',3:'C',4:'A',5:'C',6:'B',7:'D',8:'C',9:'C',10:'C',11:'D',12:'C',13:'A',14:'C',15:'C',16:'D',17:'D',18:'D',19:'C',20:'A',21:'C',22:'A',23:'B',24:'B',25:'C',26:'C',27:'B',28:'A',29:'A',30:'A',31:'A',32:'B',33:'A',34:'D',35:'D',36:'C',37:'C',38:'A',39:'B',40:'C',41:'B',42:'A',43:'A',44:'D',45:'C',46:'C',47:'C',48:'D',49:'A',50:'C'},
    '2015': {1:'A',2:'C',3:'B',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'A',14:'B',15:'C',16:'D',17:'A',18:'B',19:'C',20:'D',21:'A',22:'B',23:'C',24:'D',25:'A',26:'B',27:'C',28:'D',29:'A',30:'D',31:'A',32:'B',33:'D',34:'A',35:'D',36:'A',37:'B',38:'A',39:'B',40:'C'},
    '2016': {1:'B',2:'C',3:'A',4:'C',5:'A',6:'B',7:'C',8:'D',9:'A',10:'B',11:'C',12:'D',13:'D',14:'B',15:'A',16:'B',17:'C',18:'D',19:'A',20:'C',21:'A',22:'C',23:'B',24:'D',25:'A',26:'B',27:'C',28:'D',29:'B',30:'C',31:'A',32:'D',33:'B',34:'C',35:'A',36:'B',37:'C',38:'A',39:'D',40:'C'},
    '2017': {1:'A',2:'B',3:'D',4:'D',5:'A',6:'B',7:'C',8:'D',9:'A',10:'C',11:'B',12:'D',13:'A',14:'C',15:'B',16:'A',17:'D',18:'C',19:'B',20:'A',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
    '2018': {1:'A',2:'B',3:'D',4:'C',5:'D',6:'A',7:'B',8:'D',9:'C',10:'B',11:'A',12:'C',13:'B',14:'D',15:'A',16:'C',17:'D',18:'A',19:'B',20:'D',21:'C',22:'A',23:'B',24:'C',25:'D',26:'A',27:'B',28:'C',29:'D',30:'A',31:'B',32:'D',33:'C',34:'A',35:'B',36:'C',37:'D',38:'D',39:'A',40:'D'},
}

# Questions with diagrams (from VLM data)
PHYSICS_DIAGRAMS = {
    '2010': [3, 6, 34, 38, 39, 46],
    '2011': [5, 8, 21],
    '2012': [3, 4, 5, 7, 11, 12],
    '2013': [3, 7, 11, 21],
    '2014': [2, 11, 17, 23, 34, 38, 42],
    '2015': [5, 12, 18, 22, 33],
    '2016': [1, 14, 21, 27, 33],
    '2017': [5, 12, 21],
    '2018': [3, 11, 17, 22],
}

# English answer keys
ENGLISH_ANSWERS = {
    '2010': {1:'A',2:'A',3:'A',4:'A',5:'C',6:'A',7:'A',8:'A',9:'D',10:'D',11:'A',12:'C',13:'D',14:'C',15:'B',16:'B',17:'B',18:'A',19:'B',20:'A',21:'C',22:'D',23:'B',24:'B',25:'D',26:'B',27:'D',28:'B',29:'D',30:'C',31:'A',32:'A',33:'C',34:'D',35:'B',36:'D',37:'A',38:'A',39:'B',40:'D',41:'C',42:'C',43:'B',44:'D',45:'B',46:'A',47:'D',48:'A',49:'A',50:'D'},
}

def answer_to_index(letter):
    if not letter or letter == 'NO':
        return 0
    return ord(letter.upper()) - 65

def parse_physics_text():
    """Parse physics.txt to extract questions with text."""
    text_file = BASE_DIR / "pdfs" / "physics.txt"
    
    with open(text_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Split by year
    year_pattern = r'(\d{4}) JAMB PHYSICS QUESTIONS'
    year_matches = list(re.finditer(year_pattern, content))
    
    all_questions = {}
    
    for i, match in enumerate(year_matches):
        year = match.group(1)
        start = match.end()
        end = year_matches[i + 1].start() if i + 1 < len(year_matches) else len(content)
        year_content = content[start:end]
        
        # Split into questions - look for numbered questions
        # Pattern: number followed by period and text
        questions = []
        
        # Find all question starts
        q_pattern = r'^(\d+)\.\s+'
        lines = year_content.split('\n')
        
        current_q = None
        current_text = []
        current_options = []
        
        for line in lines:
            line = line.strip()
            if not line or 'www.toppers.com.ng' in line:
                continue
            
            # Check if this is a new question
            q_match = re.match(q_pattern, line)
            if q_match:
                # Save previous question
                if current_q and current_text:
                    q_num = int(current_q)
                    has_diagram = q_num in PHYSICS_DIAGRAMS.get(year, [])
                    
                    # Join text, clean it up
                    q_text = ' '.join(current_text).strip()
                    # Remove options from text
                    for opt in ['A.', 'B.', 'C.', 'D.']:
                        if opt in q_text:
                            q_text = q_text[:q_text.index(opt)].strip()
                    
                    questions.append({
                        'id': f'phy_{year}_{q_num}',
                        'question_num': q_num,
                        'question': q_text,
                        'has_diagram': has_diagram,
                        'image': f'images/physics_questions/{year}_q{q_num}.png' if has_diagram else None
                    })
                
                current_q = q_match.group(1)
                current_text = [line[q_match.end():]]
                current_options = []
            elif line.startswith(('A.', 'B.', 'C.', 'D.')):
                current_options.append(line)
            elif current_q:
                current_text.append(line)
        
        # Don't forget the last question
        if current_q and current_text:
            q_num = int(current_q)
            has_diagram = q_num in PHYSICS_DIAGRAMS.get(year, [])
            q_text = ' '.join(current_text).strip()
            for opt in ['A.', 'B.', 'C.', 'D.']:
                if opt in q_text:
                    q_text = q_text[:q_text.index(opt)].strip()
            
            if q_num <= 50:  # Only valid question numbers
                questions.append({
                    'id': f'phy_{year}_{q_num}',
                    'question_num': q_num,
                    'question': q_text,
                    'has_diagram': has_diagram,
                    'image': f'images/physics_questions/{year}_q{q_num}.png' if has_diagram else None
                })
        
        # Sort by question number and remove duplicates
        seen = set()
        unique_questions = []
        for q in sorted(questions, key=lambda x: x['question_num']):
            if q['question_num'] not in seen and q['question_num'] <= 50:
                seen.add(q['question_num'])
                unique_questions.append(q)
        
        all_questions[year] = unique_questions
        print(f"Year {year}: {len(unique_questions)} questions")
    
    return all_questions

def parse_english_text():
    """Parse english.txt to extract passages and questions."""
    text_file = BASE_DIR / "pdfs" / "english.txt"
    
    with open(text_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract passages - they are marked as PASSAGE I, PASSAGE II, etc.
    passages = {}
    
    # Find all passages
    passage_pattern = r'PASSAGE (I+|IV|V|VI|VII|VIII|IX|X)'
    passage_matches = list(re.finditer(passage_pattern, content))
    
    passage_texts = {}
    for i, match in enumerate(passage_matches):
        passage_num = match.group(1)
        start = match.end()
        end = passage_matches[i + 1].start() if i + 1 < len(passage_matches) else content.find('In each of questions')
        if end == -1:
            end = len(content)
        
        passage_content = content[start:end].strip()
        # Clean up passage
        lines = []
        for line in passage_content.split('\n'):
            line = line.strip()
            if line and not line.startswith(('A.', 'B.', 'C.', 'D.')) and not re.match(r'^\d+\.', line):
                if 'www.toppers.com.ng' not in line:
                    lines.append(line)
        
        passage_texts[i + 1] = ' '.join(lines)
        print(f"Passage {i + 1}: {len(passage_texts[i + 1])} chars")
    
    return passage_texts

def generate_physics_js(questions_data):
    """Generate the physics-questions.js file."""
    output = """// JAMB Physics Past Questions - Extracted from PDF
// Questions show text, images only for questions with diagrams

window.jambQuestions = window.jambQuestions || {};

const answerToIndex = (letter) => {
  if (!letter || letter === 'NO') return 0;
  return letter.charCodeAt(0) - 65;
};

const answers = {
"""
    
    for year in sorted(PHYSICS_ANSWERS.keys()):
        ans = PHYSICS_ANSWERS[year]
        ans_str = ','.join([f"{k}:'{v}'" for k, v in sorted(ans.items())])
        output += f"  '{year}': {{{ans_str}}},\n"
    
    output += "};\n\n"
    output += "const questionsData = {\n"
    
    for year in sorted(questions_data.keys()):
        questions = questions_data[year]
        output += f"  '{year}': [\n"
        
        for q in questions:
            ans_idx = answer_to_index(PHYSICS_ANSWERS.get(year, {}).get(q['question_num'], 'A'))
            img_str = f"'{q['image']}'" if q['image'] else 'null'
            has_diag = 'true' if q['has_diagram'] else 'false'
            
            # Escape quotes in question text
            q_text = q['question'].replace("'", "\\'").replace("\n", " ")
            q_text = re.sub(r'\s+', ' ', q_text).strip()
            
            output += f"""    {{
      id: '{q['id']}',
      question: '{q_text}',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: {ans_idx},
      year: '{year}',
      subject: 'Physics',
      image: {img_str},
      hasDiagram: {has_diag}
    }},
"""
        
        output += "  ],\n"
    
    output += """};

// Merge into jambQuestions
window.jambQuestions["Physics"] = {
  years: Object.keys(questionsData).sort(),
  questionsByYear: questionsData
};
"""
    
    return output

def main():
    print("Parsing Physics questions from text file...")
    physics_questions = parse_physics_text()
    
    # Generate JS file
    js_content = generate_physics_js(physics_questions)
    
    output_file = BASE_DIR / "js" / "physics-questions.js"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\nPhysics questions saved to {output_file}")
    
    # Count total questions
    total = sum(len(q) for q in physics_questions.values())
    print(f"Total Physics questions: {total}")
    
    # Count questions with diagrams
    diag_count = sum(1 for year_qs in physics_questions.values() for q in year_qs if q['has_diagram'])
    print(f"Questions with diagrams: {diag_count}")

if __name__ == "__main__":
    main()
