#!/usr/bin/env python3
"""
Continue uploading remaining topic HTML files
"""

import os
import json
import re
import requests
from pathlib import Path
import time

SUPABASE_URL = "https://kruwfhzfqieuiuhqlutt.supabase.co"
SERVICE_KEY = "REDACTED_USE_ENV_VAR"

MANIFEST = {}

def slugify(text):
    return re.sub(r'[^a-z0-9]+', '-', text.lower()).strip('-')

def upload_file(local_path, storage_path):
    headers = {
        "Authorization": f"Bearer {SERVICE_KEY}",
        "Content-Type": "text/html",
        "x-upsert": "true"
    }
    with open(local_path, 'rb') as f:
        content = f.read()
    try:
        resp = requests.post(
            f"{SUPABASE_URL}/storage/v1/object/topics/{storage_path}",
            headers=headers,
            data=content,
            timeout=30
        )
        return resp.status_code in [200, 201]
    except:
        return False

def get_subject(path):
    subjects = ["mathematics", "physics", "chemistry", "biology", "english", "economics", "government", "literature", "accounting"]
    for part in Path(path).parts:
        if part.lower() in subjects:
            return part.capitalize()
    return "General"

def main():
    base = Path("/home/z/my-project/students/subjects")
    files = [f for f in base.rglob("*.html") if f.name != "index.html"]
    
    print(f"Found {len(files)} files")
    
    for i, f in enumerate(files[100:300]):  # Files 100-300
        subject = get_subject(f)
        topic = f.stem.replace("-", " ").title()
        storage_path = f"{slugify(subject)}/{slugify(f.stem)}.html"
        
        if upload_file(f, storage_path):
            topic_id = f"{slugify(subject)}_{slugify(f.stem)}"
            MANIFEST[topic_id] = {
                "subject": subject,
                "topic": topic,
                "storage_path": storage_path,
                "url": f"{SUPABASE_URL}/storage/v1/object/public/topics/{storage_path}"
            }
            print(f"✅ [{i+101}/300] {subject}: {topic}")
        else:
            print(f"❌ [{i+101}/300] {subject}: {topic}")
        
        time.sleep(0.05)
    
    # Save manifest
    with open("/home/z/my-project/topics_manifest2.json", 'w') as f:
        json.dump(MANIFEST, f, indent=2)
    
    print(f"\n✅ Uploaded {len(MANIFEST)} topics")

if __name__ == "__main__":
    main()
