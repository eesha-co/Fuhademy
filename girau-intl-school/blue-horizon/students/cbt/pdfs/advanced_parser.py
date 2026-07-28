#!/usr/bin/env python3
"""
Advanced PDF Question Extractor with Image Support
Uses pymupdf for better structure extraction
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

# Ensure CBT images directory exists
CBT_IMAGES_DIR.mkdir(parents=True, exist_ok=True)

def extract_all_with_structure(pdf_path, subject):
    """Extract all content with proper structure"""
    doc = fitz.open(pdf_path)
    
    all_pages = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Get text with position info
        text_dict = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)
        
        # Extract images with positions
        images = []
        for img_index, img in enumerate(page.get_images(full=True)):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Get position
            img_rects = page.get_image_rects(xref)
            for rect_idx, rect in enumerate(img_rects):
                # Save image with unique name
                img_filename = f"{subject}_p{page_num+1}_i{img_index+1}_{rect_idx}.{image_ext}"
                img_path = IMAGES_DIR / subject / img_filename
                
                (IMAGES_DIR / subject).mkdir(parents=True, exist_ok=True)
                with open(img_path, "wb") as f:
                    f.write(image_bytes)
                
                images.append({
                    "filename": img_filename,
                    "path": str(img_path),
                    "y_pos": rect.y0,  # Top position for ordering
                    "x_pos": rect.x0,
                    "width": rect.width,
                    "height": rect.height
                })
        
        # Sort images by position (top to bottom, left to right)
        images.sort(key=lambda x: (x["y_pos"], x["x_pos"]))
        
        # Get raw text
        raw_text = page.get_text("text")
        
        page_data = {
            "page_number": page_num + 1,
            "text": raw_text,
            "blocks": text_dict["blocks"],
            "images": images
        }
        
        all_pages.append(page_data)
    
    doc.close()
    return all_pages

def parse_questions_v2(text, images, subject, page_num):
    """Parse questions preserving full text"""
    questions = []
    
    # Clean text
    text = text.replace('\r\n', '\n').replace('\r', '\n')
    lines = text.split('\n')
    
    # State tracking
    current_q = None
    q_text_parts = []
    options = []
    last_option_letter = None
    
    # Process line by line
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        # Question pattern: number followed by period
        q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
        
        # Option pattern: letter followed by period
        o_match = re.match(r'^([A-E])\.\s*(.*)$', line)
        
        if q_match:
            # Save previous question
            if current_q is not None:
                full_q_text = ' '.join(q_text_parts).strip()
                if full_q_text and len([o for o in options if o['text']]) >= 2:
                    # Find images that might belong to this question
                    q_images = find_question_images(images, len(questions))
                    questions.append({
                        "number": current_q,
                        "question": full_q_text,
                        "options": options,
                        "images": q_images,
                        "page": page_num
                    })
            
            # Start new question
            current_q = int(q_match.group(1))
            q_text_parts = [q_match.group(2)] if q_match.group(2) else []
            options = []
            last_option_letter = None
            
        elif o_match and current_q is not None:
            # Add option
            opt_letter = o_match.group(1)
            opt_text = o_match.group(2)
            options.append({
                "letter": opt_letter,
                "text": opt_text
            })
            last_option_letter = opt_letter
            
        elif current_q is not None:
            # Check if this is continuation of option or question
            if options and not re.match(r'^[A-E]\.', line):
                # Append to last option
                options[-1]["text"] += " " + line
            elif not options:
                # Part of question text
                q_text_parts.append(line)
        
        i += 1
    
    # Don't forget last question
    if current_q is not None:
        full_q_text = ' '.join(q_text_parts).strip()
        if full_q_text and len([o for o in options if o['text']]) >= 2:
            q_images = find_question_images(images, len(questions))
            questions.append({
                "number": current_q,
                "question": full_q_text,
                "options": options,
                "images": q_images,
                "page": page_num
            })
    
    return questions

def find_question_images(page_images, q_index):
    """Find images that belong to a question based on position"""
    # For now, distribute images across questions
    # This is a heuristic - in real PDF, position matters
    return [img for img in page_images] if page_images else []

def detect_year_from_text(text, prev_year=None):
    """Detect year from text"""
    # Look for explicit year markers
    patterns = [
        r'(\d{4})\s*JAMB',
        r'JAMB\s*[A-Z\s]+(\d{4})',
        r'(\d{4})\s*[A-Z]+ Questions',
        r'Economics\s*(\d{4})',
        r'(\d{4})$'
    ]
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE | re.MULTILINE)
        if matches:
            # Return the last match (most likely the current section's year)
            return matches[-1]
    
    return prev_year

def process_pdf(pdf_name, subject):
    """Process a single PDF file"""
    pdf_path = BASE_DIR / pdf_name
    
    if not pdf_path.exists():
        print(f"❌ PDF not found: {pdf_path}")
        return []
    
    print(f"\n📖 Processing {pdf_name}...")
    
    # Extract all content
    pages = extract_all_with_structure(pdf_path, subject)
    
    print(f"   Found {len(pages)} pages")
    
    all_questions = []
    year_questions = defaultdict(list)
    current_year = None
    
    for page in pages:
        # Detect year
        detected_year = detect_year_from_text(page["text"], current_year)
        if detected_year:
            current_year = detected_year
        
        # Parse questions
        questions = parse_questions_v2(
            page["text"],
            page["images"],
            subject,
            page["page_number"]
        )
        
        for q in questions:
            q["year"] = current_year
            all_questions.append(q)
            if current_year:
                year_questions[current_year].append(q)
    
    # Print stats
    print(f"   ✅ Total questions: {len(all_questions)}")
    print(f"   📊 Years found: {len(year_questions)}")
    for year, qs in sorted(year_questions.items()):
        print(f"      {year}: {len(qs)} questions")
    
    return all_questions, dict(year_questions)

def copy_images_to_cbt(subject):
    """Copy images from extraction folder to CBT folder"""
    src_dir = IMAGES_DIR / subject
    dst_dir = CBT_IMAGES_DIR / subject
    
    if src_dir.exists():
        dst_dir.mkdir(parents=True, exist_ok=True)
        count = 0
        for img_file in src_dir.iterdir():
            if img_file.is_file():
                shutil.copy2(img_file, dst_dir / img_file.name)
                count += 1
        print(f"   📷 Copied {count} images to CBT folder")
        return count
    return 0

def generate_js_questions(subject, questions):
    """Generate JavaScript file with questions"""
    
    cbt_questions = []
    
    for q in questions:
        # Convert options to array format
        options_array = ["", "", "", ""]
        for opt in q.get("options", []):
            letter_idx = ord(opt["letter"]) - ord('A')
            if 0 <= letter_idx < 4:
                options_array[letter_idx] = opt["text"]
        
        # Skip if fewer than 2 options have content
        if len([o for o in options_array if o.strip()]) < 2:
            continue
        
        # Handle images - convert to relative paths
        image_paths = []
        for img in q.get("images", []):
            img_name = img.get("filename", "")
            if img_name:
                image_paths.append(f"images/{subject}/{img_name}")
        
        cbt_q = {
            "id": f"{subject[:3]}_{q['number']}_{q.get('year', 'unknown')}",
            "question": q["question"],
            "options": options_array,
            "correctAnswer": 0,  # Will need answer key
            "year": q.get("year"),
            "subject": subject,
            "images": image_paths,
            "pageNumber": q.get("page")
        }
        
        cbt_questions.append(cbt_q)
    
    # Generate JS content
    js_content = f"""// {subject.upper()} Questions - Extracted from JAMB Past Questions PDF
// Total: {len(cbt_questions)} questions
// Generated with image support

const {subject}Questions = {json.dumps(cbt_questions, indent=2, ensure_ascii=False)};

// Export for CBT
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
    
    all_subjects = {}
    
    for pdf_name, subject in pdfs:
        try:
            questions, year_questions = process_pdf(pdf_name, subject)
            all_subjects[subject] = {
                "questions": questions,
                "year_questions": year_questions
            }
            
            # Copy images
            copy_images_to_cbt(subject)
            
            # Generate JS
            js_content, cbt_qs = generate_js_questions(subject, questions)
            
            output_path = OUTPUT_DIR / f"{subject}-questions-new.js"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            
            print(f"   📄 Generated: {output_path.name}")
            
        except Exception as e:
            print(f"❌ Error processing {subject}: {e}")
            import traceback
            traceback.print_exc()
    
    # Final summary
    print(f"\n{'='*60}")
    print("📊 EXTRACTION SUMMARY")
    print(f"{'='*60}")
    total = 0
    for subject, data in all_subjects.items():
        count = len(data["questions"])
        total += count
        years = len(data["year_questions"])
        print(f"   {subject.upper()}: {count} questions across {years} years")
    print(f"\n   🎯 TOTAL: {total} questions extracted")

if __name__ == "__main__":
    main()
