#!/usr/bin/env bash

set -Eeuo pipefail

PROJECT_DIR="/var/www/veda-structure"
BACKEND_DIR="$PROJECT_DIR/backend"
NODE_BIN="/home/deploy/.nvm/versions/node/v24.21.0/bin"

# Ensure Node.js, npm and PM2 are available in non-interactive SSH sessions.
export PATH="$NODE_BIN:$PATH"

# Prevent overlapping deployments on the VPS.
exec 9>/tmp/veda-backend-deploy.lock
flock -n 9 || {
  echo "Another deployment is already running."
  exit 1
}

echo "======================================"
echo "Starting Veda backend deployment"
echo "======================================"

cd "$PROJECT_DIR"

echo "Checking Git working tree..."
git status --short

echo "Fetching latest main branch..."
git fetch origin main

echo "Updating repository..."
git merge --ff-only origin/main

cd "$BACKEND_DIR"

echo "Installing production and migration dependencies..."
npm ci --include=dev

echo "Running pending database migrations..."
npm run migrate

echo "Restarting PM2 backend..."
pm2 restart veda-backend

echo "Waiting for backend process..."
sleep 5

echo "Checking PM2 process status..."
pm2 jlist | node -e '
let input = "";
process.stdin.on("data", chunk => input += chunk);
process.stdin.on("end", () => {
  try {
    const processes = JSON.parse(input);
    const app = processes.find(p => p.name === "veda-backend");

    if (!app || app.pm2_env.status !== "online") {
      console.error("ERROR: veda-backend is not online.");
      process.exit(1);
    }

    console.log("SUCCESS: veda-backend is online.");
  } catch (error) {
    console.error("Could not verify PM2 status:", error.message);
    process.exit(1);
  }
});
'

echo "======================================"
echo "Veda backend deployment successful"
echo "======================================"