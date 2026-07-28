#!/usr/bin/env python3
"""
Extract JAMB English questions with comprehension passages
Improved version based on actual PDF structure
"""
import fitz  # PyMuPDF
import re
import json
import os

def extract_english_questions(pdf_path):
    """Extract English questions with comprehension passages"""
    
    doc = fitz.open(pdf_path)
    questions_by_year = {}
    
    # Full text of all pages
    all_text = ""
    for page in doc:
        all_text += page.get_text() + "\n---PAGEBREAK---\n"
    
    doc.close()
    
    # Clean up text
    all_text = all_text.replace('www.toppers.com.ng', '')
    
    # Find year sections
    year_pattern = re.compile(r'(\d{4})\s*JAMB\s*USE\s*OF\s*ENGLISH\s*QUESTIONS', re.IGNORECASE)
    year_matches = list(year_pattern.finditer(all_text))
    
    print(f"Found {len(year_matches)} year markers")
    
    for i, match in enumerate(year_matches):
        year = match.group(1)
        start = match.end()
        
        # Find end (next year or end of document)
        if i + 1 < len(year_matches):
            end = year_matches[i + 1].start()
        else:
            end = len(all_text)
        
        year_text = all_text[start:end]
        print(f"\nProcessing year {year}...")
        
        # Extract passages and questions
        passages = {}
        
        # Find all passages
        passage_pattern = re.compile(r'PASSAGE\s+([IVX]+)\s*(.*?)(?=PASSAGE\s+[IVX]+|Questions?\s+\d+|\d+\.\s+Which|\Z)', re.IGNORECASE | re.DOTALL)
        
        for p_match in passage_pattern.finditer(year_text):
            passage_num = p_match.group(1)
            passage_text = p_match.group(2).strip()
            # Clean passage text
            passage_text = re.sub(r'\s+', ' ', passage_text).strip()
            if len(passage_text) > 100:  # Only keep substantial passages
                passages[passage_num] = passage_text[:2000]  # Limit length
                print(f"  Found PASSAGE {passage_num}: {len(passage_text)} chars")
        
        # Extract questions
        questions = []
        
        # Pattern for questions
        q_pattern = re.compile(r'(\d+)\.\s+(.+?)(?=\n\s*A\.\s)', re.DOTALL)
        
        # Find all question starts
        question_starts = list(re.finditer(r'(\d+)\.\s+', year_text))
        
        for j, q_start in enumerate(question_starts):
            q_num = int(q_start.group(1))
            
            # Get question text
            if j + 1 < len(question_starts):
                q_end = question_starts[j + 1].start()
            else:
                q_end = len(year_text)
            
            q_section = year_text[q_start.start():q_end]
            
            # Extract question text
            q_text_match = re.match(r'\d+\.\s+(.+?)(?=\n\s*A\.\s)', q_section, re.DOTALL)
            if not q_text_match:
                continue
            
            q_text = q_text_match.group(1).strip()
            q_text = re.sub(r'\s+', ' ', q_text)  # Clean whitespace
            
            # Extract options
            options = []
            for letter in ['A', 'B', 'C', 'D']:
                opt_pattern = re.compile(rf'{letter}\.\s+(.+?)(?=\n\s*[ABCD]\.|$)', re.DOTALL)
                opt_match = opt_pattern.search(q_section)
                if opt_match:
                    opt_text = opt_match.group(1).strip()
                    opt_text = re.sub(r'\s+', ' ', opt_text)
                    options.append(opt_text)
            
            if len(options) == 4 and q_text:
                q_data = {
                    "number": q_num,
                    "question": q_text,
                    "options": options,
                    "answer": "A"  # Default answer
                }
                
                # Associate with passage if question references it
                # Questions 1-5 usually relate to Passage I, 6-10 to Passage II, etc.
                if q_num <= 5 and 'I' in passages:
                    q_data["passage"] = passages['I']
                elif q_num <= 10 and 'II' in passages:
                    q_data["passage"] = passages['II']
                elif q_num <= 15 and 'III' in passages:
                    q_data["passage"] = passages['III']
                elif q_num <= 20 and 'IV' in passages:
                    q_data["passage"] = passages['IV']
                
                questions.append(q_data)
        
        if questions:
            questions_by_year[year] = questions
            print(f"  Extracted {len(questions)} questions for {year}")
    
    return questions_by_year


def generate_js_file(questions_by_year, output_path):
    """Generate JavaScript file with questions"""
    
    years = sorted(questions_by_year.keys())
    
    js_content = '''// JAMB English Past Questions
// Extracted from official JAMB past questions PDF

if (!jambQuestions) var jambQuestions = {};

jambQuestions["English"] = {
  years: %s,
  questionsByYear: {
''' % json.dumps(years)
    
    for year in years:
        questions = questions_by_year[year]
        js_content += f'    "{year}": [\n'
        
        for q in questions:
            passage_str = ""
            if q.get('passage'):
                # Escape backticks in passage
                passage_escaped = q["passage"].replace('`', "'").replace('\\', '\\\\')
                passage_str = f',\n        passage: `{passage_escaped}`'
            
            options_str = json.dumps(q['options'])
            question_escaped = q['question'].replace('`', "'").replace('\\', '\\\\')
            
            js_content += f'''      {{
        number: {q['number']},
        question: `{question_escaped}`,
        options: {options_str},
        answer: "{q['answer']}"{passage_str}
      }},
'''
        
        js_content += '    ],\n'
    
    js_content += '''  }
};
'''
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\nGenerated {output_path}")
    total = sum(len(qs) for qs in questions_by_year.values())
    print(f"Total questions: {total}")


if __name__ == "__main__":
    pdf_path = "/home/z/my-project/students/cbt/pdfs/english.pdf"
    output_path = "/home/z/my-project/students/cbt/js/english-questions.js"
    
    print("Extracting English questions...")
    questions = extract_english_questions(pdf_path)
    
    print(f"\nYears found: {list(questions.keys())}")
    generate_js_file(questions, output_path)
