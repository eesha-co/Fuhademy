#!/usr/bin/env python3
"""
Fix duplicate image associations in CBT question files.

The problem: When extracting from PDFs, all questions on a page got assigned the same image,
even though only specific questions have diagrams.

Solution: For each image that appears in multiple questions, we need to determine 
which question the image ACTUALLY belongs to based on the question content.
"""

import json
import re
from pathlib import Path

CBT_DIR = Path("/home/z/my-project/students/cbt")
JS_DIR = CBT_DIR / "js"


def parse_questions_file(filepath):
    """Parse a questions JS file and return the questions data"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract the questions object
    # Handle different file formats
    match = re.search(r'window\.jambQuestions\s*=\s*(\{[\s\S]*?\});?\s*$', content)
    if match:
        return json.loads(match.group(1))
    
    # Try other patterns
    match = re.search(r'const\s+\w+Questions\s*=\s*(\{[\s\S]*?\});', content)
    if match:
        return json.loads(match.group(1))
    
    return None


def find_duplicate_image_questions(questions_data, subject_key):
    """Find images that are assigned to multiple questions"""
    image_to_questions = {}
    
    if subject_key not in questions_data:
        return {}
    
    subject_data = questions_data[subject_key]
    
    for year, questions in subject_data.get('questionsByYear', {}).items():
        for q in questions:
            img = q.get('image')
            if img and img != 'null' and img is not None:
                if img not in image_to_questions:
                    image_to_questions[img] = []
                image_to_questions[img].append(q)
    
    # Return only images with multiple questions
    return {img: qs for img, qs in image_to_questions.items() if len(qs) > 1}


def determine_correct_question(questions, image_path):
    """
    Determine which question the image belongs to based on question content.
    
    Heuristics:
    1. Questions that explicitly mention diagram elements (e.g., "KLǁNM")
    2. Questions with "diagram above" / "figure above" references
    3. Questions with specific geometric/physics elements that would need a diagram
    """
    
    if len(questions) == 0:
        return None
    
    if len(questions) == 1:
        return questions[0]
    
    # Score each question based on likelihood of needing the diagram
    scored_questions = []
    
    for q in questions:
        score = 0
        question_text = q.get('question', '').lower()
        
        # Higher score for explicit diagram references
        if 'in the figure above' in question_text or 'in the diagram above' in question_text:
            score += 10
        
        # Higher score for specific geometric/physics elements
        diagram_keywords = [
            'parallel', 'bisect', 'angle', 'triangle', 'circle', 'radius',
            'chord', 'tangent', 'secant', 'arc', 'sector', 'quadrilateral',
            'polygon', 'trapezium', 'rectangle', 'square', 'cube', 'cylinder',
            'cone', 'sphere', 'pyramid', 'coordinates', 'graph', 'curve',
            'vector', 'circuit', 'lens', 'mirror', 'prism', 'wave',
            'velocity-time', 'displacement-time', 'force', 'equilibrium',
            'pulley', 'inclined plane', 'lever', 'spring', 'block', 'slope'
        ]
        
        for kw in diagram_keywords:
            if kw in question_text:
                score += 1
        
        # Check if options contain geometric values (angles, lengths)
        options = q.get('options', [])
        geometric_options = 0
        for opt in options:
            if any(c in str(opt).lower() for c in ['°', 'cm', 'm', '√', 'π', 'sin', 'cos', 'tan']):
                geometric_options += 1
        
        score += geometric_options * 0.5
        
        # Check for labeled points (A, B, C, P, Q, etc.)
        import re
        labeled_points = len(re.findall(r'\b[A-Z]\b', q.get('question', '')))
        score += labeled_points * 0.2
        
        scored_questions.append((q, score))
    
    # Sort by score descending
    scored_questions.sort(key=lambda x: x[1], reverse=True)
    
    # Return the highest scored question
    return scored_questions[0][0]


def fix_image_associations(subject_name, input_file, output_file=None):
    """Fix image associations for a subject"""
    print(f"\n{'='*60}")
    print(f"Processing: {subject_name.upper()}")
    print(f"{'='*60}")
    
    questions_data = parse_questions_file(input_file)
    if not questions_data:
        print(f"Could not parse {input_file}")
        return
    
    # Find subject key (handle case variations)
    subject_key = None
    for key in questions_data.keys():
        if key.lower() == subject_name.lower():
            subject_key = key
            break
    
    if not subject_key:
        print(f"Subject {subject_name} not found in file")
        return
    
    # Find duplicate image assignments
    duplicates = find_duplicate_image_questions(questions_data, subject_key)
    
    if not duplicates:
        print(f"No duplicate image assignments found")
        return
    
    print(f"\nFound {len(duplicates)} images assigned to multiple questions:")
    for img, qs in duplicates.items():
        print(f"\n  {img}:")
        for q in qs:
            print(f"    - {q['id']}: {q['question'][:60]}...")
    
    # Fix each duplicate
    fixed_count = 0
    for img, qs in duplicates.items():
        correct_q = determine_correct_question(qs, img)
        
        if correct_q:
            # Remove image from all questions
            for q in qs:
                q['image'] = None
            
            # Add back only to correct question
            correct_q['image'] = img
            print(f"\n  ✓ {img} -> {correct_q['id']}")
            fixed_count += 1
    
    # Save the fixed file
    if output_file:
        # Check original file format
        with open(input_file, 'r', encoding='utf-8') as f:
            original = f.read()
        
        # Determine output format
        if 'window.jambQuestions' in original:
            new_content = f"// JAMB Past Questions - Fixed Image Associations\n"
            new_content += f"// Images are now properly mapped to the correct questions\n\n"
            new_content += f"window.jambQuestions = {json.dumps(questions_data, indent=2, ensure_ascii=False)};\n"
        else:
            # Assume const format
            var_name = input_file.stem.replace('-questions', '').replace('-', '')
            new_content = f"// {subject_name.upper()} - JAMB Past Questions - Fixed\n\n"
            new_content += f"const {var_name}Questions = {json.dumps(questions_data, indent=2, ensure_ascii=False)};\n"
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        
        print(f"\n✅ Saved to: {output_file}")
    
    return fixed_count


def main():
    print("CBT Image Association Fix Tool")
    print("=" * 60)
    
    # Fix Mathematics
    fix_image_associations(
        'mathematics',
        JS_DIR / 'maths-questions.js',
        JS_DIR / 'maths-questions-fixed.js'
    )
    
    # Fix Physics
    fix_image_associations(
        'physics',
        JS_DIR / 'physics-questions.js',
        JS_DIR / 'physics-questions-fixed.js'
    )
    
    print("\n\nDone! Review the -fixed.js files and rename them if correct.")


if __name__ == "__main__":
    main()
