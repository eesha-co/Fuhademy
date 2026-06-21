#!/bin/bash

# CBT Question Extraction Script using z-ai CLI
# Extracts questions from PDF pages with VLM analysis

CBT_DIR="/home/z/my-project/students/cbt"
SUBJECTS="physics maths english economics"

# Create output directories
mkdir -p "$CBT_DIR/extracted"

extract_questions_from_page() {
    local image_path="$1"
    local subject="$2"
    
    # Create a temporary file for the prompt
    local prompt_file=$(mktemp)
    
    cat > "$prompt_file" << 'PROMPT_EOF'
You are an expert at extracting exam questions from educational materials.

Analyze this exam page and extract ALL questions from it.

CRITICAL RULES:
1. Extract EVERY question visible on this page - do not skip any
2. Preserve the EXACT wording - include all mathematical symbols, units, and notation
3. For questions with diagrams, set "hasImage": true
4. Extract all options exactly as written
5. Identify the correct answer if shown
6. Note the exam year if visible

Return ONLY a valid JSON array (no markdown, no explanations):
[{"year":"2023","question":"text","options":["A","B","C","D"],"correctAnswer":0,"hasImage":false}]

If no questions, return: []
PROMPT_EOF
    
    # Call z-ai vision
    result=$(z-ai vision -p "$(cat "$prompt_file")" -i "$image_path" 2>/dev/null)
    
    rm -f "$prompt_file"
    
    echo "$result"
}

process_subject() {
    local subject="$1"
    local pages_dir="$CBT_DIR/pdf_pages/$subject"
    local output_file="$CBT_DIR/extracted/${subject}_questions.json"
    
    echo ""
    echo "============================================================"
    echo "Processing $subject"
    echo "============================================================"
    
    if [ ! -d "$pages_dir" ]; then
        echo "No pages directory for $subject"
        return
    fi
    
    # Get sorted list of pages
    pages=($(ls "$pages_dir"/*.png 2>/dev/null | sort -V))
    total_pages=${#pages[@]}
    
    echo "Found $total_pages pages"
    
    # Initialize output file with empty array
    echo "[" > "$output_file"
    
    local first_question=true
    local question_id=1
    
    for i in "${!pages[@]}"; do
        local page="${pages[$i]}"
        local page_num=$((i + 1))
        
        printf "  [%d/%d] %s... " "$page_num" "$total_pages" "$(basename "$page")"
        
        # Extract questions from page
        result=$(extract_questions_from_page "$page" "$subject")
        
        # Parse and add questions
        if [ -n "$result" ] && [ "$result" != "[]" ]; then
            # Clean up result - remove markdown code blocks if present
            clean_result=$(echo "$result" | sed 's/```json//g' | sed 's/```//g' | tr -d '\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
            
            # Try to extract JSON array
            if [[ "$clean_result" =~ \[.*\] ]]; then
                json_array="${BASH_REMATCH[0]}"
                
                # Count questions in this batch
                question_count=$(echo "$json_array" | grep -o '"question"' | wc -l)
                
                if [ "$question_count" -gt 0 ]; then
                    # Add comma if not first
                    if [ "$first_question" = true ]; then
                        first_question=false
                    else
                        echo "," >> "$output_file"
                    fi
                    
                    # Add questions to output (remove outer brackets for individual items)
                    echo "$json_array" | sed 's/^\[//' | sed 's/\]$//' >> "$output_file"
                    
                    question_id=$((question_id + question_count))
                    echo "Found $question_count questions (Total: $((question_id - 1)))"
                else
                    echo "No questions found"
                fi
            else
                echo "Parse error"
            fi
        else
            echo "No questions found"
        fi
        
        # Small delay to avoid rate limiting
        sleep 0.3
    done
    
    echo "]" >> "$output_file"
    
    # Count total questions
    total=$(grep -o '"question"' "$output_file" | wc -l)
    echo ""
    echo "✓ Extracted $total questions for $subject"
    echo "  Saved to: $output_file"
}

# Main execution
echo "Starting CBT Question Extraction..."
echo "CBT Directory: $CBT_DIR"

for subject in $SUBJECTS; do
    process_subject "$subject"
done

echo ""
echo "============================================================"
echo "EXTRACTION COMPLETE"
echo "============================================================"

for subject in $SUBJECTS; do
    count=$(grep -o '"question"' "$CBT_DIR/extracted/${subject}_questions.json" 2>/dev/null | wc -l)
    echo "  $subject: $count questions"
done
