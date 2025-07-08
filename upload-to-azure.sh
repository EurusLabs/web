#!/bin/bash

# Set variables
STORAGE_ACCOUNT="eurusworkflows"
CONTAINER_NAME="eurusworkflows"
RESOURCE_GROUP="EurusLabs"

# Get storage account key
echo "🔑 Getting storage account key..."
STORAGE_KEY=$(az storage account keys list --account-name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query '[0].value' --output tsv)

echo "🔐 Logging in to Azure..."
# Check if already logged in
if ! az account show &>/dev/null; then
    echo "Please log in to Azure first:"
    az login
fi

echo "📁 Checking public directory..."
if [ ! -d "public" ]; then
    echo "❌ Public directory does not exist"
    exit 1
fi

# Count files to upload
file_count=$(find public -type f \( ! -name "*.html" \) | wc -l)
echo "📊 Found $file_count files to upload"

if [ $file_count -eq 0 ]; then
    echo "ℹ️ No files found to upload"
    exit 0
fi

# Clear previous mappings
> url-mappings.txt

echo "🚀 Starting upload process..."

# Find all files in public directory
find public -type f \( ! -name "*.html" \) | while read -r file; do
    # Get relative path
    relative_path=${file#public/}
    
    echo "⬆️ Uploading $file..."
    
    # Upload file with better error handling
    if az storage blob upload \
        --account-name $STORAGE_ACCOUNT \
        --container-name $CONTAINER_NAME \
        --name "$relative_path" \
        --file "$file" \
        --account-key "$STORAGE_KEY" \
        --overwrite true; then

        # Get the URL
        url=$(az storage blob url \
            --account-name $STORAGE_ACCOUNT \
            --container-name $CONTAINER_NAME \
            --name "$relative_path" \
            --account-key "$STORAGE_KEY" \
            --output tsv)

        # Store the mapping
        echo "/$relative_path|$url" >> url-mappings.txt
        
        echo "✅ Successfully uploaded $file to $url"
    else
        echo "❌ Failed to upload $file"
        exit 1
    fi
done

echo "🎉 Upload complete! URL mappings have been saved to url-mappings.txt"
echo "📋 Summary:"
echo "   - Files uploaded: $(wc -l < url-mappings.txt)"
echo "   - Storage account: $STORAGE_ACCOUNT"
echo "   - Container: $CONTAINER_NAME" 