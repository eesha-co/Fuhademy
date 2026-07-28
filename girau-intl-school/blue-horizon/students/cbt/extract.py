#!/usr/bin/env python3
"""
CBT Question Extraction Script
Extracts questions from PDF pages using VLM with proper error handling
"""

import subprocess
import json
import re
import time
from pathlib import Path

CBT_DIR = Path('/home/z/my-project/students/cbt')
OUTPUT_DIR = CBT_DIR / 'extracted'
OUTPUT_DIR.mkdir(exist_ok=True)

def extract_page(image_path: str) -> list:
    """Extract questions from a single page"""
    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', 
             'Extract ALL exam questions from this page. Return ONLY JSON array: [{"question":"text","options":["A","B","C","D"]}]. No markdown code blocks.',
             '-i', image_path],
            capture_output=True, text=True, timeout=90
        )
        
        text = result.stdout
        
        # Find JSON response
        match = re.search(r'\{[\s\S]*"choices"[\s\S]*\}', text)
        if not match:
            return []
        
        data = json.loads(match.group(0))
        content = data['choices'][0]['message']['content']
        
        # Remove markdown code blocks
        content = re.sub(r'```json\s*', '', content)
        content = re.sub(r'```\s*$', '', content)
        content = content.strip()
        
        questions = json.loads(content)
        return questions if isinstance(questions, list) else []
        
    except subprocess.TimeoutExpired:
        return []
    except Exception as e:
        print(f"Error: {e}")
        return []

def process_all_pages(subject: str, start: int = 1, end: int = None):
    """Process pages for a subject"""
    pages_dir = CBT_DIR / 'pdf_pages' / subject
    
    if not pages_dir.exists():
        print(f"No pages directory for {subject}")
        return
    
    pages = sorted(pages_dir.glob('*.png'),
                   key=lambda x: int(re.search(r'(\d+)', x.name).group(1)))
    
    if end:
        pages = pages[:end]
    
    print("=" * 60)
    print(f"Processing {subject.upper()}: pages {start}-{len(pages)}")
    print("=" * 60)
    
    # Load existing
    output_file = OUTPUT_DIR / f'{subject}_questions.json'
    all_questions = []
    if output_file.exists():
        try:
            all_questions = json.loads(output_file.read_text())
        except:
            pass
    
    # Process each page
    for i, page in enumerate(pages, 1):
        if i < start:
            continue
        
        print(f"[{i}/{len(pages)}] {page.name}... ", end='', flush=True)
        
        questions = extract_page(str(page))
        
        if questions:
            for q in questions:
                q['id'] = len(all_questions) + 1
                if 'year' not in q:
                    q['year'] = 'Unknown'
                if 'correctAnswer' not in q:
                    q['correctAnswer'] = -1
                all_questions.append(q)
            
            print(f"+{len(questions)} (Total: {len(all_questions)})")
        else:
            print("No questions")
        
        # Save after each page
        output_file.write_text(json.dumps(all_questions, indent=2, ensure_ascii=False))
        
        # Rate limiting
        time.sleep(0.5)
    
    print(f"\n✓ {subject}: {len(all_questions)} total questions")
    return len(all_questions)

def generate_js(subject: str):
    """Generate JS file from JSON"""
    json_file = OUTPUT_DIR / f'{subject}_questions.json'
    js_file = CBT_DIR / 'js' / f'{subject}-questions.js'
    
    if not json_file.exists():
        print(f"No JSON for {subject}")
        return
    
    questions = json.loads(json_file.read_text())
    
    def esc(s):
        if not s: return ""
        return str(s).replace('\\','\\\\').replace('"','\\"').replace('\n','\\n').replace('\r','')
    
    js = f"""// {subject.capitalize()} Questions
// Total: {len(questions)}
// Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}

export const {subject}Questions = [
"""
    for q in questions:
        opts = ', '.join([f'"{esc(o)}"' for o in q.get('options', [])])
        js += f"""  {{
    id: {q.get('id', 0)},
    year: "{esc(q.get('year', 'Unknown'))}",
    question: "{esc(q.get('question', ''))}",
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
    subject = sys.argv[1] if len(sys.argv) > 1 else 'physics'
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    end = int(sys.argv[3]) if len(sys.argv) > 3 else None
    
    process_all_pages(subject, start, end)
    generate_js(subject)
