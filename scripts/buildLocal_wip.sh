# 🚧 WIP: Was meant for local build deploys
# ❌ Currently breaks due to rsync code 23 (partial sync / type file volatility)
# ✅ Use only for debugging or resurrection later
 
# 🚨 Exit on errors, undefined vars, or pipe failures
set -euo pipefail

# 📁 Resolve project root
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# 📦 Load environment config
ENV_FILE="$PROJECT_ROOT/.env.deploy"
if [ -f "$ENV_FILE" ]; then
  echo "📦 Loading $ENV_FILE..."
  source "$ENV_FILE"
else
  echo "❌ ERROR: $ENV_FILE not found."
  exit 1
fi

# ✅ Required config
REMOTE_HOST="${REMOTE_HOST:-}"
REMOTE_DIR="${REMOTE_DIR:-}"
APP_NAME="${APP_NAME:-}"
PM2="${PM2:-pm2}" # fallback if not set

echo "🔧 Config:"
echo "  REMOTE_HOST=$REMOTE_HOST"
echo "  REMOTE_DIR=$REMOTE_DIR"
echo "  APP_NAME=$APP_NAME"
echo "  PM2=$PM2"

# 🧪 Validate required env vars
if [[ -z "$REMOTE_HOST" || -z "$REMOTE_DIR" || -z "$APP_NAME" ]]; then
  echo "❌ ERROR: REMOTE_HOST, REMOTE_DIR, and APP_NAME must be set."
  exit 1
fi

# === LOCAL PREP ===
echo "✅ Building project locally..."
rm -rf "$PROJECT_ROOT/.next"
npm run build

# === SYNC ===
echo "🚀 Syncing build + source to server..."
rsync -avz --delete \
  --exclude=".next/types" \
  "$PROJECT_ROOT/.next" \
  "$PROJECT_ROOT/public" \
  "$PROJECT_ROOT/package.json" \
  "$PROJECT_ROOT/package-lock.json" \
  "$PROJECT_ROOT/node_modules" \
  "$PROJECT_ROOT/.env.production" \
  "$PROJECT_ROOT/app" \
  "$PROJECT_ROOT/middleware.ts" \
  "$PROJECT_ROOT/types" \
  "$PROJECT_ROOT/utils" \
  "$REMOTE_HOST:$REMOTE_DIR"

# === REMOTE DEPLOY ===
echo "🔁 Restarting app on remote..."
ssh "$REMOTE_HOST" <<EOF
  set -e
  export NVM_DIR="\$HOME/.nvm"
  [ -s "\$NVM_DIR/nvm.sh" ] && . "\$NVM_DIR/nvm.sh"

  echo "🛑 Stopping old process (if running)..."
  $PM2 delete "$APP_NAME" || true

  echo "▶️ Starting new PM2 process..."
  $PM2 start "$REMOTE_DIR/node_modules/.bin/next" \
    --name "$APP_NAME" \
    -- start "$REMOTE_DIR"

  echo "📄 Logs:"
  $PM2 logs "$APP_NAME" --lines 50
EOF

echo "✅ Deployment complete."