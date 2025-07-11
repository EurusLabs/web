#!/bin/bash

# Eurus Labs Production Deployment Script
# This script builds and deploys the website to Azure Static Web Apps

set -e  # Exit on any error

echo "🚀 Starting Eurus Labs deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="eurus-web"
BUILD_DIR="build"
AZURE_STORAGE_ACCOUNT="eurusworkflows"
AZURE_CONTAINER="\$web"
AZURE_SUBSCRIPTION="your-subscription-id"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version check passed: $(node -v)"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf .next out build node_modules/.cache

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm ci --production=false
fi

# Run type check
print_status "Running TypeScript type check..."
npm run type-check

# Build the project
print_status "Building the project..."
NODE_ENV=production npm run build

# Verify build output
if [ ! -d "$BUILD_DIR" ]; then
    print_error "Build directory not found. Build may have failed."
    exit 1
fi

print_success "Build completed successfully!"

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    print_warning "Azure CLI not found. Skipping Azure deployment."
    print_status "Build is ready in the '$BUILD_DIR' directory."
    print_status "You can manually upload the contents to your hosting provider."
    exit 0
fi

# Check if logged into Azure
if ! az account show &> /dev/null; then
    print_warning "Not logged into Azure. Please run 'az login' first."
    print_status "Build is ready in the '$BUILD_DIR' directory."
    exit 0
fi

# Deploy to Azure Storage
print_status "Deploying to Azure Storage..."

# Upload files to Azure Storage
az storage blob upload-batch \
    --account-name "$AZURE_STORAGE_ACCOUNT" \
    --auth-mode login \
    --source "$BUILD_DIR" \
    --destination "$AZURE_CONTAINER" \
    --overwrite

if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    print_status "Website is now live at: https://euruslabs.com"
else
    print_error "Deployment failed!"
    exit 1
fi

# Generate sitemap
print_status "Generating sitemap..."
cat > "$BUILD_DIR/sitemap.xml" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://euruslabs.com/</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/publications</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/research</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/contact</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/manifesto</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/creators</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/discover</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/earnings</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/results</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/get-started</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://euruslabs.com/create-album</loc>
    <lastmod>$(date -u +%Y-%m-%d)</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
</urlset>
EOF

# Upload sitemap
az storage blob upload \
    --account-name "$AZURE_STORAGE_ACCOUNT" \
    --auth-mode login \
    --container-name "$AZURE_CONTAINER" \
    --name "sitemap.xml" \
    --file "$BUILD_DIR/sitemap.xml" \
    --overwrite

print_success "Sitemap generated and uploaded!"

# Set cache headers for static assets
print_status "Setting cache headers for static assets..."

# Get list of static files and set cache headers
find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" -o -name "*.gif" -o -name "*.svg" -o -name "*.ico" -o -name "*.woff" -o -name "*.woff2" \) | while read -r file; do
    relative_path="${file#$BUILD_DIR/}"
    az storage blob metadata update \
        --account-name "$AZURE_STORAGE_ACCOUNT" \
        --auth-mode login \
        --container-name "$AZURE_CONTAINER" \
        --name "$relative_path" \
        --metadata "Cache-Control=max-age=31536000,immutable"
done

print_success "Cache headers set for static assets!"

# Final success message
print_success "🎉 Deployment completed successfully!"
print_status "Website: https://euruslabs.com"
print_status "Sitemap: https://euruslabs.com/sitemap.xml"
print_status "Build directory: $BUILD_DIR"

echo ""
print_status "Next steps:"
echo "  - Verify the website is working correctly"
echo "  - Check that all pages load properly"
echo "  - Test the Studio redirect functionality"
echo "  - Monitor for any console errors"
echo ""

print_success "Deployment script completed!" 