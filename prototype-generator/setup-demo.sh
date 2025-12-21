#!/bin/bash
# Demo Setup Script
# Initializes demo data for Prototype Generator testing

echo "🚀 Setting up Prototype Generator Demo..."

# Create demo database
echo "📦 Initializing Prisma database..."
cd backend
npx prisma migrate deploy

# Seed demo data
echo "🌱 Seeding demo data..."
node scripts/seed.js

echo "✅ Demo setup complete!"
echo ""
echo "📋 Demo Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Email:    demo@example.com"
echo "Password: demo12345"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🚀 Starting services..."
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 - Frontend:"
echo "  npm run dev"
echo ""
echo "📱 Open: http://localhost:5173"
