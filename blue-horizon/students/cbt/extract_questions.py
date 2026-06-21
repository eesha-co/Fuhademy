#!/usr/bin/env python3
"""
CBT Question Extraction Script
Extracts questions from PDF files with proper formatting and image associations
"""

import pdfplumber
import json
import re
import os
from pathlib import Path

CBT_DIR = Path('/home/z/my-project/students/cbt')
PDF_DIR = CBT_DIR / 'pdfs'
JS_DIR = CBT_DIR / 'js'
IMAGES_DIR = CBT_DIR / 'images'

def extract_text_with_layout(pdf_path):
    """Extract text from PDF with layout preservation"""
    questions = []
    
    with pdfplumber.open(pdf_path) as pdf:
        current_year = "Unknown"
        
        for page_num, page in enumerate(pdf.pages, 1):
            text = page.extract_text()
            if not text:
                continue
            
            # Check for year markers
            year_match = re.search(r'(20\d{2})\s*(JAMB|WAEC|NECO|UTME)', text, re.IGNORECASE)
            if year_match:
                current_year = year_match.group(1)
            
            # Extract questions from page
            page_questions = parse_questions_from_text(text, current_year, page_num)
            questions.extend(page_questions)
    
    return questions

def parse_questions_from_text(text, year, page_num):
    """Parse questions from extracted text"""
    questions = []
    
    # Split by question numbers
    # Pattern 1: "1." or "1)" or "1:"
    # Pattern 2: Question followed by options
    
    lines = text.split('\n')
    current_question = None
    current_options = []
    current_text = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check for question number
        q_match = re.match(r'^(\d+)[.)\]:]\s*(.+)', line)
        
        if q_match:
            # Save previous question if exists
            if current_question and current_options:
                questions.append({
                    'year': year,
                    'question': current_question,
                    'options': current_options,
                    'correctAnswer': -1,
                    'page': page_num
                })
            
            # Start new question
            current_question = q_match.group(2)
            current_options = []
            current_text = [q_match.group(2)]
        
        # Check for options
        elif current_question:
            opt_match = re.match(r'^([A-D])[.)\]:]\s*(.+)', line, re.IGNORECASE)
            if opt_match:
                current_options.append(opt_match.group(2))
            else:
                # Append to question text
                current_question += ' ' + line
    
    # Save last question
    if current_question and current_options:
        questions.append({
            'year': year,
            'question': current_question,
            'options': current_options,
            'correctAnswer': -1,
            'page': page_num
        })
    
    return questions

def process_subject(subject):
    """Process a single subject PDF"""
    pdf_path = PDF_DIR / f'{subject}.pdf'
    
    if not pdf_path.exists():
        print(f"PDF not found: {pdf_path}")
        return []
    
    print(f"\nProcessing {subject}...")
    
    questions = extract_text_with_layout(pdf_path)
    
    # Assign IDs
    for i, q in enumerate(questions, 1):
        q['id'] = i
    
    print(f"  Extracted {len(questions)} questions")
    
    return questions

def generate_js_file(questions, subject):
    """Generate JavaScript question file"""
    js_path = JS_DIR / f'{subject}-questions.js'
    
    js_content = f"""// {subject.capitalize()} Questions - Extracted from PDF
// Total: {len(questions)} questions
// Generated: {__import__('datetime').datetime.now().isoformat()}

export const {subject}Questions = [
"""
    
    for q in questions:
        options_str = ', '.join([f'"{escape_js(o)}"' for o in q['options']])
        js_content += f"""  {{
    id: {q['id']},
    year: "{escape_js(q['year'])}",
    question: "{escape_js(q['question'])}",
    options: [{options_str}],
    correctAnswer: {q['correctAnswer']}
  }},
"""
    
    js_content += """];

export default {subject}Questions;
""".replace('{subject}', subject)
    
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"  Generated: {js_path}")
    
    # Also save JSON backup
    json_path = PDF_DIR / f'{subject}-extracted.json'
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(questions, f, indent=2, ensure_ascii=False)
    
    print(f"  JSON backup: {json_path}")

def escape_js(text):
    """Escape text for JavaScript string"""
    if not text:
        return ""
    return (text
        .replace('\\', '\\\\')
        .replace('"', '\\"')
        .replace('\n', '\\n')
        .replace('\r', '')
        .replace('\t', '\\t'))

def main():
    print("CBT Question Extraction")
    print("=" * 50)
    
    subjects = ['physics', 'maths', 'english', 'economics']
    
    total = 0
    for subject in subjects:
        questions = process_subject(subject)
        if questions:
            generate_js_file(questions, subject)
            total += len(questions)
    
    print("\n" + "=" * 50)
    print(f"Total questions extracted: {total}")

if __name__ == '__main__':
    main()
