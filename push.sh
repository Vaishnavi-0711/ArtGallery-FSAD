#!/bin/bash
# Helper script to push changes to GitHub with a custom message
# Usage: ./push.sh "Your commit message here"

if [ -z "$1" ]; then
    echo "Usage: ./push.sh \"Your commit message\""
    echo "Example: ./push.sh \"Add new feature\""
    exit 1
fi

echo "📝 Committing changes: $1"
git add .

git commit -m "$1"

if [ $? -eq 0 ]; then
    echo "✅ Commit successful. Pushing to GitHub..."
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "🎉 Successfully pushed to GitHub!"
    else
        echo "❌ Push failed. Check your connection or permissions."
        exit 1
    fi
else
    echo "⚠️ Nothing to commit or commit failed."
    exit 1
fi
