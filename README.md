# Von der Idee zum Prototyp

Ein innovatives Tool, das dir hilft, von einer ersten Idee zu einem funktionsfähigen Prototypen zu gelangen - alles in einem einzigen Workflow!

## Features

### 🧠 Schritt 1: Ideen-Generator
- **Brainstorming Modus**: Generiere 5 innovative Geschäftsideen zu einem bestimmten Thema
- **Ideen-Funke Modus**: Erhalte 3 außergewöhnliche, kreative Ideen mit Überraschungseffekt
- **Interaktiver Chat**: Verfeinere deine Ideen mit bis zu 15 Iterationen durch AI-gestütztes Feedback
- Bewertung jeder Idee nach Priorität, Aufwand und Marktrelevanz

### 📝 Schritt 2: PRD-Ersteller
- Automatische Erstellung eines professionellen Product Requirements Document (PRD)
- Editierbare PRD-Vorlage
- Download als TXT oder MD

### 💻 Schritt 3: Prototyp-Generator
- Automatische Generierung eines funktionsfähigen HTML-Prototypen
- Live-Vorschau des Prototyps
- Modern und responsive
- Tailwind CSS mit Erdtönen (Amber, Orange, Stone)
- Download als standalone HTML-Datei

## Design

- **Farbschema**: Warme Erdtöne mit Orange-Akzenten (Amber, Orange, Stone)
- **Orangene Buttons**: Charakteristisches Design mit `from-amber-600 to-orange-600` Gradient
- **Responsive**: Funktioniert perfekt auf Desktop und Mobile
- **Modern**: Sauberes, professionelles UI mit Tailwind CSS

## Verwendung

1. Öffne `index.html` in deinem Browser
2. Füge deinen Claude API-Key in Zeile 21 ein (ersetze `DEIN_API_KEY_HIER`)
3. Wähle einen Modus:
   - **Brainstorming**: Gib ein Thema ein und generiere Ideen
   - **Ideen-Funke**: Lass dich von Zufalls-Inspirationen überraschen
4. Verfeinere deine Ideen im Chat (optional)
5. Wähle eine Idee aus und erstelle ein PRD
6. Generiere einen funktionsfähigen HTML-Prototypen

## Technische Details

- **Framework**: React 18 (über CDN)
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **AI**: Claude API (Anthropic)
- **Sprachen**: Deutsch und Englisch

## API-Key Setup

⚠️ **Wichtig**: Du benötigst einen Claude API-Key von Anthropic.

1. Besuche https://console.anthropic.com/
2. Erstelle einen Account und generiere einen API-Key
3. Füge den Key in `index.html` Zeile 21 ein:
   ```javascript
   const API_KEY = 'sk-ant-api03-...';
   ```

## Hinweis zur Sicherheit

⚠️ Der API-Key ist direkt im Code eingebettet und für **Test- und Entwicklungszwecke** gedacht. Für Produktivumgebungen sollte der Key über ein Backend verwaltet werden.

## Features im Detail

### Iterativer Chat
- Verfeinere deine Ideen durch Konversation mit der AI
- Bis zu 15 Iterationen pro Session
- Die AI merkt sich den gesamten Gesprächsverlauf
- Automatische Aktualisierung der Ideen basierend auf dem Feedback

### Multi-Language Support
- Vollständige Unterstützung für Deutsch und Englisch
- Umschalten mit einem Klick
- Alle UI-Elemente und AI-Prompts werden übersetzt

### Download-Funktionen
- Ideen als JSON exportieren
- PRD als TXT oder Markdown speichern
- Prototyp als vollständige, standalone HTML-Datei

## Lizenz

Dieses Projekt ist für den persönlichen und kommerziellen Gebrauch frei verfügbar.

---

**Von der Idee zum Prototyp** - Dein Werkzeug für schnelle Innovation! 🚀
