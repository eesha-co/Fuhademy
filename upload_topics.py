#!/usr/bin/env python3
"""
Upload topic HTML files to Supabase Storage and link to database
"""

import os
import json
import re
import requests
from pathlib import Path

SUPABASE_URL = "https://kruwfhzfqieuiuhqlutt.supabase.co"
SERVICE_KEY = "REDACTED_USE_ENV_VAR"

HEADERS = {
    "Authorization": f"Bearer {SERVICE_KEY}",
    "apikey": SERVICE_KEY
}

def slugify(text):
    """Convert text to URL-friendly slug"""
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def get_db_topics():
    """Fetch all topics from database"""
    resp = requests.get(
        f"{SUPABASE_URL}/rest/v1/subject_topics?select=id,subject,topic,category",
        headers=HEADERS
    )
    return resp.json()

def get_topic_files():
    """Get all topic HTML files"""
    files = []
    base_path = Path("/home/z/my-project/students/subjects")

    for html_file in base_path.rglob("*.html"):
        # Skip index.html navigation pages
        if html_file.name == "index.html":
            continue
        files.append(html_file)

    return files

def extract_subject_from_path(file_path):
    """Extract subject from file path"""
    parts = file_path.parts
    # Find subject in path
    subjects = ["mathematics", "physics", "chemistry", "biology", "english", "economics", "government", "literature"]
    for part in parts:
        if part.lower() in subjects:
            return part.capitalize()
    return None

def extract_topic_from_file(file_path):
    """Extract topic name from file path or content"""
    # Try to get from filename
    name = file_path.stem.replace("-", " ").replace("_", " ").title()
    return name

def upload_to_storage(file_path, storage_path):
    """Upload file to Supabase Storage"""
    with open(file_path, 'rb') as f:
        content = f.read()

    resp = requests.post(
        f"{SUPABASE_URL}/storage/v1/object/topics/{storage_path}",
        headers={**HEADERS, "Content-Type": "text/html", "x-upsert": "true"},
        data=content
    )

    if resp.status_code in [200, 201]:
        return True
    else:
        print(f"  ❌ Upload failed: {resp.text}")
        return False

def update_db_topic(topic_id, storage_path, file_path):
    """Update database topic with storage path"""
    resp = requests.patch(
        f"{SUPABASE_URL}/rest/v1/subject_topics?id=eq.{topic_id}",
        headers={**HEADERS, "Content-Type": "application/json", "Prefer": "return=minimal"},
        json={"storage_path": storage_path, "file_path": str(file_path)}
    )
    return resp.status_code in [200, 204]

def main():
    print("🚀 Starting topic upload...")

    # Get database topics
    print("📥 Fetching database topics...")
    db_topics = get_db_topics()
    print(f"   Found {len(db_topics)} topics in database")

    # Create lookup dict by subject and topic name
    db_lookup = {}
    for t in db_topics:
        key = f"{t['subject'].lower()}_{t['topic'].lower().replace(' ', '_').replace('-', '_')}"
        db_lookup[key] = t

    # Get all topic files
    print("📁 Scanning topic files...")
    topic_files = get_topic_files()
    print(f"   Found {len(topic_files)} topic files")

    # Match and upload
    uploaded = 0
    matched = 0

    for file_path in topic_files:
        subject = extract_subject_from_path(file_path)
        topic_name = extract_topic_from_file(file_path)

        # Create lookup key
        key1 = f"{subject.lower()}_{topic_name.lower().replace(' ', '_')}" if subject else None
        key2 = topic_name.lower().replace(' ', '_').replace('-', '_')

        # Try to find matching database topic
        db_topic = None
        for k, v in db_lookup.items():
            if key2 in k or k in key2.replace('_', ''):
                db_topic = v
                break
            if subject and key1 and (key1 in k or k in key1):
                db_topic = v
                break

        # Create storage path
        storage_path = f"{subject.lower() if subject else 'general'}/{file_path.name}"

        # Upload file
        print(f"\n📤 Uploading: {file_path.name}")
        if upload_to_storage(file_path, storage_path):
            uploaded += 1
            print(f"   ✅ Uploaded to: {storage_path}")

            # Update database if matched
            if db_topic:
                matched += 1
                if update_db_topic(db_topic['id'], storage_path, file_path):
                    print(f"   ✅ Linked to DB: {db_topic['subject']} - {db_topic['topic']}")
            else:
                # Create new topic entry
                print(f"   ℹ️ No DB match, will create new topic entry")

    print(f"\n{'='*50}")
    print(f"✅ Upload complete!")
    print(f"   Files uploaded: {uploaded}")
    print(f"   DB matches: {matched}")

if __name__ == "__main__":
    main()
