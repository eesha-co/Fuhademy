#!/usr/bin/env python3
"""
Extract text from Physics question images using VLM.
Creates a JSON file with question text and only includes images for questions with diagrams.
"""

import os
import json
import subprocess
import time
from pathlib import Path

# Configuration
BASE_DIR = Path("/home/z/my-project/students/cbt")
IMAGES_DIR = BASE_DIR / "images" / "physics_questions"
OUTPUT_FILE = BASE_DIR / "data" / "physics_questions_text.json"

# VLM prompt for extracting question text
EXTRACTION_PROMPT = """Extract the question text from this image. This is a Physics exam question.

Instructions:
1. Extract ONLY the question text (the problem statement)
2. DO NOT include the options (A, B, C, D) - just the question
3. If there's a diagram or figure, describe it briefly in [brackets] like [diagram of a pulley system]
4. Preserve any mathematical formulas, equations, or symbols as they appear
5. If the question has sub-parts (i, ii, iii), include all of them

Return ONLY the question text, nothing else."""

def extract_text_from_image(image_path: str) -> str:
    """Use VLM CLI to extract text from an image."""
    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", EXTRACTION_PROMPT, "-i", image_path],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            # Parse the JSON response
            try:
                response = json.loads(result.stdout)
                return response.get("content", "").strip()
            except json.JSONDecodeError:
                # If not JSON, return the raw output
                return result.stdout.strip()
        else:
            print(f"Error processing {image_path}: {result.stderr}")
            return ""
    except subprocess.TimeoutExpired:
        print(f"Timeout processing {image_path}")
        return ""
    except Exception as e:
        print(f"Exception processing {image_path}: {e}")
        return ""

def has_diagram(image_path: str) -> bool:
    """Check if the question image contains a diagram using VLM."""
    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", "Does this image contain a diagram, figure, graph, or illustration? Answer only 'yes' or 'no'.", "-i", image_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            try:
                response = json.loads(result.stdout)
                content = response.get("content", "").lower()
                return "yes" in content
            except json.JSONDecodeError:
                return "yes" in result.stdout.lower()
        return False
    except:
        return False

def get_all_questions():
    """Get all question images organized by year."""
    questions = {}
    
    # Get all png files
    image_files = sorted(IMAGES_DIR.glob("*.png"))
    
    for img_path in image_files:
        filename = img_path.name
        # Parse filename like "2010_q1.png"
        parts = filename.replace(".png", "").split("_q")
        if len(parts) == 2:
            year = parts[0]
            q_num = int(parts[1])
            
            if year not in questions:
                questions[year] = {}
            
            questions[year][q_num] = str(img_path)
    
    return questions

def main():
    print("Starting Physics question text extraction...")
    
    # Load existing VLM data for has_diagram info
    vlm_data_path = BASE_DIR / "data" / "physics_questions_vlm.json"
    vlm_data = {}
    if vlm_data_path.exists():
        with open(vlm_data_path) as f:
            vlm_data = json.load(f)
    
    # Get all questions
    all_questions = get_all_questions()
    
    # Process each year
    results = {}
    total = sum(len(q) for q in all_questions.values())
    processed = 0
    
    for year in sorted(all_questions.keys()):
        results[year] = []
        print(f"\nProcessing year {year}...")
        
        for q_num in sorted(all_questions[year].keys()):
            processed += 1
            image_path = all_questions[year][q_num]
            
            print(f"  [{processed}/{total}] Extracting Q{q_num}...", end=" ", flush=True)
            
            # Extract text
            question_text = extract_text_from_image(image_path)
            
            # Check for diagram from existing VLM data or detect
            has_dia = False
            if year in vlm_data:
                for q in vlm_data[year]:
                    if q.get("question_num") == q_num:
                        has_dia = q.get("has_diagram", False)
                        break
            
            result = {
                "id": f"phy_{year}_{q_num}",
                "question_num": q_num,
                "question": question_text,
                "has_diagram": has_dia,
                "image": f"images/physics_questions/{year}_q{q_num}.png" if has_dia else None
            }
            
            results[year].append(result)
            print("Done")
            
            # Small delay to avoid rate limiting
            time.sleep(0.5)
    
    # Save results
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\nExtraction complete! Results saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
