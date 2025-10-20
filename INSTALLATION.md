# Installation der Wetter App auf dem Smartphone

## Schnellstart

Die Wetter App ist eine **Progressive Web App (PWA)**, die wie eine native App installiert werden kann, aber über den Browser läuft. Du brauchst **keine APK-Datei** zu installieren!

## Voraussetzungen

1. Du musst die App auf einem Webserver hosten (siehe unten)
2. HTTPS ist erforderlich (oder localhost für Tests)
3. Ein moderner Browser (Chrome, Safari, Edge, Firefox)

---

## Schritt 1: App online stellen

Wähle eine der folgenden Methoden:

### Option A: GitHub Pages (Empfohlen - Kostenlos)

1. Erstelle ein GitHub Repository
2. Lade alle Dateien hoch
3. Gehe zu **Settings** → **Pages**
4. Wähle Branch: **main** (oder master)
5. Klicke **Save**
6. Deine App ist in wenigen Minuten verfügbar unter:
   ```
   https://DEIN-USERNAME.github.io/REPO-NAME
   ```

### Option B: Netlify (Am einfachsten - Kostenlos)

1. Gehe zu [netlify.com](https://netlify.com)
2. Ziehe den Projekt-Ordner auf die Seite (Drag & Drop)
3. Fertig! Du bekommst sofort eine URL wie:
   ```
   https://dein-projekt-name.netlify.app
   ```

### Option C: Vercel (Kostenlos)

```bash
# Installiere Vercel CLI
npm i -g vercel

# Im Projekt-Ordner
cd /pfad/zum/projekt
vercel

# Folge den Anweisungen
# Du bekommst eine URL wie: https://dein-projekt.vercel.app
```

### Option D: Eigener Server

Lade die Dateien auf deinen Webserver hoch (z.B. via FTP, SSH).
Stelle sicher, dass HTTPS aktiviert ist!

---

## Schritt 2: Auf Android installieren

### Chrome/Edge:

1. Öffne die App-URL in Chrome oder Edge
2. Warte bis die Seite vollständig geladen ist
3. **Automatisch:** Du siehst unten eine Meldung "App installieren" → Klicke auf **Installieren**

   **ODER**

4. **Manuell:**
   - Tippe auf das Menü (⋮) oben rechts
   - Wähle **"App installieren"** oder **"Zum Startbildschirm hinzufügen"**
   - Bestätige mit **"Installieren"**

5. Die App erscheint jetzt auf deinem Homescreen!
6. Öffne sie wie jede andere App - sie läuft im Vollbild ohne Browser-UI

### Firefox:

1. Öffne die App-URL in Firefox
2. Tippe auf das Menü (⋮)
3. Wähle **"Installieren"** oder **"Zum Startbildschirm hinzufügen"**
4. Fertig!

---

## Schritt 3: Auf iOS/iPhone installieren

### Safari (Einziger unterstützter Browser auf iOS):

1. Öffne die App-URL in **Safari** (nicht Chrome!)
2. Tippe auf das **Teilen-Symbol** (□↑) unten in der Mitte
3. Scrolle runter und wähle **"Zum Home-Bildschirm"**
4. Gib einen Namen ein (z.B. "Wetter")
5. Tippe auf **"Hinzufügen"** oben rechts
6. Die App erscheint auf deinem Homescreen!

**Hinweis:** Auf iOS sehen PWAs aus wie normale Apps, haben aber weniger Features als auf Android (z.B. weniger Offline-Support).

---

## Lokales Testen (ohne Online-Hosting)

Für Tests auf deinem Computer:

```bash
# Starte einen lokalen Server
python3 -m http.server 8000

# Oder mit Node.js
npx http-server -p 8000
```

Dann öffne im Browser:
```
http://localhost:8000
```

**Wichtig:** Lokale Tests funktionieren nur auf dem gleichen Gerät. Für Smartphone-Installation musst du die App online hosten!

---

## Was ist der Unterschied zu einer APK?

| Feature | APK (Native App) | PWA (Progressive Web App) |
|---------|------------------|---------------------------|
| Installation | Google Play Store oder APK-Datei | Direkt über Browser |
| Updates | Manuell oder über Store | Automatisch beim Öffnen |
| Plattform | Nur Android | Android, iOS, Desktop |
| Entwicklung | Android Studio, Java/Kotlin | HTML, CSS, JavaScript |
| Größe | 5-50+ MB | ~50 KB |
| Berechtigungen | Viele Systemzugriffe | Limitiert (sicherer) |
| Offline | Ja | Ja (mit Service Worker) |

---

## Vorteile der PWA-Version

- **Kein App Store nötig** - Direkte Installation über URL
- **Automatische Updates** - Immer die neueste Version
- **Klein & Schnell** - Nur wenige KB statt MB
- **Plattformübergreifend** - Funktioniert auf Android, iOS, Desktop
- **Sicher** - Läuft in Browser-Sandbox
- **Offline-Fähig** - Funktioniert auch ohne Internet

---

## Troubleshooting

### "App installieren" Button erscheint nicht (Android)

- Stelle sicher, dass die App über HTTPS läuft (nicht HTTP)
- Prüfe, ob manifest.json korrekt geladen wird (F12 → Console)
- Verwende Chrome oder Edge (Firefox hat manchmal Probleme)
- Manche Browser zeigen den Button erst nach 30 Sekunden

### Auf iOS funktioniert die Installation nicht

- Verwende **Safari**, nicht Chrome
- iOS unterstützt PWAs nur in Safari
- Stelle sicher, dass JavaScript aktiviert ist

### App funktioniert offline nicht

- Öffne die App mindestens einmal mit Internet
- Der Service Worker muss sich zuerst registrieren
- Prüfe in den Entwickler-Tools: Application → Service Workers

### Icons werden nicht angezeigt

- Die Icons werden automatisch mit `generate_icons.py` erstellt
- Oder öffne `generate-icons.html` im Browser und generiere sie manuell
- Speichere `icon-192.png` und `icon-512.png` im Hauptordner

---

## Support

Bei Problemen:
1. Prüfe die Browser-Console (F12)
2. Stelle sicher, dass HTTPS aktiviert ist
3. Teste zuerst auf localhost
4. Verwende einen modernen Browser

---

## Was wurde installiert?

Wenn du die App installierst:
- Sie erscheint auf deinem Homescreen
- Sie läuft im Vollbild (ohne Browser-UI)
- Sie funktioniert offline (nach erstem Laden)
- Sie wird automatisch aktualisiert
- Du kannst sie wie jede andere App deinstallieren

**Viel Spaß mit deiner Wetter App!** ☀️🌤️⛈️
