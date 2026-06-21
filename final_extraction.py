#!/usr/bin/env python3
"""
Final extraction - use page images directly and extract all questions.
"""

import os
import re
import json
from PIL import Image

# Paths
PAGES_DIR = "students/cbt/pdf_pages/physics"
OUTPUT_DIR = "students/cbt/images/physics_questions"

# Expected questions per year
EXPECTED = {
    '2010': 50, '2011': 50, '2012': 50, '2013': 50, '2014': 50,
    '2015': 40, '2016': 40, '2017': 40, '2018': 40,
}

# Year to page mapping (corrected)
YEAR_PAGES = {
    '2010': (2, 11),
    '2011': (12, 21),
    '2012': (22, 31),
    '2013': (32, 42),
    '2014': (43, 52),
    '2015': (53, 61),
    '2016': (62, 71),
    '2017': (71, 79),
    '2018': (80, 87),
}

def get_page_image(page_num):
    """Get the path to a page image"""
    page_str = f"page-{page_num:02d}.png"
    path = os.path.join(PAGES_DIR, page_str)
    if os.path.exists(path):
        return path
    return None

def extract_year_questions(year, start_page, end_page):
    """Extract all questions for a year by processing page images"""
    questions = {}
    
    for page_num in range(start_page, end_page + 1):
        page_path = get_page_image(page_num)
        if not page_path:
            continue
        
        # We'll crop the entire page minus margins and save each question area
        # For now, let's just count what we find
        img = Image.open(page_path)
        width, height = img.size
        
        # Typical question height is about 120-150 pixels
        # We'll extract questions based on page position
        
        questions[page_num] = {
            'path': page_path,
            'width': width,
            'height': height
        }
    
    return questions

# Create all question images using a different approach
# We'll use the PDF full extract to identify question positions

with open('students/cbt/pdfs/physics_full_extract.json', 'r') as f:
    full_extract = json.load(f)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Process each year
all_images = {}

for year, (start_page, end_page) in YEAR_PAGES.items():
    all_images[year] = []
    expected = EXPECTED[year]
    
    print(f"\nProcessing {year} (pages {start_page}-{end_page}, expected {expected} questions)...")
    
    # Get all pages for this year
    year_pages = [p for p in full_extract['pages'] if start_page <= p['page_number'] <= end_page]
    
    # Find all questions across all pages
    all_questions_in_year = []
    
    for page_data in year_pages:
        page_num = page_data['page_number']
        text = page_data['text']
        
        # Skip answer key pages
        if 'ANSWER KEY' in text.upper():
            continue
        
        # Find question numbers
        lines = text.split('\n')
        
        for line_idx, line in enumerate(lines):
            line = line.strip()
            match = re.match(r'^(\d+)\.\s*(.*)$', line)
            if match:
                q_num = int(match.group(1))
                if 1 <= q_num <= expected:
                    all_questions_in_year.append({
                        'num': q_num,
                        'page': page_num,
                        'line_idx': line_idx,
                        'text': match.group(2)
                    })
    
    # Sort by question number and keep first occurrence
    unique_questions = {}
    for q in all_questions_in_year:
        if q['num'] not in unique_questions:
            unique_questions[q['num']] = q
    
    # Create images
    for q_num in sorted(unique_questions.keys()):
        q_data = unique_questions[q_num]
        page_num = q_data['page']
        
        # Get page image
        page_path = get_page_image(page_num)
        if not page_path:
            continue
        
        try:
            page_img = Image.open(page_path)
            img_width, img_height = page_img.size
            
            # Calculate Y position based on line index
            # Assume about 25 lines per page, with margins
            margin_top = int(img_height * 0.06)  # 6% top margin
            margin_bottom = int(img_height * 0.06)  # 6% bottom margin
            usable_height = img_height - margin_top - margin_bottom
            
            # Count total non-empty lines in page
            page_text = next((p['text'] for p in year_pages if p['page_number'] == page_num), '')
            total_lines = len([l for l in page_text.split('\n') if l.strip()])
            
            if total_lines > 0:
                line_height = usable_height / total_lines
                start_y = margin_top + int(q_data['line_idx'] * line_height)
            else:
                start_y = margin_top
            
            # Find end Y - next question or end of page
            next_q = None
            for n in range(q_num + 1, expected + 1):
                if n in unique_questions and unique_questions[n]['page'] == page_num:
                    next_q = unique_questions[n]
                    break
            
            if next_q:
                end_y = margin_top + int(next_q['line_idx'] * line_height)
            else:
                end_y = img_height - margin_bottom
            
            # Ensure valid crop
            if end_y <= start_y:
                end_y = min(start_y + 150, img_height - margin_bottom)
            
            # Crop
            crop_box = (0, start_y, img_width, end_y)
            q_img = page_img.crop(crop_box)
            
            # Save
            output_name = f"{year}_q{q_num}.png"
            output_path = os.path.join(OUTPUT_DIR, output_name)
            q_img.save(output_path, "PNG")
            
            all_images[year].append(q_num)
            
        except Exception as e:
            print(f"  Error: {year} Q{q_num}: {e}")
    
    # Report
    missing = set(range(1, expected + 1)) - set(unique_questions.keys())
    print(f"  Found {len(unique_questions)} questions, created {len(all_images[year])} images")
    if missing:
        print(f"  Missing questions: {sorted(missing)}")

# Final summary
print("\n" + "="*50)
print("FINAL SUMMARY")
print("="*50)
total = 0
for year in sorted(all_images.keys()):
    count = len(all_images[year])
    total += count
    expected = EXPECTED[year]
    status = "✓" if count >= expected else f"({expected - count} missing)"
    print(f"{year}: {count} images {status}")

print(f"\nTotal: {total} question images created")
