#!/usr/bin/env python3
"""
Extract JAMB Mathematics questions with images
"""
import fitz  # PyMuPDF
import re
import json
import os
import base64
from PIL import Image
import io

def extract_images_from_page(page, page_num, subject_dir):
    """Extract images from a page and save them"""
    images = []
    image_list = page.get_images(full=True)
    
    for img_idx, img_info in enumerate(image_list):
        xref = img_info[0]
        try:
            base_image = page.parent.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            # Skip very small images (likely icons/formatting)
            img = Image.open(io.BytesIO(image_bytes))
            if img.width < 50 or img.height < 50:
                continue
            
            # Save image
            img_filename = f"page{page_num + 1}_img{img_idx + 1}.{image_ext}"
            img_path = os.path.join(subject_dir, img_filename)
            
            with open(img_path, 'wb') as f:
                f.write(image_bytes)
            
            images.append(img_filename)
            print(f"  Saved image: {img_filename}")
        except Exception as e:
            pass
    
    return images


def extract_maths_questions(pdf_path, output_dir, subject_name="Mathematics"):
    """Extract Mathematics questions with images"""
    
    os.makedirs(output_dir, exist_ok=True)
    doc = fitz.open(pdf_path)
    questions_by_year = {}
    current_year = None
    
    # Year patterns
    year_patterns = [
        re.compile(r'(?:JAMB|UTME)\s*[-_]?\s*(\d{4})', re.IGNORECASE),
        re.compile(r'(\d{4})\s*(?:UTME|JAMB)', re.IGNORECASE),
        re.compile(r'(\d{4})\s*QUESTION', re.IGNORECASE),
    ]
    
    all_questions = []
    current_images = []
    
    for page_num, page in enumerate(doc):
        text = page.get_text()
        
        # Extract images from this page
        page_images = extract_images_from_page(page, page_num, output_dir)
        
        # Check for year
        for pattern in year_patterns:
            year_match = pattern.search(text)
            if year_match:
                new_year = year_match.group(1)
                if new_year != current_year:
                    if current_year and all_questions:
                        questions_by_year[current_year] = all_questions
                        all_questions = []
                    current_year = new_year
                    print(f"Found year: {current_year} on page {page_num + 1}")
                break
        
        # Extract questions from this page
        lines = text.split('\n')
        current_question = None
        question_text = []
        options = []
        
        i = 0
        while i < len(lines):
            line = lines[i].strip()
            
            if not line:
                i += 1
                continue
            
            # Check for question number
            q_match = re.match(r'^(\d+)\.\s*(.+)', line)
            if q_match:
                # Save previous question
                if current_question and len(options) == 4:
                    q_data = {
                        "number": int(current_question),
                        "question": ' '.join(question_text).strip(),
                        "options": options,
                        "answer": "A",
                        "year": current_year
                    }
                    if page_images:
                        q_data["image"] = page_images[0]  # Associate image
                    all_questions.append(q_data)
                
                current_question = q_match.group(1)
                question_text = [q_match.group(2)]
                options = []
                i += 1
                continue
            
            # Check for options A-D
            opt_match = re.match(r'^([A-D])\.\s*(.+)', line)
            if opt_match and current_question:
                options.append(opt_match.group(2).strip())
                i += 1
                continue
            
            # Check for option without letter (continuation or alternate format)
            if current_question and not options and not re.match(r'^[A-D]\.', line):
                question_text.append(line)
            elif current_question and options and len(options) < 4:
                # Could be continuation of last option
                pass
            
            i += 1
        
        # Handle last question on page
        if current_question and len(options) == 4:
            q_data = {
                "number": int(current_question),
                "question": ' '.join(question_text).strip(),
                "options": options,
                "answer": "A",
                "year": current_year
            }
            if page_images:
                q_data["image"] = page_images[0]
            all_questions.append(q_data)
            current_question = None
            question_text = []
            options = []
    
    # Save remaining questions
    if current_year and all_questions:
        questions_by_year[current_year] = all_questions
    
    doc.close()
    
    return questions_by_year


def generate_js_file(questions_by_year, output_path, subject_name):
    """Generate JavaScript file with questions"""
    
    years = sorted(questions_by_year.keys())
    subject_lower = subject_name.lower()
    
    js_content = '// JAMB ' + subject_name + ' Past Questions\n'
    js_content += '// Extracted from official JAMB past questions PDF\n\n'
    js_content += 'if (!jambQuestions) var jambQuestions = {};\n\n'
    js_content += 'jambQuestions["' + subject_name + '"] = {\n'
    js_content += '  years: ' + json.dumps(years) + ',\n'
    js_content += '  questionsByYear: {\n'
    
    for year in years:
        questions = questions_by_year[year]
        js_content += '    "' + year + '": [\n'
        
        for q in questions:
            image_str = ""
            if q.get('image'):
                image_str = ',\n        image: "images/' + subject_lower + '/' + q["image"] + '"'
            
            options_str = json.dumps(q['options'])
            question_escaped = q['question'].replace('`', "'").replace('\\', '\\\\')
            
            js_content += '      {\n'
            js_content += '        number: ' + str(q['number']) + ',\n'
            js_content += '        question: `' + question_escaped + '`,\n'
            js_content += '        options: ' + options_str + ',\n'
            js_content += '        answer: "' + q['answer'] + '"' + image_str + '\n'
            js_content += '      },\n'
        
        js_content += '    ],\n'
    
    js_content += '  }\n'
    js_content += '};\n'
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"Generated {output_path}")
    total = sum(len(qs) for qs in questions_by_year.values())
    print(f"Total questions: {total}")


if __name__ == "__main__":
    pdf_path = "/home/z/my-project/students/cbt/pdfs/maths.pdf"
    output_path = "/home/z/my-project/students/cbt/js/maths-questions.js"
    images_dir = "/home/z/my-project/students/cbt/images/maths"
    
    print("Extracting Mathematics questions...")
    questions = extract_maths_questions(pdf_path, images_dir, "Mathematics")
    
    print(f"\nYears found: {list(questions.keys())}")
    for year, qs in questions.items():
        print(f"  {year}: {len(qs)} questions")
    
    generate_js_file(questions, output_path, "Mathematics")
