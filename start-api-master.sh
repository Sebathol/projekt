#!/bin/bash

# API Master - Start Script für WSL
# Startet einen lokalen Webserver für API Master

set -e

echo "========================================="
echo "🔐 API Master - Local Server"
echo "========================================="
echo ""

# Prüfe ob im richtigen Verzeichnis
if [ ! -f "api-master.html" ]; then
    echo "❌ Fehler: api-master.html nicht gefunden!"
    echo "   Bitte navigiere zum API Master Verzeichnis:"
    echo "   cd /mnt/d/claudeapps/API\\ Master"
    echo ""
    exit 1
fi

# Prüfe Python Installation
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
else
    echo "❌ Fehler: Python nicht gefunden!"
    echo "   Installiere Python mit: sudo apt install python3"
    echo ""
    exit 1
fi

# Port festlegen
PORT=8000

# Prüfe ob Port bereits belegt
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠️  Port $PORT ist bereits belegt!"
    echo "   Versuche Port $((PORT + 1))..."
    PORT=$((PORT + 1))
fi

echo "🌐 Server-Informationen:"
echo "   Port: $PORT"
echo "   Verzeichnis: $(pwd)"
echo ""

# IP-Adresse ermitteln
if command -v hostname &> /dev/null; then
    IP=$(hostname -I | awk '{print $1}')
    echo "📡 Zugriff möglich über:"
    echo ""
    echo "   🖥️  Lokal:       http://localhost:$PORT/api-master.html"
    echo "   🌍 Netzwerk:    http://$IP:$PORT/api-master.html"
else
    echo "📡 Zugriff über:"
    echo ""
    echo "   http://localhost:$PORT/api-master.html"
fi

echo ""
echo "========================================="
echo "✨ Server startet..."
echo "========================================="
echo ""
echo "💡 Tipps:"
echo "   • Drücke Strg+C um den Server zu stoppen"
echo "   • Icons generieren: http://localhost:$PORT/generate-api-master-icons.html"
echo "   • Service Worker funktioniert nur über HTTPS oder localhost"
echo ""
echo "🔒 Hinweis: Für PWA-Features auf echtem Gerät HTTPS erforderlich!"
echo ""
echo "--- Server Log ---"
echo ""

# Server starten
$PYTHON_CMD -m http.server $PORT

# Wenn Server gestoppt wird
echo ""
echo "========================================="
echo "👋 Server gestoppt"
echo "========================================="
