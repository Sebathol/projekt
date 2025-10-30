# 🔐 API Master - API Key Manager

Verwalte alle deine API-Keys sicher und organisiert an einem Ort!

## ✨ Features

- 🔑 **Unbegrenzt API-Keys speichern** - Keine Limits, keine Beschränkungen
- 📁 **Kategorisierung** - Organisiere Keys nach AI, Payment, Weather, Maps, Social, etc.
- 🔒 **Sicher & Lokal** - Alle Daten werden nur lokal in deinem Browser gespeichert
- 🚫 **Werbefrei** - Keine Ads, keine Ablenkungen
- 📤 **Export/Import** - Sichere deine Keys oder übertrage sie auf andere Geräte
- 🔍 **Schnelle Suche** - Finde Keys sofort mit Suchfunktion und Filtern
- 📋 **Ein-Klick-Kopieren** - Keys mit einem Klick in die Zwischenablage kopieren
- 🌐 **PWA-Ready** - Installierbar als App auf allen Geräten
- 📱 **Google Play Store** - Vorbereitet für Android App Veröffentlichung

## 🚀 Schnellstart

### Lokal testen (3 einfache Schritte)

1. **Icons generieren:**
   ```bash
   # Öffne im Browser:
   generate-api-master-icons.html
   # Klicke "Icons generieren" und "Alle herunterladen"
   ```

2. **App öffnen:**
   ```bash
   # Öffne im Browser:
   api-master.html
   ```

3. **Fertig!** 🎉
   - Füge deinen ersten API-Key hinzu
   - Organisiere, kopiere und verwalte deine Keys

### Mit WSL auf Windows

```bash
# 1. Nach D:\claudeapps\API Master kopieren
./copy-to-d-drive.sh

# 2. Zum Verzeichnis wechseln
cd /mnt/d/claudeapps/API\ Master

# 3. Server starten
./start-api-master.sh

# 4. Browser öffnen
# http://localhost:8000/api-master.html
```

## 📱 Als PWA installieren

### Desktop (Chrome/Edge)

1. Öffne `api-master.html` im Browser
2. Klicke auf das ⊕ Symbol in der Adressleiste
3. Wähle "Installieren"
4. App startet in eigenem Fenster!

### Mobile (Android/iOS)

1. Öffne `api-master.html` im Browser
2. Tippe auf das Teilen-Symbol
3. Wähle "Zum Startbildschirm hinzufügen"
4. App erscheint auf dem Home Screen!

## 🛠️ Nutzung

### API-Key hinzufügen

1. Klicke auf "➕ Key hinzufügen" oder gehe zu "Key hinzufügen"
2. Fülle das Formular aus:
   - **Service:** z.B. "OpenAI", "Stripe", "WeatherAPI"
   - **Name:** z.B. "Production", "Development", "Test"
   - **API Key:** Dein tatsächlicher API-Key
   - **Kategorie:** AI, Payment, Weather, etc.
   - **URL (optional):** API Endpoint
   - **Notizen (optional):** Zusätzliche Infos
3. Klicke "💾 Speichern"

### API-Key verwenden

- **Anzeigen:** Klicke "👁️ Anzeigen" (Key wird für 5 Sekunden angezeigt)
- **Kopieren:** Klicke "📋" um den Key zu kopieren
- **Bearbeiten:** Klicke "✏️ Bearbeiten"
- **Löschen:** Klicke "🗑️ Löschen" (mit Bestätigung)

### Suchen & Filtern

- **Suchfeld:** Suche nach Service, Name oder Notizen
- **Kategorie-Filter:** Filtere nach AI, Payment, Weather, etc.

### Export & Import

**Export (Backup):**
1. Gehe zu "Einstellungen"
2. Klicke "📥 Exportieren"
3. JSON-Datei wird heruntergeladen

**Import (Wiederherstellen):**
1. Gehe zu "Einstellungen"
2. Klicke "📤 Importieren"
3. Wähle JSON-Datei aus
4. Bestätige den Import

## 🔒 Sicherheit

### Lokale Speicherung

- ✅ Alle API-Keys werden **nur** in deinem Browser gespeichert (localStorage)
- ✅ **Keine Cloud**, keine externen Server
- ✅ **Keine Übertragung** von Keys über das Internet
- ✅ Deine Daten bleiben **bei dir**

### Best Practices

1. **Exportiere regelmäßig** deine Keys als Backup
2. **Speichere Backups sicher** (verschlüsselt, z.B. in KeePass)
3. **Nutze verschiedene Keys** für Development/Production
4. **Rotiere Keys regelmäßig** wenn möglich
5. **Teile nie API-Keys** öffentlich oder in Git

### ⚠️ Wichtig

- Browser-Cache löschen = Keys werden gelöscht!
- Erstelle regelmäßig Backups über die Export-Funktion
- API Master ersetzt kein professionelles Key-Management-System für Production

## 📱 Google Play Store Veröffentlichung

API Master ist als PWA bereits fertig und kann als Android App veröffentlicht werden!

### Voraussetzungen

- Domain mit HTTPS
- Google Play Console Account ($25 USD)
- Android Studio oder Bubblewrap CLI

### Schritt-für-Schritt

Siehe **[GOOGLE_PLAY_STORE_SETUP.md](GOOGLE_PLAY_STORE_SETUP.md)** für detaillierte Anleitung!

**Quick Steps:**
```bash
# 1. PWA auf Domain hochladen (mit HTTPS!)

# 2. Bubblewrap installieren
npm install -g @bubblewrap/cli

# 3. TWA Projekt erstellen
bubblewrap init --manifest=https://deinedomain.com/manifest-api-master.json

# 4. Android Keystore erstellen
keytool -genkey -v -keystore android.keystore -alias api-master-key \
  -keyalg RSA -keysize 2048 -validity 10000

# 5. App Bundle builden
bubblewrap build --appBundle

# 6. Auf Play Console hochladen
```

## 📂 Projektstruktur

```
API Master/
├── api-master.html              # Haupt-App (SPA)
├── api-master.css               # Styling
├── api-master.js                # App-Logik
├── api-master-sw.js             # Service Worker (PWA)
├── manifest-api-master.json     # Web App Manifest
├── generate-api-master-icons.html # Icon Generator
├── api-master-icon-*.png        # App Icons (72px - 512px)
│
├── twa-manifest.json            # TWA Config für Android
├── assetlinks.json              # Digital Asset Links
├── GOOGLE_PLAY_STORE_SETUP.md   # Play Store Guide
│
├── copy-to-d-drive.sh           # WSL: Copy Script
├── start-api-master.sh          # WSL: Start Server
└── API_MASTER_README.md         # Diese Datei
```

## 🎨 Icons

### Generieren

1. Öffne `generate-api-master-icons.html` im Browser
2. Icons werden automatisch generiert
3. Klicke "Alle herunterladen"

### Benötigte Größen

Für PWA und Google Play Store:
- 72x72 px
- 96x96 px
- 128x128 px
- 144x144 px
- 152x152 px
- 192x192 px (maskable)
- 384x384 px
- 512x512 px (maskable)

## 🌐 Browser-Kompatibilität

| Browser | Desktop | Mobile | PWA Install |
|---------|---------|--------|-------------|
| Chrome  | ✅      | ✅     | ✅          |
| Edge    | ✅      | ✅     | ✅          |
| Firefox | ✅      | ✅     | ⚠️          |
| Safari  | ✅      | ✅     | ⚠️          |
| Opera   | ✅      | ✅     | ✅          |

✅ = Voll unterstützt | ⚠️ = Teilweise unterstützt

## 🆘 Troubleshooting

### Service Worker funktioniert nicht

**Problem:** Service Worker registriert sich nicht

**Lösung:**
- Stelle sicher, dass du **HTTPS** oder **localhost** verwendest
- Öffne DevTools → Application → Service Workers
- Prüfe Console auf Fehler

### Icons werden nicht angezeigt

**Problem:** Icons fehlen in der PWA

**Lösung:**
- Generiere Icons mit `generate-api-master-icons.html`
- Stelle sicher, dass alle Icon-Dateien im selben Ordner sind
- Prüfe DevTools → Application → Manifest

### Daten verschwunden

**Problem:** API-Keys sind weg nach Browser-Update

**Lösung:**
- Prüfe ob Browser-Cache gelöscht wurde
- Importiere Backup (falls vorhanden)
- **Tipp:** Regelmäßig exportieren!

### App nicht installierbar

**Problem:** "Zu Startbildschirm hinzufügen" erscheint nicht

**Lösung:**
- Manifest korrekt?
- Service Worker aktiv?
- HTTPS oder localhost?
- Alle erforderlichen Icons vorhanden?

## 💡 Tipps & Tricks

### Organisation

- **Naming Convention:** Verwende klare Namen wie "OpenAI - Production" oder "Stripe - Dev"
- **Kategorien:** Nutze Kategorien konsequent für bessere Übersicht
- **Notizen:** Füge wichtige Infos hinzu (z.B. Rate Limits, Ablaufdatum)

### Sicherheit

- **Separate Keys:** Verwende unterschiedliche Keys für Dev/Staging/Prod
- **Minimal Privileges:** API-Keys nur mit minimalen Berechtigungen erstellen
- **Monitoring:** Überwache API-Usage bei den Anbietern
- **Rotation:** Rotiere kritische Keys regelmäßig

### Backup

- **Auto-Reminder:** Setze dir einen monatlichen Reminder zum Exportieren
- **Multiple Backups:** Speichere Backups an mehreren Orten
- **Verschlüsselung:** Verschlüssele Export-Dateien (z.B. mit 7-Zip)

## 🔄 Updates

API Master ist eine standalone PWA und aktualisiert sich automatisch wenn:
- Du die App neu lädst
- Service Worker neue Version erkennt

## 📊 Geplante Features (Roadmap)

- [ ] Kategorien selbst definieren
- [ ] Farbcodes für Keys
- [ ] Favoriten markieren
- [ ] API-Key Validierung
- [ ] Rate Limit Tracking
- [ ] Verschlüsselte Backups
- [ ] Cloud-Sync (optional)
- [ ] Browser-Extension

## 🤝 Unterstützung

Entwickelt von **Ai Storm Create**

Bei Fragen oder Problemen:
- Prüfe diese Dokumentation
- Siehe [GOOGLE_PLAY_STORE_SETUP.md](GOOGLE_PLAY_STORE_SETUP.md)

## 📜 Lizenz

© 2025 Ai Storm Create

---

**🔐 API Master - Verwalte deine Keys sicher und einfach!**
