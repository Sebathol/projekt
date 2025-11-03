#!/bin/bash
# Server Starter für "Von der Idee zum Prototyp"

echo "🚀 Starte Server: Von der Idee zum Prototyp v3.0.0"
echo ""

# Alte Prozesse beenden
echo "🔄 Beende alte Server-Prozesse..."
pkill -f "node backend/server.js" 2>/dev/null
sleep 1

# Zu Projekt-Verzeichnis wechseln
cd /home/user/projekt || exit 1

# node_modules prüfen
if [ ! -d "node_modules" ]; then
  echo "📦 Installiere Dependencies..."
  npm install
  echo ""
fi

# Server starten
echo "✅ Starte Server auf Port 3000..."
echo ""
echo "📍 URLs:"
echo "   - Hauptseite: http://localhost:3000/index.html"
echo "   - Landing Page: http://localhost:3000/landing.html"
echo "   - Dashboard: http://localhost:3000/dashboard.html"
echo "   - API Docs: http://localhost:3000/api/docs"
echo "   - Health Check: http://localhost:3000/api/health"
echo ""
echo "⏹️  Zum Beenden: Strg+C drücken"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Server starten
node backend/server.js
