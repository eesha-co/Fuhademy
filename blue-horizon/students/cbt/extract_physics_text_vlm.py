#!/usr/bin/env python3
"""
Extract question text from Physics question images using VLM.
Process a small batch first to test.
"""

import subprocess
import json
import os
from pathlib import Path

BASE_DIR = Path("/home/z/my-project/students/cbt")
IMAGES_DIR = BASE_DIR / "images" / "physics_questions"
OUTPUT_FILE = BASE_DIR / "data" / "physics_questions_text_vlm.json"

PROMPT = """Extract the question text from this Physics exam question image.

Instructions:
1. Extract ONLY the question text and any equations/formulas
2. If there's a diagram, just write [DIAGRAM] in the text
3. Do NOT include the options (A, B, C, D)
4. Keep mathematical notation as clear text (e.g., "ms^-1" for speed)
5. Return only the question text, nothing else"""

def extract_text(image_path):
    """Use VLM CLI to extract text from image."""
    try:
        result = subprocess.run(
            ["z-ai", "vision", "-p", PROMPT, "-i", str(image_path)],
            capture_output=True,
            text=True,
            timeout=60
        )
        
        if result.returncode == 0:
            # Parse response
            try:
                response = json.loads(result.stdout)
                text = response.get("content", "").strip()
                return text
            except json.JSONDecodeError:
                return result.stdout.strip()
        else:
            print(f"Error: {result.stderr}")
            return ""
    except Exception as e:
        print(f"Exception: {e}")
        return ""

def main():
    # Get all physics question images
    images = sorted(IMAGES_DIR.glob("*.png"))
    print(f"Found {len(images)} question images")
    
    # Process only 2010 questions first (50 questions) as a test
    test_images = [img for img in images if "2010_q" in img.name]
    print(f"Processing {len(test_images)} 2010 questions...")
    
    results = []
    for i, img_path in enumerate(test_images):
        print(f"Processing {img_path.name}...", end=" ", flush=True)
        text = extract_text(img_path)
        
        # Parse filename for year and question number
        parts = img_path.stem.split("_q")
        year = parts[0]
        q_num = int(parts[1]) if len(parts) > 1 else 0
        
        results.append({
            "year": year,
            "question_num": q_num,
            "text": text,
            "image": str(img_path.relative_to(BASE_DIR))
        })
        print("Done")
    
    # Save results
    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_FILE, "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\nSaved to {OUTPUT_FILE}")
    print("\nSample extracted text:")
    for r in results[:3]:
        print(f"\nQ{r['question_num']}: {r['text'][:200]}...")

if __name__ == "__main__":
    main()
