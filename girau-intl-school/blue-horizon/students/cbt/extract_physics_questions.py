#!/usr/bin/env python3
"""
Physics Question Extraction using VLM (Vision Language Model)
Extracts questions from PDF as images with accurate boundaries
"""

import os
import sys
import json
import base64
import re
from pathlib import Path
from pdf2image import convert_from_path
import requests

# Configuration
PDF_PATH = "/home/z/my-project/students/cbt/pdfs/physics.pdf"
OUTPUT_DIR = "/home/z/my-project/students/cbt/images/physics_questions"
VLM_API_URL = "https://api.zukijourney.com/v1/chat/completions"
API_KEY = "sk-zuki-7f8e9d2a1b3c4f5e6a7b8c9d0e1f2a3b"  # Replace with actual key

# Year configurations - pages are 0-indexed
YEAR_CONFIG = {
    "2010": {"start_page": 1, "end_page": 10, "num_questions": 50},  # Pages 2-11 in PDF
    "2011": {"start_page": 11, "end_page": 20, "num_questions": 50},  # Pages 12-21
    "2012": {"start_page": 21, "end_page": 30, "num_questions": 50},  # Pages 22-31
    "2013": {"start_page": 31, "end_page": 40, "num_questions": 50},  # Pages 32-41
    "2014": {"start_page": 41, "end_page": 50, "num_questions": 50},  # Pages 42-51
    "2015": {"start_page": 51, "end_page": 58, "num_questions": 40},  # Pages 52-59
    "2016": {"start_page": 59, "end_page": 66, "num_questions": 40},  # Pages 60-67
    "2017": {"start_page": 67, "end_page": 74, "num_questions": 40},  # Pages 68-75
    "2018": {"start_page": 75, "end_page": 82, "num_questions": 40},  # Pages 76-83
}

def encode_image_to_base64(image_path):
    """Convert image to base64 string"""
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def analyze_page_with_vlm(image_path, year, page_num):
    """
    Use VLM to analyze a page and identify question boundaries.
    Returns a list of questions with their bounding boxes.
    """
    base64_image = encode_image_to_base64(image_path)
    
    prompt = f"""Analyze this JAMB Physics exam page from year {year}.

Your task: Identify ALL questions visible on this page and extract their bounding boxes.

For EACH question, identify:
1. The question number
2. The bounding box of the ENTIRE question (including any diagrams/figures) - but EXCLUDING the options (A, B, C, D)
3. Whether the question has a diagram

IMPORTANT RULES:
- Each question includes: the question number, question text, and any associated diagram
- Do NOT include the options (A,..., D) in the bounding box
- If a question spans multiple columns, include the full question
- If there's a diagram/figure, include it in the bounding box

Return a JSON array with this format:
[
  {{
    "question_num": 1,
    "bbox": [x1, y1, x2, y2],  // normalized 0-1000
    "has_diagram": true/false,
    "question_preview": "First 50 chars of question text..."
  }}
]

Only return the JSON array, no other text."""

    try:
        response = requests.post(
            VLM_API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-4o",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
                        ]
                    }
                ],
                "max_tokens": 2000
            },
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            content = result["choices"][0]["message"]["content"]
            # Extract JSON from response
            json_match = re.search(r'\[.*\]', content, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
        else:
            print(f"VLM API error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"VLM analysis error: {e}")
    
    return []

def convert_pdf_to_images(pdf_path, output_dir, dpi=200):
    """Convert PDF pages to images"""
    print(f"Converting PDF to images at {dpi} DPI...")
    images = convert_from_path(pdf_path, dpi=dpi)
    
    os.makedirs(output_dir, exist_ok=True)
    
    image_paths = []
    for i, image in enumerate(images):
        image_path = os.path.join(output_dir, f"page_{i+1:03d}.png")
        image.save(image_path, "PNG")
        image_paths.append(image_path)
        print(f"  Saved page {i+1}/{len(images)}")
    
    return image_paths

def extract_question_image(page_image_path, bbox, output_path, page_width, page_height):
    """Extract a question region from a page image"""
    from PIL import Image
    
    # Convert normalized coordinates (0-1000) to pixel coordinates
    x1 = int(bbox[0] * page_width / 1000)
    y1 = int(bbox[1] * page_height / 1000)
    x2 = int(bbox[2] * page_width / 1000)
    y2 = int(bbox[3] * page_height / 1000)
    
    # Add small padding
    padding = 5
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(page_width, x2 + padding)
    y2 = min(page_height, y2 + padding)
    
    # Open and crop
    with Image.open(page_image_path) as img:
        cropped = img.crop((x1, y1, x2, y2))
        cropped.save(output_path, "PNG")
    
    return output_path

def process_year(year, config, page_images, output_dir):
    """Process all questions for a specific year"""
    print(f"\n{'='*50}")
    print(f"Processing year {year}")
    print(f"{'='*50}")
    
    questions = []
    start_page = config["start_page"]
    end_page = config["end_page"]
    
    # Collect all questions from all pages of this year
    all_page_questions = []
    
    for page_idx in range(start_page, min(end_page + 1, len(page_images))):
        page_path = page_images[page_idx]
        print(f"\nAnalyzing page {page_idx + 1}...")
        
        # Get page dimensions
        from PIL import Image
        with Image.open(page_path) as img:
            page_width, page_height = img.size
        
        # Analyze with VLM
        vlm_results = analyze_page_with_vlm(page_path, year, page_idx)
        
        for q in vlm_results:
            q["page_idx"] = page_idx
            q["page_width"] = page_width
            q["page_height"] = page_height
            q["page_path"] = page_path
            all_page_questions.append(q)
    
    # Sort by question number
    all_page_questions.sort(key=lambda x: x["question_num"])
    
    # Extract each question image
    for q in all_page_questions:
        q_num = q["question_num"]
        output_path = os.path.join(output_dir, f"{year}_q{q_num}.png")
        
        try:
            extract_question_image(
                q["page_path"],
                q["bbox"],
                output_path,
                q["page_width"],
                q["page_height"]
            )
            
            questions.append({
                "num": q_num,
                "image": f"images/physics_questions/{year}_q{q_num}.png",
                "has_diagram": q.get("has_diagram", False),
                "page": q["page_idx"] + 1
            })
            print(f"  Extracted question {q_num}")
        except Exception as e:
            print(f"  Error extracting question {q_num}: {e}")
    
    return questions

def main():
    """Main extraction process"""
    print("="*60)
    print("Physics Question Extraction using VLM")
    print("="*60)
    
    # Create output directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Convert PDF to images
    page_images = convert_pdf_to_images(PDF_PATH, OUTPUT_DIR, dpi=200)
    print(f"\nConverted {len(page_images)} pages")
    
    # Process each year
    all_questions = {}
    
    for year, config in YEAR_CONFIG.items():
        questions = process_year(year, config, page_images, OUTPUT_DIR)
        all_questions[year] = questions
        print(f"\nYear {year}: Extracted {len(questions)} questions")
    
    # Save metadata
    metadata_path = os.path.join(OUTPUT_DIR, "extraction_metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(all_questions, f, indent=2)
    print(f"\nSaved metadata to {metadata_path}")
    
    # Summary
    print("\n" + "="*60)
    print("EXTRACTION SUMMARY")
    print("="*60)
    total = 0
    for year, questions in all_questions.items():
        count = len(questions)
        total += count
        expected = YEAR_CONFIG[year]["num_questions"]
        status = "OK" if count == expected else f"MISSING {expected - count}"
        print(f"  {year}: {count}/{expected} questions - {status}")
    print(f"\nTotal extracted: {total} questions")

if __name__ == "__main__":
    main()
