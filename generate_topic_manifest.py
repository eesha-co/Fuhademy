#!/usr/bin/env python3
import os
import json
import re

BASE_DIR = "/home/z/my-project/students"

# Files to exclude (non-topic files)
EXCLUDE_PATTERNS = [
    'index.html', 'dashboard', 'live-session', 'notifications', 
    'formula-bank', 'video-library', 'digital-library', 'textbooks',
    'notes', 'mock-exams', 'study-plan', 'progress', 'news-feed',
    'cbt', 'game', 'storybook', 'messenger', 'learning-report',
    'ai-tutor', 'practice-exams', 'template', 'navbar', 'styles.css',
    'netlify.toml', 'ISPRING', 'Notes', 'scripts', 'styles', 'shared',
    'functions', 'InteractiveChemLab', 'zdfxfbfvd', 'fgvb'
]

# Subject folder mapping
SUBJECT_MAP = {
    'mathematics': 'Mathematics',
    'english': 'English Language',
    'physics': 'Physics',
    'chemistry': 'Chemistry',
    'biology': 'Biology',
    'economics': 'Economics',
    'government': 'Government',
    'commerce': 'Commerce',
    'accounting': 'Accounting',
    'literature': 'Literature in English',
    'chemistry-modules': 'Chemistry',
    'simple-machines-module': 'Physics',
    'waves': 'Physics'
}

def should_exclude(path):
    for pattern in EXCLUDE_PATTERNS:
        if pattern.lower() in path.lower():
            return True
    return False

def extract_topic_name(filename):
    """Convert filename to readable topic name"""
    name = filename.replace('.html', '').replace('-', ' ').replace('_', ' ')
    # Title case
    name = name.title()
    # Fix common patterns
    name = re.sub(r'\s+', ' ', name)
    return name.strip()

def guess_category(path, filename):
    """Guess category from folder structure"""
    parts = path.split('/')
    if len(parts) > 1:
        # Get parent folder as category
        parent = parts[-2] if len(parts) >= 2 else ''
        parent = parent.replace('-', ' ').replace('_', ' ').title()
        return parent
    return 'General'

def guess_difficulty(topic_name, category):
    """Guess difficulty based on topic name patterns"""
    easy_keywords = ['introduction', 'basic', 'fundamentals', 'foundation', 'intro']
    hard_keywords = ['advanced', 'complex', 'integration', 'calculus', 'organic']
    
    topic_lower = topic_name.lower()
    category_lower = category.lower() if category else ''
    
    if any(kw in topic_lower or kw in category_lower for kw in easy_keywords):
        return 'easy'
    if any(kw in topic_lower or kw in category_lower for kw in hard_keywords):
        return 'hard'
    return 'medium'

def scan_directory(base_dir):
    topics = []
    topic_id = 1
    
    for root, dirs, files in os.walk(base_dir):
        # Skip excluded directories
        dirs[:] = [d for d in dirs if not should_exclude(os.path.join(root, d))]
        
        for file in files:
            if not file.endswith('.html'):
                continue
            
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, base_dir)
            
            # Skip excluded files
            if should_exclude(rel_path):
                continue
            
            # Determine subject
            subject = 'General'
            for key, val in SUBJECT_MAP.items():
                if key in rel_path.lower():
                    subject = val
                    break
            
            # Extract topic name
            topic_name = extract_topic_name(file)
            
            # Get category from path
            category = guess_category(rel_path, file)
            
            # Guess difficulty
            difficulty = guess_difficulty(topic_name, category)
            
            # Create web path (relative to students folder)
            web_path = rel_path.replace('\\', '/')
            
            topics.append({
                'id': f'topic-{topic_id:04d}',
                'topic': topic_name,
                'subject': subject,
                'category': category,
                'difficulty': difficulty,
                'file_path': web_path,
                'estimated_hours': 1
            })
            topic_id += 1
    
    return topics

def main():
    topics = scan_directory(BASE_DIR)
    
    # Group by subject for summary
    subjects = {}
    for t in topics:
        s = t['subject']
        subjects[s] = subjects.get(s, 0) + 1
    
    print(f"Found {len(topics)} topic files:")
    for s, count in sorted(subjects.items()):
        print(f"  {s}: {count} topics")
    
    # Save to JSON
    output_path = os.path.join(BASE_DIR, 'topic_manifest.json')
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(topics, f, indent=2)
    
    print(f"\nManifest saved to: {output_path}")

if __name__ == '__main__':
    main()
