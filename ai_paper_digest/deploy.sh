#!/bin/bash
# Aether AI Research Feed — deploy helper
# 1) Optionally refresh today's 20 items
# 2) Commit & push → GitHub Actions publishes public Pages site

set -euo pipefail
cd "$(dirname "$0")"

REFRESH=0
if [[ "${1:-}" == "--refresh" ]]; then
  REFRESH=1
fi

if [[ "$REFRESH" -eq 1 ]]; then
  echo "📥 Fetching today's ~20 papers / blogs / essays…"
  python3 fetch_papers.py --limit 20
fi

# Repo root (parent of ai_paper_digest)
cd ..

echo "🚀 Preparing to push AI Paper Digest to GitHub…"

git add ai_paper_digest/ .github/workflows/deploy-pages.yml 2>/dev/null || git add ai_paper_digest/

if git diff --cached --quiet; then
  echo "ℹ️  Nothing new to commit."
else
  commit_message="deploy: Aether AI feed update ($(date '+%Y-%m-%d %H:%M:%S'))"
  git commit -m "$commit_message"
fi

current_branch=$(git branch --show-current)
echo "📤 Pushing branch '$current_branch'…"
git push origin "$current_branch"

echo ""
echo "✅ Push complete. GitHub Actions will publish the public site."
echo ""
echo "🌐 Public URL (after Pages is enabled once):"
echo "   https://ianawyy.github.io/IanaWYY/"
echo ""
echo "⚙️  One-time setup if the link still 404s:"
echo "   1. Open https://github.com/IanaWYY/IanaWYY/settings/pages"
echo "   2. Build and deployment → Source: GitHub Actions"
echo "   3. Ensure the repo is Public (Settings → General → Danger Zone → Change visibility)"
echo "   4. Wait 1–2 minutes, then open the URL above"
echo ""
echo "💡 Daily refresh locally:  cd ai_paper_digest && ./deploy.sh --refresh"
