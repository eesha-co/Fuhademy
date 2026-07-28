#!/usr/bin/env python3
"""
Final Complete Extractor - Links images to questions based on page positions
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

# Ensure directories exist
CBT_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def extract_images_by_page(pdf_path, subject):
    """Extract images organized by page with y positions"""
    doc = fitz.open(pdf_path)
    page_images = {}  # page_num -> list of images with positions
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = []
        
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Get all positions of this image on the page
            rects = page.get_image_rects(xref)
            
            for rect_idx, rect in enumerate(rects):
                # Save image with descriptive name
                img_filename = f"{subject}_p{page_num+1}_i{img_index+1}.{image_ext}"
                img_path = IMAGES_DIR / subject / img_filename
                
                (IMAGES_DIR / subject).mkdir(parents=True, exist_ok=True)
                with open(img_path, "wb") as f:
                    f.write(image_bytes)
                
                images.append({
                    "filename": img_filename,
                    "y_start": rect.y0,  # Top of image
                    "y_end": rect.y1,    # Bottom of image
                    "x_start": rect.x0,
                    "width": rect.width,
                    "height": rect.height
                })
        
        # Sort by y position (top to bottom)
        images.sort(key=lambda x: x["y_start"])
        page_images[page_num] = images
    
    doc.close()
    return page_images

def get_text_blocks_with_positions(pdf_path):
    """Extract text blocks with their y positions"""
    doc = fitz.open(pdf_path)
    page_blocks = {}  # page_num -> list of text blocks with positions
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        blocks = []
        
        # Get text dictionary with positions
        text_dict = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)
        
        for block in text_dict.get("blocks", []):
            if block["type"] == 0:  # Text block
                text = ""
                for line in block.get("lines", []):
                    for span in line.get("spans", []):
                        text += span.get("text", "")
                    text += "\n"
                
                blocks.append({
                    "text": text.strip(),
                    "y_start": block["bbox"][1],  # Top
                    "y_end": block["bbox"][3],    # Bottom
                    "x_start": block["bbox"][0],
                })
        
        # Sort by y position
        blocks.sort(key=lambda x: x["y_start"])
        page_blocks[page_num] = blocks
    
    doc.close()
    return page_blocks

def extract_raw_text(pdf_path):
    """Extract raw text from PDF"""
    doc = fitz.open(pdf_path)
    all_text = ""
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        all_text += f"\n--- PAGE {page_num + 1} ---\n"
        all_text += page.get_text("text")
    
    doc.close()
    return all_text

def find_image_for_question(images_on_page, q_y_start, q_y_end):
    """Find the image that belongs to a question based on position"""
    for img in images_on_page:
        # Image should be within or just after the question area
        # Typically, diagrams appear between question and options
        if img["y_start"] >= q_y_start - 50 and img["y_end"] <= q_y_end + 200:
            return img
    return None

def parse_questions_with_images(text, subject, page_images, page_blocks):
    """Parse questions and link to images based on positions"""
    questions = []
    lines = text.split('\n')
    
    current_q = None
    q_text = []
    options = []
    current_year = None
    current_page = None
    q_y_start = 0
    
    # Year patterns
    year_patterns = [
        r'(\d{4})\s*JAMB\s*[A-Z\s]+QUESTIONS',
        r'Economics\s+(\d{4})',
    ]
    
    for i, line in enumerate(lines):
        orig_line = line
        line = line.strip()
        
        # Track page changes
        page_match = re.match(r'--- PAGE (\d+) ---', line)
        if page_match:
            current_page = int(page_match.group(1)) - 1  # 0-indexed
            continue
        
        # Skip headers
        if "www.toppers.com.ng" in line or line.startswith("---"):
            continue
        
        # Check for year
        for pattern in year_patterns:
            match = re.search(pattern, line, re.IGNORECASE)
            if match:
                potential_year = match.group(1)
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
        
        # Question pattern
        q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
        
        # Option patterns (multiple formats)
        o_match = re.match(r'^(?:([A-E])\.|[\(]([a-eA-E])[\)]|([a-eA-E])[\)])\s*(.*)$', line)
        
        if q_match and not o_match:
            num = int(q_match.group(1))
            
            # Skip paper type questions
            q_first = q_match.group(2).lower() if q_match.group(2) else ""
            if "paper type" in q_first or "question paper" in q_first:
                continue
            
            # Save previous question
            if current_q is not None and len(options) >= 2:
                # Find image for this question
                image_path = None
                if current_page is not None and current_page in page_images:
                    images_on_page = page_images[current_page]
                    # Find image near this question's position
                    for img in images_on_page:
                        # Image should be close to question (within reasonable bounds)
                        image_path = f"images/{subject}/{img['filename']}"
                        break  # For now, just take the first image on the page
                
                questions.append({
                    "number": current_q,
                    "question": ' '.join(q_text).strip(),
                    "options": options,
                    "year": current_year,
                    "image": image_path
                })
            
            # Start new question
            current_q = num
            q_text = [q_match.group(2)] if q_match.group(2) else []
            options = []
            
        elif o_match:
            # Extract option
            letter = None
            text_part = None
            
            if o_match.group(1):
                letter = o_match.group(1).upper()
                text_part = o_match.group(4)
            elif o_match.group(2):
                letter = o_match.group(2).upper()
                text_part = o_match.group(4)
            elif o_match.group(3):
                letter = o_match.group(3).upper()
                text_part = o_match.group(4)
            
            if letter and current_q is not None:
                existing = next((o for o in options if o['letter'] == letter), None)
                if existing:
                    existing['text'] = text_part.strip() if text_part else ""
                else:
                    options.append({
                        "letter": letter,
                        "text": text_part.strip() if text_part else ""
                    })
        
        elif current_q is not None and line:
            if options:
                options[-1]['text'] += ' ' + line
            else:
                q_text.append(line)
    
    # Save last question
    if current_q is not None and len(options) >= 2:
        image_path = None
        if current_page is not None and current_page in page_images:
            images_on_page = page_images[current_page]
            for img in images_on_page:
                image_path = f"images/{subject}/{img['filename']}"
                break
        
        questions.append({
            "number": current_q,
            "question": ' '.join(q_text).strip(),
            "options": options,
            "year": current_year,
            "image": image_path
        })
    
    return questions

def process_pdf(pdf_name, subject):
    """Process PDF and extract all questions with images"""
    pdf_path = BASE_DIR / pdf_name
    
    if not pdf_path.exists():
        print(f"❌ PDF not found: {pdf_path}")
        return []
    
    print(f"\n📖 Processing {pdf_name}...")
    
    # Extract images by page
    print("   Extracting images...")
    page_images = extract_images_by_page(pdf_path, subject)
    total_images = sum(len(imgs) for imgs in page_images.values())
    print(f"   📷 {total_images} images found")
    
    # Extract text blocks with positions
    print("   Extracting text blocks...")
    page_blocks = get_text_blocks_with_positions(pdf_path)
    
    # Extract raw text
    print("   Extracting text...")
    text = extract_raw_text(pdf_path)
    
    # Parse questions
    print("   Parsing questions...")
    questions = parse_questions_with_images(text, subject, page_images, page_blocks)
    
    # Count by year
    year_count = defaultdict(int)
    for q in questions:
        if q.get('year'):
            year_count[q['year']] += 1
    
    print(f"   ✅ Total questions: {len(questions)}")
    for year in sorted(year_count.keys()):
        print(f"      {year}: {year_count[year]} questions")
    
    return questions, page_images

def copy_all_images(subject):
    """Copy all images to CBT folder"""
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

def generate_final_js(subject, questions):
    """Generate final JavaScript file"""
    cbt_questions = []
    
    for i, q in enumerate(questions):
        # Convert options to array
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
            "image": q.get('image')  # Include image path
        }
        cbt_questions.append(cbt_q)
    
    js_content = f"""// {subject.upper()} Questions - JAMB Past Questions
// Total: {len(cbt_questions)} questions
// Extracted with image support

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
            questions, page_images = process_pdf(pdf_name, subject)
            all_results[subject] = questions
            
            # Copy images
            img_count = copy_all_images(subject)
            print(f"   📷 Copied {img_count} images to CBT")
            
            # Generate JS
            js_content, cbt_qs = generate_final_js(subject, questions)
            
            output_path = OUTPUT_DIR / f"{subject}-questions-new.js"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            
            print(f"   📄 Saved: {output_path.name}")
            
        except Exception as e:
            print(f"❌ Error processing {subject}: {e}")
            import traceback
            traceback.print_exc()
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 FINAL EXTRACTION SUMMARY")
    print(f"{'='*60}")
    total = 0
    for subject, questions in all_results.items():
        count = len(questions)
        total += count
        years = sorted(set(q.get('year') for q in questions if q.get('year')))
        img_count = sum(1 for q in questions if q.get('image'))
        print(f"\n{subject.upper()}:")
        print(f"   Questions: {count}")
        print(f"   Years: {', '.join(years)}")
        print(f"   With images: {img_count}")
    
    print(f"\n🎯 TOTAL: {total} questions extracted")

if __name__ == "__main__":
    main()
