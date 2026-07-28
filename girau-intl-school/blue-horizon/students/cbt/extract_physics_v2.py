#!/usr/bin/env python3
"""
Physics Question Extraction - Fixed version with pixel coordinates
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

# Page ranges for each year (1-indexed PDF page numbers)
YEAR_PAGES = {
    "2010": list(range(2, 13)),   # Pages 2-12
    "2011": list(range(13, 24)),  # Pages 13-23
    "2012": list(range(24, 35)),  # Pages 24-34
    "2013": list(range(35, 46)),  # Pages 35-45
    "2014": list(range(46, 57)),  # Pages 46-56
    "2015": list(range(57, 66)),  # Pages 57-65
    "2016": list(range(66, 75)),  # Pages 66-74
    "2017": list(range(75, 84)),  # Pages 75-83
    "2018": list(range(84, 92)),  # Pages 84-91
}

YEAR_QUESTION_COUNTS = {
    "2010": 50, "2011": 50, "2012": 50, "2013": 50, "2014": 50,
    "2015": 40, "2016": 40, "2017": 40, "2018": 40
}

def convert_page_to_image(page_num):
    """Convert a single PDF page to image"""
    os.makedirs(TEMP_DIR, exist_ok=True)
    images = convert_from_path(PDF_PATH, first_page=page_num, last_page=page_num, dpi=200)
    path = os.path.join(TEMP_DIR, f"page_{page_num:03d}.png")
    images[0].save(path, "PNG")
    return path

def analyze_page(image_path):
    """Analyze a page with VLM and get question bounding boxes"""
    
    prompt = """Analyze this Physics exam page carefully.

For EVERY question visible on this page, provide:
1. The question number
2. The bounding box in PIXELS as [x1, y1, x2, y2] where:
   - x1, y1 = top-left corner coordinates
   - x2, y2 = bottom-right corner coordinates
3. Whether the question has a diagram/figure

IMPORTANT RULES:
- Include the question number, question text, and any diagram
- Do NOT include the options (A, B, C, D)
- Use pixel coordinates from the image

Return ONLY a valid JSON array:
[{"num": 1, "bbox": [x1, y1, x2, y2], "has_diagram": false}]"""

    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", prompt, "-i", image_path],
            capture_output=True, text=True, timeout=120
        )
        
        if result.returncode == 0:
            # Extract JSON from response
            output = result.stdout
            # Find the content in the message
            json_match = re.search(r'"content":\s*"(\[.*?\])"', output, re.DOTALL)
            if json_match:
                # Unescape the JSON string
                json_str = json_match.group(1)
                json_str = json_str.replace('\\"', '"').replace('\\\\', '\\')
                return json.loads(json_str)
            # Try direct array match
            json_match2 = re.search(r'\[{.*?\]', output, re.DOTALL)
            if json_match2:
                return json.loads(json_match2.group())
    except Exception as e:
        print(f"    VLM Error: {e}")
    return []

def extract_question(page_path, bbox, output_path):
    """Extract question region from page image using pixel coordinates"""
    with Image.open(page_path) as img:
        width, height = img.size
        
        x1, y1, x2, y2 = bbox
        
        # Ensure coordinates are within image bounds
        x1 = max(0, min(x1, width))
        y1 = max(0, min(y1, height))
        x2 = max(0, min(x2, width))
        y2 = max(0, min(y2, height))
        
        # Add small padding
        pad = 5
        x1 = max(0, x1 - pad)
        y1 = max(0, y1 - pad)
        x2 = min(width, x2 + pad)
        y2 = min(height, y2 + pad)
        
        # Crop and save
        cropped = img.crop((x1, y1, x2, y2))
        cropped.save(output_path, "PNG")
        return True

def process_year(year):
    """Process all questions for a year"""
    print(f"\n{'='*50}")
    print(f"Processing {year}")
    print(f"{'='*50}")
    
    pages = YEAR_PAGES[year]
    num_questions = YEAR_QUESTION_COUNTS[year]
    questions = {}
    
    for page_num in pages:
        print(f"\n  Page {page_num}...")
        page_path = convert_page_to_image(page_num)
        
        results = analyze_page(page_path)
        print(f"    Found {len(results)} questions")
        
        for q in results:
            q_num = q.get("num", 0)
            if q_num > 0 and q_num <= num_questions:
                questions[q_num] = {
                    "bbox": q["bbox"],
                    "page_path": page_path,
                    "has_diagram": q.get("has_diagram", False)
                }
                print(f"      Q{q_num}: bbox={q['bbox']}")
    
    # Extract all question images
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
            print(f"    Q{q_num} saved")
        except Exception as e:
            print(f"    Q{q_num} error: {e}")
    
    expected = num_questions
    actual = len(extracted)
    print(f"\n  Result: {actual}/{expected} questions extracted")
    
    return extracted

def main():
    import sys
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Get year from command line or process all
    year_arg = sys.argv[1] if len(sys.argv) > 1 else None
    
    all_results = {}
    
    for year in YEAR_PAGES.keys():
        if year_arg and year != year_arg:
            continue
        result = process_year(year)
        all_results[year] = result
    
    # Save metadata
    meta_path = os.path.join(OUTPUT_DIR, "questions_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(all_results, f, indent=2)
    
    print(f"\n{'='*50}")
    print("SUMMARY")
    print(f"{'='*50}")
    total = 0
    for year, questions in all_results.items():
        count = len(questions)
        expected = YEAR_QUESTION_COUNTS[year]
        total += count
        status = "OK" if count == expected else f"Missing {expected - count}"
        print(f"  {year}: {count}/{expected} - {status}")
    print(f"\nTotal: {total} questions")
    print(f"Metadata saved to {meta_path}")

if __name__ == "__main__":
    main()
