#!/bin/bash

# Process a single page and save result
# Usage: process_single_page.sh <subject> <page_number>

SUBJECT="$1"
PAGE_NUM="$2"
CBT_DIR="/home/z/my-project/students/cbt"

# Find the page file
PAGE_FILE=$(ls "$CBT_DIR/pdf_pages/$SUBJECT/page-$(printf '%02d' $PAGE_NUM).png" 2>/dev/null)

if [ -z "$PAGE_FILE" ]; then
    echo "Page not found"
    exit 1
fi

OUTPUT_FILE="$CBT_DIR/extracted/page_results/${SUBJECT}_page_${PAGE_NUM}.json"

# Skip if already processed
if [ -f "$OUTPUT_FILE" ]; then
    echo "Already processed"
    exit 0
fi

PROMPT='Extract ALL exam questions from this page. Return ONLY JSON array: [{"year":"2023","question":"exact text","options":["A","B","C","D"],"correctAnswer":0,"hasImage":false}]. No markdown. If no questions, return [].'

# Run z-ai vision
result=$(z-ai vision -p "$PROMPT" -i "$PAGE_FILE" 2>&1)

# Extract content field
content=$(echo "$result" | grep -oP '(?<="content": ")[^"]*' | head -1)

if [ -n "$content" ]; then
    # Decode unicode escapes and save
    echo -e "$content" > "$OUTPUT_FILE"
    echo "Saved: $OUTPUT_FILE"
else
    echo "[]" > "$OUTPUT_FILE"
    echo "Empty result saved"
fi
