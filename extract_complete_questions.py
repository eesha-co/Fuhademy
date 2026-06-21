#!/usr/bin/env python3
"""
Extract ALL Physics questions from PDF - ensuring complete coverage.
JAMB Physics has 50 questions per year (2010-2014) or 40 questions (2015-2018).
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

# Expected questions per year based on answer keys
EXPECTED_QUESTIONS = {
    '2010': 50, '2011': 50, '2012': 50, '2013': 50, '2014': 50,
    '2015': 40, '2016': 40, '2017': 40, '2018': 40
}

def get_page_image(page_num):
    """Get the path to a page image"""
    page_str = f"page-{page_num:02d}.png"
    path = os.path.join(PAGES_DIR, page_str)
    if os.path.exists(path):
        return path
    return None

def find_question_positions(text):
    """Find all question numbers and their approximate positions in text"""
    positions = []
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        # Match question patterns like "1." "1. " "1.Question"
        match = re.match(r'^(\d+)\.\s*(.*)$', line)
        if match:
            q_num = int(match.group(1))
            if 1 <= q_num <= 50:  # Valid question range
                positions.append({
                    'num': q_num,
                    'line_idx': i,
                    'text': match.group(2)
                })
    
    return positions

def extract_all_questions():
    """Extract all questions with improved detection"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    pages = full_extract.get('pages', [])
    current_year = None
    
    # Track extracted questions by year
    extracted = {year: set() for year in EXPECTED_QUESTIONS.keys()}
    
    # Build a map of page_num -> page_data
    page_map = {p['page_number']: p for p in pages}
    
    # Process each page
    for page_data in pages:
        page_num = page_data.get('page_number', 0)
        text = page_data.get('text', '')
        
        # Detect year from page content
        year_match = re.search(r'(\d{4})\s+JAMB\s+PHYSICS', text)
        if year_match:
            current_year = year_match.group(1)
        
        if not current_year:
            continue
        
        # Get page image
        page_image_path = get_page_image(page_num)
        if not page_image_path:
            continue
        
        page_img = Image.open(page_image_path)
        img_width, img_height = page_img.size
        scale_y = img_height / PAGE_HEIGHT
        
        # Find questions on this page
        lines = text.split('\n')
        total_lines = len([l for l in lines if l.strip()])
        line_height = (PAGE_HEIGHT - 100) / max(total_lines, 1)
        
        # Find all question starts
        question_starts = {}  # q_num -> y_position
        line_y = 50
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            match = re.match(r'^(\d+)\.\s', line)
            if match:
                q_num = int(match.group(1))
                if 1 <= q_num <= EXPECTED_QUESTIONS.get(current_year, 50):
                    question_starts[q_num] = line_y
            
            line_y += line_height
        
        # Extract each question
        sorted_questions = sorted(question_starts.items())
        for i, (q_num, start_y) in enumerate(sorted_questions):
            if q_num in extracted[current_year]:
                continue
            
            # Find end Y (next question or end of page)
            if i + 1 < len(sorted_questions):
                end_y = sorted_questions[i + 1][1]
            else:
                end_y = PAGE_HEIGHT - 30
            
            # Convert to image coordinates
            start_y_px = max(0, int((start_y - 10) * scale_y))
            end_y_px = min(img_height, int(end_y * scale_y))
            
            if end_y_px <= start_y_px:
                end_y_px = min(start_y_px + 150, img_height)
            
            # Crop question image
            try:
                crop_box = (0, start_y_px, img_width, end_y_px)
                q_img = page_img.crop(crop_box)
                
                # Save
                output_name = f"{current_year}_q{q_num}.png"
                output_path = os.path.join(OUTPUT_DIR, output_name)
                q_img.save(output_path, "PNG")
                
                extracted[current_year].add(q_num)
            except Exception as e:
                print(f"Error extracting {current_year} Q{q_num}: {e}")
    
    # Report results
    print("\nExtraction Results:")
    print("-" * 50)
    total_extracted = 0
    for year in sorted(EXPECTED_QUESTIONS.keys()):
        expected = EXPECTED_QUESTIONS[year]
        actual = len(extracted[year])
        missing = expected - actual
        total_extracted += actual
        status = "✓" if missing == 0 else f"Missing: {missing}"
        print(f"  {year}: {actual}/{expected} questions {status}")
    
    print(f"\nTotal: {total_extracted} questions")
    return extracted

# Run
print("Extracting ALL Physics questions...")
extracted = extract_all_questions()
