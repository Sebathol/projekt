# Google Play Store Setup für API Master

## Übersicht
Diese Anleitung hilft dir, API Master als Trusted Web Activity (TWA) im Google Play Store zu veröffentlichen.

## Voraussetzungen

### 1. Domain und Hosting
- ✅ **Domain:** Du brauchst eine eigene Domain (z.B. api-master.deinedomain.com)
- ✅ **HTTPS:** Deine Webseite MUSS über HTTPS laufen
- ✅ **Hosting:** Webserver mit den PWA-Dateien

### 2. Google Play Console
- 📱 **Account:** Registriere dich bei [Google Play Console](https://play.google.com/console)
- 💰 **Kosten:** Einmalige Gebühr von $25 USD
- ⏱️ **Verifizierung:** Kann 1-2 Tage dauern

### 3. Development Tools
- ☕ **Java JDK:** Version 11 oder höher
- 🤖 **Android Studio:** Oder Android SDK Command Line Tools
- 📦 **Bubblewrap:** TWA Build Tool von Google

## Schritt-für-Schritt Anleitung

### Schritt 1: PWA online stellen

1. **Dateien hochladen:**
   ```bash
   # Lade folgende Dateien auf deinen Webserver hoch:
   - api-master.html
   - api-master.css
   - api-master.js
   - manifest-api-master.json
   - api-master-sw.js
   - api-master-icon-*.png (alle Icons)
   - assetlinks.json (in /.well-known/assetlinks.json)
   ```

2. **HTTPS prüfen:**
   - Öffne https://deinedomain.com/api-master.html im Browser
   - Stelle sicher, dass das Schloss-Symbol (HTTPS) angezeigt wird

3. **PWA testen:**
   - Öffne Chrome DevTools (F12)
   - Gehe zu "Application" → "Manifest"
   - Prüfe, ob alle Icons geladen werden
   - Gehe zu "Service Workers" und prüfe, ob der SW aktiv ist

### Schritt 2: Bubblewrap installieren

```bash
# Node.js installieren (falls noch nicht vorhanden)
# Besuche: https://nodejs.org/

# Bubblewrap CLI installieren
npm install -g @bubblewrap/cli

# Überprüfen
bubblewrap --version
```

### Schritt 3: TWA-Projekt initialisieren

```bash
# Erstelle ein neues TWA-Projekt
bubblewrap init --manifest=https://deinedomain.com/manifest-api-master.json

# Folge den Prompts:
# - Domain: deinedomain.com
# - Package Name: com.aistormcreate.apimaster
# - App Name: API Master
# - Start URL: /api-master.html
```

### Schritt 4: Android Keystore erstellen

```bash
# Erstelle einen Signing Key
keytool -genkey -v -keystore android.keystore -alias api-master-key \
  -keyalg RSA -keysize 2048 -validity 10000

# Du wirst nach folgenden Informationen gefragt:
# - Passwort (WICHTIG: Gut aufbewahren!)
# - Name, Organisation, Stadt, etc.

# SHA256 Fingerprint extrahieren
keytool -list -v -keystore android.keystore -alias api-master-key

# Kopiere den SHA256 Fingerprint in assetlinks.json
```

### Schritt 5: assetlinks.json aktualisieren

1. Öffne `assetlinks.json`
2. Ersetze `REPLACE_WITH_YOUR_SHA256_FINGERPRINT_FROM_KEYSTORE` mit deinem SHA256
3. Lade die Datei nach `.well-known/assetlinks.json` auf deinem Webserver hoch

**Wichtig:** Die URL muss sein:
```
https://deinedomain.com/.well-known/assetlinks.json
```

### Schritt 6: App builden

```bash
# Build APK für Testing
bubblewrap build

# Build App Bundle für Play Store
bubblewrap build --appBundle

# Die Dateien findest du in:
# - app-release-signed.apk (zum Testen)
# - app-release-bundle.aab (für Play Store)
```

### Schritt 7: Auf Gerät testen

```bash
# APK auf verbundenem Android-Gerät installieren
adb install app-release-signed.apk

# Oder: APK per E-Mail/Link auf Gerät übertragen und installieren
```

### Schritt 8: Im Play Store veröffentlichen

1. **Play Console öffnen:**
   - Gehe zu [Google Play Console](https://play.google.com/console)
   - Klicke "Neue App erstellen"

2. **App-Details:**
   - **App-Name:** API Master
   - **Standard-Sprache:** Deutsch (de-DE)
   - **App/Spiel:** App
   - **Kostenlos/Kostenpflichtig:** Deine Wahl

3. **App Bundle hochladen:**
   - Gehe zu "Releases" → "Production"
   - Klicke "Create new release"
   - Lade `app-release-bundle.aab` hoch

4. **Store Listing ausfüllen:**

   **Titel:** API Master - API Key Manager

   **Kurzbeschreibung:**
   ```
   Verwalte alle deine API-Keys sicher an einem Ort. Lokal. Sicher. Werbefrei.
   ```

   **Vollständige Beschreibung:**
   ```
   🔐 API Master - Der sichere API-Key Manager

   Verwalte alle deine API-Keys organisiert an einem Ort!

   ✨ FEATURES:
   • Unbegrenzt API-Keys speichern
   • Kategorisierung (AI, Payment, Wetter, etc.)
   • Sichere lokale Speicherung
   • Export/Import Funktion
   • Schnelle Suche und Filter
   • Komplett werbefrei
   • Keine Cloud, keine Server

   🔒 SICHERHEIT:
   Alle API-Keys werden ausschließlich lokal auf deinem Gerät gespeichert.
   Keine Übertragung an externe Server. Deine Daten bleiben bei dir.

   💡 PERFEKT FÜR:
   • Entwickler
   • API-User
   • DevOps Engineers
   • Tech-Enthusiasten

   📱 EINFACH ZU NUTZEN:
   Intuitive Oberfläche, die jeder versteht. Keys hinzufügen, bearbeiten,
   kopieren - alles mit einem Tap.

   🌟 KEINE ABOS:
   Einmalige Zahlung, alle Features, für immer.
   ```

   **App-Symbol:** `api-master-icon-512.png`

   **Screenshots:** Erstelle Screenshots der App (mind. 2):
   - 1280 x 720 px (Landscape)
   - 720 x 1280 px (Portrait)

5. **Inhaltseinstufung:**
   - Fragebogen ausfüllen
   - Für API Master: Wahrscheinlich "Jeder" (Everyone)

6. **Zielgruppe:**
   - Zielgruppe: Erwachsene/Entwickler
   - Alterseinstufung: 13+ oder höher

7. **Datenschutzerklärung:**
   - URL zu deiner Privacy Policy angeben
   - Beispiel: https://deinedomain.com/privacy-policy.html

8. **App-Zugriff:**
   - Standardzugriff (App erfordert keine besonderen Berechtigungen)

9. **Zur Überprüfung einreichen:**
   - Prüfe alle Angaben
   - Klicke "Zur Überprüfung senden"
   - ⏱️ Überprüfung dauert 1-7 Tage

## Wichtige Konfigurationsdateien

### twa-manifest.json
```json
{
  "packageId": "com.aistormcreate.apimaster",
  "host": "deinedomain.com",
  "name": "API Master",
  "startUrl": "/api-master.html"
}
```

### assetlinks.json
Muss unter `https://deinedomain.com/.well-known/assetlinks.json` erreichbar sein!

## Häufige Probleme

### ❌ "Unable to verify Digital Asset Links"
**Lösung:**
- Prüfe, ob assetlinks.json über HTTPS erreichbar ist
- Teste mit: https://deinedomain.com/.well-known/assetlinks.json
- SHA256 Fingerprint korrekt?
- Package Name identisch in assetlinks.json und TWA?

### ❌ "App nicht installierbar"
**Lösung:**
- Android 6.0 (API 23) oder höher erforderlich
- "Aus unbekannten Quellen" aktivieren (für APK)
- APK signiert?

### ❌ "Service Worker funktioniert nicht"
**Lösung:**
- HTTPS aktiv?
- Scope in manifest korrekt?
- Cache-Namen eindeutig?

## Checkliste vor Veröffentlichung

- [ ] PWA läuft stabil auf HTTPS
- [ ] Alle Icons generiert (72px bis 512px)
- [ ] Service Worker funktioniert
- [ ] assetlinks.json hochgeladen und erreichbar
- [ ] Keystore sicher gespeichert (Backup!)
- [ ] Screenshots erstellt
- [ ] Privacy Policy online
- [ ] AGB online (optional)
- [ ] App getestet auf mehreren Geräten
- [ ] Beschreibung in Deutsch und Englisch

## Nützliche Links

- 📚 [Google Play Console](https://play.google.com/console)
- 🔧 [Bubblewrap Docs](https://github.com/GoogleChromeLabs/bubblewrap)
- 📱 [TWA Quick Start Guide](https://developer.chrome.com/docs/android/trusted-web-activity/)
- 🔍 [Asset Links Testing Tool](https://developers.google.com/digital-asset-links/tools/generator)
- 💡 [PWA Checklist](https://web.dev/pwa-checklist/)

## Support

Bei Fragen oder Problemen:
- Prüfe die [Bubblewrap Issues](https://github.com/GoogleChromeLabs/bubblewrap/issues)
- Lies die [Play Console Hilfe](https://support.google.com/googleplay/android-developer/)

## Kosten Übersicht

| Position | Kosten | Hinweise |
|----------|--------|----------|
| Google Play Developer Account | $25 USD | Einmalig |
| Domain (optional) | ~10€/Jahr | Wenn noch keine vorhanden |
| Hosting (optional) | 0-5€/Monat | Viele kostenlose Optionen |
| **Gesamt** | **~$25-50** | **Zum Start** |

---

**Viel Erfolg bei der Veröffentlichung! 🚀**
