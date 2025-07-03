#!/bin/bash

# Read the mappings file
while IFS='|' read -r old_path new_url; do
    # Remove any trailing whitespace
    old_path=$(echo "$old_path" | tr -d '[:space:]')
    new_url=$(echo "$new_url" | tr -d '[:space:]')
    
    echo "Replacing $old_path with $new_url"
    
    # Use grep to find files containing the old path
    grep -r --files-with-matches "$old_path" app/ components/ --exclude-dir={node_modules,.next} | while read -r file; do
        # Replace the old path with the new URL
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS requires an empty string after -i
            sed -i '' "s|$old_path|$new_url|g" "$file"
        else
            # Linux version
            sed -i "s|$old_path|$new_url|g" "$file"
        fi
        echo "Updated $file"
    done
done < url-mappings.txt

echo "All asset references have been updated!" 