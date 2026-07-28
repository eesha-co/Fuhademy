#!/usr/bin/env python3
"""
Fix image associations in question files.
The issue: All questions on a PDF page got assigned the same image,
even if only one question on that page actually has a diagram.

Solution: 
1. Identify questions that reference diagrams in their text
2. Assign images only to those questions
3. Set image to null for questions without diagram references
"""

import json
import re
import os
from pathlib import Path

BASE_DIR = Path("/home/z/my-project/students/cbt")
JS_DIR = BASE_DIR / "js"

# Keywords that indicate a question has a diagram
DIAGRAM_KEYWORDS = [
    "diagram",
    "figure",
    "graph shows",
    "graph above",
    "the graph",
    "chart shows",
    "chart above",
    "the chart",
    "table shows",
    "table above",
    "the table",
    "in the figure",
    "from the diagram",
    "as shown",
    "the diagram above",
    "diagram above shows",
    "diagram shows",
    "figure above",
    "figure shows",
    "velocity-time graph",
    "v-t graph",
    "circuit diagram",
    "ray diagram",
    "waveform",
    "the sketch",
    "the drawing",
    "illustration",
    "schematic",
    "the plot",
    "the curve",
    "the histogram",
    "the pie chart",
    "bar chart",
    "the bar graph",
]

def question_has_diagram(question_text):
    """Check if a question references a diagram/figure"""
    if not question_text:
        return False
    text_lower = question_text.lower()
    for keyword in DIAGRAM_KEYWORDS:
        if keyword in text_lower:
            return True
    return False

def process_questions_file(input_file, output_file):
    """Process a questions file and fix image associations"""
    
    print(f"\n📄 Processing: {input_file.name}")
    
    # Read the file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Try to extract the questions array
    # Handle different formats
    
    # Format 1: const subjectQuestions = [...]
    match = re.search(r'const\s+\w+Questions\s*=\s*(\[[\s\S]*\]);', content)
    if match:
        questions_json = match.group(1)
        try:
            questions = json.loads(questions_json)
        except json.JSONDecodeError as e:
            print(f"   ❌ JSON parse error: {e}")
            return
        
        # Process questions
        stats = {"total": 0, "had_image": 0, "has_diagram": 0, "fixed": 0, "nullified": 0, "kept": 0}
        
        # Group questions by their image reference
        image_to_questions = {}
        for q in questions:
            stats["total"] += 1
            img = q.get("image")
            if img and img != "null" and img != None:
                stats["had_image"] += 1
                if img not in image_to_questions:
                    image_to_questions[img] = []
                image_to_questions[img].append(q)
        
        # For each image, find which question SHOULD have it
        for img, qs in image_to_questions.items():
            # Find questions with diagram keywords
            diagram_questions = [q for q in qs if question_has_diagram(q.get("question", ""))]
            
            if len(diagram_questions) == 0:
                # No questions reference diagrams - set all to null
                for q in qs:
                    q["image"] = None
                    stats["nullified"] += 1
            elif len(diagram_questions) == 1:
                # Only one question references a diagram - give it the image
                for q in qs:
                    if q == diagram_questions[0]:
                        stats["kept"] += 1
                        stats["has_diagram"] += 1
                    else:
                        q["image"] = None
                        stats["nullified"] += 1
            else:
                # Multiple questions reference diagrams - keep for first one only
                # (This is still not perfect, but better than before)
                first = True
                for q in qs:
                    if question_has_diagram(q.get("question", "")):
                        if first:
                            stats["kept"] += 1
                            stats["has_diagram"] += 1
                            first = False
                        else:
                            q["image"] = None
                            stats["nullified"] += 1
                    else:
                        q["image"] = None
                        stats["nullified"] += 1
        
        # Write output
        new_json = json.dumps(questions, indent=2, ensure_ascii=False)
        new_content = f"// {input_file.stem.replace('-', ' ').upper()} - JAMB Past Questions\n"
        new_content += f"// Fixed image associations\n\n"
        new_content += f"const {input_file.stem.replace('-questions', '').replace('-new', '').capitalize()}Questions = {new_json};\n"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"   ✅ Total questions: {stats['total']}")
        print(f"   📷 Originally had images: {stats['had_image']}")
        print(f"   🖼️ Questions with diagram refs: {stats['has_diagram']}")
        print(f"   ✏️ Kept images: {stats['kept']}")
        print(f"   🗑️ Set to null: {stats['nullified']}")
        
        return stats

def main():
    files_to_process = [
        ("physics-questions-new.js", "physics-questions-fixed.js"),
        ("maths-questions-new.js", "maths-questions-fixed.js"),
        ("english-questions-new.js", "english-questions-fixed.js"),
        ("economics-questions-new.js", "economics-questions-fixed.js"),
    ]
    
    total_stats = {"total": 0, "had_image": 0, "has_diagram": 0, "fixed": 0, "nullified": 0, "kept": 0}
    
    for input_name, output_name in files_to_process:
        input_file = JS_DIR / input_name
        output_file = JS_DIR / output_name
        
        if input_file.exists():
            stats = process_questions_file(input_file, output_file)
            if stats:
                for key in total_stats:
                    total_stats[key] += stats.get(key, 0)
        else:
            print(f"   ⚠️ File not found: {input_name}")
    
    print("\n" + "="*50)
    print("📊 TOTALS:")
    print(f"   Total questions: {total_stats['total']}")
    print(f"   Originally had images: {total_stats['had_image']}")
    print(f"   Questions with diagram refs: {total_stats['has_diagram']}")
    print(f"   Kept images: {total_stats['kept']}")
    print(f"   Set to null: {total_stats['nullified']}")
    print("="*50)

if __name__ == "__main__":
    main()
