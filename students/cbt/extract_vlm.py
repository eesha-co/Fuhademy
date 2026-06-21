#!/usr/bin/env python3
"""
CBT Question Extraction - VLM-based
Extracts questions from PDF pages with progress saving
"""

import subprocess
import json
import re
import time
from pathlib import Path

CBT_DIR = Path('/home/z/my-project/students/cbt')
OUTPUT_DIR = CBT_DIR / 'extracted'
OUTPUT_DIR.mkdir(exist_ok=True)

def extract_questions(image_path: str) -> list:
    """Extract questions from a page using VLM"""
    prompt = 'Extract ALL exam questions from this page. Return ONLY a JSON array: [{"year":"2023","question":"exact text","options":["A. opt","B. opt","C. opt","D. opt"],"correctAnswer":0,"hasImage":false}]. No markdown.'
    
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', image_path],
            capture_output=True, text=True, timeout=60
        )
        
        text = result.stdout
        
        # Find JSON in response
        json_start = text.find('{\n  "choices"')
        if json_start == -1:
            json_start = text.find('{"choices"')
        
        if json_start >= 0:
            json_text = text[json_start:]
            data = json.loads(json_text)
            content = data['choices'][0]['message']['content']
            
            # Parse the questions
            questions = json.loads(content)
            return questions if isinstance(questions, list) else []
            
    except subprocess.TimeoutExpired:
        print("Timeout")
    except Exception as e:
        print(f"Error: {e}")
    
    return []

def process_subject(subject: str, start_page: int = 1):
    """Process all pages for a subject"""
    pages_dir = CBT_DIR / 'pdf_pages' / subject
    
    if not pages_dir.exists():
        print(f"Pages directory not found: {pages_dir}")
        return
    
    pages = sorted(pages_dir.glob('*.png'), 
                   key=lambda x: int(re.search(r'(\d+)', x.name).group(1)))
    
    print("=" * 60)
    print(f"Subject: {subject.upper()}")
    print(f"Total pages: {len(pages)}")
    print(f"Starting from: {start_page}")
    print("=" * 60)
    
    output_file = OUTPUT_DIR / f'{subject}_questions.json'
    progress_file = OUTPUT_DIR / f'{subject}_progress.txt'
    
    # Load existing questions
    all_questions = []
    if output_file.exists() and start_page > 1:
        try:
            all_questions = json.loads(output_file.read_text())
        except:
            all_questions = []
    
    for i, page in enumerate(pages, 1):
        if i < start_page:
            continue
        
        print(f"[{i}/{len(pages)}] {page.name}... ", end='', flush=True)
        
        questions = extract_questions(str(page))
        
        if questions:
            # Add IDs and year if missing
            for q in questions:
                q['id'] = len(all_questions) + 1
                if 'year' not in q:
                    q['year'] = 'Unknown'
                if 'correctAnswer' not in q:
                    q['correctAnswer'] = -1
                all_questions.append(q)
            
            print(f"Found {len(questions)} (Total: {len(all_questions)})")
        else:
            print("No questions")
        
        # Save progress
        output_file.write_text(json.dumps(all_questions, indent=2, ensure_ascii=False))
        
        # Save progress marker
        progress_file.write_text(str(i + 1))
        
        # Rate limiting
        time.sleep(0.3)
    
    # Clean up progress file
    if progress_file.exists():
        progress_file.unlink()
    
    print(f"\n✓ Complete: {len(all_questions)} questions")
    print(f"  Saved to: {output_file}")
    
    return len(all_questions)

def generate_js_file(subject: str):
    """Generate JavaScript file from extracted JSON"""
    json_file = OUTPUT_DIR / f'{subject}_questions.json'
    js_file = CBT_DIR / 'js' / f'{subject}-questions.js'
    
    if not json_file.exists():
        print(f"No JSON file for {subject}")
        return
    
    questions = json.loads(json_file.read_text())
    
    def escape(text):
        if not text:
            return ""
        return (str(text)
            .replace('\\', '\\\\')
            .replace('"', '\\"')
            .replace('\n', '\\n')
            .replace('\r', '')
            .replace('\t', '\\t'))
    
    js = f"""// {subject.capitalize()} Questions - Extracted from PDF
// Total: {len(questions)} questions
// Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}

export const {subject}Questions = [
"""
    
    for q in questions:
        opts = ', '.join([f'"{escape(o)}"' for o in q.get('options', [])])
        js += f"""  {{
    id: {q.get('id', 0)},
    year: "{escape(q.get('year', 'Unknown'))}",
    question: "{escape(q.get('question', ''))}",
    options: [{opts}],
    correctAnswer: {q.get('correctAnswer', -1)}
  }},
"""
    
    js += f"""];

export default {subject}Questions;
"""
    
    js_file.write_text(js)
    print(f"Generated: {js_file}")

if __name__ == '__main__':
    import sys
    
    subject = sys.argv[1] if len(sys.argv) > 1 else None
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    
    if subject:
        process_subject(subject, start)
        generate_js_file(subject)
    else:
        total = 0
        for subj in ['physics', 'maths', 'english', 'economics']:
            count = process_subject(subj, 1)
            if count:
                generate_js_file(subj)
                total += count
        print(f"\n{'='*60}")
        print(f"Total questions extracted: {total}")
