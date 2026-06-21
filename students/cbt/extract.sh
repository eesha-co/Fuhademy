#!/bin/bash

# CBT Question Extraction Script
# Uses VLM to extract questions from PDF pages

CBT_DIR="/home/z/my-project/students/cbt"
SUBJECT="${1:-physics}"
START_PAGE="${2:-1}"

PAGES_DIR="$CBT_DIR/pdf_pages/$SUBJECT"
OUTPUT_DIR="$CBT_DIR/extracted"
mkdir -p "$OUTPUT_DIR"

# Count total pages
TOTAL_PAGES=$(ls "$PAGES_DIR"/*.png 2>/dev/null | wc -l)

echo "============================================================"
echo "CBT Question Extraction"
echo "Subject: $SUBJECT"
echo "Total pages: $TOTAL_PAGES"
echo "Starting from: $START_PAGE"
echo "============================================================"

# Output file
OUTPUT_FILE="$OUTPUT_DIR/${SUBJECT}_questions.json"
PROGRESS_FILE="$OUTPUT_DIR/${SUBJECT}_progress.txt"

# Initialize output
if [ "$START_PAGE" -eq 1 ]; then
    echo "[" > "$OUTPUT_FILE"
    TOTAL_QUESTIONS=0
else
    # Count existing questions
    TOTAL_QUESTIONS=$(grep -c '"id"' "$OUTPUT_FILE" 2>/dev/null || echo "0")
    echo "Resuming with $TOTAL_QUESTIONS existing questions"
fi

# Process each page
for PAGE_NUM in $(seq $START_PAGE $TOTAL_PAGES); do
    PAGE_FILE="$PAGES_DIR/page-$(printf '%02d' $PAGE_NUM).png"
    
    if [ ! -f "$PAGE_FILE" ]; then
        echo "Page $PAGE_NUM not found, skipping..."
        continue
    fi
    
    printf "[%d/%d] Processing page %d... " "$PAGE_NUM" "$TOTAL_PAGES" "$PAGE_NUM"
    
    # Run VLM extraction
    RESULT=$(z-ai vision -p 'Extract ALL exam questions from this page. Return ONLY a JSON array (no markdown, no explanation): [{"year":"2023","question":"exact text with all symbols","options":["A. option","B. option","C. option","D. option"],"correctAnswer":0,"hasImage":false}]. If no questions found, return: []' -i "$PAGE_FILE" 2>&1)
    
    # Extract content field
    CONTENT=$(echo "$RESULT" | python3 -c "
import sys, re, json
text = sys.stdin.read()
match = re.search(r'\"content\":\s*\"([^\"]+)\"', text)
if match:
    content = match.group(1)
    # Decode unicode escapes
    content = content.encode().decode('unicode_escape')
    print(content)
" 2>/dev/null)
    
    if [ -n "$CONTENT" ] && [ "$CONTENT" != "[]" ]; then
        # Count questions
        FOUND=$(echo "$CONTENT" | grep -o '"question"' | wc -l)
        
        if [ "$FOUND" -gt 0 ]; then
            # Add comma if not first batch
            if [ "$TOTAL_QUESTIONS" -gt 0 ]; then
                echo "," >> "$OUTPUT_FILE"
            fi
            
            # Add questions without outer brackets
            echo "$CONTENT" | sed 's/^\[//' | sed 's/\]$//' >> "$OUTPUT_FILE"
            
            TOTAL_QUESTIONS=$((TOTAL_QUESTIONS + FOUND))
            echo "Found $FOUND questions (Total: $TOTAL_QUESTIONS)"
        else
            echo "No questions found"
        fi
    else
        echo "No questions found"
    fi
    
    # Save progress every 10 pages
    if [ $((PAGE_NUM % 10)) -eq 0 ]; then
        echo "$PAGE_NUM" > "$PROGRESS_FILE"
        echo "  Progress saved at page $PAGE_NUM"
    fi
    
    # Small delay
    sleep 0.2
done

# Close JSON array
echo "]" >> "$OUTPUT_FILE"

# Clean up
rm -f "$PROGRESS_FILE"

echo ""
echo "============================================================"
echo "Complete: $TOTAL_QUESTIONS questions extracted"
echo "Saved to: $OUTPUT_FILE"
echo "============================================================"
