#!/usr/bin/env python3
"""
Process VLM output and extract questions
Usage: python3 process_page.py <page_number> <subject>
"""

import subprocess
import json
import re
import sys
from pathlib import Path

CBT_DIR = Path('/home/z/my-project/students/cbt')

def process_page(subject: str, page_num: int):
    """Process a single page"""
    page_file = CBT_DIR / 'pdf_pages' / subject / f'page-{page_num:02d}.png'
    output_file = CBT_DIR / 'extracted' / f'{subject}_questions.json'
    
    if not page_file.exists():
        print(f"Page not found: {page_file}")
        return 0
    
    # Run VLM
    result = subprocess.run(
        ['z-ai', 'vision', '-p', 'Extract ALL exam questions as JSON array. Include year if visible.',
         '-i', str(page_file)],
        capture_output=True, text=True, timeout=90
    )
    
    text = result.stdout
    
    # Parse response
    start = text.find('"choices"')
    if start < 0:
        print(f"No VLM response")
        return 0
    
    brace_start = text.rfind('{', 0, start)
    json_text = text[brace_start:]
    
    try:
        data = json.loads(json_text)
        content = data['choices'][0]['message']['content']
        
        # Clean markdown
        content = re.sub(r'```json\s*', '', content)
        content = re.sub(r'```\s*$', '', content)
        content = content.strip()
        
        questions = json.loads(content)
        
        if not isinstance(questions, list):
            print(f"Invalid response format")
            return 0
        
        # Load existing questions
        if output_file.exists():
            existing = json.loads(output_file.read_text())
        else:
            existing = []
        
        # Add new questions
        for q in questions:
            q['id'] = len(existing) + 1
            if 'year' not in q:
                q['year'] = 'Unknown'
            if 'correctAnswer' not in q:
                q['correctAnswer'] = -1
            existing.append(q)
        
        # Save
        output_file.write_text(json.dumps(existing, indent=2, ensure_ascii=False))
        
        print(f"Page {page_num}: +{len(questions)} questions (Total: {len(existing)})")
        return len(questions)
        
    except Exception as e:
        print(f"Error: {e}")
        return 0

if __name__ == '__main__':
    subject = sys.argv[1] if len(sys.argv) > 1 else 'physics'
    page = int(sys.argv[2]) if len(sys.argv) > 2 else 1
    process_page(subject, page)
