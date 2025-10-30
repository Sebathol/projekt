#!/bin/bash

# One-Click Deployment Script
# Kopiert V3 System nach D:\claudeapps\von der idee zum prototyp

set -e

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  📦 Von der Idee zum Prototyp - Deployment   ║${NC}"
echo -e "${BLUE}║  Version 3.0.0 → D:\\ Drive                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

SOURCE="/home/user/projekt"
TARGET="/mnt/d/claudeapps/von der idee zum prototyp"
BACKUP_DIR="/mnt/d/claudeapps/backups"

# Check if source exists
if [ ! -d "$SOURCE" ]; then
  echo -e "${RED}❌ Source directory not found: $SOURCE${NC}"
  exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if target exists and create backup
if [ -d "$TARGET" ]; then
  BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
  echo -e "${YELLOW}📦 Creating backup...${NC}"

  # Backup old version (excluding node_modules)
  mkdir -p "$BACKUP_DIR/$BACKUP_NAME"
  rsync -av --exclude='node_modules' --exclude='database/app.db' \
    "$TARGET/" "$BACKUP_DIR/$BACKUP_NAME/" > /dev/null 2>&1

  echo -e "${GREEN}✅ Backup created: $BACKUP_NAME${NC}"

  # Remove old files
  echo -e "${YELLOW}🗑️  Removing old files...${NC}"
  rm -rf "$TARGET"/*
fi

# Create target directory
mkdir -p "$TARGET"

# Copy files
echo -e "${YELLOW}📂 Copying files...${NC}"

# Copy directories
echo "   → backend"
cp -r "$SOURCE/backend" "$TARGET/"

echo "   → database (schema only)"
mkdir -p "$TARGET/database"
cp "$SOURCE/database"/*.sql "$TARGET/database/"

# Preserve existing database if it exists
if [ -f "$BACKUP_DIR/$BACKUP_NAME/database/app.db" ]; then
  echo "   → database (preserving existing app.db)"
  cp "$BACKUP_DIR/$BACKUP_NAME/database/app.db" "$TARGET/database/"
else
  echo "   → database (new app.db will be created on first start)"
fi

echo "   → js"
cp -r "$SOURCE/js" "$TARGET/"

echo "   → icons"
cp -r "$SOURCE/icons" "$TARGET/"

echo "   → config"
cp -r "$SOURCE/config" "$TARGET/"

echo "   → store-listings"
cp -r "$SOURCE/store-listings" "$TARGET/"

# Copy HTML files
echo "   → HTML files"
cp "$SOURCE"/*.html "$TARGET/"

# Copy config files
echo "   → Configuration files"
cp "$SOURCE/package.json" "$TARGET/"
cp "$SOURCE/manifest.json" "$TARGET/"
cp "$SOURCE/twa-manifest.json" "$TARGET/"

# Copy documentation
echo "   → Documentation"
cp "$SOURCE"/*.md "$TARGET/" 2>/dev/null || true

# Copy important scripts
echo "   → Scripts"
cp "$SOURCE/test-all.sh" "$TARGET/" 2>/dev/null || true

echo ""
echo -e "${GREEN}✅ Files copied successfully${NC}"
echo ""

# node_modules handling
echo -e "${YELLOW}📦 node_modules handling...${NC}"
echo ""
echo -e "${RED}⚠️  IMPORTANT:${NC}"
echo "   node_modules cannot be installed on Windows drive via WSL"
echo "   (sqlite3 compilation fails)"
echo ""
echo "   Options:"
echo "   1. Run server from Linux: cd /home/user/projekt && node backend/server.js"
echo "   2. Install Node.js on Windows and run: npm install (in Windows)"
echo "   3. Copy node_modules from Linux (not recommended)"
echo ""

read -p "Copy node_modules from Linux? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo -e "${YELLOW}Copying node_modules (this may take a while)...${NC}"
  cp -r "$SOURCE/node_modules" "$TARGET/"
  echo -e "${GREEN}✅ node_modules copied${NC}"
else
  echo -e "${YELLOW}⚠️  Skipped node_modules copy${NC}"
fi

echo ""
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  DEPLOYMENT SUMMARY${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════${NC}"
echo ""

# Calculate sizes
TOTAL_SIZE=$(du -sh "$TARGET" | cut -f1)
BACKUP_SIZE=$(du -sh "$BACKUP_DIR/$BACKUP_NAME" 2>/dev/null | cut -f1 || echo "N/A")

echo "Source: $SOURCE"
echo "Target: $TARGET"
echo "Backup: $BACKUP_DIR/$BACKUP_NAME"
echo ""
echo "Deployed Size: $TOTAL_SIZE"
echo "Backup Size: $BACKUP_SIZE"
echo ""

# File counts
FILE_COUNT=$(find "$TARGET" -type f | wc -l)
echo "Total Files: $FILE_COUNT"
echo ""

# Show important files
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo ""
echo "Important files:"
echo "  📄 backend/server.js - Main server"
echo "  📄 backend/promo-codes.js - Promo code system"
echo "  📄 database/schema_v3.sql - V3 schema"
echo "  📄 js/promo-code-ui.js - Promo code UI"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. Open Windows Terminal"
echo "  2. cd D:\\claudeapps\\von der idee zum prototyp"
echo "  3. npm install (if not done already)"
echo "  4. node backend/server.js"
echo ""

echo -e "${BLUE}Or run from Linux (recommended):${NC}"
echo "  cd /home/user/projekt"
echo "  node backend/server.js"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOYMENT SUCCESSFUL!                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
