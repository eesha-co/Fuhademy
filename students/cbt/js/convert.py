#!/usr/bin/env python3
import json
import re
import os

def parse_js_file(filename):
    """Parse a JavaScript file containing a question array."""
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the array start
    match = re.search(r'const\s+\w+Questions\s*=\s*(\[)', content)
    if not match:
        print(f"  Could not find array start in {filename}")
        return None
    
    # Find the matching closing bracket
    start = match.end() - 1  # Position of [
    depth = 0
    end = start
    
    for i in range(start, len(content)):
        if content[i] == '[':
            depth += 1
        elif content[i] == ']':
            depth -= 1
            if depth == 0:
                end = i + 1
                break
    
    # Extract and parse the array
    array_str = content[start:end]
    
    # Clean up the string for JSON parsing
    # Replace any unquoted values
    try:
        questions = json.loads(array_str)
        return questions
    except json.JSONDecodeError as e:
        print(f"  JSON parse error: {e}")
        # Try to fix common issues
        try:
            # Fix unquoted keys or other JS-specific syntax
            fixed = array_str.replace(/(\w+):/g, r'"\1":')
            questions = json.loads(fixed)
            return questions
        except:
            print(f"  Could not parse array")
            return None

def convert_questions(input_file, output_file, subject_name):
    """Convert questions to the format expected by cbt.html"""
    print(f"\nProcessing {input_file}...")
    
    if not os.path.exists(input_file):
        print(f"  File not found!")
        return None
    
    questions = parse_js_file(input_file)
    if not questions:
        return None
    
    print(f"  Found {len(questions)} questions")
    
    # Filter questions with years
    valid_questions = [q for q in questions if q.get('year')]
    print(f"  Valid questions with years: {len(valid_questions)}")
    
    if not valid_questions:
        print(f"  No valid questions!")
        return None
    
    # Get unique years
    years = sorted(set(q['year'] for q in valid_questions))
    print(f"  Years: {len(years)} ({years[0]} - {years[-1]})")
    
    # Group by year
    questions_by_year = {}
    for year in years:
        year_questions = []
        for idx, q in enumerate([q for q in valid_questions if q['year'] == year]):
            year_questions.append({
                "question": q.get("question", ""),
                "options": q.get("options", []),
                "correctAnswer": q.get("correctAnswer", 0),
                "image": q.get("image"),
                "passage": q.get("passage"),
                "number": idx + 1
            })
        questions_by_year[year] = year_questions
    
    # Generate JS file
    output_content = f'''// JAMB {subject_name} Past Questions
// Total: {len(valid_questions)} questions across {len(years)} years
// Years: {', '.join(str(y) for y in years)}

window.jambQuestions = window.jambQuestions || {{}};

jambQuestions["{subject_name}"] = {{
  years: {json.dumps(years)},
  questionsByYear: {json.dumps(questions_by_year, indent=2)}
}};
'''
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(output_content)
    
    print(f"  ✓ Written to {output_file}")
    
    return {
        "subject": subject_name,
        "years": years,
        "question_count": len(valid_questions)
    }

if __name__ == "__main__":
    print("Converting question files to cbt.html format...")
    
    files = [
        ("maths-questions-new.js", "maths-questions.js", "Mathematics"),
        ("physics-questions-new.js", "physics-questions.js", "Physics"),
        ("english-questions-new.js", "english-questions.js", "English"),
        ("economics-questions-new.js", "economics-questions.js", "Economics"),
    ]
    
    results = []
    for input_file, output_file, subject in files:
        result = convert_questions(input_file, output_file, subject)
        if result:
            results.append(result)
    
    print("\n" + "="*50)
    print("CONVERSION SUMMARY")
    print("="*50)
    for r in results:
        print(f"{r['subject']}: {r['question_count']} questions, {len(r['years'])} years")
