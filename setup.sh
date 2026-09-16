#!/usr/bin/env bash
set -e
echo "Installing server dependencies..."
cd server && npm install
echo "Seeding database..."
node src/seed.js
cd ..
echo "Installing client dependencies..."
cd client && npm install
cd ..
echo ""
echo "Setup complete!"
echo "Run 'npm run dev' from the project root to start both server and client."