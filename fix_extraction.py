#!/usr/bin/env python3
"""
Better extraction of all Physics questions from PDF.
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

def find_all_questions_in_text(text):
    """Find all question patterns in text"""
    # Pattern to match question numbers at start of lines
    # Questions can be like "1. " or "1." followed by text
    questions = []
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line = line.strip()
        # Match patterns like "1. " at start of line
        match = re.match(r'^(\d+)\.\s*(.*)$', line)
        if match:
            q_num = int(match.group(1))
            questions.append({
                'num': q_num,
                'text': match.group(2),
                'line_idx': i
            })
    
    return questions

def get_year_for_page(page_num, pages_data):
    """Determine which year a page belongs to"""
    # Year to page mapping
    year_pages = {
        '2010': list(range(2, 12)),   # Pages 2-11
        '2011': list(range(12, 22)),  # Pages 12-21
        '2012': list(range(22, 32)),  # Pages 22-31
        '2013': list(range(32, 43)),  # Pages 32-42
        '2014': list(range(43, 53)),  # Pages 43-52
        '2015': list(range(53, 63)),  # Pages 53-62
        '2016': list(range(63, 73)),  # Pages 63-72
        '2017': list(range(73, 82)),  # Pages 73-81
        '2018': list(range(82, 90)),  # Pages 82-89
    }
    
    for year, pages in year_pages.items():
        if page_num in pages:
            return year
    return None

def extract_all_questions():
    """Extract all questions properly"""
    pages_data = full_extract.get('pages', [])
    
    all_questions = {}
    current_year = None
    
    for page_data in pages_data:
        page_num = page_data.get('page_number', 0)
        text = page_data.get('text', '')
        images = page_data.get('images', [])
        
        # Get year for this page
        year = get_year_for_page(page_num, pages_data)
        if year:
            current_year = year
            if current_year not in all_questions:
                all_questions[current_year] = {}
        
        if not current_year:
            continue
        
        # Find all questions in this page
        questions = find_all_questions_in_text(text)
        
        for q in questions:
            q_num = q['num']
            # Skip if already found (prefer first occurrence)
            if q_num not in all_questions[current_year]:
                all_questions[current_year][q_num] = {
                    'num': q_num,
                    'text': q['text'],
                    'page': page_num,
                    'line_idx': q['line_idx'],
                    'has_diagram': False
                }
        
        # Check for diagrams
        for img in images:
            img_y = img['positions'][0]['y']
            # Mark nearby questions as having diagrams
            for q_num, q_data in all_questions[current_year].items():
                if q_data['page'] == page_num:
                    q_data['has_diagram'] = True
    
    return all_questions

# Extract questions
print("Extracting all questions...")
all_questions = extract_all_questions()

# Report
print("\n=== Extraction Results ===")
total_expected = 0
total_got = 0

for year in sorted(EXPECTED.keys()):
    expected = EXPECTED[year]
    got = len(all_questions.get(year, {}))
    missing = set(range(1, expected + 1)) - set(all_questions.get(year, {}).keys())
    total_expected += expected
    total_got += got
    
    if missing:
        print(f"{year}: Expected {expected}, Got {got}, Missing: {sorted(missing)[:10]}{'...' if len(missing) > 10 else ''}")
    else:
        print(f"{year}: Expected {expected}, Got {got} ✓ COMPLETE")

print(f"\nTotal: Expected {total_expected}, Got {total_got}")

# Save the improved extraction
output = {}
for year, qs in all_questions.items():
    output[year] = [qs[num] for num in sorted(qs.keys())]

with open(os.path.join(OUTPUT_DIR, 'all_questions_fixed.json'), 'w') as f:
    json.dump(output, f, indent=2)

print("\nSaved to all_questions_fixed.json")
