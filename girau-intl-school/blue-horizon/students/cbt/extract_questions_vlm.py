#!/usr/bin/env python3
"""
Extract Physics questions from PDF using VLM for accurate boundary detection.
This script processes each page individually and extracts question images.
"""

import os
import json
import subprocess
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import shutil

# Configuration
PDF_PATH = Path("/home/z/my-project/students/cbt/pdfs/physics.pdf")
PAGES_DIR = Path("/home/z/my-project/students/cbt/pdf_pages/physics_vlm")
OUTPUT_DIR = Path("/home/z/my-project/students/cbt/images/physics_questions_vlm")
TEMP_DIR = Path("/home/z/my-project/temp_extractions")
DATA_DIR = Path("/home/z/my-project/students/cbt/data")

# Year and page mapping
YEAR_PAGES = {
    "2010": {"start": 2, "end": 11, "questions": 50},
}

def create_annotated_page(image_path, output_path):
    """Create a version of the page with Y-coordinate grid."""
    img = Image.open(image_path)
    draw = ImageDraw.Draw(img)
    width, height = img.size
    
    # Draw grid lines every 100 pixels with labels
    for y in range(0, height, 100):
        draw.line([(0, y), (width, y)], fill=(255, 0, 0), width=1)
        draw.text((5, y+2), str(y), fill=(255, 0, 0))
    
    img.save(output_path)
    return width, height

def vlm_analyze(image_path, prompt):
    """Use VLM to analyze an image and return the result."""
    output_file = TEMP_DIR / f"vlm_{image_path.stem}.json"
    
    cmd = [
        "z-ai", "vision",
        "-p", prompt,
        "-i", str(image_path),
        "-o", str(output_file)
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if not output_file.exists():
        return None
    
    with open(output_file) as f:
        data = json.load(f)
    
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
    return content

def extract_question_boundaries(page_image_path, page_num):
    """Extract question boundaries from a page using VLM."""
    # Create annotated version with grid
    annotated_path = TEMP_DIR / f"page_{page_num:03d}_annotated.png"
    width, height = create_annotated_page(page_image_path, annotated_path)
    
    # First, get the text content to understand what questions are on the page
    text_prompt = """Read and extract all text from this JAMB Physics exam page.

For each question, tell me:
1. The question number (like 1, 2, 3, etc.)
2. The first 15 words of the question text
3. Whether there's a diagram (yes/no)

Format your response as:
Q1: [first 15 words] | Diagram: yes/no
Q2: [first 15 words] | Diagram: yes/no
..."""

    text_content = vlm_analyze(page_image_path, text_prompt)
    print(f"  Text content:\n{text_content[:500]}")
    
    # Now get the boundaries using the annotated image
    bounds_prompt = f"""This is a JAMB Physics exam page with RED grid lines showing Y-coordinates every 100 pixels.
The image is {width}x{height} pixels.

Based on the text content, identify the EXACT Y-coordinates for each question:

For each question:
- y_start: Y coordinate where the question NUMBER starts (where "1.", "2.", etc. appears)
- y_end: Y coordinate where the question CONTENT ends (just BEFORE "A.", "B.", "C.", "D." options)

CRITICAL INSTRUCTIONS:
1. Questions flow from TOP to BOTTOM of the page
2. Question numbers are at the LEFT margin
3. Each question includes: number, text, and any diagram
4. DO NOT include the options (A, B, C, D) in the boundary
5. The boundaries should NOT overlap - each question has its own region

Return ONLY a JSON array (no other text):
[{{"q": 1, "y_start": 70, "y_end": 300, "has_diagram": false}}, ...]

Use the grid lines to estimate Y coordinates accurately."""

    bounds_content = vlm_analyze(annotated_path, bounds_prompt)
    
    # Parse JSON from response
    try:
        match = re.search(r'\[.*\]', bounds_content, re.DOTALL)
        if match:
            return json.loads(match.group())
    except json.JSONDecodeError as e:
        print(f"  Error parsing boundaries: {e}")
        print(f"  Raw response: {bounds_content[:500]}")
    
    return None

def crop_questions(page_image_path, boundaries, output_prefix, start_q_num):
    """Crop questions from a page using the provided boundaries."""
    img = Image.open(page_image_path)
    width, height = img.size
    
    questions_data = []
    q_num = start_q_num
    
    # Sort boundaries by y_start to ensure correct order
    boundaries = sorted(boundaries, key=lambda x: x.get('y_start', 0))
    
    for b in boundaries:
        y_start = b.get('y_start', 0)
        y_end = b.get('y_end', 0)
        has_diagram = b.get('has_diagram', False)
        
        # Validate bounds
        if y_end <= y_start or y_start < 0 or y_end > height:
            print(f"    Invalid bounds for Q{q_num}: {y_start}-{y_end}")
            continue
        
        # Add small padding
        y_start = max(0, y_start - 10)
        y_end = min(height, y_end + 10)
        
        # Crop
        output_path = OUTPUT_DIR / f"{output_prefix}_q{q_num}.png"
        cropped = img.crop((0, y_start, width, y_end))
        cropped.save(output_path)
        
        print(f"    Saved Q{q_num}: Y {y_start}-{y_end} ({cropped.size[0]}x{cropped.size[1]})")
        
        questions_data.append({
            "id": f"phy_{output_prefix}_{q_num}",
            "question_num": q_num,
            "y_start": y_start,
            "y_end": y_end,
            "has_diagram": has_diagram,
            "image": f"images/physics_questions_vlm/{output_prefix}_q{q_num}.png"
        })
        
        q_num += 1
    
    return questions_data, q_num

def main():
    # Create directories
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    TEMP_DIR.mkdir(parents=True, exist_ok=True)
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    all_questions = {}
    
    for year, year_info in YEAR_PAGES.items():
        print(f"\n=== Processing {year} ===")
        year_questions = []
        q_num = 1
        
        for page_num in range(year_info["start"], year_info["end"] + 1):
            print(f"\n  Page {page_num}:")
            
            # Find the page image
            page_image = PAGES_DIR / f"page-{page_num:02d}.png"
            if not page_image.exists():
                # Try alternative naming
                page_image = PAGES_DIR / f"page_{page_num:03d}.png"
            
            if not page_image.exists():
                print(f"    ERROR: Page image not found")
                continue
            
            # Extract boundaries
            boundaries = extract_question_boundaries(page_image, page_num)
            if not boundaries:
                print(f"    ERROR: Could not extract boundaries")
                continue
            
            print(f"    Found {len(boundaries)} questions")
            
            # Crop questions
            questions, q_num = crop_questions(
                page_image, boundaries, year, q_num
            )
            year_questions.extend(questions)
        
        all_questions[year] = year_questions
        print(f"\n  Total questions for {year}: {len(year_questions)}")
    
    # Save extraction data
    output_file = DATA_DIR / "physics_questions_vlm.json"
    with open(output_file, "w") as f:
        json.dump(all_questions, f, indent=2)
    
    print(f"\n=== Extraction complete ===")
    print(f"Data saved to: {output_file}")

if __name__ == "__main__":
    main()
