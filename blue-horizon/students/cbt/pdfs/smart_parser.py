#!/usr/bin/env python3
"""
Smart Question Parser for JAMB Past Questions
Extracts questions with images and preserves formatting
"""

import json
import re
import os
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path("/home/z/my-project/students/cbt/pdfs")
IMAGES_DIR = BASE_DIR / "images"
OUTPUT_DIR = Path("/home/z/my-project/students/cbt/js")

def load_extracted_data(subject):
    """Load the full extracted JSON data"""
    json_path = BASE_DIR / f"{subject}_full_extract.json"
    if not json_path.exists():
        return None
    
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

def get_images_for_page(subject, page_num):
    """Get all images for a specific page"""
    img_dir = IMAGES_DIR / subject
    images = []
    
    if not img_dir.exists():
        return images
    
    for img_file in img_dir.iterdir():
        if img_file.name.startswith(f"page{page_num}_"):
            images.append(str(img_file))
    
    return sorted(images)

def parse_questions_from_text(text, subject, page_num, page_images):
    """Parse questions from page text with proper formatting"""
    questions = []
    
    # Split text into lines
    lines = text.split('\n')
    
    current_q = None
    current_text = []
    current_options = []
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
        
        # Check for question number pattern
        # Pattern: number followed by period and text
        q_match = re.match(r'^(\d+)\.\s*(.*)$', line)
        
        # Check for option pattern
        opt_match = re.match(r'^([A-E])\.\s*(.*)$', line)
        
        if q_match:
            # Save previous question if exists
            if current_q:
                q_text = ' '.join(current_text).strip()
                if q_text:
                    questions.append({
                        "number": current_q,
                        "question": q_text,
                        "options": current_options,
                        "page": page_num,
                        "images": page_images if current_text else []
                    })
            
            # Start new question
            current_q = int(q_match.group(1))
            current_text = [q_match.group(2)] if q_match.group(2) else []
            current_options = []
            
        elif opt_match and current_q:
            # Add option
            opt_letter = opt_match.group(1)
            opt_text = opt_match.group(2)
            current_options.append({
                "letter": opt_letter,
                "text": opt_text
            })
            
        elif current_q:
            # Continuation of question or option
            # Check if this is continuation of last option
            if current_options and not re.match(r'^[A-E]\.', line):
                # Append to last option
                current_options[-1]["text"] += " " + line
            else:
                # Append to question text
                current_text.append(line)
    
    # Save last question
    if current_q:
        q_text = ' '.join(current_text).strip()
        if q_text:
            questions.append({
                "number": current_q,
                "question": q_text,
                "options": current_options,
                "page": page_num,
                "images": page_images
            })
    
    return questions

def detect_year(text, prev_year=None):
    """Detect year from text"""
    # Look for year patterns like "2010", "2011 JAMB", etc.
    year_patterns = [
        r'(\d{4})\s*JAMB',
        r'JAMB\s*[A-Z\s]+(\d{4})',
        r'(\d{4})\s*[A-Z\s]+Questions',
        r'Economics\s*(\d{4})',
    ]
    
    for pattern in year_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1)
    
    return prev_year

def process_subject(subject):
    """Process all pages for a subject"""
    print(f"\n{'='*60}")
    print(f"Processing {subject.upper()}")
    print(f"{'='*60}")
    
    data = load_extracted_data(subject)
    if not data:
        print(f"  ❌ No extracted data found for {subject}")
        return []
    
    all_questions = []
    current_year = None
    year_questions = defaultdict(list)
    
    for page_data in data["pages"]:
        page_num = page_data["page_number"]
        page_text = page_data["text"]
        page_images = page_data.get("images", [])
        
        # Detect year
        new_year = detect_year(page_text, current_year)
        if new_year and new_year != current_year:
            current_year = new_year
            print(f"  📅 Found year: {current_year}")
        
        # Get image paths
        image_paths = get_images_for_page(subject, page_num)
        
        # Parse questions
        questions = parse_questions_from_text(page_text, subject, page_num, image_paths)
        
        for q in questions:
            q["year"] = current_year
            year_questions[current_year].append(q)
            all_questions.append(q)
    
    print(f"  ✅ Total questions: {len(all_questions)}")
    for year, qs in sorted(year_questions.items()):
        print(f"     {year}: {len(qs)} questions")
    
    return all_questions, dict(year_questions)

def generate_js_file(subject, year_questions, all_questions):
    """Generate JavaScript question file"""
    
    # Convert to CBT format
    cbt_questions = []
    
    for q in all_questions:
        # Convert options from objects to array
        options_array = []
        for i, letter in enumerate(['A', 'B', 'C', 'D', 'E']):
            found = next((opt for opt in q.get('options', []) if opt['letter'] == letter), None)
            if found:
                options_array.append(found['text'])
            elif i < 4:  # At least 4 options
                options_array.append("")
        
        # Skip questions without proper options
        if len([o for o in options_array if o]) < 2:
            continue
        
        cbt_q = {
            "id": f"{subject[:3]}_{q['number']}_{q.get('year', 'unknown')}",
            "question": q["question"],
            "options": options_array[:4],  # Take only first 4 options
            "correctAnswer": 0,  # Will need manual correction or answer key
            "year": q.get("year"),
            "subject": subject,
            "images": q.get("images", [])
        }
        
        cbt_questions.append(cbt_q)
    
    # Generate JS content
    js_content = f"""// {subject.upper()} Questions - Auto-extracted from PDF
// Total: {len(cbt_questions)} questions
// Source: JAMB Past Questions

const {subject}Questions = {json.dumps(cbt_questions, indent=2, ensure_ascii=False)};

// Export for use in CBT
if (typeof module !== 'undefined' && module.exports) {{
    module.exports = {subject}Questions;
}}
"""
    
    return js_content, cbt_questions

def main():
    subjects = ["english", "maths", "physics", "economics"]
    
    all_data = {}
    
    for subject in subjects:
        try:
            all_qs, year_qs = process_subject(subject)
            all_data[subject] = {
                "all_questions": all_qs,
                "year_questions": year_qs
            }
            
            # Generate JS file
            js_content, cbt_qs = generate_js_file(subject, year_qs, all_qs)
            
            output_path = OUTPUT_DIR / f"{subject}-questions-new.js"
            with open(output_path, "w", encoding="utf-8") as f:
                f.write(js_content)
            
            print(f"  📄 Generated: {output_path}")
            
        except Exception as e:
            print(f"  ❌ Error processing {subject}: {e}")
            import traceback
            traceback.print_exc()
    
    # Summary
    print(f"\n{'='*60}")
    print("SUMMARY")
    print(f"{'='*60}")
    for subject, data in all_data.items():
        print(f"{subject.upper()}: {len(data['all_questions'])} total questions")

if __name__ == "__main__":
    main()
