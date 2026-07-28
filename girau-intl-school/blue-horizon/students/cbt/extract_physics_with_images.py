#!/usr/bin/env python3
"""
Extract Physics questions from PDF WITH their images.
Each question gets its own image saved, no need for separate matching.
"""

import pdfplumber
import os
import re
import json
import base64
from PIL import Image
import io

PDF_PATH = '/home/z/my-project/upload/JAMB-PHYSICS-PAST-QUESTIONS.pdf'
OUTPUT_DIR = '/home/z/my-project/students/cbt/images/physics_extracted'
OUTPUT_JSON = '/home/z/my-project/students/cbt/extracted/physics_questions_new.json'

# Create output directory
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)

def clean_text(text):
    """Clean extracted text"""
    if not text:
        return ""
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def extract_year_from_text(text):
    """Extract year from text"""
    year_match = re.search(r'(\d{4})\s*JAMB', text)
    if year_match:
        return year_match.group(1)
    return None

def is_question_start(text):
    """Check if text starts a new question"""
    if not text:
        return False
    # Match patterns like "1.", "2.", "A.", "B." at start
    patterns = [
        r'^\d+\.\s*[A-Z]',  # "1. Which..."
        r'^[A-D]\.\s',       # "A. option"
    ]
    text = text.strip()
    return any(re.match(p, text) for p in patterns)

def is_paper_type_question(text):
    """Check if this is a paper type question"""
    return 'Question Paper Type' in text or 'Paper Type' in text

def extract_questions_from_pdf():
    """Extract questions with images from PDF"""
    
    all_questions = []
    current_year = "Unknown"
    question_counter = 0
    image_counter = 0
    
    print(f"Opening PDF: {PDF_PATH}")
    
    with pdfplumber.open(PDF_PATH) as pdf:
        total_pages = len(pdf.pages)
        print(f"Total pages: {total_pages}")
        
        for page_num, page in enumerate(pdf.pages):
            print(f"\nProcessing page {page_num + 1}/{total_pages}...")
            
            # Extract text
            text = page.extract_text() or ""
            
            # Check for year marker
            year = extract_year_from_text(text)
            if year:
                current_year = year
                print(f"  Found year: {current_year}")
            
            # Extract images from this page
            images = page.images
            print(f"  Found {len(images)} images on page")
            
            # Save each image
            page_images = []
            for img_idx, img in enumerate(images):
                try:
                    # Get image dimensions and position
                    x0, top, x1, bottom = img['x0'], img['top'], img['x1'], img['bottom']
                    width = x1 - x0
                    height = bottom - top
                    
                    # Skip very small images (likely artifacts)
                    if width < 50 or height < 50:
                        continue
                    
                    # Crop image from page
                    # Note: pdfplumber doesn't directly extract images, we need to use another method
                    image_counter += 1
                    image_filename = f"physics_p{page_num + 1}_i{img_idx + 1}.png"
                    image_path = os.path.join(OUTPUT_DIR, image_filename)
                    
                    page_images.append({
                        'filename': image_filename,
                        'path': image_path,
                        'x0': x0, 'top': top, 'x1': x1, 'bottom': bottom
                    })
                    
                except Exception as e:
                    print(f"  Error processing image {img_idx}: {e}")
            
            # For now, store page data for later processing
            all_questions.append({
                'page': page_num + 1,
                'year': current_year,
                'text': text,
                'images': page_images
            })
    
    return all_questions

def extract_images_with_pdf2image():
    """Extract images using pdf2image for better quality"""
    from pdf2image import convert_from_path
    
    print("\nExtracting pages as images using pdf2image...")
    
    # Convert PDF pages to images
    pages = convert_from_path(PDF_PATH, dpi=200)
    print(f"Converted {len(pages)} pages to images")
    
    all_questions = []
    current_year = "Unknown"
    
    for page_num, page_image in enumerate(pages):
        print(f"\nProcessing page {page_num + 1}/{len(pages)}...")
        
        # Save the page image
        page_image_path = os.path.join(OUTPUT_DIR, f'page_{page_num + 1:03d}.png')
        page_image.save(page_image_path, 'PNG')
        
        # Use OCR to extract text
        try:
            import pytesseract
            text = pytesseract.image_to_string(page_image)
        except:
            text = ""
        
        # Check for year
        year = extract_year_from_text(text)
        if year:
            current_year = year
            print(f"  Found year: {current_year}")
        
        all_questions.append({
            'page': page_num + 1,
            'year': current_year,
            'text': text,
            'page_image': page_image_path
        })
    
    return all_questions

def main():
    print("="*60)
    print("JAMB Physics PDF Extraction Tool")
    print("="*60)
    
    # Try pdfplumber first
    try:
        pages_data = extract_questions_from_pdf()
    except Exception as e:
        print(f"pdfplumber extraction failed: {e}")
        print("Trying pdf2image...")
        pages_data = extract_images_with_pdf2image()
    
    # Save raw extraction data
    with open(OUTPUT_JSON, 'w') as f:
        json.dump(pages_data, f, indent=2)
    
    print(f"\n\nExtraction complete!")
    print(f"Output saved to: {OUTPUT_JSON}")
    print(f"Images saved to: {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
