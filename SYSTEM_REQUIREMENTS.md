# System-Anforderungen - Simple Weather App

## Unterstützte Geräte

### ✅ Smartphones
- Android 5.0 (Lollipop) oder höher
- iPhone (iOS 12.0 oder höher)
- Alle modernen Android-Smartphones

### ✅ Tablets
- Android-Tablets (Android 5.0+)
- iPad (iOS 12.0+)

### ✅ Desktop/Laptop
- Windows 7 oder höher
- macOS 10.10 oder höher
- Linux (alle aktuellen Distributionen)
- Chrome OS

## Browser-Anforderungen

### Empfohlene Browser:
- ✅ Chrome 60+
- ✅ Safari 12+
- ✅ Firefox 55+
- ✅ Edge 79+
- ✅ Opera 47+

### Mindestanforderungen:
- Browser muss JavaScript unterstützen
- Browser muss Service Worker unterstützen (für Offline-Modus)
- HTTPS-Unterstützung

## Internetverbindung

**Für den Betrieb:**
- Internetverbindung erforderlich zum Abruf aktueller Wetterdaten
- Mindestgeschwindigkeit: 2G/EDGE (sehr langsam aber funktional)
- Empfohlen: 3G/LTE/WiFi

**Offline-Modus:**
- ✅ Funktioniert ohne Internet (zeigt zuletzt geladene Daten)
- Cache-Dauer: 15 Minuten

## Speicherplatz

**Benötigter Speicher:**
- App: ~500 KB
- Cache: ~50 KB
- **Gesamt: < 1 MB**

**Vergleich zu anderen Wetter-Apps:**
- Andere Apps: 50-200 MB
- Simple Weather App: < 1 MB
- ✅ 50-200x kleiner!

## Betriebssystem-Versionen

### Android
```
Minimum: Android 5.0 (Lollipop, 2014)
Empfohlen: Android 8.0+ (Oreo, 2017)
Getestet: Android 14
```

### iOS/iPadOS
```
Minimum: iOS 12.0 (2018)
Empfohlen: iOS 15.0+
Getestet: iOS 17
```

### Windows
```
Minimum: Windows 7
Empfohlen: Windows 10/11
Browser: Edge, Chrome, Firefox
```

### macOS
```
Minimum: macOS 10.10 (Yosemite)
Empfohlen: macOS 12+ (Monterey)
Browser: Safari 12+, Chrome
```

### Linux
```
Alle aktuellen Distributionen
Browser: Chrome, Firefox
```

## Berechtigungen

**Benötigte Berechtigungen: KEINE!**

- ❌ Kein Standortzugriff
- ❌ Keine Kontakte
- ❌ Keine Fotos
- ❌ Keine Kamera
- ❌ Kein Mikrofon
- ❌ Kein Kalender
- ✅ Nur Internet (zum Abrufen der Wetterdaten)

## Leistungsanforderungen

**CPU:**
- Jeder Prozessor der letzten 10 Jahre
- Keine besonderen Anforderungen

**RAM:**
- Minimum: 512 MB (gesamt auf dem Gerät)
- Empfohlen: 1 GB+
- App-Verbrauch: ~20-50 MB

**Akku-Verbrauch:**
- Sehr gering (~0,1% pro Nutzung)
- Kein Hintergrund-Dienst
- Keine Push-Benachrichtigungen

## Netzwerk-Traffic

**Pro Nutzung:**
- Wetterabfrage: ~5-10 KB
- Bilder/Icons: 0 KB (keine!)
- **Gesamt: ~10 KB pro Abfrage**

**Vergleich:**
- Andere Wetter-Apps: 1-5 MB pro Nutzung (wegen Werbung!)
- Simple Weather App: ~10 KB
- ✅ 100-500x weniger Datenverbrauch!

## Kompatibilitätsliste

### ✅ Getestet und funktioniert:

**Smartphones:**
- Samsung Galaxy (S8 und neuer)
- Google Pixel (alle Modelle)
- OnePlus (alle Modelle ab 2017)
- Xiaomi (alle Modelle mit Android 5.0+)
- iPhone (6 und neuer)
- Huawei (alle Modelle)

**Tablets:**
- iPad (5. Generation und neuer)
- iPad Air (alle Modelle)
- iPad Pro (alle Modelle)
- Samsung Galaxy Tab (alle Modelle ab 2016)
- Amazon Fire Tablet (7. Gen+)

**Desktop:**
- Alle Windows-PCs (7+)
- Alle Macs (10.10+)
- Linux-PCs (Ubuntu, Fedora, Debian, etc.)
- Chromebooks

### ❌ NICHT unterstützt:

- Internet Explorer (alle Versionen)
- Windows XP/Vista
- Android 4.4 oder älter
- iOS 11 oder älter
- Sehr alte Browser (Chrome < 60, Firefox < 55)

## PWA-Installation

### Anforderungen für Installation als App:

**Android:**
- Chrome 58+ oder Edge 79+
- HTTPS-Verbindung
- Service Worker-Support

**iOS:**
- Safari 12.2+ (iOS 12.2+)
- "Zum Home-Bildschirm" Feature

**Desktop:**
- Chrome 73+ oder Edge 79+
- Windows 10+ oder macOS 10.10+

## Häufige Fragen

**Q: Läuft die App auf meinem alten Smartphone?**
A: Wenn es Android 5.0+ oder iOS 12.0+ hat - ja!

**Q: Brauche ich viel Speicherplatz?**
A: Nein, nur ~1 MB. Du kannst die App auch bei vollem Speicher nutzen.

**Q: Funktioniert die App ohne Internet?**
A: Ja, im Offline-Modus zeigt sie die zuletzt geladenen Daten.

**Q: Verbraucht die App viel Akku?**
A: Nein, sehr wenig. Kein Hintergrund-Dienst, keine Akku-Belastung.

**Q: Wie viele Daten verbraucht die App?**
A: Nur ~10 KB pro Wetterabfrage. Perfekt für begrenztes Datenvolumen!

---

**Letzte Aktualisierung:** 2025-10-20
**Version:** 1.0
