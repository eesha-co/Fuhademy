import json

# Load the full extracted data
with open('students/cbt/pdfs/physics_full_extract.json', 'r') as f:
    full_extract = json.load(f)

# Check answer keys - how many answers per year
answers = {
    '2010': 50,
    '2011': 50,
    '2012': 50,
    '2013': 50,
    '2014': 50,
    '2015': 40,
    '2016': 40,
    '2017': 40,
    '2018': 40,
}

# Check what we extracted
with open('students/cbt/images/physics_questions/all_questions.json', 'r') as f:
    extracted = json.load(f)

print("Expected vs Extracted:")
for year in ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']:
    expected = answers.get(year, 50)
    if year in extracted:
        q_nums = set([q['num'] for q in extracted[year] if q['num'] > 0])
        actual = len(q_nums)
        missing = set(range(1, expected + 1)) - q_nums
        print(f"{year}: Expected {expected}, Got {actual}, Missing: {sorted(missing) if missing else 'None'}")
    else:
        print(f"{year}: NOT FOUND")

# Check the PDF text for missing questions
print("\n--- Checking PDF text for question patterns ---")
for page in full_extract['pages']:
    text = page.get('text', '')
    page_num = page.get('page_number', 0)
    
    # Check for year markers
    for year in ['2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017', '2018']:
        if f"{year} JAMB PHYSICS" in text:
            print(f"Page {page_num}: {year} JAMB PHYSICS found")
            
            # Count question numbers
            import re
            questions = re.findall(r'^(\d+)\.\s', text, re.MULTILINE)
            if questions:
                q_nums = [int(q) for q in questions]
                print(f"  Questions found: {min(q_nums)} to {max(q_nums)}")
