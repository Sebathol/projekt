#!/bin/bash

# Simple Weather App - USB Stick Kopieren
# Für Mac/Linux Benutzer

echo "========================================"
echo "Simple Weather App - USB Stick Kopieren"
echo "========================================"
echo ""
echo "Ziel: /Volumes/USB-STICK/simple-weather-app/"
echo "(oder passe den Pfad unten an)"
echo ""

# WICHTIG: Passe diesen Pfad an dein USB-Stick an!
USB_PATH="/Volumes/USB-STICK/simple-weather-app"

# Alternative Pfade (auskommentiert):
# USB_PATH="/media/$USER/USB-STICK/simple-weather-app"  # Linux
# USB_PATH="/mnt/usb/simple-weather-app"                # Linux alt

read -p "USB-Stick Pfad anpassen? [j/n]: " ANPASSEN

if [ "$ANPASSEN" = "j" ]; then
    read -p "Gib den vollständigen Pfad ein: " USB_PATH
fi

echo ""
echo "[1/3] Erstelle Ordner..."
mkdir -p "$USB_PATH"

echo "[2/3] Kopiere alle Dateien..."
rsync -av --exclude='.git' --exclude='node_modules' --exclude='wetter-app' \
    --exclude='.DS_Store' --exclude='*.backup' \
    ./ "$USB_PATH/"

echo "[3/3] Setze Berechtigungen..."
chmod -R 755 "$USB_PATH"

echo ""
echo "========================================"
echo "FERTIG! Alle Dateien kopiert!"
echo "========================================"
echo ""
echo "Dateien befinden sich jetzt auf:"
echo "$USB_PATH"
echo ""
echo "Öffne: $USB_PATH/README.md"
echo ""
