#!/usr/bin/env python3
"""
Generate questions.js in the correct format for CBT
"""

import json
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path("/home/z/my-project/students/cbt/pdfs")
OUTPUT_DIR = Path("/home/z/my-project/students/cbt/js")

# Subject name mapping for CBT
SUBJECT_NAMES = {
    "english": "English Language",
    "maths": "Mathematics",
    "physics": "Physics",
    "chemistry": "Chemistry",
    "biology": "Biology",
    "economics": "Economics"
}

def load_extracted_questions(subject):
    """Load questions from extracted file"""
    file_path = OUTPUT_DIR / f"{subject}-questions-new.js"
    if not file_path.exists():
        return []
    
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Extract the JSON array from the JS file
    start = content.find('[')
    end = content.rfind(']') + 1
    if start == -1 or end == 0:
        return []
    
    json_str = content[start:end]
    try:
        questions = json.loads(json_str)
        return questions
    except json.JSONDecodeError as e:
        print(f"Error parsing {subject}: {e}")
        return []

def organize_by_year(questions):
    """Organize questions by year"""
    by_year = defaultdict(list)
    for q in questions:
        year = q.get('year') or 'unknown'
        by_year[year].append(q)
    return dict(by_year)

def generate_questions_js():
    """Generate the complete questions.js file"""
    subjects = ["english", "maths", "physics", "economics"]

    # Also load existing chemistry and biology questions
    existing_subjects = {
        "Chemistry": {
            "years": ["2023", "2022", "2021"],
            "questionsByYear": {}
        },
        "Biology": {
            "years": ["2023", "2022", "2021"],
            "questionsByYear": {}
        }
    }

    # Load existing chemistry questions
    try:
        with open(OUTPUT_DIR / "chem-questions.js", "r", encoding="utf-8") as f:
            content = f.read()
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != 0:
                chem_questions = json.loads(content[start:end])
                # Add to existing subjects
                by_year = defaultdict(list)
                for q in chem_questions:
                    year = q.get('year', '2023')
                    by_year[year].append({
                        "question": q.get('question', ''),
                        "options": q.get('options', ['', '', '', '']),
                        "correctAnswer": q.get('correctAnswer', 0),
                        "image": q.get('image')
                    })
                existing_subjects["Chemistry"]["questionsByYear"] = dict(by_year)
                existing_subjects["Chemistry"]["years"] = sorted(by_year.keys())
    except Exception as e:
        print(f"Warning loading chemistry: {e}")

    # Load existing biology questions
    try:
        with open(OUTPUT_DIR / "biology-questions.js", "r", encoding="utf-8") as f:
            content = f.read()
            start = content.find('[')
            end = content.rfind(']') + 1
            if start != -1 and end != 0:
                bio_questions = json.loads(content[start:end])
                by_year = defaultdict(list)
                for q in bio_questions:
                    year = q.get('year', '2023')
                    by_year[year].append({
                        "question": q.get('question', ''),
                        "options": q.get('options', ['', '', '', '']),
                        "correctAnswer": q.get('correctAnswer', 0),
                        "image": q.get('image')
                    })
                existing_subjects["Biology"]["questionsByYear"] = dict(by_year)
                existing_subjects["Biology"]["years"] = sorted(by_year.keys())
    except Exception as e:
        print(f"Warning loading biology: {e}")

    jamb_questions = {}

    for subject in subjects:
        questions = load_extracted_questions(subject)
        if not questions:
            print(f"No questions found for {subject}")
            continue

        # Organize by year
        by_year = organize_by_year(questions)

        # Sort years (put unknown at end)
        years = sorted([y for y in by_year.keys() if y != 'unknown' and y != 'null'])
        if 'unknown' in by_year or 'null' in by_year:
            years.append('unknown')

        # Format questions
        questions_by_year = {}
        for year in years:
            year_questions = by_year.get(year, by_year.get('null', []))
            formatted = []
            for q in year_questions:
                formatted.append({
                    "question": q.get('question', ''),
                    "options": q.get('options', ['', '', '', '']),
                    "correctAnswer": q.get('correctAnswer', 0),
                    "image": q.get('image')
                })
            questions_by_year[year if year != 'unknown' else 'unknown'] = formatted

        subject_name = SUBJECT_NAMES.get(subject, subject.title())
        jamb_questions[subject_name] = {
            "years": years,
            "questionsByYear": questions_by_year
        }

        print(f"{subject_name}: {len(questions)} questions across {len(years)} years")

    # Add existing subjects
    jamb_questions.update(existing_subjects)

    # Generate JS content
    js_content = f"""// JAMB Past Questions - Auto-generated
// Total subjects: {len(jamb_questions)}
// Generated with image support

const jambQuestions = {json.dumps(jamb_questions, indent=2, ensure_ascii=False)};

if (typeof module !== 'undefined' && module.exports) {{
    module.exports = jambQuestions;
}}
"""

    return js_content

def main():
    js_content = generate_questions_js()

    output_path = OUTPUT_DIR / "questions.js"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    print(f"\n✅ Generated: {output_path}")

if __name__ == "__main__":
    main()
