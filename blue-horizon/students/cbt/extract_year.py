#!/usr/bin/env python3
"""
Physics Question Extraction - Step by step processing
"""

import os
import json
import subprocess
import re
from pdf2image import convert_from_path
from PIL import Image

PDF_PATH = "/home/z/my-project/students/cbt/pdfs/physics.pdf"
OUTPUT_DIR = "/home/z/my-project/students/cbt/images/physics_questions"
TEMP_DIR = "/home/z/my-project/students/cbt/temp_pages"

def convert_page_to_image(page_num):
    """Convert a single PDF page to image"""
    os.makedirs(TEMP_DIR, exist_ok=True)
    images = convert_from_path(PDF_PATH, first_page=page_num, last_page=page_num, dpi=200)
    path = os.path.join(TEMP_DIR, f"page_{page_num:03d}.png")
    images[0].save(path, "PNG")
    return path, images[0].size

def analyze_page(image_path):
    """Analyze a page with VLM"""
    prompt = """Analyze this JAMB Physics exam page.

Identify ALL questions visible. For each question provide:
1. Question number
2. Bounding box as [left%, top%, right%, bottom%] (percentages 0-100)
3. Whether it has a diagram

IMPORTANT: 
- Include question text and diagrams ONLY
- Do NOT include the options (A, B, C, D)

Return ONLY a JSON array:
[{"num": 1, "bbox": [5, 10, 95, 40], "has_diagram": false}]"""

    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", prompt, "-i", image_path],
            capture_output=True, text=True, timeout=90
        )
        if result.returncode == 0:
            match = re.search(r'\[.*\]', result.stdout, re.DOTALL)
            if match:
                return json.loads(match.group())
    except Exception as e:
        print(f"Error: {e}")
    return []

def extract_question(page_path, bbox, output_path):
    """Extract question from page"""
    with Image.open(page_path) as img:
        w, h = img.size
        x1 = max(0, int(bbox[0] * w / 100) - 10)
        y1 = max(0, int(bbox[1] * h / 100) - 10)
        x2 = min(w, int(bbox[2] * w / 100) + 10)
        y2 = min(h, int(bbox[3] * h / 100) + 10)
        img.crop((x1, y1, x2, y2)).save(output_path, "PNG")
        return True

def process_year(year, start_page, end_page, num_questions):
    """Process one year's questions"""
    print(f"\n{'='*50}")
    print(f"Processing {year} (pages {start_page}-{end_page})")
    print(f"{'='*50}")
    
    questions = {}
    
    for page_num in range(start_page, end_page + 1):
        print(f"\n  Page {page_num}...")
        page_path, dimensions = convert_page_to_image(page_num)
        print(f"    Converted: {dimensions}")
        
        results = analyze_page(page_path)
        print(f"    Found {len(results)} questions")
        
        for q in results:
            q_num = q.get("num", 0)
            if q_num > 0 and q_num <= num_questions:
                questions[q_num] = {
                    "bbox": q["bbox"],
                    "page": page_num,
                    "page_path": page_path,
                    "has_diagram": q.get("has_diagram", False)
                }
                print(f"      Q{q_num}")
    
    # Extract images
    print(f"\n  Extracting {len(questions)} images...")
    extracted = []
    for q_num in sorted(questions.keys()):
        q = questions[q_num]
        output = os.path.join(OUTPUT_DIR, f"{year}_q{q_num}.png")
        try:
            extract_question(q["page_path"], q["bbox"], output)
            extracted.append({
                "num": q_num,
                "image": f"images/physics_questions/{year}_q{q_num}.png",
                "has_diagram": q["has_diagram"]
            })
            print(f"    Q{q_num} extracted")
        except Exception as e:
            print(f"    Q{q_num} error: {e}")
    
    return extracted

if __name__ == "__main__":
    import sys
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Process one year at a time
    years = [
        ("2010", 2, 12, 50),
        ("2011", 13, 23, 50),
        ("2012", 24, 34, 50),
        ("2013", 35, 45, 50),
        ("2014", 46, 56, 50),
        ("2015", 57, 65, 40),
        ("2016", 66, 74, 40),
        ("2017", 75, 83, 40),
        ("2018", 84, 91, 40),
    ]
    
    # Get year from command line or process all
    year_arg = sys.argv[1] if len(sys.argv) > 1 else None
    
    all_results = {}
    for year, start, end, num in years:
        if year_arg and year != year_arg:
            continue
        result = process_year(year, start, end, num)
        all_results[year] = result
        print(f"\n{year}: {len(result)}/{num} extracted")
    
    # Save metadata
    meta_path = os.path.join(OUTPUT_DIR, "questions_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"\nMetadata saved to {meta_path}")
