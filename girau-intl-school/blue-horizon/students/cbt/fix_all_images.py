#!/usr/bin/env python3
"""
Fix image associations in question files for cbt.html
The issue: All questions on a PDF page got assigned the same image,
even if only one question on that page actually has a diagram.

This script works with the actual format used by cbt.html:
jambQuestions["Physics"] = {
  years: [...],
  questionsByYear: {
    "2010": [...],
    ...
  }
}
"""

import json
import re
import os
from pathlib import Path

BASE_DIR = Path("/home/z/my-project/students/cbt")
JS_DIR = BASE_DIR / "js"

# Keywords that indicate a question HAS a diagram
DIAGRAM_INDICATORS = [
    "diagram above",
    "diagram shows",
    "diagram represents",
    "diagram illustrates",
    "figure above",
    "figure shows",
    "the figure",
    "graph above",
    "graph shows",
    "the graph",
    "chart above",
    "chart shows", 
    "the chart",
    "table above",
    "table shows",
    "the table",
    "as shown in",
    "shown in the",
    "in the diagram",
    "from the diagram",
    "the sketch",
    "circuit diagram",
    "ray diagram",
    "velocity-time graph",
    "v-t graph",
    "the following diagram",
    "see diagram",
    "refer to the",
    "the illustration",
    "the schematic",
    "the plot shows",
    "the curve shows",
    "the histogram",
    "pie chart",
    "bar graph",
    "the bar chart",
]

def question_needs_diagram(question_text):
    """Check if a question references a diagram/figure"""
    if not question_text:
        return False
    text_lower = question_text.lower()
    for indicator in DIAGRAM_INDICATORS:
        if indicator in text_lower:
            return True
    return False

def fix_questions_file(input_path, output_path):
    """Fix image associations in a question file"""
    
    print(f"\n📄 Processing: {input_path.name}")
    
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Extract subject name from the file
    subject_match = re.search(r'jambQuestions\["(\w+)"\]', content)
    if not subject_match:
        print(f"   ❌ Could not find subject name")
        return None
    subject = subject_match.group(1)
    
    # Find the years array
    years_match = re.search(r'years:\s*(\[[^\]]+\])', content)
    if not years_match:
        print(f"   ❌ Could not find years array")
        return None
    years_str = years_match.group(1)
    years = json.loads(years_str)
    
    # Extract questionsByYear content
    qby_match = re.search(r'questionsByYear:\s*(\{[\s\S]*?\n\s*\}\s*\})', content)
    if not qby_match:
        print(f"   ❌ Could not find questionsByYear")
        return None
    
    # Parse questions by year
    questions_by_year = {}
    current_year = None
    in_array = False
    brace_count = 0
    current_questions = []
    current_q = ""
    
    # Manual JSON extraction for complex structure
    try:
        # Try to parse the questionsByYear object
        qby_json = qby_match.group(1)
        # Fix trailing comma issue if any
        qby_json = re.sub(r',\s*\}', '}', qby_json)
        questions_by_year = json.loads(qby_json)
    except json.JSONDecodeError as e:
        print(f"   ⚠️ JSON parse error, trying alternative method: {e}")
        # Alternative: extract each year's questions separately
        questions_by_year = {}
        for year in years:
            year_pattern = rf'"{year}":\s*(\[[\s\S]*?\n\s*\])'
            year_match = re.search(year_pattern, content)
            if year_match:
                try:
                    questions_by_year[year] = json.loads(year_match.group(1))
                except:
                    print(f"   ⚠️ Could not parse year {year}")
                    questions_by_year[year] = []
    
    # Process each year
    stats = {"total": 0, "had_image": 0, "needs_diagram": 0, "kept": 0, "nullified": 0}
    
    for year, questions in questions_by_year.items():
        for q in questions:
            stats["total"] += 1
            img = q.get("image")
            if img and img != "null" and img is not None:
                stats["had_image"] += 1
                
                # Check if this question needs a diagram
                if question_needs_diagram(q.get("question", "")):
                    stats["needs_diagram"] += 1
                    stats["kept"] += 1
                    # Keep the image
                else:
                    # Remove the image - question doesn't reference a diagram
                    q["image"] = None
                    stats["nullified"] += 1
    
    # Write the fixed file
    output_content = f"""// JAMB {subject} Past Questions
// Total: {stats['total']} questions
// Fixed image associations - only questions referencing diagrams have images

window.jambQuestions = window.jambQuestions || {{}};

jambQuestions["{subject}"] = {{
  years: {json.dumps(years)},
  questionsByYear: {json.dumps(questions_by_year, indent=2, ensure_ascii=False)}
}};
"""
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"   ✅ Total questions: {stats['total']}")
    print(f"   📷 Originally had images: {stats['had_image']}")
    print(f"   🖼️ Questions with diagram refs: {stats['needs_diagram']}")
    print(f"   ✅ Kept images: {stats['kept']}")
    print(f"   🗑️ Removed images: {stats['nullified']}")
    
    return stats

def main():
    files_to_fix = [
        "physics-questions.js",
        "maths-questions.js", 
        "english-questions.js",
        "economics-questions.js",
        "chem-questions.js",
        "biology-questions.js",
    ]
    
    total_stats = {"total": 0, "had_image": 0, "needs_diagram": 0, "kept": 0, "nullified": 0}
    
    for filename in files_to_fix:
        input_path = JS_DIR / filename
        output_path = JS_DIR / f"{filename}.fixed"
        
        if input_path.exists():
            stats = fix_questions_file(input_path, output_path)
            if stats:
                for key in total_stats:
                    total_stats[key] += stats.get(key, 0)
        else:
            print(f"\n⚠️ File not found: {filename}")
    
    print("\n" + "="*50)
    print("📊 TOTALS:")
    print(f"   Total questions: {total_stats['total']}")
    print(f"   Originally had images: {total_stats['had_image']}")
    print(f"   Questions with diagram refs: {total_stats['needs_diagram']}")
    print(f"   Kept images: {total_stats['kept']}")
    print(f"   Removed images: {total_stats['nullified']}")
    print("="*50)
    
    print("\n📝 Fixed files created with .fixed extension")
    print("   Review them and then rename to replace original files")

if __name__ == "__main__":
    main()
