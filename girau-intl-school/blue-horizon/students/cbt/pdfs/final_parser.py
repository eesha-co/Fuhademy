#!/usr/bin/env python3
"""
Final PDF Question Extractor - Correct year detection
"""

import fitz  # pymupdf
import json
import re
import os
from pathlib import Path
from collections import defaultdict
import shutil

BASE_DIR = Path("/home/z/my-project/students/cbt/pdfs")
IMAGES_DIR = BASE_DIR / "images"
OUTPUT_DIR = Path("/home/z/my-project/students/cbt/js")
CBT_IMAGES_DIR = Path("/home/z/my-project/students/cbt/images")

CBT_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

# Year detection patterns by subject
YEAR_PATTERNS = {
    "english": [
        r'(\d{4})\s*JAMB\s*USE\s*OF\s*ENGLISH\s*QUESTIONS',
        r'JAMB.*?(\d{4})',
    ],
    "maths": [
        r'(\d{4})\s*JAMB\s*MATHEMATICS\s*QUESTIONS',
        r'JAMB.*?(\d{4})',
    ],
    "physics": [
        r'(\d{4})\s*JAMB\s*PHYSICS\s*QUESTIONS',
        r'JAMB.*?(\d{4})',
    ],
    "economics": [
        r'Economics\s+(\d{4})',
    ]
}

def extract_images_from_pdf(pdf_path, subject):
    """Extract all images from PDF with positions"""
    doc = fitz.open(pdf_path)
    page_images = {}
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = []
        
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Get position on page
            rects = page.get_image_rects(xref)
            for rect_idx, rect in enumerate(rects):
                img_filename = f"{subject}_p{page_num+1}_i{img_index+1}.{image_ext}"
                img_path = IMAGES_DIR / subject / img_filename
                
                (IMAGES_DIR / subject).mkdir(parents=True, exist_ok=True)
                with open(img_path, "wb") as f:
                    f.write(image_bytes)
                
                images.append({
                    "filename": img_filename,
                    "y_pos": rect.y0,
                    "path": str(img_path)
                })
        
        page_images[page_num] = sorted(images, key=lambda x: x["y_pos"])
    
    doc.close()
    return page_images

def extract_text_from_pdf(pdf_path):
    """Extract all text from PDF"""
    doc = fitz.open(pdf_path)
    all_text = ""
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        all_text += f"\n--- PAGE {page_num + 1} ---\n"
        all_text += page.get_text("text")
    
    doc.close()
    return all_text

def find_year_changes(text, subject):
    """Find all year changes in the text"""
    patterns = YEAR_PATTERNS.get(subject, [])
    year_positions = []
    
    for pattern in patterns:
        for match in re.finditer(pattern, text, re.IGNORECASE):
            year = match.group(1)
            # Validate year range
            if subject == "economics":
                if 1983 <= int(year) <= 2004:
                    year_positions.append((match.start(), year))
            else:
                if 2010 <= int(year) <= 2018:
                    year_positions.append((match.start(), year))
    
    # Sort by position
    year_positions.sort(key=lambda x: x[0])
    return year_positions

def get_year_for_position(pos, year_positions):
    """Get the year for a given position in text"""
    current_year = None
    for year_pos, year in year_positions:
        if year_pos <= pos:
            current_year = year
        else:
            break
    return current_year

def parse_questions_from_text(text, year_positions):
    """Parse all questions with their years"""
    questions = []
    
    # Find all question patterns
    # Pattern: number followed by period, then question text
    question_pattern = r'(\d+)\.\s*((?:(?![A-E]\.)(?!\n\d+\.)[^\n])+)'  # Match question text until option A
    
    # Find all matches with positions
    for match in re.finditer(r'(\d+)\.\s*', text):
        q_num = int(match.group(1))
        q_start = match.start()
        
        # Get year
        year = get_year_for_position(q_start, year_positions)
        
        # Extract question text - from start to next question or option A
        q_start_pos = match.end()
        
        # Find next question number or end
        next_q = re.search(r'\n\d+\.\s', text[q_start_pos:])
        next_opt_a = re.search(r'\nA\.\s', text[q_start_pos:])
        
        if next_q and next_opt_a:
            # Question ends at whichever comes first
            end_pos = min(next_q.start(), next_opt_a.start())
        elif next_q:
            end_pos = next_q.start()
        elif next_opt_a:
            end_pos = next_opt_a.start()
        else:
            end_pos = len(text) - q_start_pos
        
        q_text = text[q_start_pos:q_start_pos + end_pos].strip()
        
        # Extract options
        options = []
        remaining_text = text[q_start_pos + end_pos:]
        
        for letter in ['A', 'B', 'C', 'D', 'E']:
            # Find option pattern
            opt_pattern = rf'\n{letter}\.\s*([^\n]+)'
            opt_match = re.search(opt_pattern, remaining_text[:500])  # Look in next 500 chars
            if opt_match:
                options.append({
                    "letter": letter,
                    "text": opt_match.group(1).strip()
                })
        
        # Only add if we have at least 2 valid options
        if len(options) >= 2:
            questions.append({
                "number": q_num,
                "question": q_text,
                "options": options,
                "year": year
            })
    
    return questions

def improved_question_parser(text, year_positions):
    """More robust question parser"""
    questions = []
    
    lines = text.split('\n')
    
    current_q = None
    q_text = []
    options = []
    current_year = None
    
    for i, line in enumerate(lines):
        line = line.strip()
        
        # Check for page marker
        if line.startswith("--- PAGE"):
            continue
        
        # Check for year change
        for pattern in [r'(\d{4})\s*JAMB', r'Economics\s+(\d{4})']:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                current_year = match.group(1)
                break
        
        # Check for question number
        q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
        
        # Check for option
        o_match = re.match(r'^([A-E])\.\s*(.*)$', line)
        
        if q_match and not o_match:  # It's a question, not an option like "A. Type A"
            num = int(q_match.group(1))
            
            # Skip paper type questions
            if "Paper Type" in line or "Question Paper Type" in line:
                continue
            
            # Save previous question
            if current_q is not None and len(options) >= 2:
                questions.append({
                    "number": current_q,
                    "question": ' '.join(q_text).strip(),
                    "options": options,
                    "year": current_year
                })
            
            # Start new question
            current_q = num
            q_text = [q_match.group(2)] if q_match.group(2) else []
            options = []
            
        elif o_match and current_q is not None:
            # Add option
            opt_letter = o_match.group(1)
            opt_text = o_match.group(2)
            
            # Check if this option already exists (update it)
            existing = next((o for o in options if o['letter'] == opt_letter), None)
            if existing:
                existing['text'] = opt_text
            else:
                options.append({
                    "letter": opt_letter,
                    "text": opt_text
                })
        
        elif current_q is not None and line:
            # Continuation
            if options:
                # Append to last option
                options[-1]['text'] += ' ' + line
            else:
                # Append to question text
                q_text.append(line)
    
    # Save last question
    if current_q is not None and len(options) >= 2:
        questions.append({
            "number": current_q,
            "question": ' '.join(q_text).strip(),
            "options": options,
            "year": current_year
        })
    
    return questions

def process_pdf(pdf_name, subject):
    """Process PDF and extract all questions"""
    pdf_path = BASE_DIR / pdf_name
    
    if not pdf_path.exists():
        print(f"❌ PDF not found: {pdf_path}")
        return []
    
    print(f"\n📖 Processing {pdf_name}...")
    
    # Extract images
    page_images = extract_images_from_pdf(pdf_path, subject)
    total_images = sum(len(imgs) for imgs in page_images.values())
    print(f"   📷 {total_images} images extracted")
    
    # Extract text
    text = extract_text_from_pdf(pdf_path)
    
    # Find year positions
    year_positions = find_year_changes(text, subject)
    print(f"   📅 Found {len(year_positions)} year sections")
    
    # Parse questions
    questions = improved_question_parser(text, year_positions)
    
    # Count by year
    year_count = defaultdict(int)
    for q in questions:
        if q.get('year'):
            year_count[q['year']] += 1
    
    print(f"   ✅ Total questions: {len(questions)}")
    for year in sorted(year_count.keys()):
        print(f"      {year}: {year_count[year]} questions")
    
    return questions, page_images

def copy_images_to_cbt(subject):
    """Copy images to CBT folder"""
    src_dir = IMAGES_DIR / subject
    dst_dir = CBT_IMAGES_DIR / subject
    
    if src_dir.exists():
        dst_dir.mkdir(parents=True, exist_ok=True)
        count = 0
        for img_file in src_dir.iterdir():
            if img_file.is_file():
                shutil.copy2(img_file, dst_dir / img_file.name)
                count += 1
        return count
    return 0

def generate_js(subject, questions):
    """Generate JavaScript file"""
    cbt_questions = []
    
    for i, q in enumerate(questions):
        # Convert options to array
        options_array = ["", "", "", ""]
        for opt in q.get('options', []):
            idx = ord(opt['letter']) - ord('A')
            if 0 <= idx < 4:
                options_array[idx] = opt['text']
        
        # Skip if not enough options
        if len([o for o in options_array if o.strip()]) < 2:
            continue
        
        cbt_q = {
            "id": f"{subject[:3]}_{i+1}",
            "question": q['question'],
            "options": options_array,
            "correctAnswer": 0,
            "year": q.get('year'),
            "subject": subject,
            "images": []
        }
        cbt_questions.append(cbt_q)
    
    js_content = f"""// {subject.upper()} Questions - JAMB Past Questions
// Total: {len(cbt_questions)} questions
// Source: PDF extraction

const {subject}Questions = {json.dumps(cbt_questions, indent=2, ensure_ascii=False)};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {subject}Questions;
}}
"""
    
    return js_content, cbt_questions

def main():
    pdfs = [
        ("english.pdf", "english"),
        ("maths.pdf", "maths"),
        ("physics.pdf", "physics"),
        ("economics.pdf", "economics")
    ]
    
    all_results = {}
    
    for pdf_name, subject in pdfs:
        try:
            questions, images = process_pdf(pdf_name, subject)
            all_results[subject] = questions
            
            # Copy images
            img_count = copy_images_to_cbt(subject)
            print(f"   📷 Copied {img_count} images")
            
            # Generate JS
            js_content, cbt_qs = generate_js(subject, questions)
            
            output_path = OUTPUT_DIR / f"{subject}-questions-new.js"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            
            print(f"   📄 Saved: {output_path.name}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 FINAL SUMMARY")
    print(f"{'='*60}")
    total = 0
    for subject, questions in all_results.items():
        count = len(questions)
        total += count
        years = len(set(q.get('year') for q in questions if q.get('year')))
        print(f"   {subject.upper()}: {count} questions ({years} years)")
    print(f"\n   🎯 TOTAL: {total} questions")

if __name__ == "__main__":
    main()
