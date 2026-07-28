#!/usr/bin/env python3
"""
Physics Question Extraction using VLM
Extracts questions from PDF as images with accurate boundaries
"""

import os
import sys
import json
import subprocess
import re
from pathlib import Path
from pdf2image import convert_from_path
from PIL import Image

# Configuration
PDF_PATH = "/home/z/my-project/students/cbt/pdfs/physics.pdf"
OUTPUT_DIR = "/home/z/my-project/students/cbt/images/physics_questions"
TEMP_DIR = "/home/z/my-project/students/cbt/temp_pages"

# Year configurations - 0-indexed pages
# Based on PDF structure: each year starts after the previous one
YEAR_RANGES = {
    "2010": {"start": 1, "end": 11, "questions": 50},   # Pages 2-12
    "2011": {"start": 12, "end": 22, "questions": 50},  # Pages 13-23
    "2012": {"start": 23, "end": 33, "questions": 50},  # Pages 24-34
    "2013": {"start": 34, "end": 44, "questions": 50},  # Pages 35-45
    "2014": {"start": 45, "end": 55, "questions": 50},  # Pages 46-56
    "2015": {"start": 56, "end": 64, "questions": 40},  # Pages 57-65
    "2016": {"start": 65, "end": 73, "questions": 40},  # Pages 66-74
    "2017": {"start": 74, "end": 82, "questions": 40},  # Pages 75-83
    "2018": {"start": 83, "end": 91, "questions": 40},  # Pages 84-91
}

def convert_pdf_to_images():
    """Convert PDF pages to high-resolution images"""
    print("Converting PDF to images...")
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    images = convert_from_path(PDF_PATH, dpi=200)
    paths = []
    
    for i, img in enumerate(images):
        path = os.path.join(TEMP_DIR, f"page_{i+1:03d}.png")
        img.save(path, "PNG")
        paths.append(path)
        print(f"  Saved page {i+1}/{len(images)}")
    
    return paths

def analyze_page_with_vlm(image_path):
    """Use VLM to identify question boundaries on a page"""
    
    prompt = """Analyze this JAMB Physics exam page.

Identify ALL questions visible on this page. For each question:
1. Question number
2. Bounding box as [x1, y1, x2, y2] in percentages (0-100) of page dimensions
3. Does it have a diagram?

Rules:
- Include question text and diagrams, but NOT options (A, B, C, D)
- Bounding box should encompass the entire question content

Return JSON array only:
[{"num": 1, "bbox": [left%, top%, right%, bottom%], "has_diagram": false}]"""

    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", prompt, "-i", image_path],
            capture_output=True,
            text=True,
            timeout=120
        )
        
        if result.returncode == 0:
            output = result.stdout.strip()
            # Extract JSON array from response
            json_match = re.search(r'\[.*\]', output, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        else:
            print(f"  VLM error: {result.stderr}")
    except Exception as e:
        print(f"  Analysis error: {e}")
    
    return []

def extract_question(page_path, bbox, output_path):
    """Extract question region from page image"""
    with Image.open(page_path) as img:
        width, height = img.size
        
        # Convert percentage to pixels
        x1 = int(bbox[0] * width / 100)
        y1 = int(bbox[1] * height / 100)
        x2 = int(bbox[2] * width / 100)
        y2 = int(bbox[3] * height / 100)
        
        # Add padding
        pad = 10
        x1 = max(0, x1 - pad)
        y1 = max(0, y1 - pad)
        x2 = min(width, x2 + pad)
        y2 = min(height, y2 + pad)
        
        # Crop and save
        cropped = img.crop((x1, y1, x2, y2))
        cropped.save(output_path, "PNG")
        return True
    return False

def process_year(year, config, page_paths):
    """Process all pages for a year and extract questions"""
    print(f"\n{'='*50}")
    print(f"Processing {year}")
    print(f"{'='*50}")
    
    questions = []
    all_found = {}
    
    for page_idx in range(config["start"], min(config["end"] + 1, len(page_paths))):
        page_path = page_paths[page_idx]
        print(f"\n  Analyzing page {page_idx + 1}...")
        
        vlm_results = analyze_page_with_vlm(page_path)
        print(f"    Found {len(vlm_results)} questions")
        
        for q in vlm_results:
            q_num = q.get("num", 0)
            if q_num > 0 and q_num <= config["questions"]:
                all_found[q_num] = {
                    "page_idx": page_idx,
                    "bbox": q["bbox"],
                    "has_diagram": q.get("has_diagram", False)
                }
                print(f"    - Question {q_num}")
    
    # Extract images
    print(f"\n  Extracting {len(all_found)} question images...")
    for q_num, q_data in sorted(all_found.items()):
        output_path = os.path.join(OUTPUT_DIR, f"{year}_q{q_num}.png")
        page_path = page_paths[q_data["page_idx"]]
        
        try:
            extract_question(page_path, q_data["bbox"], output_path)
            questions.append({
                "num": q_num,
                "image": f"images/physics_questions/{year}_q{q_num}.png",
                "has_diagram": q_data["has_diagram"]
            })
        except Exception as e:
            print(f"    Error extracting Q{q_num}: {e}")
    
    return questions

def main():
    print("="*60)
    print("Physics Question Extraction with VLM")
    print("="*60)
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Convert PDF to images
    page_paths = convert_pdf_to_images()
    
    # Process each year
    all_questions = {}
    
    for year, config in YEAR_RANGES.items():
        questions = process_year(year, config, page_paths)
        all_questions[year] = questions
        
        expected = config["questions"]
        actual = len(questions)
        status = "OK" if actual == expected else f"Missing {expected - actual}"
        print(f"\n  {year}: {actual}/{expected} - {status}")
    
    # Save metadata
    meta_path = os.path.join(OUTPUT_DIR, "questions_metadata.json")
    with open(meta_path, "w") as f:
        json.dump(all_questions, f, indent=2)
    print(f"\nMetadata saved to {meta_path}")
    
    # Cleanup temp files
    print("\nCleaning up temp files...")
    import shutil
    shutil.rmtree(TEMP_DIR, ignore_errors=True)
    
    # Summary
    print("\n" + "="*60)
    print("EXTRACTION COMPLETE")
    print("="*60)
    total = sum(len(q) for q in all_questions.values())
    print(f"Total questions extracted: {total}")

if __name__ == "__main__":
    main()
