# 📖 API Master - Bedienungsanleitung

## Inhaltsverzeichnis

1. [Erste Schritte](#erste-schritte)
2. [Dashboard-Übersicht](#dashboard-übersicht)
3. [API-Keys verwalten](#api-keys-verwalten)
4. [Proxy-Keys verwenden](#proxy-keys-verwenden)
5. [Environment-Switching](#environment-switching)
6. [Team-Funktionen](#team-funktionen)
7. [Subscription verwalten](#subscription-verwalten)
8. [Tipps & Best Practices](#tipps--best-practices)
9. [Fehlerbehebung](#fehlerbehebung)
10. [FAQ](#faq)

---

## 🚀 Erste Schritte

### Registrierung

1. **Öffnen Sie API Master**
   - Web: https://app.apimaster.com
   - Desktop: Starten Sie die API Master-Anwendung
   - Mobile: Öffnen Sie die API Master-App

2. **Klicken Sie auf "Registrieren"**

3. **Füllen Sie das Formular aus:**
   - Vorname
   - Nachname
   - E-Mail-Adresse
   - Firma (optional)
   - Passwort (mindestens 8 Zeichen)
   - Passwort bestätigen

4. **Akzeptieren Sie die Nutzungsbedingungen**

5. **Klicken Sie auf "Account erstellen"**

6. **Bestätigen Sie Ihre E-Mail** (Link wird an Ihre E-Mail gesendet)

### Anmeldung

1. Geben Sie Ihre E-Mail-Adresse ein
2. Geben Sie Ihr Passwort ein
3. (Optional) Aktivieren Sie "Angemeldet bleiben"
4. Klicken Sie auf "Anmelden"

---

## 📊 Dashboard-Übersicht

Nach der Anmeldung sehen Sie Ihr Dashboard mit:

### Statistiken (oben)

- **Total APIs**: Anzahl aller verwalteten APIs
- **Active APIs**: Anzahl aktiver APIs
- **Total Requests**: Gesamtzahl aller API-Anfragen
- **Requests Today**: Anfragen des heutigen Tages

### Schnellaktionen

- **Add New API**: Neuen API-Key hinzufügen
- **Invite Team Member**: Teammitglied einladen (Ultimate/Enterprise)
- **Upgrade Plan**: Plan aktualisieren

### Letzte API-Keys

Übersicht Ihrer zuletzt hinzugefügten API-Keys mit:
- API-Name und Provider
- Requests des heutigen Tages
- Aktuelles Environment (Test/Production)
- Status (Active/Inactive)

---

## 🔑 API-Keys verwalten

### Neuen API-Key hinzufügen

1. **Navigieren Sie zu "API Keys"** im Menü

2. **Klicken Sie auf "+ Add API Key"**

3. **Füllen Sie das Formular aus:**

   **Pflichtfelder:**
   - **API Name**: Name Ihrer API (z.B. "OpenAI API")
   - **API Provider**: Anbieter (z.B. "OpenAI")
   - **Original API Key (Production)**: Ihr echter API-Key
     - ⚠️ Wird verschlüsselt gespeichert
     - 🔒 Nie wieder direkt sichtbar

   **Optional:**
   - **Test API Key**: API-Key für Testumgebung
   - **API Endpoint**: Basis-URL (z.B. "https://api.openai.com/v1")
   - **API Version**: Version (z.B. "v1")
   - **Tags**: Schlagwörter zur Organisation (z.B. "ai, gpt, chatbot")
   - **Notes**: Notizen für Ihre Referenz

4. **Klicken Sie auf "Create API Key"**

5. **Kopieren Sie Ihren Proxy-Key** 🎉
   - Dieser wird anstelle Ihres Original-Keys verwendet
   - Format: `APM_[48-stellige Zeichenfolge]`
   - Speichern Sie ihn sicher

### API-Key-Details anzeigen

Klicken Sie auf einen API-Key, um zu sehen:
- Proxy-Key (kopierbar)
- Aktuelles Environment
- Nutzungsstatistiken
- Rate Limits
- Letzte Verwendung

### API-Key bearbeiten

1. Klicken Sie auf den API-Key
2. Bearbeiten Sie Tags oder Notizen
3. Speichern Sie Änderungen

### API-Key löschen

1. Klicken Sie auf den API-Key
2. Klicken Sie auf "Delete"
3. Bestätigen Sie die Löschung

⚠️ **Wichtig**: Gelöschte Keys können nicht wiederhergestellt werden!

---

## 🔐 Proxy-Keys verwenden

### Was sind Proxy-Keys?

Proxy-Keys sind sichere Stellvertreter-Keys, die Sie anstelle Ihrer echten API-Keys in Ihrem Code verwenden.

**Vorteile:**
- ✅ Original-Key bleibt geheim
- ✅ Einfach rotierbar ohne Code-Änderung
- ✅ Zentrale Verwaltung
- ✅ Nutzungsüberwachung

### In Ihrem Code verwenden

#### JavaScript/Node.js

**Vorher (unsicher):**
```javascript
const apiKey = 'sk-1234567890abcdef'; // Original-Key exponiert!

fetch('https://api.openai.com/v1/chat', {
  headers: {
    'Authorization': `Bearer ${apiKey}`
  }
});
```

**Nachher (sicher mit API Master):**
```javascript
const proxyKey = 'APM_abc123...'; // Proxy-Key

fetch('https://apimaster.com/api/proxy/APM_abc123.../chat', {
  headers: {
    'Authorization': `Bearer ${proxyKey}`
  }
});
```

#### Python

```python
import requests

proxy_key = "APM_abc123..."  # Ihr Proxy-Key

response = requests.post(
    f"https://apimaster.com/api/proxy/{proxy_key}/chat",
    headers={"Authorization": f"Bearer {proxy_key}"},
    json={"message": "Hello"}
)
```

#### cURL

```bash
curl -X POST https://apimaster.com/api/proxy/APM_abc123.../chat \
  -H "Authorization: Bearer APM_abc123..." \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

### Proxy-Key rotieren

Wenn Ihr Proxy-Key kompromittiert wurde:

1. Öffnen Sie den API-Key
2. Klicken Sie auf "Rotate Key"
3. Bestätigen Sie die Rotation
4. Kopieren Sie den neuen Proxy-Key
5. Aktualisieren Sie Ihren Code (nur den Proxy-Key!)

✅ **Ihr Original-Key bleibt unverändert!**

---

## 🔄 Environment-Switching

### Test vs. Production

API Master ermöglicht sofortiges Umschalten zwischen Test- und Produktionsumgebung.

**Use Cases:**
- 🧪 Entwicklung: Test-API verwenden
- 🚀 Deployment: Zu Production wechseln
- 🐛 Debugging: Zurück zu Test wechseln

### Environment wechseln

1. Öffnen Sie Ihren API-Key
2. Klicken Sie auf "Switch to Production" oder "Switch to Test"
3. Fertig! ✅

**Das war's!** Keine Code-Änderung nötig.

### Beispiel-Workflow

**Entwicklung:**
```javascript
// Ihr Code bleibt gleich
const proxyKey = "APM_abc123...";
// API Master verwendet automatisch Test-Key
```

**Vor Deployment:**
1. Gehen Sie zu API Master
2. Klicken Sie auf "Switch to Production"
3. Deployen Sie ohne Code-Änderung

**Nach Deployment:**
```javascript
// Exakt derselbe Code
const proxyKey = "APM_abc123...";
// API Master verwendet jetzt Production-Key
```

---

## 👥 Team-Funktionen

*Verfügbar in Ultimate und Enterprise Plänen*

### Team erstellen

1. Navigieren Sie zu "Teams"
2. Klicken Sie auf "Create Team"
3. Geben Sie einen Team-Namen ein
4. (Optional) Beschreibung hinzufügen
5. Klicken Sie auf "Create"

### Teammitglieder einladen

1. Öffnen Sie Ihr Team
2. Klicken Sie auf "Invite Member"
3. Geben Sie die E-Mail-Adresse ein
4. Klicken Sie auf "Send Invitation"
5. Das Mitglied erhält eine Einladungs-E-Mail

### Team-Chat verwenden

1. Öffnen Sie Ihr Team
2. Klicken Sie auf "Chat"
3. Schreiben Sie Ihre Nachricht
4. Drücken Sie Enter zum Senden

**Features:**
- 💬 Echtzeit-Messaging
- 📁 Dateianhänge
- 📝 Code-Sharing
- 🔔 Benachrichtigungen

### Dateien teilen

1. Öffnen Sie den Team-Chat
2. Klicken Sie auf das Büroklammer-Symbol
3. Wählen Sie eine Datei (max. 10 MB)
4. Klicken Sie auf "Upload"

**Unterstützte Formate:**
- Bilder: PNG, JPG, GIF
- Dokumente: PDF, DOCX, XLSX
- Code: JS, PY, JSON, etc.

### Berechtigungen verwalten

**Rollen:**
- **Owner**: Vollzugriff
- **Admin**: Kann Mitglieder verwalten
- **Member**: Standard-Zugriff
- **Viewer**: Nur Ansicht

**Berechtigungen ändern:**
1. Öffnen Sie Ihr Team
2. Klicken Sie auf ein Mitglied
3. Wählen Sie neue Rolle
4. Speichern

### Mitglied entfernen

1. Öffnen Sie Ihr Team
2. Klicken Sie auf das Mitglied
3. Klicken Sie auf "Remove"
4. Bestätigen Sie

---

## 💳 Subscription verwalten

### Aktuellen Plan anzeigen

1. Navigieren Sie zu "Subscription"
2. Sehen Sie Ihre Plan-Details:
   - Aktueller Plan
   - Nächste Abrechnung
   - Inkludierte Features

### Plan upgraden

1. Klicken Sie auf "Upgrade Plan"
2. Wählen Sie einen neuen Plan:
   - **Ultimate**: €99.99/Monat
   - **Enterprise**: €299.99/Monat
3. Wählen Sie Abrechnungszyklus:
   - Monatlich
   - Jährlich (spare Geld!)
4. Geben Sie Zahlungsdetails ein
5. Bestätigen Sie

### Plan ändern

Sie können jederzeit upgraden. Beim Upgrade:
- ✅ Sofortiger Zugriff auf neue Features
- ✅ Anteilige Abrechnung
- ✅ Keine Downtime

### Subscription kündigen

1. Gehen Sie zu "Subscription"
2. Klicken Sie auf "Cancel Subscription"
3. Wählen Sie einen Grund (optional)
4. Bestätigen Sie

**Was passiert:**
- Zugriff bis zum Ende des Abrechnungszeitraums
- Keine weitere Abrechnung
- Daten bleiben 30 Tage gespeichert

---

## 💡 Tipps & Best Practices

### Sicherheit

✅ **DO:**
- Verwenden Sie starke, einzigartige Passwörter
- Aktivieren Sie 2FA (wenn verfügbar)
- Teilen Sie Proxy-Keys sicher
- Rotieren Sie Keys regelmäßig
- Überprüfen Sie Zugriffsrechte

❌ **DON'T:**
- Teilen Sie niemals Original-API-Keys
- Committen Sie keine Keys in Git
- Verwenden Sie keine schwachen Passwörter
- Geben Sie Keys an Dritte weiter

### Organisation

**Tags verwenden:**
Organisieren Sie APIs mit Tags:
```
Tags: "ai, openai, production"
Tags: "payment, stripe, critical"
Tags: "email, sendgrid, notifications"
```

**Notizen hinzufügen:**
Dokumentieren Sie wichtige Infos:
```
Notes: "Production key for main app
Rate limit: 3000 req/min
Contact: john@company.com"
```

**Naming-Conventions:**
Verwenden Sie konsistente Namen:
```
Good: "OpenAI GPT-4 API - Production"
Good: "Stripe Payment API - Main Account"
Bad: "api1", "key2", "test"
```

### Performance

**Rate Limits beachten:**
- Überprüfen Sie Ihre Limits
- Überwachen Sie die Nutzung
- Planen Sie Kapazität

**Caching nutzen:**
- Cachen Sie API-Antworten wo möglich
- Reduzieren Sie unnötige Requests
- Nutzen Sie Batch-Requests

### Monitoring

**Regelmäßig überprüfen:**
- Tägliche Request-Zahlen
- Fehlerquoten
- Rate-Limit-Auslastung
- Kosten-Entwicklung

**Alerts einrichten:**
- Hohe Nutzung
- Rate-Limit erreicht
- Ungewöhnliche Aktivität

---

## 🔧 Fehlerbehebung

### Login funktioniert nicht

**Problem**: "Invalid credentials" Fehler

**Lösung:**
1. Überprüfen Sie E-Mail und Passwort
2. Versuchen Sie "Passwort vergessen"
3. Löschen Sie Browser-Cache
4. Versuchen Sie Inkognito-Modus

### Proxy-Key funktioniert nicht

**Problem**: 401 Unauthorized Fehler

**Lösung:**
1. Überprüfen Sie, ob Key aktiv ist
2. Prüfen Sie, ob Rate-Limit erreicht
3. Verifizieren Sie die Proxy-URL
4. Kontaktieren Sie Support

### API-Anfragen schlagen fehl

**Problem**: 500 Internal Server Error

**Lösung:**
1. Überprüfen Sie Original-API-Status
2. Prüfen Sie API-Endpoint
3. Verifizieren Sie Request-Format
4. Schauen Sie in die Logs

### Team-Chat lädt nicht

**Problem**: Chat-Nachrichten erscheinen nicht

**Lösung:**
1. Aktualisieren Sie die Seite
2. Überprüfen Sie Internetverbindung
3. Löschen Sie Browser-Cache
4. Versuchen Sie anderen Browser

### Zahlungsprobleme

**Problem**: Kreditkarte wird abgelehnt

**Lösung:**
1. Überprüfen Sie Kartendaten
2. Prüfen Sie Guthaben/Limit
3. Kontaktieren Sie Ihre Bank
4. Versuchen Sie alternative Zahlungsmethode

---

## ❓ FAQ

### Allgemein

**Q: Was ist API Master?**
A: API Master ist ein Tool zur sicheren Verwaltung von API-Keys. Es erstellt Proxy-Keys, die Sie in Ihrem Code verwenden, während Ihre echten Keys sicher verschlüsselt bleiben.

**Q: Ist API Master sicher?**
A: Ja! Wir verwenden AES-256-GCM-Verschlüsselung (Militär-Standard), HTTPS, und folgen Best Practices der Branche.

**Q: Welche APIs werden unterstützt?**
A: Alle! API Master funktioniert mit jeder REST-API, die API-Keys verwendet.

**Q: Funktioniert es mit [Specific API]?**
A: Ja, API Master ist API-agnostisch und funktioniert mit OpenAI, Stripe, SendGrid, AWS, Google Cloud, und tausenden anderen.

### Technisch

**Q: Wie funktionieren Proxy-Keys?**
A: Proxy-Keys sind eindeutige Identifikatoren. Wenn Sie einen Request mit einem Proxy-Key senden, ersetzt API Master ihn automatisch mit Ihrem Original-Key.

**Q: Gibt es Latenz?**
A: Minimal! Durchschnittlich <50ms zusätzliche Latenz durch unsere optimierte Infrastruktur.

**Q: Kann ich mehrere Environments haben?**
A: Ja! Sie können Test- und Production-Keys für jede API hinterlegen und zwischen ihnen umschalten.

**Q: Was passiert, wenn API Master down ist?**
A: Wir garantieren 99.9% Uptime. Im unwahrscheinlichen Fall eines Ausfalls können Sie temporär auf Original-Keys zurückgreifen.

### Billing

**Q: Gibt es eine kostenlose Testversion?**
A: Ja! 14 Tage kostenlos, keine Kreditkarte erforderlich.

**Q: Kann ich jederzeit kündigen?**
A: Ja, jederzeit. Keine Kündigungsfrist.

**Q: Was passiert, wenn ich künde?**
A: Ihre Daten bleiben 30 Tage verfügbar. Danach werden sie gelöscht.

**Q: Gibt es Rabatte?**
A: Ja! Jährliche Zahlung spart 15-20%. Studenten erhalten 50% Rabatt.

### Features

**Q: Wie viele APIs kann ich verwalten?**
A:
- Individual: 20 APIs
- Ultimate: 50 APIs
- Enterprise: 100 APIs

**Q: Wie viele Requests kann ich machen?**
A: Unbegrenzt! Wir limitieren nicht die Anzahl der Requests.

**Q: Gibt es ein Team-Feature?**
A: Ja, in Ultimate (5 Mitglieder) und Enterprise (10 Mitglieder) Plänen.

**Q: Gibt es eine API?**
A: Ja! Eine Developer-API ist in Entwicklung.

### Support

**Q: Wie kontaktiere ich den Support?**
A:
- Email: support@apimaster.com
- Discord: [Invite Link]
- Docs: docs.apimaster.com

**Q: Wie schnell ist der Support?**
A:
- Individual: 24-48h
- Ultimate: 12-24h
- Enterprise: <4h (priority)

**Q: Gibt es Tutorials?**
A: Ja! Video-Tutorials, Dokumentation und Blog-Posts auf unserer Website.

---

## 📞 Weitere Hilfe benötigt?

### Ressourcen

- 📚 **Dokumentation**: [docs.apimaster.com](https://docs.apimaster.com)
- 🎥 **Video-Tutorials**: [youtube.com/apimaster](https://youtube.com/apimaster)
- 💬 **Community**: [discord.gg/apimaster](https://discord.gg/apimaster)
- 📧 **Support**: support@apimaster.com

### Quick Links

- [GitHub](https://github.com/apimaster)
- [Twitter](https://twitter.com/apimasterapp)
- [LinkedIn](https://linkedin.com/company/apimaster)
- [Blog](https://blog.apimaster.com)

---

**Viel Erfolg mit API Master!** 🚀

Wir sind hier, um Ihr API-Management einfacher, sicherer und effizienter zu machen.

*Haben Sie Verbesserungsvorschläge für diese Anleitung? Senden Sie uns Feedback an docs@apimaster.com*
