#!/bin/bash

# API Master - Complete Setup & Build Script for Google Play Store
# This script prepares the entire app for Play Store deployment

set -e

echo "========================================"
echo "🚀 API Master - Play Store Build Script"
echo "========================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="API Master"
PACKAGE_NAME="com.aistormcreate.apimaster"
VERSION_NAME="1.0.0"
VERSION_CODE="1"
DOMAIN="yourdomain.com"

echo -e "${BLUE}📋 Konfiguration:${NC}"
echo "   App Name: $APP_NAME"
echo "   Package: $PACKAGE_NAME"
echo "   Version: $VERSION_NAME ($VERSION_CODE)"
echo ""

# Step 1: Check Prerequisites
echo -e "${YELLOW}Step 1/7: Checking Prerequisites...${NC}"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js nicht gefunden!${NC}"
    echo "   Installiere Node.js von: https://nodejs.org/"
    exit 1
else
    echo -e "${GREEN}✓${NC} Node.js $(node --version)"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm nicht gefunden!${NC}"
    exit 1
else
    echo -e "${GREEN}✓${NC} npm $(npm --version)"
fi

# Check Java
if ! command -v java &> /dev/null; then
    echo -e "${YELLOW}⚠${NC}  Java nicht gefunden (benötigt für Keystore)"
    echo "   Installiere Java JDK 11+: https://adoptium.net/"
else
    echo -e "${GREEN}✓${NC} Java $(java -version 2>&1 | head -n 1)"
fi

echo ""

# Step 2: Install Bubblewrap
echo -e "${YELLOW}Step 2/7: Installing Bubblewrap CLI...${NC}"
echo ""

if ! command -v bubblewrap &> /dev/null; then
    echo "Installing @bubblewrap/cli..."
    npm install -g @bubblewrap/cli
    echo -e "${GREEN}✓${NC} Bubblewrap installed"
else
    echo -e "${GREEN}✓${NC} Bubblewrap bereits installiert"
fi

echo ""

# Step 3: Prepare Files
echo -e "${YELLOW}Step 3/7: Preparing App Files...${NC}"
echo ""

# Check if all required files exist
REQUIRED_FILES=(
    "api-master.html"
    "api-master.css"
    "api-master.js"
    "api-master-sw.js"
    "manifest-api-master.json"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}❌${NC} $file (missing)"
        exit 1
    fi
done

echo ""

# Step 4: Generate Icons
echo -e "${YELLOW}Step 4/7: Checking Icons...${NC}"
echo ""

echo "Benötigte Icons:"
for size in 72 96 128 144 152 192 384 512; do
    icon_file="api-master-icon-${size}.png"
    if [ -f "$icon_file" ]; then
        echo -e "${GREEN}✓${NC} $icon_file"
    else
        echo -e "${YELLOW}⚠${NC}  $icon_file (fehlt - bitte generieren)"
        echo "   Öffne: generate-api-master-icons.html"
    fi
done

echo ""

# Step 5: Create Keystore (if not exists)
echo -e "${YELLOW}Step 5/7: Checking Android Keystore...${NC}"
echo ""

KEYSTORE_FILE="android.keystore"
KEY_ALIAS="api-master-key"

if [ -f "$KEYSTORE_FILE" ]; then
    echo -e "${GREEN}✓${NC} Keystore bereits vorhanden: $KEYSTORE_FILE"
    echo ""
    echo "SHA256 Fingerprint:"
    keytool -list -v -keystore "$KEYSTORE_FILE" -alias "$KEY_ALIAS" 2>/dev/null | grep "SHA256:" || echo "Passwort erforderlich"
else
    echo -e "${YELLOW}⚠${NC}  Keystore nicht gefunden"
    echo ""
    echo "Erstelle Keystore mit folgendem Befehl:"
    echo ""
    echo "  keytool -genkey -v -keystore $KEYSTORE_FILE -alias $KEY_ALIAS \\"
    echo "    -keyalg RSA -keysize 2048 -validity 10000"
    echo ""
    echo "⚠️  WICHTIG: Passwort gut aufbewahren!"
    echo ""
fi

echo ""

# Step 6: Initialize Bubblewrap (if needed)
echo -e "${YELLOW}Step 6/7: Bubblewrap Project Setup...${NC}"
echo ""

if [ -f "twa-manifest.json" ]; then
    echo -e "${GREEN}✓${NC} TWA Manifest vorhanden"
    echo ""
    echo "Zum Initialisieren eines neuen TWA-Projekts:"
    echo ""
    echo "  bubblewrap init --manifest=https://$DOMAIN/manifest-api-master.json"
    echo ""
else
    echo -e "${YELLOW}⚠${NC}  TWA Manifest nicht gefunden"
fi

# Step 7: Build Instructions
echo ""
echo -e "${YELLOW}Step 7/7: Build Instructions${NC}"
echo ""
echo "Nach dem Setup, baue die App mit:"
echo ""
echo -e "${BLUE}Für Testing (APK):${NC}"
echo "  bubblewrap build"
echo ""
echo -e "${BLUE}Für Play Store (AAB):${NC}"
echo "  bubblewrap build --appBundle"
echo ""
echo "Die Output-Dateien findest du in:"
echo "  • app-release-signed.apk (zum Testen)"
echo "  • app-release-bundle.aab (für Play Store)"
echo ""

# Final Checklist
echo "========================================"
echo -e "${BLUE}📋 Pre-Launch Checklist:${NC}"
echo "========================================"
echo ""
echo "Web Hosting:"
echo "  [ ] PWA auf HTTPS-Server hochgeladen"
echo "  [ ] manifest-api-master.json erreichbar"
echo "  [ ] Service Worker funktioniert"
echo "  [ ] Alle Icons hochgeladen"
echo "  [ ] assetlinks.json unter /.well-known/ erreichbar"
echo ""
echo "Android:"
echo "  [ ] Keystore erstellt und gesichert"
echo "  [ ] SHA256 Fingerprint in assetlinks.json eingefügt"
echo "  [ ] TWA Projekt initialisiert"
echo "  [ ] App Bundle (.aab) gebaut"
echo "  [ ] Auf echtem Gerät getestet"
echo ""
echo "Play Console:"
echo "  [ ] Developer Account aktiviert (\$25)"
echo "  [ ] App angelegt"
echo "  [ ] Screenshots erstellt"
echo "  [ ] Store Listing ausgefüllt"
echo "  [ ] Privacy Policy veröffentlicht"
echo "  [ ] Inhaltseinstufung durchgeführt"
echo ""
echo "========================================"
echo ""
echo -e "${GREEN}✅ Setup Check abgeschlossen!${NC}"
echo ""
echo "Weitere Hilfe: siehe GOOGLE_PLAY_STORE_SETUP.md"
echo ""
