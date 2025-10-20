# 🔧 Setup-Tool Anleitung

## Schnellstart (5 Minuten)

### Schritt 1: Setup-Tool öffnen

1. Öffne `setup-tool.html` in deinem Browser
2. Du siehst den Login-Bildschirm

### Schritt 2: Einloggen

**Passwort:** `JoHanna268219$`

- Gib das Passwort ein
- Klicke "Zugang freischalten"
- ✅ Du bist jetzt im Setup-Tool!

### Schritt 3: API-Key holen

**Empfohlen: WeatherAPI.com**

1. Gehe zu https://www.weatherapi.com/signup.aspx
2. Registriere dich (kostenlos, 2 Minuten)
3. Bestätige deine E-Mail
4. Login → Dashboard
5. Kopiere deinen API-Key

**Der Key sieht so aus:** `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Schritt 4: API-Key im Tool speichern

Im Setup-Tool:

1. Tab **"🔑 API-Keys verwalten"** ist bereits offen
2. Wähle **"WeatherAPI.com"** aus dem Dropdown
3. Gib eine Bezeichnung ein: z.B. **"Production"**
4. Füge deinen API-Key ein
5. Klicke **"💾 API-Key speichern"**

✅ Dein API-Key ist jetzt gespeichert!

### Schritt 5: Code generieren

1. Wechsle zum Tab **"📝 Code generieren"**
2. Wähle deinen gespeicherten API-Key aus
3. Klicke **"🔨 Code generieren"**
4. Der Code wird angezeigt
5. Klicke **"📋 Code kopieren"**

### Schritt 6: Code in App einfügen

1. Öffne `script.js` in deinem Code-Editor
2. Suche nach der Zeile mit `const API_KEY` (ca. Zeile 5-10)
3. Ersetze den gesamten Abschnitt bis einschließlich der `fetchWeatherAPI` Funktion
4. Füge den kopierten Code ein
5. Speichere die Datei

### Schritt 7: Testen!

1. Öffne `index.html` im Browser
2. Gib eine Stadt ein (z.B. "Berlin")
3. Klicke "Suchen"
4. ✅ Wetterdaten sollten angezeigt werden!

---

## Erweiterte Nutzung

### Mehrere API-Keys verwalten

Du kannst verschiedene API-Keys für verschiedene Zwecke speichern:

**Beispiele:**
- "Production" - Für die Live-App
- "Development" - Für lokale Tests
- "Backup" - Alternative API als Fallback

**So geht's:**
1. Tab "API-Keys verwalten"
2. Mehrmals API-Keys mit unterschiedlichen Bezeichnungen speichern
3. Beim Code-Generieren den gewünschten Key auswählen

### Zwischen APIs wechseln

Um von einer API zur anderen zu wechseln:

1. Tab "Code generieren"
2. Wähle einen anderen gespeicherten Key
3. Neuen Code generieren
4. In `script.js` einfügen
5. ✅ Fertig!

### API-Key löschen

1. Tab "API-Keys verwalten"
2. Bei dem entsprechenden Key auf **"🗑️ Löschen"** klicken
3. Bestätigen

### Vollständigen API-Key anzeigen

Aus Sicherheitsgründen werden gespeicherte Keys maskiert (z.B. `a1b2•••••••n4o5`).

Um den vollständigen Key zu sehen:
1. Tab "API-Keys verwalten"
2. Bei dem entsprechenden Key auf **"👁️ Key anzeigen"** klicken
3. ⚠️ Niemals öffentlich teilen!

---

## Unterstützte APIs

### 1. WeatherAPI.com (Empfohlen)

**Warum empfohlen?**
- ✅ 1 Million API-Calls pro Monat (kostenlos!)
- ✅ Perfekt für kleinen bis mittleren Traffic
- ✅ Einfache Registrierung
- ✅ Gute Dokumentation
- ✅ Zuverlässig

**Registrierung:**
https://www.weatherapi.com/signup.aspx

**API-Key holen:**
Dashboard → API Key

**Kosten:**
- Free: 1M calls/Monat (€0)
- Pro: 10M calls/Monat ($35/Monat)

### 2. OpenWeatherMap

**Features:**
- 1.000 API-Calls pro Tag (kostenlos)
- Sehr populär
- Viele Tutorials verfügbar

**Registrierung:**
https://openweathermap.org/api

**Kosten:**
- Free: 1K calls/Tag (€0)
- Startup: $40/Monat

### 3. Visual Crossing

**Features:**
- 1.000 Records pro Tag (kostenlos)
- Historische Daten
- 15-Tage-Vorhersage

**Registrierung:**
https://www.visualcrossing.com/

**Kosten:**
- Free: 1K records/Tag (€0)
- Paid: Ab $9/Monat

### 4. Open-Meteo

**Features:**
- ✅ Kein API-Key nötig!
- ✅ 10.000 Calls pro Tag (kostenlos)
- ✅ 100% Open Source
- ✅ GDPR-konform

**Registrierung:**
Keine! Einfach nutzen.

**Website:**
https://open-meteo.com/

**Kosten:**
- Free: 10K calls/Tag (€0)
- Commercial: €0,004 per 1K calls

### 5. Custom API

Falls du deine eigene Wetter-API hast:

1. Wähle "Eigener Anbieter"
2. Gib API-URL ein
3. Gib API-Key ein (falls erforderlich)
4. ⚠️ Code muss manuell angepasst werden!

---

## Sicherheitshinweise

### ⚠️ WICHTIG - API-Keys schützen!

**Niemals:**
- ❌ API-Keys in öffentlichen Git-Repositories committen
- ❌ API-Keys in Screenshots teilen
- ❌ API-Keys in E-Mails verschicken
- ❌ API-Keys auf öffentlichen Websites anzeigen

**Best Practices:**
- ✅ Separate Keys für Development/Production
- ✅ Keys regelmäßig rotieren
- ✅ Nutzung überwachen (API-Dashboard)
- ✅ Rate-Limits setzen
- ✅ Bei verdächtiger Aktivität: Key sofort löschen

### Backend vs Frontend

**Current Setup (Frontend):**
- API-Key direkt im JavaScript-Code
- ⚠️ Sichtbar für jeden, der die Seite ansieht
- ✅ OK für kleine Projekte mit Free-Tier
- ⚠️ Risiko: Jemand könnte deinen Key missbrauchen

**Production Setup (Backend - Empfohlen):**
- API-Key auf Server gespeichert
- Frontend ruft eigenen Server auf
- Server ruft Wetter-API auf
- ✅ API-Key bleibt geheim
- ✅ Mehr Kontrolle

**Für Production:**
Siehe `DEVELOPER_GUIDE.md` → Backend-Setup

### Passwort-Schutz

Das Setup-Tool ist mit einem Passwort geschützt.

**Passwort:** `JoHanna268219$`

**⚠️ Hinweis:**
- Passwort nur an autorisierte Entwickler weitergeben
- Bei Bedarf Passwort ändern (in `setup-tool.js`)
- Setup-Tool nicht öffentlich deployen!

---

## Troubleshooting

### "Falsches Passwort"

**Problem:** Login funktioniert nicht

**Lösung:**
1. Überprüfe, dass du exakt `JoHanna268219$` eingibst
2. Achte auf Groß-/Kleinschreibung
3. Keine Leerzeichen am Anfang/Ende

### "Stadt nicht gefunden"

**Problem:** Nach Code-Generierung funktioniert Suche nicht

**Lösung:**
1. Überprüfe, ob API-Key korrekt ist
2. Teste API-Key im Browser: `https://api.weatherapi.com/v1/current.json?key=DEIN_KEY&q=Berlin`
3. Prüfe Browser-Console auf Fehler (F12)
4. Stelle sicher, dass `USE_DEMO_API = false` gesetzt ist

### "Code funktioniert nicht"

**Problem:** Nach Einfügen des Codes gibt es Fehler

**Lösung:**
1. Stelle sicher, dass du den GESAMTEN Abschnitt ersetzt hast
2. Prüfe auf Syntax-Fehler (fehlende Klammern, etc.)
3. Lade die Seite neu (Strg+F5)
4. Prüfe Browser-Console (F12)

### "API-Key zeigt Fehler"

**Problem:** API-Key wird als ungültig erkannt

**Lösung:**
1. Überprüfe API-Key auf der Anbieter-Website
2. Stelle sicher, dass der Account aktiviert ist (E-Mail bestätigt)
3. Warte ein paar Minuten (Aktivierung kann dauern)
4. Erstelle einen neuen API-Key

---

## FAQ

### Q: Brauche ich für jede API ein separates Konto?

**A:** Ja, für WeatherAPI.com, OpenWeatherMap, etc. musst du dich jeweils separat registrieren. Nur Open-Meteo benötigt keine Registrierung.

### Q: Kann ich mehrere APIs gleichzeitig nutzen?

**A:** Du kannst mehrere API-Keys speichern, aber die App nutzt immer nur einen zur Zeit. Um zu wechseln, generiere einfach neuen Code mit einem anderen Key.

### Q: Wie viele API-Keys kann ich speichern?

**A:** Unbegrenzt! Das Setup-Tool speichert sie in deinem Browser (LocalStorage).

### Q: Gehen meine gespeicherten Keys verloren?

**A:** Die Keys werden lokal im Browser gespeichert. Wenn du den Browser-Cache löschst, gehen sie verloren. Daher am besten auch extern notieren!

### Q: Kann ich das Setup-Tool online nutzen?

**A:** Ja, aber **NICHT EMPFOHLEN** auf öffentlichen Servern! Nur auf localhost oder privaten Servern verwenden.

### Q: Wie ändere ich das Passwort?

**A:** Öffne `setup-tool.js`, suche nach `password: 'JoHanna268219$'` und ändere es dort.

### Q: Funktioniert das Setup-Tool ohne Internet?

**A:** Ja, zum Verwalten und Code-Generieren brauchst du kein Internet. Nur zum Testen der API-Keys.

---

## Nächste Schritte

Nach erfolgreicher API-Konfiguration:

1. **Teste ausgiebig** - Verschiedene Städte probieren
2. **Deploy** - App auf Netlify/Vercel hochladen
3. **Monitoring** - API-Nutzung im Dashboard überwachen
4. **Backup** - Zweiten API-Key als Backup einrichten
5. **Production** - Für Launch: Backend-Setup erwägen

Siehe auch:
- `DEVELOPER_GUIDE.md` - Deployment & Production
- `API_DOCUMENTATION.md` - Detaillierte API-Infos
- `STORE_REQUIREMENTS.md` - Store-Veröffentlichung

---

**Viel Erfolg! 🚀**

Bei Fragen: Siehe `help.html` oder `DEVELOPER_GUIDE.md`
