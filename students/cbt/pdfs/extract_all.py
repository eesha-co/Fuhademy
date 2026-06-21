#!/usr/bin/env python3
"""
Comprehensive PDF Question Extractor
Extracts questions with images from PDF files
"""

import fitz  # pymupdf
import os
import re
import json
import base64
from pathlib import Path

BASE_DIR = Path("/home/z/my-project/students/cbt/pdfs")

def extract_images_from_page(page, page_num, subject):
    """Extract all images from a page and return their positions"""
    images = []
    img_dir = BASE_DIR / "images" / subject
    img_dir.mkdir(parents=True, exist_ok=True)
    
    for img_index, img in enumerate(page.get_images(full=True)):
        xref = img[0]
        base_image = page.parent.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        
        # Save image
        img_filename = f"page{page_num+1}_img{img_index+1}.{image_ext}"
        img_path = img_dir / img_filename
        
        with open(img_path, "wb") as f:
            f.write(image_bytes)
        
        # Get image position on page
        img_rects = page.get_image_rects(xref)
        positions = [{"x": r.x0, "y": r.y0, "width": r.width, "height": r.height} for r in img_rects]
        
        images.append({
            "filename": img_filename,
            "path": str(img_path),
            "ext": image_ext,
            "positions": positions
        })
    
    return images

def extract_text_with_layout(page):
    """Extract text preserving layout"""
    # Get text blocks with position info
    blocks = page.get_text("dict", flags=fitz.TEXT_PRESERVE_WHITESPACE)["blocks"]
    
    content = []
    for block in blocks:
        if block["type"] == 0:  # Text block
            text = ""
            for line in block["lines"]:
                line_text = ""
                for span in line["spans"]:
                    line_text += span["text"]
                text += line_text + "\n"
            
            content.append({
                "type": "text",
                "text": text.strip(),
                "bbox": block["bbox"]
            })
        elif block["type"] == 1:  # Image block
            content.append({
                "type": "image",
                "bbox": block["bbox"],
                "xref": block.get("image", -1)
            })
    
    return content

def parse_questions_from_text(text, subject):
    """Parse questions from extracted text"""
    questions = []
    
    # Different patterns for different subjects
    patterns = [
        # Pattern 1: Number followed by period and question
        r'(\d+)\.\s*([^\n]+(?:\n(?!\d+\.)[^\n]+)*)',
        # Pattern 2: QUESTION in caps
        r'QUESTION\s*(\d+)[\s:]*([^\n]+(?:\n(??!QUESTION)[^\n]+)*)',
        # Pattern 3: Number in parens
        r'\((\d+)\)\s*([^\n]+(?:\n(?!\(\d+\))[^\n]+)*)',
    ]
    
    # Split by question markers
    lines = text.split('\n')
    current_question = None
    current_options = []
    question_text = ""
    question_num = 0
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Check for new question
        q_match = re.match(r'^(\d+)\.\s*(.+)', line)
        if q_match:
            # Save previous question if exists
            if current_question and question_text:
                questions.append({
                    "number": question_num,
                    "question": question_text.strip(),
                    "options": current_options,
                    "subject": subject
                })
            
            question_num = int(q_match.group(1))
            question_text = q_match.group(2)
            current_options = []
            current_question = True
            continue
        
        # Check for options (A, B, C, D, E)
        opt_match = re.match(r'^([A-E])\.\s*(.+)', line)
        if opt_match and current_question:
            current_options.append({
                "letter": opt_match.group(1),
                "text": opt_match.group(2)
            })
            continue
        
        # Check for answer indication
        ans_match = re.search(r'(?:ans(?:wer)?)\s*[:\s]*\s*([A-E])', line, re.IGNORECASE)
        if ans_match:
            # Mark answer for current question
            pass
        
        # Append to question text
        if current_question and not opt_match:
            question_text += " " + line
    
    # Save last question
    if current_question and question_text:
        questions.append({
            "number": question_num,
            "question": question_text.strip(),
            "options": current_options,
            "subject": subject
        })
    
    return questions

def extract_pdf_completely(pdf_path, subject):
    """Completely extract all content from PDF"""
    doc = fitz.open(pdf_path)
    
    all_pages = []
    all_questions = []
    all_images = []
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Extract images
        images = extract_images_from_page(page, page_num, subject)
        all_images.extend(images)
        
        # Extract text with layout
        text = page.get_text("text")
        blocks = extract_text_with_layout(page)
        
        page_data = {
            "page_number": page_num + 1,
            "text": text,
            "blocks": blocks,
            "images": images
        }
        
        all_pages.append(page_data)
    
    doc.close()
    
    return {
        "subject": subject,
        "total_pages": len(all_pages),
        "total_images": len(all_images),
        "pages": all_pages
    }

def main():
    pdfs = [
        ("english.pdf", "english"),
        ("maths.pdf", "maths"),
        ("physics.pdf", "physics"),
        ("economics.pdf", "economics")
    ]
    
    for pdf_name, subject in pdfs:
        pdf_path = BASE_DIR / pdf_name
        if not pdf_path.exists():
            print(f"⚠️ {pdf_name} not found, skipping...")
            continue
        
        print(f"\n📖 Processing {pdf_name}...")
        
        try:
            data = extract_pdf_completely(pdf_path, subject)
            
            # Save full extraction to JSON
            output_path = BASE_DIR / f"{subject}_full_extract.json"
            with open(output_path, "w", encoding="utf-8") as f:
                # Don't save image bytes to JSON
                json.dump({
                    "subject": data["subject"],
                    "total_pages": data["total_pages"],
                    "total_images": data["total_images"],
                    "pages": [
                        {
                            "page_number": p["page_number"],
                            "text": p["text"],
                            "images": [{"filename": img["filename"], "positions": img["positions"]} for img in p["images"]]
                        }
                        for p in data["pages"]
                    ]
                }, f, indent=2, ensure_ascii=False)
            
            # Save raw text
            text_output = BASE_DIR / f"{subject}_raw.txt"
            with open(text_output, "w", encoding="utf-8") as f:
                for page in data["pages"]:
                    f.write(f"\n{'='*60}\n")
                    f.write(f"PAGE {page['page_number']}\n")
                    f.write(f"{'='*60}\n")
                    f.write(page["text"])
            
            print(f"  ✅ {data['total_pages']} pages extracted")
            print(f"  ✅ {data['total_images']} images extracted")
            print(f"  📄 Saved to {subject}_full_extract.json")
            print(f"  📄 Saved to {subject}_raw.txt")
            
        except Exception as e:
            print(f"  ❌ Error: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    main()
