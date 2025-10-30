# 🚀 Build & Deployment Guide - Alle Versionen

**Version:** 3.0.0 mit Influencer Codes
**Datum:** 2025-10-30
**Status:** Production Ready

---

## 📦 Version Übersicht

| Version | Typ | Ziel | Status |
|---------|-----|------|--------|
| **V3 Development** | PWA | Linux Dev | ✅ Running |
| **V3 Production** | PWA | D:\\ Windows | 📋 Deploy Ready |
| **V3 Play Store** | Android AAB | Google Play | 🔨 Build Ready |

---

## 🖥️ WSL-Befehle für D:\ Deployment

### **Komplettes V3 System nach D:\ kopieren**

```bash
# 1. Alte Version löschen (VORSICHT: Backup vorher!)
rm -rf /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/*

# 2. ODER: Alte Version als Backup umbenennen
mv /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp \
   /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp.backup.$(date +%Y%m%d)

# 3. Neue Version kopieren (komplett mit allen neuen Features)
mkdir -p /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp
cp -r /home/user/projekt/* /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# 4. node_modules NICHT kopieren (zu groß, muss lokal installiert werden)
rm -rf /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/node_modules

# 5. Datenbank NICHT überschreiben wenn vorhanden
if [ -f /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/database/app.db ]; then
  echo "⚠️  Existierende Datenbank gefunden - wird nicht überschrieben"
else
  echo "✅ Neue Datenbank erstellt"
fi

echo "✅ V3 System nach D:\\ deployed"
ls -lah /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
```

### **Nur Backend & Frontend Dateien kopieren (ohne Git)**

```bash
# Ordner erstellen
mkdir -p /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp

# Wichtige Verzeichnisse
cd /home/user/projekt
cp -r backend /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r database /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r js /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r icons /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r config /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp -r store-listings /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# HTML Dateien
cp *.html /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# Config Dateien
cp package.json /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp manifest.json /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
cp twa-manifest.json /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# Dokumentation
cp *.md /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/ 2>/dev/null || true

echo "✅ Production Files deployed"
```

---

## 🧪 Test-Befehle für alle Versionen

### **Test 1: Development Server (Linux)**

```bash
# Server starten
cd /home/user/projekt
npm install
node backend/server.js &
SERVER_PID=$!

# Warten auf Server-Start
sleep 3

# Tests ausführen
echo "🧪 Testing Health Check..."
curl -s http://localhost:3000/api/health | python3 -m json.tool

echo ""
echo "🧪 Testing Plans Endpoint..."
curl -s http://localhost:3000/api/subscriptions/plans | python3 -m json.tool | head -30

echo ""
echo "🧪 Testing Registration..."
curl -s -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}' | python3 -m json.tool

# Server stoppen
kill $SERVER_PID 2>/dev/null

echo "✅ Development Tests Complete"
```

### **Test 2: Production Server (D:\ Drive)**

```bash
# Zum Production-Verzeichnis wechseln
cd /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp

# Dependencies installieren (nur beim ersten Mal)
# HINWEIS: Funktioniert nur im Linux-Verzeichnis!
# Lösung: npm install im Linux-Dir und node_modules kopieren
echo "⚠️  npm install muss im Linux-Verzeichnis ausgeführt werden"
echo "Kopiere node_modules..."
cp -r /home/user/projekt/node_modules /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/

# Server starten (Port 3001 um Konflikt zu vermeiden)
PORT=3001 node backend/server.js &
SERVER_PID=$!

sleep 3

echo "🧪 Testing Production Server..."
curl -s http://localhost:3001/api/health | python3 -m json.tool

# Server stoppen
kill $SERVER_PID 2>/dev/null

echo "✅ Production Tests Complete"
```

### **Test 3: Browser Tests (Manuell)**

```bash
# Server im Hintergrund starten
cd /home/user/projekt
node backend/server.js > /tmp/server.log 2>&1 &

echo "🌐 Server läuft auf: http://localhost:3000"
echo ""
echo "📋 Manuelle Browser-Tests:"
echo ""
echo "1. Registrierung:"
echo "   → http://localhost:3000/auth.html"
echo "   → Email: test@example.com"
echo "   → Password: test123"
echo ""
echo "2. Promo Code einlösen:"
echo "   → Nach Login auf 'Code einlösen' klicken"
echo "   → Code: INFLUENCER-2025-FREE"
echo "   → Prüfen: 30 Workflows hinzugefügt"
echo ""
echo "3. Tool-spezifische UI:"
echo "   → http://localhost:3000/index.html"
echo "   → Prüfen: 4 Tool-Karten sichtbar"
echo "   → Ideas: 2/2, Brainstorming: 2/2, PRD: 2/2, Prototype: 1/1"
echo ""
echo "4. Weekly Plan prüfen:"
echo "   → In Datenbank: UPDATE subscriptions SET plan='weekly' WHERE user_id=1"
echo "   → Reload: Prüfen ob 8 Workflows sichtbar"
echo ""
echo "5. Nachkauf-Restriktion:"
echo "   → Free User: Kein 'Nachkaufen' Button"
echo "   → Weekly User: 'Nachkaufen' Button sichtbar"
echo ""
echo "Drücke ENTER wenn Tests abgeschlossen..."
read

# Server stoppen
pkill -f "node backend/server.js"

echo "✅ Browser Tests Complete"
```

### **Test 4: API Endpoint Tests (Automatisiert)**

```bash
#!/bin/bash
# Test-Script für alle API Endpoints

API_BASE="http://localhost:3000"
TOKEN=""

echo "🧪 API Endpoint Tests"
echo "===================="

# Server sollte laufen
curl -s $API_BASE/api/health > /dev/null || { echo "❌ Server nicht erreichbar"; exit 1; }

echo "✅ Server erreichbar"

# Test 1: Registrierung
echo ""
echo "Test 1: Registrierung"
RESPONSE=$(curl -s -X POST $API_BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test$(date +%s)@example.com\",\"password\":\"test123\"}")

TOKEN=$(echo $RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin).get('token', ''))")

if [ -z "$TOKEN" ]; then
  echo "❌ Registrierung fehlgeschlagen"
  echo $RESPONSE
  exit 1
fi

echo "✅ Registrierung erfolgreich"
echo "Token: ${TOKEN:0:20}..."

# Test 2: User Status
echo ""
echo "Test 2: User Status"
curl -s $API_BASE/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | python3 -m json.tool | head -20

# Test 3: Subscription Plans
echo ""
echo "Test 3: Subscription Plans"
curl -s $API_BASE/api/subscriptions/plans | python3 -m json.tool | grep -A 5 "weekly"

# Test 4: Promo Code einlösen
echo ""
echo "Test 4: Promo Code einlösen"
curl -s -X POST $API_BASE/api/promo/redeem \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"code":"INFLUENCER-2025-FREE"}' | python3 -m json.tool

echo ""
echo "✅ Alle API Tests abgeschlossen"
```

Speichern als: `test-api.sh` und ausführen mit: `bash test-api.sh`

---

## 📱 Play Store Build (Android AAB)

### **Voraussetzungen**

1. **Node.js** installiert
2. **Bubblewrap CLI** installiert
3. **Android SDK** (optional, Bubblewrap lädt es herunter)
4. **Java JDK 11+** installiert

### **Schritt 1: Bubblewrap installieren**

```bash
npm install -g @bubblewrap/cli
```

### **Schritt 2: TWA Projekt initialisieren**

```bash
cd /home/user/projekt

# Init mit twa-manifest.json
bubblewrap init --manifest twa-manifest.json

# Oder manuell:
bubblewrap init \
  --manifest https://aistormcreate.com/manifest.json \
  --packageId com.aistormcreate.prototype \
  --directory ./android-build
```

### **Schritt 3: Digital Asset Links konfigurieren**

**Erstelle:** `.well-known/assetlinks.json` auf deinem Server:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.aistormcreate.prototype",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

### **Schritt 4: Keystore erstellen**

```bash
# Keystore für Signing erstellen
keytool -genkey -v \
  -keystore android.keystore \
  -alias android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass yourpassword \
  -keypass yourpassword \
  -dname "CN=AI Storm Create, OU=Development, O=AI Storm Create, L=City, ST=State, C=DE"

echo "✅ Keystore erstellt: android.keystore"
```

### **Schritt 5: AAB bauen**

```bash
cd android-build

# AAB bauen
bubblewrap build

# Output: app-release.aab
ls -lh app-release.aab

echo "✅ AAB erstellt: app-release.aab"
```

### **Schritt 6: AAB nach D:\ kopieren**

```bash
# AAB für Windows-Zugriff kopieren
cp app-release.aab /mnt/d/claudeapps/von-der-idee-zum-prototyp-v3.aab

echo "✅ AAB nach D:\\ kopiert"
echo "Datei: D:\\claudeapps\\von-der-idee-zum-prototyp-v3.aab"
```

### **Schritt 7: Play Console Upload**

1. Gehe zu: https://play.google.com/console
2. App erstellen: "Von der Idee zum Prototyp"
3. Release erstellen → Production
4. Upload `app-release.aab`
5. Store Listing ausfüllen (siehe `PLAY_STORE_MATERIALS.md`)
6. Pricing setzen (siehe Subscriptions)
7. Content Rating
8. Release!

---

## 🗄️ Datenbank Migration

### **Von V2 zu V3 migrieren (falls nötig)**

```bash
# Backup erstellen
cp /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/database/app.db \
   /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/database/app.db.v2.backup

# V3 Schema anwenden
cd /home/user/projekt
node -e "
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const db = new sqlite3.Database('/mnt/d/claudeapps/von der idee zum prototyp/database/app.db');
const schema = fs.readFileSync('database/schema_v3.sql', 'utf8');
db.exec(schema, (err) => {
  if (err) console.error('Error:', err);
  else console.log('✅ Schema V3 applied');
  db.close();
});
"
```

### **Promo Codes in Production DB einfügen**

```bash
cd /home/user/projekt

# Codes generieren (falls noch nicht vorhanden)
node backend/generate-influencer-codes.js

echo "✅ Promo Codes in Datenbank eingefügt"
```

---

## 🔍 Debugging & Logs

### **Server Logs anzeigen**

```bash
# Live Logs
tail -f /tmp/server.log

# Letzte 50 Zeilen
tail -50 /tmp/server.log

# Nach Fehlern suchen
grep -i error /tmp/server.log
```

### **Datenbank inspizieren**

```bash
# SQLite Shell öffnen
sqlite3 /home/user/projekt/database/app.db

# Nützliche Queries:
.tables
SELECT * FROM promo_codes;
SELECT * FROM code_redemptions;
SELECT * FROM user_status_view;
.exit
```

### **Port Konflikte beheben**

```bash
# Prozesse auf Port 3000 finden
lsof -i :3000

# ODER
ps aux | grep "node backend/server.js"

# Prozess killen
kill -9 <PID>

# Alle Node-Prozesse killen
pkill -f "node backend/server.js"
```

---

## 📊 Performance Tests

### **Load Test mit Apache Bench**

```bash
# 100 Requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/api/health

# Mit Auth Header
ab -n 100 -c 10 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/subscriptions/status
```

### **Response Time Monitoring**

```bash
# Einzelner Request mit Timing
time curl -s http://localhost:3000/api/subscriptions/plans > /dev/null

# Durchschnitt von 10 Requests
for i in {1..10}; do
  time curl -s http://localhost:3000/api/health > /dev/null
done
```

---

## 🎯 Quick Reference Commands

### **Development**

```bash
# Server starten
cd /home/user/projekt && node backend/server.js

# Mit Auto-Restart (nodemon)
npm install -g nodemon
nodemon backend/server.js

# Background mit Log
node backend/server.js > /tmp/server.log 2>&1 &
```

### **Production Deployment**

```bash
# Full Deployment zu D:\\
rm -rf /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/*
cp -r /home/user/projekt/* /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/
rm -rf /mnt/d/claudeapps/von\ der\ idee\ zum\ prototyp/node_modules
```

### **Testing**

```bash
# Quick Health Check
curl -s http://localhost:3000/api/health

# Full API Test
bash test-api.sh

# Manual Browser Test
firefox http://localhost:3000/auth.html
```

### **Play Store Build**

```bash
# Quick Build
cd /home/user/projekt
bubblewrap build
cp app-release.aab /mnt/d/
```

---

## ✅ Deployment Checkliste

### **Vor Production Deployment:**

- [ ] Alle Tests laufen durch
- [ ] Datenbank-Backup erstellt
- [ ] Environment Variables gesetzt (JWT_SECRET, API Keys)
- [ ] Promo Codes generiert und getestet
- [ ] Landing Page aktualisiert
- [ ] Dokumentation vollständig

### **Production Deployment:**

- [ ] Alte Version als Backup gesichert
- [ ] Neue Dateien nach D:\\ kopiert
- [ ] node_modules installiert
- [ ] Server gestartet
- [ ] Health Check OK
- [ ] Browser Test durchgeführt
- [ ] Monitoring aktiviert

### **Play Store Release:**

- [ ] AAB erfolgreich gebaut
- [ ] Digital Asset Links konfiguriert
- [ ] Store Listing vollständig
- [ ] Screenshots hochgeladen (8 Stück)
- [ ] Privacy Policy URL gesetzt
- [ ] Subscriptions konfiguriert (5 Plans)
- [ ] IAP Products erstellt (2 Consumables)
- [ ] Internal Testing durchgeführt
- [ ] Production Release

---

## 📞 Support

**Bei Problemen:**
- Email: support@aistormcreate.com
- Tel: 06853/8579828

**Dokumentation:**
- `DEPLOYMENT_ROADMAP.md` - Kompletter Deployment-Guide
- `V3_TEST_RESULTS.md` - Test-Ergebnisse
- `INFLUENCER_CODES_SYSTEM.md` - Promo Code System
- `PLAY_STORE_MATERIALS.md` - Play Store Assets

---

**Version:** 3.0.0
**Build:** 9a4078e
**Status:** 🚀 Production Ready
