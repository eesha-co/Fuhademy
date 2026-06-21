#!/bin/bash

# CBT Question Extraction - Batch Processing
# Processes PDF pages and extracts questions using z-ai vision

CBT_DIR="/home/z/my-project/students/cbt"
OUTPUT_DIR="$CBT_DIR/extracted"
PROMPT="Extract ALL exam questions from this page. Return ONLY JSON array (no markdown): [{year:'2023',question:'exact text',options:['A','B','C','D'],correctAnswer:0,hasImage:false}]. If no questions, return []."

mkdir -p "$OUTPUT_DIR"

process_page() {
    local page_path="$1"
    local output_file="$2"
    
    result=$(z-ai vision -p "$PROMPT" -i "$page_path" 2>&1)
    
    # Extract content from JSON response
    content=$(echo "$result" | grep -o '"content":.*' | sed 's/"content": "//' | sed 's/",.*//')
    
    # Decode unicode escapes
    content=$(echo -e "$content")
    
    echo "$content"
}

process_subject() {
    local subject="$1"
    local pages_dir="$CBT_DIR/pdf_pages/$subject"
    local output_file="$OUTPUT_DIR/${subject}_raw.json"
    local progress_file="$OUTPUT_DIR/${subject}_progress.txt"
    
    echo ""
    echo "============================================================" 
    echo "Processing: $subject"
    echo "============================================================"
    
    if [ ! -d "$pages_dir" ]; then
        echo "No pages directory for $subject"
        return
    fi
    
    # Get sorted pages
    mapfile -t pages < <(ls "$pages_dir"/*.png 2>/dev/null | sort -V)
    total=${#pages[@]}
    
    echo "Total pages: $total"
    
    # Check for resume point
    start_idx=0
    if [ -f "$progress_file" ]; then
        start_idx=$(cat "$progress_file")
        echo "Resuming from page $((start_idx + 1))"
    fi
    
    # Initialize output file
    if [ $start_idx -eq 0 ]; then
        echo "[" > "$output_file"
    fi
    
    local first=true
    local question_count=0
    
    for i in "${!pages[@]}"; do
        if [ $i -lt $start_idx ]; then
            continue
        fi
        
        local page="${pages[$i]}"
        local page_num=$((i + 1))
        local basename=$(basename "$page")
        
        printf "  [%d/%d] %s... " "$page_num" "$total" "$basename"
        
        result=$(process_page "$page" "$output_file")
        
        if [ -n "$result" ] && [ "$result" != "[]" ]; then
            # Count questions
            count=$(echo "$result" | grep -o '"question"' | wc -l)
            question_count=$((question_count + count))
            
            if [ $count -gt 0 ]; then
                if [ "$first" = true ] && [ $start_idx -eq 0 ]; then
                    first=false
                else
                    echo "," >> "$output_file"
                fi
                # Remove outer brackets for merging
                echo "$result" | sed 's/^\[//' | sed 's/\]$//' >> "$output_file"
                echo "Found $count (Total: $question_count)"
            else
                echo "No questions"
            fi
        else
            echo "No questions"
        fi
        
        # Save progress
        echo $((i + 1)) > "$progress_file"
        
        # Small delay
        sleep 0.2
    done
    
    echo "]" >> "$output_file"
    
    # Clean up progress file
    rm -f "$progress_file"
    
    echo ""
    echo "✓ $subject: $question_count questions extracted"
    echo "  Raw file: $output_file"
}

# Process all subjects
for subject in physics maths english economics; do
    process_subject "$subject"
done

echo ""
echo "============================================================"
echo "EXTRACTION COMPLETE"
echo "============================================================"
