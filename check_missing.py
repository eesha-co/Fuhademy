import json

with open('students/cbt/pdfs/physics_full_extract.json', 'r') as f:
    full_extract = json.load(f)

# Check pages for 2017 and 2018
for page in full_extract['pages']:
    page_num = page.get('page_number', 0)
    text = page.get('text', '')
    
    # 2017 pages 73-81, 2018 pages 82-89
    if 73 <= page_num <= 89:
        # Look for question numbers
        import re
        questions = re.findall(r'^(\d+)\.\s', text, re.MULTILINE)
        questions = [int(q) for q in questions]
        
        # Check for year marker
        year = None
        if '2017 JAMB' in text:
            year = '2017'
        elif '2018 JAMB' in text:
            year = '2018'
        
        print(f"Page {page_num} ({year if year else 'continuation'}): Questions {questions[:15]}{'...' if len(questions) > 15 else ''}")
        
        # Print first 500 chars to see structure
        if page_num in [73, 74, 82, 83]:
            print(f"  Text preview: {text[:300]}...")
            print()
