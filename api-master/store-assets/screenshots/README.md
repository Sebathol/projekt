# Screenshot Guide - API Master

Dieser Guide beschreibt alle benötigten Screenshots für die verschiedenen Plattformen.

---

## Screenshot-Anforderungen nach Plattform

### 📱 Google Play Store

**Phone Screenshots** (min. 2, max. 8)
- **Auflösung**: 1080x1920 (Portrait) oder 1920x1080 (Landscape)
- **Format**: PNG oder JPG
- **Dateigröße**: Max. 8 MB pro Screenshot
- **Empfohlen**: 8 Screenshots für maximale Präsenz

**Tablet Screenshots** (optional)
- **Auflösung**: 1536x2048 (7-inch) oder 2048x2732 (10-inch)
- **Format**: PNG oder JPG

### 💻 Microsoft Store

**Desktop Screenshots** (min. 1, empfohlen: 4-10)
- **Auflösung**: 3840x2160 (4K) oder 1920x1080 (Full HD)
- **Format**: PNG (bevorzugt) oder JPG
- **Dateigröße**: Max. 50 MB pro Screenshot
- **Seitenverhältnis**: 16:9 empfohlen

### 🐙 GitHub Marketplace

**Product Screenshots** (min. 3, empfohlen: 5-8)
- **Auflösung**: Min. 1280x720, empfohlen 1920x1080
- **Format**: PNG (mit Transparenz möglich)
- **Dateigröße**: Keine strikte Grenze
- **Empfehlung**: Zeige Code-Beispiele, Dashboard, GitHub Actions

### 🍎 Mac App Store / 🤖 Chrome Web Store (später)

**Mac App Store:**
- 2880x1800 (Retina) oder 1280x800

**Chrome Web Store:**
- 1280x800 oder 640x400
- Max. 5 Screenshots

---

## 🎨 Screenshot-Liste

### 01_dashboard.png
**Titel**: "Alle APIs auf einen Blick"
**Zeigt**:
- Haupt-Dashboard mit API-Karten
- Statistik-Widgets (Requests heute, Kosten, Active APIs)
- Quick Actions (Add API, Generate Proxy, Switch Environment)
- Responsive Layout

**Plattformen**: Alle
**Auflösungen**:
- Phone: 1080x1920
- Desktop: 1920x1080
- GitHub: 1920x1080

**Mockup-Inhalt**:
```
Header: "API Master Dashboard"
Stats:
  - Total APIs: 12/20
  - Requests Today: 2,547
  - Monthly Cost: €45.23
  - Uptime: 99.9%

API Cards (Grid):
  1. OpenAI
     - Status: Active
     - Requests: 1,234
     - Cost: €15.50
  2. Stripe
     - Status: Active
     - Requests: 456
     - Cost: €8.20
  3. SendGrid
     - Status: Active
     - Requests: 789
     - Cost: €3.45
  (weitere...)
```

---

### 02_api_management.png
**Titel**: "API-Keys sicher verwalten"
**Zeigt**:
- Liste aller APIs
- Add API Button (prominent)
- Filter & Suche
- Environment-Toggle (Test/Production)
- Status-Badges

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Toolbar:
  - Search: "Suche APIs..."
  - Filter: [All] [Active] [Paused]
  - Add API Button

API List:
  OpenAI GPT-4
    Environment: Production
    Proxy Key: APM_abc123...
    Status: Active
    Last Used: 2 Min ago
    [View] [Edit] [Rotate]

  Stripe Payments
    Environment: Production
    Proxy Key: APM_def456...
    Status: Active
    Last Used: 15 Min ago
    [View] [Edit] [Rotate]

  (weitere 5-6 APIs...)
```

---

### 03_proxy_key.png
**Titel**: "Sichere Proxy-Keys generieren"
**Zeigt**:
- Proxy-Key-Dialog/Modal
- Original Key (verborgen/maskiert)
- Generierter Proxy Key (sichtbar)
- Copy-to-Clipboard Button
- Rotation-Button
- Environment-Selector

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Modal: "Proxy Key für OpenAI"

Original API Key:
  [••••••••••••••••••••] (Hidden)
  [Show]

Proxy Key (Production):
  APM_abc123def456ghi789jkl012mno345pqr678stu901
  [Copy] [Regenerate]

Environment:
  (•) Production  ( ) Test

Usage Example:
  # .env
  OPENAI_API_KEY=APM_abc123def456...

Security:
  ✓ AES-256-GCM Encrypted
  ✓ Rotatable without code changes
  ✓ Environment-specific

[Save] [Cancel]
```

---

### 04_analytics.png
**Titel**: "Echtzeit-Einblicke in API-Usage"
**Zeigt**:
- Graphs (Requests over Time)
- Cost Charts
- Performance Metrics
- Top APIs by Usage
- Recent Errors

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Analytics Dashboard

Zeitraum: [Last 7 Days] [Last 30 Days] [Custom]

Requests over Time (Line Chart):
  - 7-Tage-Graph mit Daily Requests
  - Peak: 3,456 (gestern)

Cost Breakdown (Pie Chart):
  - OpenAI: €15.50 (55%)
  - Stripe: €8.20 (29%)
  - SendGrid: €3.45 (12%)
  - Others: €1.08 (4%)

Performance Metrics:
  Avg Response Time: 245ms
  Success Rate: 99.2%
  Error Rate: 0.8%

Top APIs:
  1. OpenAI - 1,234 requests
  2. Stripe - 456 requests
  3. SendGrid - 789 requests
```

---

### 05_team_chat.png
**Titel**: "Team-Collaboration & Chat"
**Zeigt**:
- Chat-Interface
- Team-Mitglieder (Sidebar)
- File-Sharing
- Code-Snippet-Sharing
- Activity-Feed

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Team: "TechStartup Dev Team"

Members (Sidebar):
  👤 Sarah (You) - Admin
  👤 Michael - Member
  👤 Anna - Member
  👤 Thomas - Viewer

Chat:
  Sarah: Hey Team, rotated the OpenAI key
         [Key Rotated: OpenAI Production]
         10:23

  Michael: Thanks! Already updated in prod
           10:25

  Anna: 📎 code-snippet.js
        [Code: 15 lines]
        Check this API implementation
        10:30

Activity Feed:
  • Sarah rotated OpenAI key (5 min ago)
  • Michael added Stripe API (15 min ago)
  • Anna generated proxy key (1 hour ago)
```

---

### 06_environment_switch.png
**Titel**: "Test ↔ Production in Sekunden"
**Zeigt**:
- Environment-Switcher (prominent Toggle)
- API-Keys pro Environment
- Different Stats per Environment
- Quick Switch Action

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Environment Switcher

Current Environment: [Test] [Production]
                      ◯────────●

Test Environment:
  OpenAI: APM_test_abc123...
  Stripe: APM_test_def456...
  Requests Today: 45
  Cost: €0.00 (Test Mode)

Production Environment:
  OpenAI: APM_prod_xyz789...
  Stripe: APM_prod_uvw012...
  Requests Today: 2,547
  Cost: €45.23

Switch Benefits:
  ✓ No code changes required
  ✓ Instant activation
  ✓ Separate analytics
  ✓ Test safely before prod
```

---

### 07_security.png
**Titel**: "Militär-Grade Verschlüsselung"
**Zeigt**:
- Security-Dashboard
- Encryption-Status
- 2FA-Setup
- Security-Badges
- Audit-Log

**Plattformen**: Alle
**Mockup-Inhalt**:
```
Security Center

Encryption Status:
  ✓ AES-256-GCM Active
  ✓ All keys encrypted at rest
  ✓ TLS 1.3 for data in transit

Authentication:
  ✓ 2-Factor Authentication (Enabled)
  ✓ Biometric Login (Fingerprint)
  ✓ Session Timeout: 1 hour

Security Features:
  ✓ Rate Limiting Active
  ✓ DDoS Protection (Cloudflare)
  ✓ Automatic Key Rotation
  ✓ IP Whitelist (Optional)

Recent Security Events:
  • Successful login from Germany (2 min ago)
  • Key rotation: OpenAI (15 min ago)
  • 2FA verified (1 hour ago)

Security Score: 98/100 ✓
```

---

### 08_pricing.png
**Titel**: "Transparente Preise"
**Zeigt**:
- Pricing-Karten für alle 3 Pläne
- Feature-Comparison
- 14-Tage-Trial-Badge
- CTA-Buttons

**Plattformen**: Google Play, Microsoft Store
**Mockup-Inhalt**:
```
Pricing Plans

[Individual]          [Ultimate]          [Enterprise]
€19.99/Monat         €99.99/Monat        €299.99/Monat

20 APIs              50 APIs             100 APIs
Unlimited Keys       Unlimited Keys      Unlimited Keys
1 User               5 Users             10 Users
Basic Analytics      Advanced Analytics  Premium Analytics
Email Support        Priority Support    Dedicated Support

[Start Trial]        [Start Trial]       [Contact Sales]

14 Tage kostenlos testen!
Keine Kreditkarte erforderlich.
```

---

### 09_github_actions.png (nur für GitHub Marketplace)
**Titel**: "Seamless CI/CD Integration"
**Zeigt**:
- GitHub Actions YAML
- Workflow-Run
- API Master Integration
- Security Check Results

**Plattformen**: GitHub Marketplace
**Mockup-Inhalt**:
```yaml
# .github/workflows/deploy.yml
name: Deploy
on: [push]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup API Master
        uses: api-master/setup-action@v1
        with:
          api-master-token: ${{ secrets.API_MASTER_TOKEN }}

      - name: Deploy with Secure Keys
        env:
          OPENAI_API_KEY: ${{ secrets.APM_OPENAI_PROXY }}
        run: npm run deploy

Workflow Run:
  ✓ Setup API Master (2s)
  ✓ API Key Security Check (1s)
  ✓ Deploy with Secure Keys (45s)

Security Check Results:
  ✓ No API keys exposed in code
  ✓ All keys using proxy system
  ✓ Environment correctly set
```

---

### 10_mobile_dashboard.png (für Mobile)
**Titel**: "Manage APIs on the Go"
**Zeigt**:
- Mobile-optimiertes Dashboard
- Touch-friendly UI
- Quick Actions
- Notifications

**Plattformen**: Google Play (Phone)
**Mockup-Inhalt**: Wie 01_dashboard.png aber mobile-optimiert

---

## 🛠️ Screenshot-Erstellung

### Option 1: Echte App-Screenshots

Wenn die App läuft:
```bash
# Frontend starten
cd frontend
npm run dev

# Screenshots mit Browser-DevTools
# 1. F12 → Device Toolbar
# 2. Auflösung einstellen (1920x1080)
# 3. Screenshot (Ctrl+Shift+P → "Capture screenshot")
```

### Option 2: Mockups mit Figma/Canva

**Empfohlene Tools:**
- **Figma** (kostenlos): figma.com
- **Canva** (kostenlos): canva.com
- **Mockuuups** (€): mockuuups.studio

**Figma-Template**: Verfügbar unter
→ `api-master/design/figma-screenshots-template.fig`

### Option 3: Screenshot-Generator-Service

**Screely.com** (kostenlos):
- Upload Browser-Screenshot
- Wähle Device-Frame
- Download in korrekter Auflösung

**Placeit.net** ($):
- Professionelle App-Mockups
- Verschiedene Devices
- Branded Backgrounds

---

## 📐 Design-Guidelines

### Farben
- **Primary**: #0ea5e9 (Sky Blue)
- **Dark**: #0f172a (Slate)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Error**: #ef4444 (Red)

### Schriftarten
- **Headings**: Inter, SF Pro, System Font
- **Body**: Inter, SF Pro, System Font
- **Code**: JetBrains Mono, Fira Code

### Branding
- Logo in Ecke (optional)
- "API Master" Schriftzug sichtbar
- Konsistente Farben
- Modern & Clean Design

### Do's ✅
- Echte Daten verwenden (aber anonymisiert)
- Hohe Auflösung
- Gute Beleuchtung/Kontrast
- Features klar zeigen

### Don'ts ❌
- Lorem Ipsum Text
- Leere Screens
- Unleserliche Texte
- Inkonsistente Designs

---

## 📦 Datei-Organisation

```
api-master/store-assets/screenshots/
├── README.md (diese Datei)
├── raw/ (Original-Screenshots)
│   ├── 01_dashboard_raw.png
│   ├── 02_api_management_raw.png
│   └── ...
├── google-play/
│   ├── phone/
│   │   ├── 01_dashboard.png (1080x1920)
│   │   ├── 02_api_management.png
│   │   └── ...
│   └── tablet/
│       └── tablet_dashboard.png (1536x2048)
├── microsoft-store/
│   ├── 01_dashboard.png (1920x1080)
│   ├── 02_api_management.png
│   └── ...
├── github-marketplace/
│   ├── 01_dashboard.png (1920x1080)
│   ├── 09_github_actions.png
│   └── ...
└── templates/
    └── figma-screenshots-template.fig
```

---

## ✅ Checkliste

**Google Play Store:**
- [ ] 01_dashboard.png (1080x1920)
- [ ] 02_api_management.png (1080x1920)
- [ ] 03_proxy_key.png (1080x1920)
- [ ] 04_analytics.png (1080x1920)
- [ ] 05_team_chat.png (1080x1920)
- [ ] 06_environment_switch.png (1080x1920)
- [ ] 07_security.png (1080x1920)
- [ ] 08_pricing.png (1080x1920)

**Microsoft Store:**
- [ ] 01_dashboard.png (1920x1080)
- [ ] 02_api_management.png (1920x1080)
- [ ] 03_proxy_key.png (1920x1080)
- [ ] 04_analytics.png (1920x1080)
- [ ] 05_team_chat.png (1920x1080)
- [ ] 06_environment_switch.png (1920x1080)
- [ ] 07_security.png (1920x1080)
- [ ] 08_settings.png (1920x1080)

**GitHub Marketplace:**
- [ ] 01_dashboard.png (1920x1080)
- [ ] 03_proxy_key.png (1920x1080)
- [ ] 04_analytics.png (1920x1080)
- [ ] 05_team_chat.png (1920x1080)
- [ ] 09_github_actions.png (1920x1080)

---

## 🎬 Video/GIF (optional)

Einige Plattformen erlauben Videos:

**Google Play Store:**
- Max. 30 Sekunden
- Format: MP4, MOV
- Auflösung: Min. 1080p

**Script-Idee:**
```
0:00 - Problem: Exponierte API-Keys in Git
0:05 - Lösung: API Master Proxy-Keys
0:10 - Demo: API hinzufügen
0:15 - Demo: Proxy generieren & kopieren
0:20 - Demo: Environment Switching
0:25 - Call-to-Action: "14 Tage kostenlos testen!"
```

**Tool-Empfehlung:**
- **Loom** (kostenlos): Screen Recording
- **ScreenFlow** (Mac): Professional Editing
- **OBS Studio** (kostenlos): Advanced Recording

---

**Status**: GUIDE KOMPLETT ✅
**Nächster Schritt**: Screenshots mit Figma/echten App erstellen
**Kontakt**: aistormcreate.service@gmail.com
