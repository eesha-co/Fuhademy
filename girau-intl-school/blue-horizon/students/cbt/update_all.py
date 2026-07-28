#!/usr/bin/env python3
"""
Update each subject's JS file with questions, images and passages
"""

import fitz  # pymupdf
import json
import re
import os
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path("/home/z/my-project/students/cbt")
IMAGES_DIR = BASE_DIR / "images"
JS_DIR = BASE_DIR / "js"

# Create directories
for subject in ["english", "maths", "physics", "economics"]:
    (IMAGES_DIR / subject).mkdir(parents=True, exist_ok=True)

def extract_images_from_page(doc, page_num, subject):
    """Extract images from a specific page"""
    images = []
    page = doc[page_num]
    
    for img_index, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Save image
        img_filename = f"{subject}_p{page_num+1}_img{img_index+1}.{image_ext}"
        img_path = IMAGES_DIR / subject / img_filename
        
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        
        images.append(f"images/{subject}/{img_filename}")
    
    return images


def extract_english_questions(pdf_path):
    """Extract English questions with comprehension passages"""
    doc = fitz.open(pdf_path)
    
    questions = []
    current_year = None
    current_passage = None
    current_passage_text = []
    current_q_num = None
    current_q_text = []
    current_options = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Extract images
        page_images = extract_images_from_page(doc, page_num, "english")
        
        # Detect year
        year_match = re.search(r'(\d{4})\s*JAMB\s*USE\s*OF\s*ENGLISH', text, re.IGNORECASE)
        if year_match:
            current_year = year_match.group(1)
            current_passage = None
            current_passage_text = []
        
        # Detect passage header
        passage_match = re.search(r'PASSAGE\s*([IVX]+)?', text, re.IGNORECASE)
        if passage_match:
            # Save any previous question
            if current_q_num and len(current_options) >= 2:
                questions.append({
                    "number": current_q_num,
                    "question": " ".join(current_q_text).strip(),
                    "options": current_options[:],
                    "year": current_year,
                    "passage": current_passage,
                    "passageText": "\n".join(current_passage_text).strip() if current_passage_text else None,
                    "images": page_images
                })
            
            current_passage = passage_match.group(0) if passage_match.group(1) else "I"
            current_passage_text = []
        
        # Parse questions on this page
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Skip headers
            if "www.toppers.com.ng" in line or "NOT FOR SALE" in line:
                continue
            
            # Question pattern: numbered question
            q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
            if q_match:
                # Skip paper type questions
                if "paper type" in q_match.group(2).lower():
                    continue
                
                # Save previous question
                if current_q_num and len(current_options) >= 2:
                    questions.append({
                        "number": current_q_num,
                        "question": " ".join(current_q_text).strip(),
                        "options": current_options[:],
                        "year": current_year,
                        "passage": current_passage,
                        "passageText": "\n".join(current_passage_text).strip() if current_passage_text else None,
                        "images": page_images
                    })
                
                current_q_num = int(q_match.group(1))
                current_q_text = [q_match.group(2)]
                current_options = []
            
            # Option patterns: A. text, B. text, C. text, D. text
            elif re.match(r'^([A-D])\.\s*(.*)$', line):
                opt_letter = line[0].upper()
                opt_text = line[2:].strip()
                
                existing = None
                for opt in current_options:
                    if opt['letter'] == opt_letter:
                        existing = opt
                        existing['text'] += " " + opt_text
                        break
                
                current_options.append({"letter": opt_letter, "text": opt_text})
            
            elif current_q_num is not None and line:
                if current_options:
                    current_options[-1]["text"] += " " + line
                else:
                    current_q_text.append(line)
    
    # Save last question
    if current_q_num and len(current_options) >= 2:
        questions.append({
            "number": current_q_num,
            "question": " ".join(current_q_text).strip(),
            "options": current_options[:],
            "year": current_year,
            "passage": current_passage,
            "passageText": "\n".join(current_passage_text).strip() if current_passage_text else None,
            "images": page_images
        })
    
    doc.close()
    return questions


def extract_maths_questions(pdf_path):
    """Extract Mathematics questions with images"""
    doc = fitz.open(pdf_path)
    
    questions = []
    current_year = None
    current_q_num = None
    current_q_text = []
    current_options = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Extract images
        page_images = extract_images_from_page(doc, page_num, "maths")
        
        # Detect year
        year_match = re.search(r'(\d{4})\s*JAMB\s*MATHEMATICS', text, re.IGNORECASE)
        if year_match:
            current_year = year_match.group(1)
        
        # Parse questions
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if "www.toppers.com.ng" in line:
                continue
            
            q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
            if q_match:
                if "paper type" in q_match.group(2).lower():
                    continue
                
                if current_q_num and len(current_options) >= 2:
                    questions.append({
                        "number": current_q_num,
                        "question": " ".join(current_q_text).strip(),
                        "options": current_options[:],
                        "year": current_year,
                        "images": page_images
                    })
                
                current_q_num = int(q_match.group(1))
                current_q_text = [q_match.group(2)]
                current_options = []
            
            elif re.match(r'^([A-D])\.\s*(.*)$', line):
                opt_letter = line[0].upper()
                opt_text = line[2:].strip()
                
                existing = None
                for opt in current_options:
                    if opt['letter'] == opt_letter:
                        existing = opt
                        existing['text'] += " " + opt_text
                        break
                
                current_options.append({"letter": opt_letter, "text": opt_text})
            
            elif current_q_num is not None and line:
                if current_options:
                    current_options[-1]["text"] += " " + line
                else:
                    current_q_text.append(line)
    
    # Save last question
    if current_q_num and len(current_options) >= 2:
        questions.append({
            "number": current_q_num,
            "question": " ".join(current_q_text).strip(),
            "options": current_options[:],
            "year": current_year,
            "images": page_images
        })
    
    doc.close()
    return questions
def extract_physics_questions(pdf_path):
    """Extract Physics questions with images"""
    doc = fitz.open(pdf_path)
    
    questions = []
    current_year = None
    current_q_num = None
    current_q_text = []
    current_options = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Extract images
        page_images = extract_images_from_page(doc, page_num, "physics")
        
        # Detect year
        year_match = re.search(r'(\d{4})\s*JAMB\s*PHYSICS', text, re.IGNORECASE)
        if year_match:
            current_year = year_match.group(1)
        
        # Parse questions
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            if "www.toppers.com.ng" in line:
                continue
            
            q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
            if q_match:
                if "paper type" in q_match.group(2).lower():
                    continue
                
                if current_q_num and len(current_options) >= 2:
                    questions.append({
                        "number": current_q_num,
                        "question": " ".join(current_q_text).strip(),
                        "options": current_options[:],
                        "year": current_year,
                        "images": page_images
                    })
                
                current_q_num = int(q_match.group(1))
                current_q_text = [q_match.group(2)]
                current_options = []
            
            elif re.match(r'^([A-D])\.\s*(.*)$', line):
                opt_letter = line[0].upper()
                opt_text = line[2:].strip()
                
                existing = None
                for opt in current_options:
                    if opt['letter'] == opt_letter:
                        existing = opt
                        existing['text'] += " " + opt_text
                        break
                
                current_options.append({"letter": opt_letter, "text": opt_text})
            
            elif current_q_num is not None and line:
                if current_options:
                    current_options[-1]["text"] += " " + line
                else:
                    current_q_text.append(line)
    
    # Save last question
    if current_q_num and len(current_options) >= 2:
        questions.append({
            "number": current_q_num,
            "question": " ".join(current_q_text).strip(),
            "options": current_options[:],
            "year": current_year,
            "images": page_images
        })
    
    doc.close()
    return questions
def extract_economics_questions(pdf_path):
    """Extract Economics questions"""
    doc = fitz.open(pdf_path)
    
    questions = []
    current_year = None
    current_q_num = None
    current_q_text = []
    current_options = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Extract images
        page_images = extract_images_from_page(doc, page_num, "economics")
        
        # Detect year
        year_match = re.search(r'Economics\s+(\d{4})', text, re.IGNORECASE)
        if year_match:
            current_year = year_match.group(1)
        
        # Parse questions
        lines = text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
            if q_match:
                if "paper type" in q_match.group(2).lower():
                    continue
                
                if current_q_num and len(current_options) >= 2:
                    questions.append({
                        "number": current_q_num,
                        "question": " ".join(current_q_text).strip(),
                        "options": current_options[:],
                        "year": current_year,
                        "images": page_images
                    })
                
                current_q_num = int(q_match.group(1))
                current_q_text = [q_match.group(2)]
                current_options = []
            
            elif re.match(r'^([A-E])\.\s*(.*)$', line):
                opt_letter = line[0].upper()
                opt_text = line[2:].strip()
                
                existing = None
                for opt in current_options:
                    if opt['letter'] == opt_letter:
                        existing = opt
                        existing['text'] += " " + opt_text
                        break
                
                current_options.append({"letter": opt_letter, "text": opt_text})
            
            elif current_q_num is not None and line:
                if current_options:
                    current_options[-1]["text"] += " " + line
                else:
                    current_q_text.append(line)
    
    # Save last question
    if current_q_num and len(current_options) >= 2:
        questions.append({
            "number": current_q_num,
            "question": " ".join(current_q_text).strip(),
            "options": current_options[:],
            "year": current_year,
            "images": page_images
        })
    
    doc.close()
    return questions
def format_options(options):
    """Format options as array"""
    options_array = ["", "", "", ""]
    for opt in options:
        idx = ord(opt['letter']) - ord('A')
        if 0 <= idx < 4:
            options_array[idx] = opt['text']
    return options_array
def organize_by_year(questions):
    """Organize questions by year"""
    by_year = defaultdict(list)
    for q in questions:
        year = q.get('year') or 'unknown'
        by_year[year].append(q)
    return dict(by_year)
def generate_subject_js(subject, questions_by_year, years):
    """Generate JavaScript file for a subject"""
    
    formatted_questions = []
    for year in years:
        year_qs = questions_by_year.get(year, [])
        for q in year_qs:
            formatted_q = {
                "number": q.get("number"),
                "question": q.get("question", ""),
                "options": q.get("options", ["", "", "", ""]),
                "correctAnswer": 0,  # Will need answer key
                "year": year
            }
            
            # Add passage info for English
            if subject == "English" and q.get("passageText"):
                formatted_q["passage"] = q.get("passage")
                formatted_q["passageText"] = q.get("passageText")
            
            # Add images - first image only for questions with images
            if q.get("images"):
                formatted_q["image"] = q["images"][0] if q["images"] else None
                formatted_q["images"] = q["images"]
            
            formatted_questions.append(formatted_q)
    
    # Generate JS content
    js_content = f"""// {subject.upper()} Questions - JAMB Past Questions
// Extracted from PDF with images and passages
// Total: {len(formatted_questions)} questions across {len(years)} years

// Generated: {datetime.now().strftime("%Y%m%d %H:%M", type="datetime")}

const jambQuestions = jambQuestions || {{}};
jambQuestions["{subject}"] = {{
    years: {json.dumps(years)},
    questionsByYear: {json.dumps(questions_by_year, indent=2, ensure_ascii=False)
}};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = jambQuestions["{subject}"];
}}
"""
    
    return js_content

def update_main_questions_js():
    """Update main questions.js to combine all subjects"""
    main_js_path = JS_DIR / "questions.js"
    
    # Load existing questions.js to get structure
    with open(main_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Create combined content
    combined = """// JAMB Past Questions - Combined
// Auto-generated from PDFs
// Total subjects: 6

const jambQuestions = {
"""
    
    # Add each subject
    subjects = ["English", "Mathematics", "Physics", "Chemistry", "Biology", "Economics"]
    
    for subject in subjects:
        js_file = JS_DIR / f"{subject.lower()}-questions.js"
        if os.path.exists(js_file):
            with open(js_file, "r", encoding="utf-8") as f:
                content = f.read()
            
            # Extract jambQuestions["Subject"]
            match = re.search(r'jambQuestions\["([^"]+)"\]', content)
            if match:
                subject_data = match.group(1)
                if subject_data:
                    combined += f""{subject_data},
"""
    
    combined += "\n};\n"
    
    # Write combined file
    with open(main_js_path, "w", encoding="utf-8") as f:
        f.write(combined)
    
    print(f"✅ Updated {main_js_path}")

def main():
    print("Starting question extraction...")
    
    # Check if PDFs exist
    english_pdf = PDF_DIR / "english.pdf"
    maths_pdf = PDF_DIR / "maths.pdf"
    physics_pdf = PDF_DIR / "physics.pdf"
    economics_pdf = PDF_DIR / "economics.pdf"
    
    english_questions = []
    maths_questions = []
    physics_questions = []
    economics_questions = []
    
    # Process English
    if english_pdf.exists():
        print("Processing English...")
        english_questions = extract_english_questions(english_pdf)
        english_by_year = organize_by_year(english_questions)
        generate_subject_js("English", english_questions, english_by_year.keys())
        print(f"English: {len(english_questions)} questions")
    else:
        print("English PDF not found!")
    
    # Process Mathematics
    if maths_pdf.exists():
        print("Processing Mathematics...")
        maths_questions = extract_maths_questions(maths_pdf)
        maths_by_year = organize_by_year(maths_questions)
        generate_subject_js("Mathematics", maths_questions, maths_by_year.keys())
        print(f"Mathematics: {len(maths_questions)} questions")
    else:
        print("Mathematics PDF not found!")
    
    # Process Physics
    if physics_pdf.exists():
        print("Processing Physics...")
        physics_questions = extract_physics_questions(physics_pdf)
        physics_by_year = organize_by_year(physics_questions)
        generate_subject_js("Physics", physics_questions, physics_by_year.keys())
        print(f"Physics: {len(physics_questions)} questions")
    else:
        print("Physics PDF not found!")
    
    # Process Economics
    if economics_pdf.exists():
        print("Processing Economics...")
        economics_questions = extract_economics_questions(economics_pdf)
        economics_by_year = organize_by_year(economics_questions)
        generate_subject_js("Economics", economics_questions, economics_by_year.keys())
        print(f"Economics: {len(economics_questions)} questions")
    else:
        print("Economics PDF not found!")
    
    # Update main questions.js
    update_main_questions_js()
    
    # Summary
    print("\n" + "="*60)
    print("EXTRACTION COMPLETE!")
    print("="*60)
