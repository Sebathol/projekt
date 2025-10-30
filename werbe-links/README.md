# Werbe-Links System

Dieser Ordner enthält alle Werbe-Links, die im Programm angezeigt werden.

## 🎯 Wie funktioniert es?

1. **Kopiere eine JSON-Datei** in diesen Ordner
2. **Fertig!** Die Werbung wird automatisch im Programm angezeigt

## 📝 Format für Werbe-Links

Jede Werbe-Link-Datei ist eine JSON-Datei mit folgendem Format:

```json
{
  "id": "mein-programm-1",
  "title": "Mein anderes Programm",
  "description": "Kurze Beschreibung (max. 100 Zeichen)",
  "url": "https://mein-programm.de",
  "image": "/werbe-links/bilder/mein-programm-logo.png",
  "priority": 1,
  "active": true,
  "target": "_blank"
}
```

### Felder erklärt:

| Feld | Beschreibung | Pflicht |
|------|-------------|---------|
| `id` | Eindeutige ID für diesen Werbe-Link | ✅ Ja |
| `title` | Titel der Werbung (z.B. Programmname) | ✅ Ja |
| `description` | Kurzbeschreibung (max. 100 Zeichen) | ✅ Ja |
| `url` | Link zur Website/App | ✅ Ja |
| `image` | Pfad zum Logo/Bild (optional) | ❌ Nein |
| `priority` | Anzeigereihenfolge (1 = höchste Priorität) | ❌ Nein (default: 10) |
| `active` | Aktiv/Inaktiv | ❌ Nein (default: true) |
| `target` | `_blank` (neues Fenster) oder `_self` | ❌ Nein (default: `_blank`) |

## 🖼️ Bilder für Werbe-Links

- Lege Bilder im Unterordner `werbe-links/bilder/` ab
- Empfohlene Größe: **300x100px** oder **600x200px** (3:1 Format)
- Formate: PNG, JPG, SVG, WebP

## 📊 Anzeigelimit

- **Standard**: Bis zu 10 Werbe-Links werden angezeigt
- Sortierung nach `priority` (1 = zuerst)
- Inaktive Links (`"active": false`) werden nicht angezeigt

## 💡 Beispiele

### Beispiel 1: Link zu eigenem Programm

**Datei**: `werbe-links/meine-app.json`

```json
{
  "id": "meine-app-1",
  "title": "Meine coole App",
  "description": "Die beste App für XYZ - jetzt kostenlos testen!",
  "url": "https://meine-app.de",
  "image": "/werbe-links/bilder/meine-app-logo.png",
  "priority": 1,
  "active": true
}
```

### Beispiel 2: Link ohne Bild (nur Text)

**Datei**: `werbe-links/text-werbung.json`

```json
{
  "id": "text-ad-1",
  "title": "Noch ein Programm",
  "description": "Probier auch dieses Tool aus!",
  "url": "https://anderes-tool.de",
  "priority": 5,
  "active": true
}
```

### Beispiel 3: Affiliate-Link

**Datei**: `werbe-links/affiliate-partner.json`

```json
{
  "id": "affiliate-1",
  "title": "Partner-Produkt",
  "description": "Premium-Tool für Profis - 20% Rabatt mit Code XYZ",
  "url": "https://partner.de?ref=meine-id",
  "image": "/werbe-links/bilder/partner-banner.jpg",
  "priority": 3,
  "active": true
}
```

## 🔧 Werbe-Link hinzufügen

### Schritt 1: JSON-Datei erstellen

Erstelle eine neue `.json` Datei in diesem Ordner:

```bash
# Linux/Mac/WSL
nano werbe-links/neuer-link.json

# Windows
notepad werbe-links\neuer-link.json
```

### Schritt 2: JSON-Inhalt einfügen

```json
{
  "id": "mein-neuer-link",
  "title": "Titel hier",
  "description": "Beschreibung hier",
  "url": "https://meine-website.de",
  "priority": 1,
  "active": true
}
```

### Schritt 3: Speichern - Fertig!

Die Werbung erscheint automatisch im Programm nach dem nächsten Neustart.

## 🎨 Wo werden die Links angezeigt?

Die Werbe-Links werden an folgenden Stellen angezeigt:

1. **Sidebar** (rechts oder links) - Hauptplatzierung
2. **Footer** (unten auf jeder Seite) - Zusätzliche Sichtbarkeit
3. **Dashboard** (nach erfolgreicher Anmeldung) - Optional

## ⚙️ Konfiguration

Du kannst die Anzahl der angezeigten Links in der Datei `config/werbe-links-config.json` anpassen:

```json
{
  "maxLinks": 10,
  "displayLocations": ["sidebar", "footer"],
  "refreshInterval": 3600000
}
```

## 🚀 Schnellstart: 10 Werbeplätze einrichten

Kopiere einfach diese Template-Dateien und fülle sie aus:

```bash
# Kopiere das Template 10x
for i in {1..10}; do
  cp werbe-links/beispiel-template.json werbe-links/werbeplatz-$i.json
done
```

Dann bearbeite jede `werbeplatz-1.json` bis `werbeplatz-10.json` Datei.

## 📌 Wichtige Hinweise

- ✅ **Beliebig viele Links**: Es gibt keine technische Obergrenze
- ✅ **Live-Update**: Neue Links erscheinen automatisch (kein Code-Update nötig)
- ✅ **JSON-Format**: Muss gültiges JSON sein (prüfe mit https://jsonlint.com)
- ⚠️ **Dateinamen**: Keine Leerzeichen, nur `a-z`, `0-9`, `-`, `_`
- ⚠️ **UTF-8 Encoding**: Dateien müssen UTF-8 kodiert sein

## 🐛 Troubleshooting

### Werbe-Link wird nicht angezeigt?

1. **JSON-Format prüfen**: Ist die Datei gültiges JSON?
2. **`active` Feld**: Ist `"active": true` gesetzt?
3. **Dateiendung**: Endet die Datei auf `.json`?
4. **Server-Neustart**: Backend neu starten
5. **Browser-Cache**: Strg+F5 zum Neuladen

### Wie viele Links werden angezeigt?

Maximal werden so viele Links angezeigt, wie in `config/werbe-links-config.json` unter `maxLinks` konfiguriert (Standard: 10).

### Kann ich externe Werbedienste einbinden?

Ja! Setze einfach die externe URL im `url` Feld:

```json
{
  "id": "external-ad",
  "title": "Externe Werbung",
  "description": "...",
  "url": "https://external-ad-service.com/track?id=12345"
}
```

## 📞 Support

Bei Fragen oder Problemen siehe `ADVERTISING_INTEGRATION_BACKUP.md` für weitere Werbe-Optionen.
