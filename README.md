# Wetter App

Eine einfache Wetter-Anwendung, die aktuelle Wetterdaten für beliebige Städte anzeigt. Jetzt als Progressive Web App (PWA) - installierbar auf Smartphone und Desktop!

## Features

- Aktuelle Temperatur
- Gefühlte Temperatur
- Luftfeuchtigkeit
- Windgeschwindigkeit
- Wetterbeschreibung
- Responsive Design
- **PWA-Funktionalität** - Installierbar wie eine native App!
- **Offline-Unterstützung** - Funktioniert auch ohne Internet (mit Cache)
- **Native App-Feeling** - Läuft im Vollbild ohne Browser-UI

## Installation auf dem Smartphone

### Android (Chrome/Edge):

1. Öffne die App in Chrome/Edge: Lade die Dateien auf einen Webserver hoch (z.B. GitHub Pages, Netlify, oder deinen eigenen Server)
2. Gehe zur URL der App
3. Tippe auf das Menü (⋮) oben rechts
4. Wähle **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
5. Die App erscheint auf deinem Homescreen wie jede andere App!

### iOS (Safari):

1. Öffne die App in Safari
2. Tippe auf das Teilen-Symbol (□↑)
3. Wähle **"Zum Home-Bildschirm"**
4. Tippe auf "Hinzufügen"
5. Die App erscheint auf deinem Homescreen!

## Verwendung (Entwicklung/Test)

### Methode 1: PWA lokal testen

**WICHTIG:** PWAs benötigen HTTPS oder localhost. Für lokale Tests:

```bash
# Mit Python 3
python3 -m http.server 8000

# Oder mit Node.js
npx http-server -p 8000
```

Dann öffne `http://localhost:8000` in deinem Browser.

### Methode 2: Direkt im Browser öffnen

Für einfaches Testen (ohne PWA-Features):
1. Öffne die Datei `index.html` in deinem Browser (Doppelklick oder Rechtsklick → Öffnen mit → Browser)
2. Gib eine Stadt ein und klicke auf "Suchen"
3. Die App verwendet standardmäßig eine kostenlose API (wttr.in), die keine Registrierung erfordert

### Methode 3: Online deployen

Für die volle PWA-Funktionalität mit Installation auf dem Smartphone:

**GitHub Pages (Kostenlos & Einfach):**
```bash
# 1. Erstelle ein GitHub Repository
# 2. Push dein Projekt
git add .
git commit -m "Wetter App PWA"
git push origin main

# 3. Gehe zu Settings → Pages
# 4. Wähle Branch: main
# 5. Deine App ist verfügbar unter: https://DEIN-USERNAME.github.io/REPO-NAME
```

**Netlify (Kostenlos & Einfach):**
1. Gehe zu [netlify.com](https://netlify.com)
2. Ziehe den Projekt-Ordner per Drag & Drop
3. Fertig! Du bekommst eine URL wie `https://dein-projekt.netlify.app`

**Vercel:**
```bash
npx vercel
```

## 🔧 API-Konfiguration (NEU!)

### Methode 1: Setup-Tool verwenden (Empfohlen - Einfach!)

**Wir haben ein spezielles Setup-Tool für dich erstellt!**

1. **Öffne `setup-tool.html` im Browser**
2. **Login mit Passwort:** `JoHanna268219$`
3. **Folge den Anweisungen im Tool**

Das Setup-Tool bietet:
- ✅ Passwort-geschützte Oberfläche
- ✅ API-Key Management (mehrere Keys speichern)
- ✅ Automatische Code-Generierung
- ✅ Unterstützung für alle großen Wetter-APIs
- ✅ Schritt-für-Schritt Anleitungen
- ✅ Sichere Implementierung

**Verfügbare APIs:**
- **WeatherAPI.com** (Empfohlen) - 1 Million calls/Monat kostenlos
- **OpenWeatherMap** - 1000 calls/Tag
- **Visual Crossing** - 1000 records/Tag
- **Open-Meteo** - Kein API-Key nötig!
- **Custom API** - Eigene API verwenden

**Detaillierte Infos:** Siehe `API_DOCUMENTATION.md`

### Methode 2: Manuell (Fortgeschritten)

Falls du den Code direkt bearbeiten möchtest:

1. Registriere dich bei [WeatherAPI.com](https://www.weatherapi.com/signup.aspx)
2. Hole dir deinen kostenlosen API-Key
3. Öffne `script.js`
4. Ersetze `YOUR_API_KEY_HERE` mit deinem API-Key
5. Setze `USE_DEMO_API = false`

### Methode 3: Automatisches Update-Script (Node.js)

Für automatische Updates via Terminal:

```bash
node update-api.js
# Passwort: JoHanna268219$
# Folge den Anweisungen
```

## Technologien

- HTML5
- CSS3
- Vanilla JavaScript
- wttr.in API (Demo-Modus) oder OpenWeatherMap API

## Browser-Kompatibilität

Funktioniert in allen modernen Browsern:
- Chrome
- Firefox
- Safari
- Edge

## Lizenz

MIT
