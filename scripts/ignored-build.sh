#!/usr/bin/env bash
# Vercel Ignored Build Step Script
# This script determines if a build should run based on changed files

set -euo pipefail

APP_PATH="$1"  # e.g. apps/europcar-intake

# List of shared packages this app depends on
DEPS=(
  packages/ui
  packages/config
  packages/db
  packages/auth
  packages/pdf
  packages/mydata
  packages/email
  packages/utils
)

# Get changed files between current commit and previous
CHANGED=$(git diff --name-only HEAD^ HEAD 2>/dev/null || echo "")

# Check if any relevant files changed
NEED_BUILD=false

# Check app directory
if echo "$CHANGED" | grep -q "^$APP_PATH/"; then
  NEED_BUILD=true
fi

# Check shared packages
for dep in "${DEPS[@]}"; do
  if echo "$CHANGED" | grep -q "^$dep/"; then
    NEED_BUILD=true
    break
  fi
done

# Check root config files that affect all apps
if echo "$CHANGED" | grep -qE "^(pnpm-workspace\.yaml|turbo\.json|package\.json)$"; then
  NEED_BUILD=true
fi

if [ "$NEED_BUILD" = false ]; then
  echo "✅ No relevant changes for $APP_PATH — skipping build"
  exit 0
fi

echo "🔨 Changes detected for $APP_PATH — proceeding with build"
exit 1  # Non-zero exit means "proceed with build"
