#!/usr/bin/env python3
"""
Complete extraction of ALL Physics questions from PDF.
"""

import json
import os
import re
from PIL import Image

# Load the full extracted data
with open('students/cbt/pdfs/physics_full_extract.json', 'r') as f:
    full_extract = json.load(f)

# Paths
PAGES_DIR = "students/cbt/pdf_pages/physics"
OUTPUT_DIR = "students/cbt/images/physics_questions"

# Page dimensions
PAGE_HEIGHT = 842  # A4 in points
PAGE_WIDTH = 595

# Expected questions per year
EXPECTED = {
    '2010': 50, '2011': 50, '2012': 50, '2013': 50, '2014': 50,
    '2015': 40, '2016': 40, '2017': 40, '2018': 40,
}

def get_page_image(page_num):
    """Get the path to a page image"""
    page_str = f"page-{page_num:02d}.png"
    path = os.path.join(PAGES_DIR, page_str)
    if os.path.exists(path):
        return path
    return None

def find_year_in_text(text):
    """Find year marker in text"""
    match = re.search(r'(\d{4})\s+JAMB\s+PHYSICS', text)
    if match:
        return match.group(1)
    return None

def find_all_questions_in_text(text):
    """Find all question patterns in text"""
    questions = []
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        # Match patterns like "1. " at start of line
        match = re.match(r'^(\d+)\.\s*(.*)$', line)
        if match:
            q_num = int(match.group(1))
            # Skip answer key patterns (usually have letters before numbers)
            if q_num <= 50:  # Valid question numbers
                questions.append({
                    'num': q_num,
                    'text': match.group(2),
                    'line_idx': i
                })
    
    return questions

def estimate_y_position(text, target_line_idx, total_lines):
    """Estimate Y position based on line index"""
    # Start from top with some margin
    margin_top = 50
    margin_bottom = 50
    usable_height = PAGE_HEIGHT - margin_top - margin_bottom
    line_height = usable_height / max(total_lines, 1)
    
    return margin_top + (target_line_idx * line_height)

def extract_all_questions():
    """Extract all questions properly"""
    pages_data = full_extract.get('pages', [])
    
    all_questions = {}
    current_year = None
    
    for page_data in pages_data:
        page_num = page_data.get('page_number', 0)
        text = page_data.get('text', '')
        images = page_data.get('images', [])
        
        # Skip answer key pages (usually have patterns like "1. B 2. C 3. D")
        if re.search(r'ANSWER KEYS?', text, re.IGNORECASE):
            continue
        
        # Check for year marker
        year_in_text = find_year_in_text(text)
        if year_in_text:
            current_year = year_in_text
            if current_year not in all_questions:
                all_questions[current_year] = {}
        
        if not current_year:
            continue
        
        # Skip if this is an answer key page (has many answers in sequence)
        answer_pattern = re.findall(r'\d+\.\s*[A-D]\s', text)
        if len(answer_pattern) > 10:
            continue
        
        # Find all questions in this page
        questions = find_all_questions_in_text(text)
        lines = text.split('\n')
        total_lines = len([l for l in lines if l.strip()])
        
        for q in questions:
            q_num = q['num']
            
            # Estimate Y position
            y_pos = estimate_y_position(text, q['line_idx'], total_lines)
            
            # Skip if already found (prefer first occurrence)
            if q_num not in all_questions[current_year]:
                # Check if there's a diagram near this question
                has_diagram = False
                for img in images:
                    img_y = img['positions'][0]['y']
                    # If image is within 200 points of question
                    if abs(img_y - y_pos) < 200:
                        has_diagram = True
                        break
                
                all_questions[current_year][q_num] = {
                    'num': q_num,
                    'text': q['text'],
                    'page': page_num,
                    'y_pos': y_pos,
                    'has_diagram': has_diagram
                }
    
    return all_questions

def create_question_images(all_questions):
    """Create images for all questions"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    created = {}
    
    for year, questions in all_questions.items():
        created[year] = []
        
        # Sort by question number
        for q_num in sorted(questions.keys()):
            q_data = questions[q_num]
            page_num = q_data['page']
            y_pos = q_data['y_pos']
            
            # Get page image
            page_path = get_page_image(page_num)
            if not page_path:
                print(f"  Warning: Page {page_num} not found for {year} Q{q_num}")
                continue
            
            try:
                page_img = Image.open(page_path)
                img_width, img_height = page_img.size
                
                # Scale Y position to image coordinates
                scale_y = img_height / PAGE_HEIGHT
                start_y = int(y_pos * scale_y)
                
                # Find end Y (next question or end of page)
                next_q_num = q_num + 1
                end_y = img_height - 20  # Default to end of page
                
                if next_q_num in questions and questions[next_q_num]['page'] == page_num:
                    end_y = int(questions[next_q_num]['y_pos'] * scale_y)
                elif next_q_num in questions and questions[next_q_num]['page'] != page_num:
                    end_y = img_height - 20
                
                # Ensure valid crop
                if end_y <= start_y:
                    end_y = min(start_y + 100, img_height)
                
                # Crop the question
                crop_box = (0, start_y, img_width, end_y)
                q_img = page_img.crop(crop_box)
                
                # Save
                output_name = f"{year}_q{q_num}.png"
                output_path = os.path.join(OUTPUT_DIR, output_name)
                q_img.save(output_path, "PNG")
                
                created[year].append(q_num)
                
            except Exception as e:
                print(f"  Error creating {year} Q{q_num}: {e}")
    
    return created

# Main execution
print("=== Extracting all questions ===")
all_questions = extract_all_questions()

print("\n=== Question extraction summary ===")
for year in sorted(EXPECTED.keys()):
    expected = EXPECTED[year]
    got = len(all_questions.get(year, {}))
    missing = set(range(1, expected + 1)) - set(all_questions.get(year, {}).keys())
    
    if missing:
        print(f"{year}: Expected {expected}, Got {got}, Missing: {sorted(missing)}")
    else:
        print(f"{year}: Expected {expected}, Got {got} ✓")

print("\n=== Creating question images ===")
created = create_question_images(all_questions)

print("\n=== Final summary ===")
total_created = 0
for year in sorted(created.keys()):
    count = len(created[year])
    total_created += count
    print(f"{year}: {count} images created")

print(f"\nTotal: {total_created} images created")

# Save the complete question data
output_data = {}
for year, qs in all_questions.items():
    output_data[year] = [qs[num] for num in sorted(qs.keys())]

with open(os.path.join(OUTPUT_DIR, 'all_questions_complete.json'), 'w') as f:
    json.dump(output_data, f, indent=2)
