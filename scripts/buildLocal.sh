#!/bin/bash

# 🚨 Exit immediately on errors
set -euo pipefail

# ✅ Config (fill these in or export from .env)
REMOTE_USER="${REMOTE_USER:-}"
REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_DIR="${REMOTE_DIR:-}"
APP_NAME="next-blog"

# === VALIDATE REQUIRED VARIABLES ===
if [[ -z "$REMOTE_USER" || -z "$REMOTE_HOST" || -z "$REMOTE_DIR" ]]; then
  echo "❌ ERROR: REMOTE_USER, REMOTE_HOST, and REMOTE_DIR must be set."
  exit 1
fi

# === BUILD ===
echo "✅ Building project..."
npm run build

# === SYNC ===
echo "🚀 Syncing files to server..."
rsync -avz --delete \
  .next \
  public \
  package.json \
  package-lock.json \
  node_modules \
  .env.production \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR"

# === REMOTE DEPLOY ===
echo "🔁 Restarting app via PM2..."
ssh "$REMOTE_USER@$REMOTE_HOST" bash <<EOF
  set -e
  echo "🛑 Deleting old process..."
  pm2 delete "$APP_NAME" || true

  echo "▶️ Starting new process..."
  cd "$REMOTE_DIR"
  pm2 start npm --name "$APP_NAME" -- run start

  echo "📄 Logs:"
  pm2 logs "$APP_NAME" --lines 50
EOF