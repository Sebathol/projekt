#!/bin/bash

# Pure PDF Viewer - USB Stick Copy Tool
# Kopiert die kompilierte App auf USB-Sticks für Vertrieb

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║           PURE PDF VIEWER - USB STICK KOPIERTOOL           ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Dieses Tool kopiert die kompilierte Pure PDF App auf USB-Sticks"
echo "für den Vertrieb und Verkauf."
echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${RED}[!] FEHLER: Kein 'dist' Ordner gefunden!${NC}"
    echo ""
    echo "    Bitte erst die App kompilieren:"
    echo "    npm run build:linux"
    echo ""
    exit 1
fi

echo -e "${GREEN}[✓] Build-Ordner gefunden.${NC}"
echo ""

# Detect USB drives (Linux/Mac)
echo "Suche nach verfügbaren USB-Laufwerken..."
echo ""

if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    USB_DRIVES=$(lsblk -o NAME,SIZE,TYPE,MOUNTPOINT | grep -E "sd[b-z][0-9]" | grep -v "loop")
    echo "$USB_DRIVES"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    USB_DRIVES=$(diskutil list external physical)
    echo "$USB_DRIVES"
fi

echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

# Ask for mount point
read -p "Gib den Mount-Punkt des USB-Sticks ein (z.B. /media/usb oder /Volumes/USB): " USB_MOUNT

if [ ! -d "$USB_MOUNT" ]; then
    echo ""
    echo -e "${RED}[!] Verzeichnis $USB_MOUNT nicht gefunden!${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}[✓] Mount-Punkt gefunden.${NC}"
echo ""

# Confirm
echo "══════════════════════════════════════════════════════════════"
echo ""
echo "    WARNUNG: Der folgende Ordner wird erstellt/überschrieben:"
echo "    $USB_MOUNT/Pure-PDF-Viewer/"
echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

read -p "Fortfahren? (j/n): " CONFIRM

if [[ ! "$CONFIRM" =~ ^[jJ]$ ]]; then
    echo ""
    echo -e "${YELLOW}[!] Vorgang abgebrochen.${NC}"
    echo ""
    exit 0
fi

# Copy files
echo ""
echo -e "${BLUE}[►] Kopiere Dateien...${NC}"
echo ""

# Create target directory
mkdir -p "$USB_MOUNT/Pure-PDF-Viewer"

# Copy Linux build
echo -e "${BLUE}[►] Kopiere Linux Build...${NC}"
cp -r dist/*.AppImage "$USB_MOUNT/Pure-PDF-Viewer/" 2>/dev/null || true
cp -r dist/*.deb "$USB_MOUNT/Pure-PDF-Viewer/" 2>/dev/null || true

# Copy Setup Tool
echo -e "${BLUE}[►] Kopiere Setup-Tool...${NC}"
cp setup-tool.html "$USB_MOUNT/Pure-PDF-Viewer/"
cp setup-tool.js "$USB_MOUNT/Pure-PDF-Viewer/"

# Copy Documentation
echo -e "${BLUE}[►] Kopiere Dokumentation...${NC}"
[ -f README.md ] && cp README.md "$USB_MOUNT/Pure-PDF-Viewer/"
[ -f INSTALLATION.md ] && cp INSTALLATION.md "$USB_MOUNT/Pure-PDF-Viewer/"
[ -f LICENSE.txt ] && cp LICENSE.txt "$USB_MOUNT/Pure-PDF-Viewer/"

# Create README for USB
echo -e "${BLUE}[►] Erstelle README...${NC}"
cat > "$USB_MOUNT/Pure-PDF-Viewer/README.txt" << 'EOF'
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║                   PURE PDF VIEWER v1.0.0                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

Installation (Linux):

1. Für AppImage:
   - Mache die Datei ausführbar: chmod +x *.AppImage
   - Führe sie aus: ./Pure-PDF-Viewer*.AppImage

2. Für .deb (Debian/Ubuntu):
   - Installiere mit: sudo dpkg -i *.deb
   - Oder doppelklicke auf die .deb Datei

══════════════════════════════════════════════════════════════

Support: support@yourcompany.com
Website: www.yourcompany.com

© 2025 Your Company. Alle Rechte vorbehalten.
EOF

echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""
echo -e "${GREEN}[✓] Kopiervorgang abgeschlossen!${NC}"
echo ""
echo "    Die Pure PDF App wurde erfolgreich kopiert nach:"
echo "    $USB_MOUNT/Pure-PDF-Viewer/"
echo ""
echo "    Dateien:"
ls -lh "$USB_MOUNT/Pure-PDF-Viewer/"
echo ""
echo "══════════════════════════════════════════════════════════════"
echo ""

# Ask to open folder
read -p "Möchtest du den USB-Ordner öffnen? (j/n): " OPEN

if [[ "$OPEN" =~ ^[jJ]$ ]]; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        xdg-open "$USB_MOUNT/Pure-PDF-Viewer/" 2>/dev/null || nautilus "$USB_MOUNT/Pure-PDF-Viewer/" 2>/dev/null || true
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        open "$USB_MOUNT/Pure-PDF-Viewer/"
    fi
fi

echo ""
echo -e "${GREEN}[✓] Fertig! Du kannst den USB-Stick jetzt sicher entfernen.${NC}"
echo ""
