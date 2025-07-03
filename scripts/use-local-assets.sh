#!/bin/bash

# Read the mappings file
if [ ! -f "url-mappings.txt" ]; then
    echo "No url-mappings.txt file found. Nothing to revert."
    exit 0
fi

# Revert Azure URLs back to local paths
while IFS='|' read -r local_path azure_url; do
    # Remove any trailing whitespace
    local_path=$(echo "$local_path" | tr -d '[:space:]')
    azure_url=$(echo "$azure_url" | tr -d '[:space:]')
    
    echo "Reverting $azure_url back to $local_path"
    
    # Use grep to find files containing the Azure URL
    grep -r --files-with-matches "$azure_url" app/ components/ --exclude-dir={node_modules,.next} | while read -r file; do
        # Replace the Azure URL with the local path
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS requires an empty string after -i
            sed -i '' "s|$azure_url|$local_path|g" "$file"
        else
            # Linux version
            sed -i "s|$azure_url|$local_path|g" "$file"
        fi
        echo "Updated $file"
    done
done < url-mappings.txt

echo "All asset references have been reverted to local paths!" 