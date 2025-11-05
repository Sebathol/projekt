# Google Play Store - Asset Anforderungen

## App-Icon (Erforderlich)

### Hochauflösendes Symbol
- **Format:** PNG (32-bit)
- **Größe:** 512 x 512 px
- **Hintergrund:** Transparent oder vollständig gefüllt
- **Dateiname:** `icon-512.png`

**Design-Vorgaben:**
- Klares, einfaches Design
- Gut erkennbar auch in kleinen Größen
- API-Symbol (Zahnräder, Schlüssel, oder Netzwerk)
- Farben: Blau (#3b82f6), Dunkelblau (#0f172a), Weiß
- Kein Text im Icon

### Adaptive Icon
- **Format:** PNG (32-bit)
- **Größe:** 512 x 512 px
- **Safe Zone:** 108 x 108 px (Zentrum)
- **Dateien:**
  - `adaptive-icon-foreground.png` - Vordergrund
  - `adaptive-icon-background.png` - Hintergrund

---

## Feature Graphic (Erforderlich)

- **Format:** PNG oder JPG
- **Größe:** 1024 x 500 px
- **Dateiname:** `feature-graphic.png`

**Inhalt:**
- App-Logo links
- Slogan: "Professionelles API Management"
- Dashboard-Preview rechts
- Gradient-Hintergrund (Dunkelblau → Blau)
- Claude Logo (klein, als Feature)

---

## Screenshots (Mindestens 2, empfohlen 8)

### Phone Screenshots
- **Format:** PNG oder JPG
- **Mindestseite:** 320 px
- **Maximalseite:** 3840 px
- **Anzahl:** 2-8 Screenshots

**Screenshot-Liste:**

1. **Dashboard** (`screenshot-1-dashboard.png`)
   - Übersicht mit Stats, Charts
   - API-Nutzung letzte 7 Tage
   - Compliance-Status
   - Schnellzugriff-Buttons

2. **API Keys** (`screenshot-2-api-keys.png`)
   - Liste mit API Keys
   - OpenAI, Anthropic, Google Cards
   - Proxy-Key sichtbar
   - Status-Badges (Aktiv)

3. **Claude Chat** (`screenshot-3-chat.png`)
   - Chat-Interface mit Claude
   - Nachrichtenverlauf
   - Schnellaktionen
   - Code-Snippet Beispiel

4. **Compliance** (`screenshot-4-compliance.png`)
   - Kleinunternehmer Status
   - €18,500 / €22,000 Progress Bar
   - Wichtige Hinweise
   - "Mit Claude analysieren" Button

5. **Einstellungen** (`screenshot-5-settings.png`)
   - Sicherheit-Sektion
   - Biometrische Auth Toggle
   - Abo-Plan anzeigen
   - Support-Optionen

6. **Login** (`screenshot-6-login.png`)
   - Clean Login Screen
   - API Master Logo
   - E-Mail & Passwort Felder
   - Demo-Credentials Info

7. **Werbelinks** (`screenshot-7-apps.png`)
   - "Unsere Apps" Übersicht
   - Weather App, Task Manager Cards
   - Schöne Grafiken
   - CTA Buttons

8. **Analytics** (`screenshot-8-analytics.png`)
   - Detaillierte Charts
   - API-Nutzung pro Provider
   - Kosten-Breakdown
   - Export-Optionen

---

## Promo Video (Optional, aber empfohlen)

- **Format:** MP4, WebM oder MOV
- **Dauer:** 30 Sekunden - 2 Minuten
- **Größe:** Max 100 MB
- **Auflösung:** 1920x1080 (Full HD)

**Video-Struktur:**
1. [0-5s] Logo Animation
2. [5-15s] Dashboard Tour
3. [15-25s] Claude Chat Demo
4. [25-35s] Key Features Highlights
5. [35-40s] Compliance Features
6. [40-45s] Pricing & CTA

---

## Tablet Screenshots (Optional)

### 7-inch Tablet
- **Min:** 600 x 900 px
- **Max:** 3840 px

### 10-inch Tablet
- **Min:** 768 x 1024 px
- **Max:** 3840 px

---

## Wear OS Screenshots (Nicht relevant für diese App)
_Überspringe Wear OS für API Master_

---

## Android TV (Optional - Zukunft)
_Kann später hinzugefügt werden_

---

## Design-Richtlinien

### Farbschema:
- **Primär:** #3b82f6 (Blau)
- **Sekundär:** #10b981 (Grün)
- **Hintergrund:** #0f172a (Dunkelblau)
- **Text:** #ffffff (Weiß)
- **Sekundärtext:** #94a3b8 (Grau)

### Schriftarten:
- **Überschriften:** System Bold (San Francisco / Roboto)
- **Body:** System Regular
- **Code:** Monospace

### Icons:
- Material Community Icons
- 24px Standard-Größe
- Konsistente Farbgebung

---

## Erstellen der Assets

### Mit Figma/Photoshop:
1. Canvas: 1920 x 1080 px (für Screenshots)
2. Simuliere App auf schwarzem Hintergrund
3. Füge Device Frame hinzu (optional)
4. Export als PNG (2x Auflösung)

### Mit React Native / Expo:
```bash
# Screenshots erstellen
npm install -g react-native-screenshot

# Im Simulator:
# iOS: Cmd + S
# Android: Volume Down + Power
```

### Mit Online Tools:
- **Figma:** figma.com
- **Canva:** canva.com
- **Photopea:** photopea.com (kostenlos)

---

## Checklist vor Upload

- [ ] Icon 512x512 px (PNG)
- [ ] Adaptive Icon Foreground + Background
- [ ] Feature Graphic 1024x500 px
- [ ] Mindestens 2 Phone Screenshots
- [ ] Alle Texte auf Deutsch
- [ ] Screenshots ohne persönliche Daten
- [ ] Korrekte Farben und Branding
- [ ] Dateinamen korrekt benannt
- [ ] Alle Dateien unter 1 MB (außer Video)

---

## Tools & Ressourcen

**Design:**
- Figma (kostenlos): figma.com
- Adobe Express: express.adobe.com
- Canva Pro: canva.com

**Screenshot Tools:**
- Android Studio Emulator
- Expo Go App auf physischem Gerät
- Genymotion (Android Emulator)

**Icon Generatoren:**
- Expo Icon Generator: docs.expo.dev
- Android Asset Studio: romannurik.github.io/AndroidAssetStudio
- App Icon Generator: appicon.co

**Mock-ups:**
- Screely: screely.com
- Mockuphone: mockuphone.com
- Device Shots: deviceshots.com

---

## Nächste Schritte

1. ✅ Assets Requirements dokumentieren
2. ⏳ Icon designen (512x512)
3. ⏳ Feature Graphic erstellen
4. ⏳ 8 Screenshots erstellen
5. ⏳ Store Listing Text finalisieren
6. ⏳ App in Google Play Console hochladen
