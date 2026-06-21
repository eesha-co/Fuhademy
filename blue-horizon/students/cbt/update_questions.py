#!/usr/bin/env python3
"""
Update each subject's JS file with questions including images and passages
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

def extract_images_for_page(doc, page_num, subject):
    """Extract images from a page"""
    images = []
    
    page = doc[page_num]
    for img_index, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        img_filename = f"{subject}_p{page_num+1}_i{img_index+1}.{image_ext}"
        img_path = IMAGES_DIR / subject / img_filename
        
        (IMAGES_DIR / subject).mkdir(parents=True, exist_ok=True)
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        
        images.append(f"images/{subject}/{img_filename}")
    
    return images


def extract_subject_questions(pdf_path, subject):
    """Extract all questions from a PDF for a subject"""
    doc = fitz.open(pdf_path)
    
    questions = []
    current_year = None
    current_passage = None
    current_passage_text = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        
        # Get images for this page
        page_images = extract_images_for_page(doc, page_num, subject)
        
        # Detect year
        year_match = re.search(r'(\d{4})\s*JAMB', text, re.IGNORECASE)
        if year_match:
            if subject == "economics":
                if 1983 <= int(year_match.group(1)) <= 2004:
                    current_year = year_match.group(1)
            else:
                if 2010 <= int(year_match.group(1)) <= 2018:
                    current_year = year_match.group(1)
        
        # Detect passage for English
        if subject == "english":
            passage_match = re.search(r'PASSAGE\s*([IVX]+)?', text, re.IGNORECASE)
            if passage_match:
                current_passage = passage_match.group(0)
                current_passage_text = []
        
        # Parse questions
        lines = text.split('\n')
        current_q = None
        q_text = []
        options = []
        q_image = page_images[0] if page_images else None
        
        for line in lines:
            line = line.strip()
            if not line or "www.toppers.com.ng" in line:
                continue
            
            # Question pattern
            q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
            # Option patterns (A. or (a) or a))
            o_match = re.match(r'^([A-D])\.\s*(.*)$', line)
            o_match2 = re.match(r'^[\(]([a-dA-D])[\)]\s*(.*)$', line)
            
            if q_match and not (o_match or o_match2):
                num = int(q_match.group(1))
                q_first = q_match.group(2).lower() if q_match.group(2) else ""
                
                if "paper type" not in q_first and "question paper" not in q_first:
                    # Save previous question
                    if current_q and len(options) >= 2:
                        questions.append({
                            "number": current_q,
                            "question": " ".join(q_text).strip(),
                            "options": [o["text"] for o in sorted(options, key=lambda x: x["letter"])],
                            "year": current_year,
                            "subject": subject,
                            "image": q_image,
                            "passage": current_passage if current_passage else None,
                            "passage_text": "\n".join(current_passage_text) if current_passage_text else None
                        })
                    
                    current_q = num
                    q_text = [q_match.group(2)] if q_match.group(2) else []
                    options = []
                    if page_images:
                        q_image = page_images[0]
            
            elif o_match or o_match2:
                letter = (o_match or o_match2).group(1).upper()
                opt_text = (o_match or o_match2).group(2)
                if current_q:
                    existing = next((o for o in options if o["letter"] == letter), None)
                    if existing:
                        existing["text"] = opt_text
                    else:
                        options.append({"letter": letter, "text": opt_text})
            
            elif current_q is not None:
                if options:
                    options[-1]["text"] += " " + line
                else:
                    q_text.append(line)
            elif subject == "english" and current_passage and not current_q:
                # This is passage text
                current_passage_text.append(line)
        
        # Save last question
        if current_q and len(options) >= 2:
            questions.append({
                "number": current_q,
                "question": " ".join(q_text).strip(),
                "options": [o["text"] for o in sorted(options, key=lambda x: x["letter"])],
                "year": current_year,
                "subject": subject,
                "image": q_image,
                "passage": current_passage if current_passage else None,
                "passage_text": "\n".join(current_passage_text) if current_passage_text else None
            })
    
    doc.close()
    return questions


def generate_subject_js(subject, questions):
    """Generate JS file for a subject"""
    
    # Organize by year
    by_year = defaultdict(list)
    for q in questions:
        year = q.get("year", "unknown")
        by_year[year].append(q)
    
    years = sorted([y for y in by_year.keys() if y and y != "unknown" and y != "null"])
    
    # Format for JS file
    js_questions = {}
    for year in years:
        year_questions = []
        for q in by_year[year]:
            formatted_q = {
                "number": q["number"],
                "question": q["question"],
                "options": q["options"],
                "correctAnswer": 0,  # Needs answer key
                "image": q.get("image")
            }
            # Add passage info for English
            if q.get("passage_text"):
                formatted_q["passage"] = q.get("passage")
                formatted_q["passageText"] = q.get("passage_text")
            year_questions.append(formatted_q)
        js_questions[year] = year_questions
    
    # Generate JS content
    subject_caps = subject.upper()
    js_content = f"""// {subject_caps} Questions - JAMB Past Questions
// Extracted from PDF with image and passage support

const {subject}Questions = {{
    "years": {json.dumps(years)},
    "questionsByYear": {json.dumps(js_questions, indent=2, ensure_ascii=False)}
}};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {subject}Questions;
}}
"""
    return js_content


def main():
    pdfs = [
        ("/home/z/my-project/students/cbt/pdfs/english.pdf", "english"),
        ("/home/z/my-project/students/cbt/pdfs/maths.pdf", "maths"),
        ("/home/z/my-project/students/cbt/pdfs/physics.pdf", "physics"),
        ("/home/z/my-project/students/cbt/pdfs/economics.pdf", "economics")
    ]
    
    for pdf_path, subject in pdfs:
        if not os.path.exists(pdf_path):
            print(f"❌ PDF not found: {pdf_path}")
            continue
        
        print(f"\n📖 Processing {subject.upper()}...")
        
        try:
            questions = extract_subject_questions(pdf_path, subject)
            
            # Stats
            by_year = defaultdict(list)
            for q in questions:
                by_year[q.get("year", "unknown")].append(q)
            
            total_images = sum(1 for q in questions if q.get("image"))
            total_passages = sum(1 for q in questions if q.get("passage_text"))
            
            print(f"   ✅ {len(questions)} questions extracted")
            for year in sorted(by_year.keys()):
                if year and year != "unknown" and year != "null":
                    print(f"      {year}: {len(by_year[year])} questions")
            print(f"   📷 {total_images} questions with images")
            if total_passages:
                print(f"   📝 {total_passages} questions with passages")
            
            # Generate JS file
            js_content = generate_subject_js(subject, questions)
            
            output_path = JS_DIR / f"{subject}-questions.js"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            
            print(f"   📄 Saved: {output_path.name}")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    main()
