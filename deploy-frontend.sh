#!/bin/bash
set -e

# ==========================================
# Hostmachine Frontend Deployment Script
# Target: Ubuntu 24.04 LTS (Controller Node)
# Usage: ./deploy-frontend.sh
# ==========================================

echo ">>> Starting Hostmachine Frontend Setup..."

# 1. Configuration
APP_DIR="/opt/hostmachine-frontend"
CONTROLLER_API_URL="http://192.168.30.20:3000" # Internal API URL (Server-side)
NEXT_PUBLIC_API_URL="http://192.168.30.20:3000" # Public API URL (Client-side)
INTERNAL_SECRET="secret" # Matching the hardcoded secret for now

# 2. Prepare Directory
if [ ! -d "$APP_DIR" ]; then
    echo "Creating App Directory $APP_DIR..."
    sudo mkdir -p $APP_DIR
    sudo chown -R $USER:$USER $APP_DIR
else
    echo "App directory exists."
fi

# 3. Clone/Pull Code
echo "--- Fetching Code ---"
if [ ! -d "$APP_DIR/.git" ]; then
    git clone https://github.com/Mekwell/hostmachine-frontend.git $APP_DIR
else
    cd $APP_DIR
    git pull origin main
fi

# 4. Configure Environment
echo "--- Configuring Environment ---"
cd $APP_DIR
cat <<EOF > .env.local
NEXT_PUBLIC_CONTROLLER_PUBLIC_URL=$NEXT_PUBLIC_API_URL
NEXT_PUBLIC_ENROLLMENT_SECRET=$INTERNAL_SECRET
INTERNAL_API_SECRET=$INTERNAL_SECRET
# Override for server-side fetches if different from public
CONTROLLER_INTERNAL_URL=$CONTROLLER_API_URL
EOF

# 5. Install & Build
echo "--- Installing Dependencies & Building ---"
npm install
npm run build

# 6. Start with PM2
echo "--- Starting Application ---"
pm2 delete hm-frontend 2>/dev/null || true
pm2 start npm --name "hm-frontend" -- start -- -p 3001
pm2 save

echo ">>> Frontend Deployed Successfully!"
echo "Access it at: http://192.168.30.20:3001"
