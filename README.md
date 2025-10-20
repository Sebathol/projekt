# Wetter App

Eine einfache Wetter-Anwendung, die aktuelle Wetterdaten für beliebige Städte anzeigt.

## Features

- Aktuelle Temperatur
- Gefühlte Temperatur
- Luftfeuchtigkeit
- Windgeschwindigkeit
- Wetterbeschreibung
- Responsive Design

## Verwendung

### Methode 1: Direkt im Browser öffnen (Einfachste Methode)

1. Öffne die Datei `index.html` in deinem Browser (Doppelklick oder Rechtsklick → Öffnen mit → Browser)
2. Gib eine Stadt ein und klicke auf "Suchen"
3. Die App verwendet standardmäßig eine kostenlose API (wttr.in), die keine Registrierung erfordert

### Methode 2: Mit einem lokalen Server

Wenn du einen lokalen Webserver verwenden möchtest:

```bash
# Mit Python 3
python3 -m http.server 8000

# Oder mit Python 2
python -m SimpleHTTPServer 8000

# Oder mit Node.js (npx http-server)
npx http-server
```

Dann öffne `http://localhost:8000` in deinem Browser.

## API-Konfiguration

Die App verwendet standardmäßig die kostenlose wttr.in API, die keine Registrierung benötigt.

Falls du die OpenWeatherMap API verwenden möchtest:

1. Registriere dich bei [OpenWeatherMap](https://openweathermap.org/api) und hole dir einen kostenlosen API-Key
2. Öffne `script.js`
3. Ersetze `YOUR_API_KEY_HERE` mit deinem API-Key
4. Ändere `USE_DEMO_API` auf `false`

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
