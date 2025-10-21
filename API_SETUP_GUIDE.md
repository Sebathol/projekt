# Claude API Setup Guide
## Schnellstart für "Von der Idee zum Prototyp"

### ⚡ Schnellübersicht

**Kosten:** ~€0,01-0,05 pro Generierung (sehr günstig!)
**Zeit:** 5 Minuten Setup
**Schwierigkeit:** Einfach - Copy & Paste

---

## 🚀 Schritt-für-Schritt Anleitung

### Schritt 1: Anthropic Account erstellen

1. Gehe zu: [https://console.anthropic.com/](https://console.anthropic.com/)
2. Klicke auf **"Sign Up"**
3. Registriere dich mit:
   - Email-Adresse
   - Passwort
   - (oder nutze Google/GitHub Login)

### Schritt 2: API-Key generieren

1. Nach dem Login, gehe zu **"API Keys"** im Menü
2. Klicke auf **"Create Key"**
3. Gib einen Namen ein (z.B. "Idea-to-Prototype")
4. Kopiere den Key (beginnt mit `sk-ant-api03-...`)
5. ⚠️ **WICHTIG:** Speichere den Key sicher! Du siehst ihn nur einmal.

### Schritt 3: API-Key in Tool einsetzen

1. Öffne `index.html` in einem Code-Editor
2. Finde Zeile 21: `const API_KEY = 'DEIN_API_KEY_HIER';`
3. Ersetze `DEIN_API_KEY_HIER` mit deinem Key:
   ```javascript
   const API_KEY = 'sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxx';
   ```
4. Speichere die Datei
5. Fertig! 🎉

### Schritt 4: Credits aufladen (optional)

1. Gehe zu **"Billing"** in der Anthropic Console
2. Klicke auf **"Add Credits"**
3. Empfehlung für Start: **€5-10**
   - Reicht für 100-500 Generierungen!
4. Wähle Zahlungsmethode (Kreditkarte)

---

## 💰 Kosten-Übersicht

### Claude API Pricing (Stand 2025)

**Model: Claude Sonnet 4**
- Input: $0.003 per 1K tokens (~€0.0028)
- Output: $0.015 per 1K tokens (~€0.014)

**Typische Nutzung pro Generierung:**
- Ideengenerierung: ~2.000 tokens → **€0,01-0,02**
- PRD-Erstellung: ~3.000 tokens → **€0,02-0,04**
- Prototyp-Generierung: ~4.000 tokens → **€0,03-0,05**

### Rechenbeispiel

**€5 Credits:**
- 200-500 Ideengenerierungen
- 100-200 PRDs
- 100-150 Prototypen

**Oder:**
50 komplette Durchläufe (Idee → PRD → Prototyp) für nur €5!

---

## 🔒 Sicherheit

### API-Key schützen

**DO:**
- ✅ Key in einem Passwort-Manager speichern
- ✅ Nur in lokalen Dateien verwenden
- ✅ Regelmäßig neue Keys generieren
- ✅ Keys mit Permissions beschränken

**DON'T:**
- ❌ Key in Git committen
- ❌ Key in öffentlichen Repositories teilen
- ❌ Key per Email versenden
- ❌ Screenshot mit Key teilen

### Wenn dein Key kompromittiert wurde:

1. Sofort in Anthropic Console gehen
2. Alten Key **deaktivieren/löschen**
3. Neuen Key generieren
4. Neuen Key im Tool einsetzen

---

## 📊 Nutzung überwachen

### Credits checken:

1. Gehe zu [https://console.anthropic.com/](https://console.anthropic.com/)
2. Klicke auf **"Usage"**
3. Siehe:
   - Verbrauchte Credits
   - Kosten pro Tag
   - Top-verwendete Modelle

### Benachrichtigungen einrichten:

1. Gehe zu **"Settings" → "Notifications"**
2. Aktiviere:
   - Email bei niedrigem Guthaben
   - Email bei ungewöhnlicher Nutzung

---

## 🆘 Troubleshooting

### Problem: "Fehler: Bitte API-Key im Code eintragen!"

**Lösung:**
- Du hast den API-Key noch nicht ersetzt
- Öffne `index.html` und setze deinen Key in Zeile 21

### Problem: "API Error: 401"

**Lösung:**
- API-Key ist ungültig oder abgelaufen
- Generiere einen neuen Key in der Console
- Prüfe, ob du ihn korrekt kopiert hast (kein Leerzeichen am Anfang/Ende)

### Problem: "API Error: 429"

**Lösung:**
- Rate Limit erreicht (zu viele Anfragen)
- Warte 1 Minute und versuche es erneut
- Bei Anthropic: Upgrade zu höherem Tier

### Problem: "API Error: 402"

**Lösung:**
- Keine Credits mehr verfügbar
- Gehe zu Billing und lade Credits auf

### Problem: "API Error: 500"

**Lösung:**
- Anthropic Server-Problem (selten)
- Warte 5-10 Minuten und versuche erneut
- Check [status.anthropic.com](https://status.anthropic.com)

---

## 💡 Pro-Tipps

### Kosten sparen:

1. **Batch-Generierung:** Generiere mehrere Ideen auf einmal
2. **Wiederverwendung:** Speichere gute PRDs und passe sie an
3. **Chat effizient nutzen:** Stelle klare, präzise Fragen

### Bessere Ergebnisse:

1. **Spezifische Inputs:** Je detaillierter deine Idee, desto besser das Ergebnis
2. **Iterieren:** Nutze den Chat um Ideen zu verfeinern
3. **Feedback geben:** "Mach es technischer" oder "Vereinfache es"

---

## 📞 Support

**Bei Problemen mit:**

**API-Key Setup:**
- Anthropic Support: [support@anthropic.com](mailto:support@anthropic.com)
- Dokumentation: [docs.anthropic.com](https://docs.anthropic.com)

**Unserem Tool:**
- Email: [support@idea-to-prototype.app](mailto:support@idea-to-prototype.app)
- FAQ: [Zur FAQ-Seite](help.html)

---

## ✅ Checkliste

Vor dem ersten Start:

- [ ] Anthropic Account erstellt
- [ ] API-Key generiert
- [ ] API-Key in `index.html` eingesetzt
- [ ] Credits aufgeladen (mindestens €5)
- [ ] Tool im Browser getestet
- [ ] Erste Idee erfolgreich generiert

**Alles erledigt? Dann kann's losgehen! 🚀**

---

## 🎓 Weiterführende Ressourcen

**Anthropic Dokumentation:**
- [API Reference](https://docs.anthropic.com/claude/reference)
- [Rate Limits](https://docs.anthropic.com/claude/reference/rate-limits)
- [Best Practices](https://docs.anthropic.com/claude/docs/intro-to-claude)

**Video-Tutorials:**
- [YouTube: Claude API Setup](https://youtube.com) (Coming soon)
- [Wie nutze ich das Tool optimal](https://youtube.com) (Coming soon)

---

**Noch Fragen?** Schreib uns: support@idea-to-prototype.app
