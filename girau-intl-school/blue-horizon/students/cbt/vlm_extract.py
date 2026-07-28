#!/usr/bin/env python3
"""
CBT Question Extraction using VLM API
Processes pages one at a time with progress saving
"""

import subprocess
import json
import os
import re
import time
from pathlib import Path

CBT_DIR = Path('/home/z/my-project/students/cbt')
OUTPUT_DIR = CBT_DIR / 'extracted'
OUTPUT_DIR.mkdir(exist_ok=True)

def extract_with_vlm(image_path: str, subject: str) -> list:
    """Extract questions from a page image using VLM CLI"""
    prompt = f"""Extract ALL exam questions from this {subject} exam page.
Return ONLY a JSON array (no markdown, no explanation):
[{{"year":"2023","question":"exact text with all symbols and units","options":["A. option","B. option","C. option","D. option"],"correctAnswer":0,"hasImage":false}}]
If no questions found, return: []"""

    try:
        result = subprocess.run(
            ['z-ai', 'vision', '-p', prompt, '-i', image_path],
            capture_output=True, text=True, timeout=120
        )
        
        output = result.stdout
        
        # Extract content field
        match = re.search(r'"content":\s*"([^"]+)"', output)
        if not match:
            return []
        
        content = match.group(1)
        # Decode unicode escapes
        content = content.encode().decode('unicode_escape')
        # Fix escaped quotes
        content = content.replace('\\"', '"')
        
        # Parse JSON
        try:
            questions = json.loads(content)
            if isinstance(questions, list):
                return questions
        except json.JSONDecodeError:
            return []
            
    except subprocess.TimeoutExpired:
        print("Timeout")
        return []
    except Exception as e:
        print(f"Error: {e}")
        return []
    
    return []

def process_subject(subject: str):
    """Process all pages for a subject"""
    pages_dir = CBT_DIR / 'pdf_pages' / subject
    
    if not pages_dir.exists():
        print(f"Pages directory not found: {pages_dir}")
        return
    
    # Get sorted pages
    pages = sorted(pages_dir.glob('*.png'), key=lambda x: int(re.search(r'(\d+)', x.name).group(1)))
    
    print("=" * 60)
    print(f"Subject: {subject.upper()}")
    print(f"Total pages: {len(pages)}")
    print("=" * 60)
    
    # Progress tracking
    progress_file = OUTPUT_DIR / f'{subject}_progress.txt'
    questions_file = OUTPUT_DIR / f'{subject}_questions.json'
    
    start_idx = 0
    if progress_file.exists():
        start_idx = int(progress_file.read_text().strip())
        print(f"Resuming from page {start_idx + 1}")
    
    all_questions = []
    if start_idx > 0 and questions_file.exists():
        try:
            all_questions = json.loads(questions_file.read_text())
        except:
            all_questions = []
    
    for i, page in enumerate(pages):
        if i < start_idx:
            continue
            
        print(f"[{i+1}/{len(pages)}] {page.name}... ", end='', flush=True)
        
        questions = extract_with_vlm(str(page), subject)
        
        if questions:
            # Assign IDs
            for q in questions:
                q['id'] = len(all_questions) + 1
                all_questions.append(q)
            print(f"Found {len(questions)} (Total: {len(all_questions)})")
        else:
            print("No questions")
        
        # Save progress
        questions_file.write_text(json.dumps(all_questions, indent=2, ensure_ascii=False))
        progress_file.write_text(str(i + 1))
        
        # Rate limit delay
        time.sleep(0.3)
    
    # Clean up progress file
    if progress_file.exists():
        progress_file.unlink()
    
    print()
    print(f"✓ Complete: {len(all_questions)} questions")
    print(f"  Saved to: {questions_file}")

def generate_js_files():
    """Generate JavaScript files from extracted JSON"""
    for subject in ['physics', 'maths', 'english', 'economics']:
        json_file = OUTPUT_DIR / f'{subject}_questions.json'
        js_file = CBT_DIR / 'js' / f'{subject}-questions.js'
        
        if not json_file.exists():
            continue
        
        questions = json.loads(json_file.read_text())
        
        js_content = f"""// {subject.capitalize()} Questions - Extracted from PDF
// Total: {len(questions)} questions
// Generated: {time.strftime('%Y-%m-%d %H:%M:%S')}

export const {subject}Questions = [
"""
        
        for q in questions:
            options_str = ', '.join([f'"{escape_js(o)}"' for o in q.get('options', [])])
            js_content += f"""  {{
    id: {q.get('id', 0)},
    year: "{escape_js(q.get('year', 'Unknown'))}",
    question: "{escape_js(q.get('question', ''))}",
    options: [{options_str}],
    correctAnswer: {q.get('correctAnswer', -1)}
  }},
"""
        
        js_content += f"""];

export default {subject}Questions;
"""
        
        js_file.write_text(js_content)
        print(f"Generated: {js_file}")

def escape_js(text: str) -> str:
    """Escape text for JavaScript string"""
    if not text:
        return ""
    return (text
        .replace('\\', '\\\\')
        .replace('"', '\\"')
        .replace('\n', '\\n')
        .replace('\r', '')
        .replace('\t', '\\t'))

if __name__ == '__main__':
    import sys
    
    subject = sys.argv[1] if len(sys.argv) > 1 else None
    
    if subject:
        process_subject(subject)
    else:
        for subj in ['physics', 'maths', 'english', 'economics']:
            process_subject(subj)
    
    print()
    print("Generating JavaScript files...")
    generate_js_files()
