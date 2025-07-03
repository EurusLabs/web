#!/bin/bash

# Set variables
STORAGE_ACCOUNT="eurusworkflows"
CONTAINER_NAME="eurusworkflows"
ACCOUNT_KEY="PKwxUDYNzfnkZ+A7y2Ii1KvzXYNJvEzOntvcAc7tuUUTTfj9ooGqD+F5PR2j32p6Y+NrysIsmoJy+AStGn0RqA=="

# Clear previous mappings
> url-mappings.txt

# Find all files in public directory
find public -type f \( ! -name "*.html" \) | while read -r file; do
    # Get relative path
    relative_path=${file#public/}
    
    echo "Uploading $file..."
    
    # Upload file
    az storage blob upload \
        --account-name $STORAGE_ACCOUNT \
        --container-name $CONTAINER_NAME \
        --name "$relative_path" \
        --file "$file" \
        --account-key "$ACCOUNT_KEY" \
        --overwrite true

    # Get the URL
    url=$(az storage blob url \
        --account-name $STORAGE_ACCOUNT \
        --container-name $CONTAINER_NAME \
        --name "$relative_path" \
        --account-key "$ACCOUNT_KEY" \
        --output tsv)

    # Store the mapping
    echo "/$relative_path|$url" >> url-mappings.txt
    
    echo "Uploaded $file to $url"
done

echo "Upload complete! URL mappings have been saved to url-mappings.txt" 