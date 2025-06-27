#!/bin/bash

echo "🚀 Starting Eurus Labs applications..."
echo ""

# Start the main Eurus Labs app on port 3000
echo "📱 Starting main Eurus Labs app on http://localhost:3000"
cd '/Users/aarshashdhir/Downloads/eidos-website (5)'
pnpm dev &
MAIN_APP_PID=$!

# Wait a moment
sleep 2

# Start the Write Editor on port 3001
echo "✍️  Starting Eurus Draft (Write Editor) on http://localhost:3001"
cd ~/Documents/write
BROWSER=none PORT=3001 npm start &
WRITE_EDITOR_PID=$!

echo ""
echo "✅ Both applications are starting..."
echo ""
echo "🌐 Main Eurus Labs app: http://localhost:3000"
echo "✍️  Eurus Draft editor: http://localhost:3001"
echo ""
echo "💡 Click 'Our Companies' → 'Eurus Draft' in the main app to access the editor"
echo ""
echo "⚠️  Press Ctrl+C to stop both applications"

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Stopping applications..."
    kill $MAIN_APP_PID $WRITE_EDITOR_PID 2>/dev/null
    echo "✅ Applications stopped"
    exit 0
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait 