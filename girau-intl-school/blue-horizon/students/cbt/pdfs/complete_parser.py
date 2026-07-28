#!/usr/bin/env python3
"""
Complete PDF Question Extractor - Handles all option formats
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

def complete_question_parser(text, subject):
    """Parse questions handling all formats"""
    questions = []
    
    lines = text.split('\n')
    
    current_q = None
    q_text = []
    options = []
    current_year = None
    
    # Year patterns
    year_patterns = [
        r'(\d{4})\s*JAMB\s*[A-Z\s]+QUESTIONS',
        r'Economics\s+(\d{4})',
    ]
    
    for i, line in enumerate(lines):
        orig_line = line
        line = line.strip()
        
        # Skip page markers and headers
        if line.startswith("--- PAGE") or "www.toppers.com.ng" in line:
            continue
        
        # Check for year change
        for pattern in year_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                potential_year = match.group(1)
                # Validate year
                if subject == "economics":
                    if 1983 <= int(potential_year) <= 2004:
                        current_year = potential_year
                else:
                    if 2010 <= int(potential_year) <= 2018:
                        current_year = potential_year
                break
        
        # Skip year headers
        if re.search(r'\d{4}\s*JAMB|Economics\s+\d{4}', line, re.IGNORECASE):
            continue
        
        # Question pattern: number followed by period
        # Formats: "1. Question" or "1.Question"
        q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
        
        # Option patterns - handle multiple formats:
        # 1. A. Option text
        # 2. (a) Option text
        # 3. a) Option text
        # 4. A) Option text
        o_match = re.match(r'^(?:([A-E])\.|[\(]([a-eA-E])[\)]|([a-eA-E])[\)])\s*(.*)$', line)
        
        if q_match and not o_match:
            num = int(q_match.group(1))
            
            # Skip paper type questions
            q_first = q_match.group(2).lower() if q_match.group(2) else ""
            if "paper type" in q_first or "question paper" in q_first:
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
            
        elif o_match:
            # Extract option letter and text
            letter = None
            text_part = None
            
            if o_match.group(1):  # A. format
                letter = o_match.group(1).upper()
                text_part = o_match.group(4)
            elif o_match.group(2):  # (a) format
                letter = o_match.group(2).upper()
                text_part = o_match.group(4)
            elif o_match.group(3):  # a) format
                letter = o_match.group(3).upper()
                text_part = o_match.group(4)
            
            if letter and current_q is not None:
                # Check if option already exists
                existing = next((o for o in options if o['letter'] == letter), None)
                if existing:
                    existing['text'] = text_part.strip() if text_part else ""
                else:
                    options.append({
                        "letter": letter,
                        "text": text_part.strip() if text_part else ""
                    })
        
        elif current_q is not None and line:
            # Continuation text
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
    
    # Parse questions
    questions = complete_question_parser(text, subject)
    
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
        # Convert options to array format
        options_array = ["", "", "", ""]
        for opt in q.get('options', []):
            idx = ord(opt['letter']) - ord('A')
            if 0 <= idx < 4:
                options_array[idx] = opt['text']
        
        # Skip if not enough options
        valid_options = [o for o in options_array if o.strip()]
        if len(valid_options) < 2:
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
    
    # Generate JS content
    js_content = f"""// {subject.upper()} Questions - JAMB Past Questions
// Total: {len(cbt_questions)} questions
// Extracted from PDF with full formatting

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
            print(f"   📷 Copied {img_count} images to CBT")
            
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
    print("📊 EXTRACTION COMPLETE")
    print(f"{'='*60}")
    total = 0
    for subject, questions in all_results.items():
        count = len(questions)
        total += count
        years = sorted(set(q.get('year') for q in questions if q.get('year')))
        print(f"   {subject.upper()}: {count} questions")
        print(f"      Years: {', '.join(years)}")
    print(f"\n   🎯 TOTAL: {total} questions extracted")

if __name__ == "__main__":
    main()
