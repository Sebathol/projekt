# Werbelinks für API Master

## 📢 Werbung für Ihre eigenen Apps

Dieser Ordner enthält Werbelinks für Cross-Promotion Ihrer eigenen Apps/Produkte.

## So fügen Sie einen neuen Werbelink hinzu:

### Methode 1: Einfach JSON-Datei kopieren

1. Erstellen Sie eine neue JSON-Datei: `link-X.json` (X = nächste freie Nummer)
2. Kopieren Sie diese Vorlage:

```json
{
  "id": 1,
  "active": true,
  "title": "Meine tolle App",
  "description": "Kurze Beschreibung was die App macht",
  "image": "https://example.com/banner.png",
  "link": "https://example.com/meine-app",
  "buttonText": "Jetzt testen",
  "position": "sidebar",
  "priority": 1,
  "languages": {
    "de": {
      "title": "Meine tolle App",
      "description": "Kurze Beschreibung was die App macht",
      "buttonText": "Jetzt testen"
    },
    "en": {
      "title": "My awesome app",
      "description": "Short description what the app does",
      "buttonText": "Try now"
    },
    "pl": {
      "title": "Moja wspaniała aplikacja",
      "description": "Krótki opis co robi aplikacja",
      "buttonText": "Wypróbuj teraz"
    },
    "fr": {
      "title": "Mon application géniale",
      "description": "Courte description de ce que fait l'application",
      "buttonText": "Essayer maintenant"
    }
  }
}
```

3. Passen Sie die Werte an
4. Speichern Sie die Datei im `werbe-links/` Ordner
5. **Fertig!** Der Link erscheint automatisch in der App

### Methode 2: Über Admin-Interface

1. Öffnen Sie die App
2. Gehen Sie zu **Einstellungen** → **Werbelinks**
3. Klicken Sie auf **+ Neuer Werbelink**
4. Füllen Sie das Formular aus
5. Klicken Sie auf **Speichern**

## Positionen

Wo soll der Werbelink angezeigt werden?

- **`sidebar`** - Rechte Sidebar (empfohlen für Hauptwerbung)
- **`dashboard-top`** - Oben im Dashboard (auffällig)
- **`footer`** - Im Footer (dezent)
- **`banner`** - Banner ganz oben (sehr auffällig)
- **`modal`** - Als Popup beim App-Start (max. 1x pro Tag)

## Priorität

Niedrigere Zahlen = höhere Priorität

- `1` = Ganz oben / Zuerst angezeigt
- `2` = Zweiter Platz
- `3` = Dritter Platz
- ...
- `10` = Ganz unten

## Aktiv/Inaktiv

- `"active": true` → Link wird angezeigt ✅
- `"active": false` → Link ist versteckt ❌

## Empfohlene Bildgrößen

- **Sidebar**: 300x150px (2:1)
- **Dashboard-Top**: 800x200px (4:1)
- **Banner**: 1200x200px (6:1)
- **Modal**: 600x400px (3:2)

Format: PNG oder JPG

## Mehrsprachigkeit

Fügen Sie Übersetzungen im `languages`-Objekt hinzu:

```json
"languages": {
  "de": { "title": "...", "description": "...", "buttonText": "..." },
  "en": { ... },
  "pl": { ... },
  "fr": { ... }
}
```

Falls keine Übersetzung vorhanden, wird der Standard-Text verwendet.

## Beispiel: Wetter-App bewerben

**werbe-links/link-1.json:**
```json
{
  "id": 1,
  "active": true,
  "title": "Simple Weather App",
  "description": "Professionelle Wetter-Vorhersage für Ihre Region",
  "image": "https://example.com/weather-banner.png",
  "link": "https://simple-weather-app.vercel.app",
  "buttonText": "Kostenlos testen",
  "position": "sidebar",
  "priority": 1,
  "languages": {
    "de": {
      "title": "Simple Weather App",
      "description": "Professionelle Wetter-Vorhersage für Ihre Region",
      "buttonText": "Kostenlos testen"
    },
    "en": {
      "title": "Simple Weather App",
      "description": "Professional weather forecast for your region",
      "buttonText": "Try for free"
    }
  }
}
```

## Maximale Anzahl

Sie können so viele Werbelinks haben, wie Sie möchten!

Empfohlen:
- **Sidebar**: 3-5 Links
- **Dashboard**: 2-3 Links
- **Footer**: 5-10 Links

## Analytics (Optional)

Klicks auf Werbelinks werden automatisch getrackt.

Sehen Sie Statistiken unter: **Einstellungen** → **Werbelinks** → **Statistiken**

## Tipps für effektive Werbung

✅ **Aussagekräftiger Titel** (max. 50 Zeichen)
✅ **Klare Beschreibung** (max. 100 Zeichen)
✅ **Hochwertige Bilder** (professionell, ansprechend)
✅ **Klarer Call-to-Action** ("Jetzt testen", "Mehr erfahren")
✅ **Relevanz** (Bewerben Sie Apps, die zur Zielgruppe passen)

❌ Zu viel Text
❌ Unscharfe Bilder
❌ Zu viele Links auf einmal

---

**Entwickelt für Ai Storm Create**
Sebastian Beyer | aistormcreate.service@gmail.com
