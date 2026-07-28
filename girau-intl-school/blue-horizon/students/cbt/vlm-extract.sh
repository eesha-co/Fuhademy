#!/bin/bash

# Extract questions from PDF pages using VLM
# Process one page at a time with progress saving

CBT_DIR="/home/z/my-project/students/cbt"
SUBJECT="${1:-physics}"  # Default to physics, can pass subject as arg

PAGES_DIR="$CBT_DIR/pdf_pages/$SUBJECT"
OUTPUT_DIR="$CBT_DIR/extracted"
mkdir -p "$OUTPUT_DIR"

# Check pages directory
if [ ! -d "$PAGES_DIR" ]; then
    echo "Pages directory not found: $PAGES_DIR"
    exit 1
fi

# Get list of pages
mapfile -t PAGES < <(ls "$PAGES_DIR"/*.png 2>/dev/null | sort -V)
TOTAL=${#PAGES[@]}

echo "============================================================"
echo "Subject: $SUBJECT"
echo "Total pages: $TOTAL"
echo "============================================================"

# Progress file
PROGRESS_FILE="$OUTPUT_DIR/${SUBJECT}_progress.txt"
QUESTIONS_FILE="$OUTPUT_DIR/${SUBJECT}_questions.json"

# Check for resume
START_IDX=0
if [ -f "$PROGRESS_FILE" ]; then
    START_IDX=$(cat "$PROGRESS_FILE")
    echo "Resuming from page $((START_IDX + 1))"
fi

# Initialize questions file
if [ $START_IDX -eq 0 ]; then
    echo "[" > "$QUESTIONS_FILE"
    QUESTION_COUNT=0
else
    # Count existing questions
    QUESTION_COUNT=$(grep -c '"id"' "$QUESTIONS_FILE" 2>/dev/null || echo "0")
fi

# Process each page
for IDX in $(seq $START_IDX $((TOTAL - 1))); do
    PAGE="${PAGES[$IDX]}"
    PAGE_NAME=$(basename "$PAGE")
    
    printf "[%d/%d] %s... " "$((IDX + 1))" "$TOTAL" "$PAGE_NAME"
    
    # Run VLM extraction
    RESULT=$(z-ai vision -p "Extract ALL exam questions from this page. Return ONLY a JSON array (no markdown):
[{\"year\":\"2023\",\"question\":\"exact text with all symbols\",\"options\":[\"A. text\",\"B. text\",\"C. text\",\"D. text\"],\"correctAnswer\":0,\"hasImage\":false}]
If no questions found, return: []" -i "$PAGE" 2>&1)
    
    # Extract content from response
    CONTENT=$(echo "$RESULT" | grep -oP '(?<="content": ")[^"]*' | head -1)
    
    if [ -n "$CONTENT" ] && [ "$CONTENT" != "[]" ]; then
        # Decode unicode
        CONTENT=$(echo -e "$CONTENT" | sed 's/\\n/\n/g' | sed 's/\\"/"/g')
        
        # Count questions
        FOUND=$(echo "$CONTENT" | grep -o '"question"' | wc -l)
        
        if [ $FOUND -gt 0 ]; then
            # Add comma if not first
            if [ $QUESTION_COUNT -gt 0 ]; then
                echo "," >> "$QUESTIONS_FILE"
            fi
            
            # Add questions without outer brackets
            echo "$CONTENT" | sed 's/^\[//' | sed 's/\]$//' >> "$QUESTIONS_FILE"
            
            QUESTION_COUNT=$((QUESTION_COUNT + FOUND))
            echo "Found $FOUND (Total: $QUESTION_COUNT)"
        else
            echo "No questions"
        fi
    else
        echo "No questions"
    fi
    
    # Save progress
    echo $((IDX + 1)) > "$PROGRESS_FILE"
    
    # Small delay to avoid rate limits
    sleep 0.3
done

# Close JSON array
echo "]" >> "$QUESTIONS_FILE"

# Clean up progress file
rm -f "$PROGRESS_FILE"

echo ""
echo "============================================================"
echo "Complete: $QUESTION_COUNT questions extracted"
echo "Saved to: $QUESTIONS_FILE"
echo "============================================================"
