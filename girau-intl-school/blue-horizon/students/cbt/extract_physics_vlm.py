#!/usr/bin/env python3
"""
Extract Physics questions from PDF using VLM for accurate boundary detection.
Uses AgentQL-style intelligent extraction.
"""

import os
import json
import subprocess
import re
from pathlib import Path
from PIL import Image

# Configuration
PDF_PATH = "/home/z/my-project/students/cbt/pdfs/physics.pdf"
OUTPUT_DIR = Path("/home/z/my-project/students/cbt/images/physics_questions")
PAGES_DIR = Path("/home/z/my-project/students/cbt/pdf_pages/physics_vlm")
TEMP_DIR = Path("/home/z/my-project/temp_extractions")

# Year and page mapping for Physics
YEAR_PAGES = {
    "2010": {"start": 2, "end": 11, "questions": 50},
    "2011": {"start": 12, "end": 21, "questions": 50},
    "2012": {"start": 22, "end": 31, "questions": 50},
    "2013": {"start": 33, "end": 41, "questions": 50},
    "2014": {"start": 43, "end": 51, "questions": 50},
    "2015": {"start": 53, "end": 60, "questions": 40},
    "2016": {"start": 62, "end": 69, "questions": 40},
    "2017": {"start": 71, "end": 78, "questions": 40},
    "2018": {"start": 80, "end": 87, "questions": 40},
}

def convert_pdf_page_to_image(page_num, output_dir):
    """Convert a single PDF page to high-res PNG image."""
    output_dir.mkdir(parents=True, exist_ok=True)
    output_path = output_dir / f"page_{page_num:03d}.png"
    
    if output_path.exists():
        return output_path
    
    cmd = [
        "pdftoppm", "-f", str(page_num), "-l", str(page_num),
        "-png", "-r", "200", PDF_PATH, str(output_dir / f"page_{page_num:03d}")
    ]
    subprocess.run(cmd, capture_output=True)
    
    # pdftoppm creates file with suffix like page_001-1.png
    for f in output_dir.iterdir():
        if f.name.startswith(f"page_{page_num:03d}") and f.suffix == ".png":
            f.rename(output_path)
            return output_path
    
    return output_path if output_path.exists() else None

def vlm_analyze_page(image_path):
    """Use VLM to identify question boundaries on a page."""
    prompt = """Analyze this JAMB Physics exam page carefully.

Look for question numbers (like "1.", "2.", "3.", etc.) and identify the Y-coordinate boundaries for EACH question.

IMPORTANT: Each question includes:
1. The question number and text
2. Any diagrams or figures associated with the question
3. The options (A, B, C, D) - BUT DO NOT INCLUDE OPTIONS IN THE CROP

The Y-coordinate boundaries should:
- y_start: The top edge of the question (where the question number starts)
- y_end: The bottom edge BEFORE the options start (just before "A.", "B.", etc.)

The image height is 2339 pixels. Questions are typically spaced throughout the page.

Return ONLY a JSON array (no other text):
[{"q": 1, "y_start": 50, "y_end": 300}, {"q": 2, "y_start": 350, "y_end": 600}, ...]

If a question has a diagram, include "has_diagram": true.
"""

    output_file = TEMP_DIR / f"vlm_{image_path.stem}.json"
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    cmd = [
        "z-ai", "vision",
        "-p", prompt,
        "-i", str(image_path),
        "-o", str(output_file)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if not output_file.exists():
        print(f"VLM failed for {image_path}")
        return None
    
    with open(output_file) as f:
        data = json.load(f)
    
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    
    # Extract JSON from response
    try:
        # Find JSON array in response
        match = re.search(r'\[.*\]', content, re.DOTALL)
        if match:
            return json.loads(match.group())
    except json.JSONDecodeError:
        pass
    
    return None

def crop_question(image_path, y_start, y_end, output_path, padding=10):
    """Crop a question from the page image."""
    img = Image.open(image_path)
    width, height = img.size
    
    # Ensure bounds are within image
    y_start = max(0, y_start - padding)
    y_end = min(height, y_end + padding)
    
    # Crop: (left, top, right, bottom)
    cropped = img.crop((0, y_start, width, y_end))
    cropped.save(output_path)
    
    return output_path

def extract_year_questions(year, year_info):
    """Extract all questions for a given year."""
    print(f"\n=== Extracting {year} questions ===")
    
    questions_data = []
    question_num = 1
    
    for page_num in range(year_info["start"], year_info["end"] + 1):
        print(f"  Processing page {page_num}...")
        
        # Convert PDF page to image
        page_image = convert_pdf_page_to_image(page_num, PAGES_DIR)
        if not page_image or not page_image.exists():
            print(f"    ERROR: Could not convert page {page_num}")
            continue
        
        # Get question boundaries from VLM
        boundaries = vlm_analyze_page(page_image)
        if not boundaries:
            print(f"    ERROR: VLM analysis failed for page {page_num}")
            continue
        
        print(f"    Found {len(boundaries)} questions on page {page_num}")
        
        # Crop each question
        for q_info in boundaries:
            q_num = q_info.get("q", question_num)
            y_start = q_info.get("y_start", 0)
            y_end = q_info.get("y_end", 0)
            has_diagram = q_info.get("has_diagram", False)
            
            # Validate bounds
            if y_end <= y_start or y_start < 0:
                print(f"    Invalid bounds for Q{q_num}: {y_start}-{y_end}")
                continue
            
            # Create output filename
            output_file = OUTPUT_DIR / f"{year}_q{question_num}.png"
            
            # Crop the question
            try:
                crop_question(page_image, y_start, y_end, output_file)
                print(f"    Saved {output_file.name}")
                
                questions_data.append({
                    "id": f"phy_{year}_{question_num}",
                    "question_num": question_num,
                    "page": page_num,
                    "y_start": y_start,
                    "y_end": y_end,
                    "has_diagram": has_diagram,
                    "image": f"images/physics_questions/{year}_q{question_num}.png"
                })
                
                question_num += 1
            except Exception as e:
                print(f"    ERROR cropping Q{q_num}: {e}")
    
    return questions_data

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    
    all_questions = {}
    
    for year, year_info in YEAR_PAGES.items():
        questions = extract_year_questions(year, year_info)
        all_questions[year] = questions
        print(f"\nExtracted {len(questions)} questions for {year}")
    
    # Save extraction data
    output_file = Path("/home/z/my-project/students/cbt/data/physics_questions_vlm.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)
    
    with open(output_file, "w") as f:
        json.dump(all_questions, f, indent=2)
    
    print(f"\n=== Extraction complete ===")
    print(f"Total questions extracted: {sum(len(q) for q in all_questions.values())}")
    print(f"Data saved to: {output_file}")

if __name__ == "__main__":
    main()
