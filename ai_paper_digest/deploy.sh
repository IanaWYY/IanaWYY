#!/bin/bash
# Aether AI Research Feed - Deploy Helper Script
# Adds, commits, and pushes the paper digest directory to GitHub.

# Navigate to the repository root directory
cd "$(dirname "$0")/.."

echo "🚀 Preparing to push AI Paper Digest to GitHub..."

# Add files
git add ai_paper_digest/

# Commit changes
commit_message="deploy: add/update AI Paper Digest weekly feed with linguistic insights ($(date '+%Y-%m-%d %H:%M:%S'))"
git commit -m "$commit_message"

# Push to remote (auto-detect branch name, e.g. main or master)
current_branch=$(git branch --show-current)
echo "📤 Pushing to branch '$current_branch' on GitHub..."
git push origin "$current_branch"

echo "✅ Push successful!"
echo "💡 Make sure GitHub Pages is enabled in repository settings:"
echo "   👉 Go to: https://github.com/IanaWYY/IanaWYY/settings/pages"
echo "   👉 Source: 'Deploy from a branch'"
echo "   👉 Branch: '$current_branch' / Folder: '/ (root)'"
echo "   👉 Click Save."
echo "🔗 Your public link will be: https://ianawyy.github.io/IanaWYY/ai_paper_digest/"
