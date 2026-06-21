#!/usr/bin/env python3
"""
Upload all topic HTML files to Supabase Storage
Creates a topic manifest for AI to use
"""

import os
import json
import re
import requests
from pathlib import Path

SUPABASE_URL = "https://kruwfhzfqieuiuhqlutt.supabase.co"
SERVICE_KEY = "REDACTED_USE_ENV_VAR"

TOPICS_MANIFEST = {}

def slugify(text):
    """Convert text to URL-friendly slug"""
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def upload_file(file_path, storage_path):
    """Upload a single file to Supabase Storage"""
    headers = {
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "text/html",
        "x-upsert": "true"
    }
    
    with open(file_path, 'rb') as f:
        content = f.read()
    
    resp = requests.post(
        f"{SUPABASE_URL}/storage/v1/object/topics/{storage_path}",
        headers=headers,
        data=content
    )
    
    return resp.status_code in [200, 201], storage_path

def get_subject_from_path(file_path):
    """Extract subject from file path"""
    subjects = {
        "mathematics": "Mathematics",
        "physics": "Physics", 
        "chemistry": "Chemistry",
        "biology": "Biology",
        "english": "English Language",
        "economics": "Economics",
        "government": "Government",
        "literature": "Literature",
        "accounting": "Accounting"
    }
    
    parts = Path(file_path).parts
    for part in parts:
        lower = part.lower()
        if lower in subjects:
            return subjects[lower]
    return "General"

def get_category_from_path(file_path):
    """Extract category from file path"""
    parts = Path(file_path).parts
    subjects = ["mathematics", "physics", "chemistry", "biology", "english", "economics", "government", "literature", "accounting"]
    
    for i, part in enumerate(parts):
        if part.lower() in subjects and i + 1 < len(parts):
            category = parts[i + 1].replace("-", " ").replace("_", " ").title()
            if category.lower() not in subjects:
                return category
    return None

def get_topic_name(file_path):
    """Extract topic name from file path"""
    name = Path(file_path).stem
    return name.replace("-", " ").replace("_", " ").title()

def process_file(file_path, storage_base=""):
    """Process a single topic file"""
    # Get metadata
    subject = get_subject_from_path(file_path)
    category = get_category_from_path(file_path)
    topic_name = get_topic_name(file_path)
    
    # Create storage path
    storage_path = f"{subject.lower()}/{slugify(topic_name)}.html"
    
    # Upload
    success, path = upload_file(file_path, storage_path)
    
    if success:
        # Add to manifest
        topic_id = f"{slugify(subject)}_{slugify(topic_name)}"
        TOPICS_MANIFEST[topic_id] = {
            "subject": subject,
            "category": category,
            "topic": topic_name,
            "storage_path": storage_path,
            "url": f"{SUPABASE_URL}/storage/v1/object/public/topics/{storage_path}"
        }
        return True, topic_name
    return False, topic_name

def main():
    print("🚀 Uploading all topic files to Supabase Storage...")
    
    all_files = []
    
    # Get all topic HTML files from subjects folder (exclude index.html)
    base_path = Path("/home/z/my-project/students/subjects")
    for html_file in base_path.rglob("*.html"):
        if html_file.name != "index.html":
            all_files.append(html_file)
    
    # Add additional modules
    extra_files = [
        "/home/z/my-project/students/chemistry-modules/electrolysis/index.html",
        "/home/z/my-project/students/simple-machines-module/index.html",
        "/home/z/my-project/students/subjects/experiments.html",
    ]
    for p in extra_files:
        if os.path.exists(p):
            all_files.append(Path(p))
    
    print(f"📁 Found {len(all_files)} files to upload")
    
    # Upload files
    uploaded = 0
    failed = 0
    
    for i, file_path in enumerate(all_files):
        success, topic = process_file(file_path)
        if success:
            uploaded += 1
            print(f"  ✅ [{i+1}/{len(all_files)}] {topic}")
        else:
            failed += 1
            print(f"  ❌ [{i+1}/{len(all_files)}] {topic}")
    
    # Save manifest
    manifest_path = "/home/z/my-project/topics_manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(TOPICS_MANIFEST, f, indent=2)
    
    # Also upload manifest to Supabase
    manifest_json = json.dumps(TOPICS_MANIFEST, indent=2)
    headers = {
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "application/json",
        "x-upsert": "true"
    }
    resp = requests.post(
        f"{SUPABASE_URL}/storage/v1/object/topics/manifest.json",
        headers=headers,
        data=manifest_json
    )
    
    print(f"\n{'='*50}")
    print(f"✅ Upload complete!")
    print(f"   Uploaded: {uploaded}")
    print(f"   Failed: {failed}")
    print(f"   Manifest saved locally: {manifest_path}")
    print(f"   Manifest on Supabase: {SUPABASE_URL}/storage/v1/object/public/topics/manifest.json")
    print(f"   Total topics: {len(TOPICS_MANIFEST)}")

if __name__ == "__main__":
    main()
