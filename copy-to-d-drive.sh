#!/bin/bash

# API Master - Copy to D:\ Drive Script
# Kopiert vollständigen API Master Ordner nach D:\claudeapps\API Master

set -e

echo "==========================================="
echo "📦 API Master - Complete Copy to D:\\ Drive"
echo "==========================================="
echo ""

# Zielverzeichnis
TARGET_DIR="/mnt/d/claudeapps/API Master"

# Prüfe ob /mnt/d existiert
if [ ! -d "/mnt/d" ]; then
    echo "❌ Fehler: D:\\ Drive nicht gefunden!"
    echo "   Stelle sicher, dass WSL Zugriff auf Windows-Laufwerke hat."
    echo ""
    echo "   Versuche: sudo mkdir -p /mnt/d"
    echo "   oder: sudo mount -t drvfs D: /mnt/d"
    exit 1
fi

# Lösche altes Verzeichnis falls vorhanden
if [ -d "$TARGET_DIR" ]; then
    echo "🗑️  Lösche altes Verzeichnis..."
    rm -rf "$TARGET_DIR"
fi

# Erstelle Zielverzeichnis
echo "📁 Erstelle neues Verzeichnis: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

echo ""
echo "📋 Kopiere Hauptdateien..."
echo ""

# Hauptdateien
FILES=(
    "api-master.html"
    "api-master.css"
    "api-master.js"
    "api-master-sw.js"
    "manifest-api-master.json"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
        cp "$file" "$TARGET_DIR/"
    else
        echo "  ⚠️  $file (nicht gefunden)"
    fi
done

# Icon Generator
echo ""
echo "🎨 Kopiere Icon Generator..."
if [ -f "generate-api-master-icons.html" ]; then
    echo "  ✓ generate-api-master-icons.html"
    cp "generate-api-master-icons.html" "$TARGET_DIR/"
fi

# Icons kopieren (falls vorhanden)
echo ""
echo "🎨 Kopiere Icons..."
icon_count=0
for size in 72 96 128 144 152 192 384 512; do
    icon_file="api-master-icon-${size}.png"
    if [ -f "$icon_file" ]; then
        echo "  ✓ $icon_file"
        cp "$icon_file" "$TARGET_DIR/"
        ((icon_count++))
    fi
done

if [ $icon_count -eq 0 ]; then
    echo "  ⚠️  Keine Icons gefunden - bitte generieren!"
fi

# TWA & Play Store Dateien
echo ""
echo "📱 Kopiere Google Play Store Dateien..."
TWA_FILES=(
    "twa-manifest.json"
    "assetlinks.json"
    "GOOGLE_PLAY_STORE_SETUP.md"
    "build-for-playstore.sh"
)

for file in "${TWA_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
        cp "$file" "$TARGET_DIR/"
        if [ "${file##*.}" = "sh" ]; then
            chmod +x "$TARGET_DIR/$file"
        fi
    fi
done

# Dokumentation
echo ""
echo "📚 Kopiere Dokumentation..."
DOC_FILES=(
    "API_MASTER_README.md"
)

for file in "${DOC_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
        cp "$file" "$TARGET_DIR/"
    fi
done

# Scripts
echo ""
echo "⚙️ Kopiere Scripts..."
SCRIPT_FILES=(
    "start-api-master.sh"
)

for file in "${SCRIPT_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
        cp "$file" "$TARGET_DIR/"
        chmod +x "$TARGET_DIR/$file"
    fi
done

# Erstelle Windows CMD Start Script
echo ""
echo "📝 Erstelle Windows CMD Start Script..."
cat > "$TARGET_DIR/start-api-master.cmd" << 'EOF'
@echo off
echo =========================================
echo API Master - Starting Local Server
echo =========================================
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"

REM Check if Python is installed
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Python not found! Please install Python from python.org
    pause
    exit /b 1
)

echo Starting server on http://localhost:8000
echo.
echo Open in browser: http://localhost:8000/api-master.html
echo.

python -m http.server 8000

pause
EOF

echo "  ✓ start-api-master.cmd"

# Erstelle README für D:\ Ordner
cat > "$TARGET_DIR/README_START.txt" << 'EOF'
===================================
API Master
===================================

📦 SCHNELLSTART:

Windows CMD:
  1. Doppelklick auf: start-api-master.cmd
  2. Browser öffnet automatisch

WSL/Linux:
  1. ./start-api-master.sh
  2. Öffne: http://localhost:8000/api-master.html

===================================

🔐 FEATURES:

• API-Key Management
• 🤖 Claude AI Assistant (Claude API Integration)
• PWA-ready (installierbar als App)
• Google Play Store ready
• Komplett offline-fähig

===================================

📱 GOOGLE PLAY STORE:

1. Icons generieren:
   Öffne: generate-api-master-icons.html

2. Build vorbereiten:
   ./build-for-playstore.sh

3. Anleitung lesen:
   GOOGLE_PLAY_STORE_SETUP.md

===================================

💡 CLAUDE API SETUP:

1. API Master öffnen
2. "Key hinzufügen" klicken
3. Service: "Claude" oder "Anthropic"
4. Name: "Claude AI"
5. API-Key einfügen
6. Tab "Claude AI Assistant" öffnen
7. API-Key auswählen
8. Chat starten!

===================================

📚 Weitere Infos:
   API_MASTER_README.md

===================================
EOF

echo "  ✓ README_START.txt"

# Zusammenfassung
echo ""
echo "==========================================="
echo "✅ Kopieren abgeschlossen!"
echo "==========================================="
echo ""
echo "📍 Zielverzeichnis:"
echo "   Windows: D:\\claudeapps\\API Master"
echo "   WSL:     $TARGET_DIR"
echo ""
echo "📊 Kopierte Dateien:"
echo "   • Haupt-App: 5 Dateien"
echo "   • Icons: $icon_count Dateien"
echo "   • Dokumentation: $(ls "$TARGET_DIR"/*.md 2>/dev/null | wc -l) Dateien"
echo "   • Scripts: 3 Dateien"
echo ""
echo "🚀 NÄCHSTE SCHRITTE:"
echo ""
echo "1️⃣  App starten (Windows CMD):"
echo "    cd /d D:\\claudeapps\\API Master"
echo "    start-api-master.cmd"
echo ""
echo "2️⃣  App starten (WSL):"
echo "    cd '$TARGET_DIR'"
echo "    ./start-api-master.sh"
echo ""
echo "3️⃣  Im Browser öffnen:"
echo "    http://localhost:8000/api-master.html"
echo ""
echo "4️⃣  Icons generieren (falls noch nicht geschehen):"
echo "    Öffne: generate-api-master-icons.html"
echo ""
echo "5️⃣  Claude API einrichten:"
echo "    • API-Key bei Anthropic besorgen"
echo "    • In API Master unter 'Key hinzufügen' eintragen"
echo "    • Service: Claude / Anthropic"
echo "    • Tab 'Claude AI Assistant' öffnen"
echo ""
echo "==========================================="
echo ""
