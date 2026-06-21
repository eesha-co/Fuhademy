#!/usr/bin/env python3
"""
Simple approach: Extract questions by dividing pages into sections.
Each page typically has 4-5 questions.
"""

import os
from PIL import Image

# Paths
PAGES_DIR = "students/cbt/pdf_pages/physics"
OUTPUT_DIR = "students/cbt/images/physics_questions"

# Year to page mapping and questions per page
YEAR_DATA = {
    '2010': {'pages': range(2, 12), 'total': 50},
    '2011': {'pages': range(12, 22), 'total': 50},
    '2012': {'pages': range(22, 32), 'total': 50},
    '2013': {'pages': range(32, 43), 'total': 50},
    '2014': {'pages': range(43, 53), 'total': 50},
    '2015': {'pages': range(53, 63), 'total': 40},
    '2016': {'pages': range(63, 73), 'total': 40},
    '2017': {'pages': range(71, 80), 'total': 40},  # Starts at page 71
    '2018': {'pages': range(80, 88), 'total': 40},
}

def get_page_image(page_num):
    """Get the path to a page image"""
    page_str = f"page-{page_num:02d}.png"
    path = os.path.join(PAGES_DIR, page_str)
    if os.path.exists(path):
        return path
    return None

def extract_questions_from_page(page_path, page_num, year, q_start, q_end, output_dir):
    """Extract questions from a page by dividing into sections"""
    img = Image.open(page_path)
    width, height = img.size
    
    num_questions = q_end - q_start + 1
    
    # Margins (percentage of page)
    margin_top = int(height * 0.05)
    margin_bottom = int(height * 0.08)
    margin_sides = int(width * 0.02)
    
    usable_height = height - margin_top - margin_bottom
    usable_width = width - 2 * margin_sides
    
    # Height per question
    q_height = usable_height // num_questions
    
    created = []
    
    for i, q_num in enumerate(range(q_start, q_end + 1)):
        # Calculate crop box
        top = margin_top + (i * q_height)
        bottom = top + q_height if i < num_questions - 1 else height - margin_bottom
        
        # Crop
        crop_box = (margin_sides, top, width - margin_sides, bottom)
        
        try:
            q_img = img.crop(crop_box)
            output_name = f"{year}_q{q_num}.png"
            output_path = os.path.join(output_dir, output_name)
            q_img.save(output_path, "PNG")
            created.append(q_num)
        except Exception as e:
            print(f"  Error {year} Q{q_num}: {e}")
    
    return created

# Process each year
os.makedirs(OUTPUT_DIR, exist_ok=True)

total_created = 0

for year, data in YEAR_DATA.items():
    print(f"\nProcessing {year}...")
    
    pages = list(data['pages'])
    total_questions = data['total']
    
    # Calculate questions per page
    num_pages = len(pages)
    base_q_per_page = total_questions // num_pages
    extra_q = total_questions % num_pages
    
    created_count = 0
    q_counter = 1
    
    for i, page_num in enumerate(pages):
        # Number of questions on this page
        q_on_page = base_q_per_page + (1 if i < extra_q else 0)
        
        if q_counter > total_questions:
            break
        
        q_start = q_counter
        q_end = min(q_counter + q_on_page - 1, total_questions)
        
        page_path = get_page_image(page_num)
        if page_path:
            created = extract_questions_from_page(page_path, page_num, year, q_start, q_end, OUTPUT_DIR)
            created_count += len(created)
        
        q_counter = q_end + 1
    
    print(f"  Created {created_count} images")
    total_created += created_count

print(f"\n{'='*50}")
print(f"Total images created: {total_created}")
